import React, { useState, useMemo } from 'react';
import {
  Users,
  Award,
  AlertTriangle,
  TrendingUp,
  Bell,
  Heart,
  Plus,
  Search,
  CheckCircle2,
  Sparkles,
  Calendar,
  Send,
  X,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  Cell,
} from 'recharts';
import { useAcademyStore } from '../store/useAcademyStore';

export const TeamLeaderPage: React.FC = () => {
  const { team, weekly, courses, assignTask, memberAction, setChatOpen, sendAiPrompt } =
    useAcademyStore();

  const [filterTab, setFilterTab] = useState<'all' | 'attn' | 'ontrack'>('all');
  const [memberSearch, setMemberSearch] = useState('');

  // Assign Task Form state
  const [selectedMembers, setSelectedMembers] = useState<string[]>(['Raka Pratama', 'Dimas Wahyu']);
  const [pickerSearch, setPickerSearch] = useState('');
  const [taskTitle, setTaskTitle] = useState('Selesaikan Course: Lintasarta Cloudeka & Deka GPU');
  const [dueDate, setDueDate] = useState('25 Apr 2026');
  const [reminder, setReminder] = useState('H-2 & Hari H via Inbox + Email');
  const [assigning, setAssigning] = useState(false);

  const filteredTeam = useMemo(() => {
    return team.filter((m) => {
      const matchTab =
        filterTab === 'all' ? true : filterTab === 'attn' ? m.attn : !m.attn;
      const matchQuery =
        !memberSearch.trim() ||
        m.name.toLowerCase().includes(memberSearch.toLowerCase()) ||
        m.note.toLowerCase().includes(memberSearch.toLowerCase());
      return matchTab && matchQuery;
    });
  }, [team, filterTab, memberSearch]);

  const chartData = useMemo(() => {
    return weekly.map((val, idx) => ({
      week: `W${idx + 1}`,
      completion: val,
      target: 80,
    }));
  }, [weekly]);

  const avgCompletion = useMemo(() => {
    if (!team.length) return 72;
    return Math.round(team.reduce((acc, m) => acc + m.prog, 0) / team.length);
  }, [team]);

  const attnCount = useMemo(() => team.filter((m) => m.attn).length, [team]);
  const avgQuizScore = useMemo(() => {
    if (!team.length) return 81;
    return Math.round(team.reduce((acc, m) => acc + m.score, 0) / team.length);
  }, [team]);

  const toggleSelectMember = (name: string) => {
    setSelectedMembers((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    );
  };

  const selectAllNeedAttention = () => {
    const names = team.filter((m) => m.attn).map((m) => m.name);
    setSelectedMembers(names);
  };

  const handleAssignSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedMembers.length === 0) return;
    setAssigning(true);
    try {
      await assignTask({
        memberNames: selectedMembers,
        taskTitle,
        dueDate,
        reminder,
        targetRoute: '/courses',
      });
    } finally {
      setAssigning(false);
    }
  };

  const pickerSuggestions = useMemo(() => {
    if (!pickerSearch.trim()) return [];
    return team.filter(
      (m) =>
        !selectedMembers.includes(m.name) &&
        m.name.toLowerCase().includes(pickerSearch.toLowerCase())
    );
  }, [team, selectedMembers, pickerSearch]);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-brand-blue dark:text-sky-400">
            Commercial Enablement Analytics · Area Jabo 1
          </span>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
            Dashboard Kesiapan Tim Sales
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Pantau progres pembelajaran 15 Account Executive, identifikasi gap pemahaman produk, dan
            distribusikan penugasan secara terukur.
          </p>
        </div>

        <button
          onClick={() => {
            setChatOpen(true);
            sendAiPrompt(
              'Analisis kesiapan tim Area Jabo 1 saat ini dan berikan rekomendasi coaching untuk anggota yang masih tertinggal di topik SLA & Tier-III.'
            );
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-navy dark:bg-sky-600 text-white text-xs font-semibold hover:opacity-95 transition self-start lg:self-auto shadow-xs"
        >
          <Sparkles className="w-4 h-4 text-amber-300" strokeWidth={1.75} />
          Ringkasan Coaching AI
        </button>
      </div>

      {/* 4 KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
              Completion Tim
            </span>
            <div className="w-9 h-9 rounded-xl bg-sky-50 dark:bg-sky-950/50 text-brand-blue dark:text-sky-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" strokeWidth={1.75} />
            </div>
          </div>
          <div className="text-2xl font-extrabold font-mono text-slate-900 dark:text-white mt-2">
            {avgCompletion}%
          </div>
          <div className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
            +8% dibanding bulan lalu (Target 80%)
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
              AE Tersertifikasi
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Award className="w-4 h-4" strokeWidth={1.75} />
            </div>
          </div>
          <div className="text-2xl font-extrabold font-mono text-slate-900 dark:text-white mt-2">
            9/{team.length}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            60% lulus minimal 2 track wajib
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
              Perlu Perhatian / Terlambat
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" strokeWidth={1.75} />
            </div>
          </div>
          <div className="text-2xl font-extrabold font-mono text-amber-600 dark:text-amber-400 mt-2">
            {attnCount} AE
          </div>
          <div className="text-xs text-amber-700 dark:text-amber-300 font-medium mt-1">
            Membutuhkan reminder & coaching
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
              Skor Quiz Rata-rata
            </span>
            <div className="w-9 h-9 rounded-xl bg-violet-50 dark:bg-violet-950/50 text-violet-600 dark:text-violet-400 flex items-center justify-center">
              <Users className="w-4 h-4" strokeWidth={1.75} />
            </div>
          </div>
          <div className="text-2xl font-extrabold font-mono text-slate-900 dark:text-white mt-2">
            {avgQuizScore}/100
          </div>
          <div className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
            Di atas standar kelulusan (80)
          </div>
        </div>
      </div>

      {/* Main 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 8 Columns: Weekly Chart + Team Table */}
        <div className="lg:col-span-8 space-y-6">
          {/* Weekly Completion Recharts Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-6 shadow-xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Tren Completion Mingguan Area Jabo 1 (8 Minggu Terakhir)
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Garis putus-putus menunjukkan target SLA kesiapan komersial Q2 (80%).
                </p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-sky-50 dark:bg-sky-950 text-brand-blue dark:text-sky-300">
                W8: {weekly[weekly.length - 1] || 72}%
              </span>
            </div>

            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 16, left: -16, bottom: 0 }}>
                  <XAxis
                    dataKey="week"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#64748B' }}
                  />
                  <YAxis
                    domain={[0, 100]}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#64748B' }}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <Tooltip
                    formatter={(val: number) => [`${val}%`, 'Completion Tim']}
                    contentStyle={{
                      borderRadius: '12px',
                      border: '1px solid #E2E8F0',
                      fontSize: '12px',
                    }}
                  />
                  <ReferenceLine
                    y={80}
                    stroke="#F5A524"
                    strokeDasharray="4 4"
                    label={{
                      value: 'Target 80%',
                      position: 'right',
                      fill: '#D97706',
                      fontSize: 11,
                    }}
                  />
                  <Bar dataKey="completion" radius={[8, 8, 0, 0]} maxBarSize={42}>
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          index === chartData.length - 1
                            ? '#0B6FD0'
                            : entry.completion >= 70
                            ? '#39A3FF'
                            : '#94A3B8'
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Team Members Table */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setFilterTab('all')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                    filterTab === 'all'
                      ? 'bg-brand-blue text-white'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  Semua ({team.length})
                </button>
                <button
                  onClick={() => setFilterTab('attn')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                    filterTab === 'attn'
                      ? 'bg-amber-500 text-white'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  Perlu Perhatian ({attnCount})
                </button>
                <button
                  onClick={() => setFilterTab('ontrack')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                    filterTab === 'ontrack'
                      ? 'bg-emerald-600 text-white'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  On Track ({team.length - attnCount})
                </button>
              </div>

              <div className="relative w-full sm:w-56">
                <Search
                  className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2"
                  strokeWidth={1.75}
                />
                <input
                  type="text"
                  value={memberSearch}
                  onChange={(e) => setMemberSearch(e.target.value)}
                  placeholder="Cari nama AE..."
                  className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-blue"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-400 bg-slate-50/60 dark:bg-slate-800/40">
                    <th className="py-3 px-4">Account Executive</th>
                    <th className="py-3 px-4">Progres</th>
                    <th className="py-3 px-4">Sertifikasi</th>
                    <th className="py-3 px-4">Skor Quiz</th>
                    <th className="py-3 px-4">Status / Catatan</th>
                    <th className="py-3 px-4 text-right">Tindakan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                  {filteredTeam.map((m) => (
                    <tr
                      key={m.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition"
                    >
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div
                            className="w-8 h-8 rounded-full text-white text-xs font-bold flex items-center justify-center shrink-0"
                            style={{ backgroundColor: m.c }}
                          >
                            {m.initials}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 dark:text-white">
                              {m.name}
                            </div>
                            <div className="text-[11px] text-slate-400">Aktif {m.lastActive}</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 min-w-[130px]">
                        <div className="flex items-center justify-between text-[11px] font-mono font-bold mb-1">
                          <span>{m.prog}%</span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              m.prog >= 80
                                ? 'bg-emerald-500'
                                : m.prog >= 60
                                ? 'bg-brand-blue'
                                : 'bg-amber-500'
                            }`}
                            style={{ width: `${m.prog}%` }}
                          />
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-mono font-semibold text-slate-700 dark:text-slate-300">
                        {m.cert}
                      </td>

                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900 dark:text-white">
                        {m.score}
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                            m.attn
                              ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                              : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                          }`}
                        >
                          {m.note}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          {m.attn ? (
                            <button
                              onClick={() => memberAction(m.name, 'remind')}
                              disabled={m.reminded}
                              className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition ${
                                m.reminded
                                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                                  : 'bg-amber-500 hover:bg-amber-600 text-white shadow-2xs'
                              }`}
                            >
                              <Bell className="w-3 h-3" strokeWidth={2} />
                              {m.reminded ? 'Terkirim' : 'Ingatkan'}
                            </button>
                          ) : (
                            <button
                              onClick={() => memberAction(m.name, 'appreciate')}
                              disabled={m.appreciated}
                              className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition ${
                                m.appreciated
                                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                                  : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs'
                              }`}
                            >
                              <Heart className="w-3 h-3" strokeWidth={2} />
                              {m.appreciated ? 'Diapresiasi' : 'Apresiasi'}
                            </button>
                          )}

                          <button
                            onClick={() => {
                              if (!selectedMembers.includes(m.name)) {
                                setSelectedMembers((prev) => [...prev, m.name]);
                              }
                            }}
                            className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-[11px] font-semibold transition"
                          >
                            + Assign
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right 4 Columns: Assign Task Card + Coaching Insight */}
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-20">
          {/* Assign Task Card */}
          <form
            onSubmit={handleAssignSubmit}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-xs space-y-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-brand-blue dark:text-sky-400">
                  Actionable Enablement
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                  Assign Course / Simulasi ke Tim
                </h3>
              </div>
              <button
                type="button"
                onClick={selectAllNeedAttention}
                className="text-[11px] font-bold text-brand-blue dark:text-sky-400 hover:underline"
              >
                Pilih yang perlu perhatian ({attnCount})
              </button>
            </div>

            {/* Selected Member Chips */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                Penerima Tugas ({selectedMembers.length} AE dipilih)
              </label>
              <div className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 min-h-[56px] flex flex-wrap gap-1.5">
                {selectedMembers.map((name) => (
                  <span
                    key={name}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-brand-blue text-white text-xs font-semibold"
                  >
                    {name}
                    <button
                      type="button"
                      onClick={() => toggleSelectMember(name)}
                      className="hover:text-amber-200"
                    >
                      <X className="w-3 h-3" strokeWidth={2.5} />
                    </button>
                  </span>
                ))}
                <input
                  type="text"
                  value={pickerSearch}
                  onChange={(e) => setPickerSearch(e.target.value)}
                  placeholder="Ketik nama AE..."
                  className="bg-transparent text-xs text-slate-800 dark:text-slate-200 focus:outline-none flex-1 min-w-[110px] py-0.5"
                />
              </div>

              {pickerSuggestions.length > 0 && (
                <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-md p-1.5 space-y-1 max-h-36 overflow-y-auto">
                  {pickerSuggestions.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => {
                        toggleSelectMember(m.name);
                        setPickerSearch('');
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-between"
                    >
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {m.name}
                      </span>
                      <span className="text-[10px] text-slate-400">{m.note}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Course / Task Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                Pilih Kurikulum / Tugas
              </label>
              <select
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-blue"
              >
                {courses.map((c) => (
                  <option key={c.id} value={`Selesaikan Course: ${c.title}`}>
                    Course: {c.title}
                  </option>
                ))}
                <option value="Simulasi Role-Play: Pertahankan Nilai SLA vs Perang Harga">
                  Simulasi Role-Play: Pertahankan Nilai SLA vs Perang Harga
                </option>
                <option value="Lulus Ujian Sertifikasi: Connectivity Associate">
                  Ujian Sertifikasi: Connectivity Associate
                </option>
              </select>
            </div>

            {/* Target Due Date & Reminder */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-brand-blue" strokeWidth={1.75} />
                  Tenggat Waktu
                </label>
                <input
                  type="text"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  Pengingat Otomatis
                </label>
                <select
                  value={reminder}
                  onChange={(e) => setReminder(e.target.value)}
                  className="w-full px-2.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white"
                >
                  <option value="H-2 & Hari H via Inbox + Email">H-2 & Hari H</option>
                  <option value="Setiap Pagi via Inbox">Setiap Pagi</option>
                  <option value="Langsung + CC Team Leader">CC Team Leader</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={assigning || selectedMembers.length === 0}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-brand-blue hover:bg-brand-navy disabled:opacity-50 text-white text-xs font-bold transition shadow-sm"
            >
              <Send className="w-4 h-4" strokeWidth={1.75} />
              {assigning
                ? 'Mengirim Penugasan...'
                : `Assign ke ${selectedMembers.length} Anggota Tim`}
            </button>
          </form>

          {/* Coaching Insight Card */}
          <div className="bg-gradient-to-br from-[#0B1A33] to-[#123059] text-white rounded-2xl p-5 shadow-md space-y-3 border border-white/10">
            <div className="flex items-center gap-2 text-amber-300 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4" strokeWidth={2} />
              AI Coaching Diagnostic
            </div>
            <h4 className="text-sm font-bold leading-snug">
              Topik Paling Sering Meleset Minggu Ini: Tier-III Concurrent Maintainability
            </h4>
            <p className="text-xs text-slate-200 leading-relaxed">
              4 dari 15 AE masih tertukar antara redundansi komponen (N+1) dengan jalur distribusi
              ganda (2N) saat kualifikasi Data Center. Gunakan sesi huddle Jumat pagi untuk
              meninjau Battlecard Data Center Tier-III.
            </p>
            <button
              onClick={() => {
                setSelectedMembers(['Raka Pratama', 'Dimas Wahyu', 'Fajar Nugroho', 'Hendra Wijaya']);
                setTaskTitle('Selesaikan Course: Data Center Tier-III & Colocation');
              }}
              className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-xs font-bold text-white transition"
            >
              <Plus className="w-3.5 h-3.5" strokeWidth={2} />
              Siapkan Remedial ke 4 AE Terkait
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

