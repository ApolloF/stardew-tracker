import { useEffect, useMemo, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { BUNDLE_ROOMS, CATALOG, type CatalogDomain } from '@stardew/game-data';
import { api, type SaveState, type Session } from '../api';

const labels: Record<string, string> = { crops: 'Crop planner', bundles: 'Community Center', fish: 'Fishing guide', villagers: 'Villager guide', calendar: 'Valley calendar', projects: 'Build planner', perfection: 'Perfection tracker' };

export default function ReferencePageSafe({ session }: { session: Session }) {
  const { domain = 'crops' } = useParams();
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState(params.get('q') || '');
  const [season, setSeason] = useState('All');
  const [progress, setProgress] = useState<Record<string, boolean>>({});
  const [saveState, setSaveState] = useState<SaveState>('idle');
  const [revealed, setRevealed] = useState(() => localStorage.getItem('public-late-game') === 'revealed');
  const [confirm, setConfirm] = useState(false);
  const valid = (domain in CATALOG ? domain : 'crops') as CatalogDomain;

  useEffect(() => { setParams(query ? { q: query } : {}, { replace: true }); }, [query]);
  useEffect(() => { if (session.user) api.farm().then(data => { const out: Record<string, boolean> = {}; for (const item of data.progress) if (item.domain === valid && item.value?.completed) out[item.itemId] = true; setProgress(out); }); }, [valid, session.user]);
  const items = useMemo(() => {
    let rows: any[] = [...CATALOG[valid]].filter(item => revealed || item.spoilerTier !== 'late-game');
    const needle = query.toLowerCase().trim();
    if (needle) rows = rows.filter(item => `${item.id} ${item.name} ${item.description || ''} ${JSON.stringify(item)}`.toLowerCase().includes(needle));
    if (season !== 'All') rows = rows.filter(item => item.seasons?.includes(season) || item.season === season || item.birthday?.season === season);
    return rows;
  }, [valid, query, season, revealed]);
  const track = async (id: string) => {
    const next = !progress[id]; setProgress(current => ({ ...current, [id]: next })); setSaveState('saving');
    try { await api.putProgress(valid === 'villagers' ? 'player' : 'shared', valid, id, { completed: next }); setSaveState('saved'); window.setTimeout(() => setSaveState('idle'), 1500); }
    catch (error: any) { setProgress(current => ({ ...current, [id]: !next })); setSaveState(error.offline ? 'offline' : 'failed'); }
  };
  const reveal = () => { localStorage.setItem('public-late-game', 'revealed'); setRevealed(true); setConfirm(false); };

  return <section className="reference-page"><aside className="reference-nav"><span className="eyebrow">Reference</span>{Object.entries(labels).map(([id, label]) => <Link className={valid === id ? 'active' : ''} key={id} to={`/reference/${id}`}>{label}</Link>)}</aside><div className="reference-content"><div className="reference-header"><div><span className="eyebrow">Verified for 1.6.15</span><h1>{labels[valid]}</h1><p>{items.length} spoiler-safe matching entries · facts link to their source.</p></div>{session.user && <span className={`save-pill ${saveState}`}>{saveState === 'idle' ? 'Private tracking on' : saveState}</span>}</div><div className="filter-bar"><input aria-label="Search this section" value={query} onChange={event => setQuery(event.target.value)} placeholder={`Search ${labels[valid].toLowerCase()}…`} />{['crops', 'fish', 'calendar', 'villagers'].includes(valid) && <select aria-label="Season filter" value={season} onChange={event => setSeason(event.target.value)}><option>All</option>{['Spring', 'Summer', 'Fall', 'Winter'].map(value => <option key={value}>{value}</option>)}</select>}</div>{valid === 'bundles' ? <BundleGrid session={session} progress={progress} track={track} query={query} revealed={revealed} /> : <div className={`catalog-grid domain-${valid}`}>{items.map((item: any) => <article className={`catalog-card ${progress[item.id] ? 'complete' : ''}`} key={item.id}><div className="catalog-card-top"><span className="catalog-emoji">{item.emoji}</span><div><h2>{item.name}</h2><small>{subtitle(item)}</small></div>{session.user && <button className="round-check" aria-label={`Mark ${item.name} complete`} onClick={() => track(item.id)}>{progress[item.id] ? '✓' : '○'}</button>}</div><p>{details(item, valid)}</p>{item.lovedGifts && <div className="chips">{item.lovedGifts.map((gift: string) => <span key={gift}>{gift}</span>)}</div>}{item.materials && <MaterialList materials={item.materials} />}<a className="source-link" href={item.source} target="_blank" rel="noreferrer">Verify source ↗</a></article>)}</div>}{revealed ? <button className="secondary-button" onClick={() => { localStorage.removeItem('public-late-game'); setRevealed(false); }}>Hide late-game details again</button> : <section className="panel" style={{ marginTop: '1rem' }}><span className="eyebrow">Spoiler protection</span><h2>Late-game entries are hidden</h2><p className="empty-copy">Future locations, people, and progression systems stay out of this reference until you choose to reveal them.</p>{confirm ? <div className="hero-actions"><button className="secondary-button" onClick={() => setConfirm(false)}>Keep hidden</button><button className="primary-button" onClick={reveal}>Reveal late-game details</button></div> : <button className="secondary-button" onClick={() => setConfirm(true)}>Show warning</button>}</section>}</div></section>;
}

function subtitle(item: any) { if (item.seasons) return item.seasons.join(' · '); if (item.birthday) return `${item.birthday.season} ${item.birthday.day}`; if (item.season) return `${item.season} ${item.day}${item.year ? ` · Year ${item.year}` : ''}`; if (item.category) return item.category; return item.gameVersion; }
function details(item: any, domain: string) { if (domain === 'crops') return `${item.growthDays} days to first harvest${item.regrowDays ? `, then every ${item.regrowDays} days` : ''}. Seeds: ${item.seedSource}. Base sell: ${item.sellPrice}g.`; if (domain === 'fish') return `${item.locations.join(', ')} · ${item.time} · ${item.weather} weather${item.bundle ? ` · ${item.bundle.replaceAll('-', ' ')} bundle` : ''}.`; return item.description || item.reward || ''; }
function MaterialList({ materials }: { materials: Record<string, number> }) { return <div className="materials">{Object.entries(materials).map(([name, count]) => <span key={name}><b>{count}</b> {name}</span>)}</div>; }
function BundleGrid({ session, progress, track, query, revealed }: { session: Session; progress: Record<string, boolean>; track: (id: string) => void; query: string; revealed: boolean }) { return <div className="rooms">{BUNDLE_ROOMS.filter(room => revealed || room.spoilerTier !== 'late-game').map(room => <section className="room" key={room.id}><div className="room-title"><span>{room.emoji}</span><div><h2>{room.name}</h2><p>Room reward: {room.reward}</p></div></div><div className="bundle-grid">{room.bundles.filter(bundle => !query || JSON.stringify(bundle).toLowerCase().includes(query.toLowerCase())).map(bundle => { const done = bundle.items.filter(item => progress[`${bundle.id}:${item.id}`]).length; return <details className={done >= bundle.required ? 'bundle complete' : 'bundle'} key={bundle.id}><summary><span><strong>{bundle.name}</strong><small>Reward: {bundle.reward}</small></span><b>{done}/{bundle.required}</b></summary><ul>{bundle.items.map(item => { const id = `${bundle.id}:${item.id}`; return <li className={progress[id] ? 'done' : ''} key={item.id}>{session.user ? <button onClick={() => track(id)}>{progress[id] ? '✓' : '○'}</button> : <span>○</span>}<div><strong>{item.name}{item.quantity && item.quantity > 1 ? ` ×${item.quantity}` : ''}{item.quality ? ` · ${item.quality}+` : ''}</strong><small>{item.hint}</small></div></li>; })}</ul></details>; })}</div></section>)}</div>; }
