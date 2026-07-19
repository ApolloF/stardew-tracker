import fs from 'node:fs';
import path from 'node:path';
import Database from 'better-sqlite3';
import { config } from './config.js';

fs.mkdirSync(config.dataDir, { recursive: true });
export const db = new Database(path.join(config.dataDir, 'stardew.sqlite'));
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');
db.pragma('busy_timeout = 5000');

db.exec(`
  CREATE TABLE IF NOT EXISTS schema_migrations(version INTEGER PRIMARY KEY, applied_at TEXT NOT NULL);
  CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY, username TEXT NOT NULL UNIQUE COLLATE NOCASE, password_hash TEXT NOT NULL, display_name TEXT NOT NULL, created_at TEXT NOT NULL);
  CREATE TABLE IF NOT EXISTS farms(id INTEGER PRIMARY KEY, name TEXT NOT NULL, created_at TEXT NOT NULL);
  CREATE TABLE IF NOT EXISTS farm_members(farm_id INTEGER NOT NULL REFERENCES farms(id) ON DELETE CASCADE, user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE, role TEXT NOT NULL CHECK(role IN ('owner','member')), PRIMARY KEY(farm_id,user_id));
  CREATE TABLE IF NOT EXISTS farm_state(farm_id INTEGER PRIMARY KEY REFERENCES farms(id) ON DELETE CASCADE, season TEXT NOT NULL, year INTEGER NOT NULL, day INTEGER NOT NULL, version INTEGER NOT NULL DEFAULT 1, updated_at TEXT NOT NULL);
  CREATE TABLE IF NOT EXISTS sessions(token_hash TEXT PRIMARY KEY, user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE, expires_at TEXT NOT NULL, created_at TEXT NOT NULL);
  CREATE TABLE IF NOT EXISTS progress(farm_id INTEGER NOT NULL REFERENCES farms(id) ON DELETE CASCADE, user_id INTEGER, scope TEXT NOT NULL CHECK(scope IN ('shared','player')), domain TEXT NOT NULL, item_id TEXT NOT NULL, value_json TEXT NOT NULL, updated_at TEXT NOT NULL);
  CREATE TABLE IF NOT EXISTS goals(id INTEGER PRIMARY KEY, farm_id INTEGER NOT NULL REFERENCES farms(id) ON DELETE CASCADE, user_id INTEGER, title TEXT NOT NULL, item_id TEXT, target_json TEXT NOT NULL, requirements_json TEXT NOT NULL, completed INTEGER NOT NULL DEFAULT 0, created_at TEXT NOT NULL, updated_at TEXT NOT NULL);
  CREATE TABLE IF NOT EXISTS ai_usage(id INTEGER PRIMARY KEY, user_id INTEGER NOT NULL REFERENCES users(id), kind TEXT NOT NULL, created_at TEXT NOT NULL);
  CREATE TABLE IF NOT EXISTS save_imports(id INTEGER PRIMARY KEY,farm_id INTEGER NOT NULL REFERENCES farms(id) ON DELETE CASCADE,imported_by INTEGER NOT NULL REFERENCES users(id),file_hash TEXT NOT NULL,game_version TEXT NOT NULL,summary_json TEXT NOT NULL,created_at TEXT NOT NULL);
`);

function hasColumn(table: string, column: string) {
  return (db.prepare(`PRAGMA table_info(${table})`).all() as Array<{ name: string }>).some((entry) => entry.name === column);
}

function addColumn(table: string, column: string, declaration: string) {
  if (!hasColumn(table, column)) db.exec(`ALTER TABLE ${table} ADD COLUMN ${column} ${declaration}`);
}

