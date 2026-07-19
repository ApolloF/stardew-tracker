import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  BUNDLE_ROOMS, CROPS, FESTIVALS, FERTILIZERS, FISH, PROJECTS, QUEEN_OF_SAUCE, VILLAGERS,
  adjustedGrowthDays, addFarmDays, buildFarmBriefing, buildUpcomingReminders,
  daysUntilBirthday, harvestCount, lastPlantingDay, searchCatalog,
  type FarmReminder, type Project, type Season,
} from '@stardew/game-data';
import { api, type SaveState, type Session } from '../api';
import './journal.css';
import './journal-mobile.css';
import './journal-a11y.css';
import SaveImportModal from '../components/SaveImportModal';
import GameIcon from '../components/GameIcon';
import UiIcon, { type UiIconName } from '../components/UiIcon';
import { FarmerTracker, DiscoveriesTracker } from './FarmerDiscoveries';
import { AnimalsTracker,CollectionsTracker,PerfectionTracker } from './ExpandedTrackers';
import RelationshipSummary from './RelationshipSummary';
import './relationship-summary.css';

type TabId='today'|'calendar'|'assistant'|'bundles'|'crops'|'goals'|'animals'|'collections'|'fishing'|'villagers'|'farmer'|'discoveries'|'perfection'|'reference';
type TabDef=readonly [TabId,string,string];
const tabGroups:ReadonlyArray<readonly [string,readonly TabDef[]]> = [
  ['Journal', [['today','today','Today'],['calendar','calendar','Calendar'],['assistant','oracle','Oracle']]],
  ['Farm', [['bundles','bundles','Bundles'],['crops','crops','Crops'],['goals','goals','Goals'],['animals','animals','Animals']]],
  ['Collections', [['collections','collections','Collections'],['fishing','fishing','Fishing']]],
  ['People', [['villagers','heart','Relationships']]],
  ['Farmer', [['farmer','farmer','Farmer']]],
  ['Discoveries', [['discoveries','discoveries','Discoveries']]],
  ['Progress', [['perfection','perfection','Perfection'],['reference','reference','Reference']]],
];
const tabs:readonly TabDef[] = tabGroups.flatMap(group => group[1]);
type FarmData = { farm: { name: string; season: Season; year: number; day: number; version: number }; members: Array<{ id: number; displayName: string; role: string }>; progress: any[] };
const uiNames = new Set<UiIconName>(['home','today','tomorrow','bundles','crops','goals','collections','heart','calendar','fishing','perfection','reference','oracle','rain','sun','moon','clock','cart','tv','import','logout','search','warning','leaf','refresh','check','save','people','farmer','discoveries','skills','note','fire']);
function ReminderIcon({item}:{item:FarmReminder}){if(item.iconKey==='villager'&&item.entityId)return <GameIcon src={`/game-icons/villagers/${item.entityId}.png`} label={item.title} size={28}/>;if(item.iconKey==='crops'&&item.entityId){const crop=CROPS.find(row=>row.id===item.entityId);if(crop)return <GameIcon src={crop.iconPath} label={crop.name} size={28}/>;}return <UiIcon name={(item.iconKey&&uiNames.has(item.iconKey as UiIconName)?item.iconKey:'calendar') as UiIconName} label={item.title}/>;}
function ProjectIcon({goal}:{goal:any}){const project=goal.project||goal.target||goal;return project?.iconPath?<GameIcon src={project.iconPath} label={project.name||goal.title} size={30}/>:<UiIcon name="goals"/>;}
export default function JournalPage({ session, onSessionChange }: { session: Session; onSessionChange: () => void }) {
  const [params, setParams] = useSearchParams();
  const requested = params.get('tab') as TabId | null;
  const active: TabId = tabs.some(([id]) => id === requested) ? requested! : 'today';
  const [data, setData] = useState<FarmData | null>(null);
  const [goals, setGoals] = useState<any[]>([]);
  const [save, setSave] = useState<SaveState>('idle');
  const [theme, setTheme] = useState(() => localStorage.getItem('journal-theme') || 'light');
  const [editingName, setEditingName] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [loadError, setLoadError] = useState(false);

  const load = () => Promise.all([api.farm(), api.goals()]).then(([farm, nextGoals]) => { setData(farm); setGoals(nextGoals); setLoadError(false); });
  useEffect(() => { load().catch(() => { setLoadError(true); setSave('failed'); }); }, []);
  useEffect(() => { document.documentElement.dataset.theme = theme; localStorage.setItem('journal-theme', theme); }, [theme]);

  if (!data || !session.user) {
    if (loadError) return <div className="journal-loading"><UiIcon name="warning" size={38}/><p>The journal couldn't reach the farm right now.</p><button className="journal-primary" onClick={() => { setLoadError(false); load().catch(() => { setLoadError(true); setSave('failed'); }); }}>Try again</button></div>;
    return <div className="journal-loading"><GameIcon src="/game-icons/animals/chicken.webp" label="Opening journal" size={44}/><p>Opening your farm journal…</p></div>;
  }
  const farm = data.farm;
  const ownId = session.user.id;
  const progressValue = (domain: string, itemId: string, player = false) => data.progress.find(entry => entry.domain === domain && entry.itemId === itemId && (!player || entry.userId === ownId))?.value;
  const revealLateGame = progressValue('spoilers', 'late-game', true)?.revealed === true;

  const changeTab = (tab: TabId) => setParams(tab === 'today' ? {} : { tab }, { replace: true });
  const updateFarm = async (patch: object) => {
    setSave('saving');
    try {
      const next = await api.updateFarm({ ...patch, version: farm.version });
      setData(current => current ? { ...current, farm: { ...current.farm, ...next } } : current);
      setSave('saved'); window.setTimeout(() => setSave('idle'), 1400);
    } catch (error: any) {
      setSave(error.offline ? 'offline' : error.status === 409 ? 'retrying' : 'failed');
      if (error.status === 409) await load();
    }
  };
  const shiftDay = (amount: number) => updateFarm(addFarmDays(farm, amount));
  const putProgress = async (scope: 'shared' | 'player', domain: string, itemId: string, value: object) => {
    const userId = scope === 'player' ? ownId : null;
    const previous = data.progress;
    const nextEntry = { scope, domain, itemId, value, userId };
    setData(current => current ? { ...current, progress: [...current.progress.filter(entry => !(entry.scope === scope && entry.domain === domain && entry.itemId === itemId && entry.userId === userId)), nextEntry] } : current);
    setSave('saving');
    try { await api.putProgress(scope, domain, itemId, value); setSave('saved'); window.setTimeout(() => setSave('idle'), 1400); }
    catch (error: any) { setData(current => current ? { ...current, progress: previous } : current); setSave(error.offline ? 'offline' : 'failed'); }
  };
  const weatherItemId = `${farm.year}-${farm.season.toLowerCase()}-${farm.day}`;
  const isRaining = progressValue('calendar-weather', weatherItemId)?.raining === true;
  const reveal = () => putProgress('player', 'spoilers', 'late-game', { revealed: true });
  const hide = () => putProgress('player', 'spoilers', 'late-game', { revealed: false });
  const briefing = buildFarmBriefing(farm, revealLateGame);

  return <div className={`journal-app app-season-${farm.season.toLowerCase()}`}>
    <a className="skip-link" href="#journal-content">Skip to journal content</a>
    <header className="journal-header">
      <div className="journal-header-top">
        <div className="farm-title"><UiIcon name="home" /> {editingName ? <NameEditor value={farm.name} save={name => { setEditingName(false); updateFarm({ name }); }} /> : <button onClick={() => setEditingName(true)}>{farm.name} <small>Edit</small></button>}</div>
        <div className="journal-actions"><button className="round-action import-action" onClick={() => setImportOpen(true)} aria-label="Import save file"><UiIcon name="import"/></button><span className={`season-pill season-${farm.season.toLowerCase()}`}><UiIcon name="calendar"/> {farm.season} · Year {farm.year}</span><button className="round-action" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} aria-label="Toggle color theme"><UiIcon name={theme === 'dark' ? 'sun' : 'moon'}/></button><button className="round-action" onClick={() => api.logout().then(onSessionChange)} aria-label="Sign out"><UiIcon name="logout"/></button></div>
      </div>
      <div className="date-controls"><button onClick={() => shiftDay(-1)} aria-label="Previous day">‹</button><div className="date-track"><div><strong>Day {farm.day} of 28</strong><span>{Math.round(farm.day / 28 * 100)}% through {farm.season}</span></div><div className="season-progress"><i style={{ width: `${farm.day / 28 * 100}%` }} /></div><div className="event-dots">{FESTIVALS.filter(event => event.season === farm.season).map(event => <i key={event.id} style={{ left: `${event.day / 28 * 100}%` }} title={`${event.name}: ${event.season} ${event.day}`} />)}</div></div><button onClick={() => shiftDay(1)} aria-label="Next day">›</button></div>
    </header>

    <Briefing reminders={briefing} openTab={changeTab} />
    <nav className="journal-tabs" aria-label="Farm journal sections">{tabGroups.map(([group,items])=><div className="journal-tab-group" key={group}><small>{group}</small><div>{items.map(([id,icon,label])=><button key={id} className={active===id?'active':''} onClick={()=>changeTab(id)} aria-current={active===id?'page':undefined}>{id==='animals'?<GameIcon src="/game-icons/animals/chicken.webp" label="Animals" size={22}/>:<UiIcon name={icon as UiIconName}/>}<span className="tab-label">{label}</span></button>)}</div></div>)}</nav>

    <main id="journal-content" className="journal-content">
      {active === 'today' && <TodayTab farm={farm} goals={goals} revealLateGame={revealLateGame} openTab={changeTab} isRaining={isRaining} setRaining={raining => putProgress('shared', 'calendar-weather', weatherItemId, { raining })} />}
      {active === 'bundles' && <BundlesTab value={progressValue} put={putProgress} revealLateGame={revealLateGame} reveal={reveal} />}
      {active === 'crops' && <CropsTab farm={farm} revealLateGame={revealLateGame} reveal={reveal} />}
      {active === 'collections' && <CollectionsTracker entries={data.progress} ownId={ownId} put={putProgress} />}
      {active === 'goals' && <GoalsTab goals={goals} reload={load} revealLateGame={revealLateGame} reveal={reveal} />}
      {active === 'villagers' && <><RelationshipSummary entries={data.progress} ownId={ownId} /><VillagersTab farm={farm} value={progressValue} put={putProgress} revealLateGame={revealLateGame} reveal={reveal} /></>}
      {active === 'animals' && <AnimalsTracker entries={data.progress} put={putProgress} />}
      {active === 'calendar' && <CalendarTab farm={farm} />}
      {active === 'fishing' && <FishingTab farm={farm} value={progressValue} put={putProgress} isRaining={isRaining} openTab={changeTab} />}
      {active === 'perfection' && <PerfectionTracker entries={data.progress} members={data.members} />}
      {active === 'reference' && <ReferenceTab revealLateGame={revealLateGame} reveal={reveal} hide={hide} />}
      {active === 'assistant' && <AssistantTab revealLateGame={revealLateGame} reveal={reveal} />}
    </main>

    <footer className="journal-footer"><span className={`save-state ${save}`}>{saveLabel(save)}</span><span>{data.members.map(member => member.displayName).join(' & ')}</span>{session.user.role === 'owner' && data.members.length < 2 && <button onClick={() => setInviteOpen(true)}>Invite co-farmer</button>}<span className="verified">Verified for Stardew 1.6.15</span></footer>
    {inviteOpen && <InviteModal close={() => setInviteOpen(false)} done={() => { setInviteOpen(false); load(); }} />}
    {importOpen && <SaveImportModal session={session} members={data.members} farmVersion={farm.version} close={() => setImportOpen(false)} done={() => { setImportOpen(false); load(); }} />}
  </div>;
}

