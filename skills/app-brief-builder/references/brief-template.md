# Build Brief — Template & Example

## Template

```markdown
# Build Brief: [App Name]

## 1. Overview
[One paragraph: what the app does, who it's for, the core value it delivers.]
- **Audience:** [primary users]
- **Core value:** [the one thing it nails]
- **Stage:** [MVP / growing / scale]

## 2. Visual Direction
- **Tone:** [luxury-minimal / bold-editorial / dark-futuristic / playful-vibrant / glassmorphism]
- **Theme:** [light / dark]
- **Font direction:** [e.g. geometric sans + mono]
- **Accent feel:** [e.g. glowing single accent, gradient text]

## 3. Pages / Screens
- **[Screen name]** — [purpose]
- **[Screen name]** — [purpose]
...

## 4. Features & Capabilities
- [Concrete feature]
- [Concrete feature]
...

## 5. Data Model (high level)
- **[Entity]** — [key fields], relates to [Entity]
- **[Entity]** — ...
...

## 6. Stack Decisions
- **Frontend:** React + Vite + Tailwind + Framer Motion + Lucide + Recharts — [why this tone/feature mix]
- **Backend:** [NestJS / Hono / FastAPI] — [one-line reason]
- **Database:** [PostgreSQL + Redis?] — [why]
- **Deployment:** [PaaS / Kubernetes] — [why this fits the stage]

## 7. Assumptions (correct me if wrong)
- [Defaulted decision]
- [Defaulted decision]
...
```

---

## Example (filled in)

```markdown
# Build Brief: PulseBoard

## 1. Overview
PulseBoard is a SaaS analytics dashboard that lets small teams track product
metrics in real time without a data engineer. Users connect a data source,
then view live KPIs, trends, and alerts.
- **Audience:** founders & PMs at early-stage startups
- **Core value:** zero-setup, beautiful real-time metrics
- **Stage:** MVP / validate fast

## 2. Visual Direction
- **Tone:** dark-futuristic
- **Theme:** dark
- **Font direction:** Plus Jakarta Sans (display) + JetBrains Mono (data)
- **Accent feel:** glowing violet accent, gradient text on hero, subtle grid overlay

## 3. Pages / Screens
- **Landing** — marketing hero, features, pricing, CTA
- **Auth** — login / register (email + Google)
- **Dashboard** — KPI cards, live line/area charts, date range filter
- **Alerts** — list of metric alerts, create/edit alert
- **Billing** — plan, usage, payment method
- **Settings** — profile, data sources, team

## 4. Features & Capabilities
- Auth & accounts (email + OAuth Google)
- Real-time metric updates
- Data visualization (line, area, bar charts)
- Alerting on thresholds
- Payments / subscription billing
- Team / multi-user

## 5. Data Model (high level)
- **User** — email, name, role; belongs to Organization
- **Organization** — name; has many Users, Subscription
- **Subscription** — plan, status; belongs to Organization
- **DataSource** — type, config; belongs to Organization
- **Metric** — name, value, timestamp; belongs to DataSource
- **Alert** — metric, threshold, channel; belongs to Organization

## 6. Stack Decisions
- **Frontend:** React + Vite + Tailwind + Framer Motion + Lucide + Recharts —
  dark-futuristic dashboard with live Recharts visualizations
- **Backend:** NestJS — auth, billing, and multi-entity domain logic justify
  structured framework; TypeScript shares types with the frontend
- **Database:** PostgreSQL + Redis — relational data + real-time pub/sub & caching
- **Deployment:** PaaS (Railway or Cloud Run) — MVP stage, no Kubernetes yet;
  add CI on GitHub Actions, graduate to K8s when scaling

## 7. Assumptions (correct me if wrong)
- Real-time via WebSockets (NestJS gateway) backed by Redis pub/sub
- Payments via Stripe
- Google OAuth in addition to email/password
- Single region, managed Postgres (Neon/Supabase) for MVP
- English-only UI to start
```
```

The brief should be this concrete — every section actionable, assumptions surfaced so the user can redirect with one message.