const migrate = db.transaction(() => {
  const shouldMigrateSpoilers=!db.prepare('SELECT 1 FROM schema_migrations WHERE version=4').get();
  addColumn('users', 'last_farm_id', 'INTEGER');
  addColumn('sessions', 'active_farm_id', 'INTEGER');
  db.exec(`
    CREATE TABLE IF NOT EXISTS farm_member_settings(
      farm_id INTEGER NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      reveal_late_game INTEGER NOT NULL DEFAULT 0 CHECK(reveal_late_game IN (0,1)),
      updated_at TEXT NOT NULL,
      PRIMARY KEY(farm_id,user_id),
      FOREIGN KEY(farm_id,user_id) REFERENCES farm_members(farm_id,user_id) ON DELETE CASCADE
    );
    DELETE FROM progress WHERE rowid NOT IN (SELECT MAX(rowid) FROM progress GROUP BY farm_id,ifnull(user_id,0),scope,domain,item_id);
    CREATE UNIQUE INDEX IF NOT EXISTS progress_unique ON progress(farm_id,ifnull(user_id,0),scope,domain,item_id);
    CREATE INDEX IF NOT EXISTS progress_farm ON progress(farm_id,scope,domain);
    CREATE INDEX IF NOT EXISTS ai_usage_user_time ON ai_usage(user_id,created_at);
    CREATE INDEX IF NOT EXISTS farm_members_user ON farm_members(user_id,farm_id);
  `);
  db.prepare(`UPDATE sessions SET active_farm_id=(SELECT fm.farm_id FROM farm_members fm WHERE fm.user_id=sessions.user_id ORDER BY fm.role='owner' DESC,fm.farm_id LIMIT 1) WHERE active_farm_id IS NULL`).run();
  db.prepare(`UPDATE users SET last_farm_id=(SELECT fm.farm_id FROM farm_members fm WHERE fm.user_id=users.id ORDER BY fm.role='owner' DESC,fm.farm_id LIMIT 1) WHERE last_farm_id IS NULL`).run();
  db.prepare(`INSERT OR IGNORE INTO farm_member_settings(farm_id,user_id,reveal_late_game,updated_at) SELECT farm_id,user_id,0,datetime('now') FROM farm_members`).run();
  if(shouldMigrateSpoilers)db.prepare(`INSERT INTO farm_member_settings(farm_id,user_id,reveal_late_game,updated_at) SELECT farm_id,user_id,CASE WHEN json_extract(value_json,'$.completed')=1 OR json_extract(value_json,'$.revealed')=1 THEN 1 ELSE 0 END,updated_at FROM progress WHERE scope='player' AND domain='spoilers' AND item_id='late-game' AND user_id IS NOT NULL ON CONFLICT(farm_id,user_id) DO UPDATE SET reveal_late_game=excluded.reveal_late_game,updated_at=excluded.updated_at`).run();
  for (const version of [1, 2, 3, 4]) db.prepare(`INSERT OR IGNORE INTO schema_migrations(version,applied_at) VALUES(?,datetime('now'))`).run(version);
});
migrate();

export type AuthUser = { id: number; username: string; displayName: string; farmId: number; role: 'owner' | 'member' };

export function farmForUser(userId: number, preferredFarmId?: number) {
  if (preferredFarmId) {
    const preferred = db.prepare('SELECT farm_id farmId FROM farm_members WHERE user_id=? AND farm_id=?').get(userId, preferredFarmId) as { farmId: number } | undefined;
    if (preferred) return preferred.farmId;
  }
  const row = db.prepare(`SELECT fm.farm_id farmId FROM farm_members fm LEFT JOIN users u ON u.id=fm.user_id WHERE fm.user_id=? ORDER BY fm.farm_id=u.last_farm_id DESC,fm.role='owner' DESC,fm.farm_id LIMIT 1`).get(userId) as { farmId: number } | undefined;
  return row?.farmId;
}

export function userBySession(hash: string) {
  return db.prepare(`SELECT u.id,u.username,u.display_name displayName,fm.farm_id farmId,fm.role FROM sessions s JOIN users u ON u.id=s.user_id JOIN farm_members fm ON fm.user_id=u.id AND fm.farm_id=COALESCE(s.active_farm_id,u.last_farm_id,(SELECT fallback.farm_id FROM farm_members fallback WHERE fallback.user_id=u.id ORDER BY fallback.role='owner' DESC,fallback.farm_id LIMIT 1)) WHERE s.token_hash=? AND s.expires_at>datetime('now')`).get(hash) as AuthUser | undefined;
}

function pruneMaintenanceData() {
  db.prepare(`DELETE FROM sessions WHERE expires_at<=datetime('now')`).run();
  db.prepare(`DELETE FROM ai_usage WHERE created_at<datetime('now','-30 days')`).run();
  const cutoff = Date.now() - config.backupRetentionDays * 86_400_000;
  for (const entry of fs.readdirSync(config.dataDir, { withFileTypes: true })) {
    if (!entry.isFile() || !/^stardew\.\d{4}-\d{2}-\d{2}\.backup\.sqlite$/.test(entry.name)) continue;
    const fullPath = path.join(config.dataDir, entry.name);
    if (fs.statSync(fullPath).mtimeMs < cutoff) fs.rmSync(fullPath);
  }
}

export function backupDatabase() {
  pruneMaintenanceData();
  const stamp = new Date().toISOString().slice(0, 10);
  const target = path.join(config.dataDir, `stardew.${stamp}.backup.sqlite`);
  if (!fs.existsSync(target)) void db.backup(target).catch((error) => console.error('Backup failed', error));
}

backupDatabase();
setInterval(backupDatabase, 86_400_000).unref();
