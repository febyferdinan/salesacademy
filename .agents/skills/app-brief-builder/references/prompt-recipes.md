# Prompt Recipes — The Three Execution Prompts

After the brief, generate three self-contained, ready-to-paste prompts. Each must trigger its skill and carry enough context to work even in a fresh chat.

## Frontend Prompt Template
```
Buatkan frontend untuk [App Name]: [one-line description].

Tone visual: [tone] dengan tema [light/dark].
Font: [display font] + [body/mono font]. Accent: [accent direction].

Halaman yang dibutuhkan:
- [Screen] — [purpose]
- [Screen] — [purpose]
...

Komponen / kebutuhan khusus:
- [e.g. KPI cards, live area/line charts via Recharts]
- [e.g. auth forms with validation]
- [e.g. data tables, modals]

Pakai React + Vite + Tailwind + Framer Motion + Lucide (strokeWidth 1.5) + Recharts.
Sertakan dark mode dan micro-interactions di setiap elemen interaktif.
```

## Backend Prompt Template
```
Buatkan backend API untuk [App Name] yang menyajikan frontend di atas.

Framework: [NestJS / Hono / FastAPI] — [one-line reason].
Database: [PostgreSQL (+ Redis)].

Entitas utama:
- [Entity] — [key fields], relasi ke [Entity]
...

Endpoint / fitur:
- Auth: [JWT access+refresh, email + OAuth?]
- [Feature]: [endpoints]
...

Wajib: validasi schema di boundary (Zod/Pydantic), arsitektur
controller→service→repository, error envelope konsisten, dan bagikan
tipe/schema dengan frontend TypeScript jika memungkinkan.
```

## DevOps Prompt Template
```
Buatkan setup deployment & CI/CD untuk [App Name] (frontend + backend di atas).

Stage: [MVP / growing / scale].
Target deployment: [PaaS (Railway/Cloud Run) / Kubernetes].

Butuh:
- Dockerfile untuk frontend dan backend (multi-stage, non-root)
- docker-compose untuk dev lokal (app + Postgres + Redis)
- CI GitHub Actions: lint → test → build → scan → push
- [jika scale: Helm chart + Argo CD GitOps + Terraform untuk cluster]
- [jika MVP: deploy ke PaaS, tahan dulu Kubernetes]
- Observability: [health checks; jika scale: Prometheus/Grafana/OTel]
- Security: secrets via env (.env.example), image scanning, no secrets in Git
```

---

## Worked Example (from the PulseBoard brief)

### Frontend prompt
```
Buatkan frontend untuk PulseBoard: SaaS dashboard analitik real-time untuk tim
startup kecil.

Tone visual: dark-futuristic dengan tema dark.
Font: Plus Jakarta Sans + JetBrains Mono. Accent: glowing violet, gradient text
di hero, grid overlay halus.

Halaman:
- Landing — hero, fitur, pricing, CTA
- Auth — login/register (email + Google)
- Dashboard — KPI cards, live area & line charts, filter rentang tanggal
- Alerts — daftar alert metrik, form create/edit
- Billing — plan, usage, metode pembayaran
- Settings — profil, data source, tim

Komponen khusus:
- KPI cards dengan animated counter
- Live area/line charts via Recharts dengan custom tooltip & gradient fill
- Auth forms dengan validasi
- Data tables untuk alerts

Pakai React + Vite + Tailwind + Framer Motion + Lucide (strokeWidth 1.5) +
Recharts. Sertakan dark mode dan micro-interactions di setiap elemen interaktif.
```

### Backend prompt
```
Buatkan backend API untuk PulseBoard yang menyajikan frontend di atas.

Framework: NestJS — auth, billing, dan logika multi-entity menuntut struktur;
TypeScript berbagi tipe dengan frontend.
Database: PostgreSQL + Redis (real-time pub/sub & caching).

Entitas:
- User — email, name, role; milik Organization
- Organization — name; punya banyak User, satu Subscription
- Subscription — plan, status; milik Organization
- DataSource — type, config; milik Organization
- Metric — name, value, timestamp; milik DataSource
- Alert — metric, threshold, channel; milik Organization

Endpoint/fitur:
- Auth: JWT access+refresh, email/password + Google OAuth, Argon2
- Metrics: ingest + query, real-time via WebSocket gateway (Redis pub/sub)
- Alerts: CRUD + evaluasi threshold
- Billing: integrasi Stripe + webhook

Wajib: validasi Zod di boundary, arsitektur controller→service→repository,
error envelope konsisten, bagikan tipe dengan frontend.
```

### DevOps prompt
```
Buatkan setup deployment & CI/CD untuk PulseBoard (frontend + backend di atas).

Stage: MVP / validate fast.
Target deployment: PaaS (Railway atau Cloud Run) — belum perlu Kubernetes.

Butuh:
- Dockerfile multi-stage untuk frontend (nginx serve) dan backend (distroless,
  non-root)
- docker-compose untuk dev lokal: api + frontend + Postgres + Redis
- CI GitHub Actions: lint → typecheck → test → build → scan (Trivy) → push ke GHCR
- Deploy ke PaaS dari image; tahan dulu Kubernetes
- Health checks (/health, /ready) + structured logging
- Secrets via env dengan .env.example; image scanning; tidak ada secret di Git
- Catatan: jalur upgrade ke Kubernetes + Argo CD + Terraform saat mulai scale
```

---

## Notes
- Keep prompts in the user's language (Indonesian/English) matching how they wrote.
- Each prompt references "di atas" for continuity but still lists specifics so it survives a fresh chat.
- Order matters: frontend first (defines the surface), then backend (serves it), then devops (ships both).