function NameEditor({ value, save }: { value: string; save: (name: string) => void }) {
  const [name, setName] = useState(value);
  return <input className="farm-name-input" autoFocus value={name} maxLength={50} onChange={event => setName(event.target.value)} onBlur={() => save(name.trim() || value)} onKeyDown={event => { if (event.key === 'Enter') save(name.trim() || value); }} />;
}

function Briefing({ reminders, openTab }: { reminders: FarmReminder[]; openTab: (tab: TabId) => void }) {
  return <section className="briefing" aria-label="Today and tomorrow">
    {(['today', 'tomorrow'] as const).map(timing => { const rows = reminders.filter(item => item.timing === timing); return <div className={`briefing-column ${timing}`} key={timing}><h2><UiIcon name={timing === 'today' ? 'today' : 'tomorrow'} /> {timing === 'today' ? 'Today' : 'Tomorrow'}</h2>{rows.length ? rows.map(item => <button key={item.id} onClick={() => item.link && openTab((new URL(item.link, location.origin).searchParams.get('tab') || 'today') as TabId)}><ReminderIcon item={item} /><span><strong>{item.title}</strong><small>{item.detail}</small></span></button>) : <p>Nothing time-sensitive. Enjoy the day!</p>}</div>; })}
  </section>;
}

function TodayTab({ farm, goals, revealLateGame, openTab, isRaining, setRaining }: { farm: FarmData['farm']; goals: any[]; revealLateGame: boolean; openTab: (tab: TabId) => void; isRaining: boolean; setRaining: (raining: boolean) => void }) {
  const upcoming = buildUpcomingReminders(farm, 14, revealLateGame).slice(0, 10);
  const visibleGoals = goals.filter(goal => revealLateGame || goal.project?.spoilerTier !== 'late-game').filter(goal => !goal.completed).slice(0, 5);
  const daysRemaining = 28 - farm.day;
  const cropDeadlines = CROPS
    .filter(crop => crop.seasons.includes(farm.season) && (revealLateGame || crop.spoilerTier !== 'late-game'))
    .map(crop => ({ crop, last: lastPlantingDay(crop, farm.season, 0, false) }))
    .filter(row => row.last !== null && row.last >= farm.day && row.last - farm.day <= 7)
    .sort((a, b) => a.last! - b.last!)
    .slice(0, 4);
  const rainyFish = FISH.filter(fish => fish.weather === 'Rain' && (fish.seasons as readonly string[]).some(season => season === farm.season || season === 'All')).slice(0, 6);

  return <div className="journal-grid">
    <section className="journal-card full planning-hints">
      <div className="section-heading"><div><small>Longer-range planning</small><h1><UiIcon name="today" /> Hints</h1></div><label className="weather-toggle"><input type="checkbox" checked={isRaining} onChange={event => setRaining(event.target.checked)} /><span><UiIcon name="rain" /> Rainy day</span></label></div>
      <div className="hint-summary">
        <article className={daysRemaining <= 4 ? 'urgent' : ''}><UiIcon name="clock" /><div><strong>{daysRemaining === 0 ? 'Last day of the season' : `${daysRemaining} day${daysRemaining === 1 ? '' : 's'} left in ${farm.season}`}</strong><small>{daysRemaining <= 4 ? 'Harvest seasonal crops and prepare for the change.' : `The season changes after Day 28.`}</small></div><b>{daysRemaining === 0 ? 'Today' : `${daysRemaining}d`}</b></article>
        {isRaining && <article><UiIcon name="rain" /><div><strong>Rainy day</strong><small>No outdoor watering needed. {rainyFish.length ? `Rain-only catches now include ${rainyFish.map(fish => fish.name).join(', ')}.` : 'No rain-only seasonal catches in the catalog today.'}</small></div></article>}
        {cropDeadlines.map(({ crop, last }) => <article className={last! - farm.day <= 2 ? 'urgent' : ''} key={crop.id}><GameIcon src={crop.iconPath} label={crop.name} /><div><strong>{last === farm.day ? `Last day to plant ${crop.name}` : `${crop.name}: ${last! - farm.day} days to plant`}</strong><small>Without growth boosts, plant by {farm.season} {last} for at least one harvest.</small></div><b>{last === farm.day ? 'Today' : `${last! - farm.day}d`}</b></article>)}
      </div>
    </section>
    <section className="journal-card"><div className="section-heading"><div><small>Next two weeks</small><h1>Coming up</h1></div><button onClick={() => openTab('calendar')}>Full calendar →</button></div><div className="compact-list">{upcoming.map(item => <article key={item.id}><ReminderIcon item={item} /><div><strong>{item.title}</strong><small>{item.date.season} {item.date.day} · {item.detail}</small></div></article>)}{!upcoming.length && <EmptyState text="A quiet stretch in the valley — nothing on the horizon." />}</div></section>
    <section className="journal-card"><div className="section-heading"><div><small>Your plans</small><h1>Active goals</h1></div><button onClick={() => openTab('goals')}>Manage →</button></div><div className="compact-list">{visibleGoals.map(goal => <article key={goal.id}><ProjectIcon goal={goal} /><div><strong>{goal.title}</strong><small>{formatGoalRequirements(goal)}</small></div></article>)}{!visibleGoals.length && <EmptyState text="No active goals — add one like “Build a Silo” and its steps show up here." />}</div></section>
  </div>;
}

