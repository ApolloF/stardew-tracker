# Junimo Journal — Stardew Tracker 2.0

The rebuilt application lives in `apps/frontend`, `apps/backend`, and `packages/game-data`. Docker Compose automatically prefers `compose.yaml`, so the legacy `docker-compose.yml` can remain available as a reference while existing installs migrate.

## Start with Docker

1. Copy `.env.example` to `.env`.
2. Replace `SETUP_TOKEN` with a long random secret. Add a Gemini API key only if AI responses are wanted.
3. Run `docker compose up --build`.
4. Open `http://localhost:1423`, choose **Private farm**, and use the setup token to create the owner and farm.
5. From the dashboard, create the second private account.

The Gemini key is read only by the backend. Never put it in Vite variables or frontend code. Free-tier prompts may be used by Google to improve its products; the UI discloses when a progress summary is sent.

## Local development

Build the shared catalog first, then run both applications:

```powershell
npm install --prefix packages/game-data
npm run build --prefix packages/game-data
npm install --prefix apps/backend
npm install --prefix apps/frontend
npm run dev --prefix apps/backend
npm run dev --prefix apps/frontend
```

The frontend runs on `http://localhost:5173` and proxies `/api` to port 3001. Set `SETUP_TOKEN` in the backend process environment before first-time setup.

## Persistence and migration

SQLite is stored in the named `stardew-data` volume with WAL enabled. A consistent dated backup is created by SQLite on startup and daily. If `backend/data/progress.json` exists, it is imported during first-time setup, copied to a timestamped backup, and renamed to `progress.json.migrated`.

## Data maintenance

All game records live in `packages/game-data/src`, carry `gameVersion`, `verifiedAt`, and a source URL, and are tested independently. Runtime scraping is not used. Update the verification date and regression fixtures whenever the supported Stardew version changes.

## Production checklist

- Serve the frontend over HTTPS so secure session cookies work.
- Keep `SETUP_TOKEN` and `GEMINI_API_KEY` in the deployment secret store.
- Set `TRUST_PROXY=1` only behind a trusted reverse proxy.
- Back up the `stardew-data` volume off-host.
- Do not make authenticated AI endpoints public through a separate proxy rule.
