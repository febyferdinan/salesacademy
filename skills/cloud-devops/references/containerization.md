# Containerization Reference

## Principles
- **Multi-stage builds** — keep the final image small (build deps stay in the build stage)
- **Minimal base** — distroless or alpine; smaller = faster pulls, smaller attack surface
- **Non-root user** — never run as root in production
- **Pin versions** — no `:latest` for base images in production
- **Layer caching** — copy dependency manifests and install before copying source
- **.dockerignore** — exclude secrets, node_modules, .git, build artifacts

## Node/TypeScript — Multi-stage (NestJS / Hono)
```dockerfile
# --- build ---
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
RUN npm prune --omit=dev

# --- runtime (distroless) ---
FROM gcr.io/distroless/nodejs22-debian12 AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json ./
EXPOSE 3000
USER nonroot
CMD ["dist/main.js"]
```

## Node — Alpine alternative (if you need a shell, e.g. for Prisma)
```dockerfile
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx prisma generate && npm run build

FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup -S app && adduser -S app -G app
COPY --from=build --chown=app:app /app/node_modules ./node_modules
COPY --from=build --chown=app:app /app/dist ./dist
COPY --from=build --chown=app:app /app/prisma ./prisma
COPY --from=build --chown=app:app /app/package.json ./
USER app
EXPOSE 3000
CMD ["node", "dist/main.js"]
```

## Python — FastAPI
```dockerfile
FROM python:3.12-slim AS build
WORKDIR /app
ENV PYTHONUNBUFFERED=1 PIP_NO_CACHE_DIR=1
COPY requirements.txt .
RUN pip install --prefix=/install -r requirements.txt

FROM python:3.12-slim AS runtime
WORKDIR /app
ENV PYTHONUNBUFFERED=1
RUN useradd -m -u 1000 app
COPY --from=build /install /usr/local
COPY --chown=app:app . .
USER app
EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "4"]
```

## Frontend (React/Vite) — build + nginx serve
```dockerfile
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:1.27-alpine AS runtime
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

nginx.conf (SPA fallback):
```nginx
server {
  listen 80;
  root /usr/share/nginx/html;
  index index.html;
  location / { try_files $uri $uri/ /index.html; }
  location /assets/ { expires 1y; add_header Cache-Control "public, immutable"; }
}
```

## .dockerignore
```
node_modules
dist
.git
.env
.env.*
*.log
coverage
.vscode
README.md
Dockerfile
.dockerignore
```

## docker-compose (local full stack)
```yaml
services:
  frontend:
    build: ./frontend
    ports: ["5173:80"]
    depends_on: [api]

  api:
    build: ./backend
    ports: ["3000:3000"]
    environment:
      - DATABASE_URL=postgresql://postgres:postgres@db:5432/app
      - REDIS_URL=redis://redis:6379
    depends_on:
      db: { condition: service_healthy }
      redis: { condition: service_started }

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: app
    volumes: ["pgdata:/var/lib/postgresql/data"]
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine

volumes:
  pgdata:
```

## Image tagging strategy
- Tag with **immutable git SHA**: `ghcr.io/org/app:sha-abc1234`
- Also tag `:latest` and semver `:1.2.3` for convenience, but deploy by SHA
- Never deploy `:latest` to production — it's not reproducible

## PaaS deploys (when K8s is overkill)
- **Cloud Run / Railway / Render / Fly.io**: point them at the Dockerfile, set env vars, done
- **Cloudflare Workers / Vercel Edge**: for Hono edge apps — `wrangler deploy` or Vercel CLI, no container needed
- These are the right call for MVPs and small services. Graduate to Kubernetes when you need multi-service orchestration, fine-grained scaling, or you're running your own infra.

## Build optimization tips
- Order Dockerfile from least- to most-frequently-changing (deps before source)
- Use BuildKit cache mounts for package managers: `RUN --mount=type=cache,target=/root/.npm npm ci`
- Scan the final image with Trivy before pushing (see security.md)