function BundlesTab({ value, put, revealLateGame, reveal }: { value: (domain: string, id: string) => any; put: (scope: 'shared' | 'player', domain: string, id: string, value: object) => void; revealLateGame: boolean; reveal: () => void }) {
  const imported=value('bundles','layout');
  if(imported?.route==='joja')return <div className="bundle-tracker"><Intro title="Joja Community Development" text="This save follows the Joja route. Completed development projects are imported directly from the farm."/><section className="journal-card joja-projects">{(imported.jojaProjects||[]).length?(imported.jojaProjects||[]).map((name:string)=><article key={name}><UiIcon name="check"/><div><strong>{name}</strong><small>Community Development project completed</small></div></article>):<p className="empty-note">No completed Joja projects were found in this save.</p>}</section></div>;
  if(imported?.rooms?.length)return <div className="bundle-tracker"><Intro title={`${imported.kind==='remixed'?'Remixed':'Imported'} Community Center`} text="This is the exact bundle layout and slot progress from your save. Re-importing replaces only save-derived bundle data."/>{imported.rooms.map((room:any)=>{const all=room.bundles.flatMap((b:any)=>b.items.map((item:any)=>({bundle:b,item}))),done=all.filter(({bundle,item}:any)=>value('bundles',`save:${bundle.saveId}:${item.slot}`)?.completed).length;return <details className="room-section" key={room.id} open={room.id==='crafts-room'}><summary><UiIcon name="bundles"/><div><strong>{room.name}</strong><small>{room.bundles.length} bundles from save</small></div><b>{done}/{all.length}</b></summary><div className="room-progress"><i style={{width:`${all.length?done/all.length*100:0}%`}}/></div><div className="bundle-list">{room.bundles.map((bundle:any)=>{const count=bundle.items.filter((item:any)=>value('bundles',`save:${bundle.saveId}:${item.slot}`)?.completed).length;return <details className={count>=bundle.required?'bundle-card complete':'bundle-card'} key={bundle.stableKey}><summary><span><strong>{bundle.name}</strong><small>Choose {bundle.required}{bundle.reward?` · Reward: ${bundle.reward}`:''}</small></span><b>{Math.min(count,bundle.required)}/{bundle.required}</b></summary><ul>{bundle.items.map((item:any)=>{const id=`save:${bundle.saveId}:${item.slot}`,checked=value('bundles',id)?.completed===true;return <li className={checked?'checked':''} key={id}><button onClick={()=>put('shared','bundles',id,{completed:!checked})} aria-label={`${checked?'Uncheck':'Check'} ${item.name}`}><UiIcon name={checked?'check':'bundles'}/></button><GameIcon src={item.iconPath} label={item.name} size={30}/><div><strong>{item.name}{item.quantity>1?` ×${item.quantity}`:''}</strong><small>{item.quality?`Quality ${item.quality}`:'Standard quality'} · slot {item.slot+1}</small></div></li>})}</ul></details>})}</div></details>})}</div>;
  return <div className="bundle-tracker"><Intro title="Community Center bundles" text="Bundles complete when the required number of choices is checked—not necessarily every displayed item." />{BUNDLE_ROOMS.filter(room => revealLateGame || room.spoilerTier !== 'late-game').map(room => { const total = room.bundles.reduce((sum, bundle) => sum + bundle.required, 0); const done = room.bundles.reduce((sum, bundle) => sum + Math.min(bundle.required, bundle.items.filter(item => value('bundles', `${bundle.id}:${item.id}`)?.completed).length), 0); return <details className="room-section" key={room.id} open={room.id === 'crafts-room'}><summary><GameIcon src={room.iconPath} label={room.name} /><div><strong>{room.name}</strong><small>Room reward: {room.reward}</small></div><b>{done}/{total}</b></summary><div className="room-progress"><i style={{ width: `${total ? done / total * 100 : 0}%` }} /></div><div className="bundle-list">{room.bundles.map(bundle => { const count = bundle.items.filter(item => value('bundles', `${bundle.id}:${item.id}`)?.completed).length; return <details className={count >= bundle.required ? 'bundle-card complete' : 'bundle-card'} key={bundle.id}><summary><span><strong>{bundle.name}</strong><small>Choose {bundle.required} · Reward: {bundle.reward}</small></span><b>{Math.min(count, bundle.required)}/{bundle.required}</b></summary><ul>{bundle.items.map(item => { const id = `${bundle.id}:${item.id}`; const checked = value('bundles', id)?.completed === true; return <li className={checked ? 'checked' : ''} key={item.id}><button onClick={() => put('shared', 'bundles', id, { completed: !checked })} aria-label={`${checked ? 'Uncheck' : 'Check'} ${item.name}`}><UiIcon name={checked?'check':'bundles'}/></button><GameIcon src={item.iconPath} label={item.name} size={30} /><div><strong>{item.name}{item.quantity && item.quantity > 1 ? ` ×${item.quantity}` : ''}{item.quality ? ` · ${item.quality}+` : ''}</strong><small>{item.hint}</small></div></li>; })}</ul></details>; })}</div></details>; })}{!revealLateGame && <SpoilerGate reveal={reveal} />}</div>;
}
function CropsTab({ farm, revealLateGame, reveal }: { farm: FarmData['farm']; revealLateGame: boolean; reveal: () => void }) {
  const [fertilizer, setFertilizer] = useState(0); const [agriculturist, setAgriculturist] = useState(false);
  const rows = CROPS.filter(crop => crop.seasons.includes(farm.season) && (revealLateGame || crop.spoilerTier !== 'late-game')).map(crop => ({ crop, last: lastPlantingDay(crop, farm.season, fertilizer, agriculturist), grow: adjustedGrowthDays(crop.growthDays, fertilizer, agriculturist) })).sort((a, b) => (a.last! < farm.day ? 1 : 0) - (b.last! < farm.day ? 1 : 0) || a.last! - b.last!);
  return <><Intro title={`${farm.season} crop planner`} text={`Planting guidance for Day ${farm.day}. Growth calculations assume daily watering.`} /><div className="planner-controls"><label>Growth fertilizer<select value={fertilizer} onChange={event => setFertilizer(Number(event.target.value))}>{FERTILIZERS.map(item => <option key={item.id} value={item.percent}>{item.name}</option>)}</select></label><label className="check-label"><input type="checkbox" checked={agriculturist} onChange={event => setAgriculturist(event.target.checked)} /> Agriculturist profession</label></div><div className="crop-grid">{rows.map(({ crop, last, grow }) => { const tooLate = last! < farm.day; const urgent = !tooLate && last! - farm.day <= 4; return <article className={`crop-card ${tooLate ? 'too-late' : urgent ? 'urgent' : ''}`} key={crop.id}><div><GameIcon src={crop.iconPath} label={crop.name} /><div><strong>{crop.name}</strong><small>{crop.seasons.join(' · ')}</small></div><b>{tooLate ? 'Too late' : last === farm.day ? 'Last day' : `${last! - farm.day}d left`}</b></div><dl><div><dt>First harvest</dt><dd>{grow} days</dd></div><div><dt>Last plant</dt><dd>Day {last}</dd></div><div><dt>Harvests now</dt><dd>{harvestCount(crop, farm.day, fertilizer, agriculturist)}</dd></div><div><dt>Base sell</dt><dd>{crop.sellPrice}g</dd></div></dl><p>Seeds: {crop.seedSource}{crop.regrowDays ? ` · Regrows every ${crop.regrowDays} days` : ''}</p></article>; })}</div>{!revealLateGame && <SpoilerGate reveal={reveal} />}</>;
}

