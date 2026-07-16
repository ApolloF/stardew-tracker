FROM node:20-alpine AS build
WORKDIR /workspace
COPY packages/game-data/package.json packages/game-data/tsconfig.json ./packages/game-data/
COPY packages/game-data/src ./packages/game-data/src
RUN npm install --prefix packages/game-data && npm run build --prefix packages/game-data
COPY apps/frontend/package.json apps/frontend/tsconfig.json apps/frontend/vite.config.ts apps/frontend/index.html ./apps/frontend/
COPY apps/frontend/src ./apps/frontend/src
RUN npm install --prefix apps/frontend && npm run build --prefix apps/frontend
FROM nginx:1.27-alpine
COPY --from=build /workspace/apps/frontend/dist /usr/share/nginx/html
COPY apps/frontend/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx","-g","daemon off;"]
