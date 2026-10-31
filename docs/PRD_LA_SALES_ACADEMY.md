# Product Requirement Document (PRD)

## Platform: LA Sales Academy (Growth & Enablement)
### Subsystem: Interactive Sales Enablement Platform & AI Co-Pilot
### Version: 1.0.0
### Date: October 30, 2026
### Status: Released / Production Live
### Author / Leadership: Product Management & Sales Enablement Lead

---

## 1. Document Control & Metadata

| Field | Detail |
|---|---|
| **Product Name** | LA Sales Academy |
| **Document Version** | 1.0.0 (Production Blueprint) |
| **Target Platform** | Web Single-Page Application (Desktop & Mobile Responsive) |
| **Production URL** | `https://salesacademy.ffs.my.id/` |
| **Repository** | `febyferdinan/salesacademy` (Branch: `main`) |
| **Classification** | Internal Enablement / Enterprise Confidential |

---

## 2. Executive Summary & Problem Statement

### 2.1 Background & Operational Pain Points
Enterprise B2B sales cycles at telecommunication and ICT infrastructure providers (Lintasarta) require Account Executives (AE) to possess deep technical and business acumen across six core pillars: **Connectivity, Data Center, Cloudeka (Cloud), SQURA Cybersecurity, Collaboration, and Consultative Selling**.

Traditional sales training models suffer from several systemic bottlenecks:
1. **Prolonged Ramp-Up Time:** New sales hires spend weeks wading through static PDF decks and disjointed document repositories before being field-ready.
2. **Disconnected Discovery & Objection Handling:** Sales representatives often compete on price-per-Mbps rather than articulating total business impact (e.g. downtime cost calculations during critical transaction hours).
3. **Managerial Oversight Blind Spots:** Sales Leaders lack consolidated visibility into team skill readiness, curriculum completion, and certification trajectories across regional operational areas (e.g., Jabodetabek).
4. **Heavy Weight & Fragile Learning Management Systems (LMS):** Conventional enterprise LMS platforms are bloated, require high-bandwidth video streaming, and fail under bandwidth-constrained mobile field scenarios.

### 2.2 Proposed Solution
**LA Sales Academy** is a zero-latency, high-performance Single Page Application (SPA) designed to empower sales teams with bite-sized training, battlecards, interactive procedural scenario simulations, and an instant contextual AI Sales Assistant (*Tanya AI*). The platform offers a dual-persona workflow tailored for both **Account Executives (Sales)** and **Sales Leaders**.

### 2.3 Core Value Proposition
> *"Belajar hari ini, jualan lebih yakin besok."*
Transforms sales enablement from passive content consumption into an active learning loop: **Discover ➔ Learn ➔ Practice ➔ Apply ➔ Prove ➔ Recognize**.

---

## 3. Business Goals & Key Performance Indicators (KPIs)

| Metric Category | Baseline (Traditional) | Target (LA Sales Academy) | Measurement Method |
|---|---|---|---|
| **New AE Onboarding Ramp-up** | 45 Business Days | ≤ 14 Business Days | Time from hire to first qualified discovery pitch |
| **Product Knowledge Assessment** | Periodic Quarterly Exams | Continuous Micro-Quizzes (≥ 75% passing score) | In-app Quiz Completion & Score Ring Ledger |
| **Sales Pitch Win-Rate (Objection Handling)** | 22% Win Rate | ≥ 35% Win Rate | CRM Deal Conversion tracking post-objection training |
| **Mobile Access & Load Performance** | 8.2s initial load (Heavy LMS) | < 300ms initial load (Vanilla JS SPA) | Chrome Lighthouse & Cloudflare CDN telemetry |
| **Leader Remediation Response Time** | 2-3 Weeks (End-of-month review) | Same-Day Targeted Reminders | 1-Click Reminder Broadcasts from Team Dashboard |

---

## 4. User Personas & User Journeys

