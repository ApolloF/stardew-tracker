import { useState } from 'react';
import { BUILDINGS, CRAFTABLES, WILLY_BOAT } from '../data/buildings';

const CATEGORY_LABELS = {
  building: '🏗️ Farm Buildings',
  storage: '📦 Storage',
  processing: '⚙️ Processing Machines',
  farming: '🌾 Farming Tools',
};

function BoatTracker({ progress, onUpdate }) {
  const boatProgress = progress.boatParts || {};

  const toggle = (partId) => {
    const updated = { ...boatProgress, [partId]: !boatProgress[partId] };
    onUpdate({ boatParts: updated });
  };

  const done = WILLY_BOAT.parts.filter(p => boatProgress[p.id]).length;
  const complete = done === WILLY_BOAT.parts.length;

  return (
    <div className={`boat-section ${complete ? 'project-complete' : ''}`}>
      <div className="boat-header">
        <span className="boat-emoji">{WILLY_BOAT.emoji}</span>
        <div>
          <div className="boat-name">{WILLY_BOAT.name}</div>
          <div className="boat-desc">{WILLY_BOAT.description}</div>
        </div>
        <span className="boat-count">{done}/{WILLY_BOAT.parts.length}</span>
      </div>
      <div className="boat-hint">💡 {WILLY_BOAT.hint}</div>
      <div className="boat-parts">
        {WILLY_BOAT.parts.map(part => {
          const checked = !!boatProgress[part.id];
          return (
            <div
              key={part.id}
              className={`boat-part ${checked ? 'part-done' : ''}`}
              onClick={() => toggle(part.id)}
            >
              <span className="part-cb">{checked ? '✅' : '⬜'}</span>
              <span className="part-emoji">{part.emoji}</span>
              <div className="part-info">
                <div className="part-name">{part.name} ×{part.qty}</div>
                <div className="part-hint">💡 {part.hint}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ProjectRow({ item, progress, onUpdate }) {
  const proj = progress.projects?.[item.id] || { goal: 1, done: 0 };

  const setGoal = (val) => {
    const g = Math.max(1, Math.min(99, parseInt(val) || 1));
    onUpdate({ projects: { ...progress.projects, [item.id]: { ...proj, goal: g } } });
  };

  const setDone = (val) => {
    const d = Math.max(0, Math.min(proj.goal, parseInt(val) || 0));
    onUpdate({ projects: { ...progress.projects, [item.id]: { ...proj, done: d } } });
  };

  const increment = () => setDone(proj.done + 1);
  const decrement = () => setDone(proj.done - 1);
  const complete = proj.done >= proj.goal;
  const pct = Math.min(100, Math.round((proj.done / proj.goal) * 100));

  return (
    <div className={`project-row ${complete ? 'proj-complete' : ''}`}>
      <span className="proj-emoji">{item.emoji}</span>
      <div className="proj-info">
        <div className="proj-name">
          {item.name}
          {complete && <span className="proj-done-badge">✅</span>}
        </div>
        <div className="proj-desc">{item.description}</div>
        <div className="proj-materials">🪵 {item.materials}</div>
        <div className="proj-bar">
          <div className="proj-bar-fill" style={{ width: `${pct}%` }} />
        </div>
      </div>
      <div className="proj-controls">
        <div className="proj-counter">
          <button onClick={decrement} disabled={proj.done <= 0}>−</button>
          <span className="proj-count">{proj.done}</span>
          <button onClick={increment} disabled={proj.done >= proj.goal}>+</button>
        </div>
        <div className="proj-goal-row">
          <span className="goal-label">Goal:</span>
          <input
            className="goal-input"
            type="number"
            min={1} max={99}
            value={proj.goal}
            onChange={e => setGoal(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}

export default function ProjectTracker({ progress, onUpdate }) {
  const [openCategories, setOpenCategories] = useState({ building: true, farming: true });

  const toggleCat = (cat) => setOpenCategories(o => ({ ...o, [cat]: !o[cat] }));

  const buildingsByCategory = {
    building: BUILDINGS,
    ...Object.fromEntries(
      ['storage', 'processing', 'farming'].map(cat => [cat, CRAFTABLES.filter(c => c.category === cat)])
    ),
  };

  return (
    <div className="project-tracker">
      {/* Willy's Boat */}
      <section className="proj-section">
        <h3 className="proj-section-title">⛵ Special</h3>
        <BoatTracker progress={progress} onUpdate={onUpdate} />
      </section>

      {/* Buildings & Craftables */}
      {Object.entries(CATEGORY_LABELS).map(([cat, label]) => {
        const items = buildingsByCategory[cat] || [];
        const isOpen = openCategories[cat];
        return (
          <section key={cat} className="proj-section">
            <button className="proj-section-header" onClick={() => toggleCat(cat)}>
              <h3 className="proj-section-title">{label}</h3>
              <span className="proj-chevron">{isOpen ? '▲' : '▼'}</span>
            </button>
            {isOpen && (
              <div className="proj-rows">
                {items.map(item => (
                  <ProjectRow
                    key={item.id}
                    item={item}
                    progress={progress}
                    onUpdate={onUpdate}
                  />
                ))}
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}
