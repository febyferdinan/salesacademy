import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  CheckSquare,
  Mail,
  Calendar as CalendarIcon,
  GitBranch,
  Newspaper,
  User,
  ArrowRight,
  CheckCircle2,
  Clock,
  MapPin,
  Download,
  LogOut,
  RotateCcw,
  Award,
  Flame,
  BookOpen,
  Sparkles,
} from 'lucide-react';
import { useAcademyStore } from '../store/useAcademyStore';
import type { InboxMessage } from '../../shared/types';

// ==================== 1. TASKS PAGE (/tasks) ====================
export const TasksPage: React.FC = () => {
  const { tasks } = useAcademyStore();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'all' | 'due' | 'open' | 'done'>('all');

  const filtered = tasks.filter((t) => (filter === 'all' ? true : t.state === filter));

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-brand-blue dark:text-sky-400">
            Enablement Assignments
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-0.5">
            Tugas & Tindak Lanjut Pembelajaran
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Daftar modul wajib, simulasi role-play, dan penugasan langsung dari Sales Leader Anda.
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 p-1.5 rounded-xl border border-slate-200 dark:border-slate-800">
          {(
            [
              ['all', 'Semua'],
              ['due', 'Hari Ini'],
              ['open', 'Berjalan'],
              ['done', 'Selesai'],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                filter === key
                  ? 'bg-brand-blue text-white'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map((task) => (
          <div
            key={task.id}
            onClick={() => navigate(task.go)}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-xs hover:border-brand-blue/50 hover:shadow-md transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="flex items-start gap-3.5">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                  task.state === 'done'
                    ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600'
                    : task.state === 'due'
                    ? 'bg-amber-50 dark:bg-amber-950 text-amber-600'
                    : 'bg-sky-50 dark:bg-sky-950 text-brand-blue'
                }`}
              >
                {task.state === 'done' ? (
                  <CheckCircle2 className="w-5 h-5" strokeWidth={1.75} />
                ) : (
                  <CheckSquare className="w-5 h-5" strokeWidth={1.75} />
                )}
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                      task.state === 'done'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : task.state === 'due'
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        : 'bg-sky-100 text-brand-blue dark:bg-sky-950 dark:text-sky-300'
                    }`}
                  >
                    {task.due}
                  </span>
                  <span className="text-xs text-slate-400">Untuk: {task.assignedTo}</span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                  {task.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{task.src}</p>
              </div>
            </div>

            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-blue dark:text-sky-400 shrink-0 self-end sm:self-center">
              <span>{task.state === 'done' ? 'Tinjau Ulang' : 'Kerjakan Sekarang'}</span>
              <ArrowRight className="w-4 h-4" strokeWidth={1.75} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ==================== 2. INBOX PAGE (/inbox) ====================
export const InboxPage: React.FC = () => {
  const { inbox, markInboxRead } = useAcademyStore();
  const [selectedMsg, setSelectedMsg] = useState<InboxMessage | null>(inbox[0] || null);

  const handleSelect = (msg: InboxMessage) => {
    setSelectedMsg(msg);
    if (msg.unread) {
      markInboxRead(msg.id);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-brand-blue dark:text-sky-400">
          Internal Communication
        </span>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-0.5">
          Kotak Masuk & Pengumuman Coaching
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Pesan langsung dari Sales Leader, Product Marketing, dan sistem LA Sales Academy.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden shadow-xs">
          {inbox.map((msg) => {
            const isSelected = selectedMsg?.id === msg.id;
            return (
              <button
                key={msg.id}
                onClick={() => handleSelect(msg)}
                className={`w-full text-left p-4 transition flex items-start gap-3.5 ${
                  isSelected
                    ? 'bg-sky-50/80 dark:bg-sky-950/30'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }`}
              >
                <div
                  className="w-9 h-9 rounded-full text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5"
                  style={{ backgroundColor: msg.c }}
                >
                  {msg.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {msg.from}
                    </span>
                    <span className="text-[11px] text-slate-400 shrink-0">{msg.time}</span>
                  </div>
                  <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate mt-0.5 flex items-center gap-1.5">
                    {msg.unread && <span className="w-2 h-2 rounded-full bg-brand-blue shrink-0" />}
                    <span className="truncate">{msg.title}</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                    {msg.body}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-6 shadow-xs min-h-[280px]">
          {selectedMsg ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full text-white text-xs font-bold flex items-center justify-center"
                    style={{ backgroundColor: selectedMsg.c }}
                  >
                    {selectedMsg.initials}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900 dark:text-white">
                      {selectedMsg.from}
                    </div>
                    <div className="text-xs text-slate-400">{selectedMsg.time}</div>
                  </div>
                </div>
                <Mail className="w-5 h-5 text-slate-400" strokeWidth={1.75} />
              </div>

              <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
                {selectedMsg.title}
              </h2>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                {selectedMsg.body}
              </p>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3">
                <Link
                  to="/courses"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-blue text-white text-xs font-bold hover:bg-brand-navy transition"
                >
                  Buka Kurikulum Terkait
                  <ArrowRight className="w-3.5 h-3.5" strokeWidth={2} />
                </Link>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400 text-sm">
              Pilih pesan di sebelah kiri untuk membaca detail.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ==================== 3. CALENDAR PAGE (/calendar) ====================
export const CalendarPage: React.FC = () => {
  const { agenda, toggleCalendarRegistration } = useAcademyStore();

  return (
    <div className="space-y-6 pb-12">
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-brand-blue dark:text-sky-400">
          Live Enablement Sessions
        </span>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-0.5">
          Kalender Klinik Produk & Role-Play Mingguan
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Daftar ke sesi klinik presales, bedah produk baru, dan ujian sertifikasi terjadwal.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {agenda.map((ev) => (
          <div
            key={ev.id}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-xs flex items-start justify-between gap-4"
          >
            <div className="flex items-start gap-4">
              <div className="w-14 h-16 rounded-2xl bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 flex flex-col items-center justify-center shrink-0">
                <span className="text-lg font-extrabold font-mono text-brand-blue dark:text-sky-300 leading-none">
                  {ev.d}
                </span>
                <span className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 mt-1">
                  {ev.m}
                </span>
              </div>

              <div className="space-y-1.5">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">{ev.title}</h3>
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <Clock className="w-3.5 h-3.5 text-brand-blue" strokeWidth={1.75} />
                  <span>{ev.meta}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" strokeWidth={1.75} />
                  <span>
                    {ev.location} · Bersama <strong>{ev.speaker}</strong>
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => toggleCalendarRegistration(ev.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition shrink-0 ${
                ev.registered
                  ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                  : 'bg-brand-blue hover:bg-brand-navy text-white shadow-xs'
              }`}
            >
              {ev.registered ? '✓ Terdaftar' : 'Daftar Sesi'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// ==================== 4. SALES PROCESS PAGE (/process) ====================
export const ProcessPage: React.FC = () => {
  const { process, setPreviewDoc } = useAcademyStore();

  const handleOpenSop = (title: string, summary: string) => {
    setPreviewDoc({
      title,
      type: 'doc',
      meta: 'SOP Commercial Governance 2026 · Berlaku Nasional',
      summary,
      sections: [
        {
          heading: '1. Tujuan & Ruang Lingkup Prosedur',
          content: [
            summary,
            'Berlaku bagi seluruh Account Executive, Presales/Solution Architect, dan Sales Leader Lintasarta.',
          ],
        },
        {
          heading: '2. Matriks Persetujuan & SLA Internal',
          content: [
            'Deal Reguler (Sesuai Rate Card): Persetujuan Manager Commercial dalam 1x24 jam.',
            'Deal Custom / Diskon >10%: Wajib menyertakan Kalkulasi ROI & BoQ yang divalidasi Solution Architect serta VP Commercial.',
            'Handover ke Delivery: Wajib melampirkan BAST Pra-Implementasi, Topologi Final, dan PIC Teknis Pelanggan.',
          ],
        },
      ],
    });
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-brand-blue dark:text-sky-400">
            Standardized B2B Execution
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-0.5">
            Tahapan Proses Penjualan B2B Lintasarta
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            5 tahapan baku consultative selling dari identifikasi kebutuhan hingga serah-terima
            implementasi.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() =>
              handleOpenSop(
                'SOP Pricing Approval & Esensi Margin 2026',
                'Pedoman resmi pengajuan harga khusus, matriks otorisasi diskon, dan syarat minimum margin solusi Lintasarta.'
              )
            }
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 hover:border-brand-blue transition shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-brand-blue" strokeWidth={1.75} />
            SOP Pricing Approval 2026
          </button>
          <button
            onClick={() =>
              handleOpenSop(
                'Checklist Handover Presales ke Delivery & Operasi',
                'Daftar periksa kelengkapan dokumen teknis, SLA, dan kesiapan site sebelum aktivasi layanan pelanggan.'
              )
            }
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-brand-blue text-white text-xs font-bold hover:bg-brand-navy transition shadow-2xs"
          >
            <Download className="w-3.5 h-3.5" strokeWidth={1.75} />
            Checklist Handover ke Delivery
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {process.map((step) => (
          <div
            key={step.step}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-xs flex flex-col justify-between gap-4 relative"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="w-8 h-8 rounded-xl bg-brand-blue text-white font-mono text-xs font-extrabold flex items-center justify-center">
                  0{step.step}
                </span>
                <GitBranch className="w-4 h-4 text-slate-300 dark:text-slate-700" strokeWidth={1.75} />
              </div>
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white leading-snug">
                {step.t}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{step.d}</p>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1 text-[11px]">
              <div className="text-slate-400 font-semibold uppercase">Deliverable Utama:</div>
              <div className="font-bold text-brand-blue dark:text-sky-400">{step.deliverable}</div>
              <div className="text-slate-500">PIC: {step.owner}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ==================== 5. NEWS PAGE (/news) ====================
export const NewsPage: React.FC = () => {
  const { news } = useAcademyStore();

  return (
    <div className="space-y-6 pb-12">
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-brand-blue dark:text-sky-400">
          Commercial Intelligence
        </span>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-0.5">
          Berita Produk & Pengumuman Enablement
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Pembaruan klaim kapabilitas, peluncuran produk, dan informasi kompetitif terbaru.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {news.map((item) => (
          <div
            key={item.id}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-6 shadow-xs flex flex-col justify-between gap-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-sky-50 dark:bg-sky-950 text-brand-blue dark:text-sky-300">
                  {item.tag}
                </span>
                <span className="text-xs text-slate-400">{item.date}</span>
              </div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white leading-snug">
                {item.title}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {item.body}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <Newspaper className="w-3.5 h-3.5 text-brand-blue" strokeWidth={1.75} />
                {item.author || 'Commercial Enablement'}
              </span>
              <Link to="/products" className="font-bold text-brand-blue dark:text-sky-400">
                Lihat Battlecard →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ==================== 6. PROFILE PAGE (/profile) ====================
export const ProfilePage: React.FC = () => {
  const { activeRole, users, switchRole, logout, resetDemo } = useAcademyStore();
  const navigate = useNavigate();
  const user = users[activeRole];

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-6 lg:p-8 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div
            className="w-16 h-16 rounded-2xl text-white text-xl font-extrabold flex items-center justify-center shadow-md shrink-0"
            style={{ backgroundColor: user.avatarColor }}
          >
            {user.initials}
          </div>
          <div>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-sky-50 dark:bg-sky-950 text-brand-blue dark:text-sky-300 uppercase">
              Role: {user.role}
            </span>
            <h1 className="text-xl lg:text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
              {user.name}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {user.title} · {user.area} ({user.team})
            </p>
            <p className="text-xs text-slate-400 mt-0.5">{user.email}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => resetDemo()}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold transition"
          >
            <RotateCcw className="w-3.5 h-3.5" strokeWidth={1.75} />
            Reset Demo Data
          </button>
          <button
            onClick={async () => {
              await logout();
              navigate('/login');
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition"
          >
            <LogOut className="w-3.5 h-3.5" strokeWidth={1.75} />
            Keluar SSO
          </button>
        </div>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 flex items-center justify-center">
            <Award className="w-5 h-5" strokeWidth={1.75} />
          </div>
          <div>
            <div className="text-xl font-extrabold font-mono text-slate-900 dark:text-white">
              {user.points} Poin
            </div>
            <div className="text-xs text-slate-500">Total Poin Pembelajaran</div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-rose-50 dark:bg-rose-950 text-rose-600 flex items-center justify-center">
            <Flame className="w-5 h-5" strokeWidth={1.75} />
          </div>
          <div>
            <div className="text-xl font-extrabold font-mono text-slate-900 dark:text-white">
              {user.streakDays} Hari
            </div>
            <div className="text-xs text-slate-500">Streak Belajar Aktif</div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-sky-50 dark:bg-sky-950 text-brand-blue flex items-center justify-center">
            <BookOpen className="w-5 h-5" strokeWidth={1.75} />
          </div>
          <div>
            <div className="text-xl font-extrabold font-mono text-slate-900 dark:text-white">
              {user.studyHoursMonth} Jam
            </div>
            <div className="text-xs text-slate-500">Jam Belajar Bulan Ini</div>
          </div>
        </div>
      </div>

      {/* Role Switcher Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-brand-blue" strokeWidth={1.75} />
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Beralih Persona Demo (1-Click Role Switcher)
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {(['sales', 'leader', 'admin'] as const).map((r) => {
            const u = users[r];
            const isCurrent = activeRole === r;
            return (
              <button
                key={r}
                onClick={() => switchRole(r)}
                className={`p-4 rounded-xl border text-left transition ${
                  isCurrent
                    ? 'border-brand-blue bg-sky-50/70 dark:bg-sky-950/40 ring-1 ring-brand-blue'
                    : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }`}
              >
                <div className="text-xs font-extrabold uppercase text-brand-blue dark:text-sky-400">
                  {r === 'sales' ? 'Account Executive' : r === 'leader' ? 'Sales Leader' : 'Admin Enablement'}
                </div>
                <div className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                  {u.name}
                </div>
                <div className="text-xs text-slate-500 mt-0.5">{u.title}</div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

