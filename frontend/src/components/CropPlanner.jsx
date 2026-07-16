import { useState } from 'react';
import { SPRING_CROPS } from '../data/crops';
import { FERTILIZERS, adjustedDays, lastPlantDayWithFertilizer } from '../data/fertilizers';

function getPlantingStatus(crop, currentDay, fertilizerId) {
  const last = lastPlantDayWithFertilizer(crop.days, fertilizerId);
  if (currentDay > last) return 'too-late';
  if (currentDay >= last - 4) return 'urgent';
  if (currentDay >= last - 8) return 'soon';
  return 'fine';
}

const STATUS_LABEL = {
  fine:       { label: '✅ Good to plant', color: '#5a8a3e', bg: '#f0f8e8' },
  soon:       { label: '⚡ Plant soon!',   color: '#c07030', bg: '#fef6e0' },
  urgent:     { label: '⚠️ Last chance!', color: '#c03030', bg: '#fef0f0' },
  'too-late': { label: '❌ Too late',      color: '#909090', bg: '#f4f4f4' },
};

function CropCard({ crop, currentDay, season, fertilizerId }) {
  const status = season === 'Spring' ? getPlantingStatus(crop, currentDay, fertilizerId) : 'too-late';
  const s = STATUS_LABEL[status];
  const growDays = adjustedDays(crop.days, fertilizerId);
  const lastDay = lastPlantDayWithFertilizer(crop.days, fertilizerId);
  const harvestOn = Math.min(currentDay + growDays, 28);
  const isBundleItem = crop.bundleUse.length > 0;
  const fert = FERTILIZERS.find(f => f.id === fertilizerId);
  const isFaster = fert && fert.speedMultiplier < 1;
  const savedDays = crop.days - growDays;

  return (
    <div className="crop-card" style={{ '--status-bg': s.bg, '--status-color': s.color }}>
      <div className="crop-top">
        <span className="crop-emoji">{crop.emoji}</span>
        <div className="crop-info">
          <div className="crop-name">
            {crop.name}
            {isBundleItem && <span className="bundle-badge">📋 Bundle</span>}
            {fert?.qualityBoost && fert.qualityBoost !== 'none' && (
              <span className="quality-badge">⭐ Quality+</span>
            )}
          </div>
          <div className="crop-source">📍 {crop.source}</div>
        </div>
        <div className="crop-status" style={{ color: s.color, background: s.bg }}>{s.label}</div>
      </div>

      <div className="crop-details">
        <div className="crop-stat">
          <span className="stat-label">Grows in</span>
          <span className="stat-val">
            {growDays}d
            {isFaster && savedDays > 0 && <span className="fert-saved"> (-{savedDays}d 🌀)</span>}
          </span>
        </div>
        {crop.regrow && <div className="crop-stat"><span className="stat-label">Regrows</span><span className="stat-val">every {crop.regrow}d</span></div>}
        {crop.seedPrice && <div className="crop-stat"><span className="stat-label">Seed</span><span className="stat-val">{crop.seedPrice}g</span></div>}
        <div className="crop-stat"><span className="stat-label">Sells for</span><span className="stat-val">{crop.sellPrice}g</span></div>
        {status !== 'too-late' && <div className="crop-stat"><span className="stat-label">Harvest by</span><span className="stat-val">Day {harvestOn}</span></div>}
        {status !== 'too-late' && (
          <div className="crop-stat">
            <span className="stat-label">Last plant</span>
            <span className="stat-val">
              Day {lastDay}
              {isFaster && savedDays > 0 && lastDay !== crop.lastPlantDay && <span className="fert-saved"> (was {crop.lastPlantDay})</span>}
            </span>
          </div>
        )}
      </div>

      <div className="crop-hint">💡 {crop.hint}</div>
    </div>
  );
}

export default function CropPlanner({ progress }) {
  const { season, day } = progress;
  const [fertilizerId, setFertilizerId] = useState('none');
  const selectedFert = FERTILIZERS.find(f => f.id === fertilizerId) || FERTILIZERS[0];
  const crops = season === 'Spring' ? SPRING_CROPS : [];

  const sortedCrops = [...crops].sort((a, b) => {
    const order = { fine: 0, soon: 1, urgent: 2, 'too-late': 3 };
    const sa = getPlantingStatus(a, day, fertilizerId);
    const sb = getPlantingStatus(b, day, fertilizerId);
    if (order[sa] !== order[sb]) return order[sa] - order[sb];
    if (a.bundleUse.length !== b.bundleUse.length) return b.bundleUse.length - a.bundleUse.length;
    const p = { high: 0, medium: 1, low: 2 };
    return p[a.priority] - p[b.priority];
  });

  const plantable = sortedCrops.filter(c => getPlantingStatus(c, day, fertilizerId) !== 'too-late');
  const tooLate  = sortedCrops.filter(c => getPlantingStatus(c, day, fertilizerId) === 'too-late');

  if (crops.length === 0) {
    return (
      <div className="crop-planner empty">
        <div className="empty-state">
          <div className="empty-emoji">🌱</div>
          <h3>Crop data coming soon for {season}!</h3>
          <p>Visit Pierre's shop to see what seeds are available this season.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="crop-planner">
      <div className="planner-header-row">
        <div className="planner-intro">
          <h2>🌸 {season} Crops — Day {day}</h2>
          <p>{plantable.length} crops still plantable this season</p>
        </div>

        <div className="fertilizer-panel">
          <div className="fert-label">🧪 Fertilizer:</div>
          <div className="fert-selector">
            {FERTILIZERS.map(f => (
              <button
                key={f.id}
                className={`fert-btn ${fertilizerId === f.id ? 'fert-active' : ''}`}
                style={fertilizerId === f.id ? { borderColor: f.color, color: f.color, background: f.color + '18' } : {}}
                onClick={() => setFertilizerId(f.id)}
                title={f.description}
              >
                {f.emoji} {f.name}
              </button>
            ))}
          </div>
          {selectedFert.id !== 'none' && (
            <div className="fert-desc">
              ℹ️ {selectedFert.description}
              {selectedFert.speedMultiplier < 1 && (
                <strong> Crops grow {Math.round((1 - selectedFert.speedMultiplier) * 100)}% faster — you can plant later!</strong>
              )}
            </div>
          )}
        </div>
      </div>

      {plantable.length > 0 && (
        <section className="crop-section">
          <h3 className="section-title">Can still plant 🌱</h3>
          <div className="crops-grid">
            {plantable.map(crop => <CropCard key={crop.id} crop={crop} currentDay={day} season={season} fertilizerId={fertilizerId} />)}
          </div>
        </section>
      )}

      {tooLate.length > 0 && (
        <section className="crop-section faded">
          <h3 className="section-title">Too late this season ⌛</h3>
          <div className="crops-grid">
            {tooLate.map(crop => <CropCard key={crop.id} crop={crop} currentDay={day} season={season} fertilizerId={fertilizerId} />)}
          </div>
        </section>
      )}
    </div>
  );
}
