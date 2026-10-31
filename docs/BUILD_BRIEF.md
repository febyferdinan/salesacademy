# Build Brief: LA Sales Academy (Production Full-Stack Edition)

## 1. Overview
**LA Sales Academy** adalah platform *Sales Enablement & AI Co-Pilot* enterprise untuk tim penjualan B2B **Lintasarta** (Connectivity, Data Center, Cloudeka, SQURA Cybersecurity, Collaboration, dan Consultative Selling). Aplikasi ini mengubah proses belajar pasif menjadi siklus aktif (*Discover → Learn → Practice → Apply → Prove → Recognize*) dengan kursus mikro interaktif, simulator role-play keberatan pelanggan, pemetaan produk (*Battlecard* 12 bagian), kalkulator bisnis/downtime ROI, ujian sertifikasi digital, pemantauan tim untuk Sales Leader, studio manajemen konten (CMS) untuk Sales Enablement, serta asisten **Tanya AI** berbasis RAG & multi-LLM.
- **Audience:** Account Executive (Sales), Sales Leader (Regional Manager), dan Sales Enablement Admin di Lintasarta.
- **Core value:** *"Belajar hari ini, jualan lebih yakin besok"* — persiapan pitching & penguasaan produk B2B dalam hitungan menit dengan materi tervalidasi dan AI Co-Pilot yang bersumber langsung dari Battlecard resmi.
- **Stage:** Growing / Production Enterprise (siap jalan di Coolify LXC container port `80` maupun multi-container PostgreSQL + Redis).

## 2. Visual Direction
- **Tone:** `luxury-minimal` dipadukan dengan `glassmorphism` pada kartu hero, command palette, dan panel AI.
- **Theme:** Light-first Enterprise (`#F4F8FD` canvas, `#FFFFFF` surface, `#0B1A33` Lintasarta Deep Navy hero) dengan dukungan **Dark Mode** penuh (`#071022` canvas, `#0F1E38` surface).
- **Font direction:** `Plus Jakarta Sans` (Display, Heading & UI Body) + `JetBrains Mono` (timestamp video, kalkulasi ROI, kode sertifikat, skor).
- **Accent feel:** Lintasarta Corporate Blue (`#0B6FD0`), Sky (`#39A3FF`), Amber (`#F5A524` untuk streak/highlight), Emerald (`#12924F` untuk kelulusan/SLA), serta gradien hero biru-navy (`linear-gradient(118deg, #0A5DBE 0%, #1F7FE6 52%, #4FAEFF 100%)`).

