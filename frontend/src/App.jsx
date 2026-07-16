import { useState, useEffect } from 'react';
import Header from './components/Header';
import HintPanel from './components/HintPanel';
import BundleTracker from './components/BundleTracker';
import CropPlanner from './components/CropPlanner';
import BirthdayTracker from './components/BirthdayTracker';
import ProjectTracker from './components/ProjectTracker';
import RemindersPopup from './components/RemindersPopup';
import { loadProgress, saveProgress, resetProgress } from './api';

const TABS = [
  { id: 'hints',     label: '🌟 Hints'    },
  { id: 'bundles',   label: '🏛️ Bundles'  },
  { id: 'crops',     label: '🌱 Crops'    },
  { id: 'projects',  label: '🏗️ Projects' },
  { id: 'villagers', label: '💝 Villagers' },
];

export default function App() {
  const [progress, setProgress]       = useState(null);
  const [activeTab, setActiveTab]     = useState('hints');
  const [saving, setSaving]           = useState(false);
  const [showReset, setShowReset]     = useState(false);
  const [darkMode, setDarkMode]       = useState(() => localStorage.getItem('darkMode') === 'true');
  const [reminders, setReminders]     = useState(() => localStorage.getItem('reminders') !== 'false');

  // Apply dark mode class to root
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('reminders', reminders);
  }, [reminders]);

  useEffect(() => {
    loadProgress().then(setProgress);
  }, []);

  const updateProgress = async (updates) => {
    const updated = { ...progress, ...updates };
    setProgress(updated);
    setSaving(true);
    await saveProgress(updated);
    setSaving(false);
  };

  const toggleBundleItem = (bundleId, itemId) => {
    const bundles = { ...(progress.bundles || {}) };
    if (!bundles[bundleId]) bundles[bundleId] = {};
    bundles[bundleId] = { ...bundles[bundleId], [itemId]: !bundles[bundleId][itemId] };
    updateProgress({ bundles });
  };

  const toggleBoatPart = (partId) => {
    const boatParts = { ...(progress.boatParts || {}) };
    boatParts[partId] = !boatParts[partId];
    updateProgress({ boatParts });
  };

  const handleReset = async () => {
    const fresh = await resetProgress();
    if (fresh) setProgress(fresh);
    setShowReset(false);
  };

  if (!progress) {
    return (
      <div className="loading-screen">
        <div className="loading-inner">
          <div className="loading-emoji">🌱</div>
          <p>Loading your farm…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <Header
        progress={progress}
        onUpdate={updateProgress}
        darkMode={darkMode}
        onToggleDark={() => setDarkMode(d => !d)}
      />

      <RemindersPopup
        progress={progress}
        enabled={reminders}
        onToggle={() => setReminders(r => !r)}
      />

      <nav className="tab-nav">
        {TABS.map(tab => (
          <button key={tab.id} className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`} onClick={() => setActiveTab(tab.id)}>
            {tab.label}
          </button>
        ))}
      </nav>

      <main className="main-content">
        {activeTab === 'hints'     && <HintPanel progress={progress} />}
        {activeTab === 'bundles'   && <BundleTracker progress={progress} onToggle={toggleBundleItem} onBoatToggle={toggleBoatPart} />}
        {activeTab === 'crops'     && <CropPlanner progress={progress} />}
        {activeTab === 'projects'  && <ProjectTracker progress={progress} onUpdate={updateProgress} />}
        {activeTab === 'villagers' && <BirthdayTracker progress={progress} />}
      </main>

      <footer className="app-footer">
        <div className="footer-inner">
          <span className="save-status">{saving ? '💾 Saving…' : '✅ Saved'}</span>
          <button className="reset-btn" onClick={() => setShowReset(true)}>Reset progress</button>
        </div>
      </footer>

      {showReset && (
        <div className="modal-overlay" onClick={() => setShowReset(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-emoji">⚠️</div>
            <h2>Reset all progress?</h2>
            <p>This will clear your farm data, bundle checkboxes, and season. Can't be undone!</p>
            <div className="modal-buttons">
              <button className="modal-cancel" onClick={() => setShowReset(false)}>Cancel</button>
              <button className="modal-confirm" onClick={handleReset}>Yes, reset</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
