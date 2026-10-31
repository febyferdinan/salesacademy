# LA Sales Academy — Enterprise B2B Sales Enablement & AI Co-Pilot

Aplikasi web produksi penuh (**Full-Stack TypeScript Monorepo**) untuk **PT Aplikanusa Lintasarta Commercial Enablement**. Dirancang sebagai satu ekosistem terpadu bagi **Account Executive (AE)**, **Sales Leader**, dan **Commercial Enablement Admin** untuk mempelajari solusi B2B, mengakses 12 seksi Battlecard resmi, menghitung justifikasi ROI bisnis pelanggan, berlatih negosiasi melalui simulator role-play interaktif, serta berkonsultasi real-time dengan **Tanya AI Co-Pilot**.

---

## ✨ Fitur Utama (Production v2.0)

1. **Multi-Persona & 1-Click Executive Demo Bar:**
   - **Account Executive (`Raka Pratama`):** Dashboard personal, progres belajar, kuis interaktif, kalkulator ROI, dan ujian sertifikasi.
   - **Sales Leader (`Budi Santoso`):** Analitik kesiapan tim 15 AE Area Jabo 1 (Recharts), diagnostik topik yang sering meleset, reminder/apresiasi 1-klik, dan form penugasan langsung ke Inbox AE.
   - **Admin Enablement (`Dewi Anggraini`):** Konfigurasi engine LLM Tanya AI, publikasi course/berita baru, dan tabel System Audit Trail.
   - **Corporate SSO & Security Lockout:** Simulasi login SSO Lintasarta dan proteksi lockout otomatis 15 menit setelah 5x percobaan password gagal.

2. **100% Kurikulum & Video Learning Player Interaktif:**
   - **6 Course Lengkap × 5 Modul:** *Internet Dedicated, Data Center Tier-III, Consultative Selling & Discovery, Cloudeka & Deka GPU, Squra Cyber Security,* dan *Executive Presence & CxO Pitching*.
   - **Interactive Video Player:** Chapter timeline, transkrip Bahasa Indonesia tersinkronisasi, kontrol kecepatan (`1x`, `1.25x`, `1.5x`), auto-save posisi tonton ke SQLite, kuis kelulusan (minimal 80%) dengan deep-link remedial ke detik video terkait.
   - **Customer Role-Play Simulator (Modul 5):** Simulasi percakapan multi-tahap menghadapi keberatan harga CFO/CIO/CISO dengan umpan balik coach dan skor negosiasi.

3. **8 Product Mapping Battlecard (12 Seksi) & Kalkulator ROI Downtime:**
   - Meliputi *Internet Dedicated, SD-WAN, Metro Ethernet, Data Center Tier-III, Cloudeka, Deka GPU, Squra Managed Security,* dan *Microsoft Teams Rooms*.
   - Setiap produk memiliki **12 seksi Battlecard lengkap** (*Overview, Customer Pain, ICP, Value Proposition, Key Features, Business Benefits, Use Cases, Differentiator, Discovery Questions, Objection Handling, Cross-Sell, Do & Don't*) serta **Kalkulator Dampak Downtime & ROI Interaktif**.

4. **Tanya AI Co-Pilot (Multi-LLM + OpenAI-Compatible + Grounded RAG):**
   - Mendukung **4 Mode Engine AI** yang dapat diubah langsung dari halaman **Admin Studio (`/admin`)**:
     1. **Grounded RAG Synthesizer (`deterministic`):** Mesin sintesis lokal bebas API key yang langsung merangkum jawaban dari korpus Battlecard & Transkrip Video Lintasarta.
     2. **Google Gemini API (`gemini`):** Mendukung `gemini-2.5-flash` / `gemini-2.5-pro`.
     3. **OpenAI Official API (`openai`):** Mendukung `gpt-4o-mini` / `gpt-4o`.
     4. **OpenAI-Compatible API (`openai-compatible`):** Mendukung kustomisasi penuh `Base URL`, `API Key`, dan `Model ID` untuk **Cloudeka Deka LLM (`https://dekallm.cloudeka.id/v1`)**, **OpenRouter**, **Ollama Local**, **vLLM**, atau **Groq**.
   - Dilengkapi **Clickable Citation Badges** yang mengarahkan pengguna langsung ke Battlecard atau detik video sumber jawaban.

5. **Generator Dokumen PDF-Ready & Sertifikat Digital Terverifikasi:**
   - Unduh dan cetak **Battlecard Produk**, **SOP Pricing Approval 2026**, **Materi Sales Toolkit**, serta **Sertifikat Resmi (`LA-CERT-2026-XXXX`)** lengkap dengan kode verifikasi digital.

---

## 🏗️ Arsitektur Teknologi

- **Frontend (`src/`):** React 18, TypeScript, Vite 6, Tailwind CSS, Framer Motion, Recharts, Lucide Icons (`strokeWidth={1.5}`), Zustand, Sonner.
- **Backend (`server/`):** Hono (`@hono/node-server`), Zod Schema Validation, Native SQLite (`node:sqlite` `DatabaseSync` di `./data/salesacademy.db` dengan auto-seed & audit trail).
- **Shared (`shared/`):** Skema kontrak TypeScript/Zod dan data seed korpus penuh (`seedCourses.ts`, `seedProducts.ts`, `seedOperations.ts`).
- **DevOps:** Multi-stage `Dockerfile` (Node 22 Alpine, port `80` untuk kompatibilitas langsung Coolify + Traefik + Cloudflare Tunnel), `docker-compose.yml`, dan GitHub Actions CI (`.github/workflows/ci.yml`).

---

## 🚀 Cara Menjalankan Secara Lokal

```bash
# 1. Install seluruh dependencies
npm install

# 2. Jalankan mode development (Vite Frontend di :5173 + Hono API Server di :3000)
npm run dev

# 3. Jalankan pemeriksaan tipe TypeScript & suite pengujian integrasi API
npm run typecheck
npm test

# 4. Build aplikasi produksi & jalankan server produksi tunggal
npm run build
npm start
```

---

## 🐳 Deployment ke Coolify / Docker

`Dockerfile` di root repositori telah dikonfigurasi secara khusus agar **100% kompatibel langsung (drop-in)** dengan deployment Coolify (`https://salesacademy.ffs.my.id/`):
- Mengekspos port internal `80` (`ENV PORT=80`, `EXPOSE 80`).
- Menyediakan endpoint healthcheck di `GET /api/v1/health` dan `GET /health`.
- Menyimpan database SQLite secara persisten di `/app/data/salesacademy.db` (`VOLUME ["/app/data"]`).

```bash
# Menjalankan menggunakan Docker Compose
docker compose up --build -d
```
