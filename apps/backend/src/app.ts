import express from 'express';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import argon2 from 'argon2';
import { z } from 'zod';
import { CATALOG, searchCatalog, type CatalogDomain } from '@stardew/game-data';
import { db } from './db.js';
import { config } from './config.js';
import { attachUser, createSession, hashToken, rateLimit, requireAuth, sameOrigin } from './auth.js';
import { importLegacy } from './legacy.js';
import { safeAnswerQuestion, safeDailyPlan } from './ai.js';
import { enrichGoal, findGoalProject, resolveGoalInput } from './goals.js';
import { importRouter } from './imports.js';
import { summarizeProgress } from './progress-summary.js';

export const app = express();
if (config.trustProxy) app.set('trust proxy', 1);
app.use(helmet({ contentSecurityPolicy: false }));
app.use('/api/imports', express.json({ limit: '4mb' }));
app.use(express.json({ limit: '64kb' }));
app.use(cookieParser());
app.use(attachUser);
app.use('/api', sameOrigin);
app.use('/api/imports', importRouter);

const now = () => new Date().toISOString();
const credentials = z.object({ username: z.string().min(3).max(32).regex(/^[\w.-]+$/), password: z.string().min(10).max(128), displayName: z.string().min(1).max(40) });
const domains = ['museum','shipping','cooking','crafting','fish','relationships','animals','skills','stardrops','monster-goals','walnuts','perfection','bundles','farmer','achievements','powers','notes','scraps','rarecrows','island-upgrades','raccoon','calendar-weather','unlocks','projects','spoilers'] as const;
const progressDomain = z.enum(domains);
const progressScope = z.enum(['shared', 'player']);
const progressValue = z.record(z.unknown()).superRefine((value, context) => {
  if (JSON.stringify(value).length > 64_000) context.addIssue({ code: z.ZodIssueCode.custom, message: 'Progress value is too large' });
});
const progressInput = z.object({ scope: progressScope, domain: progressDomain, itemId: z.string().min(1).max(160), value: progressValue }).strict();
const upsertProgress = db.prepare('INSERT INTO progress(farm_id,user_id,scope,domain,item_id,value_json,updated_at) VALUES(?,?,?,?,?,?,?) ON CONFLICT DO UPDATE SET value_json=excluded.value_json,updated_at=excluded.updated_at');
const publicFarm = (farmId: number) => db.prepare('SELECT f.id,f.name,s.season,s.year,s.day,s.version,s.updated_at updatedAt FROM farms f JOIN farm_state s ON s.farm_id=f.id WHERE f.id=?').get(farmId);
const membersForFarm = (farmId: number) => db.prepare('SELECT u.id,u.display_name displayName,fm.role FROM farm_members fm JOIN users u ON u.id=fm.user_id WHERE fm.farm_id=? ORDER BY fm.role DESC,u.display_name').all(farmId);
const memberSettings = (farmId: number, userId: number) => {
  const row = db.prepare('SELECT reveal_late_game revealLateGame FROM farm_member_settings WHERE farm_id=? AND user_id=?').get(farmId, userId) as { revealLateGame: number } | undefined;
  return { revealLateGame: row?.revealLateGame === 1 };
};

app.get('/api/health', (_request, response) => response.json({ ok: true, version: '2.1.0', gameVersion: '1.6.15' }));
app.get('/api/auth/session', (request, response) => response.json({ user: request.user || null, setupRequired: (db.prepare('SELECT count(*) n FROM users').get() as { n: number }).n === 0 }));

