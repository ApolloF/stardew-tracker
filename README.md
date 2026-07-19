# Junimo Journal

A private, spoiler-conscious Stardew Valley 1.6.15 farm journal. It tracks bundles, collections, crops, fish, relationships, animals, farmer progress, discoveries, perfection, monster-slayer goals, Golden Walnuts, island upgrades, and raccoon requests. Verified tracker data is based on [ApolloF/stardew.app](https://github.com/ApolloF/stardew.app) commit `c916f707740ff7184634b321fb7ad386a6f915e5`.

## Active workspace

- `apps/frontend`: React/Vite journal and reference UI.
- `apps/backend`: authenticated Express API and SQLite persistence.
- `packages/game-data`: versioned Stardew data and calculations.
- `compose.yaml`: current production-compatible Compose deployment.

The top-level `frontend/`, `backend/`, `docker-compose.yml`, [README.legacy.md](README.legacy.md), and [REBUILD.legacy.md](REBUILD.legacy.md) are compatibility-only. New work belongs in the workspace directories above.

## Docker

1. Copy `.env.example` to `.env` and set a long random `SETUP_TOKEN`.
2. Run `docker compose up -d --build`.
3. Open `http://localhost:4105`.

SQLite lives in the `stardew-data` volume. WAL is enabled, expired sessions and old AI usage are pruned, and daily backups are retained for 30 days by default. Set `BACKUP_RETENTION_DAYS` to change that retention.

## Local development

Use Node.js 20 or newer from the repository root:

```powershell
npm install
npm run dev
```

The frontend uses `http://localhost:5173` and proxies `/api` to the backend on port `3001`.

## Validation

```powershell
npm run lint
npm test
npm run build
npm run check:bundle
npm audit --workspaces
git diff --check
```

The bundle check enforces a 100 KiB gzip budget for the initial JavaScript entry. Large tracker/reference datasets are loaded through route and domain chunks.

## Refreshing reference data

Clone ApolloF/stardew.app at the pinned commit, then run:

```powershell
node scripts/generate-stardew-trackers.mjs C:\path\to\stardew.app\src\data
node scripts/generate-monster-goals.mjs C:\path\to\stardew.app\src\data
```

Set `STARDEW_APP_COMMIT` when intentionally reviewing a newer upstream revision, then update parity fixtures and inspect the complete ID/count diff before committing generated data.

## Security and spoilers

Farm data is authenticated and isolated by active farm membership. The late-game reveal preference is stored per member and per farm; it is not browser-global. AI answers use only spoiler-filtered, verified local records and return a bounded no-information response when no safe record supports the question.
