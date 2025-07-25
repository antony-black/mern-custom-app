# ---- Base Node image ----
FROM node:20-alpine AS base
WORKDIR /app

# ---- Install dependencies (all workspaces) ----
COPY package.json package-lock.json* ./
COPY backend/package.json ./backend/package.json
COPY frontend/package.json ./frontend/package.json
COPY shared/package.json ./shared/package.json
RUN npm install --workspaces --legacy-peer-deps

# ---- Copy source files for all workspaces ----
COPY backend ./backend
COPY frontend ./frontend
COPY shared ./shared

# ---- Build shared types ----
FROM base AS build-shared
WORKDIR /app
RUN npm run build --workspace shared

# ---- Build frontend ----
FROM build-shared AS build-frontend
WORKDIR /app/frontend
RUN npm run build

# ---- Build backend ----
FROM build-frontend AS build-backend
WORKDIR /app/backend
RUN npm run build

# ---- Production image ----
FROM node:20-alpine AS prod
WORKDIR /app

# Copy only necessary files
COPY --from=build-backend /app/backend/dist ./backend/dist
COPY --from=build-backend /app/backend/package.json ./backend/package.json
COPY --from=build-backend /app/backend/loader.mjs ./backend/loader.mjs
COPY --from=build-backend /app/backend/uploads ./backend/uploads
COPY --from=build-frontend /app/frontend/dist ./frontend/dist
COPY --from=build-backend /app/backend/.env ./backend/.env
RUN ls -R /app/backend/dist

# Install only production dependencies for backend
WORKDIR /app/backend
RUN npm install --only=production --legacy-peer-deps

# Expose port (default 5000)
EXPOSE 5000

# Start the backend server (serves frontend in production)
CMD ["node", "--max-old-space-size=1024", "--experimental-specifier-resolution=node", "dist/src/server.js"] 