function GoalsTab({ goals, reload, revealLateGame, reveal }: { goals: any[]; reload: () => void; revealLateGame: boolean; reveal: () => void }) {
  const [adding, setAdding] = useState(false); const [query, setQuery] = useState(''); const [selected, setSelected] = useState<Project | null>(null); const [error, setError] = useState('');
  const allowed = PROJECTS.filter(project => revealLateGame || project.spoilerTier !== 'late-game');
  const suggestions = query.trim().length ? allowed.filter(project => `${project.name} ${project.id}`.toLowerCase().includes(query.toLowerCase()) || query.toLowerCase().includes(project.name.toLowerCase())).slice(0, 6) : allowed.filter(project => ['silo', 'coop', 'barn', 'preserves-jar'].includes(project.id));
  const submit = async (event: FormEvent) => { event.preventDefault(); setError(''); const natural = selected || allowed.find(project => query.toLowerCase().includes(project.name.toLowerCase())); try { await api.addGoal(natural ? { itemId: natural.id } : { title: query.trim() }); setAdding(false); setQuery(''); setSelected(null); reload(); } catch (e: any) { setError(e.message); } };
  const hiddenGoals = goals.filter(goal => goal.project?.spoilerTier === 'late-game').length;
  return <><Intro title="Farm goals" text="Choose a known building or machine and the journal fills in its verified cost and materials. Custom goals stay simple." /><section className="goals-box"><div className="section-heading"><div><small>Shared plans</small><h1>What are we working toward?</h1></div><button onClick={() => setAdding(value => !value)}>{adding ? 'Cancel' : '+ Add goal'}</button></div>{adding && <form className="goal-builder" onSubmit={submit}><label>What do you want to do?<input autoFocus value={query} onChange={event => { setQuery(event.target.value); setSelected(null); }} placeholder="Try “Build a silo”" required /></label>{suggestions.length > 0 && <div className="goal-suggestions">{suggestions.map(project => <button type="button" className={selected?.id === project.id ? 'selected' : ''} key={project.id} onClick={() => { setSelected(project); setQuery(`Build ${project.name}`); }}><ProjectIcon goal={project} /><span><strong>{project.name}</strong><small>{formatProjectRequirements(project)}</small></span></button>)}</div>}{selected && <div className="goal-preview"><strong>Verified requirements</strong><p>{formatProjectRequirements(selected)}</p>{selected.prerequisite && <small>Requires: {selected.prerequisite}</small>}</div>}<label className="check-label"><input type="checkbox" name="personal" disabled /> Shared farm goal</label>{error && <p className="form-error">{error}</p>}<button className="journal-primary">Add to goals</button><small>If no catalog match is selected, this will be saved as a custom goal without invented materials.</small></form>}<div className="goal-list">{goals.filter(goal => revealLateGame || goal.project?.spoilerTier !== 'late-game').map(goal => <article className={goal.completed ? 'done' : ''} key={goal.id}><button className="goal-check" onClick={async () => { await api.updateGoal(goal.id, !goal.completed); reload(); }}><UiIcon name={goal.completed?'check':'goals'}/></button><ProjectIcon goal={goal} /><div><strong>{goal.title}</strong><p>{formatGoalRequirements(goal)}</p>{goal.target?.prerequisite && <small>Requires: {goal.target.prerequisite}</small>}{goal.target?.source && <a href={goal.target.source} target="_blank" rel="noreferrer">Verify cost ↗</a>}</div><button className="delete-button" onClick={async () => { await api.deleteGoal(goal.id); reload(); }} aria-label={`Delete ${goal.title}`}>×</button></article>)}{!goals.length && !adding && <EmptyState text="No goals yet. “Build a Silo” is a friendly first one." />}</div></section>{!revealLateGame && (hiddenGoals > 0 || PROJECTS.some(project => project.spoilerTier === 'late-game')) && <SpoilerGate reveal={reveal} />}</>;
}

