const BASE = '/api';

export async function loadProgress() {
  try {
    const res = await fetch(`${BASE}/progress`);
    if (!res.ok) throw new Error('fetch failed');
    return await res.json();
  } catch {
    // fallback defaults so the UI still works offline
    return { farmName: 'My Farm', season: 'Spring', year: 1, day: 1, bundles: {}, crops: [] };
  }
}

export async function saveProgress(data) {
  try {
    const res = await fetch(`${BASE}/progress`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await res.json();
  } catch {
    return data;
  }
}

export async function resetProgress() {
  try {
    const res = await fetch(`${BASE}/progress`, { method: 'DELETE' });
    return await res.json();
  } catch {
    return null;
  }
}