app.post('/api/auth/setup', rateLimit(5, 60_000), async (request, response, next) => {
  try {
    if ((db.prepare('SELECT count(*) n FROM users').get() as { n: number }).n) return response.status(409).json({ error: 'Setup is already complete' });
    if (!config.setupToken || request.body.setupToken !== config.setupToken) return response.status(403).json({ error: 'Invalid setup token' });
    const input = credentials.extend({ farmName: z.string().min(1).max(50) }).parse(request.body);
    const passwordHash = await argon2.hash(input.password, { type: argon2.argon2id });
    const created = now();
    const result = db.transaction(() => {
      const user = db.prepare('INSERT INTO users(username,password_hash,display_name,created_at) VALUES(?,?,?,?)').run(input.username, passwordHash, input.displayName, created);
      const farm = db.prepare('INSERT INTO farms(name,created_at) VALUES(?,?)').run(input.farmName, created);
      const userId = Number(user.lastInsertRowid); const farmId = Number(farm.lastInsertRowid);
      db.prepare("INSERT INTO farm_members(farm_id,user_id,role) VALUES(?,?,'owner')").run(farmId, userId);
      db.prepare("INSERT INTO farm_state(farm_id,season,year,day,updated_at) VALUES(?,'Spring',1,1,?)").run(farmId, created);
      db.prepare('INSERT INTO farm_member_settings(farm_id,user_id,reveal_late_game,updated_at) VALUES(?,?,0,?)').run(farmId, userId, created);
      return { userId, farmId };
    })();
    importLegacy(result.farmId);
    createSession(result.userId, response, result.farmId);
    response.status(201).json({ ok: true });
  } catch (error) { next(error); }
});

app.post('/api/auth/login', rateLimit(8, 60_000), async (request, response) => {
  const input = z.object({ username: z.string(), password: z.string() }).parse(request.body);
  const row = db.prepare('SELECT id,password_hash FROM users WHERE username=?').get(input.username) as { id: number; password_hash: string } | undefined;
  if (!row || !await argon2.verify(row.password_hash, input.password)) return response.status(401).json({ error: 'Invalid username or password' });
  createSession(row.id, response);
  response.json({ ok: true });
});
app.post('/api/auth/logout', requireAuth, (request, response) => { const raw = request.cookies?.stardew_session; if (raw) db.prepare('DELETE FROM sessions WHERE token_hash=?').run(hashToken(raw)); response.clearCookie('stardew_session', { path: '/' }); response.json({ ok: true }); });

app.post('/api/auth/invite', requireAuth, async (request, response) => {
  if (request.user!.role !== 'owner') return response.status(403).json({ error: 'Owner access required' });
  if ((db.prepare('SELECT count(*) n FROM farm_members WHERE farm_id=?').get(request.user!.farmId) as { n: number }).n >= 8) return response.status(409).json({ error: 'A farm can have at most eight members' });
  const input = credentials.parse(request.body); const passwordHash = await argon2.hash(input.password, { type: argon2.argon2id }); const created = now();
  const id = db.transaction(() => { const user = db.prepare('INSERT INTO users(username,password_hash,display_name,created_at) VALUES(?,?,?,?)').run(input.username, passwordHash, input.displayName, created); const userId = Number(user.lastInsertRowid); db.prepare("INSERT INTO farm_members(farm_id,user_id,role) VALUES(?,?,'member')").run(request.user!.farmId, userId); db.prepare('INSERT INTO farm_member_settings(farm_id,user_id,reveal_late_game,updated_at) VALUES(?,?,0,?)').run(request.user!.farmId, userId, created); return userId; })();
  response.status(201).json({ id });
});

function eligibleCollaborators(userId: number) {
  return db.prepare(`SELECT DISTINCT u.id,u.display_name displayName FROM users u JOIN farm_members theirs ON theirs.user_id=u.id JOIN farm_members mine ON mine.farm_id=theirs.farm_id AND mine.user_id=? WHERE u.id<>? ORDER BY u.display_name`).all(userId, userId) as Array<{ id: number; displayName: string }>;
}

app.get('/api/farms', requireAuth, (request, response) => {
  const farms = db.prepare(`SELECT f.id,f.name,fm.role,(SELECT count(*) FROM farm_members all_members WHERE all_members.farm_id=f.id) memberCount FROM farm_members fm JOIN farms f ON f.id=fm.farm_id WHERE fm.user_id=? ORDER BY f.id=? DESC,f.name`).all(request.user!.id, request.user!.farmId);
  response.json({ activeFarmId: request.user!.farmId, farms, eligibleCollaborators: eligibleCollaborators(request.user!.id) });
});

