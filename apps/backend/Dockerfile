FROM node:20-bookworm-slim AS build
WORKDIR /workspace
COPY packages/game-data/package.json packages/game-data/tsconfig.json ./packages/game-data/
COPY packages/game-data/src ./packages/game-data/src
RUN npm install --prefix packages/game-data && npm run build --prefix packages/game-data
COPY apps/backend/package.json apps/backend/tsconfig.json ./apps/backend/
COPY apps/backend/src ./apps/backend/src
RUN npm install --prefix apps/backend && npm run build --prefix apps/backend && npm prune --omit=dev --prefix apps/backend

FROM node:20-bookworm-slim
ENV NODE_ENV=production DATA_DIR=/app/data PORT=3001
WORKDIR /app
COPY --from=build /workspace/apps/backend/dist ./dist
COPY --from=build /workspace/apps/backend/node_modules ./node_modules
COPY --from=build /workspace/apps/backend/package.json ./package.json
RUN mkdir -p /app/data && chown -R node:node /app
USER node
EXPOSE 3001
CMD ["node","dist/server.js"]
