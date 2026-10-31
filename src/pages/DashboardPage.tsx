import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Flame,
  Play,
  Clock,
  BookOpen,
  ClipboardCheck,
  Star,
  Map,
  Briefcase,
  Sparkles,
  Calendar,
  Server,
  Cloud,
  Shield,
  Users,
  ArrowRight,
} from 'lucide-react';
import { AppShell } from '../components/layout/AppShell';
import { useAcademyStore } from '../store/useAcademyStore';
import { formatTime, formatNumber } from '../lib/utils';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { users, activeRole, courses, progress, agenda, tasks, setChatOpen } = useAcademyStore();
  const user = users[activeRole];

  const mainCourse = courses[0]; // Internet Dedicated
  const m3Prog = progress.find((p) => p.courseId === 'internet-dedicated' && p.moduleNum === 3);
  const m3Done = m3Prog?.status === 'done';
  const watchedSec = m3Prog?.watchedSec ?? 80;
  const mod3Duration = mainCourse.modules[2]?.durationSec ?? 170;
  const watchedPct = Math.min(100, Math.round((watchedSec / mod3Duration) * 100));

  const dueTasksCount = tasks.filter((t) => t.state !== 'done').length;
  const rank = user.points > 1280 ? 9 : 10;

  const getCoursePct = (courseId: string) => {
    const c = courses.find((x) => x.id === courseId);
    if (!c) return 0;
    const doneMods = progress.filter(
      (p) => p.courseId === courseId && p.status === 'done'
    ).length;
    if (courseId === 'internet-dedicated') return m3Done ? 74 : 68;
    if (courseId === 'dc') return 40;
    return Math.round((doneMods / Math.max(1, c.modules.length)) * 100);
  };

  const renderCourseIcon = (icon: string) => {
    switch (icon) {
      case 'server':
        return <Server className="w-5 h-5 text-white" strokeWidth={1.5} />;
      case 'sparkle':
        return <Sparkles className="w-5 h-5 text-white" strokeWidth={1.5} />;
      case 'cloud':
        return <Cloud className="w-5 h-5 text-white" strokeWidth={1.5} />;
      case 'shield':
        return <Shield className="w-5 h-5 text-white" strokeWidth={1.5} />;
      case 'users':
        return <Users className="w-5 h-5 text-white" strokeWidth={1.5} />;
      default:
        return <Play className="w-5 h-5 text-white fill-white" strokeWidth={1.5} />;
    }
  };

  return (
    <AppShell title="Dashboard" mobileGreeting>
      {/* Top Hero + Promo Row */}
      <section className="grid lg:grid-cols-[1.65fr_1fr] gap-5">
        {/* Hero Continue Learning Card */}
        <div
          className="relative overflow-hidden rounded-3xl hero-gradient text-white p-6 sm:p-8 shadow-brand flex flex-col justify-between"
          aria-label="Lanjutkan belajar"
        >
          <div className="absolute -right-12 -top-12 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
          <div className="space-y-2 relative z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full glass-pill text-xs font-bold">
              <Flame className="w-3.5 h-3.5 text-amber-300" strokeWidth={1.5} />
              <span>Streak {user.streakDays} hari</span>
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Selamat pagi, {user.first}!
            </h2>
            <p className="text-sm text-white/90">
              Tinggal {m3Done ? 1 : 2} modul lagi untuk menyelesaikan learning path Connectivity
              bulan ini.
            </p>
          </div>

          <div className="mt-6 p-4 rounded-2xl bg-la-navy/45 backdrop-blur-md border border-white/15 flex flex-col sm:flex-row sm:items-center gap-4 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center shrink-0">
              <Play className="w-6 h-6 text-white fill-white" strokeWidth={1.5} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm sm:text-base font-bold truncate">
                Internet Dedicated · Modul {m3Done ? '4: Jualan di Lapangan' : '3: Use Case & Differentiator'}
              </h3>
              <div className="text-xs text-sky-200 mt-0.5">
                {m3Done
                  ? '± 3 menit · Siap dimulai (Modul 3 selesai)'
                  : `± 3 menit · Berhenti di ${formatTime(watchedSec)}, ${watchedPct}% ditonton`}
              </div>
              <div className="mt-2 h-1.5 w-full max-w-[260px] rounded-full bg-white/20 overflow-hidden">
                <div
                  className="h-full bg-sky-300 rounded-full transition-all duration-300"
                  style={{ width: `${m3Done ? 15 : watchedPct}%` }}
                />
              </div>
            </div>
            <button
              type="button"
              onClick={() =>
                navigate(
                  m3Done
                    ? '/player/internet-dedicated/4'
                    : '/player/internet-dedicated/3'
                )
              }
              className="px-4 py-2.5 rounded-xl bg-white text-la-navy hover:bg-sky-50 font-bold text-xs inline-flex items-center justify-center gap-2 shrink-0 shadow-sm transition"
            >
              <Play className="w-3.5 h-3.5 fill-la-navy" strokeWidth={1.5} />
              <span>{m3Done ? 'Mulai Modul 4' : 'Lanjutkan Belajar'}</span>
            </button>
          </div>
        </div>

        {/* Promo New Course Card */}
        <div className="rounded-3xl navy-gradient text-white p-6 sm:p-7 flex flex-col justify-between relative overflow-hidden border border-white/10">
          <div className="space-y-2.5 relative z-10">
            <span className="inline-block px-3 py-1 rounded-full bg-white text-la-navy text-xs font-extrabold">
              Course &amp; Produk Baru
            </span>
            <h3 className="text-xl font-extrabold leading-snug">
              Deka GPU: Komputasi AI Berdaulat di Indonesia
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Video 2:30 dan Battlecard Deka GPU sudah tersedia. Cocok untuk perbankan, BUMN, dan
              enterprise yang membutuhkan Private LLM dengan data tetap di Indonesia.
            </p>
          </div>
          <div className="mt-5 flex items-center justify-between gap-3 relative z-10">
            <button
              type="button"
              onClick={() => navigate('/product/deka-gpu')}
              className="px-4 py-2.5 rounded-xl bg-la-blue hover:bg-la-bluePress text-white text-xs font-bold inline-flex items-center gap-1.5 transition"
            >
              <span>Buka Battlecard Deka GPU</span>
              <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} />
            </button>
            <div className="flex gap-1.5">
              <span className="w-2.5 h-6 rounded-full bg-sky-400/80" />
              <span className="w-2.5 h-8 rounded-full bg-la-blue" />
              <span className="w-2.5 h-5 rounded-full bg-amber-400" />
              <span className="w-2.5 h-7 rounded-full bg-emerald-400" />
            </div>
          </div>
        </div>
      </section>

      {/* 4 Interactive KPI Cards */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4" aria-label="Ringkasan Performa">
        <button
          type="button"
          onClick={() => navigate('/profile')}
          className="text-left p-5 rounded-2xl bg-surface border border-line shadow-card hover:shadow-card-hover hover:border-la-blue/40 transition flex flex-col justify-between gap-2"
        >
          <div className="flex items-center gap-2 text-xs font-semibold text-muted-custom">
            <span className="w-7 h-7 rounded-lg bg-la-ice dark:bg-slate-800 text-la-blue flex items-center justify-center">
              <Clock className="w-4 h-4" strokeWidth={1.5} />
            </span>
            <span>Waktu belajar bulan ini</span>
          </div>
          <div className="flex items-end justify-between gap-2 mt-1">
            <span className="text-2xl font-extrabold text-ink font-mono">
              {user.studyHoursMonth.toString().replace('.', ',')} jam
            </span>
            <div className="flex items-end gap-1 h-6">
              {[30, 45, 38, 62, 55, 100].map((h, i) => (
                <i
                  key={i}
                  className={`w-1.5 rounded-full ${
                    i === 5 ? 'bg-la-blue' : 'bg-la-ice dark:bg-slate-700'
                  }`}
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
          </div>
          <span className="text-xs font-semibold text-la-green">
            +{user.studyHoursDelta.toString().replace('.', ',')} jam dari Sep
          </span>
        </button>

        <button
          type="button"
          onClick={() => navigate('/courses')}
          className="text-left p-5 rounded-2xl bg-surface border border-line shadow-card hover:shadow-card-hover hover:border-la-blue/40 transition flex flex-col justify-between gap-2"
        >
          <div className="flex items-center gap-2 text-xs font-semibold text-muted-custom">
            <span className="w-7 h-7 rounded-lg bg-la-ice dark:bg-slate-800 text-la-blue flex items-center justify-center">
              <BookOpen className="w-4 h-4" strokeWidth={1.5} />
            </span>
            <span>Course selesai</span>
          </div>
          <div className="text-2xl font-extrabold text-ink font-mono mt-1">
            {m3Done ? '9' : '8'} / 12
          </div>
          <div className="grid grid-cols-12 gap-1 h-1.5">
            {Array.from({ length: 12 }).map((_, i) => (
              <span
                key={i}
                className={`rounded-full ${
                  i < (m3Done ? 9 : 8) ? 'bg-la-blue' : 'bg-subtle'
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-muted-custom">
            {m3Done ? '75%' : '67%'} target kuartal Q4
          </span>
        </button>

        <button
          type="button"
          onClick={() => navigate('/tasks')}
          className={`text-left p-5 rounded-2xl bg-surface border shadow-card hover:shadow-card-hover transition flex flex-col justify-between gap-2 ${
            !m3Done ? 'border-la-amber/60' : 'border-line'
          }`}
        >
          <div className="flex items-center gap-2 text-xs font-semibold text-muted-custom">
            <span className="w-7 h-7 rounded-lg bg-la-amberSoft text-la-amber flex items-center justify-center">
              <ClipboardCheck className="w-4 h-4" strokeWidth={1.5} />
            </span>
            <span>Task menunggu</span>
          </div>
          <div className="text-2xl font-extrabold text-ink font-mono mt-1">{dueTasksCount}</div>
          {m3Done ? (
            <span className="text-xs font-semibold text-la-green">
              Tidak ada yang jatuh tempo hari ini
            </span>
          ) : (
            <span className="inline-block px-2.5 py-0.5 rounded-full bg-la-redSoft text-la-red text-[11px] font-bold w-fit">
              1 jatuh tempo hari ini
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => navigate('/profile')}
          className="text-left p-5 rounded-2xl bg-surface border border-line shadow-card hover:shadow-card-hover hover:border-la-blue/40 transition flex flex-col justify-between gap-2"
        >
          <div className="flex items-center gap-2 text-xs font-semibold text-muted-custom">
            <span className="w-7 h-7 rounded-lg bg-la-ice dark:bg-slate-800 text-la-blue flex items-center justify-center">
              <Star className="w-4 h-4" strokeWidth={1.5} />
            </span>
            <span>Poin saat ini</span>
          </div>
          <div className="text-2xl font-extrabold text-ink font-mono mt-1">
            {formatNumber(user.points)}
          </div>
          <span className="text-xs text-muted-custom">Peringkat {rank} dari 300 Sales</span>
        </button>
      </section>

      {/* Main 2-Column Dashboard Grid */}
      <section className="grid lg:grid-cols-[1.5fr_1fr] gap-6">
        {/* Left Stack */}
        <div className="space-y-6">
          {/* Learning Path */}
          <div className="p-6 rounded-3xl bg-surface border border-line shadow-card space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-extrabold text-ink">Learning path kamu</h2>
              <Link to="/courses" className="text-xs font-bold text-la-blue hover:underline">
                Lihat semua course ({courses.length})
              </Link>
            </div>

            <div className="divide-y divide-line">
              {courses.slice(0, 3).map((c) => {
                const pct = getCoursePct(c.id);
                return (
                  <Link
                    key={c.id}
                    to={`/course/${c.slug}`}
                    className="py-3.5 first:pt-1 last:pb-1 flex items-center gap-4 hover:bg-subtle/40 px-2 -mx-2 rounded-2xl transition"
                  >
                    <div
                      className={`w-12 h-12 rounded-2xl ${c.g} flex items-center justify-center shrink-0 shadow-xs`}
                    >
                      {renderCourseIcon(c.icon)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-ink truncate">{c.title}</h4>
                      <div className="flex items-center gap-2.5 mt-1.5">
                        <span className="px-2.5 py-0.5 rounded-full bg-subtle text-[11px] font-semibold text-ink-2">
                          {c.category}
                        </span>
                        <div className="grid grid-cols-12 gap-0.5 w-28 h-1.5">
                          {Array.from({ length: 12 }).map((_, i) => (
                            <span
                              key={i}
                              className={`rounded-full ${
                                i < Math.round((pct / 100) * 12) ? 'bg-la-blue' : 'bg-subtle'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs font-mono text-muted-custom">
                          {pct ? `${pct}%` : ''}
                        </span>
                      </div>
                    </div>
                    {pct === 0 && (
                      <span className="px-2.5 py-1 rounded-full bg-la-amberSoft text-amber-800 text-[11px] font-bold">
                        Baru
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Quick Customer Meeting Prep */}
          <div className="p-6 rounded-3xl bg-surface border border-line shadow-card space-y-4">
            <div>
              <h3 className="text-base font-extrabold text-ink">
                Ada meeting customer? Siapkan dalam 1 menit
              </h3>
              <p className="text-xs text-muted-custom mt-0.5">
                Materi produk, battlecard 12 bagian, kalkulator ROI downtime, dan skrip objection
                dalam satu tempat.
              </p>
            </div>
            <div className="grid sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => navigate('/product/internet-dedicated')}
                className="p-3.5 rounded-2xl bg-canvas hover:bg-subtle border border-line flex items-center gap-3 text-left font-bold text-xs text-ink transition"
              >
                <span className="w-9 h-9 rounded-xl bg-la-ice dark:bg-slate-800 text-la-blue flex items-center justify-center shrink-0">
                  <Map className="w-4 h-4" strokeWidth={1.5} />
                </span>
                <span>Product Mapping &amp; ROI</span>
              </button>
              <button
                type="button"
                onClick={() => navigate('/toolkit')}
                className="p-3.5 rounded-2xl bg-canvas hover:bg-subtle border border-line flex items-center gap-3 text-left font-bold text-xs text-ink transition"
              >
                <span className="w-9 h-9 rounded-xl bg-la-ice dark:bg-slate-800 text-la-blue flex items-center justify-center shrink-0">
                  <Briefcase className="w-4 h-4" strokeWidth={1.5} />
                </span>
                <span>Sales Toolkit</span>
              </button>
              <button
                type="button"
                onClick={() => setChatOpen(true)}
                className="p-3.5 rounded-2xl navy-gradient text-white flex items-center gap-3 text-left font-bold text-xs shadow-brand transition"
              >
                <span className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4 text-sky-300" strokeWidth={1.5} />
                </span>
                <span>Tanya AI Co-Pilot</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Stack */}
        <div className="space-y-6">
          {/* Enablement Agenda */}
          <div className="p-6 rounded-3xl bg-surface border border-line shadow-card space-y-4">
            <h2 className="text-lg font-extrabold text-ink">Agenda enablement terdekat</h2>
            <div className="space-y-3">
              {agenda.slice(0, 2).map((a) => (
                <div
                  key={a.id}
                  className="flex items-center gap-3.5 p-3 rounded-2xl bg-canvas border border-line"
                >
                  <div className="w-12 h-12 rounded-2xl bg-la-ice dark:bg-slate-800 text-la-blue flex flex-col items-center justify-center shrink-0 leading-none">
                    <b className="text-base font-extrabold font-mono">{a.d}</b>
                    <span className="text-[10px] font-bold uppercase mt-0.5">{a.m}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs sm:text-sm font-bold text-ink truncate">{a.title}</h4>
                    <div className="text-xs text-muted-custom truncate mt-0.5">{a.meta}</div>
                  </div>
                </div>
              ))}
            </div>
            <Link
              to="/calendar"
              className="inline-flex items-center gap-2 text-xs font-bold text-la-blue hover:underline pt-1"
            >
              <Calendar className="w-4 h-4" strokeWidth={1.5} />
              <span>Buka Enablement Calendar</span>
            </Link>
          </div>

          {/* Monthly Leaderboard */}
          <div className="p-6 rounded-3xl bg-surface border border-line shadow-card space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-extrabold text-ink">Leaderboard bulan ini</h2>
              <span className="text-xs text-muted-custom font-mono">poin Q4</span>
            </div>

            <div className="space-y-2">
              {[
                { r: 1, name: 'Nadia Putri', initials: 'NP', pts: 2480, c: 'bg-violet-600 text-white' },
                { r: 2, name: 'Arif Wijaya', initials: 'AW', pts: 2315, c: 'bg-emerald-600 text-white' },
              ].map((p) => (
                <div
                  key={p.r}
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl bg-canvas border border-line text-sm"
                >
                  <span className="w-5 font-mono font-bold text-muted-custom">{p.r}</span>
                  <span
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${p.c}`}
                  >
                    {p.initials}
                  </span>
                  <span className="flex-1 font-semibold text-ink truncate">{p.name}</span>
                  <b className="font-mono font-bold text-ink">{formatNumber(p.pts)}</b>
                </div>
              ))}

              <div className="text-center text-xs text-muted-custom tracking-widest">•••</div>

              <div className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl bg-la-ice dark:bg-slate-800 border border-la-blue/30 text-sm">
                <span className="w-5 font-mono font-extrabold text-la-blue">{rank}</span>
                <span className="w-7 h-7 rounded-full bg-la-blue text-white flex items-center justify-center text-xs font-bold">
                  {user.initials}
                </span>
                <span className="flex-1 text-ink truncate">
                  <b>Kamu</b> · {user.first}
                </span>
                <b className="font-mono font-extrabold text-la-blue">
                  {formatNumber(user.points)}
                </b>
              </div>
            </div>
          </div>
        </div>
      </section>
    </AppShell>
  );
};

