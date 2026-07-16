import { useState } from 'react';

const SEASONS = ['Spring', 'Summer', 'Fall', 'Winter'];
const SEASON_EMOJI = { Spring: '🌸', Summer: '☀️', Fall: '🍂', Winter: '❄️' };
const SEASON_COLOR = { Spring: '#88c060', Summer: '#f0b030', Fall: '#d06820', Winter: '#80aad0' };

export default function Header({ progress, onUpdate, darkMode, onToggleDark }) {
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(progress.farmName || 'My Farm');

  const { season, year, day } = progress;
  const pct = Math.round((day / 28) * 100);

  const setDay = (d) => onUpdate({ day: Math.max(1, Math.min(28, d)) });

  const advanceSeason = () => {
    const idx = SEASONS.indexOf(season);
    idx < SEASONS.length - 1
      ? onUpdate({ season: SEASONS[idx + 1], day: 1 })
      : onUpdate({ season: 'Spring', year: year + 1, day: 1 });
  };
  const rewindSeason = () => {
    const idx = SEASONS.indexOf(season);
    idx > 0
      ? onUpdate({ season: SEASONS[idx - 1], day: 1 })
      : year > 1 && onUpdate({ season: 'Winter', year: year - 1, day: 1 });
  };

  const saveName = () => {
    setEditingName(false);
    onUpdate({ farmName: nameInput.trim() || 'My Farm' });
  };

  return (
    <header className="header">
      <div className="header-inner">
        <div className="header-top">
          <div className="farm-name-wrap">
            <span className="farm-icon">🌾</span>
            {editingName ? (
              <input className="farm-name-input" value={nameInput}
                onChange={e => setNameInput(e.target.value)}
                onBlur={saveName} onKeyDown={e => e.key === 'Enter' && saveName()}
                autoFocus maxLength={30} />
            ) : (
              <button className="farm-name-btn" onClick={() => setEditingName(true)} title="Click to rename">
                {progress.farmName || 'My Farm'}<span className="edit-icon">✏️</span>
              </button>
            )}
          </div>

          <div className="header-right">
            <div className="season-badge" style={{ '--season-color': SEASON_COLOR[season] }}>
              {SEASON_EMOJI[season]} {season} · Year {year}
            </div>
            <button className="dark-toggle" onClick={onToggleDark} title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}>
              {darkMode ? '☀️' : '🌙'}
            </button>
          </div>
        </div>

        <div className="day-controls">
          <button className="season-nav-btn" onClick={rewindSeason} title="Previous season">‹</button>
          <div className="day-bar-wrap">
            <div className="day-label-row">
              <span className="day-label">Day {day} of 28</span>
              <div className="day-stepper">
                <button onClick={() => setDay(day - 1)} disabled={day <= 1}>−</button>
                <button onClick={() => setDay(day + 1)} disabled={day >= 28}>+</button>
              </div>
            </div>
            <div className="season-bar">
              <div className="season-bar-fill" style={{ width: `${pct}%`, background: SEASON_COLOR[season] }} />
              {season === 'Spring' && <>
                <div className="event-marker" style={{ left: `${(13/28)*100}%` }} title="Egg Festival 🥚" />
                <div className="event-marker" style={{ left: `${(24/28)*100}%` }} title="Flower Dance 💃" />
              </>}
            </div>
            {season === 'Spring' && (
              <div className="event-hints">
                {day < 13  && <span className="event-chip">🥚 Egg Festival: Spring 13</span>}
                {day >= 13 && day < 24 && <span className="event-chip">💃 Flower Dance: Spring 24</span>}
                {day >= 24 && <span className="event-chip">🌸 Spring ending soon!</span>}
              </div>
            )}
          </div>
          <button className="season-nav-btn" onClick={advanceSeason} title="Next season">›</button>
        </div>
      </div>
    </header>
  );
}
