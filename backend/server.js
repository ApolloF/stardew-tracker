const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const DATA_FILE = path.join(__dirname, 'data', 'progress.json');

// Ensure data dir exists
fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });

const DEFAULT_PROGRESS = {
  farmName: 'My Farm',
  season: 'Spring',
  year: 1,
  day: 1,
  bundles: {},   // { [bundleId]: { [itemId]: true } }
  crops: [],     // [{ id, plantedDay, count }]
};

function load() {
  if (!fs.existsSync(DATA_FILE)) return DEFAULT_PROGRESS;
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  } catch {
    return DEFAULT_PROGRESS;
  }
}

function save(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// GET current progress
app.get('/api/progress', (req, res) => {
  res.json(load());
});

// POST (merge-patch) progress
app.post('/api/progress', (req, res) => {
  const current = load();
  const updated = { ...current, ...req.body };
  save(updated);
  res.json(updated);
});

// DELETE / reset
app.delete('/api/progress', (req, res) => {
  save(DEFAULT_PROGRESS);
  res.json(DEFAULT_PROGRESS);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`🌱 Stardew backend running on :${PORT}`));
