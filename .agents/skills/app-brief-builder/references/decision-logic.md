# Decision Logic — Mapping Answers to the Stack

How each interview answer translates into concrete choices across the three trio skills. Use this to fill defaults intelligently instead of asking more questions.

## Scale & Stage → Backend + Deployment

| Stage | Backend default | Database | Deployment (cloud-devops) |
|---|---|---|---|
| **MVP / validate fast** | NestJS *or* Hono (Hono if simple/edge) | PostgreSQL (managed: Neon/Supabase) | PaaS: Railway / Render / Cloud Run + Docker. **No Kubernetes yet.** |
| **Growing product** | NestJS (default) | PostgreSQL + Redis | Cloud Run / Fly.io, containerized. Start GitHub Actions CI. Graduate to K8s when multi-service. |
| **Built to scale / enterprise** | NestJS | PostgreSQL + Redis, read replicas | Kubernetes (EKS/GKE) + Helm + Argo CD + Terraform. Full observability. |

**Rule:** never reach for Kubernetes at MVP stage. cloud-devops explicitly supports PaaS-first.

## App Category → Backend Framework Hint

| Category | Likely backend | Why |
|---|---|---|
| SaaS dashboard | NestJS | Auth, billing, complex domain logic |
| Marketplace / e-commerce | NestJS | Transactions, payments, multi-entity |
| Social / content | NestJS or Hono | Depends on real-time needs |
| Internal tool | Hono or NestJS | Often simpler; Hono if lightweight |
| AI / ML tool | **FastAPI** | Python ecosystem, LangChain/LLM |
| Edge API / lightweight | **Hono** | Cold-start, cross-runtime |
| Booking / scheduling | NestJS | Stateful logic, notifications |

If AI/ML is a core capability → FastAPI (or a FastAPI microservice alongside a TS API). Otherwise default TypeScript so types are shared with the React frontend.

## Visual Tone → Frontend Design Tokens

| Tone | Theme | Font direction | Accent feel |
|---|---|---|---|
| `luxury-minimal` | Light (or warm off-white) | Refined serif/grotesk pairing, generous whitespace | Muted, single accent, subtle shadows |
| `bold-editorial` | Light, high-contrast | Strong display font, asymmetric layout | Sharp accent, big type |
| `dark-futuristic` | Dark | Geometric sans + mono | Glowing accent, grid overlays, gradient text |
| `playful-vibrant` | Light | Rounded, friendly | Saturated multi-accent, bouncy motion |
| `glassmorphism` | Dark or gradient | Clean sans | Translucent cards, blurred backgrounds |

The dribbble-frontend skill owns exact tokens; this just sets the direction so the frontend prompt is specific.

## Core Capabilities → Concrete Requirements

| Capability | Frontend impact | Backend impact | DevOps impact |
|---|---|---|---|
| Auth & accounts | Login/register/profile screens | JWT access+refresh, Argon2, /auth routes | Secrets for JWT |
| Payments | Checkout, billing screens | Stripe/payment integration, webhooks | Webhook endpoint, secret mgmt |
| Real-time | Live updates, presence UI | WebSockets (NestJS gateway) / SSE | Sticky sessions or pub/sub (Redis) |
| File uploads | Upload UI, previews | Object storage (S3), signed URLs | Bucket provisioning (Terraform) |
| AI / ML | Chat/generation UI | FastAPI microservice, LLM calls | GPU host or API keys, rate limits |
| Admin panel | Separate admin routes/layout | RBAC, admin endpoints | Restricted access |
| Notifications | Toast/notification center | Queue (Redis/pg-boss), email/push | Worker process |
| Search | Search UI, filters | Full-text (Postgres) or external (Meilisearch) | Search service if external |

## Data Model Inference

From category + features, infer the obvious entities:
- SaaS dashboard → User, Organization, Subscription, Metric/Event
- Marketplace → User, Listing, Order, Transaction, Review
- Social → User, Post, Comment, Like, Follow
- Booking → User, Resource, Booking, Availability
- Content → User, Article, Category, Tag

Keep it high-level (entity names + key relationships). The backend skill expands into schemas.

## What NOT to Ask
- Framework, ORM, hosting provider — defaults are correct; only honor explicit user preference
- Color hex values — tone direction is enough; dribbble-frontend owns tokens
- Detailed schema fields — entity list is enough; backend skill expands