### 4.1 Persona 1: Account Executive (Sales) — "Raka Pratama"
* **Role:** Enterprise Account Executive, Jabodetabek Regional Team.
* **Objective:** Master product value propositions, understand customer buying triggers, practice objection handling against broadband price undercutters, and achieve the *Connectivity Associate* certification.
* **Primary Journey:**
  1. Login via corporate SSO Golden Path.
  2. View **Personal Dashboard**: review weekly milestones (target: 31 Okt 2026), daily tasks, and peer leaderboard.
  3. Enter **Course Syllabus** (*Internet Dedicated: Selling Reliable Business Connectivity*).
  4. Launch **Procedural Video Player**: scrub chapters, toggle closed-captions (CC), switch playback speeds (1x-2x).
  5. Complete **Module 3 Interactive Quiz**: answers 4 business-logic scenario questions; receives instant visual score ring and +120 gamification points.
  6. Engage **Tanya AI Drawer**: asks for discovery questions specific to the logistics enterprise vertical; obtains bulleted pitch scripts with source battlecard citations.

### 4.2 Persona 2: Sales Leader — "Budi Santoso"
* **Role:** Sales Leader / Regional Manager, Tim Jabodetabek.
* **Objective:** Monitor regional AE completion rates, identify lagging team members, assign targeted product modules, and ensure regulatory/enterprise compliance.
* **Primary Journey:**
  1. Access Leader View via switcher or SSO.
  2. Inspect **Team Completion Dashboard**: evaluate overall team rate (e.g. 72% average, 3 members on-track, 2 needing attention).
  3. Filter members by status: *Semua*, *Selesai*, *Sedang Belajar*, *Perlu Reminder*.
  4. Perform **1-Click Broadcast Reminder**: trigger toast notifications to uncertified reps.
  5. Utilize **Assign Module Modal**: multiselect subordinates (e.g., Dimas Arya, Sari Wulandari) and dispatch targeted sales playbooks.

---

## 5. System Architecture & Information Flow

### 5.1 Architecture Diagram

```
+--------------------------------------------------------------------------+
|                            CLIENT BROWSER                                |
|                                                                          |
|  [ index.html ]                                                          |
|         │                                                                |
|         ├───► [ styles.css ]  (Design Tokens, Plus Jakarta Sans, Layout) |
|         │                                                                |
|         ├───► [ data.js ]     (In-Memory Static Catalog, Courses, Quizzes)|
|         │                                                                |
|         └───► [ app.js ]      (Core Application Engine)                  |
|                     │                                                    |
|                     ├─ Hash Router (#/login, #/dashboard, #/player, ...) |
|                     ├─ State Machine (S Object)                          |
|                     ├─ Procedural SVG Canvas Video Engine                |
|                     ├─ Tanya AI Contextual Heuristic Engine              |
|                     ├─ Command Palette (Cmd+K Global Search)             |
|                     └─ LocalStorage Sync ("la-academy-demo-v1")         |
+--------------------------------------------------------------------------+
                                    ▲
                                    │ HTTPS / HTTP2 (Zero API Calls)
                                    ▼
+--------------------------------------------------------------------------+
|                     PRODUCTION CLUSTER (COOLIFY LXC 104)                |
|                                                                          |
|  [ Cloudflare Edge CDN & WAF ] (salesacademy.ffs.my.id)                  |
|         │                                                                |
|         ▼ (Encrypted Cloudflare Tunnel: b6c3d7c2-...)                     |
|  [ cloudflared Connector ]                                               |
|         │                                                                |
|         ▼ (localhost:80)                                                 |
|  [ Traefik Ingress Proxy ]                                               |
|         │                                                                |
|         ▼ (Bridge Network)                                               |
|  [ Docker Container: nginx:alpine ]                                      |
|         ├── /usr/share/nginx/html (Static Web Assets)                    |
|         └── /etc/nginx/conf.d/default.conf (gzip, SPA try_files, cache)  |
+--------------------------------------------------------------------------+
```

### 5.2 Key Architectural Characteristics
1. **Zero External API Failure Points:** The platform operates entirely client-side without synchronous external REST dependencies, eliminating network latency and third-party API downtimes.
2. **Offline-First Persistence:** User progress, quiz completions, failed login attempts, and drawer state persist automatically to browser `localStorage`.
3. **Procedural Media Engine:** Instead of streaming 50-100MB MP4 files that buffer on mobile connections, the player renders lightweight SVG animations and timeline pulses driven by `requestAnimationFrame`, achieving 100% video simulation in under 15KB of code.

