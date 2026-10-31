# ==============================================================================
# Stage 1: Dependencies & Build (React 18 + Vite + Hono TypeScript Server)
# ==============================================================================
FROM node:22-alpine AS builder

WORKDIR /app

# Install dependencies with clean lockfile cache
COPY package.json package-lock.json ./
RUN npm ci

# Copy source code and build both SPA frontend (dist/) and Hono server (dist-server/)
COPY . .
RUN npm run build

# Prune devDependencies so only production runtime packages remain
RUN npm prune --omit=dev

# ==============================================================================
# Stage 2: Production Runtime (Coolify / Traefik / Cloudflare Tunnel Compatible)
# ==============================================================================
FROM node:22-alpine AS runner

LABEL org.opencontainers.image.title="LA Sales Academy — Enterprise Enablement & AI Co-Pilot"
LABEL org.opencontainers.image.description="Production Full-Stack Application (React 18 + Hono + SQLite + Multi-LLM RAG) for Lintasarta Commercial Enablement"
LABEL org.opencontainers.image.vendor="PT Aplikanusa Lintasarta"

WORKDIR /app

ENV NODE_ENV=production
# Coolify / Traefik reverse proxy routes traffic to internal port 80
ENV PORT=80
ENV SQLITE_DB_PATH=/app/data/salesacademy.db

# Create persistent SQLite data directory
RUN mkdir -p /app/data

# Copy production node_modules, compiled frontend SPA, and bundled Hono API server
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/dist-server ./dist-server
COPY --from=builder /app/package.json ./package.json

VOLUME ["/app/data"]

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://127.0.0.1:80/api/v1/health || exit 1

CMD ["node", "--experimental-sqlite", "dist-server/index.mjs"]