function VillagersTab({ farm, value, put, revealLateGame, reveal }: { farm: FarmData['farm']; value: (domain: string, id: string, player?: boolean) => any; put: (scope: 'shared' | 'player', domain: string, id: string, value: object) => void; revealLateGame: boolean; reveal: () => void }) {
  const [all, setAll] = useState(false); const villagers = VILLAGERS.filter(villager => revealLateGame || villager.spoilerTier !== 'late-game').map(villager => ({ ...villager, away: daysUntilBirthday(villager, farm.season, farm.day) })).sort((a, b) => a.away - b.away); const shown = all ? villagers : villagers.slice(0, 10);
  const setHearts = (id: string, n: number) => put('player', 'relationships', id, { ...(value('relationships', id, true) || {}), hearts: Math.max(0, Math.min(14, n)), source: 'manual' });
  return <><Intro title="Birthdays & loved gifts" text="Nearest birthdays first. Set your own heart level with each villager — it's tracked separately for each farmer." /><div className="villager-grid">{shown.map(villager => { const hearts = value('relationships', villager.id, true)?.hearts ?? value('hearts', villager.id, true)?.hearts ?? 0; return <article className={villager.away === 0 ? 'birthday-today' : villager.away <= 3 ? 'birthday-soon' : ''} key={villager.id}><header><GameIcon src={`/game-icons/villagers/${villager.id}.png`} label={villager.name} /><div><strong>{villager.name}</strong><small>{villager.birthday.season} {villager.birthday.day}</small></div><b>{villager.away === 0 ? 'Today!' : villager.away === 1 ? 'Tomorrow' : `${villager.away}d`}</b></header><div className="heart-track"><span>Your hearts</span><div className="heart-stepper"><button onClick={() => setHearts(villager.id, hearts - 1)} disabled={hearts <= 0} aria-label={`Lower your hearts with ${villager.name}`}>−</button><b>{hearts} <em>❤</em></b><button onClick={() => setHearts(villager.id, hearts + 1)} disabled={hearts >= 14} aria-label={`Raise your hearts with ${villager.name}`}>+</button></div></div><p>Loves</p><div className="gift-chips">{villager.lovedGifts.map(gift => <span key={gift}>{gift}</span>)}</div></article>; })}</div><button className="show-more" onClick={() => setAll(v => !v)}>{all ? 'Show fewer' : `Show all ${villagers.length} villagers`}</button>{!revealLateGame && <SpoilerGate reveal={reveal} />}</>;
}

