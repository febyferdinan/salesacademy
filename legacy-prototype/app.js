/* LA Sales Academy — clickable demo prototype (vanilla JS, hash router). */
(() => {
  const D = window.DATA;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const fmt = (s) => { s = Math.max(0, Math.floor(s)); return String(Math.floor(s / 60)).padStart(2, "0") + ":" + String(s % 60).padStart(2, "0"); };
  const num = (n) => n.toLocaleString("id-ID");
  const params = new URLSearchParams(location.search);
  const IN_FRAME = params.has("frame");
  if (IN_FRAME) document.documentElement.classList.add("frame");

  /* ---------- Icons ---------- */
  const P = {
    home: '<path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
    inbox: '<path d="M22 12h-6l-2 3h-4l-2-3H2"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>',
    book: '<path d="M4 19.5V5a2 2 0 0 1 2-2h14v16H6.5A2.5 2.5 0 0 0 4 21.5z"/><path d="M8 7h8M8 11h5"/>',
    clipboard: '<rect x="8" y="2" width="8" height="4" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="m9 14 2 2 4-4"/>',
    flow: '<circle cx="6" cy="6" r="3"/><circle cx="18" cy="18" r="3"/><path d="M6 9v3a3 3 0 0 0 3 3h6"/>',
    map: '<path d="M9 3 3 5.5v15L9 18l6 3 6-2.5v-15L15 6z"/><path d="M9 3v15M15 6v15"/>',
    library: '<rect x="3" y="3" width="18" height="18" rx="4"/><path d="m10 8 6 4-6 4z"/>',
    briefcase: '<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2M2 13h20"/>',
    award: '<circle cx="12" cy="8" r="6"/><path d="M8.2 13.2 7 22l5-3 5 3-1.2-8.8"/>',
    megaphone: '<path d="m3 11 18-5v12L3 14z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/>',
    calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
    bell: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',
    sparkle: '<path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z"/><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z"/>',
    play: '<path d="M7 4.5v15a1 1 0 0 0 1.5.86l12-7.5a1 1 0 0 0 0-1.72l-12-7.5A1 1 0 0 0 7 4.5z"/>',
    pause: '<rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/>',
    download: '<path d="M12 3v12M7 10l5 5 5-5M5 21h14"/>',
    left: '<path d="m15 18-6-6 6-6"/>',
    right: '<path d="m9 18 6-6-6-6"/>',
    down: '<path d="m6 9 6 6 6-6"/>',
    x: '<path d="M18 6 6 18M6 6l12 12"/>',
    flame: '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.07-2.14-.22-4.05 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.15.43-2.29 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    star: '<path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.3 6.4 20.2l1.1-6.2L3 9.6l6.2-.9z"/>',
    file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/>',
    bookmark: '<path d="M19 21l-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>',
    send: '<path d="M22 2 11 13M22 2l-7 20-4-9-9-4z"/>',
    expand: '<path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>',
    shrink: '<path d="M4 14h6v6M20 10h-6V4M14 10l7-7M3 21l7-7"/>',
    phone: '<rect x="6" y="2" width="12" height="20" rx="3"/><path d="M11 18h2"/>',
    refresh: '<path d="M3 12a9 9 0 0 1 15.5-6.2L21 8M21 3v5h-5M21 12a9 9 0 0 1-15.5 6.2L3 16M3 21v-5h5"/>',
    lock: '<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
    logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    server: '<rect x="3" y="3" width="18" height="7" rx="2"/><rect x="3" y="14" width="18" height="7" rx="2"/><path d="M7 6.5h.01M7 17.5h.01"/>',
    cloud: '<path d="M17.5 19a4.5 4.5 0 1 0-1.4-8.8A6 6 0 0 0 4.5 13 3 3 0 0 0 6 19z"/>',
    shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
    grid: '<rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 8h.01M11 12h1v4h1"/>',
    trophy: '<path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0z"/><path d="M17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3"/>',
    link: '<path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7"/>',
    minus: '<path d="M5 12h14"/>'
  };
  const FILLED = new Set(["play", "pause"]);
  const ic = (n, cls = "") => `<svg class="ico ${FILLED.has(n) ? "fill" : ""} ${cls}" viewBox="0 0 24 24" aria-hidden="true">${P[n] || ""}</svg>`;

  /* ---------- State ---------- */
  const KEY = IN_FRAME ? "la-academy-demo-v1-frame" : "la-academy-demo-v1";
  const fresh = () => ({
    loggedIn: false, role: "sales", onboarded: false, wt: null, focus: ["Connectivity"],
    t: 80, m3done: false, points: 1280, failedLogin: 0,
    reminded: {}, registered: {}, readInbox: {}, notifSeen: false, saved: false,
    libTab: "video", libCat: "Semua", toolCat: "Semua", libDur: "all", libSort: "new",
    teamFilter: "all", assignSel: ["Dimas Arya", "Sari Wulandari"], openSec: "discovery"
  });
  let S = fresh();
  try { const raw = localStorage.getItem(KEY); if (raw) S = Object.assign(fresh(), JSON.parse(raw)); } catch (e) { /* storage unavailable */ }
  if (IN_FRAME && params.get("role")) { S.loggedIn = true; S.onboarded = true; S.role = params.get("role"); }
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* ignore */ } };

  const P_ = { playing: false, speed: 1, cc: true, hd: true, last: 0 };
  let raf = 0;
  let chat = { open: false, msgs: [] };

  const user = () => D.users[S.role];
  const coursePct = () => (S.m3done ? 74 : 68);
  const modules = () => D.course.modules.map((m) => {
    if (m.n === 3 && S.m3done) return { ...m, status: "done", score: S.m3score || [4, 4] };
    if (m.n === 4 && S.m3done) return { ...m, status: "now" };
    return m;
  });

  /* ---------- Router ---------- */
  const route = () => {
    const h = location.hash.replace(/^#\/?/, "") || "";
    const [name, param] = h.split("/");
    return { name: name || "", param };
  };
  const go = (h) => { if (location.hash === h) render(); else location.hash = h; };
  window.addEventListener("hashchange", render);

  /* ---------- Toast & overlays ---------- */
  function toast(msg, icon = "check") {
    const el = document.createElement("div");
    el.className = "toast";
    el.innerHTML = ic(icon) + `<span>${msg}</span>`;
    $("#toast-root").appendChild(el);
    setTimeout(() => { el.style.transition = "opacity .3s"; el.style.opacity = "0"; setTimeout(() => el.remove(), 300); }, 2800);
  }
  let lastFocus = null;
  function modal(html, cls = "") {
    lastFocus = document.activeElement;
    $("#overlay-root").innerHTML = `<div class="scrim" data-act="scrim"><div class="modal ${cls}" role="dialog" aria-modal="true">${html}</div></div>`;
    const f = $("#overlay-root [autofocus]") || $("#overlay-root button, #overlay-root input");
    f && f.focus();
  }
  function closeModal() {
    $("#overlay-root").innerHTML = "";
    if (lastFocus && document.contains(lastFocus)) lastFocus.focus();
  }
  function closeDrop() { $$(".drop").forEach((d) => d.remove()); }

  /* ---------- Shell ---------- */
  // Grouped like the reference sidebar: Menu / Belajar / Jualan / Info
  const NAV_GROUPS = [
    ["Menu", [["dashboard", "home", "Dashboard"], ["inbox", "inbox", "Inbox"], ["tasks", "clipboard", "Tasks"]]],
    ["Belajar", [["courses", "book", "Courses"], ["library", "library", "Learning Library"], ["certification", "award", "Certification"], ["calendar", "calendar", "Enablement Calendar"]]],
    ["Jualan", [["products", "map", "Product Mapping"], ["toolkit", "briefcase", "Sales Toolkit"], ["process", "flow", "Business Process"]]],
    ["Info", [["news", "megaphone", "News & Announcements"]]]
  ];
  const navGroups = () => NAV_GROUPS.map(([g, items]) => [g, S.role === "leader"
    ? items.map((n) => (n[0] === "dashboard" ? ["team", "users", "Team Progress"] : n))
    : items]);
  const navItems = () => navGroups().flatMap(([, items]) => items);
  const unread = () => D.inbox.filter((m, i) => m.unread && !S.readInbox[i]).length;
  const activeKey = (name) => ({ course: "courses", product: "products", player: "courses" }[name] || name);

  // One grouped menu, used by the desktop sidebar and the mobile "Semua menu" list
  const navHtml = (ak) => navGroups().map(([g, items]) => `<div class="nav-group">${g}</div><nav class="nav" aria-label="${g}">${items.map(([k, i, l]) =>
    `<a href="#/${k}" class="${ak === k ? "active" : ""}" ${ak === k ? 'aria-current="page"' : ""}>${ic(i)}<span>${l}</span>${k === "inbox" && unread() ? `<span class="count">${unread()}</span>` : ""}</a>`).join("")}</nav>`).join("");
  // Which bottom-nav tab owns each page on mobile, so the tab stays lit on sub-pages
  const tabOf = (ak) => ({ dashboard: "dashboard", team: "dashboard", courses: "courses", course: "courses", library: "courses", certification: "courses", calendar: "courses",
    products: "toolkit", toolkit: "toolkit", process: "toolkit", profile: "profile", inbox: "profile", tasks: "profile", news: "profile" }[ak]);

  function shell(r, body, { title, sub, mGreet = false, sticky = false } = {}) {
    const u = user();
    const ak = activeKey(r.name);
    const nav = navHtml(ak);
    const home = S.role === "leader" ? ["team", "users", "Tim"] : ["dashboard", "home", "Beranda"];
    const bn = [home, ["courses", "book", "Belajar"], ["search", "search", "Cari"], ["toolkit", "briefcase", "Toolkit"], ["profile", "user", "Profil"]]
      .map(([k, i, l]) => k === "search"
        ? `<a href="#" data-act="search"><span class="ic">${ic(i)}</span>${l}</a>`
        : `<a href="#/${k}" class="${tabOf(ak) === tabOf(k) ? "active" : ""}" ${tabOf(ak) === tabOf(k) ? 'aria-current="page"' : ""}><span class="ic">${ic(i)}</span>${l}</a>`).join("");
    return `<div class="${sticky ? "has-sticky" : ""}">
    <div class="shell">
      <aside class="sidebar" aria-label="Menu utama">
        <a class="brand-logo" href="#/dashboard"><img src="assets/logo-la-sales-academy.png" alt="LA Sales Academy" width="720" height="107"></a>
        ${nav}
        <div class="sidebar-foot"><div class="help-card">${ic("info", "sm")}<span><strong>Butuh bantuan?</strong><a href="mailto:commerce.operation@lintasarta.co.id">commerce.operation@lintasarta.co.id</a></span></div></div>
      </aside>
      <div class="main">
        <header class="topbar">
          <div class="page-title d-only"><h1>${title}</h1><p>${sub || D.today}</p></div>
          ${mGreet ? `<div class="m-greet m-only"><span class="avatar">${u.initials}</span><div><small>Selamat pagi,</small><b>${u.name}</b></div></div>` : `<div class="m-greet m-only"><h1 class="m-title">${title}</h1></div>`}
          <button class="search-trigger" data-act="search" aria-label="Cari">${ic("search")}<span>Cari materi, course, atau produk…</span><span class="kbd d-only">⌘K</span></button>
          <button class="icon-btn" data-act="notif" aria-label="Notifikasi">${ic("bell")}${S.notifSeen ? "" : '<span class="dot"></span>'}</button>
          <a class="me d-only" href="#/profile"><span class="avatar ${S.role === "leader" ? "c2" : ""}">${u.initials}</span><span><div class="me-name">${u.name}</div><div class="me-role">${u.role}</div></span></a>
        </header>
        <main class="content" id="main">${body}</main>
      </div>
    </div>
    <nav class="bottom-nav" aria-label="Navigasi bawah">${bn}</nav>
    <button class="fab" data-act="chat">${ic("sparkle")}<span>Tanya AI</span></button></div>`;
  }

  /* ---------- Pages ---------- */
  function pageDashboard(r) {
    const u = user();
    const mods = modules();
    const cur = mods.find((m) => m.status === "now");
    const left = S.m3done ? 1 : 2;
    const pct = coursePct();
    const rank = S.points > 1280 ? 9 : 10;
    const watched = Math.round((S.t / D.video.duration) * 100);
    const cont = `
      <div class="continue">
        <div class="thumb">${ic("play", "lg")}</div>
        <div>
          <h3>${D.course.short} · Modul ${cur.n}: ${cur.title}</h3>
          <div class="meta">± 3 menit · ${S.m3done ? "belum mulai" : `berhenti di ${fmt(S.t)}, ${watched}% ditonton`}</div>
          <div class="bar" style="max-width:260px"><span style="width:${S.m3done ? 0 : watched}%"></span></div>
        </div>
        <button class="btn btn-primary" data-act="${S.m3done ? "module4" : "resume"}">${ic("play", "sm")}${S.m3done ? "Mulai Modul 4" : "Lanjutkan Belajar"}</button>
      </div>`;
    const lb = D.leaderboard.slice(0, 2).map((p) => `<div class="lb-row"><span class="rank">${p.r}</span><span class="avatar sm ${p.c}">${p.initials}</span><span>${p.name}</span><b>${num(p.pts)}</b></div>`).join("");
    const body = `
      <section class="top-row">
        <div class="hero" aria-label="Lanjutkan belajar">
          <span class="tag glass">${ic("flame", "sm")}Streak 6 hari</span>
          <h2 class="hero-greet">Selamat pagi, ${u.first}!</h2>
          <p class="hero-greet">Tinggal ${left} modul lagi untuk menyelesaikan learning path bulan ini.</p>
          ${cont}
        </div>
        <div class="promo d-only">
          <span class="tag" style="background:#fff;color:var(--navy);align-self:flex-start">Course baru</span>
          <h3>Deka GPU: Komputasi AI di Indonesia</h3>
          <p>Video 2:30 dan product page sudah tersedia. Cocok untuk customer yang butuh AI dengan data tetap di Indonesia.</p>
          <button class="btn btn-sm" data-go="#/library">Lihat course</button>
          <div class="promo-tiles"><i></i><i></i><i></i><i></i></div>
        </div>
      </section>

      <section class="kpis" aria-label="Ringkasan">
        <button class="kpi" data-go="#/profile"><span class="kpi-label"><span class="ico-wrap">${ic("clock", "sm")}</span>Waktu belajar bulan ini</span>
          <span class="kpi-value">12,5 jam <span class="minibars"><i style="height:30%"></i><i style="height:45%"></i><i style="height:38%"></i><i style="height:62%"></i><i style="height:55%"></i><i style="height:100%"></i></span></span>
          <span class="kpi-foot up">+2,4 jam dari Sep</span></button>
        <button class="kpi" data-go="#/courses"><span class="kpi-label"><span class="ico-wrap">${ic("book", "sm")}</span>Course selesai</span>
          <span class="kpi-value">8 / 12</span>
          <span class="seg" style="height:6px">${segs(8, 12)}</span><span class="kpi-foot">67% target kuartal</span></button>
        <button class="kpi ${S.m3done ? "" : "warn"}" data-go="#/tasks"><span class="kpi-label"><span class="ico-wrap">${ic("clipboard", "sm")}</span>Task menunggu</span>
          <span class="kpi-value">${S.m3done ? 2 : 3}</span>
          ${S.m3done ? '<span class="kpi-foot">Tidak ada yang jatuh tempo hari ini</span>' : '<span class="tag red" style="align-self:flex-start">1 jatuh tempo hari ini</span>'}</button>
        <button class="kpi" data-go="#/profile"><span class="kpi-label"><span class="ico-wrap">${ic("star", "sm")}</span>Poin saat ini</span>
          <span class="kpi-value">${num(S.points)}</span>
          <span class="kpi-foot">Peringkat ${rank} dari 300 Sales</span></button>
      </section>

      <section class="grid-dash">
        <div class="stack">
          <div class="card">
            <div class="card-head"><h2>Learning path kamu</h2><a class="link" href="#/courses">Lihat semua course</a></div>
            ${pathItem("#/course", "g-blue", "play", D.course.title.replace("Business ", ""), "Connectivity", pct)}
            ${pathItem("#/courses", "g-navy", "server", "Data Center Tier III untuk Enterprise", "Data Center", 40)}
            ${pathItem("#/courses", "g-amber", "sparkle", "Discovery Questions yang Membuka Kebutuhan", "Sales skill", 0)}
          </div>
          <div class="card sell">
            <h3>Ada meeting customer? Siapkan dalam 1 menit</h3>
            <p class="small muted" style="margin-top:2px">Materi produk, battlecard, dan jawaban objection dalam satu tempat.</p>
            <div class="sell-actions">
              <button data-go="#/product/internet-dedicated"><span class="ico-wrap">${ic("map")}</span>Product Mapping</button>
              <button data-go="#/toolkit"><span class="ico-wrap">${ic("briefcase")}</span>Sales Toolkit</button>
              <button class="ai" data-act="chat"><span class="ico-wrap">${ic("sparkle")}</span>Tanya AI</button>
            </div>
          </div>
        </div>
        <div class="stack">
          <div class="card">
            <div class="card-head"><h2>Agenda enablement terdekat</h2></div>
            ${D.agenda.slice(0, 2).map(agendaRow).join("")}
            <a class="small" href="#/calendar" style="display:inline-flex;gap:6px;align-items:center;margin-top:10px;font-weight:var(--fw-medium)">${ic("calendar", "sm")}Buka Enablement Calendar</a>
          </div>
          <div class="card">
            <div class="card-head"><h2>Leaderboard bulan ini</h2><span class="link muted">poin</span></div>
            ${lb}
            <div class="lb-gap">···</div>
            <div class="lb-row me-row"><span class="rank">${rank}</span><span class="avatar sm">${u.initials}</span><span><b>Kamu</b> · ${u.first}</span><b>${num(S.points)}</b></div>
          </div>
        </div>
      </section>`;
    return shell(r, body, { title: "Dashboard", mGreet: true });
  }
  const segs = (on, total) => Array.from({ length: total }, (_, i) => `<i class="${i < on ? "on" : ""}"></i>`).join("");
  const segPct = (pct, n = 12) => segs(Math.round((pct / 100) * n), n);
  function pathItem(href, g, icon, title, cat, pct) {
    return `<a class="path-item" href="${href}" style="color:inherit">
      <span class="path-icon ${g}">${ic(icon)}</span>
      <span><h4>${title}</h4><span class="row"><span class="tag">${cat}</span><span class="seg">${segPct(pct)}</span><span class="xs muted">${pct ? pct + "%" : ""}</span></span></span>
      ${pct ? "" : '<span class="tag amber">Baru</span>'}
    </a>`;
  }
  const agendaRow = (a) => `<div class="agenda"><span class="date-pill"><b>${a.d}</b><span>${a.m}</span></span><div><h4>${a.title}</h4><div class="xs muted">${a.meta}</div></div></div>`;

  function pageCourse(r) {
    // Layout follows wireframe 02 (slide 28): header card, module list, outcomes + supporting files
    const c = D.course;
    const mods = modules();
    const doneN = mods.filter((m) => m.status === "done").length;
    const allDone = doneN === mods.length;
    const cta = allDone ? "Ulangi course" : doneN === 0 && !S.t ? "Mulai course" : S.m3done ? "Lanjutkan Modul 4" : "Lanjutkan Modul 3";
    const modRow = (m) => {
      const st = m.status === "done" ? `<span class="st done">${ic("check", "sm")}</span>` : m.status === "now" ? `<span class="st now">${ic("play", "sm")}</span>` : `<span class="st">${m.n}</span>`;
      const right = m.status === "done" ? `<b>${m.dur}</b><span class="muted">Selesai · skor ${m.score[0]}/${m.score[1]}</span>`
        : m.status === "now" ? `<b>${m.dur}</b><span class="now-label">Sedang berjalan${m.n === 3 ? " · " + fmt(S.t) : ""}</span>`
        : `<b>${m.dur}</b><span class="muted">Belum mulai</span>`;
      return `<button class="module ${m.status === "now" ? "current" : ""}" data-act="module" data-n="${m.n}">${st}<span><h4>${m.sim ? "Simulasi · " : "Modul " + m.n + " · "}${m.title.replace(/^Simulasi: /, "")}</h4><p>${m.sub}</p></span><span class="right">${right}</span></button>`;
    };
    const body = `
      <div class="crumbs"><a href="#/courses">Courses</a>${ic("right", "sm")}<a href="#/courses">Connectivity</a>${ic("right", "sm")}<b>Internet Dedicated</b>
        <span style="margin-left:auto;display:flex;gap:8px"><button class="btn btn-ghost btn-sm" data-act="save-course">${ic("bookmark", "sm")}${S.saved ? "Tersimpan" : "Simpan"}</button></span></div>
      <section class="card course-head">
        <div class="course-thumb g-blue"><span class="play-disc">${ic("play")}</span></div>
        <div class="course-info">
          <span class="tag">${c.category}</span>
          <h1>${c.title}</h1>
          <p class="course-lead">${c.lead}</p>
          <div class="course-foot">
            <div id="course-progress">
              <div class="course-meta"><span>5 modul</span><span>±15 menit</span><span>Bagian dari sertifikasi ${c.cert}</span></div>
              <div class="course-prog"><span class="seg">${segs(doneN, mods.length)}</span><span>${doneN} dari ${mods.length} modul</span></div>
            </div>
            <button class="btn btn-primary" data-act="${S.m3done ? "module4" : "resume"}">${ic("play", "sm")}${cta}</button>
          </div>
        </div>
      </section>
      <section class="grid-course">
        <div>
          <div class="card-head"><h2>Isi course</h2></div>
          <div id="course-modules">${mods.map(modRow).join("")}</div>
          <p class="xs muted" style="margin-top:12px">Semua modul bisa dibuka kapan saja. Urutan disarankan, tidak dikunci.</p>
        </div>
        <div class="stack">
          <div class="card">
            <div class="card-head"><h3>Setelah course ini kamu bisa</h3></div>
            <ul class="outcome-list">${c.outcomes.map((o) => `<li>${ic("check", "sm")}<span>${o}</span></li>`).join("")}</ul>
          </div>
          <div class="card">
            <div class="card-head"><h3>Materi pendukung</h3></div>
            ${c.files.map(fileRow).join("")}
          </div>
        </div>
      </section>`;
    return shell(r, body, { title: "Courses" });
  }
  const fileRow = (f) => `<div class="file-row"><span class="file-type ${f.type.toLowerCase()}">${f.type}</span><div><h4>${f.name}</h4><div class="xs muted">${f.meta}</div></div><button class="dl" data-act="download" data-name="${esc(f.name)}" aria-label="Unduh ${esc(f.name)}">${ic("download", "sm")}</button></div>`;

  function pageLibrary(r) {
    const cats = ["Semua", "Connectivity", "Data Center", "Cloudeka", "SQURA Cybersec", "Collaboration", "Sales skill"];
    const chips = cats.map((c) => `<button class="chip ${S.libCat === c ? "on" : ""}" data-act="libcat" data-v="${c}">${c}</button>`).join("");
    let body = `
      <div class="lib-toolbar">
        <div class="tabs" role="tablist"><button role="tab" class="${S.libTab === "video" ? "on" : ""}" data-act="libtab" data-v="video">Video Learning</button><button role="tab" class="${S.libTab === "mat" ? "on" : ""}" data-act="libtab" data-v="mat">Academy Materials</button></div>
        <div class="right">
          <select class="select" data-act="libdur" aria-label="Durasi"><option value="all">Durasi: Semua</option><option value="lt2" ${S.libDur === "lt2" ? "selected" : ""}>Di bawah 2 menit</option><option value="2to3" ${S.libDur === "2to3" ? "selected" : ""}>2–3 menit</option></select>
          <select class="select" data-act="libsort" aria-label="Urutkan"><option value="new">Terbaru</option><option value="short" ${S.libSort === "short" ? "selected" : ""}>Terpendek</option><option value="az" ${S.libSort === "az" ? "selected" : ""}>A–Z</option></select>
        </div>
      </div>
      <div class="chips">${chips}</div>`;
    if (S.libTab === "video") {
      let list = D.library.filter((v) => (S.libCat === "Semua" || v.cat === S.libCat) && (S.libDur === "all" || (S.libDur === "lt2" ? v.sec < 120 : v.sec >= 120 && v.sec <= 180)));
      if (S.libSort === "short") list = [...list].sort((a, b) => a.sec - b.sec);
      if (S.libSort === "az") list = [...list].sort((a, b) => a.title.localeCompare(b.title));
      if (!S.m3done && (S.libCat === "Semua" || S.libCat === "Connectivity")) {
        const pct = Math.round((S.t / D.video.duration) * 100);
        body += `<button class="resume" data-act="resume">
          <div class="resume-media"><span class="play-disc">${ic("play", "lg")}</span><span class="time">${fmt(S.t)} / 02:50</span></div>
          <div class="resume-body"><span class="xs" style="color:#8EC6FF;font-weight:var(--fw-medium)">Lanjutkan menonton</span><h3>Internet Dedicated: Use Case & Differentiator</h3><p>Modul 3 dari 5 · Connectivity · bagian dari sertifikasi Connectivity Associate</p>
          <div style="display:flex;gap:12px;align-items:center;margin-top:6px"><div class="bar light" style="flex:1"><span style="width:${pct}%;background:var(--sky)"></span></div><span class="xs">${pct}%</span></div></div>
        </button>`;
      }
      if (list.length) {
        body += `<div class="card-head" style="margin:4px 0 -4px"><h2>Direkomendasikan untukmu</h2><span class="link muted">Berdasarkan produk fokus & hasil quick check</span></div>
          <div class="vgrid">${list.map(vcard).join("")}</div>`;
      } else {
        const rel = D.library.filter((v) => v.cat === S.libCat).slice(0, 3);
        const relAlt = rel.length ? rel : D.library.slice(0, 3);
        body += `<div class="empty"><h3>Belum ada video ${S.libCat === "Semua" ? "" : S.libCat + " "}${S.libDur === "lt2" ? "di bawah 2 menit" : "dengan durasi ini"}.</h3><p>Hapus filter durasi untuk melihat semua video, atau coba yang terkait di bawah.</p><button class="btn btn-primary" data-act="clearfilter">Hapus filter</button></div>
          <div class="card-head" style="margin:4px 0 -4px"><h2>Video terkait</h2></div><div class="vgrid">${relAlt.map(vcard).join("")}</div>`;
      }
    } else {
      const mats = D.materials.filter((m) => S.libCat === "Semua" || m.cat === S.libCat);
      body += `<div class="card">${mats.length ? mats.map(matRow).join("")
        : `<div class="empty" style="border:0"><h3>Belum ada materi ${S.libCat}.</h3><p>Materi baru diunggah Product Team setiap bulan.</p><button class="btn btn-primary" data-act="clearfilter">Lihat semua materi</button></div>`}</div>`;
    }
    return shell(r, body, { title: "Learning Library", sub: "38 video · 24 materi · update terakhir 15 Okt 2026" });
  }
  function vcard(v) {
    const status = v.prog === 100 ? '<span style="color:var(--green);font-weight:var(--fw-medium)">Selesai</span>' : v.prog ? `${v.prog}%` : "Belum ditonton";
    return `<button class="vcard" data-act="video" data-id="${v.id}">
      <span class="vthumb ${v.g}">${v.flag ? `<span class="tag ${v.flag === "Baru" ? "glass" : "amber"} flag">${v.flag}</span>` : ""}<span class="play-disc">${ic("play", "sm")}</span><span class="dur">${v.dur}</span></span>
      <h4>${v.title}</h4>
      <span class="vmeta"><span class="tag">${v.cat}</span><span>${status}</span></span>
      <span class="bar ${v.prog === 100 ? "green" : ""}"><span style="width:${v.prog}%"></span></span>
    </button>`;
  }

  function pagePlayer() {
    const V = D.video;
    const segsHtml = V.chapters.map((c, i) => {
      const end = V.chapters[i + 1] ? V.chapters[i + 1].t : V.duration;
      return `<span class="chap" style="flex:${end - c.t}"><span></span></span>`;
    }).join("");
    const chapList = V.chapters.map((c, i) => `<button class="chap-item" data-act="seek" data-t="${c.t}"><span class="ck">${ic("check", "sm")}</span><span>${c.title}</span><time>${fmt(c.t)}</time></button>`).join("");
    return `
    <div class="focus">
      <header class="focus-top">
        <a class="back" href="#/course">${ic("left", "sm")}<span class="d-only">Kembali ke course</span></a>
        <div class="ttl"><small>Internet Dedicated · Modul 3 dari 5</small><b>Use Case & Differentiator</b></div>
        <div class="prog"><span class="seg">${segs(S.m3done ? 3 : 2, 5)}</span>${S.m3done ? 60 : 40}%</div>
      </header>
      <div class="player-grid">
        <div class="stack">
          <div class="video ${P_.hd ? "" : "sd"}" id="video">
            <div class="scene">
              <div class="glow" id="v-glow"></div>
              <span class="chapter-tag" id="v-tag"></span>
              <h2 id="v-head"></h2>
              <div class="tiles" id="v-tiles">${"<i></i>".repeat(6)}</div>
            </div>
            <div class="subtitle" id="v-sub"></div>
            <div class="vcontrols">
              <div class="timeline" id="v-tl" role="slider" aria-label="Posisi video" tabindex="0" aria-valuemin="0" aria-valuemax="${V.duration}">${segsHtml}<span class="knob" id="v-knob"></span></div>
              <div class="vbar">
                <button class="vbtn round" data-act="play" id="v-play" aria-label="Putar">${ic("play", "sm")}</button>
                <span class="time" id="v-time"></span>
                <span class="sp"></span>
                <button class="vbtn" data-act="speed" id="v-speed" aria-label="Kecepatan">1.0x</button>
                <button class="vbtn ${P_.cc ? "on" : ""}" data-act="cc" id="v-cc" aria-label="Subtitle">CC</button>
                <button class="vbtn hide-m ${P_.hd ? "on" : ""}" data-act="hd" id="v-hd" aria-label="Kualitas video">${P_.hd ? "HD" : "SD"}</button>
                <button class="vbtn" data-act="fs" id="v-fs" aria-label="Layar penuh">${ic("expand", "sm")}</button>
              </div>
            </div>
          </div>
          <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap">
            <div class="tabs" role="tablist"><button class="on" data-act="ptab" data-v="take">Key takeaway</button><button data-act="ptab" data-v="trans">Transkrip</button><button data-act="ptab" data-v="mat">Materi</button></div>
          </div>
          <div id="ptab-body">${takeawaysHtml()}</div>
        </div>
        <div class="stack">
          <div class="card chapters">
            <div class="card-head" style="margin-bottom:8px"><h3>Bab dalam video</h3><span class="link muted">5 bab</span></div>
            <div id="v-chaps">${chapList}</div>
          </div>
          <div class="card next-card">
            <small>Berikutnya</small>
            <h3>Quick check: 4 soal</h3>
            <p>±2 menit. Simulasi percakapan customer tentang use case dan pembeda.</p>
            <button class="btn btn-white btn-block" data-act="quiz">Lanjut ke Quick Check</button>
            <button class="linkbtn" data-act="save-exit">Simpan & keluar</button>
          </div>
          <div class="card"><button class="ask-card" data-act="chat" data-ctx="player"><span class="ico-wrap">${ic("sparkle")}</span><span><b style="font-size:var(--fs-md)">Masih bingung?</b><div class="xs muted">Tanya AI tentang bab ini</div></span><span class="go">${ic("right", "sm")}</span></button></div>
        </div>
      </div>
      <div class="sticky-cta"><button class="btn btn-ghost" data-act="save-exit">Simpan</button><button class="btn btn-primary" data-act="quiz">Lanjut ke Quick Check</button></div>
    </div>`;
  }
  const takeawaysHtml = () => `<div class="takeaways">${D.video.takeaways.map((t, i) => `<div class="card"><span class="num">${i + 1}</span><h4>${t[0]}</h4><p>${t[1]}</p></div>`).join("")}</div>`;
  const transcriptHtml = () => `<div class="card transcript" id="v-trans">${D.video.subs.map((s) => `<p data-t="${s[0]}"><button data-act="seek" data-t="${s[0]}"><time>${fmt(s[0])}</time>${s[1]}</button></p>`).join("")}</div>`;

  function mountPlayer() {
    const tl = $("#v-tl");
    const seekFromEvent = (e) => {
      const rect = tl.getBoundingClientRect();
      const x = Math.min(Math.max(0, (e.clientX - rect.left) / rect.width), 1);
      S.t = x * D.video.duration; updatePlayer(); save();
    };
    let dragging = false;
    tl.addEventListener("pointerdown", (e) => { dragging = true; tl.setPointerCapture(e.pointerId); seekFromEvent(e); });
    tl.addEventListener("pointermove", (e) => dragging && seekFromEvent(e));
    tl.addEventListener("pointerup", () => (dragging = false));
    $("#video .scene").addEventListener("dblclick", toggleFs);
    tl.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") { S.t = Math.min(D.video.duration, S.t + 5); updatePlayer(); }
      if (e.key === "ArrowLeft") { S.t = Math.max(0, S.t - 5); updatePlayer(); }
    });
    updatePlayer();
  }
  function curChapter(t) {
    const C = D.video.chapters;
    let i = 0; C.forEach((c, k) => { if (t >= c.t) i = k; });
    return i;
  }
  function updatePlayer() {
    const V = D.video; const t = S.t;
    if (!$("#video")) return;
    const ci = curChapter(t); const ch = V.chapters[ci];
    $("#v-tag").textContent = ch.title;
    const head = $("#v-head");
    if (head.textContent !== ch.head) { head.style.opacity = 0; setTimeout(() => { head.textContent = ch.head; head.style.opacity = 1; }, 160); }
    const tiles = $$("#v-tiles i");
    const hi = ch.tiles[Math.floor(t / 3) % ch.tiles.length];
    tiles.forEach((el, k) => { el.classList.toggle("on", ch.tiles.includes(k) && k !== hi); el.classList.toggle("hi", k === hi); });
    $("#v-glow").style.transform = `translate(${-ci * 12}%, ${ci * 6}%)`;
    let sub = ""; V.subs.forEach((s) => { if (t >= s[0]) sub = s[1]; });
    const subEl = $("#v-sub"); subEl.textContent = sub; subEl.style.display = P_.cc && sub ? "" : "none";
    $("#v-time").textContent = `${fmt(t)} / ${fmt(V.duration)}`;
    $("#v-knob").style.left = (t / V.duration) * 100 + "%";
    $("#v-tl").setAttribute("aria-valuenow", Math.floor(t));
    $$("#v-tl .chap span").forEach((el, k) => {
      const s = V.chapters[k].t; const e = V.chapters[k + 1] ? V.chapters[k + 1].t : V.duration;
      el.style.width = Math.min(100, Math.max(0, ((t - s) / (e - s)) * 100)) + "%";
    });
    $$("#v-chaps .chap-item").forEach((el, k) => {
      const done = k < ci || (S.m3done && k !== ci);
      el.classList.toggle("now", k === ci);
      const ck = $(".ck", el); ck.className = "ck " + (done ? "done" : k === ci ? "now" : "");
      ck.innerHTML = done ? ic("check", "sm") : k === ci ? ic(P_.playing ? "pause" : "play", "sm") : "";
    });
    $$("#v-trans p").forEach((p) => {
      const s = +p.dataset.t; const nx = p.nextElementSibling ? +p.nextElementSibling.dataset.t : V.duration;
      p.classList.toggle("now", t >= s && t < nx);
    });
    $("#v-play").innerHTML = ic(P_.playing ? "pause" : "play", "sm");
    $("#v-play").setAttribute("aria-label", P_.playing ? "Jeda" : "Putar");
  }
  function tick() {
    if (!P_.playing) return;
    const now = performance.now();
    const dt = P_.last ? (now - P_.last) / 1000 : 0; P_.last = now;
    S.t = Math.min(D.video.duration, S.t + dt * P_.speed);
    updatePlayer();
    if (S.t >= D.video.duration) {
      P_.playing = false; clearInterval(raf); save(); updatePlayer();
      toast("Video selesai. Saatnya quick check.");
      setTimeout(() => route().name === "player" && openQuiz(), 700);
    }
  }
  const fsEl = () => document.fullscreenElement || document.webkitFullscreenElement;
  function isFs() { const v = $("#video"); return !!v && (fsEl() === v || v.classList.contains("is-fs")); }
  function setFsUi() {
    const v = $("#video"); if (!v) return;
    const on = isFs();
    v.classList.toggle("fs-on", on);
    document.body.style.overflow = v.classList.contains("is-fs") ? "hidden" : "";
    const b = $("#v-fs"); if (b) { b.innerHTML = ic(on ? "shrink" : "expand", "sm"); b.setAttribute("aria-label", on ? "Keluar dari layar penuh" : "Layar penuh"); }
  }
  function toggleFs() {
    const v = $("#video"); if (!v) return;
    if (isFs()) {
      if (v.classList.contains("is-fs")) v.classList.remove("is-fs");
      else (document.exitFullscreen || document.webkitExitFullscreen).call(document);
      return setFsUi();
    }
    const fallback = () => { v.classList.add("is-fs"); setFsUi(); };
    const req = v.requestFullscreen || v.webkitRequestFullscreen;
    if (!req) return fallback();
    try {
      const p = req.call(v);
      if (p && p.then) p.then(() => { try { screen.orientation.lock("landscape").catch(() => {}); } catch (e) { /* not supported */ } }).catch(fallback);
    } catch (e) { fallback(); }
  }
  document.addEventListener("fullscreenchange", setFsUi);
  document.addEventListener("webkitfullscreenchange", setFsUi);

  function togglePlay(force) {
    P_.playing = force != null ? force : !P_.playing;
    if (P_.playing && S.t >= D.video.duration - 0.5) S.t = 0;
    P_.last = performance.now();
    clearInterval(raf);
    if (P_.playing) raf = setInterval(tick, 100); else save();
    updatePlayer();
  }

  /* Quick check */
  let Q = null;
  function openQuiz() {
    togglePlay(false);
    Q = { i: 0, ans: [] };
    renderQuiz();
  }
  function renderQuiz() {
    const q = D.quiz[Q.i]; const sel = Q.ans[Q.i];
    modal(`
      <div class="modal-head"><div><div class="xs muted" style="font-weight:var(--fw-medium)">Quick check · Soal ${Q.i + 1} dari ${D.quiz.length}</div></div><button class="x" data-act="close" aria-label="Tutup">${ic("x")}</button></div>
      <div class="seg" style="height:5px;margin-bottom:6px">${segs(Q.i + 1, D.quiz.length)}</div>
      <p class="qc-q">${q.q}</p>
      ${q.opts.map((o, k) => `<button class="qc-opt ${sel === k ? "sel" : ""}" data-act="qopt" data-k="${k}" ${k === 0 ? "autofocus" : ""}><span class="l">${"ABCD"[k]}</span><span>${o}</span></button>`).join("")}
      <div class="qc-foot"><span class="xs muted">Lulus minimal 3 dari 4</span>
        ${Q.i ? `<button class="btn btn-ghost btn-sm" data-act="qprev" style="margin-left:auto">Sebelumnya</button>` : ""}
        <button class="btn btn-primary" data-act="qnext" ${sel == null ? "disabled" : ""} style="${Q.i ? "margin-left:0" : ""}">${Q.i === D.quiz.length - 1 ? "Lihat hasil" : "Berikutnya"}</button></div>`);
  }
  function quizResult() {
    const wrong = D.quiz.map((q, i) => ({ q, i })).filter(({ q, i }) => Q.ans[i] !== q.a);
    const score = D.quiz.length - wrong.length;
    const pass = score >= 3;
    const ring = (score / D.quiz.length) * 289;
    if (pass && !S.m3done) { S.m3done = true; S.m3score = [score, 4]; S.points += 120; S.t = D.video.duration; save(); }
    const review = wrong.map(({ q }) => `<div class="review-item">${ic("info")}<span><b>${q.topic}</b><br><span class="xs">Jawaban kurang tepat. Bagian ini dijelaskan di ${fmt(q.t)}.</span></span><button class="btn btn-ghost btn-sm" data-act="jump" data-t="${q.t}">${ic("play", "sm")}Tonton ${fmt(q.t)}</button></div>`).join("");
    modal(`
      <div class="modal-head"><button class="x" data-act="close" aria-label="Tutup">${ic("x")}</button></div>
      <div class="result-hero">
        <div class="result-ring"><svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="46" fill="none" stroke="#EAF3FD" stroke-width="8"/><circle cx="50" cy="50" r="46" fill="none" stroke="${pass ? "#0B6FD0" : "#F5A524"}" stroke-width="8" stroke-linecap="round" stroke-dasharray="${ring} 289"/></svg><b>${score}/4</b></div>
        <h2>${pass ? "Modul 3 selesai" : "Hampir lulus"}</h2>
        <p class="muted" style="margin-top:6px">${pass ? "Kamu sudah bisa menjelaskan use case dan pembeda Internet Dedicated." : "Butuh 3 dari 4 untuk lulus. Tonton ulang bagian yang terlewat, lalu coba lagi."}</p>
        ${pass ? `<div class="reward"><div><b>+120</b><span>poin</span></div><div><b>3 / 5</b><span>modul selesai</span></div><div><b>72%</b><span>menuju Connectivity Associate</span></div></div>` : ""}
      </div>
      ${review ? `<div style="margin-top:14px">${review}</div>` : ""}
      <div class="qc-foot" style="justify-content:flex-end">
        ${pass ? `<button class="btn btn-ghost" data-act="to-dash" style="margin-left:0">Ke dashboard</button><button class="btn btn-primary" data-act="to-course" style="margin-left:0">Lanjut ke Modul 4</button>`
               : `<button class="btn btn-ghost" data-act="close" style="margin-left:0">Nanti saja</button><button class="btn btn-primary" data-act="quiz" style="margin-left:0">Ulangi quick check</button>`}
      </div>`);
    if (pass) {
      updatePlayer();
      const pr = $(".focus-top .prog"); if (pr) pr.innerHTML = `<span class="seg">${segs(3, 5)}</span>60%`;
    }
  }

  function pageTeam(r) {
    const t = D.team;
    const attn = t.filter((m) => m.attn);
    const list = S.teamFilter === "attn" ? attn : S.teamFilter === "ok" ? t.filter((m) => !m.attn) : t;
    const rows = list.map((m) => {
      const r = S.reminded[m.name];
      const act = m.attn
        ? `<button class="btn btn-sm ${r ? "btn-ghost" : "btn-primary"}" data-act="remind" data-name="${m.name}" ${r ? "disabled" : ""}>${r ? ic("check", "sm") + "Terkirim" : "Ingatkan"}</button><button class="btn btn-ghost btn-sm" data-act="assign-add" data-name="${m.name}">Assign</button>`
        : `<button class="btn btn-ghost btn-sm" data-act="appreciate" data-name="${m.name}" ${r ? "disabled" : ""}>${r ? "Terkirim" : "Kirim apresiasi"}</button>`;
      return `<tr><td><div class="member"><span class="avatar sm ${m.c}">${m.initials}</span><span><b>${m.name}</b><small class="${m.attn ? "red" : "ok"}">${m.note}</small></span></div></td>
        <td><div class="pcell"><span class="seg ${m.prog < 50 ? "amber" : ""}">${segPct(m.prog, 10)}</span><span class="xs" style="font-weight:var(--fw-medium)">${m.prog}%</span></div></td>
        <td class="hide-m">${m.cert}</td><td class="hide-m"><b>${m.score}</b></td><td><div class="actions-cell">${act}</div></td></tr>`;
    }).join("");
    const body = `
      <section class="kpis">
        <div class="kpi hero-kpi"><span class="kpi-label">Completion tim</span><span class="kpi-value">72%</span><span class="kpi-foot">Target 80% · naik 6% dari bulan lalu</span></div>
        <div class="kpi"><span class="kpi-label">Tersertifikasi</span><span class="kpi-value">9 / 15</span><span class="kpi-foot up">+2 anggota bulan ini</span></div>
        <div class="kpi warn"><span class="kpi-label">Task terlambat</span><span class="kpi-value">4</span><span class="kpi-foot" style="color:var(--red);font-weight:var(--fw-medium)">Dari 2 anggota</span></div>
        <div class="kpi"><span class="kpi-label">Skor quiz rata-rata</span><span class="kpi-value">81</span><span class="kpi-foot up">Naik 5 poin</span></div>
      </section>
      <section class="grid-team">
        <div class="stack">
          <div class="card">
            <div class="card-head" style="flex-wrap:wrap"><h2>Completion tim per minggu</h2><span class="legend"><span><i></i>Completion</span><span><i class="dash"></i>Target 80%</span></span></div>
            <div class="chart-wrap" id="chart">${chartSvg()}<div class="chart-tip" id="tip" hidden></div></div>
          </div>
          <div class="card">
            <div class="card-head" style="flex-wrap:wrap;gap:10px"><h2>Anggota tim</h2>
              <div class="tabs" style="margin-left:auto"><button class="${S.teamFilter === "all" ? "on" : ""}" data-act="tfilter" data-v="all">Semua (${t.length})</button><button class="${S.teamFilter === "attn" ? "on" : ""}" data-act="tfilter" data-v="attn">Perlu perhatian (${attn.length})</button><button class="${S.teamFilter === "ok" ? "on" : ""}" data-act="tfilter" data-v="ok">On track (${t.length - attn.length})</button></div></div>
            <table class="table"><thead><tr><th>Anggota</th><th>Learning path</th><th class="hide-m">Sertifikasi</th><th class="hide-m">Skor</th><th style="text-align:right">Aksi</th></tr></thead><tbody>${rows}</tbody></table>
          </div>
        </div>
        <div class="stack">
          <div class="card assign-card" id="assign">
            <div class="card-head"><h3>Assign task ke anggota</h3></div>
            <div class="picker" id="picker">
              <label class="sr-only" for="pk-input">Cari anggota tim</label>
              <div class="assign-chips" id="pk-box">${chipsHtml()}<input id="pk-input" class="pk-input" placeholder="${S.assignSel.length ? "Tambah anggota…" : "Cari nama anggota…"}" autocomplete="off" role="combobox" aria-expanded="false" aria-controls="pk-list" aria-autocomplete="list"></div>
              <div class="pk-list" id="pk-list" role="listbox" aria-label="Anggota tim" hidden></div>
            </div>
            <div class="field" style="margin-top:14px"><label for="as-task">Task / materi</label><select class="select" id="as-task" style="height:44px"><option>Role-play: Objection handling harga</option><option>Video: Objection Handling Harga vs Value</option><option>Course: Internet Dedicated Modul 4</option><option>Quick check: Discovery Questions</option></select></div>
            <div class="assign-row">
              <div class="field"><label for="as-date">Deadline</label><input class="input" id="as-date" type="date" value="2026-10-23" style="height:44px"></div>
              <div class="field"><label for="as-rem">Pengingat</label><select class="select" id="as-rem" style="height:44px"><option>H-1 & hari H</option><option>Hari H saja</option><option>Tanpa pengingat</option></select></div>
            </div>
            <button class="btn btn-primary btn-block" style="margin-top:14px" data-act="assign" id="pk-submit" ${S.assignSel.length ? "" : "disabled"}>${assignLabel()}</button>
            <div style="margin-top:18px"><div class="xs muted" style="font-weight:var(--fw-medium);margin-bottom:6px">Perlu perhatian</div>
              ${attn.map((m) => `<button class="member" data-act="assign-add" data-name="${m.name}" style="width:100%;padding:7px 0;text-align:left"><span class="avatar sm ${m.c}">${m.initials}</span><span style="flex:1"><b style="font-size:var(--fs-sm)">${m.name}</b><small class="muted">Account Executive</small></span><span class="seg amber" style="width:60px;height:6px">${segPct(m.prog, 8)}</span><span class="xs" style="width:34px;text-align:right;font-weight:var(--fw-medium)">${m.prog}%</span></button>`).join("")}
            </div>
          </div>
          <div class="card insight">
            <small>Insight minggu ini</small>
            <p style="margin:6px 0 10px;font-size:var(--fs-md)">Topik paling sering salah di tim: <b>Objection handling harga</b> (58% benar). Pertimbangkan sesi coaching singkat.</p>
            <button class="btn btn-sm btn-primary" data-act="assign-video">Assign video Objection Handling</button>
          </div>
        </div>
      </section>`;
    return shell(r, body, { title: "Team Progress", sub: "Tim Jabodetabek · 15 anggota · data per 16 Oktober 2026" });
  }
  /* Assign task: searchable member picker (combobox). Typing only redraws the picker, never the page. */
  const member = (n) => D.team.find((m) => m.name === n);
  const assignLabel = () => (S.assignSel.length ? `Assign ke ${S.assignSel.length} anggota` : "Pilih anggota dulu");
  const chipsHtml = () => S.assignSel.map((n) => { const m = member(n); return `<span class="pchip"><span class="avatar sm ${m.c}" style="width:22px;height:22px;font-size:var(--fs-xs)">${m.initials}</span>${n.split(" ")[0]}<button type="button" data-act="assign-rm" data-name="${n}" aria-label="Hapus ${n}">${ic("x", "sm")}</button></span>`; }).join("");
  function refreshAssign() {
    const box = $("#pk-box"); if (!box) return render();
    $$(".pchip", box).forEach((c) => c.remove());
    $("#pk-input").insertAdjacentHTML("beforebegin", chipsHtml());
    $("#pk-input").placeholder = S.assignSel.length ? "Tambah anggota…" : "Cari nama anggota…";
    const b = $("#pk-submit"); b.textContent = assignLabel(); b.disabled = !S.assignSel.length;
    if (!$("#pk-list").hidden) drawPicker();
  }
  let pkActive = 0, pkItems = [];
  function drawPicker() {
    const inp = $("#pk-input"), list = $("#pk-list"); if (!inp) return;
    const q = inp.value.trim().toLowerCase();
    const attn = D.team.filter((m) => m.attn);
    pkItems = D.team.filter((m) => m.name.toLowerCase().includes(q));
    pkActive = Math.min(pkActive, Math.max(pkItems.length - 1, 0));
    const allAttn = attn.every((m) => S.assignSel.includes(m.name));
    const quick = !q ? `<button type="button" class="pk-quick" data-pk="attn" ${allAttn ? "disabled" : ""}>${ic("users", "sm")}${allAttn ? "Semua yang perlu perhatian sudah dipilih" : `Pilih ${attn.length} yang perlu perhatian`}</button><div class="pk-sep"></div>` : "";
    list.innerHTML = quick + (pkItems.length ? pkItems.map((m, i) => {
      const sel = S.assignSel.includes(m.name);
      return `<div class="pk-opt ${i === pkActive ? "active" : ""}" id="pk-opt-${i}" role="option" aria-selected="${sel}" data-pk-name="${m.name}">
        <span class="avatar sm ${m.c}">${m.initials}</span>
        <span class="pk-txt"><b>${m.name}</b><small>${m.attn ? `<span class="pk-attn">Perlu perhatian</span>, ${m.prog}%` : `Progress ${m.prog}%`}</small></span>
        <span class="pk-check">${sel ? ic("check", "sm") : ""}</span></div>`;
    }).join("") : `<div class="pk-empty">Tidak ada anggota bernama “${esc(inp.value.trim())}”. <button type="button" data-pk="clear">Hapus pencarian</button></div>`);
    inp.setAttribute("aria-activedescendant", pkItems.length ? `pk-opt-${pkActive}` : "");
    const act = $(`#pk-opt-${pkActive}`); act && act.scrollIntoView({ block: "nearest" });
  }
  function openPicker() { const list = $("#pk-list"); if (!list.hidden) return; list.hidden = false; $("#pk-input").setAttribute("aria-expanded", "true"); pkActive = 0; drawPicker(); }
  function closePicker() { const list = $("#pk-list"); if (!list) return; list.hidden = true; $("#pk-input").setAttribute("aria-expanded", "false"); }
  function togglePick(name) {
    S.assignSel = S.assignSel.includes(name) ? S.assignSel.filter((n) => n !== name) : [...S.assignSel, name];
    save(); $("#pk-input").value = ""; refreshAssign(); drawPicker();
  }
  function mountPicker() {
    const inp = $("#pk-input"), list = $("#pk-list"), box = $("#pk-box"); if (!inp) return;
    box.addEventListener("mousedown", (e) => { if (!e.target.closest("button") && e.target !== inp) { e.preventDefault(); inp.focus(); openPicker(); } });
    inp.addEventListener("focus", openPicker);
    inp.addEventListener("input", () => { pkActive = 0; openPicker(); drawPicker(); });
    inp.addEventListener("keydown", (e) => {
      if (e.key === "ArrowDown" || e.key === "ArrowUp") { e.preventDefault(); openPicker(); if (pkItems.length) { pkActive = (pkActive + (e.key === "ArrowDown" ? 1 : -1) + pkItems.length) % pkItems.length; drawPicker(); } }
      else if (e.key === "Enter") { e.preventDefault(); if (!list.hidden && pkItems[pkActive]) togglePick(pkItems[pkActive].name); }
      else if (e.key === "Escape") { if (!list.hidden) { e.stopPropagation(); closePicker(); } }
      else if (e.key === "Backspace" && !inp.value && S.assignSel.length) { S.assignSel = S.assignSel.slice(0, -1); save(); refreshAssign(); }
    });
    list.addEventListener("mousedown", (e) => e.preventDefault()); // keep focus in the input
    list.addEventListener("click", (e) => {
      const o = e.target.closest("[data-pk-name]"); if (o) return togglePick(o.dataset.pkName);
      const b = e.target.closest("[data-pk]"); if (!b) return;
      if (b.dataset.pk === "attn") { D.team.filter((m) => m.attn).forEach((m) => { if (!S.assignSel.includes(m.name)) S.assignSel.push(m.name); }); save(); refreshAssign(); drawPicker(); }
      if (b.dataset.pk === "clear") { inp.value = ""; pkActive = 0; drawPicker(); inp.focus(); }
    });
    inp.addEventListener("blur", () => setTimeout(() => { if (!$("#picker") || !$("#picker").contains(document.activeElement)) closePicker(); }, 0));
  }

  function chartSvg(W = 600) {
    const H = 240, pad = { l: 34, r: 8, t: 14, b: 26 };
    const vals = D.weekly; const n = vals.length;
    const cw = (W - pad.l - pad.r) / n; const bw = Math.min(26, cw * 0.5);
    const y = (v) => pad.t + (1 - v / 100) * (H - pad.t - pad.b);
    let g = "";
    [0, 50, 100].forEach((v) => { g += `<text x="0" y="${y(v) + 4}" font-size="12" fill="#64748B">${v}%</text><line x1="${pad.l}" x2="${W - pad.r}" y1="${y(v)}" y2="${y(v)}" stroke="#EEF3F9"/>`; });
    vals.forEach((v, i) => {
      const x = pad.l + i * cw + (cw - bw) / 2; const last = i === n - 1;
      g += `<g class="bar-g" data-i="${i}" tabindex="0" role="img" aria-label="Minggu ${i + 1}: ${v}%"><rect x="${pad.l + i * cw}" y="${pad.t}" width="${cw}" height="${H - pad.t - pad.b}" fill="transparent"/>
        <rect x="${x}" y="${y(v)}" width="${bw}" height="${y(0) - y(v)}" rx="${bw / 2}" fill="${last ? "#0B6FD0" : "#C9DDF5"}"/>
        <text x="${x + bw / 2}" y="${H - 6}" font-size="12" fill="#64748B" text-anchor="middle">M${i + 1}</text></g>`;
    });
    g += `<line x1="${pad.l}" x2="${W - pad.r}" y1="${y(80)}" y2="${y(80)}" stroke="#F5A524" stroke-width="2" stroke-dasharray="6 5"/>`;
    return `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" id="chart-svg">${g}</svg>`;
  }
  let chartRO = null, chartW = 0;
  function mountTeam() {
    mountPicker();
    const wrap = $("#chart"); if (!wrap) return;
    // Redraw the chart whenever its card changes width (window resize, sidebar, devtools, emulators)
    if (chartRO) chartRO.disconnect();
    chartW = Math.round(wrap.clientWidth);
    mountChart();
    chartRO = new ResizeObserver(refitChart);
    chartRO.observe(wrap);
  }
  function refitChart() {
    const wrap = $("#chart"); if (!wrap) return;
    const cw = Math.round(wrap.clientWidth);
    if (cw >= 160 && Math.abs(cw - chartW) > 2) { chartW = cw; mountChart(); }
  }
  function mountChart() {
    const wrap = $("#chart"); if (!wrap) return;
    if (wrap.clientWidth >= 160) $("#chart-svg").outerHTML = chartSvg(Math.round(wrap.clientWidth)); // 1:1 scale, no stretched text; skip while not laid out
    const svg = $("#chart-svg"); const tip = $("#tip");
    const show = (g) => {
      const i = +g.dataset.i; const v = D.weekly[i];
      const bar = g.querySelectorAll("rect")[1].getBoundingClientRect(); const wrap = $("#chart").getBoundingClientRect();
      tip.hidden = false;
      tip.innerHTML = `<div><span>Completion</span><b>${v}%</b></div><div><span>Modul selesai</span><b>${20 + i * 3}</b></div><div><span>Skor rata-rata</span><b>${72 + Math.round(i * 1)}</b></div>`;
      const tw = tip.offsetWidth, cx = bar.left - wrap.left + bar.width / 2; // keep the tooltip inside the chart
      tip.style.left = Math.min(Math.max(cx, tw / 2), wrap.width - tw / 2) + "px"; tip.style.top = bar.top - wrap.top - 8 + "px";
    };
    $$(".bar-g", svg).forEach((g) => { g.addEventListener("mouseenter", () => show(g)); g.addEventListener("focus", () => show(g)); });
    svg.addEventListener("mouseleave", () => (tip.hidden = true));
    show($$(".bar-g", svg).pop());
  }

  function pageProduct(r) {
    const p = D.product;
    const chips = p.sections.map((s) => `<button class="chip ${S.openSec === s.key ? "on" : ""}" data-act="sec" data-k="${s.key}">${s.label}</button>`).join("");
    const acc = p.sections.map((s, i) => {
      let inner = s.body || "";
      if (s.quotes) inner = s.quotes.map((q) => `<div class="quote"><q>${q[0].replace(/[“”]/g, "")}</q><small>${q[1]}</small></div>`).join("");
      if (s.pair) inner = `<div class="pair"><div class="do"><b class="small" style="color:var(--green)">Do</b><ul>${s.pair.map((x) => `<li>${x[0]}</li>`).join("")}</ul></div><div class="dont"><b class="small" style="color:var(--red)">Don't</b><ul>${s.pair.map((x) => `<li>${x[1]}</li>`).join("")}</ul></div></div>`;
      const full = { discovery: "Discovery Questions", objection: "Objection Handling", icp: "Ideal Customer Profile & Trigger" }[s.key] || s.label;
      return `<div class="acc ${S.openSec === s.key ? "open" : ""}" id="sec-${s.key}"><button data-act="acc" data-k="${s.key}" aria-expanded="${S.openSec === s.key}"><span class="n">${String(i + 1).padStart(2, "0")}</span>${full}${s.key === "discovery" ? `<span class="tag" style="margin-left:8px">${ic("play", "sm")}1:45</span>` : ""}${ic("down")}</button><div class="acc-body">${inner}</div></div>`;
    }).join("");
    const body = `
      <div class="crumbs"><a href="#/products">Product Mapping</a>${ic("right", "sm")}<a href="#/products">Connectivity</a>${ic("right", "sm")}<b>${p.name}</b></div>
      <div class="hero prod-hero">
        <span class="tag glass">${p.cat}</span>
        <h1>${p.name}</h1>
        <p>${p.desc}</p>
        <p class="xs" style="margin-top:12px;display:flex;gap:6px;align-items:center">${ic("check", "sm")}${p.validated}</p>
      </div>
      <div class="sec-chips chips">${chips}</div>
      <section class="grid-prod">
        <div>${acc}</div>
        <div class="stack">
          <div class="card">
            <div class="card-head"><h3>Siapkan meeting</h3></div>
            <button class="btn btn-primary btn-block" data-act="download" data-name="Battlecard Internet Dedicated">${ic("download", "sm")}Unduh Battlecard</button>
            <button class="btn btn-dark btn-block" style="margin-top:8px" data-act="chat">${ic("sparkle", "sm")}Tanya AI tentang produk ini</button>
            <button class="ask-card" style="margin-top:16px" data-act="resume"><span class="ico-wrap" style="background:var(--hero);color:#fff">${ic("play")}</span><span><b style="font-size:var(--fs-md)">Ringkasan video</b><div class="xs muted">Use Case & Differentiator · 2:50</div></span><span class="go">${ic("right", "sm")}</span></button>
          </div>
          <div class="card">
            <div class="card-head"><h3>Sering dijual bersama</h3></div>
            ${["SD-WAN", "Cloudeka", "SQURA Managed Security"].map((x) => `<div class="file-row"><span class="sq" style="width:38px;height:38px">${ic(x === "Cloudeka" ? "cloud" : x.startsWith("SQURA") ? "shield" : "link", "sm")}</span><div><h4>${x}</h4></div><button class="dl" data-act="other-product" aria-label="Buka ${x}">${ic("right", "sm")}</button></div>`).join("")}
          </div>
        </div>
      </section>
      <div class="prod-sticky"><button class="btn btn-primary" data-act="download" data-name="Battlecard Internet Dedicated">${ic("download", "sm")}Unduh Battlecard</button><button class="btn btn-dark" data-act="chat">${ic("sparkle", "sm")}Tanya AI</button></div>`;
    return shell(r, body, { title: "Product Mapping", sub: "Connectivity · " + p.name, sticky: true });
  }

  function pageProducts(r) {
    const groups = [
      ["Connectivity", [["Internet Dedicated", "Bandwidth khusus dengan SLA terukur", true], ["SD-WAN", "Kelola jaringan multi-cabang terpusat"], ["Metro Ethernet", "Koneksi antar-lokasi dalam kota"]]],
      ["Data Center & Cloud", [["Data Center Tier III", "Colocation dengan uptime tinggi"], ["Cloudeka", "Cloud lokal untuk bisnis yang bertumbuh"], ["Deka GPU", "Komputasi AI dengan data di Indonesia"]]],
      ["Security & Collaboration", [["SQURA Managed Security", "SOC dan proteksi 24/7"], ["Microsoft Teams Rooms", "Ruang meeting hybrid"]]]
    ];
    const body = groups.map(([g, items]) => `<div class="card"><div class="card-head"><h2>${g}</h2></div><div class="grid-3">${items.map(([n, d, live]) =>
      `<button class="card" style="text-align:left;padding:16px" data-act="${live ? "" : "other-product"}" ${live ? 'data-go="#/product/internet-dedicated"' : ""}><b>${n}</b><p class="small muted" style="margin-top:4px">${d}</p><span class="tag ${live ? "green" : ""}" style="margin-top:10px">${live ? "12 bagian · divalidasi" : "Segera hadir di demo"}</span></button>`).join("")}</div></div>`).join("");
    return shell(r, body, { title: "Product Mapping", sub: "Peta produk Lintasarta untuk persiapan meeting" });
  }

  const matRow = (m) => `<div class="mat-row"><span class="file-type ${m.type.toLowerCase()}">${m.type}</span><div><h4>${m.name}</h4><div class="xs muted">${m.meta}</div></div><span class="tag d-only">${m.cat}</span><button class="dl" data-act="download" data-name="${esc(m.name)}" aria-label="Unduh ${esc(m.name)}">${ic("download", "sm")}</button></div>`;
  function pageToolkit(r) {
    const cats = ["Semua", ...D.toolkitCats];
    if (!cats.includes(S.toolCat)) S.toolCat = "Semua";
    const mats = D.toolkit.filter((m) => S.toolCat === "Semua" || m.cat === S.toolCat);
    const body = `
      <div class="chips">${cats.map((c) => `<button class="chip ${S.toolCat === c ? "on" : ""}" data-act="toolcat" data-v="${c}">${c}</button>`).join("")}</div>
      <div class="card">
        <div class="card-head"><h2>Materi siap pakai</h2><span class="link muted">${mats.length} file</span></div>
        ${mats.map(matRow).join("")}
      </div>`;
    return shell(r, body, { title: "Sales Toolkit", sub: "Poster, kebijakan, company profile, dan aset brand siap pakai" });
  }
  function pageCourses(r) {
    const body = `<div class="vgrid" style="grid-template-columns:repeat(auto-fill,minmax(280px,1fr))">${D.courses.map((c) => {
      const p = c.id === "internet-dedicated" ? coursePct() : c.prog;
      return `<button class="card" style="text-align:left;padding:16px;display:flex;flex-direction:column;gap:10px" ${c.id === "internet-dedicated" ? 'data-go="#/course"' : 'data-act="other-course"'}>
        <span class="path-icon ${c.g}">${ic(c.icon)}</span><b style="font-size:var(--fs-md);line-height:1.35">${c.title}</b>
        <span style="display:flex;gap:8px;align-items:center"><span class="tag">${c.cat}</span><span class="xs muted">${c.mods}</span>${c.isNew ? '<span class="tag amber">Baru</span>' : ""}</span>
        <span class="seg" style="height:7px">${segPct(p)}</span><span class="xs muted">${p === 100 ? "Selesai" : p ? p + "% selesai" : "Belum mulai"}</span></button>`;
    }).join("")}</div>`;
    return shell(r, body, { title: "Courses", sub: "Learning path Oktober 2026 · 12 course" });
  }
  function pageTasks(r) {
    const body = `<div class="card">${D.tasks.map((t, i) => {
      const done = t.state === "done" || (i === 0 && S.m3done);
      return `<a class="list-row" href="${t.go}" style="color:inherit"><span class="sq" style="${done ? "background:var(--green-soft);color:var(--green)" : ""}">${ic(done ? "check" : "clipboard")}</span><div><h4 style="${done ? "text-decoration:line-through;color:var(--muted)" : ""}">${t.title}</h4><div class="xs muted">${t.src}</div></div>
      ${done ? '<span class="tag green">Selesai</span>' : t.state === "due" ? `<span class="tag red">${t.due}</span>` : `<span class="tag">${t.due}</span>`}</a>`;
    }).join("")}</div>`;
    return shell(r, body, { title: "Tasks", sub: "Tugas dari Sales Leader dan learning path" });
  }
  function pageInbox(r) {
    const body = `<div class="card">${D.inbox.map((m, i) => `<button class="list-row ${m.unread && !S.readInbox[i] ? "unread" : ""}" data-act="msg" data-i="${i}" style="width:100%;text-align:left"><span class="avatar ${m.c}">${m.initials}</span><div><h4>${m.title}</h4><div class="xs muted">${m.from} · ${m.body.slice(0, 70)}…</div></div><span class="xs muted">${m.time}</span></button>`).join("")}</div>`;
    return shell(r, body, { title: "Inbox", sub: `${unread()} pesan belum dibaca` });
  }
  function pageCert(r) {
    const body = `<div class="grid-3">${D.certs.map((c, i) => {
      const done = i === 0 && S.m3done ? 2 : c.done;
      return `<div class="card ${c.done === c.need ? "cert-card" : ""}"><span class="${c.done === c.need ? "badge-ico" : "sq"}" style="display:grid;place-items:center;width:44px;height:44px;border-radius:13px">${ic(c.done === c.need ? "trophy" : "award")}</span>
      <h3 style="font-size:var(--fs-lg);margin:14px 0 4px">${c.name}</h3><p class="small" style="${c.done === c.need ? "color:#A9BBD8" : ""}" class="muted">${c.state}</p>
      <div class="seg ${c.done === c.need ? "light" : ""}" style="margin:14px 0 8px;height:7px">${segs(done, c.need)}</div><p class="xs" style="${c.done === c.need ? "color:#A9BBD8" : "color:var(--muted)"}">${done} dari ${c.need} course syarat · Ujian: ${c.exam}</p>
      ${c.done === c.need ? `<button class="btn btn-white btn-sm" style="margin-top:14px" data-act="download" data-name="Sertifikat ${c.name}">${ic("download", "sm")}Unduh sertifikat</button>` : `<a class="btn btn-ghost btn-sm" style="margin-top:14px" href="#/course">Lanjutkan syarat</a>`}</div>`;
    }).join("")}</div>`;
    return shell(r, body, { title: "Certification", sub: "Ujian dan sertifikat digital" });
  }
  function pageNews(r) {
    const body = `<div class="grid-3">${D.news.map((n) => `<article class="card"><span class="tag">${n.tag}</span><h3 style="font-size:var(--fs-lg);margin:12px 0 6px;line-height:1.3">${n.title}</h3><p class="small muted">${n.body}</p><p class="xs muted" style="margin-top:12px">${n.date}</p></article>`).join("")}</div>`;
    return shell(r, body, { title: "News & Announcements", sub: "Kabar terbaru dari Product & Sales Enablement" });
  }
  function pageCalendar(r) {
    const body = `<div class="card">${D.agenda.map((a, i) => `<div class="agenda" style="grid-template-columns:48px 1fr auto">${agendaRow(a).replace('<div class="agenda">', "").replace(/<\/div>$/, "")}<button class="btn btn-sm ${S.registered[i] ? "btn-ghost" : "btn-primary"}" data-act="register" data-i="${i}">${S.registered[i] ? ic("check", "sm") + "Terdaftar" : "Daftar"}</button></div>`).join("")}</div>`;
    return shell(r, body, { title: "Enablement Calendar", sub: "Live class, webinar, dan ujian" });
  }
  function pageProcess(r) {
    const body = `<div class="card"><div class="card-head"><h2>Alur penjualan B2B Lintasarta</h2></div><div class="flow">${D.process.map((p, i) => `<div class="step"><span class="num" style="margin:0">${i + 1}</span><b>${p.t}</b><small>${p.d}</small></div>`).join("")}</div></div>
      <div class="card"><div class="card-head"><h2>Dokumen proses</h2></div>${[{ type: "PDF", name: "SOP Pricing Approval 2026", meta: "PDF · 640 KB" }, { type: "PDF", name: "Checklist Handover ke Delivery", meta: "PDF · 210 KB" }].map(fileRow).join("")}</div>`;
    return shell(r, body, { title: "Business Process", sub: "Tahapan dan SOP penjualan" });
  }
  function pageProfile(r) {
    const u = user();
    const body = `
      <div class="card" style="display:flex;gap:16px;align-items:center;flex-wrap:wrap"><span class="avatar" style="width:64px;height:64px;font-size:var(--fs-xl)">${u.initials}</span><div><h2 style="font-size:var(--fs-xl)">${u.name}</h2><p class="muted small">${u.role} · ${u.area}</p></div>
        <div style="margin-left:auto;display:flex;gap:8px;flex-wrap:wrap"><button class="btn btn-ghost btn-sm" data-act="retour">Ulangi tur</button><button class="btn btn-ghost btn-sm" data-act="logout">${ic("logout", "sm")}Keluar</button></div></div>
      <div class="kpis"><div class="kpi"><span class="kpi-label">Poin</span><span class="kpi-value">${num(S.points)}</span></div><div class="kpi"><span class="kpi-label">Streak</span><span class="kpi-value">6 hari</span></div><div class="kpi"><span class="kpi-label">Sertifikat</span><span class="kpi-value">1</span></div><div class="kpi"><span class="kpi-label">Course selesai</span><span class="kpi-value">8 / 12</span></div></div>
      <div class="card m-only menu-card"><div class="card-head"><h2>Semua menu</h2></div>${navHtml("")}</div>`;
    return shell(r, body, { title: "Profil" });
  }

  /* ---------- Auth & onboarding ---------- */
  function pageLogin() {
    const locked = S.failedLogin >= 5;
    return `
    <div class="auth">
      <div class="auth-art">
        <div class="brand"><div class="brand-mark">LA</div><div><div class="brand-name">LA Sales Academy</div><div class="brand-sub">Growth & Enablement</div></div></div>
        <div class="glow"></div>
        <h1>Belajar hari ini, jualan lebih yakin besok.</h1>
        <p>Course singkat, product mapping, dan sertifikasi untuk tim Sales Lintasarta, dalam satu tempat.</p>
        <div class="loop"><span>Discover</span><span class="key">Learn</span><span>Practice</span><span>Apply</span><span class="key">Prove</span><span>Recognize</span></div>
      </div>
      <form class="auth-form" data-form="login" novalidate>
        <div><h2>Masuk</h2><p class="muted" style="margin-top:4px">Gunakan akun kantor Lintasarta kamu.</p></div>
        <button type="button" class="btn btn-primary sso" data-act="sso" ${locked ? "disabled" : ""}>${ic("lock", "sm")}Masuk dengan akun Lintasarta (SSO)</button>
        <div class="or">atau dengan email</div>
        <div class="field"><label for="em">Email kantor</label><input class="input" id="em" type="email" value="raka.pratama@lintasarta.co.id" autocomplete="username"></div>
        <div class="field"><label for="pw">Password</label><input class="input ${S.failedLogin ? "err" : ""}" id="pw" type="password" autocomplete="current-password" ${locked ? "disabled" : ""}></div>
        <div id="login-msg">${loginMsg()}</div>
        <button type="submit" class="btn btn-ghost" ${locked ? "disabled" : ""}>Masuk</button>
        <div style="display:flex;justify-content:space-between;font-size:var(--fs-sm);flex-wrap:wrap;gap:8px"><a href="#" data-act="forgot">Lupa password?</a><a href="#" data-act="inactive">Akun belum aktif?</a></div>
      </form>
    </div>`;
  }
  function loginMsg() {
    if (S.failedLogin >= 5) return `<div class="alert">${ic("lock")}<span>Akun dikunci 15 menit karena 5 kali salah password. Coba lagi pukul 09.27, atau masuk dengan SSO setelahnya.</span></div>`;
    if (S.failedLogin) return `<div class="alert">${ic("info")}<span>Password salah. Sisa ${5 - S.failedLogin} percobaan sebelum akun dikunci 15 menit.</span></div>`;
    return "";
  }

  /* ---------- Search (⌘K) ---------- */
  function searchIndex() {
    return [
      ...D.courses.map((c) => ({ g: "Course", icon: "book", t: c.title, go: c.id === "internet-dedicated" ? "#/course" : "#/courses" })),
      ...D.library.map((v) => ({ g: "Video", icon: "play", t: v.title, meta: v.dur, go: v.cat === "Connectivity" && v.id !== "v5" ? "#/player" : "#/library" })),
      { g: "Produk", icon: "map", t: "Internet Dedicated", meta: "Product page", go: "#/product/internet-dedicated" },
      { g: "Produk", icon: "map", t: "Discovery Questions: Internet Dedicated", meta: "Bagian 09", go: "#/product/internet-dedicated", sec: "discovery" },
      { g: "Produk", icon: "map", t: "Objection Handling: Internet Dedicated", meta: "Bagian 10", go: "#/product/internet-dedicated", sec: "objection" },
      ...D.materials.map((m) => ({ g: "Materi", icon: "file", t: m.name, meta: m.type, go: "#/library", libTab: "mat" })),
      ...D.toolkit.map((m) => ({ g: "Sales Toolkit", icon: "briefcase", t: m.name, meta: m.type, go: "#/toolkit", toolCat: m.cat }))
    ];
  }
  function openSearch() {
    modal(`<div class="cmdk-input">${ic("search", "lg")}<input id="cmdk-q" placeholder="Cari materi, course, atau produk…" autocomplete="off" autofocus aria-label="Cari"><button class="x" data-act="close" aria-label="Tutup">${ic("x")}</button></div><div class="cmdk-list" id="cmdk-list"></div>`, "cmdk");
    const inp = $("#cmdk-q"); inp.focus();
    let sel = 0;
    const draw = () => {
      const q = inp.value.trim().toLowerCase();
      const all = searchIndex();
      const hits = q ? all.filter((x) => x.t.toLowerCase().includes(q) || x.g.toLowerCase().includes(q)) : [all[0], all.find((x) => x.sec === "discovery"), all.find((x) => x.sec === "objection"), all.find((x) => x.g === "Materi")];
      const items = [...hits.slice(0, 8)];
      if (q) items.push({ g: "Tanya AI", icon: "sparkle", t: `Tanya AI: “${inp.value.trim()}”`, ai: inp.value.trim() });
      sel = Math.min(sel, items.length - 1);
      let lastG = "";
      $("#cmdk-list").innerHTML = items.length ? items.map((x, i) => {
        const head = x.g !== lastG ? `<div class="cmdk-group">${q ? x.g : (lastG ? "" : "Sering dicari")}</div>` : ""; lastG = x.g;
        return (q ? head : (i === 0 ? '<div class="cmdk-group">Sering dicari</div>' : "")) + `<button class="cmdk-item ${i === sel ? "sel" : ""}" data-i="${i}"><span class="sq">${ic(x.icon, "sm")}</span>${esc(x.t)}<small>${x.meta || ""}</small></button>`;
      }).join("") : "";
      $$("#cmdk-list .cmdk-item").forEach((b) => b.addEventListener("click", () => pick(items[+b.dataset.i])));
      draw.items = items;
    };
    const pick = (x) => {
      closeModal();
      if (!x) return;
      if (x.ai) { openChat(); sendChat(x.ai); return; }
      if (x.sec) S.openSec = x.sec;
      if (x.libTab) S.libTab = x.libTab;
      if (x.toolCat) S.toolCat = x.toolCat;
      go(x.go);
    };
    inp.addEventListener("input", () => { sel = 0; draw(); });
    inp.addEventListener("keydown", (e) => {
      if (e.key === "ArrowDown") { sel = Math.min(sel + 1, draw.items.length - 1); draw(); e.preventDefault(); }
      if (e.key === "ArrowUp") { sel = Math.max(sel - 1, 0); draw(); e.preventDefault(); }
      if (e.key === "Enter") pick(draw.items[sel]);
    });
    draw();
  }

  /* ---------- AI chat ---------- */
  function chatRoot() { let el = $("#chat-root"); if (!el) { el = document.createElement("div"); el.id = "chat-root"; document.body.appendChild(el); } return el; }
  function openChat(ctx) {
    chat.open = true;
    if (!chat.msgs.length) chat.msgs.push({ who: "bot", html: ctx === "player"
      ? "Hai! Kamu sedang di bab <b>" + D.video.chapters[curChapter(S.t)].title + "</b>. Mau saya jelaskan ulang atau kasih contoh percakapan?"
      : `Hai ${user().first}! Saya bisa bantu cari materi, menjelaskan produk, atau menyiapkan jawaban untuk customer. Jawaban saya hanya dari materi yang sudah divalidasi.` });
    drawChat();
    setTimeout(() => $("#chat-in") && $("#chat-in").focus(), 50);
  }
  function drawChat() {
    const root = chatRoot();
    if (!chat.open) { root.innerHTML = ""; return; }
    root.innerHTML = `<section class="chat" role="dialog" aria-label="Tanya AI">
      <div class="chat-head"><span class="brand-mark" style="width:34px;height:34px">${ic("sparkle", "sm")}</span><div><b>Tanya AI</b><small>Sumber: materi LA Sales Academy</small></div><button class="x" style="margin-left:auto" data-act="chat-close" aria-label="Tutup">${ic("x")}</button></div>
      <div class="chat-body" id="chat-body">${chat.msgs.map((m) => `<div class="msg ${m.who}">${m.html}</div>`).join("")}${chat.typing ? '<div class="msg bot"><span class="typing"><i></i><i></i><i></i></span></div>' : ""}</div>
      ${chat.msgs.length < 3 ? `<div class="chat-sugs">${["Customer bilang broadband lebih murah", "Discovery questions untuk logistik", "Beda dedicated vs broadband?"].map((s) => `<button data-act="chat-sug">${s}</button>`).join("")}</div>` : ""}
      <form class="chat-input" data-form="chat"><input id="chat-in" placeholder="Tulis pertanyaan…" autocomplete="off" aria-label="Pertanyaan"><button class="btn btn-primary" aria-label="Kirim">${ic("send", "sm")}</button></form>
    </section>`;
    const b = $("#chat-body"); b.scrollTop = b.scrollHeight;
  }
  function botReply(q) {
    const s = q.toLowerCase();
    const src = (...x) => `<div class="src">${x.map((y) => `<span class="tag">${y}</span>`).join("")}</div>`;
    if (/murah|harga|mahal|broadband|price/.test(s)) return `Coba geser percakapan dari harga ke dampak bisnis:<ul><li>“Kalau koneksi down satu jam di jam sibuk, berapa transaksi yang tertunda?”</li><li>Hitung bersama: omzet per jam × jam downtime per bulan.</li><li>Bandingkan hasilnya dengan selisih biaya bulanan dedicated vs broadband.</li></ul>Jangan berdebat soal harga per Mbps.${src("Battlecard Internet Dedicated", "Video 02:10")}`;
    if (/discovery|pertanyaan|logistik|tanya customer/.test(s)) return `Tiga discovery questions yang paling sering membuka kebutuhan di sektor logistik:<ul><li>“Aplikasi apa yang paling kritikal kalau koneksi down?”</li><li>“Berapa lama downtime terakhir dan apa dampaknya ke pengiriman?”</li><li>“Ada rencana buka gudang atau cabang baru tahun ini?”</li></ul>${src("Product page · Bagian 09", "Case Study Logistik")}`;
    if (/beda|pembeda|dedicated|sla|differentiator/.test(s)) return `Pembeda utama Internet Dedicated:<ul><li><b>Bandwidth 1:1</b>, tidak dibagi dengan pengguna lain</li><li><b>SLA terukur</b> dengan kompensasi yang jelas</li><li><b>NOC & enterprise support 24/7</b></li><li>Terintegrasi dengan cloud & security Lintasarta</li></ul>${src("Modul 3 · 01:35", "Battlecard")}`;
    if (/cabang|branch|sd-wan/.test(s)) return `Untuk customer multi-cabang, mulai dari Internet Dedicated di kantor pusat dan cabang utama, lalu tawarkan SD-WAN untuk pengelolaan terpusat.${src("Modul 3 · 00:40", "Product page · Cross-sell")}`;
    return `Saya menemukan materi yang relevan di Learning Library dan Product Mapping. Coba buka <a href="#/product/internet-dedicated">product page Internet Dedicated</a> atau tanyakan lebih spesifik, misalnya soal harga, SLA, atau use case cabang.${src("Learning Library", "Product Mapping")}`;
  }
  function sendChat(q) {
    if (!q.trim()) return;
    chat.msgs.push({ who: "me", html: esc(q) });
    chat.typing = true; drawChat();
    setTimeout(() => { chat.typing = false; chat.msgs.push({ who: "bot", html: botReply(q) }); drawChat(); }, 900);
  }

  /* ---------- Dropdown: notifications ---------- */
  function openNotif(btn) {
    closeDrop();
    S.notifSeen = true; save();
    const dot = $(".dot", btn); dot && dot.remove();
    const r = btn.getBoundingClientRect();
    const el = document.createElement("div");
    el.className = "drop";
    el.style.top = r.bottom + 8 + "px";
    el.style.right = Math.max(12, window.innerWidth - r.right) + "px";
    el.innerHTML = `<div class="card-head" style="padding:10px 10px 0;margin-bottom:6px"><h3>Notifikasi</h3></div>` + D.notifications.map((n) => `<div class="list-row ${n.unread ? "unread" : ""}"><span class="sq">${ic(n.icon, "sm")}</span><div><h4 style="font-size:var(--fs-md)">${n.title}</h4><div class="xs muted">${n.body} · ${n.time}</div></div></div>`).join("");
    document.body.appendChild(el);
  }

  /* ---------- Demo bar & phone frame ---------- */
  function demobar() {
    if (IN_FRAME) return "";
    const min = sessionMin();
    return `<div class="demobar ${min ? "min" : ""}" aria-label="Kontrol demo">
      <button class="toggle" data-act="demo-min" aria-label="${min ? "Tampilkan kontrol demo" : "Sembunyikan kontrol demo"}">${ic(min ? "grid" : "x", "sm")}${min ? "Demo" : ""}</button>
      <span class="lbl">Lihat sebagai</span>
      <button class="${S.role === "sales" && S.loggedIn ? "on" : ""}" data-act="as-sales">Sales</button>
      <button class="${S.role === "leader" && S.loggedIn ? "on" : ""}" data-act="as-leader">Sales Leader</button>
      <span class="sep"></span>
      <button data-act="phone">${ic("phone", "sm")}Mobile</button>
      <button data-act="reset">${ic("refresh", "sm")}Reset</button>
    </div>`;
  }
  let _min = false;
  const sessionMin = () => _min;
  function openPhone() {
    const base = location.href.split("#")[0].split("?")[0];
    const h = ["player", "product"].includes(route().name) ? location.hash : "#/dashboard";
    const stage = document.createElement("div");
    stage.className = "phone-stage";
    stage.innerHTML = `<div class="phone"><iframe id="phone-frame" title="Tampilan mobile" src="${base}?frame=1&role=sales${h}"></iframe></div>
      <div class="phone-side"><h3>Tampilan mobile</h3><p>Sales belajar dan menyiapkan meeting di perjalanan.</p>
      <button data-ph="#/dashboard">Dashboard</button><button data-ph="#/player">Modul video</button><button data-ph="#/product/internet-dedicated">Product page</button>
      <button data-ph="close" style="margin-top:12px;background:#fff;color:var(--navy)">Tutup</button></div>`;
    document.body.appendChild(stage);
    stage.addEventListener("click", (e) => {
      const b = e.target.closest("[data-ph]");
      if (e.target === stage || (b && b.dataset.ph === "close")) { stage.remove(); render(); return; }
      if (b) $("#phone-frame").src = `${base}?frame=1&role=sales${b.dataset.ph}`;
    });
  }

  /* ---------- Interactive walkthrough (spotlight) ---------- */
  const isMobile = () => window.matchMedia("(max-width: 900px)").matches;
  const navLink = (k) => () => (isMobile() ? `.bottom-nav a[href="#/${k}"]` : `.sidebar a[href="#/${k}"]`);
  const TOUR = {
    dashboard: { label: "Dashboard", steps: [
      { page: "dashboard", sel: ".continue", title: "Satu tombol untuk lanjut belajar", body: "Video lanjut dari detik terakhir kamu berhenti. Tidak perlu cari lewat menu." },
      { page: "dashboard", sel: ".kpis", title: "Semua angka bisa diklik", body: "Buka course, task, dan poin langsung dari sini. Task yang jatuh tempo diberi tanda merah." },
      { page: "dashboard", sel: ".sell", title: "Ada meeting customer?", body: "Product Mapping, Sales Toolkit, dan Tanya AI siap dipakai dalam 1 menit sebelum meeting." },
      { page: "dashboard", sel: navLink("courses"), title: "Lihat learning path-mu", body: () => (isMobile() ? "Klik tab Belajar untuk melanjutkan tur." : "Klik Courses untuk melanjutkan tur."), action: { label: "Buka Courses", href: "#/courses", to: { flow: "courses", i: 0 } } }
    ] },
    courses: { label: "Courses", steps: [
      { page: "courses", sel: '#main [data-go="#/course"]', title: "Buka course pertamamu", body: "Klik Internet Dedicated untuk melihat isi course-nya.", action: { label: "Buka course", href: "#/course", to: { flow: "courses", i: 1 } } },
      { page: "course", sel: "#course-modules", title: "Isi course", body: "4 video dan 1 simulasi, lengkap dengan status dan skor quick check. Modul tidak dikunci, bisa dibuka kapan saja." },
      { page: "course", sel: "#course-progress", title: "Progress menuju sertifikasi", body: "Course ini dihitung ke sertifikasi Connectivity Associate. Selesaikan untuk membuka ujian 28 Okt." },
      { page: "course", sel: () => (isMobile() ? null : '.sidebar a[href="#/library"]'), title: "Semua video ada di Learning Library", body: "Klik Learning Library untuk melanjutkan tur.", action: { label: "Buka Learning Library", href: "#/library", to: { flow: "library", i: 0 } } }
    ] },
    library: { label: "Learning Library", steps: [
      { page: "library", sel: ".resume", title: "Lanjutkan menonton", body: "Video yang terputus selalu muncul paling atas, lengkap dengan posisi terakhir." },
      { page: "library", sel: '[data-act=libcat][data-v="Connectivity"]', title: "Filter sesuai portofolio", body: "Coba klik Connectivity. Daftar video langsung menyesuaikan.", action: { label: "Filter Connectivity", to: { flow: "library", i: 2 } } },
      { page: "library", sel: "#main .vcard", title: "Status di setiap kartu", body: "Durasi, label Baru atau Disarankan, progress, dan Selesai terlihat tanpa membuka video.", last: true }
    ] }
  };
  let tourTimer = 0, tourEl = null;
  const tourRoot = () => { let el = $("#tour-root"); if (!el) { el = document.createElement("div"); el.id = "tour-root"; document.body.appendChild(el); } return el; };
  const tourActive = () => !!$("#tour-root .tour-card");
  const tourStep = () => { const f = S.wt && TOUR[S.wt.flow]; return f ? { flow: f, st: f.steps[S.wt.i] } : {}; };
  const tourTarget = (st) => {
    const sel = typeof st.sel === "function" ? st.sel() : st.sel;
    const el = sel && $(sel);
    return el && el.getBoundingClientRect().width ? el : null;
  };
  function scheduleTour() { clearTimeout(tourTimer); tourTimer = setTimeout(showTour, 80); }
  function showTour() {
    const root = tourRoot();
    root.innerHTML = ""; tourEl = null;
    if (!S.wt || S.role !== "sales" || IN_FRAME || !S.loggedIn) return;
    const { flow, st } = tourStep();
    if (!st) { S.wt = null; save(); return; }
    if (route().name !== st.page) return; // paused until the user is back on this page
    const el = tourTarget(st);
    if (!el && !st.action) { // info step whose element is not on screen (e.g. no video to resume): skip it
      if (st.last) return endTour(true);
      S.wt.i++; save(); return showTour();
    }
    if (el && !el.closest(".sidebar, .bottom-nav")) el.scrollIntoView({ block: "center", inline: "nearest" });
    tourEl = el;
    const n = flow.steps.length, i = S.wt.i;
    root.innerHTML = `
      <div class="tour-block ${el ? "" : "dim"}" data-tour="block"></div>
      ${el ? `<div class="tour-hole ${st.action ? "act" : ""}"></div>` : ""}
      <div class="tour-card ${isMobile() ? "sheet" : ""}" role="dialog" aria-modal="true" aria-labelledby="tour-t">
        <div class="tour-meta">${flow.label}, langkah ${i + 1} dari ${n}</div>
        <div class="seg">${segs(i + 1, n)}</div>
        <h3 id="tour-t">${st.title}</h3>
        <p>${typeof st.body === "function" ? st.body() : st.body}</p>
        ${st.action && el ? `<p class="tour-hint">${ic("info", "sm")}<span>Klik bagian yang disorot, atau tombol di bawah.</span></p>` : ""}
        <div class="tour-foot"><button class="tour-skip" data-tour="skip">Lewati tur</button><button class="btn btn-primary btn-sm" data-tour="next">${st.action ? st.action.label : st.last ? "Selesai" : "Berikutnya"}</button></div>
      </div>`;
    placeTour();
    $("#tour-root [data-tour=next]").focus({ preventScroll: true });
  }
  function placeTour() {
    const card = $("#tour-root .tour-card"); if (!card) return;
    const hole = $("#tour-root .tour-hole");
    const W = window.innerWidth, H = window.innerHeight, gap = 16, pad = 6;
    let r = null;
    if (tourEl && hole) {
      r = tourEl.getBoundingClientRect();
      const rad = parseFloat(getComputedStyle(tourEl).borderTopLeftRadius) || 12;
      Object.assign(hole.style, { left: r.left - pad + "px", top: r.top - pad + "px", width: r.width + pad * 2 + "px", height: r.height + pad * 2 + "px", borderRadius: rad + pad + "px" });
    }
    if (card.classList.contains("sheet")) { // mobile: panel at the bottom, or the top when the target sits low
      const low = r && r.top + r.height / 2 > H * 0.55;
      Object.assign(card.style, low ? { top: "12px", bottom: "auto" } : { bottom: "12px", top: "auto" });
      return;
    }
    const cw = card.offsetWidth, ch = card.offsetHeight;
    const clamp = (v, min, max) => Math.min(Math.max(v, min), max);
    let left, top;
    if (!r) { left = (W - cw) / 2; top = (H - ch) / 2; }
    else if (r.right + pad + gap + cw <= W - gap) { left = r.right + pad + gap; top = clamp(r.top, gap, H - ch - gap); }
    else if (r.bottom + pad + gap + ch <= H - gap) { top = r.bottom + pad + gap; left = clamp(r.left, gap, W - cw - gap); }
    else if (r.top - pad - gap - ch >= gap) { top = r.top - pad - gap - ch; left = clamp(r.left, gap, W - cw - gap); }
    else if (r.left - pad - gap - cw >= gap) { left = r.left - pad - gap - cw; top = clamp(r.top, gap, H - ch - gap); }
    else { left = W - cw - 24; top = H - ch - 24; }
    Object.assign(card.style, { left: left + "px", top: top + "px" });
  }
  function tourNext() {
    const { st } = tourStep(); if (!st) return;
    if (st.action) {
      const el = tourTarget(st);
      S.wt = { ...st.action.to }; save();
      $("#tour-root").innerHTML = "";
      if (el) el.click(); else if (st.action.href) go(st.action.href);
      scheduleTour();
      return;
    }
    if (st.last) return endTour(true);
    S.wt.i++; save(); showTour();
  }
  function endTour(done) {
    S.wt = null; save();
    tourRoot().innerHTML = ""; tourEl = null;
    toast(done ? "Tur selesai. Bisa diulang kapan saja dari Profil." : "Tur dilewati. Bisa diulang dari Profil.", done ? "check" : "info");
  }
  tourRoot().addEventListener("click", (e) => {
    e.stopPropagation();
    const t = e.target.closest("[data-tour]"); if (!t) return;
    if (t.dataset.tour === "skip") return endTour(false);
    if (t.dataset.tour === "next") return tourNext();
    if (t.dataset.tour === "block" && tourEl) { // a click inside the spotlight performs the highlighted action
      const { st } = tourStep(); const r = tourEl.getBoundingClientRect();
      if (st && st.action && e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom) tourNext();
    }
  });
  window.addEventListener("resize", () => tourActive() && scheduleTour()); // re-pick target (sidebar vs bottom nav) and layout
  window.addEventListener("scroll", () => tourActive() && placeTour(), true);

  /* ---------- Render ---------- */
  function render() {
    clearInterval(raf); P_.playing = false;
    document.body.style.overflow = "";
    closeDrop();
    if ($("#overlay-root").innerHTML && !$("#overlay-root .cmdk")) closeModal();
    const r = route();
    let html = "";
    if (!S.loggedIn) { if (r.name !== "login") { history.replaceState(null, "", "#/login"); } html = pageLogin(); }
    else {
      let name = r.name;
      if (!name || name === "login" || name === "onboarding") { name = S.role === "leader" ? "team" : "dashboard"; history.replaceState(null, "", "#/" + name); }
      if (name === "dashboard" && S.role === "leader") { name = "team"; history.replaceState(null, "", "#/team"); }
      const rr = { name, param: r.param };
      const pages = { dashboard: pageDashboard, course: pageCourse, library: pageLibrary, player: pagePlayer, team: pageTeam, product: pageProduct, products: pageProducts, toolkit: pageToolkit, courses: pageCourses, tasks: pageTasks, inbox: pageInbox, certification: pageCert, news: pageNews, calendar: pageCalendar, process: pageProcess, profile: pageProfile };
      html = (pages[name] || pageDashboard)(rr);
    }
    $("#app").innerHTML = html + demobar();
    if (route().name === "player") mountPlayer();
    if (route().name === "team") mountTeam();
    if (route().name === "product" && S.openSec) {
      const chip = $(`.sec-chips [data-k="${S.openSec}"]`); chip && chip.scrollIntoView({ block: "nearest", inline: "center" });
    }
    if (!IN_FRAME) window.scrollTo(0, 0);
    drawChat();
    scheduleTour();
  }

  /* ---------- Events ---------- */
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".drop") && !e.target.closest('[data-act="notif"]')) closeDrop();
    const g = e.target.closest("[data-go]");
    if (g && !g.dataset.act) { e.preventDefault(); go(g.dataset.go); return; }
    const el = e.target.closest("[data-act]");
    if (!el) return;
    const a = el.dataset.act;
    const d = el.dataset;
    const H = {
      scrim: () => { if (e.target === el) closeModal(); },
      close: closeModal,
      search: () => { e.preventDefault(); openSearch(); },
      notif: () => openNotif(el),
      chat: () => openChat(d.ctx),
      "chat-close": () => { chat.open = false; drawChat(); },
      "chat-sug": () => sendChat(el.textContent),
      resume: () => go("#/player"),
      module4: () => { go("#/course"); toast("Modul 4 belum termasuk di demo ini. Aset video final menyusul.", "info"); },
      "save-course": () => { S.saved = !S.saved; save(); render(); toast(S.saved ? "Course disimpan ke daftarmu." : "Course dihapus dari daftarmu."); },
      module: () => {
        const n = +d.n;
        if (n === 3) return go("#/player");
        const m = modules().find((x) => x.n === n);
        if (m.status === "done") toast(`Modul ${n} dibuka ulang. Skor ${m.score[0]}/${m.score[1]} tidak berubah.`, "info");
        else toast(n === 4 && S.m3done ? "Modul 4 belum termasuk di demo ini." : "Modul ini bisa dibuka kapan saja. Disarankan selesaikan Modul 3 dulu.", "info");
      },
      download: () => toast(`${d.name} diunduh.`, "download"),
      libtab: () => { S.libTab = d.v; save(); render(); },
      libcat: () => { S.libCat = d.v; save(); render(); },
      toolcat: () => { S.toolCat = d.v; save(); render(); },
      clearfilter: () => { S.libDur = "all"; if (S.libTab === "mat") S.libCat = "Semua"; save(); render(); },
      video: () => {
        const v = D.library.find((x) => x.id === d.id);
        modal(`<div class="modal-head"><h2 style="font-size:var(--fs-xl)">${v.title}</h2><button class="x" data-act="close" aria-label="Tutup">${ic("x")}</button></div>
          <div class="vthumb ${v.g}" style="border-radius:18px"><span class="play-disc">${ic("play")}</span><span class="dur">${v.dur}</span></div>
          <p class="muted small" style="margin:14px 0">${v.cat} · ${v.prog === 100 ? "Sudah ditonton" : v.prog ? v.prog + "% ditonton" : "Belum ditonton"}. Video final menyusul dari aset brand Lintasarta; di demo ini, video yang bisa diputar adalah Modul 3 Internet Dedicated.</p>
          <div style="display:flex;gap:8px;justify-content:flex-end;flex-wrap:wrap"><button class="btn btn-ghost" data-act="chat">${ic("sparkle", "sm")}Tanya AI topik ini</button><button class="btn btn-primary" data-act="resume" autofocus>Putar video contoh</button></div>`);
      },
      play: () => togglePlay(),
      speed: () => { const sp = [1, 1.25, 1.5, 2]; P_.speed = sp[(sp.indexOf(P_.speed) + 1) % sp.length]; el.textContent = P_.speed.toFixed(P_.speed % 1 ? 2 : 1).replace(/0$/, "") + "x"; },
      cc: () => { P_.cc = !P_.cc; el.classList.toggle("on", P_.cc); updatePlayer(); },
      hd: () => { P_.hd = !P_.hd; el.textContent = P_.hd ? "HD" : "SD"; el.classList.toggle("on", P_.hd); $("#video").classList.toggle("sd", !P_.hd); toast(P_.hd ? "Kualitas HD." : "Mode hemat data aktif (SD).", "info"); },
      fs: () => toggleFs(),
      seek: () => { S.t = +d.t; updatePlayer(); save(); if (!P_.playing) togglePlay(true); },
      ptab: () => { $$("[data-act=ptab]").forEach((b) => b.classList.toggle("on", b === el)); $("#ptab-body").innerHTML = d.v === "take" ? takeawaysHtml() : d.v === "trans" ? transcriptHtml() : `<div class="card">${D.course.files.map(fileRow).join("")}</div>`; updatePlayer(); },
      quiz: () => openQuiz(),
      qopt: () => { Q.ans[Q.i] = +d.k; renderQuiz(); },
      qnext: () => { if (Q.i < D.quiz.length - 1) { Q.i++; renderQuiz(); } else quizResult(); },
      qprev: () => { Q.i--; renderQuiz(); },
      jump: () => { closeModal(); S.t = +d.t; save(); if (route().name !== "player") go("#/player"); updatePlayer(); togglePlay(true); toast(`Memutar ulang dari ${fmt(+d.t)}.`, "play"); },
      "to-dash": () => { closeModal(); go("#/dashboard"); },
      "to-course": () => { closeModal(); go("#/course"); toast("Modul 3 selesai. +120 poin.", "star"); },
      "save-exit": () => { togglePlay(false); save(); go("#/dashboard"); toast(`Progress disimpan di ${fmt(S.t)}. Lanjutkan kapan saja dari dashboard.`); },
      tfilter: () => { S.teamFilter = d.v; save(); render(); },
      remind: () => { S.reminded[d.name] = true; save(); render(); toast(`Pengingat terkirim ke Inbox ${d.name.split(" ")[0]}.`, "send"); },
      appreciate: () => { S.reminded[d.name] = true; save(); render(); toast(`Apresiasi terkirim ke ${d.name.split(" ")[0]}. +20 poin untuknya.`, "star"); },
      "assign-add": () => { if (!S.assignSel.includes(d.name)) S.assignSel.push(d.name); save(); render(); $("#assign").scrollIntoView({ behavior: "smooth", block: "center" }); },
      "assign-rm": () => { S.assignSel = S.assignSel.filter((n) => n !== d.name); save(); refreshAssign(); },
      assign: () => {
        const task = $("#as-task").value;
        const firsts = S.assignSel.map((n) => n.split(" ")[0]);
        const who = firsts.length === 1 ? firsts[0] : firsts.length === 2 ? `${firsts[0]} dan ${firsts[1]}` : firsts.length === 3 ? `${firsts[0]}, ${firsts[1]}, dan ${firsts[2]}` : `${firsts.slice(0, 2).join(", ")}, dan ${firsts.length - 2} lainnya`;
        const dv = $("#as-date").value; const dl = dv ? new Date(dv + "T00:00").toLocaleDateString("id-ID", { day: "numeric", month: "short" }) : "tanpa deadline";
        S.assignSel = []; save(); render();
        toast(`“${task}” di-assign ke ${who}. Deadline ${dl}.`, "send");
      },
      "assign-video": () => { toast("Video Objection Handling di-assign ke 3 anggota yang perlu perhatian.", "send"); },
      sec: () => { S.openSec = d.k; save(); render(); const s = $("#sec-" + d.k); s && s.scrollIntoView({ behavior: "smooth", block: "center" }); },
      acc: () => { S.openSec = S.openSec === d.k ? "" : d.k; save(); render(); const s = $("#sec-" + d.k); s && s.scrollIntoView({ block: "nearest" }); },
      "other-product": () => toast("Di demo ini, product page lengkap tersedia untuk Internet Dedicated.", "info"),
      "other-course": () => toast("Di demo ini, course lengkap tersedia untuk Internet Dedicated.", "info"),
      msg: () => { const m = D.inbox[+d.i]; S.readInbox[+d.i] = true; save(); render(); modal(`<div class="modal-head"><span class="avatar ${m.c}">${m.initials}</span><div><b>${m.from}</b><div class="xs muted">${m.time}</div></div><button class="x" data-act="close" aria-label="Tutup">${ic("x")}</button></div><h2 style="font-size:var(--fs-xl);margin-bottom:8px">${m.title}</h2><p style="color:var(--ink-2)">${m.body}</p><div style="display:flex;justify-content:flex-end;margin-top:18px"><button class="btn btn-primary" data-act="close" autofocus>Tutup</button></div>`); },
      register: () => { S.registered[+d.i] = !S.registered[+d.i]; save(); render(); toast(S.registered[+d.i] ? "Terdaftar. Undangan kalender dikirim ke email kantor." : "Pendaftaran dibatalkan.", S.registered[+d.i] ? "calendar" : "info"); },
      retour: () => { S.wt = { flow: "dashboard", i: 0 }; save(); go("#/dashboard"); },
      logout: () => { S.loggedIn = false; save(); go("#/login"); },
      sso: () => {
        el.innerHTML = '<span class="spinner"></span>Menghubungkan ke SSO…'; el.disabled = true;
        setTimeout(() => {
          S.loggedIn = true; S.failedLogin = 0; S.role = "sales"; save();
          if (!S.onboarded) { S.onboarded = true; S.wt = { flow: "dashboard", i: 0 }; save(); go("#/dashboard"); }
          else { go("#/dashboard"); toast(`Selamat datang kembali. Lanjutkan dari Modul 3, ${fmt(S.t)}.`, "play"); }
        }, 900);
      },
      forgot: () => { e.preventDefault(); toast("Link reset password dikirim ke email kantor kamu.", "send"); },
      inactive: () => { e.preventDefault(); modal(`<div class="modal-head"><h2>Akun belum aktif</h2><button class="x" data-act="close" aria-label="Tutup">${ic("x")}</button></div><p style="color:var(--ink-2)">Akun dibuat otomatis dari data HR. Jika belum bisa masuk, hubungi Commerce Operation:</p><p style="margin-top:10px"><a href="mailto:commerce.operation@lintasarta.co.id"><b>commerce.operation@lintasarta.co.id</b></a></p>`); },
      "demo-min": () => { _min = !_min; render(); },
      "as-sales": () => { Object.assign(S, { loggedIn: true, onboarded: true, role: "sales" }); save(); go("#/dashboard"); },
      "as-leader": () => { Object.assign(S, { loggedIn: true, onboarded: true, role: "leader" }); save(); go("#/team"); },
      phone: openPhone,
      reset: () => { S = fresh(); chat = { open: false, msgs: [] }; save(); go("#/login"); toast("Demo direset ke awal.", "refresh"); }
    };
    if (H[a]) { if (el.tagName === "A") e.preventDefault(); H[a](); }
  });
  document.addEventListener("change", (e) => {
    const a = e.target.dataset.act;
    if (a === "libdur") { S.libDur = e.target.value; save(); render(); }
    if (a === "libsort") { S.libSort = e.target.value; save(); render(); }
  });
  document.addEventListener("submit", (e) => {
    e.preventDefault();
    const f = e.target.dataset.form;
    if (f === "chat") { const i = $("#chat-in"); const v = i.value; i.value = ""; sendChat(v); setTimeout(() => $("#chat-in") && $("#chat-in").focus(), 0); }
    if (f === "login") {
      const pw = $("#pw");
      if (!pw.value) { $("#login-msg").innerHTML = `<div class="alert">${ic("info")}<span>Masukkan password, atau masuk dengan SSO.</span></div>`; pw.focus(); return; }
      S.failedLogin++; save(); render(); $("#pw") && !$("#pw").disabled && $("#pw").focus();
    }
  });
  document.addEventListener("keydown", (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); if (S.loggedIn && S.onboarded) openSearch(); }
    if (e.key === "Escape" && $("#video.is-fs")) { toggleFs(); return; }
    if (e.key === "Escape" && tourActive()) { endTour(false); return; }
    if (e.key.toLowerCase() === "f" && route().name === "player" && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName) && !$("#overlay-root").innerHTML) { toggleFs(); }
    if (e.key === "Escape") { if ($("#overlay-root").innerHTML) closeModal(); else if (chat.open) { chat.open = false; drawChat(); } closeDrop(); }
    if (e.key === " " && route().name === "player" && !/INPUT|TEXTAREA|BUTTON|SELECT/.test(document.activeElement.tagName) && !$("#overlay-root").innerHTML) { e.preventDefault(); togglePlay(); }
  });
  let refitTimer = 0;
  window.addEventListener("resize", () => { closeDrop(); clearTimeout(refitTimer); refitTimer = setTimeout(refitChart, 150); });

  render();
})();