## 3. Pages / Screens
1. **Auth (`/login`)** — Login SSO Lintasarta Golden Path (<500ms) + form email/password dengan proteksi lockout 5x gagal (15 menit) dan informasi aktivasi akun.
2. **Sales Dashboard (`/dashboard`)** — Hero *Continue Learning* dengan progres detik terakhir, streak harian, 4 kartu KPI interaktif (jam belajar, course selesai, task jatuh tempo, poin & peringkat), *Learning Path*, *Quick Customer Meeting Prep*, agenda terdekat, dan *Leaderboard*.
3. **Courses Catalog (`/courses`)** — Katalog lengkap 6 course utama lintas portofolio Lintasarta dengan progres nyata per pengguna, filter kategori, dan status penyelesaian.
4. **Course Syllabus & Detail (`/course/:id`)** — Detail silabus 5 modul per course, *learning outcomes*, progres menuju sertifikasi, bookmark course, dan unduhan materi pendukung.
5. **Interactive Hybrid Video & Motion Player (`/player/:courseId/:moduleNumber`)** — Pemutar ganda yang mendukung streaming video MP4/HLS maupun *Interactive Animated Slide & Canvas Presentation* dengan 5 bab per modul, *scrubbing* timeline, *closed captions* (CC) Bahasa Indonesia tersinkronisasi, kecepatan `1x–2x`, mode HD/SD, layar penuh (`F`), transkrip interaktif yang bisa diklik untuk *seek*, serta modal **Quick Check Quiz** (skor SVG ring + loncat ke timestamp materi yang salah).
6. **Customer Role-Play Simulator (`/simulator/:courseId`)** — Simulasi percakapan bercabang / AI-evaluated (Modul 5) menghadapi keberatan pelanggan (mis. Direktur IT / Procurement yang membandingkan harga Dedicated vs Broadband), lengkap dengan umpan balik dan skor *Consultative Selling*.
7. **Learning Library (`/library`)** — Perpustakaan 12+ video mikro dan materi akademi dengan filter kategori portofolio, filter durasi (`< 2 menit`, `2–3 menit`), pengurutan, serta kartu *Resume Watching*.
8. **Product Mapping Hub (`/products` & `/product/:slug`)** — Peta 8 produk unggulan Lintasarta (*Internet Dedicated, SD-WAN, Metro Ethernet, Data Center Tier III, Cloudeka, Deka GPU, SQURA Managed Security, Microsoft Teams Rooms*), masing-masing lengkap dengan **12 bagian akordion tervalidasi** (*Overview, Customer Pain, ICP & Buying Trigger, Value Proposition, Key Features, Business Benefits, Use Cases, Differentiator, Discovery Questions, Objection Handling, Cross-sell, Do & Don't*) + **Kalkulator Downtime & ROI Interaktif**.
9. **Sales Toolkit (`/toolkit`)** — Repositori materi siap pakai (*Poster Gimmick, Policy & Guideline, Company Profile, Brand Asset*) dengan modal **Document Previewer** dan generator unduhan PDF asli.
10. **Certification & Proctored Exam (`/certification`)** — Pelacak progres 3 sertifikasi (*Connectivity Associate, Data Center Associate, Consultative Selling Foundation*), ruang ujian sertifikasi berwaktu, dan generator **Sertifikat Digital PDF Resmi** (`LA-CERT-2026-XXXX`).
11. **Tasks & Inbox (`/tasks`, `/inbox`)** — Daftar tugas yang ditugaskan oleh Sales Leader maupun sistem beserta tenggat waktu, serta kotak masuk pesan & pengingat lintas peran secara *real-time*.
12. **Enablement Calendar, Business Process, News & Profile (`/calendar`, `/process`, `/news`, `/profile`)** — Pendaftaran kelas live/webinar, alur 5 tahap proses penjualan B2B Lintasarta + SOP, berita produk terbaru, serta profil pengguna & pengulangan tur interaktif.
13. **Sales Leader Hub (`/team`)** — Dashboard khusus Sales Leader dengan KPI tim, grafik penyelesaian mingguan (Recharts/SVG interaktif vs target 80%), tabel anggota tim dengan filter (*Semua, Perlu Perhatian, On Track*), tombol *1-Click Remind* & *Kirim Apresiasi*, serta *Searchable Multi-Select Combobox* untuk menugaskan modul/task langsung ke akun Sales AE.
14. **Enablement Admin Studio & AI Settings (`/admin`)** — Panel CMS bagi *Enablement Admin* untuk menambah/mengedit course, produk battlecard, materi toolkit, pengumuman, serta mengonfigurasi provider **Tanya AI** (`Gemini`, `OpenAI`, atau `OpenAI-Compatible API` seperti Deka LLM / Ollama / vLLM / OpenRouter).

## 4. Features & Capabilities
- **Multi-Role Auth & Executive Demo Switcher:** JWT Auth + SSO + Password Lockout, dilengkapi *Floating Demo Control Bar* untuk berpindah instan antara `Sales (Raka)`, `Sales Leader (Budi)`, dan `Enablement Admin (Dewi)`, plus pratinjau layar *Mobile Frame* dan *Reset Demo State*.
- **100% Complete Content (Zero "Coming Soon" Stubs):** Seluruh 6 course, seluruh modul video/kuis, simulasi role-play, dan seluruh 8 halaman *Product Mapping* terisi penuh di database dan dapat dijalankan.
- **Tanya AI (Hybrid RAG + Multi-Provider LLM):** Drawer asisten AI kontekstual yang mengindeks seluruh *Battlecard*, transkrip video, dan SOP. Mendukung **Gemini API**, **OpenAI API**, dan **OpenAI-Compatible API** (custom `baseUrl`, `apiKey`, `model`), serta memiliki **Deterministic RAG Fallback** bawaan sehingga tetap menjawab akurat lengkap dengan badge sitasi yang bisa diklik (`[Battlecard · Bagian 09]`, `[Video · 02:10]`) meskipun tanpa API key eksternal.
- **Interactive Business Impact & Downtime ROI Calculator:** Alat hitung interaktif bagi AE saat *meeting* untuk membandingkan kerugian *downtime* pelanggan per jam dengan selisih investasi bulanan *Internet Dedicated*.
- **Real Document & Certificate PDF Generator:** Setiap tombol unduh (*Battlecard, SOP, Pitch Deck, Sertifikat*) menghasilkan dokumen terformat siap cetak/PDF atau pratinjau langsung di dalam aplikasi.
- **Global Command Palette (`Cmd+K` / `Ctrl+K`) & Spotlight Tour:** Pencarian cepat lintas course, video, produk, bagian *Discovery/Objection*, toolkit, hingga meneruskan pertanyaan langsung ke *Tanya AI*, ditambah panduan *Interactive Walkthrough Spotlight*.

## 5. Data Model (High Level)
- **User** — `id, email, name, initials, role ('sales' | 'leader' | 'admin'), area, team, points, streakDays, failedLoginAttempts, lockedUntil, focusProducts`
- **Course** — `id, slug, title, shortTitle, category, description, lead, outcomes[], certName, targetDate, gradient, icon`
- **CourseModule** — `id, courseId, number, title, subtitle, durationSec, isSimulation, videoData (chapters, subtitles, takeaways, videoUrl), quizQuestions[], simulationScenario`
- **UserProgress** — `id, userId, courseId, moduleId, watchedSec, completed, quizScore, updatedAt`
- **Product** — `id, slug, name, category, summary, validatedBy, sections[] (12 structured battlecard sections)`
- **LibraryVideo & Material** — `id, title, category, type ('video' | 'material' | 'toolkit' | 'process'), fileType, sizeMeta, durationSec, gradient, flag, contentBody`
- **TaskAssignment** — `id, title, source, assignedToUserId, assignedByUserId, dueDate, status ('due' | 'open' | 'done'), targetRoute, reminderType`
- **InboxMessage & Notification** — `id, recipientUserId, senderName, senderInitials, avatarColor, title, body, createdAt, isRead`
- **Certification & ExamAttempt** — `id, slug, name, requiredCoursesCount, examDate, questions[], userAttempts[] (score, passed, certificateCode, issuedAt)`
- **AgendaEvent & NewsItem** — `id, dateDay, dateMonth, title, meta, tag, body, registrations[]`
- **AiProviderConfig** — `id, provider ('deterministic' | 'gemini' | 'openai' | 'openai-compatible'), baseUrl, apiKey, modelName, updatedAt`

## 6. Stack Decisions
- **Frontend:** React 19 + TypeScript + Vite + Tailwind CSS + Framer Motion + Lucide Icons (`strokeWidth 1.5`) + Recharts — menghadirkan kualitas visual setara *Dribbble Top-Shot*, animasi halaman & drawer yang halus, grafik analitik interaktif untuk Sales Leader, dan performa instan.
- **Backend:** **Hono (TypeScript pada Node.js)** — sangat cepat, ringan, berbagi skema Zod & tipe TypeScript secara langsung (*end-to-end type safety*) dengan frontend React, serta dapat menyajikan `/api/v1/*` sekaligus bundel statis SPA pada satu port (`80`).
- **Database:** **Drizzle ORM / SQLite (libSQL/better-sqlite3) + PostgreSQL Support** — otomatis menggunakan database SQLite persisten (`/data/salesacademy.db`) saat berjalan sebagai kontainer tunggal di Coolify, dan mendukung penuh PostgreSQL 16 + Redis melalui `docker-compose.yml` untuk skala klaster.
- **Deployment:** **Docker Multi-Stage (Port 80 untuk Coolify) + Docker Compose + GitHub Actions CI** — menjaga kompatibilitas 100% dengan pipeline Coolify + Cloudflare Tunnel + Traefik yang sudah berjalan di `https://salesacademy.ffs.my.id/`.

## 7. Assumptions
- Prototipe vanilla JS asli (`index.html`, `app.js`, `data.js`, `styles.css`) diarsipkan dengan aman di folder `legacy-prototype/` sebagai referensi historis.
- Logo resmi `assets/logo-la-sales-academy.png` dipertahankan dan disajikan dari `public/assets/logo-la-sales-academy.png`.
- Secara default, *Tanya AI* langsung aktif menggunakan *Built-in Grounded RAG Engine* di atas seluruh database Lintasarta, dan otomatis beralih ke *Live LLM Streaming* begitu kredensial Gemini, OpenAI, atau OpenAI-compatible diisi melalui variabel environment maupun halaman *Admin AI Settings*.