function CalendarTab({ farm }: { farm: FarmData['farm'] }) {
  const [year, setYear] = useState(farm.year % 2 === 0 ? 2 : 1); const events = FESTIVALS.filter(event => event.season === farm.season).sort((a, b) => a.day - b.day); const recipes = QUEEN_OF_SAUCE.filter(entry => entry.year === year);
  return <><Intro title="Valley calendar" text="Festivals, weekly visits, birthdays, and the complete two-year Queen of Sauce rotation." /><section className="calendar-section"><h2><UiIcon name="calendar"/> {farm.season} events</h2><div className="calendar-rows">{events.map(event => <article className={event.day === farm.day ? 'today' : ''} key={event.id}><b>{event.day}</b><UiIcon name="calendar" label={event.name}/><div><strong>{event.name}</strong><small>{event.day === farm.day ? 'Today' : event.day > farm.day ? `In ${event.day - farm.day} days` : 'Earlier this season'}</small></div></article>)}</div></section><section className="calendar-section"><div className="section-heading"><div><small>Every Sunday</small><h1><UiIcon name="tv"/> Queen of Sauce</h1></div><div className="segmented"><button className={year === 1 ? 'active' : ''} onClick={() => setYear(1)}>Year 1</button><button className={year === 2 ? 'active' : ''} onClick={() => setYear(2)}>Year 2</button></div></div><div className="recipe-grid">{recipes.map(recipe => <article className={recipe.season === farm.season && recipe.day === farm.day && ((farm.year - 1) % 2) + 1 === year ? 'today' : ''} key={recipe.id}><span>{recipe.season.slice(0, 3)} {recipe.day}</span><strong>{recipe.name}</strong></article>)}</div><p className="gentle-note">New recipes air on Sundays. Wednesday reruns can help you catch recipes you missed.</p></section></>;
}

