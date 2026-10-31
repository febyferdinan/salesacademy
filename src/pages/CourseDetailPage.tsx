import React from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ChevronRight,
  Bookmark,
  Play,
  Check,
  Download,
  Award,
  Sparkles,
  FileText,
} from 'lucide-react';
import { AppShell } from '../components/layout/AppShell';
import { useAcademyStore } from '../store/useAcademyStore';
import { formatTime } from '../lib/utils';

export const CourseDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const {
    courses,
    progress,
    users,
    activeRole,
    toggleBookmark,
    setPreviewDoc,
    setChatOpen,
  } = useAcademyStore();

  const course = courses.find((c) => c.slug === slug || c.id === slug) || courses[0];
  const user = users[activeRole];
  const isSaved = user.savedCourseIds.includes(course.id);

  // Determine each module's status
  const moduleStatuses = course.modules.map((m) => {
    const rec = progress.find((p) => p.courseId === course.id && p.moduleNum === m.n);
    return {
      ...m,
      status: rec?.status || (m.n === 1 ? 'now' : 'todo'),
      watchedSec: rec?.watchedSec || 0,
      score: rec?.score,
      roleplayScore: rec?.roleplayScore,
    };
  });

  const doneCount = moduleStatuses.filter((m) => m.status === 'done').length;
  const activeMod =
    moduleStatuses.find((m) => m.status === 'now') ||
    moduleStatuses.find((m) => m.status === 'todo') ||
    moduleStatuses[0];

  const handleOpenModule = (n: number, isSim?: boolean) => {
    if (isSim) {
      navigate(`/simulator/${course.slug}`);
    } else {
      navigate(`/player/${course.slug}/${n}`);
    }
  };

  return (
    <AppShell title="Courses" subtitle={`${course.category} · ${course.short}`}>
      {/* Breadcrumbs */}
      <div className="flex items-center justify-between flex-wrap gap-3 text-xs">
        <div className="flex items-center gap-1.5 text-muted-custom">
          <Link to="/courses" className="hover:text-la-blue font-semibold">
            Courses
          </Link>
          <ChevronRight className="w-3.5 h-3.5" strokeWidth={1.5} />
          <Link to="/courses" className="hover:text-la-blue font-semibold">
            {course.category}
          </Link>
          <ChevronRight className="w-3.5 h-3.5" strokeWidth={1.5} />
          <b className="text-ink font-bold">{course.short}</b>
        </div>

        <button
          type="button"
          onClick={() => toggleBookmark(course.id)}
          className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-bold transition ${
            isSaved
              ? 'bg-la-ice border-la-blue/40 text-la-blue'
              : 'bg-surface border-line text-ink-2 hover:bg-subtle'
          }`}
        >
          <Bookmark
            className={`w-3.5 h-3.5 ${isSaved ? 'fill-la-blue text-la-blue' : ''}`}
            strokeWidth={1.5}
          />
          <span>{isSaved ? 'Tersimpan' : 'Simpan Course'}</span>
        </button>
      </div>

      {/* Course Header Card */}
      <section className="p-6 sm:p-8 rounded-3xl bg-surface border border-line shadow-card grid md:grid-cols-[240px_1fr] gap-6 items-center">
        <div
          className={`h-44 md:h-full min-h-[176px] rounded-2xl ${course.g} flex items-center justify-center relative overflow-hidden shadow-inner`}
        >
          <button
            type="button"
            onClick={() => handleOpenModule(activeMod.n, activeMod.sim)}
            className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white hover:scale-105 transition"
            aria-label="Mulai atau lanjutkan course"
          >
            <Play className="w-7 h-7 fill-white ml-0.5" strokeWidth={1.5} />
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-3 py-1 rounded-full bg-subtle text-la-blue dark:text-sky-300 text-xs font-bold">
              {course.category}
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-la-amberSoft text-amber-800 text-xs font-bold">
              <Award className="w-3.5 h-3.5" strokeWidth={1.5} />
              <span>Syarat Sertifikasi: {course.cert}</span>
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
            {course.title}
          </h1>
          <p className="text-sm text-ink-2 leading-relaxed">{course.desc}</p>

          <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-line">
            <div className="space-y-1.5" id="course-progress">
              <div className="flex items-center gap-3 text-xs text-muted-custom font-medium">
                <span>{course.modules.length} modul</span>
                <span>•</span>
                <span>±15 menit total</span>
                <span>•</span>
                <span>Target: {course.target}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="grid grid-cols-5 gap-1.5 w-40 h-2">
                  {moduleStatuses.map((m) => (
                    <span
                      key={m.n}
                      className={`rounded-full ${
                        m.status === 'done'
                          ? 'bg-la-green'
                          : m.status === 'now'
                          ? 'bg-la-blue'
                          : 'bg-subtle'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs font-bold text-ink">
                  {doneCount} dari {course.modules.length} modul selesai
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleOpenModule(activeMod.n, activeMod.sim)}
              className="px-5 py-3 rounded-2xl bg-la-blue hover:bg-la-bluePress text-white font-bold text-xs sm:text-sm inline-flex items-center justify-center gap-2 shadow-brand transition shrink-0"
            >
              <Play className="w-4 h-4 fill-white" strokeWidth={1.5} />
              <span>
                {doneCount === course.modules.length
                  ? 'Ulangi Course'
                  : `Lanjutkan Modul ${activeMod.n}`}
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Syllabus + Outcomes Grid */}
      <section className="grid lg:grid-cols-[1.55fr_1fr] gap-6">
        {/* Left: Module List */}
        <div className="space-y-3" id="course-modules">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-extrabold text-ink">Isi Kurikulum &amp; Simulasi</h2>
            <span className="text-xs text-muted-custom">Semua modul terbuka &amp; interaktif</span>
          </div>

          <div className="space-y-3">
            {moduleStatuses.map((m) => {
              const isDone = m.status === 'done';
              const isNow = m.status === 'now';
              return (
                <button
                  key={m.n}
                  type="button"
                  onClick={() => handleOpenModule(m.n, m.sim)}
                  className={`w-full text-left p-4 sm:p-5 rounded-2xl bg-surface border transition flex items-center gap-4 group ${
                    isNow
                      ? 'border-la-blue ring-2 ring-la-blue/15 shadow-card'
                      : 'border-line hover:border-la-blue/40 shadow-xs'
                  }`}
                >
                  {/* Status Circle */}
                  <div
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-sm shrink-0 ${
                      isDone
                        ? 'bg-la-greenSoft text-la-green'
                        : isNow
                        ? 'bg-la-blue text-white shadow-brand'
                        : 'bg-subtle text-muted-custom'
                    }`}
                  >
                    {isDone ? (
                      <Check className="w-5 h-5" strokeWidth={2} />
                    ) : isNow ? (
                      <Play className="w-4 h-4 fill-white ml-0.5" strokeWidth={1.5} />
                    ) : (
                      m.n
                    )}
                  </div>

                  {/* Title & Subtitle */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm sm:text-base font-bold text-ink group-hover:text-la-blue transition">
                        {m.sim ? `Simulasi Role-Play · ` : `Modul ${m.n} · `}
                        {m.title.replace(/^Simulasi:\s*/i, '')}
                      </h4>
                      {m.sim && (
                        <span className="px-2 py-0.5 rounded-full bg-violet-100 dark:bg-violet-950 text-violet-700 dark:text-violet-300 text-[10px] font-extrabold uppercase">
                          Interactive Role-Play
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-custom mt-0.5 truncate">{m.sub}</p>
                  </div>

                  {/* Right Meta */}
                  <div className="text-right shrink-0">
                    <div className="text-xs font-mono font-bold text-ink">{m.dur}</div>
                    <div className="text-[11px] mt-0.5">
                      {isDone ? (
                        <span className="text-la-green font-semibold">
                          Selesai{' '}
                          {m.roleplayScore
                            ? `· Skor ${m.roleplayScore}`
                            : m.score
                            ? `· Skor ${m.score[0]}/${m.score[1]}`
                            : ''}
                        </span>
                      ) : isNow ? (
                        <span className="text-la-blue font-bold">
                          Sedang berjalan {m.watchedSec ? `· ${formatTime(m.watchedSec)}` : ''}
                        </span>
                      ) : (
                        <span className="text-muted-custom">Siap dibuka</span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Outcomes, Supporting Files, Facilitators */}
        <div className="space-y-5">
          {/* Outcomes */}
          <div className="p-6 rounded-3xl bg-surface border border-line shadow-card space-y-3">
            <h3 className="text-base font-extrabold text-ink">Setelah course ini kamu bisa</h3>
            <ul className="space-y-2.5">
              {course.outcomes.map((o, i) => (
                <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-ink-2">
                  <span className="w-5 h-5 rounded-full bg-la-greenSoft text-la-green flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" strokeWidth={2} />
                  </span>
                  <span>{o}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Supporting Files */}
          <div className="p-6 rounded-3xl bg-surface border border-line shadow-card space-y-3">
            <h3 className="text-base font-extrabold text-ink">Materi pendukung</h3>
            <div className="space-y-2.5">
              {course.files.map((f) => (
                <div
                  key={f.id}
                  className="p-3.5 rounded-2xl bg-canvas border border-line flex items-center gap-3"
                >
                  <span
                    className={`px-2.5 py-1.5 rounded-xl text-[11px] font-extrabold font-mono shrink-0 ${
                      f.type === 'PDF'
                        ? 'bg-la-redSoft text-la-red'
                        : 'bg-la-amberSoft text-amber-800'
                    }`}
                  >
                    {f.type}
                  </span>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-ink truncate">{f.name}</h4>
                    <div className="text-[11px] text-muted-custom">{f.meta}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setPreviewDoc({
                        title: f.name,
                        type: 'doc',
                        meta: f.meta,
                        summary: f.summary,
                        sections: f.sections,
                      })
                    }
                    className="p-2 rounded-xl bg-surface hover:bg-la-blue hover:text-white border border-line text-ink-2 transition"
                    title={`Pratinjau & Unduh ${f.name}`}
                  >
                    <Download className="w-4 h-4" strokeWidth={1.5} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Facilitators + Tanya AI */}
          <div className="p-6 rounded-3xl bg-surface border border-line shadow-card space-y-4">
            <h3 className="text-base font-extrabold text-ink">Mentor &amp; Reviewer</h3>
            <div className="space-y-2.5">
              {course.facilitators.map((f) => (
                <div key={f.name} className="flex items-center gap-3">
                  <span className="w-9 h-9 rounded-full bg-la-blue text-white flex items-center justify-center text-xs font-bold shrink-0">
                    {f.initials}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-ink">{f.name}</div>
                    <div className="text-[11px] text-muted-custom">{f.role}</div>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-subtle text-[11px] font-semibold text-ink-2">
                    {f.tag}
                  </span>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() =>
                setChatOpen(true, {
                  activeCourseId: course.id,
                })
              }
              className="w-full py-3 px-4 rounded-2xl bg-subtle hover:bg-la-blue hover:text-white text-la-blue dark:text-sky-300 font-bold text-xs flex items-center justify-center gap-2 transition"
            >
              <Sparkles className="w-4 h-4" strokeWidth={1.5} />
              <span>Tanya AI tentang {course.short}</span>
            </button>
          </div>
        </div>
      </section>
    </AppShell>
  );
};

