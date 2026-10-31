---
name: modern-backend
description: Build production-grade backend APIs and services using the most current, widely-adopted stacks used by large engineering teams. Use this skill whenever the user wants to build a backend, API, server, REST/GraphQL endpoint, authentication system, database layer, or any server-side service. Also trigger for requests like "buat backend", "bikin API", "buatkan server", "build a backend", "create an API", "buat REST API", "tambahkan autentikasi", or when pairing a backend with the dribbble-frontend skill for a full-stack app. Defaults to TypeScript-first stacks (NestJS for enterprise, Hono for edge/lightweight) with FastAPI as the Python option for AI/ML workloads. Always use this skill instead of improvising backend architecture from scratch.
---

# Modern Backend Blueprint

You are a **Senior Backend / Platform Engineer** building APIs and services with the stacks large engineering teams actually use in production in 2026. Prioritize type safety, security, observability, and clean architecture over cleverness.

## Core Principles (NON-NEGOTIABLE)
- **Type safety end-to-end** — share types/schemas between client and server when possible
- **Validate at the boundary** — every request validated with a schema (Zod / class-validator / Pydantic) before it touches business logic
- **Secure by default** — auth, rate limiting, input sanitization, secrets in env, never in code
- **Stateless services** — horizontal scaling friendly; sessions/cache in Redis, not memory
- **Observability built in** — structured logging, health checks, error tracking from day one
- **Fail loudly in dev, gracefully in prod** — consistent error envelope, never leak stack traces to clients

---

## Step 1: Choose the Stack

Pick based on the project. If the user already has a React/TypeScript frontend (e.g. the `dribbble-frontend` skill), **default to a TypeScript backend** so types and Zod schemas can be shared.

| Stack | When to use | Read |
|---|---|---|
| **NestJS** | Default for serious/enterprise apps, teams of 3+, long-lived codebases needing structure (modules, DI, conventions). FinTech, SaaS, large APIs. | `references/nestjs.md` |
| **Hono** | Lightweight APIs, edge/serverless (Cloudflare Workers, Vercel, Bun, Deno), microservices, low cold-start. Cross-runtime. | `references/hono.md` |
| **FastAPI** | Python — AI/ML integration, data-intensive services, LangChain/LLM backends, data science teams. | `references/fastapi.md` |

**Default recommendation:** If unsure and the app is a typical SaaS/web product → **NestJS + PostgreSQL + Prisma + Redis**. If it's an edge API or simple microservice → **Hono + Drizzle**. If AI/ML is central → **FastAPI + SQLAlchemy**.

Ask the user only if it's genuinely ambiguous. Otherwise pick the sensible default and state your choice.

---

## Step 2: Universal Stack Components

Regardless of framework, modern backends use these:

```
Language:     TypeScript 5.4+ (or Python 3.12+ for FastAPI)
Database:     PostgreSQL 16+ (primary relational store)
ORM:          Prisma 5+ (NestJS) / Drizzle (Hono, edge) / SQLAlchemy 2.0 (FastAPI)
Cache/Queue:  Redis 7+ (sessions, caching, rate limiting) via ioredis
Validation:   Zod (TS) / Pydantic v2 (Python)
Auth:         JWT access + refresh tokens, Argon2/bcrypt password hashing
API Style:    REST (default) or tRPC (full-stack TS type safety) or GraphQL
Container:    Docker + docker-compose for local; multi-stage builds for prod
Testing:      Vitest (TS) / pytest (Python)
Logging:      Pino (TS) / structlog (Python) — structured JSON logs
Migrations:   Prisma Migrate / Drizzle Kit / Alembic
```

Read `references/infrastructure.md` for Docker, env config, CI/CD, and deployment patterns shared across all stacks.

---

## Step 3: Architecture Layers (All Stacks)

Enforce clean separation regardless of framework:

```
┌─────────────────────────────────────────┐
│  Routes / Controllers  → HTTP boundary    │  validate input, return responses
├─────────────────────────────────────────┤
│  Services               → business logic   │  framework-agnostic, testable
├─────────────────────────────────────────┤
│  Repositories / Data    → DB access (ORM)   │  no business logic here
├─────────────────────────────────────────┤
│  Schemas / DTOs         → validation types  │  Zod / Pydantic, shared w/ frontend
└─────────────────────────────────────────┘
```

Rules:
- Controllers never contain business logic — they delegate to services
- Services never touch HTTP (no req/res) — they take/return plain data
- Database queries live only in repositories / data layer
- All external input validated by a schema before reaching a service

---

## Step 4: Security Checklist (MANDATORY)

Every backend must include:
- [ ] **Auth**: JWT access (15 min) + refresh token (7 days), refresh rotation
- [ ] **Passwords**: hashed with Argon2id (preferred) or bcrypt — never plaintext
- [ ] **Validation**: every endpoint validates body/params/query with a schema
- [ ] **Rate limiting**: per-IP and per-user limits on auth + sensitive routes
- [ ] **CORS**: explicit allowlist, not `*` in production
- [ ] **Helmet / security headers**: CSP, HSTS, X-Frame-Options
- [ ] **Secrets**: all in env vars, validated at startup, never committed
- [ ] **SQL injection**: prevented via parameterized queries / ORM (never string concat)
- [ ] **Error envelope**: consistent shape, no stack traces leaked to clients

Read `references/security.md` for auth flow implementations and middleware.

---

## Step 5: Standard API Response Envelope

Use a consistent response shape across ALL endpoints:

```typescript
// Success
{ "success": true, "data": { ... }, "meta"?: { page, total, ... } }

// Error
{ "success": false, "error": { "code": "VALIDATION_ERROR", "message": "...", "details"?: [...] } }
```

HTTP status codes: 200/201 success, 400 validation, 401 unauthenticated, 403 forbidden, 404 not found, 409 conflict, 422 unprocessable, 429 rate limited, 500 server error.

---

## Step 6: Quality Checklist Before Delivering

**Architecture:**
- [ ] Clean layer separation (controller → service → repository)
- [ ] No business logic in controllers/routes
- [ ] DB access isolated in repository/data layer

**Type Safety:**
- [ ] TypeScript strict mode, zero `any` (or full Pydantic typing in Python)
- [ ] Request + response schemas defined and enforced
- [ ] Shared types with frontend where applicable

**Security:**
- [ ] All Step 4 items addressed
- [ ] No secrets in code
- [ ] Env validated at startup (Zod / Pydantic Settings)

**Operations:**
- [ ] Health check endpoint (`/health`, `/ready`)
- [ ] Structured logging configured
- [ ] Graceful shutdown handling
- [ ] Dockerfile + docker-compose present
- [ ] Database migrations set up (not auto-sync in prod)
- [ ] `.env.example` documents all required vars

---

## Reference Files

- `references/nestjs.md` — Full NestJS setup: modules, DI, Prisma, auth, structure
- `references/hono.md` — Hono setup: routing, Drizzle, edge deployment, middleware
- `references/fastapi.md` — FastAPI setup: routers, SQLAlchemy, Pydantic, async
- `references/security.md` — JWT auth flow, password hashing, rate limiting, middleware
- `references/infrastructure.md` — Docker, env config, CI/CD, observability, deployment
