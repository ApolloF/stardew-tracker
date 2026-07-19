# 🌾 Stardew Valley Progress Tracker

A cozy, personal web app to track your Community Center bundles and crop planting schedule — spoiler-lite!

## Project Structure

```
stardew-tracker/
├── docker-compose.yml          ← orchestrates both containers
├── backend/
│   ├── Dockerfile
│   ├── package.json
│   └── server.js               ← Express API (saves progress.json)
│       data/
│       └── progress.json       ← auto-created, persists your progress
└── frontend/
    ├── Dockerfile
    ├── nginx.conf              ← serves React + proxies /api
    ├── vite.config.js
    ├── index.html
    └── src/
        ├── main.jsx
        ├── App.jsx             ← root component + tab routing
        ├── App.css             ← all styles
        ├── api.js              ← fetch helpers
        ├── data/
        │   ├── bundles.js      ← all Community Center rooms & items
        │   └── crops.js        ← Spring crop data & helpers
        └── components/
            ├── Header.jsx      ← farm name, season/day controls
            ├── HintPanel.jsx   ← smart contextual hints
            ├── BundleTracker.jsx
            └── CropPlanner.jsx
```

---

## 🐳 Docker Setup (recommended)

### Requirements
- [Docker](https://docs.docker.com/get-docker/) + [Docker Compose](https://docs.docker.com/compose/install/)
- That's it — no Node.js needed on your machine!

### 1. Build and start

```bash
# From the stardew-tracker/ directory:
docker-compose up --build
```

First run takes ~1–2 minutes (downloads base images, installs deps, builds React).

### 2. Open the app

```
http://localhost:8080
```

### 3. Stop the app

```bash
docker-compose down
```

Your progress is saved in `backend/data/progress.json` and persists across restarts.

### Change the port

Edit `docker-compose.yml` line:
```yaml
ports:
  - "8080:80"   # change 8080 to any port you want
```

Then rebuild: `docker-compose up --build`

---

## 🌐 Exposing to the Web

### Option A — Cloudflare Tunnel (easiest, free, no port forwarding)

```bash
# Install cloudflared: https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/
cloudflared tunnel --url http://localhost:8080
```

Cloudflare prints a public `https://xxxxx.trycloudflare.com` URL. Share it with anyone!

### Option B — Reverse proxy with Nginx (your own domain)

If you have a domain and a VPS, point Nginx at the container:

```nginx
server {
    listen 80;
    server_name stardew.yourdomain.com;

    location / {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

Then add HTTPS with `certbot --nginx`.

### Option C — Expose the port directly

In your router, forward port 8080 (or whatever you chose) to your machine's local IP.
⚠️ Only do this on a trusted home network — there's no login/auth on this app.

---

## 💻 Local Dev (no Docker)

If you want to iterate quickly without rebuilding Docker images:

**Terminal 1 — Backend:**
```bash
cd backend
npm install
node server.js
# Runs on http://localhost:3001
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:5173
# /api calls are proxied to :3001 via vite.config.js
```

---

## 📁 Data & Reset

Progress is stored in `backend/data/progress.json`.

- **Via the UI:** Click "Reset progress" in the footer
- **Manually:** Delete or edit `backend/data/progress.json`
- **In Docker:** `docker-compose exec backend sh` then `rm /app/data/progress.json`

---

## 🔧 Customising

| What | Where |
|------|-------|
| Add/edit crops | `frontend/src/data/crops.js` |
| Add/edit bundles | `frontend/src/data/bundles.js` |
| Change hints logic | `frontend/src/components/HintPanel.jsx` |
| Change colours / fonts | `frontend/src/App.css` (CSS variables at the top) |
| Change the port | `docker-compose.yml` → `ports` |

---

## 🐛 Troubleshooting

**Port already in use:**
```bash
# Change 8080 in docker-compose.yml, or find what's using it:
lsof -i :8080
```

**Changes not showing after edit:**
```bash
docker-compose up --build   # always rebuild after code changes
```

**Progress not saving:**
Check that the `backend/data/` directory exists and is writable. Docker creates it automatically via the volume mount.

**Backend unreachable:**
```bash
docker-compose logs backend   # check for errors
```
