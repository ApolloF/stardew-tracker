import { useState } from 'react';
import { BUNDLE_ROOMS, getRoomStats } from '../data/bundles';
import { WILLY_BOAT } from '../data/buildings';

function ProgressBar({ value, max, color }) {
  return (
    <div className="progress-bar">
      <div className="progress-fill" style={{ width: `${Math.round((value/max)*100)}%`, background: color }} />
    </div>
  );
}

function BundleCard({ bundle, progressBundles, onToggle }) {
  const [open, setOpen] = useState(false);
  const items = bundle.items;
  const done = items.filter(i => progressBundles?.[bundle.id]?.[i.id]).length;
  const complete = done === items.length;

  return (
    <div className={`bundle-card ${complete ? 'bundle-complete' : ''}`}>
      <button className="bundle-header" onClick={() => setOpen(o => !o)}>
        <div className="bundle-header-left">
          <span className="bundle-check">{complete ? '✅' : '⬜'}</span>
          <span className="bundle-name">{bundle.name}</span>
        </div>
        <div className="bundle-header-right">
          <span className="bundle-count">{done}/{items.length}</span>
          <span className="bundle-chevron">{open ? '▲' : '▼'}</span>
        </div>
      </button>

      {open && (
        <div className="bundle-items">
          <div className="bundle-reward">🎁 Reward: {bundle.reward}</div>
          <ul>
            {items.map(item => {
              const checked = !!progressBundles?.[bundle.id]?.[item.id];
              return (
                <li key={item.id} className={`bundle-item ${checked ? 'item-checked' : ''}`} onClick={() => onToggle(bundle.id, item.id)}>
                  <span className="item-cb">{checked ? '✅' : '⬜'}</span>
                  <span className="item-emoji">{item.emoji}</span>
                  <span className="item-name">{item.name}</span>
                  {!checked && <span className="item-hint">💡 {item.hint}</span>}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

function RoomSection({ room, progressBundles, onToggle }) {
  const [open, setOpen] = useState(false);
  const { total, done } = getRoomStats(room, progressBundles);
  const complete = done === total;

  return (
    <div className={`room-section ${complete ? 'room-complete' : ''}`}>
      <button className="room-header" onClick={() => setOpen(o => !o)}>
        <div className="room-header-left">
          <span className="room-emoji">{room.emoji}</span>
          <div>
            <div className="room-name">{room.name}</div>
            <div className="room-desc">{room.description}</div>
          </div>
        </div>
        <div className="room-header-right">
          <span className="room-count">{done}/{total}</span>
          <span className="room-chevron">{open ? '▲' : '▼'}</span>
        </div>
      </button>
      <ProgressBar value={done} max={total} color={room.color} />
      {open && (
        <div className="room-bundles">
          {room.bundles.map(bundle => (
            <BundleCard key={bundle.id} bundle={bundle} progressBundles={progressBundles} onToggle={onToggle} />
          ))}
        </div>
      )}
    </div>
  );
}

function WillyBoatSection({ boatParts = {}, onToggle }) {
  const [open, setOpen] = useState(false);
  const done = WILLY_BOAT.parts.filter(p => boatParts[p.id]).length;
  const complete = done === WILLY_BOAT.parts.length;

  return (
    <div className={`room-section ${complete ? 'room-complete' : ''}`} style={{ border: '2px solid #4080c0' }}>
      <button className="room-header" onClick={() => setOpen(o => !o)}>
        <div className="room-header-left">
          <span className="room-emoji">{WILLY_BOAT.emoji}</span>
          <div>
            <div className="room-name">{WILLY_BOAT.name}</div>
            <div className="room-desc">{WILLY_BOAT.description}</div>
          </div>
        </div>
        <div className="room-header-right">
          <span className="room-count">{done}/{WILLY_BOAT.parts.length}</span>
          <span className="room-chevron">{open ? '▲' : '▼'}</span>
        </div>
      </button>
      <ProgressBar value={done} max={WILLY_BOAT.parts.length} color="#4080c0" />

      {open && (
        <div className="room-bundles">
          <div className="boat-hint-banner">💡 {WILLY_BOAT.hint}</div>
          <div className="bundle-card">
            <ul>
              {WILLY_BOAT.parts.map(part => {
                const checked = !!boatParts[part.id];
                return (
                  <li key={part.id} className={`bundle-item ${checked ? 'item-checked' : ''}`} onClick={() => onToggle(part.id)}>
                    <span className="item-cb">{checked ? '✅' : '⬜'}</span>
                    <span className="item-emoji">{part.emoji}</span>
                    <span className="item-name">{part.name} ×{part.qty}</span>
                    {!checked && <span className="item-hint">💡 {part.hint}</span>}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default function BundleTracker({ progress, onToggle, onBoatToggle }) {
  const { bundles: pb = {}, boatParts = {} } = progress;

  const totalItems = BUNDLE_ROOMS.reduce((s, r) => s + r.bundles.reduce((s2, b) => s2 + b.items.length, 0), 0);
  const doneItems  = BUNDLE_ROOMS.reduce((s, r) => s + r.bundles.reduce((s2, b) => s2 + b.items.filter(i => pb?.[b.id]?.[i.id]).length, 0), 0);

  return (
    <div className="bundle-tracker">
      <div className="tracker-summary">
        <div className="summary-title">Community Center Progress</div>
        <div className="summary-count">{doneItems} / {totalItems} items collected</div>
        <ProgressBar value={doneItems} max={totalItems} color="#7060c0" />
      </div>

      <div className="rooms-list">
        {BUNDLE_ROOMS.map(room => (
          <RoomSection key={room.id} room={room} progressBundles={pb} onToggle={onToggle} />
        ))}
        <WillyBoatSection boatParts={boatParts} onToggle={onBoatToggle} />
      </div>
    </div>
  );
}