function FishingTab({ farm, value, put, isRaining, openTab }: { farm: FarmData['farm']; value: (domain: string, id: string) => any; put: (scope: 'shared' | 'player', domain: string, id: string, value: object) => void; isRaining: boolean; openTab: (tab: TabId) => void }) {
  const [season, setSeason] = useState('Current');
  const [weather, setWeather] = useState('Any');
  const [location, setLocation] = useState('All');
  const locations = useMemo(() => [...new Set(FISH.flatMap(fish => fish.locations))].sort(), []);
  const caught = (id: string) => value('fish', id)?.completed === true;
  const caughtCount = FISH.filter(fish => caught(fish.id)).length;
  const inSeason = (fish: typeof FISH[number], target: string) => (fish.seasons as readonly string[]).some(entry => entry === 'All' || entry === target);
  const weatherNow = isRaining ? 'Rain' : 'Sunny';
  const catchable = FISH.filter(fish => inSeason(fish, farm.season));
  const rightNow = catchable.filter(fish => fish.weather === 'Any' || fish.weather === weatherNow);
  const otherWeather = catchable.filter(fish => !(fish.weather === 'Any' || fish.weather === weatherNow));
  const filtered = FISH
    .filter(fish => season === 'All' || inSeason(fish, season === 'Current' ? farm.season : season))
    .filter(fish => weather === 'Any' || fish.weather === weather || fish.weather === 'Any')
    .filter(fish => location === 'All' || fish.locations.includes(location));
  const card = (fish: typeof FISH[number]) => {
    const done = caught(fish.id);
    return <article className={`fish-card ${done ? 'caught' : ''}`} key={fish.id}>
      <header>
        <button className="fish-check" onClick={() => put('shared', 'fish', fish.id, { completed: !done })} aria-label={`Mark ${fish.name} ${done ? 'not caught' : 'caught'}`}><UiIcon name={done?'check':'fishing'}/></button>
        <GameIcon src={fish.iconPath} label={fish.name} />
        <div><strong>{fish.name}</strong><small>{fish.seasons.join(' · ')}</small></div>
        {fish.weather !== 'Any' && <b className={`weather-chip ${fish.weather.toLowerCase()}`}><><UiIcon name={fish.weather==='Rain'?'rain':'sun'}/> {fish.weather}</></b>}
      </header>
      <p>{fish.locations.join(', ')} · {fish.time}</p>
      {fish.bundle && <button className="bundle-chip" onClick={() => openTab('bundles')}><UiIcon name="bundles"/> {fish.bundle.replaceAll('-', ' ')} bundle</button>}
    </article>;
  };
  return <>
    <Intro title="Fishing guide" text={`Every catch verified for 1.6.15. Checking a fish here also updates the public fishing reference.`} />
    <section className="journal-card fishing-progress"><div className="section-heading"><div><small>Collection</small><h1><UiIcon name="fishing"/> {caughtCount} of {FISH.length} fish caught</h1></div></div><div className="season-progress"><i style={{ width: `${caughtCount / FISH.length * 100}%` }} /></div></section>
    <section className="journal-card full"><div className="section-heading"><div><small>{farm.season}, {isRaining ? 'rainy' : 'clear skies'}</small><h1>Catchable today</h1></div></div>
      <div className="fish-grid">{rightNow.map(card)}</div>
      {otherWeather.length > 0 && <><h2 className="fish-subheading">Waiting for {isRaining ? 'sun' : 'rain'}</h2><div className="fish-grid dimmed">{otherWeather.map(card)}</div></>}
    </section>
    <section className="journal-card full"><div className="section-heading"><div><small>All {FISH.length} fish</small><h1>Full catalog</h1></div></div>
      <div className="planner-controls fish-filters">
        <label>Season<select value={season} onChange={event => setSeason(event.target.value)}><option value="Current">Current ({farm.season})</option><option value="All">All seasons</option>{['Spring', 'Summer', 'Fall', 'Winter'].map(entry => <option key={entry}>{entry}</option>)}</select></label>
        <label>Weather<select value={weather} onChange={event => setWeather(event.target.value)}><option>Any</option><option>Sunny</option><option>Rain</option></select></label>
        <label>Location<select value={location} onChange={event => setLocation(event.target.value)}><option>All</option>{locations.map(entry => <option key={entry}>{entry}</option>)}</select></label>
      </div>
      <div className="fish-grid">{filtered.map(card)}</div>
      {!filtered.length && <div className="empty-state"><UiIcon name="fishing" size={36}/><h3>No fish match those filters</h3><p>Try widening the season or weather filter.</p></div>}
    </section>
  </>;
}

function ReferenceTab({ revealLateGame, reveal, hide }: { revealLateGame: boolean; reveal: () => void; hide: () => void }) {
  const [query, setQuery] = useState(''); const results = query.trim().length > 1 ? searchCatalog(query, undefined, revealLateGame).slice(0, 30) : [];
  return <><Intro title="Verified reference" text="Search crops, fish, villagers, bundles, buildings, calendar entries, and major collection milestones." /><div className="reference-search"><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search for a crop, fish, gift, bundle, or building…" aria-label="Search the Stardew reference" /><span>⌕</span></div>{results.length > 0 && <div className="reference-results">{results.map((record: any) => <article key={`${record.domain}:${record.id}`}><GameIcon src={record.iconPath} label={record.name} size={30}/><div><strong>{record.name}</strong><small>{record.domain} · {record.gameVersion}</small><p>{referenceSummary(record)}</p></div><a href={record.source} target="_blank" rel="noreferrer">Source ↗</a></article>)}</div>}{query.length > 1 && !results.length && <p className="empty-note">No spoiler-safe matches found.</p>}{revealLateGame ? <button className="spoiler-reset" onClick={hide}>Hide late-game details again</button> : <SpoilerGate reveal={reveal} />}</>;
}