---

## 6. Functional Requirements (FR)

### 6.1 Authentication & Security Simulation (FR-AUTH)
* **FR-AUTH-01 (SSO Golden Path):** The primary login button (`data-act="sso"`) must authenticate the user into the platform in < 500ms, setting `S.loggedIn = true` and resetting failed counters.
* **FR-AUTH-02 (Corporate Password Lockout Simulation):** Submitting the manual password field must increment `S.failedLogin`. Upon reaching 5 failed attempts, the form must disable inputs and display an alert locking the account for 15 minutes.
* **FR-AUTH-03 (Role Switching & Demobar):** The floating demo control bar must enable instant switching between `Sales` and `Sales Leader` roles, iframe mobile view simulation, and one-click state reset.

### 6.2 Sales Learning & Video Player Simulation (FR-LEARN)
* **FR-LEARN-01 (Hash Routing):** Must support client-side deep links:
  * `#/login` — Authentication screen
  * `#/dashboard` — Main Sales Dashboard
  * `#/team` — Sales Leader Monitoring Hub
  * `#/course` — Course Overview & Syllabus
  * `#/player` — Interactive Procedural Video Player
  * `#/library` — Multi-Category Learning Library
  * `#/products` & `#/product` — Enterprise Solution Specs
  * `#/toolkit` — Sales Battlecards & Objection Playbooks
  * `#/certification` — Certification Progress Tracker
  * `#/tasks` — Assigned Task Matrix
* **FR-LEARN-02 (Procedural Video Player):**
  * Support timeline dragging and keyboard arrow scrubbing (±5 seconds).
  * Variable playback speed selector: `1x`, `1.25x`, `1.5x`, `2x`.
  * Dynamic Closed Captions (CC) synchronized with playback timestamps.
  * HD / SD data-saver toggle.
  * Fullscreen toggle via hotkey (`F`) or double-click.
* **FR-LEARN-03 (Interactive Module Quiz):**
  * Present 4 situational customer objection questions upon video completion.
  * Render SVG dynamic circular score ring (`score / 4 * 289 stroke-dasharray`).
  * Passing threshold of ≥ 3 correct answers triggers `S.m3done = true`, unlocks Module 4 preview, and awards +120 reward points.
  * Provide direct review jump links (`data-act="jump"`) to timestamped video chapters for missed questions.

### 6.3 Contextual AI Sales Assistant — *Tanya AI* (FR-AI)
* **FR-AI-01 (Context-Aware Ingestion):** Drawer accessible from any screen, pre-seeded with context based on current module or active product.
* **FR-AI-02 (Heuristic Pitch Script Generation):** Analyze incoming user prompts against curated keyword matrices:
  * *Pricing Objections (`harga`, `murah`, `mahal`)* ➔ Returns value-based formula: *"Downtime loss per hour × hours vs monthly dedicated differential"*.
  * *Discovery Questions (`discovery`, `logistik`)* ➔ Returns 3 industry-specific discovery prompts.
  * *Competitive Differentiators (`beda`, `sla`, `differentiator`)* ➔ Returns Lintasarta's 1:1 dedicated bandwidth, SLA guarantees, and 24/7 enterprise NOC support.
* **FR-AI-03 (Verifiable Citations):** Every AI response must render structured source badges (e.g., `[Battlecard Internet Dedicated]`, `[Video 02:10]`).

### 6.4 Sales Leader Operations (FR-LEAD)
* **FR-LEAD-01 (Team Health Metric):** Display aggregate team completion percentages, active certifications, and overdue course alerts.
* **FR-LEAD-02 (Direct Assignment Modal):** Enable leaders to assign specific training modules to multi-selected team members with custom completion deadlines.
* **FR-LEAD-03 (Nudge Reminders):** Provide 1-click toast trigger (`data-act="remind"`) to simulate email and WhatsApp reminder dispatch to lagging sales representatives.

