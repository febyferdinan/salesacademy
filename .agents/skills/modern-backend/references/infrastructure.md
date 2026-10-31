# Infrastructure Reference

Shared across all stacks: containerization, env, CI/CD, observability, deployment.

## Docker — Multi-stage Build (Node/TypeScript)
```dockerfile
# --- build stage ---
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# --- production stage ---
FROM node:22-alpine AS production
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=build /app/dist ./dist
# prisma: also copy generated client / run prisma generate
EXPOSE 3000
USER node
CMD ["node", "dist/main.js"]
```

## Docker — FastAPI (Python)
```dockerfile
FROM python:3.12-slim AS base
WORKDIR /app
ENV PYTHONUNBUFFERED=1
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "4"]
```

## docker-compose.yml (local dev)
```yaml
services:
  api:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://postgres:postgres@db:5432/app
      - REDIS_URL=redis://redis:6379
    depends_on:
      db:
        condition: service_healthy
      redis:
        condition: service_started

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: app
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  pgdata:
```

## .env.example (always include)
```
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/app
REDIS_URL=redis://localhost:6379
JWT_ACCESS_SECRET=replace-with-32-char-min-random-secret
JWT_REFRESH_SECRET=replace-with-different-32-char-secret
CORS_ORIGINS=http://localhost:5173
```

## Observability

### Structured Logging
- TS: **Pino** (fast JSON logs) — `nestjs-pino` for NestJS, `hono/logger` + pino for Hono
- Python: **structlog** — JSON output in prod, pretty in dev
- Log a `requestId`/`traceId` per request, propagate through services
- Log levels: error, warn, info, debug. Never log secrets, tokens, or passwords

### Health & Readiness
```
GET /health   → liveness (process up)
GET /ready     → readiness (DB + Redis reachable)
```
Use these for container orchestration (Kubernetes probes, load balancer checks).

### Error Tracking
- Integrate Sentry (or similar) for exception capture in production
- Tag errors with requestId, userId (not PII), release version

### Metrics (optional but recommended at scale)
- Expose Prometheus metrics (`/metrics`): request count, latency histograms, error rate
- Trace with OpenTelemetry for distributed systems

## CI/CD (GitHub Actions example)
```yaml
name: ci
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:16
        env: { POSTGRES_PASSWORD: postgres }
        options: >-
          --health-cmd pg_isready --health-interval 5s --health-timeout 5s --health-retries 5
        ports: ['5432:5432']
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22, cache: npm }
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck
      - run: npm test
      - run: npm run build
```

Pipeline stages: **lint → typecheck → test → build → (deploy on main)**.

## Database Migrations (production rules)
- NEVER use auto-sync / `db push` in production — always versioned migrations
- Prisma: `prisma migrate deploy` in CI/CD
- Drizzle: `drizzle-kit migrate`
- Alembic: `alembic upgrade head`
- Run migrations as a separate deploy step before the new app version starts
- Make migrations backward-compatible for zero-downtime deploys (expand/contract pattern)

## Deployment Targets

| Stack | Good fit |
|---|---|
| NestJS | Containers on AWS ECS/Fargate, Google Cloud Run, Railway, Render, Fly.io, Kubernetes |
| Hono | Cloudflare Workers, Vercel, Deno Deploy, Bun on any host, or Node container |
| FastAPI | Cloud Run, ECS, Railway, Render; GPU-optimized hosts for ML workloads |

General production practices:
- Run multiple instances behind a load balancer (stateless services)
- Externalize state to Postgres + Redis
- Set resource limits and autoscaling rules
- Use a managed Postgres (RDS, Cloud SQL, Neon, Supabase) rather than self-hosted where possible
- Connection pooling: PgBouncer or the platform's pooler for serverless

## Graceful Shutdown
- Listen for SIGTERM/SIGINT → stop accepting new requests → finish in-flight → close DB/Redis → exit
- NestJS: `app.enableShutdownHooks()`
- Hono/Node: handle `process.on('SIGTERM', ...)`
- FastAPI: lifespan context manager cleanup