function AssistantTab({ revealLateGame, reveal }: { revealLateGame: boolean; reveal: () => void }) {
  const [plan, setPlan] = useState<any>(null); const [loading, setLoading] = useState(true); const [planError, setPlanError] = useState(false); const [messages, setMessages] = useState<Array<{ role: string; text: string; warning?: boolean }>>([{ role: 'assistant', text: 'Well met, farmer. Ask me of a crop deadline, a bundle, a loved gift, the fish that bite today, or a building you dream of raising — and the valley will answer. I will keep late-game secrets veiled until you choose to see them.' }]); const [busy, setBusy] = useState(false); const [concise, setConcise] = useState(() => localStorage.getItem('oracle-concise') === '1'); const end = useRef<HTMLDivElement>(null);
  const refresh = () => { setLoading(true); setPlanError(false); api.dailyPlan().then(setPlan).catch(() => setPlanError(true)).finally(() => setLoading(false)); };
  useEffect(refresh, []);
  // scrollIntoView returns a Promise in newer Chromium; don't let the effect return it.
  useEffect(() => { end.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);
  const submit = async (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); const form = event.currentTarget; const question = new FormData(form).get('question')?.toString().trim(); if (!question || busy) return; setMessages(rows => [...rows, { role: 'user', text: question }]); form.reset(); setBusy(true); try { const answer = await api.chat(question, concise); setMessages(rows => [...rows, { role: 'assistant', text: answer.answer, warning: answer.requiresSpoilerConfirmation }]); } catch (error: any) { setMessages(rows => [...rows, { role: 'assistant', text: `I couldn't answer that: ${error.message}` }]); } finally { setBusy(false); } };
  return <><Intro title="Valley oracle" text="The oracle reads your farm date and the verified local catalog. Late-game lore stays veiled until you reveal it." /><div className="assistant-grid"><section className="daily-plan"><div className="section-heading"><div><small>Progress-aware</small><h1>Daily plan</h1></div><button onClick={refresh}><UiIcon name="refresh"/> Refresh</button></div>{loading ? <div className="skeleton-stack" aria-label="Loading daily plan"><i /><i /><i /></div> : planError ? <div className="plan-error"><p>The daily plan couldn't be fetched.</p><button onClick={refresh}>Try again</button></div> : <><p>{plan?.summary}</p>{plan?.cards?.map((card: any, index: number) => <article key={index}><b>{index + 1}</b><div><strong>{card.title}</strong><small>{card.reason}</small></div></article>)}</>}</section><section className="journal-chat"><div className="chat-log" aria-live="polite">{messages.map((message, index) => <div className={`chat-message ${message.role} ${message.warning ? 'warning' : ''}`} key={index}><b>{message.role === 'assistant' ? <UiIcon name="oracle"/> : 'You'}</b><p>{message.role === 'assistant' ? <Typewriter text={message.text} onType={() => end.current?.scrollIntoView({ block: 'end' })} /> : message.text}</p>{message.warning && !revealLateGame && <button onClick={reveal}>Review spoiler warning</button>}</div>)}{busy && <div className="chat-message assistant"><b><UiIcon name="oracle"/></b><p className="oracle-gazing">The oracle gazes into the mists…</p></div>}<div ref={end} /></div><label className="concise-toggle" title="Ask the oracle to keep answers short"><input type="checkbox" checked={concise} onChange={event => { setConcise(event.target.checked); localStorage.setItem('oracle-concise', event.target.checked ? '1' : '0'); }} /><span>Concise answers</span></label><form onSubmit={submit}><input name="question" maxLength={1000} placeholder="Ask the oracle…" aria-label="Ask the valley oracle a Stardew question" /><button disabled={busy}>Ask</button></form></section></div></>;
}

function SpoilerGate({ reveal }: { reveal: () => void }) {
  const [confirm, setConfirm] = useState(false); return <section className="spoiler-gate"><UiIcon name="warning"/><div><strong>Late-game details are tucked away</strong><p>This section can reveal future locations, people, or progression systems.</p></div>{confirm ? <div className="spoiler-confirm"><button onClick={() => setConfirm(false)}>Keep hidden</button><button className="danger" onClick={reveal}>Reveal late-game details</button></div> : <button onClick={() => setConfirm(true)}>Show warning</button>}</section>;
}

function InviteModal({ close, done }: { close: () => void; done: () => void }) {
  const [error, setError] = useState(''); const submit = async (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); try { await api.invite(Object.fromEntries(new FormData(event.currentTarget))); done(); } catch (e: any) { setError(e.message); } }; return <div className="modal-backdrop" onMouseDown={close}><form className="journal-modal" onSubmit={submit} onMouseDown={event => event.stopPropagation()}><button type="button" className="modal-close" onClick={close}>×</button><UiIcon name="people" size={36}/><h2>Invite your co-farmer</h2><label>Display name<input name="displayName" required maxLength={40} /></label><label>Username<input name="username" required minLength={3} /></label><label>Password<input name="password" type="password" required minLength={10} /></label>{error && <p className="form-error">{error}</p>}<button className="journal-primary">Create second account</button></form></div>;
}

function Intro({ title, text }: { title: string; text: string }) { return <header className="tab-intro"><h1>{title}</h1><p>{text}</p></header>; }
function EmptyState({ text }: { text: string }) { return <div className="empty-state"><UiIcon name="leaf" size={36}/><p>{text}</p></div>; }
function Typewriter({ text, onType }: { text: string; onType?: () => void }) {
  const reduced = useMemo(() => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false, []);
  const [count, setCount] = useState(reduced ? text.length : 0);
  useEffect(() => {
    if (reduced) { setCount(text.length); return; }
    setCount(0); let i = 0;
    const id = window.setInterval(() => { i += 1; setCount(i); onType?.(); if (i >= text.length) window.clearInterval(id); }, 18);
    return () => window.clearInterval(id);
  }, [text, reduced]);
  return <span className="typewriter" aria-label={text}>{text.slice(0, count)}{count < text.length && <b className="tw-caret" aria-hidden="true" />}</span>;
}
function saveLabel(state: SaveState) { return ({ idle: 'Saved', saved: 'Saved', saving: 'Saving…', retrying: 'Refetching after a conflict…', offline: 'Offline — changes not saved', failed: 'Save failed' } as const)[state]; }
function formatProjectRequirements(project: Project) { return [...(project.cost ? [`${project.cost.toLocaleString()}g`] : []), ...Object.entries(project.materials).map(([name, count]) => `${count} ${name}`)].join(' · ') || 'No material cost'; }
function formatGoalRequirements(goal: any) { const requirements = Object.entries(goal.requirements || {}).map(([name, count]) => `${count} ${name}`); if (goal.target?.cost) requirements.unshift(`${Number(goal.target.cost).toLocaleString()}g`); return requirements.join(' · ') || 'Custom goal'; }
function referenceSummary(record: any) { if (record.materials) return formatProjectRequirements(record); if (record.birthday) return `Birthday: ${record.birthday.season} ${record.birthday.day}`; if (record.seasons) return record.seasons.join(' · '); if (record.reward) return `Reward: ${record.reward}`; return record.description || ''; }