app.post('/api/farms', requireAuth, (request, response) => {
  const input = z.object({ name: z.string().min(1).max(50), memberIds: z.array(z.number().int().positive()).max(7).default([]) }).strict().parse(request.body);
  const memberIds = [...new Set(input.memberIds)].filter((id) => id !== request.user!.id);
  if (memberIds.length !== input.memberIds.length) return response.status(400).json({ error: 'Farm members must be unique' });
  const eligible = new Set(eligibleCollaborators(request.user!.id).map((entry) => entry.id));
  if (memberIds.some((id) => !eligible.has(id))) return response.status(403).json({ error: 'Only previous farm collaborators can be selected' });
  const created = now();
  const farmId = db.transaction(() => {
    const farm = db.prepare('INSERT INTO farms(name,created_at) VALUES(?,?)').run(input.name, created); const id = Number(farm.lastInsertRowid);
    db.prepare("INSERT INTO farm_state(farm_id,season,year,day,updated_at) VALUES(?,'Spring',1,1,?)").run(id, created);
    const addMember = db.prepare("INSERT INTO farm_members(farm_id,user_id,role) VALUES(?,?,'member')"); const addSettings = db.prepare('INSERT INTO farm_member_settings(farm_id,user_id,reveal_late_game,updated_at) VALUES(?,?,0,?)');
    db.prepare("INSERT INTO farm_members(farm_id,user_id,role) VALUES(?,?,'owner')").run(id, request.user!.id); addSettings.run(id, request.user!.id, created);
    for (const userId of memberIds) { addMember.run(id, userId); addSettings.run(id, userId, created); }
    const token = request.cookies?.stardew_session; if (token) db.prepare('UPDATE sessions SET active_farm_id=? WHERE token_hash=? AND user_id=?').run(id, hashToken(token), request.user!.id);
    db.prepare('UPDATE users SET last_farm_id=? WHERE id=?').run(id, request.user!.id);
    return id;
  })();
  response.status(201).json({ farm: publicFarm(farmId), members: membersForFarm(farmId), settings: memberSettings(farmId, request.user!.id) });
});

app.put('/api/farms/:farmId/active', requireAuth, (request, response) => {
  const farmId = z.coerce.number().int().positive().parse(request.params.farmId);
  if (!db.prepare('SELECT 1 FROM farm_members WHERE farm_id=? AND user_id=?').get(farmId, request.user!.id)) return response.status(403).json({ error: 'You are not a member of that farm' });
  const token = request.cookies?.stardew_session;
  const result = token ? db.prepare('UPDATE sessions SET active_farm_id=? WHERE token_hash=? AND user_id=?').run(farmId, hashToken(token), request.user!.id) : { changes: 0 };
  if (!result.changes) return response.status(401).json({ error: 'Session expired' });
  db.prepare('UPDATE users SET last_farm_id=? WHERE id=?').run(farmId, request.user!.id);
  response.json({ ok: true, farmId });
});

app.get('/api/catalog/:domain', (request, response) => { const domain = request.params.domain as CatalogDomain; if (!(domain in CATALOG)) return response.status(404).json({ error: 'Unknown catalog domain' }); response.json({ domain, items: searchCatalog(String(request.query.q || ''), domain), gameVersion: '1.6.15' }); });

app.get('/api/farm', requireAuth, (request, response) => response.json({ farm: publicFarm(request.user!.farmId), members: membersForFarm(request.user!.farmId), settings: memberSettings(request.user!.farmId, request.user!.id) }));
app.patch('/api/farm', requireAuth, (request, response) => {
  const input = z.object({ name: z.string().min(1).max(50).optional(), season: z.enum(['Spring','Summer','Fall','Winter']).optional(), year: z.number().int().min(1).max(999).optional(), day: z.number().int().min(1).max(28).optional(), version: z.number().int() }).parse(request.body);
  const current = db.prepare('SELECT f.name,s.* FROM farms f JOIN farm_state s ON s.farm_id=f.id WHERE f.id=?').get(request.user!.farmId) as any;
  if (current.version !== input.version) return response.status(409).json({ error: 'Farm changed in another session', current });
  const nextState = { name: input.name ?? current.name, season: input.season ?? current.season, year: input.year ?? current.year, day: input.day ?? current.day };
  db.transaction(() => { db.prepare('UPDATE farms SET name=? WHERE id=?').run(nextState.name, request.user!.farmId); db.prepare('UPDATE farm_state SET season=?,year=?,day=?,version=version+1,updated_at=? WHERE farm_id=?').run(nextState.season, nextState.year, nextState.day, now(), request.user!.farmId); })();
  response.json({ ...nextState, version: current.version + 1 });
});
app.patch('/api/farm/settings', requireAuth, (request, response) => {
  const input = z.object({ revealLateGame: z.boolean() }).strict().parse(request.body); const stamp = now();
  db.prepare('INSERT INTO farm_member_settings(farm_id,user_id,reveal_late_game,updated_at) VALUES(?,?,?,?) ON CONFLICT(farm_id,user_id) DO UPDATE SET reveal_late_game=excluded.reveal_late_game,updated_at=excluded.updated_at').run(request.user!.farmId, request.user!.id, input.revealLateGame ? 1 : 0, stamp);
  response.json({ revealLateGame: input.revealLateGame, updatedAt: stamp });
});