### 6.5 Global Search Command Palette (FR-CMDK)
* **FR-CMDK-01 (Shortcut Trigger):** Triggered via `Cmd+K` (macOS) or `Ctrl+K` (Windows/Linux) or top search bar.
* **FR-CMDK-02 (Instant Filter Index):** Instant indexing of all courses, battlecards, product lines, and pitch decks with highlight previews.

---

## 7. Non-Functional Requirements (NFR)

### 7.1 NFR-1: Performance & Zero Latency
* **Initial Page Weight:** Total HTML + CSS + JS footprint must stay under **200 KB** uncompressed (under **60 KB** gzip compressed).
* **First Contentful Paint (FCP):** < 400ms on 4G mobile connections.
* **Time to Interactive (TTI):** < 500ms on modern mobile web views (tested on iPhone 15 Pro & MacBook Air M2).

### 7.2 NFR-2: Security & Privacy (Zero-Data Retention)
* **Zero Credential Transmission:** No plaintext passwords or enterprise tokens are transmitted over the wire; authentication is handled via mock SSO validation tokens.
* **XSS Sanitation:** All dynamic strings injected into HTML templates must pass through the `esc()` sanitizer function to prevent script injection.
* **CSP Headers:** Containerized Nginx web server enforces strict MIME types, caching headers, and blocks hidden dotfile access (`location ~ /\. { deny all; }`).

### 7.3 NFR-3: Browser Compatibility & Responsiveness
* Modern evergreen browser support: Chrome 120+, Safari 17+, Firefox 120+, Edge 120+.
* Responsive breakpoints: Mobile viewport (`< 768px`), Tablet (`768px - 1024px`), Desktop (`> 1024px`). Mobile displays bottom app navigation bar; desktop renders enterprise collapsible sidebar (`264px`).

---

## 8. Verification & Test Plan

| Test ID | Test Scenario | Expected Outcome | Verification Status |
|---|---|---|---|
| **TC-01** | Load homepage `https://salesacademy.ffs.my.id/` | HTTP/2 200 OK, FCP < 400ms, title "LA Sales Academy" | ✅ Pass |
| **TC-02** | Submit empty/wrong password in login | Shows error alert, increments `S.failedLogin` | ✅ Pass |
| **TC-03** | Submit 5 wrong passwords | Account locks for 15 minutes, disables submit | ✅ Pass |
| **TC-04** | Click "Masuk dengan akun Lintasarta (SSO)" | Enters Dashboard, renders user "Raka Pratama" | ✅ Pass |
| **TC-05** | Video scrubbing in `#/player` | Video timeline adjusts, subtitles and canvas tiles update | ✅ Pass |
| **TC-06** | Complete Module 3 Quiz with ≥ 3 correct | SVG score ring renders green, awards +120 pts | ✅ Pass |
| **TC-07** | Query Tanya AI with "harga dedicated mahal" | Returns objection script with downtime formula and citation badge | ✅ Pass |
| **TC-08** | Open Command Palette (`Cmd+K`) | Modal opens, search filters courses and battlecards | ✅ Pass |
| **TC-09** | Switch role to "Sales Leader" | Routes to `#/team`, shows member list & assignment actions | ✅ Pass |
| **TC-10** | Browser Refresh | State maintained from `localStorage` (`la-academy-demo-v1`) | ✅ Pass |

---

## 9. Deployment Architecture & Infrastructure Release

* **Hosting Environment:** Proxmox VE (Lenovo Host `192.168.68.3`), Container LXC 104 (`coolify`).
* **Container Engine:** Docker 29.6.0 running image `nginx:alpine` on internal port 80.
* **Ingress Pipeline:**
  * Cloudflare Edge ➔ Cloudflare Tunnel (`b6c3d7c2-359c-4d54-801f-330d97c4f95a`) ➔ `coolify-proxy` (Traefik v3.6) ➔ Container `8dneouxzuioxsijzlt56agrd-20261030T201849`.
* **Zero Host Port Exposure Invariant:** Container exposes port `80` to internal bridge only; zero host port conflicts with Traefik or Coolify control plane.
* **Git Repository:** `febyferdinan/salesacademy` (Commit: `d78996c`, main branch).
