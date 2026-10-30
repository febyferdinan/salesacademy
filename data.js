// Demo content. All figures are sample data, as noted in the deck (slide 34).
window.DATA = {
  today: "Jumat, 16 Oktober 2026",
  users: {
    sales: { name: "Raka Pratama", first: "Raka", initials: "RP", role: "Account Executive", area: "Jabodetabek", manager: "Budi Santoso" },
    leader: { name: "Budi Santoso", first: "Budi", initials: "BS", role: "Sales Leader", area: "Jabodetabek", team: "Tim Jabodetabek" }
  },

  focusProducts: ["Connectivity", "Data Center", "Cloudeka", "SQURA Cybersec", "Collaboration", "Sales skill"],

  course: {
    id: "internet-dedicated",
    title: "Internet Dedicated: Selling Reliable Business Connectivity",
    short: "Internet Dedicated",
    category: "Connectivity",
    desc: "Pahami Internet Dedicated sebagai solusi konektivitas bisnis, bukan sekadar koneksi internet. Course ini membahas kebutuhan customer yang relevan, value proposition, dan pendekatan penjualan berbasis business needs, lengkap dengan simulasi discovery questions dan objection handling.",
    lead: "Pahami Internet Dedicated, kebutuhan customer yang relevan, value proposition, dan cara menjualnya berbasis business needs.",
    outcomes: ["Menjelaskan beda dedicated vs broadband", "Mengenali 5 buying trigger", "Menjawab keberatan harga dengan dampak bisnis"],
    cert: "Connectivity Associate",
    target: "31 Okt 2026",
    modules: [
      { n: 1, title: "Kenali Produk", sub: "Product Overview, Customer Pain, Ideal Customer Profile", dur: "2:30", status: "done", score: [4, 4] },
      { n: 2, title: "Value & Fitur", sub: "Value Proposition, Key Features & Business Benefits", dur: "2:45", status: "done", score: [3, 4] },
      { n: 3, title: "Use Case & Differentiator", sub: "Key Use Cases, Differentiator, Competitor & Alternative", dur: "2:50", status: "now", at: 80 },
      { n: 4, title: "Jualan di Lapangan", sub: "Discovery Questions, Objection Handling, Cross-sell, Do & Don't", dur: "3:00", status: "todo" },
      { n: 5, title: "Simulasi: Objection Handling Harga", sub: "Role-play singkat dengan skenario customer", dur: "5 soal", status: "todo", sim: true }
    ],
    files: [
      { type: "PDF", name: "Battlecard Internet Dedicated", meta: "PDF · 1,2 MB" },
      { type: "PPT", name: "Pitch deck Connectivity", meta: "PPT · 8 MB" }
    ],
    facilitators: [
      { name: "Dewi Anggraini", initials: "DA", role: "Presales Connectivity", tag: "Mentor", c: "c3" },
      { name: "Budi Santoso", initials: "BS", role: "Sales Leader Jabodetabek", tag: "Reviewer", c: "c2" }
    ]
  },

  // Module 3 video, 170 s
  video: {
    duration: 170,
    chapters: [
      { t: 0, title: "Key Use Cases", head: "Satu koneksi untuk semua yang kritikal.", tiles: [0, 1, 2] },
      { t: 40, title: "HQ & Branch Internet", head: "Cabang baru, koneksi tetap stabil.", tiles: [1, 5] },
      { t: 65, title: "Cloud & Data Center Access", head: "Jalur langsung ke cloud dan data center.", tiles: [2, 4, 5] },
      { t: 95, title: "Key Differentiator", head: "SLA terukur, bukan sekadar “up to”.", tiles: [0, 3, 4] },
      { t: 130, title: "Competitor & Alternative", head: "Bandingkan dampak bisnis, bukan harga per Mbps.", tiles: [3, 5] }
    ],
    subs: [
      [0, "Internet Dedicated dipakai saat koneksi tidak boleh terputus."],
      [9, "Contohnya kantor pusat yang menjalankan ERP, CRM, dan transaksi harian."],
      [19, "Bandwidth-nya khusus untuk satu customer, tidak dibagi dengan pengguna lain."],
      [30, "Jadi performa aplikasi kritikal tetap konsisten di jam sibuk."],
      [40, "Use case kedua: perusahaan yang terus membuka cabang baru."],
      [50, "Kantor cabang langsung online tanpa menunggu koneksi berbagi."],
      [58, "Tim IT pusat bisa memantau semua lokasi dengan standar yang sama."],
      [65, "Ketiga, akses ke cloud dan data center."],
      [75, "Workload di Cloudeka atau DC Tier III butuh jalur yang stabil dan latensi rendah."],
      [85, "Di sini Internet Dedicated jadi fondasi untuk cross-sell cloud dan security."],
      [95, "Lalu, apa yang membedakan kita?"],
      [104, "Pertama, SLA terukur dengan kompensasi yang jelas."],
      [114, "Kedua, enterprise support 24/7 dengan NOC yang memantau proaktif."],
      [122, "Ketiga, integrasi dengan portofolio cloud dan security Lintasarta."],
      [130, "Customer sering membandingkan dengan broadband karena harganya lebih murah."],
      [140, "Jangan berdebat soal harga per Mbps."],
      [148, "Ajak customer menghitung kerugian bisnis saat koneksi down satu jam."],
      [158, "Dari situ, nilai dedicated jadi jelas dengan sendirinya."]
    ],
    takeaways: [
      ["Jual ke kebutuhan", "Kantor pusat, cabang, akses cloud & data center, dan aplikasi kritikal."],
      ["Pembeda utama", "Reliability, SLA terukur, enterprise support, dan integrasi dengan cloud & security."],
      ["Bandingkan dampak", "Lawan broadband dari sisi dampak bisnis saat koneksi down, bukan harga per Mbps."]
    ]
  },

  quiz: [
    {
      q: "Customer punya 12 cabang dan ERP terpusat di kantor pusat. Kebutuhan mana yang paling relevan untuk dibuka?",
      opts: ["Paket broadband termurah untuk tiap cabang", "Koneksi dedicated dengan SLA agar akses ERP dari cabang tetap stabil", "Wi-Fi publik di setiap cabang", "Menambah kuota data seluler karyawan"],
      a: 1, t: 40, topic: "HQ & Branch Internet"
    },
    {
      q: "Apa pembeda utama Internet Dedicated dibanding broadband?",
      opts: ["Harga per Mbps paling murah", "Instalasi tanpa survei lokasi", "Bandwidth tidak dibagi, SLA terukur, dan enterprise support", "Bisa dipakai tanpa kontrak"],
      a: 2, t: 95, topic: "Key Differentiator"
    },
    {
      q: "Customer bilang, “Broadband lebih murah per Mbps.” Respons terbaik?",
      opts: ["Langsung tawarkan diskon besar", "Setuju dan arahkan ke paket broadband", "Ajak hitung kerugian bisnis saat koneksi down satu jam", "Jelaskan detail teknis fiber optik"],
      a: 2, t: 130, topic: "Competitor & Alternative"
    },
    {
      q: "Untuk customer yang memindahkan workload ke cloud, value apa yang ditekankan?",
      opts: ["Jalur stabil dan latensi rendah ke cloud & data center", "Kecepatan unduh film", "Router gratis", "Email bisnis tanpa batas"],
      a: 0, t: 65, topic: "Cloud & Data Center Access"
    }
  ],

  library: [
    { id: "v1", title: "Objection Handling: Harga vs Value", cat: "Sales skill", dur: "1:45", sec: 105, g: "g-amber", flag: "Disarankan", prog: 0 },
    { id: "v2", title: "Data Center Tier III dalam 3 Menit", cat: "Data Center", dur: "3:00", sec: 180, g: "g-navy", prog: 100 },
    { id: "v3", title: "Cloudeka untuk Bisnis yang Bertumbuh", cat: "Cloudeka", dur: "2:20", sec: 140, g: "g-teal", flag: "Baru", prog: 0 },
    { id: "v4", title: "SQURA: Membaca Kebutuhan Security", cat: "SQURA Cybersec", dur: "2:40", sec: 160, g: "g-violet", flag: "Baru", prog: 0 },
    { id: "v5", title: "SD-WAN untuk Perusahaan Multi-cabang", cat: "Connectivity", dur: "2:10", sec: 130, g: "g-blue", prog: 20 },
    { id: "v6", title: "Discovery Questions yang Membuka Kebutuhan", cat: "Sales skill", dur: "2:30", sec: 150, g: "g-amber", prog: 60 },
    { id: "v7", title: "Deka GPU: Komputasi AI di Indonesia", cat: "Cloudeka", dur: "2:30", sec: 150, g: "g-teal", flag: "Baru", prog: 0 },
    { id: "v8", title: "Internet Dedicated: Kenali Produk", cat: "Connectivity", dur: "2:30", sec: 150, g: "g-blue", prog: 100 },
    { id: "v9", title: "Microsoft Teams Rooms untuk Hybrid Office", cat: "Collaboration", dur: "2:50", sec: 170, g: "g-violet", prog: 0 },
    { id: "v10", title: "Executive Conversation: Bicara Bahasa Direksi", cat: "Sales skill", dur: "3:00", sec: 180, g: "g-navy", prog: 0 },
    { id: "v11", title: "Colocation vs Cloud: Kapan Pakai yang Mana", cat: "Data Center", dur: "2:15", sec: 135, g: "g-navy", flag: "Baru", prog: 0 },
    { id: "v12", title: "Managed Security Service dalam 2 Menit", cat: "SQURA Cybersec", dur: "1:55", sec: 115, g: "g-violet", prog: 0 }
  ],

  // Sales Toolkit: marketing, policy, and brand files (sample data)
  toolkitCats: ["Poster Gimmick", "Policy and Guideline", "Company Profile", "Brand Asset-Guideline"],
  toolkit: [
    { type: "PNG", name: "Poster Internet Dedicated: Koneksi Tanpa Jeda", cat: "Poster Gimmick", meta: "2,4 MB · Marketing Communication" },
    { type: "PNG", name: "Poster Cloudeka: Cloud Lokal untuk Bisnis", cat: "Poster Gimmick", meta: "2,1 MB · Marketing Communication" },
    { type: "PDF", name: "Gimmick Event: Standee & Tent Card", cat: "Poster Gimmick", meta: "3,8 MB · Marketing Communication" },
    { type: "PDF", name: "Kebijakan Diskon & Pricing Approval 2026", cat: "Policy and Guideline", meta: "640 KB · Commerce Operation" },
    { type: "PDF", name: "Panduan Penulisan Proposal", cat: "Policy and Guideline", meta: "1,1 MB · Sales Enablement" },
    { type: "PDF", name: "SOP Handover ke Delivery", cat: "Policy and Guideline", meta: "210 KB · Commerce Operation" },
    { type: "PDF", name: "Company Profile Lintasarta 2026 (Bahasa Indonesia)", cat: "Company Profile", meta: "12 MB · Corporate Communication" },
    { type: "PDF", name: "Company Profile Lintasarta 2026 (English)", cat: "Company Profile", meta: "12 MB · Corporate Communication" },
    { type: "PPT", name: "Deck Company Overview", cat: "Company Profile", meta: "18 MB · Corporate Communication" },
    { type: "PDF", name: "Brand Guideline Lintasarta", cat: "Brand Asset-Guideline", meta: "9,4 MB · Brand Team" },
    { type: "ZIP", name: "Logo Pack (PNG & SVG)", cat: "Brand Asset-Guideline", meta: "4,2 MB · Brand Team" },
    { type: "PPT", name: "Template Presentasi Lintasarta", cat: "Brand Asset-Guideline", meta: "6,5 MB · Brand Team" }
  ],

  materials: [
    { type: "PDF", name: "Battlecard Internet Dedicated", cat: "Connectivity", meta: "1,2 MB · Divalidasi Product Team" },
    { type: "PPT", name: "Pitch Deck Connectivity 2026", cat: "Connectivity", meta: "8 MB · Divalidasi Product Team" },
    { type: "PDF", name: "One-pager Cloudeka", cat: "Cloudeka", meta: "900 KB · Divalidasi Product Team" },
    { type: "PDF", name: "Brosur Data Center Tier III", cat: "Data Center", meta: "3,1 MB · Divalidasi Product Team" },
    { type: "PDF", name: "SQURA Security Assessment Checklist", cat: "SQURA Cybersec", meta: "640 KB · Divalidasi Product Team" },
    { type: "PPT", name: "Template Proposal Connectivity", cat: "Connectivity", meta: "5,6 MB · Divalidasi Product Team" },
    { type: "PPT", name: "Pitch Deck Data Center 2026", cat: "Data Center", meta: "7,2 MB · Divalidasi Product Team" },
    { type: "PDF", name: "Battlecard Cloudeka", cat: "Cloudeka", meta: "1,1 MB · Divalidasi Product Team" },
    { type: "PDF", name: "Discovery Questions per Industri", cat: "Sales skill", meta: "780 KB · Sales Enablement" }
  ],

  courses: [
    { id: "internet-dedicated", title: "Internet Dedicated: Selling Reliable Connectivity", cat: "Connectivity", prog: 68, mods: "5 modul", g: "g-blue", icon: "play" },
    { id: "dc", title: "Data Center Tier III untuk Enterprise", cat: "Data Center", prog: 40, mods: "4 modul", g: "g-navy", icon: "server" },
    { id: "discovery", title: "Discovery Questions yang Membuka Kebutuhan", cat: "Sales skill", prog: 0, mods: "3 modul", g: "g-amber", icon: "sparkle", isNew: true },
    { id: "cloudeka", title: "Cloudeka untuk Bisnis yang Bertumbuh", cat: "Cloudeka", prog: 0, mods: "4 modul", g: "g-teal", icon: "cloud" },
    { id: "squra", title: "SQURA: Membaca Kebutuhan Security", cat: "SQURA Cybersec", prog: 15, mods: "4 modul", g: "g-violet", icon: "shield" },
    { id: "exec", title: "Mastering Executive Conversation", cat: "Sales skill", prog: 100, mods: "3 modul", g: "g-navy", icon: "users" }
  ],

  agenda: [
    { d: "20", m: "OKT", title: "Mastering Executive Conversation", meta: "09.00–11.00 · Live class · 7 kursi tersisa" },
    { d: "23", m: "OKT", title: "Product Deep Dive: Cloudeka", meta: "14.00–15.30 · Webinar" },
    { d: "28", m: "OKT", title: "Ujian Sertifikasi Connectivity Associate", meta: "10.00–11.00 · Online proctored" },
    { d: "04", m: "NOV", title: "Role-play Clinic: Objection Handling", meta: "15.00–16.00 · Hybrid, Menara Thamrin" }
  ],

  leaderboard: [
    { r: 1, name: "Nadia Putri", initials: "NP", pts: 2480, c: "c3" },
    { r: 2, name: "Arif Wijaya", initials: "AW", pts: 2315, c: "c2" },
    { r: 3, name: "Sinta Maharani", initials: "SM", pts: 2190, c: "c4" }
  ],

  notifications: [
    { icon: "clipboard", title: "Task jatuh tempo hari ini", body: "Quick check Modul 3 Internet Dedicated", time: "08.10", unread: true },
    { icon: "calendar", title: "Live class 20 Okt, 7 kursi tersisa", body: "Mastering Executive Conversation", time: "Kemarin", unread: true },
    { icon: "megaphone", title: "Video baru: Deka GPU", body: "Komputasi AI dengan data tetap di Indonesia", time: "Kemarin", unread: false }
  ],

  inbox: [
    { from: "Budi Santoso", initials: "BS", c: "c2", title: "Pengingat: selesaikan Modul 3 sebelum Jumat", body: "Raka, minggu depan kita mulai pitching ke 3 akun logistik. Selesaikan Use Case & Differentiator dulu ya.", time: "08.12", unread: true },
    { from: "Sales Enablement", initials: "SE", c: "c3", title: "Battlecard Internet Dedicated sudah diperbarui", body: "Versi 2 Oktober 2026 menambahkan perbandingan SLA dan contoh hitung kerugian downtime.", time: "Kemarin", unread: true },
    { from: "LA Sales Academy", initials: "LA", c: "", title: "Kamu masuk 10 besar leaderboard!", body: "1.280 poin bulan ini. Selesaikan 1 course lagi untuk naik ke peringkat 7.", time: "14 Okt", unread: true },
    { from: "Commerce Operation", initials: "CO", c: "c4", title: "Jadwal ujian sertifikasi Q4", body: "Ujian Connectivity Associate dibuka 28 Oktober 2026. Syarat: 3 course Connectivity selesai.", time: "12 Okt", unread: false }
  ],

  tasks: [
    { title: "Quick check Modul 3: Use Case & Differentiator", src: "Dari Budi Santoso", due: "Hari ini", state: "due", go: "#/player" },
    { title: "Tonton: Objection Handling Harga vs Value", src: "Rekomendasi quick check", due: "20 Okt", state: "open", go: "#/library" },
    { title: "Siapkan discovery questions untuk PT Logistik Nusantara", src: "Dari Budi Santoso", due: "22 Okt", state: "open", go: "#/product/internet-dedicated" },
    { title: "Selesaikan Data Center Tier III untuk Enterprise", src: "Learning path Oktober", due: "31 Okt", state: "open", go: "#/courses" },
    { title: "Mastering Executive Conversation", src: "Learning path September", due: "Selesai", state: "done", go: "#/courses" }
  ],

  team: [
    { name: "Dimas Arya", initials: "DA", c: "c5", prog: 25, cert: "0 / 2", score: 62, note: "2 task terlambat", attn: true },
    { name: "Sari Wulandari", initials: "SW", c: "c4", prog: 40, cert: "1 / 2", score: 70, note: "Gagal ujian 1x", attn: true },
    { name: "Raka Pratama", initials: "RP", c: "", prog: 68, cert: "1 / 2", score: 84, note: "1 task jatuh tempo hari ini", attn: true },
    { name: "Nadia Putri", initials: "NP", c: "c3", prog: 95, cert: "2 / 2", score: 92, note: "On track" },
    { name: "Arif Wijaya", initials: "AW", c: "c2", prog: 88, cert: "2 / 2", score: 89, note: "On track" },
    { name: "Sinta Maharani", initials: "SM", c: "c4", prog: 84, cert: "2 / 2", score: 88, note: "On track" },
    { name: "Yoga Prasetyo", initials: "YP", c: "c2", prog: 79, cert: "1 / 2", score: 81, note: "On track" },
    { name: "Fajar Nugroho", initials: "FN", c: "c3", prog: 76, cert: "2 / 2", score: 80, note: "On track" },
    { name: "Lestari Handayani", initials: "LH", c: "c5", prog: 82, cert: "2 / 2", score: 86, note: "On track" },
    { name: "Rizky Ramadhan", initials: "RR", c: "c2", prog: 74, cert: "1 / 2", score: 79, note: "On track" },
    { name: "Putri Anggraeni", initials: "PA", c: "c4", prog: 81, cert: "2 / 2", score: 85, note: "On track" },
    { name: "Hendra Gunawan", initials: "HG", c: "c3", prog: 77, cert: "2 / 2", score: 82, note: "On track" },
    { name: "Maya Sari", initials: "MS", c: "c5", prog: 86, cert: "2 / 2", score: 87, note: "On track" },
    { name: "Andi Kurniawan", initials: "AK", c: "c2", prog: 73, cert: "1 / 2", score: 78, note: "On track" },
    { name: "Salsabila Rahma", initials: "SR", c: "c4", prog: 80, cert: "2 / 2", score: 84, note: "On track" }
  ],
  weekly: [38, 42, 45, 49, 52, 55, 59, 63, 68, 72],

  product: {
    name: "Internet Dedicated",
    cat: "Connectivity",
    desc: "Koneksi internet khusus untuk bisnis dengan bandwidth dedicated dan SLA terukur.",
    validated: "Divalidasi Product Team · 02 Okt 2026",
    sections: [
      { key: "overview", label: "Overview", body: "<p>Layanan internet dengan bandwidth khusus satu customer (1:1), simetris upload dan download, dan SLA ketersediaan yang terukur. Cocok untuk perusahaan yang operasionalnya bergantung pada aplikasi online.</p>" },
      { key: "pain", label: "Customer Pain", body: "<ul><li>Aplikasi ERP/CRM lambat di jam sibuk</li><li>Cabang sering putus, transaksi tertunda</li><li>Tidak ada jaminan pemulihan saat gangguan</li><li>Tim IT kewalahan mengelola banyak ISP</li></ul>" },
      { key: "icp", label: "Ideal Customer", body: "<ul><li>Perusahaan multi-cabang (logistik, retail, perbankan, manufaktur)</li><li>Menjalankan aplikasi kritikal terpusat</li><li>Sedang migrasi ke cloud atau data center</li></ul><p class='small muted' style='margin-top:8px'>Buying trigger: buka cabang baru, migrasi cloud, audit IT, insiden downtime, renewal kontrak ISP.</p>" },
      { key: "value", label: "Value Proposition", body: "<p>Koneksi yang bisa diandalkan untuk bisnis yang tidak boleh berhenti: performa konsisten, SLA jelas, dan satu mitra untuk konektivitas, cloud, dan security.</p>" },
      { key: "features", label: "Key Features", body: "<ul><li>Bandwidth dedicated 1:1, simetris</li><li>SLA ketersediaan dengan kompensasi</li><li>NOC & enterprise support 24/7</li><li>Portal monitoring trafik</li></ul>" },
      { key: "benefits", label: "Business Benefits", body: "<ul><li>Produktivitas tidak terganggu di jam sibuk</li><li>Risiko kehilangan transaksi berkurang</li><li>Biaya pengelolaan IT lebih terprediksi</li></ul>" },
      { key: "usecase", label: "Use Cases", body: "<ul><li>Kantor pusat dengan ERP terpusat</li><li>Cabang baru yang harus langsung online</li><li>Akses stabil ke Cloudeka dan DC Tier III</li></ul>" },
      { key: "diff", label: "Differentiator", body: "<p>SLA terukur, NOC proaktif, jangkauan nasional, dan integrasi dengan portofolio cloud & security Lintasarta. Bandingkan dengan broadband dari sisi dampak bisnis, bukan harga per Mbps.</p>" },
      { key: "discovery", label: "Discovery Q", open: true, quotes: [
        ["Aplikasi apa yang paling kritikal kalau koneksi down?", "Tujuan: menggali business impact"],
        ["Berapa lama downtime terakhir dan apa dampaknya?", "Tujuan: membuka pain"],
        ["Ada rencana buka cabang atau migrasi ke cloud tahun ini?", "Tujuan: buying trigger"]
      ] },
      { key: "objection", label: "Objection", quotes: [
        ["“Broadband lebih murah.”", "Respons: ajak hitung kerugian satu jam downtime dibanding selisih biaya bulanan."],
        ["“Kami sudah punya ISP.”", "Respons: tawarkan sebagai jalur backup untuk aplikasi kritikal dulu."]
      ] },
      { key: "crosssell", label: "Cross-sell", body: "<ul><li>SD-WAN untuk mengelola banyak cabang</li><li>Cloudeka untuk workload yang dimigrasi</li><li>SQURA Managed Security untuk proteksi trafik</li></ul>" },
      { key: "dodont", label: "Do & Don't", pair: [["Mulai dari kebutuhan bisnis dan aplikasi kritikal", "Berdebat harga per Mbps"], ["Bawa contoh hitung kerugian downtime", "Menjanjikan SLA di luar kontrak standar"]] }
    ]
  },

  certs: [
    { name: "Connectivity Associate", done: 2, need: 3, state: "Sedang berjalan", exam: "28 Okt 2026" },
    { name: "Data Center Associate", done: 1, need: 3, state: "Sedang berjalan", exam: "Belum dijadwalkan" },
    { name: "Consultative Selling Foundation", done: 3, need: 3, state: "Tersertifikasi", exam: "Lulus 12 Sep 2026, skor 88" }
  ],

  news: [
    { tag: "Produk", title: "Deka GPU resmi tersedia untuk enterprise", body: "Komputasi AI dengan data tetap di Indonesia. Video 2:30 dan product page sudah tersedia di Learning Library.", date: "15 Okt 2026" },
    { tag: "Program", title: "Q4 Sales Sprint: target sertifikasi Connectivity", body: "Semua Account Executive ditargetkan lulus Connectivity Associate sebelum 30 November 2026.", date: "10 Okt 2026" },
    { tag: "Update", title: "Battlecard Internet Dedicated versi Oktober", body: "Tambahan perbandingan SLA dan contoh perhitungan kerugian downtime untuk sektor logistik.", date: "02 Okt 2026" }
  ],

  process: [
    { t: "Lead & Qualification", d: "Cek ICP dan buying trigger" },
    { t: "Discovery", d: "Gali kebutuhan dan dampak bisnis" },
    { t: "Solution & Proposal", d: "Susun solusi bersama Presales" },
    { t: "Negotiation", d: "Pricing approval sesuai matriks" },
    { t: "Closing & Handover", d: "Serah terima ke Delivery" }
  ]
};