app.get('/api/progress', requireAuth, (request, response) => {
  const requested = String(request.query.domains || '').split(',').filter(Boolean); const selected = requested.length ? z.array(progressDomain).max(domains.length).parse(requested) : [...domains];
  const players = z.enum(['self','farm']).default('self').parse(request.query.players); const placeholders = selected.map(() => '?').join(',');
  const userClause = players === 'farm' ? '' : ' AND (user_id IS NULL OR user_id=?)'; const parameters: unknown[] = [request.user!.farmId, ...selected]; if (players === 'self') parameters.push(request.user!.id);
  const rows = db.prepare(`SELECT user_id userId,scope,domain,item_id itemId,value_json value,updated_at updatedAt FROM progress WHERE farm_id=? AND domain IN (${placeholders})${userClause}`).all(...parameters).map((entry: any) => ({ ...entry, value: JSON.parse(entry.value) }));
  response.json(rows);
});
app.get('/api/progress/:scope/:domain', requireAuth, (request, response) => { const scope = progressScope.parse(request.params.scope); const domain = progressDomain.parse(request.params.domain); const userId = scope === 'player' ? request.user!.id : null; const rows = db.prepare('SELECT item_id itemId,value_json value,updated_at updatedAt FROM progress WHERE farm_id=? AND scope=? AND domain=? AND user_id IS ?').all(request.user!.farmId, scope, domain, userId).map((entry: any) => ({ ...entry, value: JSON.parse(entry.value) })); response.json(rows); });

function saveProgress(farmId: number, userId: number, input: z.infer<typeof progressInput>, stamp = now()) { const scopedUser = input.scope === 'player' ? userId : null; upsertProgress.run(farmId, scopedUser, input.scope, input.domain, input.itemId, JSON.stringify(input.value), stamp); return { userId: scopedUser, ...input, updatedAt: stamp }; }
app.put('/api/progress/:scope/:domain/:itemId', requireAuth, (request, response) => { const input = progressInput.parse({ scope: request.params.scope, domain: request.params.domain, itemId: request.params.itemId, value: request.body }); response.json(saveProgress(request.user!.farmId, request.user!.id, input)); });
app.put('/api/progress/batch', requireAuth, (request, response) => { const entries = z.object({ entries: z.array(progressInput).min(1).max(250) }).strict().parse(request.body).entries; const stamp = now(); const saved = db.transaction(() => entries.map((entry) => saveProgress(request.user!.farmId, request.user!.id, entry, stamp)))(); response.json({ entries: saved, updatedAt: stamp }); });

