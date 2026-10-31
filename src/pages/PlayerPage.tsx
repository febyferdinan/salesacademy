import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import {
  ChevronLeft,
  Play,
  Pause,
  Maximize2,
  Minimize2,
  Check,
  Sparkles,
  Download,
  Info,
  X,
  ArrowRight,
} from 'lucide-react';
import { toast } from 'sonner';
import { useAcademyStore } from '../store/useAcademyStore';
import { formatTime } from '../lib/utils';

export const PlayerPage: React.FC = () => {
  const { courseSlug, moduleNum } = useParams<{ courseSlug: string; moduleNum: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const {
    courses,
    progress,
    saveProgress,
    submitQuiz,
    setChatOpen,
    setPreviewDoc,
  } = useAcademyStore();

  const course = courses.find((c) => c.slug === courseSlug || c.id === courseSlug) || courses[0];
  const modIndex = Math.max(1, Number(moduleNum) || 3);
  const mod =
    course.modules.find((m) => m.n === modIndex) ||
    course.modules[2] ||
    course.modules[0];

  // If this module is a roleplay simulation, redirect to simulator
  useEffect(() => {
    if (mod.sim) {
      navigate(`/simulator/${course.slug}`, { replace: true });
    }
  }, [mod.sim, course.slug, navigate]);

  const progRec = progress.find((p) => p.courseId === course.id && p.moduleNum === mod.n);
  const initialT = Number(searchParams.get('t')) || progRec?.watchedSec || 0;

  const [currentTime, setCurrentTime] = useState<number>(
    Math.min(mod.durationSec, Math.max(0, initialT))
  );
  const [playing, setPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1);
  const [ccEnabled, setCcEnabled] = useState<boolean>(true);
  const [hdEnabled, setHdEnabled] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'take' | 'trans' | 'mat'>('take');

  // Quick check modal state
  const [quizOpen, setQuizOpen] = useState<boolean>(false);
  const [quizIndex, setQuizIndex] = useState<number>(0);
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [quizResult, setQuizResult] = useState<{
    score: number;
    total: number;
    passed: boolean;
    pointsAwarded: number;
    wrongTopics: { topic: string; t: number; question: string }[];
  } | null>(null);

  const videoBoxRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  // Sync when route changes
  useEffect(() => {
    const tQuery = searchParams.get('t');
    if (tQuery !== null) {
      setCurrentTime(Math.min(mod.durationSec, Math.max(0, Number(tQuery))));
    } else {
      const saved = progress.find((p) => p.courseId === course.id && p.moduleNum === mod.n);
      setCurrentTime(saved?.watchedSec && saved.watchedSec < mod.durationSec ? saved.watchedSec : 0);
    }
    setPlaying(false);
    setQuizOpen(false);
    setQuizResult(null);
  }, [course.id, mod.n, mod.durationSec, searchParams]);

  // Playback interval timer
  useEffect(() => {
    if (!playing) return;
    const interval = setInterval(() => {
      setCurrentTime((prev) => {
        const next = prev + 0.1 * speed;
        if (next >= mod.durationSec) {
          setPlaying(false);
          saveProgress(course.id, mod.n, mod.durationSec);
          toast.success('Video selesai! Saatnya uji pemahaman lewat Quick Check.');
          setTimeout(() => {
            if (mod.quiz.length > 0) {
              setQuizIndex(0);
              setQuizAnswers([]);
              setQuizResult(null);
              setQuizOpen(true);
            }
          }, 500);
          return mod.durationSec;
        }
        return next;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [playing, speed, mod.durationSec, mod.quiz.length, course.id, mod.n, saveProgress]);

  // Keyboard shortcuts
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (quizOpen) return;
      if (/INPUT|TEXTAREA|SELECT/.test((e.target as HTMLElement)?.tagName || '')) return;
      if (e.key === ' ') {
        e.preventDefault();
        setPlaying((p) => !p);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        setCurrentTime((t) => Math.min(mod.durationSec, t + 5));
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setCurrentTime((t) => Math.max(0, t - 5));
      } else if (e.key.toLowerCase() === 'f') {
        e.preventDefault();
        toggleFullscreen();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [quizOpen, mod.durationSec]);

  // Active chapter & subtitle computation
  const activeChapterIndex = mod.chapters.reduce(
    (acc, ch, idx) => (currentTime >= ch.t ? idx : acc),
    0
  );
  const activeChapter = mod.chapters[activeChapterIndex] || mod.chapters[0];
  const activeSubtitle = mod.subs.reduce(
    (acc, sub) => (currentTime >= sub.t ? sub.text : acc),
    mod.subs[0]?.text || ''
  );

  const handleSeekClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!timelineRef.current) return;
    const rect = timelineRef.current.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    const targetSec = ratio * mod.durationSec;
    setCurrentTime(targetSec);
    saveProgress(course.id, mod.n, targetSec);
  };

  const toggleFullscreen = () => {
    if (!videoBoxRef.current) return;
    if (!document.fullscreenElement) {
      videoBoxRef.current.requestFullscreen?.().catch(() => {
        setIsFullscreen((v) => !v);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const cycleSpeed = () => {
    const speeds = [1, 1.25, 1.5, 2];
    const next = speeds[(speeds.indexOf(speed) + 1) % speeds.length];
    setSpeed(next);
  };

  const openQuizModal = () => {
    setPlaying(false);
    setQuizIndex(0);
    setQuizAnswers([]);
    setQuizResult(null);
    setQuizOpen(true);
  };

  const handleQuizSubmit = async () => {
    const res = await submitQuiz(course.id, mod.n, quizAnswers);
    setQuizResult(res);
    if (res.passed && res.pointsAwarded > 0) {
      toast.success(`Selamat! Modul ${mod.n} selesai. Kamu mendapat +${res.pointsAwarded} poin!`);
    }
  };

  const doneModulesCount = progress.filter(
    (p) => p.courseId === course.id && p.status === 'done'
  ).length;
  const coursePct = Math.round((doneModulesCount / Math.max(1, course.modules.length)) * 100);

  return (
    <div className="min-h-screen bg-canvas text-ink pb-24">
      {/* Top Focus Header */}
      <header className="sticky top-0 z-30 bg-surface/90 backdrop-blur-md border-b border-line px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
        <Link
          to={`/course/${course.slug}`}
          onClick={() => saveProgress(course.id, mod.n, currentTime)}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-canvas hover:bg-subtle border border-line text-xs font-bold text-ink transition"
        >
          <ChevronLeft className="w-4 h-4" strokeWidth={1.5} />
          <span className="hidden sm:inline">Kembali ke course</span>
        </Link>

        <div className="text-center min-w-0 flex-1">
          <small className="block text-[11px] font-semibold text-muted-custom truncate">
            {course.short} · Modul {mod.n} dari {course.modules.length}
          </small>
          <b className="text-sm sm:text-base font-extrabold text-ink truncate block">{mod.title}</b>
        </div>

        <div className="flex items-center gap-2.5 text-xs font-mono font-bold text-ink shrink-0">
          <div className="hidden sm:grid grid-cols-5 gap-1 w-24 h-2">
            {course.modules.map((m) => {
              const isDone = progress.some(
                (p) => p.courseId === course.id && p.moduleNum === m.n && p.status === 'done'
              );
              return (
                <span
                  key={m.n}
                  className={`rounded-full ${isDone ? 'bg-la-green' : m.n === mod.n ? 'bg-la-blue' : 'bg-subtle'}`}
                />
              );
            })}
          </div>
          <span>{coursePct}%</span>
        </div>
      </header>

      {/* Main Player 2-Column Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6 grid lg:grid-cols-[1.65fr_1fr] gap-6">
        {/* Left Column: Video Stage + Tabs */}
        <div className="space-y-5">
          {/* Interactive Procedural Motion Video Canvas */}
          <div
            ref={videoBoxRef}
            onDoubleClick={toggleFullscreen}
            className={`relative rounded-3xl overflow-hidden navy-gradient text-white shadow-2xl border border-white/10 flex flex-col justify-between select-none ${
              isFullscreen ? 'fixed inset-0 z-50 rounded-none' : 'aspect-video min-h-[300px]'
            } ${!hdEnabled ? 'opacity-95 contrast-95' : ''}`}
          >
            {/* Animated Glow Mesh */}
            <div
              className="absolute w-96 h-96 rounded-full bg-la-sky/25 blur-3xl pointer-events-none transition-transform duration-700"
              style={{
                transform: `translate(${activeChapterIndex * 24}px, ${activeChapterIndex * 12}px)`,
              }}
            />

            {/* Scene Slide Content */}
            <div className="relative z-10 p-6 sm:p-10 flex-1 flex flex-col justify-center max-w-2xl space-y-4">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full glass-pill text-xs font-bold text-sky-200">
                  Bab {activeChapterIndex + 1} · {activeChapter?.title}
                </span>
                <span className="text-[11px] font-mono text-slate-300">
                  {hdEnabled ? '1080p HD' : '480p Data Saver'}
                </span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                {activeChapter?.head}
              </h2>

              {/* Interactive Animated Architecture Tiles */}
              <div className="grid grid-cols-6 gap-2.5 pt-2 max-w-md">
                {Array.from({ length: 6 }).map((_, k) => {
                  const activeTiles = activeChapter?.tiles || [0, 1, 2];
                  const highlightTile =
                    activeTiles[Math.floor(currentTime / 3) % Math.max(1, activeTiles.length)];
                  const isHi = k === highlightTile;
                  const isOn = activeTiles.includes(k);
                  return (
                    <div
                      key={k}
                      className={`h-10 sm:h-12 rounded-2xl transition-all duration-300 border ${
                        isHi
                          ? 'bg-la-sky border-white shadow-lg scale-105'
                          : isOn
                          ? 'bg-white/20 border-white/30'
                          : 'bg-white/5 border-white/10'
                      }`}
                    />
                  );
                })}
              </div>
            </div>

            {/* Synchronized Closed Caption (CC) */}
            {ccEnabled && activeSubtitle && (
              <div className="relative z-10 mx-auto px-4 mb-2 max-w-2xl text-center">
                <span className="inline-block px-4 py-1.5 rounded-xl bg-black/65 backdrop-blur-xs text-xs sm:text-sm font-medium text-white shadow">
                  {activeSubtitle}
                </span>
              </div>
            )}

            {/* Video Controls Bar */}
            <div className="relative z-10 px-5 pb-4 pt-2 bg-gradient-to-t from-black/80 via-black/40 to-transparent space-y-3">
              {/* Segmented Chapter Timeline */}
              <div
                ref={timelineRef}
                onClick={handleSeekClick}
                role="slider"
                aria-label="Posisi video"
                aria-valuemin={0}
                aria-valuemax={mod.durationSec}
                aria-valuenow={Math.floor(currentTime)}
                tabIndex={0}
                className="relative h-2.5 flex items-center gap-1 cursor-pointer group"
              >
                {mod.chapters.map((ch, idx) => {
                  const nextT = mod.chapters[idx + 1] ? mod.chapters[idx + 1].t : mod.durationSec;
                  const segDur = Math.max(1, nextT - ch.t);
                  const fillPct = Math.min(
                    100,
                    Math.max(0, ((currentTime - ch.t) / segDur) * 100)
                  );
                  return (
                    <div
                      key={idx}
                      style={{ flex: segDur }}
                      className="h-1.5 group-hover:h-2.5 bg-white/25 rounded-full overflow-hidden transition-all"
                    >
                      <div
                        className="h-full bg-la-sky rounded-full"
                        style={{ width: `${fillPct}%` }}
                      />
                    </div>
                  );
                })}
              </div>

              {/* Control Buttons */}
              <div className="flex items-center gap-3 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => {
                    if (!playing && currentTime >= mod.durationSec - 0.5) {
                      setCurrentTime(0);
                    }
                    setPlaying(!playing);
                  }}
                  aria-label={playing ? 'Jeda' : 'Putar'}
                  className="w-9 h-9 rounded-full bg-white text-la-navy flex items-center justify-center hover:scale-105 transition"
                >
                  {playing ? (
                    <Pause className="w-4 h-4 fill-la-navy" strokeWidth={1.5} />
                  ) : (
                    <Play className="w-4 h-4 fill-la-navy ml-0.5" strokeWidth={1.5} />
                  )}
                </button>

                <span className="font-mono text-xs text-slate-200">
                  {formatTime(currentTime)} / {formatTime(mod.durationSec)}
                </span>

                <div className="flex-1" />

                <button
                  type="button"
                  onClick={cycleSpeed}
                  className="px-2.5 py-1 rounded-lg bg-white/15 hover:bg-white/25 font-mono text-xs transition"
                >
                  {speed}x
                </button>

                <button
                  type="button"
                  onClick={() => setCcEnabled(!ccEnabled)}
                  className={`px-2.5 py-1 rounded-lg font-mono text-xs transition ${
                    ccEnabled ? 'bg-la-blue text-white' : 'bg-white/15 text-slate-300'
                  }`}
                >
                  CC
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const next = !hdEnabled;
                    setHdEnabled(next);
                    toast.info(next ? 'Kualitas HD aktif.' : 'Mode hemat data (SD) aktif.');
                  }}
                  className={`hidden sm:inline-block px-2.5 py-1 rounded-lg font-mono text-xs transition ${
                    hdEnabled ? 'bg-la-blue text-white' : 'bg-white/15 text-slate-300'
                  }`}
                >
                  {hdEnabled ? 'HD' : 'SD'}
                </button>

                <button
                  type="button"
                  onClick={toggleFullscreen}
                  aria-label="Layar penuh"
                  className="p-1.5 rounded-lg bg-white/15 hover:bg-white/25 transition"
                >
                  {isFullscreen ? (
                    <Minimize2 className="w-4 h-4" strokeWidth={1.5} />
                  ) : (
                    <Maximize2 className="w-4 h-4" strokeWidth={1.5} />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Takeaways / Transcript / Materials Tabs */}
          <div className="flex items-center gap-2 border-b border-line pb-2">
            {[
              { k: 'take', label: 'Key Takeaway' },
              { k: 'trans', label: 'Transkrip Interaktif' },
              { k: 'mat', label: 'Materi Pendukung' },
            ].map((t) => (
              <button
                key={t.k}
                type="button"
                onClick={() => setActiveTab(t.k as 'take' | 'trans' | 'mat')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                  activeTab === t.k
                    ? 'bg-la-blue text-white shadow-brand'
                    : 'bg-surface border border-line text-ink-2 hover:bg-subtle'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === 'take' && (
            <div className="grid sm:grid-cols-3 gap-4">
              {mod.takeaways.map((tk, i) => (
                <div
                  key={i}
                  className="p-5 rounded-2xl bg-surface border border-line shadow-xs space-y-2"
                >
                  <span className="w-7 h-7 rounded-lg bg-la-ice dark:bg-slate-800 text-la-blue font-mono font-bold text-xs flex items-center justify-center">
                    {i + 1}
                  </span>
                  <h4 className="text-sm font-bold text-ink">{tk.title}</h4>
                  <p className="text-xs text-muted-custom leading-relaxed">{tk.body}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'trans' && (
            <div className="p-5 rounded-3xl bg-surface border border-line shadow-xs space-y-1.5 max-h-80 overflow-y-auto">
              {mod.subs.map((sub, i) => {
                const nextSubT = mod.subs[i + 1] ? mod.subs[i + 1].t : mod.durationSec;
                const isActive = currentTime >= sub.t && currentTime < nextSubT;
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      setCurrentTime(sub.t);
                      setPlaying(true);
                    }}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs flex items-start gap-3 transition ${
                      isActive
                        ? 'bg-la-ice dark:bg-slate-800 text-la-blue dark:text-sky-300 font-bold'
                        : 'hover:bg-subtle/60 text-ink-2'
                    }`}
                  >
                    <time className="font-mono text-[11px] text-la-blue shrink-0 mt-0.5">
                      {formatTime(sub.t)}
                    </time>
                    <span className="flex-1">{sub.text}</span>
                  </button>
                );
              })}
            </div>
          )}

          {activeTab === 'mat' && (
            <div className="p-5 rounded-3xl bg-surface border border-line shadow-xs space-y-3">
              {course.files.map((f) => (
                <div
                  key={f.id}
                  className="p-3.5 rounded-2xl bg-canvas border border-line flex items-center gap-3"
                >
                  <span className="px-2.5 py-1.5 rounded-xl bg-la-redSoft text-la-red text-xs font-mono font-bold">
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
                    className="px-3 py-2 rounded-xl bg-la-blue text-white text-xs font-bold inline-flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" strokeWidth={1.5} />
                    <span>Unduh</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Chapters + Quick Check CTA + Ask AI */}
        <div className="space-y-5">
          {/* Chapter List */}
          <div className="p-6 rounded-3xl bg-surface border border-line shadow-card space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold text-ink">Bab dalam video</h3>
              <span className="text-xs text-muted-custom">{mod.chapters.length} bab</span>
            </div>

            <div className="space-y-1.5">
              {mod.chapters.map((ch, idx) => {
                const isCurrent = idx === activeChapterIndex;
                const isDone = idx < activeChapterIndex || progRec?.status === 'done';
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setCurrentTime(ch.t);
                      setPlaying(true);
                    }}
                    className={`w-full text-left px-3.5 py-3 rounded-2xl flex items-center gap-3 text-xs transition ${
                      isCurrent
                        ? 'bg-la-ice dark:bg-slate-800 text-la-blue dark:text-sky-300 font-bold'
                        : 'hover:bg-subtle/60 text-ink-2'
                    }`}
                  >
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                        isDone
                          ? 'bg-la-greenSoft text-la-green'
                          : isCurrent
                          ? 'bg-la-blue text-white'
                          : 'bg-subtle text-muted-custom'
                      }`}
                    >
                      {isDone ? (
                        <Check className="w-3.5 h-3.5" strokeWidth={2} />
                      ) : (
                        <Play className="w-3 h-3 fill-current" strokeWidth={1.5} />
                      )}
                    </span>
                    <span className="flex-1 truncate">{ch.title}</span>
                    <time className="font-mono text-[11px] text-muted-custom">
                      {formatTime(ch.t)}
                    </time>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Check Quiz Card */}
          <div className="p-6 rounded-3xl hero-gradient text-white shadow-brand space-y-3">
            <small className="text-[11px] font-bold uppercase tracking-wider text-sky-200">
              Berikutnya
            </small>
            <h3 className="text-xl font-extrabold">Quick check: {mod.quiz.length} soal</h3>
            <p className="text-xs text-white/90 leading-relaxed">
              ±2 menit. Simulasi percakapan customer tentang {mod.title.toLowerCase()}. Raih +120
              poin saat lulus!
            </p>
            <button
              type="button"
              onClick={openQuizModal}
              className="w-full py-3 rounded-2xl bg-white text-la-navy hover:bg-sky-50 font-extrabold text-xs sm:text-sm shadow transition"
            >
              Lanjut ke Quick Check
            </button>
            <button
              type="button"
              onClick={async () => {
                await saveProgress(course.id, mod.n, currentTime);
                toast.success(
                  `Progress disimpan di ${formatTime(currentTime)}. Lanjutkan kapan saja dari dashboard.`
                );
                navigate('/dashboard');
              }}
              className="w-full py-2 text-xs font-semibold text-sky-100 hover:text-white underline"
            >
              Simpan &amp; keluar ke Dashboard
            </button>
          </div>

          {/* Ask Tanya AI Card */}
          <button
            type="button"
            onClick={() =>
              setChatOpen(true, {
                activeCourseId: course.id,
                activeModuleNum: mod.n,
                videoTimestamp: Math.floor(currentTime),
              })
            }
            className="w-full p-5 rounded-3xl bg-surface border border-line hover:border-la-blue/40 shadow-card flex items-center gap-3.5 text-left transition"
          >
            <div className="w-11 h-11 rounded-2xl bg-la-ice dark:bg-slate-800 text-la-blue flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" strokeWidth={1.5} />
            </div>
            <div className="flex-1 min-w-0">
              <b className="text-sm font-bold text-ink block">Masih bingung dengan bab ini?</b>
              <span className="text-xs text-muted-custom">
                Tanya AI tentang “{activeChapter?.title}”
              </span>
            </div>
            <ArrowRight className="w-4 h-4 text-la-blue shrink-0" strokeWidth={1.5} />
          </button>
        </div>
      </div>

      {/* Quick Check Quiz Modal */}
      {quizOpen && (
        <div
          onClick={() => setQuizOpen(false)}
          className="fixed inset-0 z-50 bg-la-navy/65 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xl rounded-3xl bg-surface border border-line p-6 sm:p-8 shadow-2xl space-y-5"
            role="dialog"
            aria-modal="true"
          >
            {!quizResult ? (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-muted-custom">
                    Quick check · Soal {quizIndex + 1} dari {mod.quiz.length}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuizOpen(false)}
                    className="p-1.5 rounded-xl hover:bg-subtle text-muted-custom"
                  >
                    <X className="w-5 h-5" strokeWidth={1.5} />
                  </button>
                </div>

                {/* Progress Bar */}
                <div className="grid grid-cols-4 gap-1.5 h-1.5">
                  {mod.quiz.map((_, idx) => (
                    <span
                      key={idx}
                      className={`rounded-full ${idx <= quizIndex ? 'bg-la-blue' : 'bg-subtle'}`}
                    />
                  ))}
                </div>

                <h3 className="text-base sm:text-lg font-extrabold text-ink leading-snug">
                  {mod.quiz[quizIndex]?.q}
                </h3>

                <div className="space-y-2.5">
                  {mod.quiz[quizIndex]?.opts.map((opt, k) => {
                    const selected = quizAnswers[quizIndex] === k;
                    return (
                      <button
                        key={k}
                        type="button"
                        onClick={() => {
                          const next = [...quizAnswers];
                          next[quizIndex] = k;
                          setQuizAnswers(next);
                        }}
                        className={`w-full text-left p-4 rounded-2xl border flex items-center gap-3.5 text-xs sm:text-sm font-medium transition ${
                          selected
                            ? 'bg-la-ice dark:bg-slate-800 border-la-blue text-ink font-bold'
                            : 'bg-canvas border-line text-ink-2 hover:border-la-blue/40'
                        }`}
                      >
                        <span
                          className={`w-7 h-7 rounded-lg font-mono text-xs font-bold flex items-center justify-center shrink-0 ${
                            selected
                              ? 'bg-la-blue text-white'
                              : 'bg-surface border border-line text-muted-custom'
                          }`}
                        >
                          {'ABCD'[k]}
                        </span>
                        <span className="flex-1">{opt}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-line">
                  <span className="text-xs text-muted-custom">
                    Lulus minimal {Math.ceil(mod.quiz.length * 0.75)} dari {mod.quiz.length} benar
                  </span>
                  <div className="flex items-center gap-2">
                    {quizIndex > 0 && (
                      <button
                        type="button"
                        onClick={() => setQuizIndex((i) => i - 1)}
                        className="px-4 py-2.5 rounded-xl border border-line text-xs font-bold text-ink-2 hover:bg-subtle"
                      >
                        Sebelumnya
                      </button>
                    )}
                    <button
                      type="button"
                      disabled={quizAnswers[quizIndex] === undefined}
                      onClick={() => {
                        if (quizIndex < mod.quiz.length - 1) {
                          setQuizIndex((i) => i + 1);
                        } else {
                          handleQuizSubmit();
                        }
                      }}
                      className="px-5 py-2.5 rounded-xl bg-la-blue hover:bg-la-bluePress disabled:opacity-40 text-white text-xs font-bold shadow-brand transition"
                    >
                      {quizIndex === mod.quiz.length - 1 ? 'Lihat Hasil' : 'Berikutnya'}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              /* Quiz Result View with SVG Score Ring */
              <div className="space-y-5 text-center">
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setQuizOpen(false)}
                    className="p-1.5 rounded-xl hover:bg-subtle text-muted-custom"
                  >
                    <X className="w-5 h-5" strokeWidth={1.5} />
                  </button>
                </div>

                <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
                  <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                    <circle
                      cx="50"
                      cy="50"
                      r="44"
                      fill="none"
                      stroke="#EAF3FD"
                      strokeWidth="8"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="44"
                      fill="none"
                      stroke={quizResult.passed ? '#0B6FD0' : '#F5A524'}
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={`${(quizResult.score / quizResult.total) * 276} 276`}
                    />
                  </svg>
                  <b className="absolute text-2xl font-extrabold font-mono text-ink">
                    {quizResult.score}/{quizResult.total}
                  </b>
                </div>

                <div>
                  <h2 className="text-2xl font-extrabold text-ink">
                    {quizResult.passed ? `Modul ${mod.n} Selesai!` : 'Hampir Lulus'}
                  </h2>
                  <p className="text-xs sm:text-sm text-muted-custom mt-1">
                    {quizResult.passed
                      ? `Kamu sudah menguasai materi ${mod.title} dengan sangat baik.`
                      : 'Tonton ulang bagian yang terlewat di bawah ini, lalu coba lagi.'}
                  </p>
                </div>

                {quizResult.passed && (
                  <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-subtle/60 border border-line">
                    <div>
                      <b className="text-lg font-extrabold font-mono text-la-blue">+120</b>
                      <span className="block text-[11px] text-muted-custom">poin diraih</span>
                    </div>
                    <div>
                      <b className="text-lg font-extrabold font-mono text-ink">
                        {doneModulesCount}/{course.modules.length}
                      </b>
                      <span className="block text-[11px] text-muted-custom">modul selesai</span>
                    </div>
                    <div>
                      <b className="text-lg font-extrabold font-mono text-la-green">Lulus</b>
                      <span className="block text-[11px] text-muted-custom">{course.cert}</span>
                    </div>
                  </div>
                )}

                {quizResult.wrongTopics.length > 0 && (
                  <div className="space-y-2 text-left">
                    <div className="text-xs font-bold text-ink">Bagian untuk ditinjau ulang:</div>
                    {quizResult.wrongTopics.map((wt, i) => (
                      <div
                        key={i}
                        className="p-3 rounded-2xl bg-canvas border border-line flex items-center justify-between gap-3"
                      >
                        <div className="flex items-start gap-2.5 min-w-0">
                          <Info className="w-4 h-4 text-la-amber shrink-0 mt-0.5" strokeWidth={1.5} />
                          <div className="min-w-0">
                            <b className="text-xs font-bold text-ink block truncate">{wt.topic}</b>
                            <span className="text-[11px] text-muted-custom">
                              Dijelaskan pada menit {formatTime(wt.t)}
                            </span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setQuizOpen(false);
                            setCurrentTime(wt.t);
                            setPlaying(true);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-subtle hover:bg-la-blue hover:text-white text-la-blue text-xs font-bold shrink-0 transition"
                        >
                          Tonton {formatTime(wt.t)}
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-end gap-2.5 pt-2">
                  {quizResult.passed ? (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          setQuizOpen(false);
                          navigate('/dashboard');
                        }}
                        className="px-4 py-2.5 rounded-xl border border-line text-xs font-bold text-ink-2 hover:bg-subtle"
                      >
                        Ke Dashboard
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setQuizOpen(false);
                          const nextMod = course.modules.find((m) => m.n === mod.n + 1);
                          if (nextMod) {
                            if (nextMod.sim) navigate(`/simulator/${course.slug}`);
                            else navigate(`/player/${course.slug}/${nextMod.n}`);
                          } else {
                            navigate(`/course/${course.slug}`);
                          }
                        }}
                        className="px-5 py-2.5 rounded-xl bg-la-blue hover:bg-la-bluePress text-white text-xs font-bold shadow-brand"
                      >
                        {course.modules.find((m) => m.n === mod.n + 1)
                          ? `Lanjut ke Modul ${mod.n + 1}`
                          : 'Kembali ke Course'}
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={openQuizModal}
                      className="px-5 py-2.5 rounded-xl bg-la-blue hover:bg-la-bluePress text-white text-xs font-bold shadow-brand"
                    >
                      Ulangi Quick Check
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

