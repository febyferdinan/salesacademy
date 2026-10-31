import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ChevronLeft,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Award,
  Building2,
  UserCheck,
  ArrowRight,
  RotateCcw,
} from 'lucide-react';
import { toast } from 'sonner';
import { AppShell } from '../components/layout/AppShell';
import { useAcademyStore } from '../store/useAcademyStore';

export const RoleplaySimulatorPage: React.FC = () => {
  const { courseSlug } = useParams<{ courseSlug: string }>();
  const navigate = useNavigate();
  const { courses, submitRoleplay, setChatOpen } = useAcademyStore();

  const course = courses.find((c) => c.slug === courseSlug || c.id === courseSlug) || courses[0];
  const simMod = course.modules.find((m) => m.sim) || course.modules[course.modules.length - 1];
  const rp = simMod.roleplay || courses[0].modules[4].roleplay!;

  const [stepIdx, setStepIdx] = useState(0);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [revealed, setRevealed] = useState(false);
  const [finalResult, setFinalResult] = useState<{
    avgScore: number;
    passed: boolean;
    pointsAwarded: number;
  } | null>(null);

  const currentTurn = rp.turns[stepIdx];
  const currentPickedOption = currentTurn?.options.find(
    (o) => o.id === selectedIds[stepIdx]
  );

  const handleSelectOption = (optionId: string) => {
    if (revealed) return;
    const next = [...selectedIds];
    next[stepIdx] = optionId;
    setSelectedIds(next);
    setRevealed(true);
  };

  const handleNextTurn = async () => {
    if (stepIdx < rp.turns.length - 1) {
      setStepIdx((i) => i + 1);
      setRevealed(false);
    } else {
      const res = await submitRoleplay(course.id, simMod.n, selectedIds);
      setFinalResult(res);
      if (res.passed) {
        toast.success(
          `Simulasi Role-Play Lulus (Skor ${res.avgScore}/100)! +${res.pointsAwarded || 150} poin.`
        );
      }
    }
  };

  const handleRestart = () => {
    setStepIdx(0);
    setSelectedIds([]);
    setRevealed(false);
    setFinalResult(null);
  };

  return (
    <AppShell
      title={`Simulasi Role-Play · ${course.short}`}
      subtitle={`${rp.customerCompany} · ${rp.industry}`}
    >
      {/* Top Bar */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <Link
          to={`/course/${course.slug}`}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-surface border border-line text-xs font-bold text-ink hover:bg-subtle transition"
        >
          <ChevronLeft className="w-4 h-4" strokeWidth={1.5} />
          <span>Kembali ke Course {course.short}</span>
        </Link>

        <button
          type="button"
          onClick={() => setChatOpen(true, { activeCourseId: course.id })}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-la-ice dark:bg-slate-800 text-la-blue text-xs font-bold hover:bg-la-blue hover:text-white transition"
        >
          <Sparkles className="w-4 h-4" strokeWidth={1.5} />
          <span>Minta Petunjuk Tanya AI</span>
        </button>
      </div>

      {/* Customer Account Brief Banner */}
      <section className="p-6 rounded-3xl navy-gradient text-white shadow-brand grid md:grid-cols-3 gap-4 items-center">
        <div className="md:col-span-2 space-y-1.5">
          <div className="flex items-center gap-2 text-xs text-sky-300 font-bold">
            <Building2 className="w-4 h-4" strokeWidth={1.5} />
            <span>{rp.customerCompany} ({rp.industry})</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold">{simMod.title}</h2>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">{rp.objective}</p>
        </div>
        <div className="p-4 rounded-2xl bg-white/10 border border-white/15 text-xs space-y-1">
          <div className="text-sky-200 font-semibold">Potensi Nilai Kontrak:</div>
          <div className="text-base font-extrabold font-mono text-white">{rp.dealSize}</div>
          <div className="text-[11px] text-slate-300">
            Babak {stepIdx + 1} dari {rp.turns.length} · Ambang Lulus: Skor ≥ 75
          </div>
        </div>
      </section>

      {!finalResult ? (
        <section className="p-6 sm:p-8 rounded-3xl bg-surface border border-line shadow-card space-y-6">
          {/* Progress */}
          <div className="flex items-center justify-between text-xs font-bold text-muted-custom">
            <span>
              Skenario Percakapan {stepIdx + 1} dari {rp.turns.length}
            </span>
            <span> Konteks: {currentTurn.situation}</span>
          </div>

          {/* Customer Dialogue Bubble */}
          <div className="p-5 sm:p-6 rounded-3xl bg-canvas border border-line flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-la-navy text-white flex items-center justify-center font-extrabold text-sm shrink-0">
              <UserCheck className="w-6 h-6 text-sky-300" strokeWidth={1.5} />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <b className="text-sm font-extrabold text-ink">{currentTurn.customerSpeaker}</b>
                <span className="px-2.5 py-0.5 rounded-full bg-subtle text-[11px] font-semibold text-ink-2">
                  {currentTurn.customerRole}
                </span>
              </div>
              <blockquote className="text-sm sm:text-base font-medium text-ink leading-relaxed italic">
                {currentTurn.customerQuote}
              </blockquote>
            </div>
          </div>

          {/* AE Response Choices */}
          <div className="space-y-3">
            <div className="text-xs font-extrabold uppercase tracking-wider text-muted-custom">
              Pilih Respons Terbaikmu sebagai Account Executive Lintasarta:
            </div>

            {currentTurn.options.map((opt, idx) => {
              const isSelected = selectedIds[stepIdx] === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => handleSelectOption(opt.id)}
                  className={`w-full text-left p-4 sm:p-5 rounded-2xl border transition flex items-start gap-3.5 ${
                    isSelected
                      ? opt.score >= 80
                        ? 'bg-la-greenSoft/60 border-la-green text-ink'
                        : 'bg-la-amberSoft/70 border-la-amber text-ink'
                      : 'bg-canvas border-line hover:border-la-blue/50 text-ink-2'
                  }`}
                >
                  <span className="w-7 h-7 rounded-lg bg-surface border border-line font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {'ABC'[idx]}
                  </span>
                  <div className="flex-1 space-y-2">
                    <p className="text-xs sm:text-sm font-medium leading-relaxed text-ink">
                      {opt.text}
                    </p>
                    {revealed && isSelected && (
                      <div className="pt-2 border-t border-line/70 space-y-1.5 text-xs">
                        <div className="flex items-center gap-2 font-bold">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[11px] ${
                              opt.score >= 80
                                ? 'bg-la-green text-white'
                                : 'bg-la-amber text-la-navy'
                            }`}
                          >
                            {opt.tag} · Skor {opt.score}/100
                          </span>
                        </div>
                        <p className="font-semibold text-ink">{opt.feedback}</p>
                        <p className="text-muted-custom italic">
                          Reaksi Customer: {opt.customerReaction}
                        </p>
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {revealed && currentPickedOption && (
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={handleNextTurn}
                className="px-6 py-3 rounded-2xl bg-la-blue hover:bg-la-bluePress text-white font-bold text-xs sm:text-sm inline-flex items-center gap-2 shadow-brand transition"
              >
                <span>
                  {stepIdx < rp.turns.length - 1
                    ? 'Lanjut ke Respons Customer Berikutnya'
                    : 'Selesaikan Simulasi & Lihat Nilai'}
                </span>
                <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
              </button>
            </div>
          )}
        </section>
      ) : (
        /* Final Simulation Scorecard */
        <section className="p-8 rounded-3xl bg-surface border border-line shadow-card text-center max-w-2xl mx-auto space-y-5">
          <div
            className={`w-20 h-20 rounded-3xl mx-auto flex items-center justify-center ${
              finalResult.passed
                ? 'bg-la-greenSoft text-la-green'
                : 'bg-la-amberSoft text-la-amber'
            }`}
          >
            {finalResult.passed ? (
              <CheckCircle2 className="w-10 h-10" strokeWidth={1.5} />
            ) : (
              <AlertTriangle className="w-10 h-10" strokeWidth={1.5} />
            )}
          </div>

          <div className="space-y-1">
            <span className="px-3 py-1 rounded-full bg-subtle text-la-blue text-xs font-bold">
              Evaluasi Consultative Selling
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-ink pt-1">
              Skor Simulasi: {finalResult.avgScore} / 100
            </h2>
            <p className="text-sm text-muted-custom max-w-md mx-auto">
              {finalResult.passed
                ? `Luar biasa! Kamu berhasil meyakinkan jajaran pengambil keputusan di ${rp.customerCompany} dengan pendekatan berbasis dampak bisnis dan SLA.`
                : 'Kamu masih terjebak pada perang harga atau klaim teknis. Ulangi simulasi dan pilih pendekatan berbasis kerugian downtime & ROI.'}
            </p>
          </div>

          {finalResult.passed && (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-la-ice dark:bg-slate-800 text-la-blue text-xs font-extrabold">
              <Award className="w-4 h-4" strokeWidth={1.5} />
              <span>+150 Poin Leaderboard · Modul Simulasi Selesai</span>
            </div>
          )}

          <div className="flex items-center justify-center gap-3 pt-3">
            <button
              type="button"
              onClick={handleRestart}
              className="px-5 py-2.5 rounded-xl border border-line text-xs font-bold text-ink-2 hover:bg-subtle inline-flex items-center gap-1.5"
            >
              <RotateCcw className="w-4 h-4" strokeWidth={1.5} />
              <span>Ulangi Simulasi</span>
            </button>
            <button
              type="button"
              onClick={() => navigate(`/course/${course.slug}`)}
              className="px-6 py-2.5 rounded-xl bg-la-blue hover:bg-la-bluePress text-white text-xs font-bold shadow-brand"
            >
              Kembali ke Halaman Course
            </button>
          </div>
        </section>
      )}
    </AppShell>
  );
};