app.get('/api/goals', requireAuth, (request, response) => { const raw = db.prepare('SELECT * FROM goals WHERE farm_id=? ORDER BY completed,created_at DESC').all(request.user!.farmId) as any[]; for (const row of raw) { if (row.item_id) continue; const project = findGoalProject(row.title); if (!project) continue; const linked = resolveGoalInput({ itemId: project.id }); db.prepare('UPDATE goals SET item_id=?,requirements_json=?,target_json=?,updated_at=? WHERE id=?').run(linked.itemId, JSON.stringify(linked.requirements), JSON.stringify(linked.target), now(), row.id); row.item_id = linked.itemId; row.requirements_json = JSON.stringify(linked.requirements); row.target_json = JSON.stringify(linked.target); } response.json(raw.map((entry: any) => enrichGoal({ ...entry, itemId: entry.item_id, target: JSON.parse(entry.target_json), requirements: JSON.parse(entry.requirements_json), completed: !!entry.completed }))); });
app.post('/api/goals', requireAuth, (request, response) => { const dueDate = z.object({ season: z.enum(['Spring','Summer','Fall','Winter']), day: z.number().int().min(1).max(28), year: z.number().int().min(1).max(999) }); const input = z.object({ title: z.string().min(1).max(100).optional(), itemId: z.string().max(100).optional(), personal: z.boolean().default(false), dueDate: dueDate.optional() }).strict().parse(request.body); const goal = resolveGoalInput(input); const result = db.prepare('INSERT INTO goals(farm_id,user_id,title,item_id,target_json,requirements_json,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?)').run(request.user!.farmId, goal.personal ? request.user!.id : null, goal.title, goal.itemId, JSON.stringify(goal.target), JSON.stringify(goal.requirements), now(), now()); response.status(201).json(enrichGoal({ id: Number(result.lastInsertRowid), ...goal, completed: false })); });
app.patch('/api/goals/:id', requireAuth, (request, response) => { const input = z.object({ completed: z.boolean() }).parse(request.body); const result = db.prepare('UPDATE goals SET completed=?,updated_at=? WHERE id=? AND farm_id=?').run(input.completed ? 1 : 0, now(), request.params.id, request.user!.farmId); if (!result.changes) return response.status(404).json({ error: 'Goal not found' }); response.json({ ok: true }); });
app.delete('/api/goals/:id', requireAuth, (request, response) => { db.prepare('DELETE FROM goals WHERE id=? AND farm_id=?').run(request.params.id, request.user!.farmId); response.status(204).end(); });

function snapshot(request: any) {
  const farm = db.prepare('SELECT f.name,s.season,s.year,s.day FROM farms f JOIN farm_state s ON s.farm_id=f.id WHERE f.id=?').get(request.user.farmId); const revealLateGame = memberSettings(request.user.farmId, request.user.id).revealLateGame;
  const rawProgress = db.prepare('SELECT scope,domain,item_id itemId,value_json value FROM progress WHERE farm_id=? AND (user_id IS NULL OR user_id=?)').all(request.user.farmId, request.user.id).map((entry: any) => ({ ...entry, value: JSON.parse(entry.value) }));
  const hiddenIds = new Set(Object.values(CATALOG).flatMap((items) => [...items] as any[]).filter((item: any) => item.spoilerTier === 'late-game').map((item: any) => item.id)); const isHidden = (itemId: string) => [...hiddenIds].some((id) => itemId === id || itemId.startsWith(`${id}:`));
  const progress = revealLateGame ? rawProgress : rawProgress.filter((entry: any) => !isHidden(entry.itemId)); const rawGoals = db.prepare('SELECT title,completed,item_id itemId,requirements_json requirements FROM goals WHERE farm_id=? LIMIT 50').all(request.user.farmId) as any[]; const goals = revealLateGame ? rawGoals : rawGoals.filter((goal) => !goal.itemId || !hiddenIds.has(goal.itemId));
  return { farm, progress: summarizeProgress(progress), goals, revealLateGame } as any;
}
app.post('/api/ai/daily-plan', requireAuth, rateLimit(10, 60_000), async (request, response) => { db.prepare("INSERT INTO ai_usage(user_id,kind,created_at) VALUES(?,'daily-plan',?)").run(request.user!.id, now()); response.json(await safeDailyPlan(snapshot(request))); });
app.post('/api/ai/chat', requireAuth, rateLimit(15, 60_000), async (request, response, next) => { try { const { question, concise } = z.object({ question: z.string().min(2).max(1000), concise: z.boolean().optional() }).parse(request.body); if (/ignore (all|previous)|system prompt|developer message/i.test(question)) return response.status(400).json({ error: 'Please ask a Stardew Valley question without prompt-control instructions' }); db.prepare("INSERT INTO ai_usage(user_id,kind,created_at) VALUES(?,'chat',?)").run(request.user!.id, now()); response.json(await safeAnswerQuestion(snapshot(request), question, concise)); } catch (error) { next(error); } });
app.use((error: any, _request: any, response: any, _next: any) => { if (error instanceof z.ZodError) return response.status(400).json({ error: 'Invalid request', issues: error.issues }); if (error?.status) return response.status(error.status).json({ error: error.message }); console.error(error); response.status(500).json({ error: 'Unexpected server error' }); });
