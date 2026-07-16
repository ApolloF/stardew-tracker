import { useState } from 'react';
import { getUpcomingBirthdays } from '../data/npcs';

const SEASON_COLOR = { Spring: '#88c060', Summer: '#f0b030', Fall: '#d06820', Winter: '#80aad0' };

export default function BirthdayTracker({ progress }) {
  const { season, day, year = 1 } = progress;
  const [showAll, setShowAll] = useState(false);

  const all = getUpcomingBirthdays(season, day, year);
  const displayed = showAll ? all : all.slice(0, 8);

  const upcoming = all.filter(n => n.daysAway <= 7);

  return (
    <div className="birthday-tracker">
      {upcoming.length > 0 && (
        <div className="upcoming-alert">
          <span className="alert-icon">🎂</span>
          <div>
            <strong>Upcoming this week:</strong>{' '}
            {upcoming.map(n => (
              <span key={n.id} className="alert-chip">
                {n.emoji} {n.name}
                {n.daysAway === 0
                  ? ' — TODAY! 🎉'
                  : n.daysAway === 1
                  ? ' — tomorrow!'
                  : ` — in ${n.daysAway}d`}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="birthday-grid">
        {displayed.map(npc => {
          const isToday = npc.daysAway === 0;
          const isSoon = npc.daysAway <= 3 && !isToday;
          const wraps = npc.daysAway > 28 * 4 - 10; // roughly next year

          return (
            <div
              key={npc.id}
              className={`birthday-card ${isToday ? 'birthday-today' : ''} ${isSoon ? 'birthday-soon' : ''}`}
            >
              <div className="bday-header">
                <span className="bday-emoji">{npc.emoji}</span>
                <div className="bday-info">
                  <div className="bday-name">{npc.name}</div>
                  <div className="bday-date" style={{ color: SEASON_COLOR[npc.season] }}>
                    {npc.season} {npc.day}
                  </div>
                </div>
                <div className="bday-days-away">
                  {isToday ? (
                    <span className="days-badge today">🎉 Today!</span>
                  ) : (
                    <span className={`days-badge ${npc.daysAway <= 3 ? 'urgent' : npc.daysAway <= 7 ? 'soon' : ''}`}>
                      {npc.daysAway === 1 ? 'Tomorrow' : `${npc.daysAway}d`}
                      {wraps && ' (next yr)'}
                    </span>
                  )}
                </div>
              </div>

              <div className="bday-gifts">
                <span className="gifts-label">💝 Loved gifts:</span>
                <div className="gifts-list">
                  {npc.loves.map(g => (
                    <span key={g} className="gift-chip">{g}</span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <button className="show-all-btn" onClick={() => setShowAll(s => !s)}>
        {showAll ? '▲ Show fewer' : `▼ Show all ${all.length} villagers`}
      </button>
    </div>
  );
}
