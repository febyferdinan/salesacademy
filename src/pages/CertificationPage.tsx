import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Award,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Download,
  Play,
  X,
  AlertCircle,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import { useAcademyStore } from '../store/useAcademyStore';
import type { CertificationTrack } from '../../shared/types';

export const CertificationPage: React.FC = () => {
  const { certs, courses, activeRole, users, submitCertExam, setPreviewDoc } = useAcademyStore();
  const currentUser = users[activeRole];

  const [activeExamCert, setActiveExamCert] = useState<CertificationTrack | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [submitting, setSubmitting] = useState(false);
  const [examResult, setExamResult] = useState<{
    correct: number;
    total: number;
    pctScore: number;
    passed: boolean;
    certCode?: string;
    pointsAwarded: number;
  } | null>(null);

  const handleStartExam = (cert: CertificationTrack) => {
    setActiveExamCert(cert);
    setSelectedAnswers({});
    setExamResult(null);
  };

  const handleSubmitExam = async () => {
    if (!activeExamCert) return;
    setSubmitting(true);
    try {
      const answersArray = activeExamCert.questions.map((_, idx) =>
        selectedAnswers[idx] !== undefined ? selectedAnswers[idx] : -1
      );
      const res = await submitCertExam(activeExamCert.slug, answersArray);
      setExamResult(res);
    } finally {
      setSubmitting(false);
    }
  };

  const handlePreviewCertificate = (cert: CertificationTrack) => {
    setPreviewDoc({
      title: `Sertifikat Kompetensi — ${cert.name}`,
      type: 'certificate',
      certData: {
        certName: cert.name,
        certCode: cert.certCode || `LA-CERT-2026-${cert.id.toUpperCase()}`,
        issuedAt: cert.issuedAt || '18 Apr 2026',
        score: cert.score || 92,
      },
    });
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="rounded-2xl bg-gradient-to-br from-[#0B1A33] via-[#10294D] to-[#0B6FD0] text-white p-6 lg:p-8 shadow-lg border border-white/10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-200 border border-amber-300/30 text-xs font-bold">
            <Award className="w-3.5 h-3.5" strokeWidth={2} />
            Official Commercial Enablement Credential
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight">
            Sertifikasi Kompetensi Account Executive
          </h1>
          <p className="text-sm text-slate-200 leading-relaxed">
            Standar kelulusan resmi Lintasarta bagi B2B Account Executive untuk memvalidasi
            penguasaan teknis produk, kualifikasi kebutuhan pelanggan, dan simulasi negosiasi nilai.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 shrink-0">
          <div className="text-center px-2">
            <div className="text-2xl font-extrabold font-mono text-amber-300">
              {certs.filter((c) => c.state === 'Tersertifikasi').length}/{certs.length}
            </div>
            <div className="text-[11px] text-slate-200 mt-0.5">Track Lulus</div>
          </div>
          <div className="text-center px-2 border-x border-white/15">
            <div className="text-2xl font-extrabold font-mono text-emerald-300">80%</div>
            <div className="text-[11px] text-slate-200 mt-0.5">Batas Lulus</div>
          </div>
          <div className="text-center px-2">
            <div className="text-2xl font-extrabold font-mono text-sky-200">
              {currentUser.points}
            </div>
            <div className="text-[11px] text-slate-200 mt-0.5">Poin Anda</div>
          </div>
        </div>
      </div>

      {/* Certification Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {certs.map((cert) => {
          const isCertified = cert.state === 'Tersertifikasi';
          const pct = Math.min(100, Math.round((cert.done / Math.max(1, cert.need)) * 100));
          const reqCourses = cert.requiredCourseIds
            .map((cid) => courses.find((c) => c.id === cid))
            .filter(Boolean);

          return (
            <div
              key={cert.id}
              className={`bg-white dark:bg-slate-900 rounded-2xl border p-6 shadow-xs flex flex-col justify-between gap-6 transition ${
                isCertified
                  ? 'border-emerald-300/90 dark:border-emerald-700/70 ring-1 ring-emerald-500/15'
                  : 'border-slate-200/90 dark:border-slate-800'
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                      isCertified
                        ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                        : 'bg-sky-50 dark:bg-sky-950/50 text-brand-blue dark:text-sky-400 border border-sky-200 dark:border-sky-800'
                    }`}
                  >
                    {isCertified ? (
                      <ShieldCheck className="w-6 h-6" strokeWidth={1.75} />
                    ) : (
                      <Award className="w-6 h-6" strokeWidth={1.75} />
                    )}
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      isCertified
                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                        : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
                    }`}
                  >
                    {cert.state}
                  </span>
                </div>

                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-brand-blue dark:text-sky-400">
                    {cert.category}
                  </span>
                  <h2 className="text-lg font-extrabold text-slate-900 dark:text-white mt-0.5">
                    {cert.name}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 shrink-0" strokeWidth={1.75} />
                    <span>{cert.exam}</span>
                  </p>
                </div>

                {/* Segmented Progress Bar */}
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-600 dark:text-slate-300">
                      Progres Prasyarat Course
                    </span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">
                      {cert.done}/{cert.need} Course ({pct}%)
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-1.5">
                    {Array.from({ length: cert.need }).map((_, idx) => (
                      <div
                        key={idx}
                        className={`h-2 rounded-full transition-all ${
                          idx < cert.done
                            ? isCertified
                              ? 'bg-emerald-500'
                              : 'bg-brand-blue'
                            : 'bg-slate-200 dark:bg-slate-800'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Required Courses List */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Kurikulum Terkait:
                  </span>
                  <div className="space-y-1.5">
                    {reqCourses.map((c) =>
                      c ? (
                        <Link
                          key={c.id}
                          to={`/course/${c.slug}`}
                          className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-200 transition"
                        >
                          <span className="flex items-center gap-2 truncate">
                            <BookOpen
                              className="w-3.5 h-3.5 text-brand-blue shrink-0"
                              strokeWidth={1.75}
                            />
                            <span className="truncate">{c.title}</span>
                          </span>
                          <span className="text-[10px] font-bold text-brand-blue dark:text-sky-400 ml-2 shrink-0">
                            Buka →
                          </span>
                        </Link>
                      ) : null
                    )}
                  </div>
                </div>

                {isCertified && cert.certCode && (
                  <div className="p-3 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/50 text-xs space-y-0.5">
                    <div className="font-bold text-emerald-900 dark:text-emerald-200 flex items-center justify-between">
                      <span>ID: {cert.certCode}</span>
                      <span>Skor: {cert.score || 92}%</span>
                    </div>
                    <div className="text-[11px] text-emerald-700 dark:text-emerald-400">
                      Diterbitkan: {cert.issuedAt || '18 Apr 2026'} · Berlaku s/d 2028
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2">
                {isCertified ? (
                  <>
                    <button
                      onClick={() => handlePreviewCertificate(cert)}
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-xs"
                    >
                      <Download className="w-4 h-4" strokeWidth={1.75} />
                      Lihat & Unduh Sertifikat Resmi
                    </button>
                    <button
                      onClick={() => handleStartExam(cert)}
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition"
                    >
                      Ujian Ulang (Tingkatkan Skor)
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => handleStartExam(cert)}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-brand-blue hover:bg-brand-navy text-white text-xs font-bold transition shadow-xs"
                  >
                    <Play className="w-4 h-4" strokeWidth={1.75} />
                    Mulai Ujian Sertifikasi ({cert.questions.length} Soal)
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Proctored Certification Exam Modal */}
      {activeExamCert && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-brand-navy text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-sky-300 block">
                  Proctored Assessment · Passing Grade 80%
                </span>
                <h3 className="text-base font-extrabold">{activeExamCert.name}</h3>
              </div>
              <button
                onClick={() => setActiveExamCert(null)}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition"
              >
                <X className="w-4 h-4" strokeWidth={2} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              {examResult ? (
                <div className="space-y-5 text-center py-4">
                  <div
                    className={`w-16 h-16 rounded-2xl mx-auto flex items-center justify-center ${
                      examResult.passed
                        ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400'
                        : 'bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400'
                    }`}
                  >
                    {examResult.passed ? (
                      <ShieldCheck className="w-9 h-9" strokeWidth={1.75} />
                    ) : (
                      <AlertCircle className="w-9 h-9" strokeWidth={1.75} />
                    )}
                  </div>

                  <div className="space-y-1">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-extrabold ${
                        examResult.passed
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {examResult.passed ? 'LULUS SERTIFIKASI' : 'BELUM MENCAPAI BATAS LULUS (80%)'}
                    </span>
                    <h4 className="text-2xl font-extrabold text-slate-900 dark:text-white pt-2">
                      Skor Akhir: {examResult.pctScore}% ({examResult.correct}/{examResult.total}{' '}
                      Benar)
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                      {examResult.passed
                        ? `Selamat! Sertifikat resmi Anda (${examResult.certCode}) telah diterbitkan dan Anda memperoleh +${examResult.pointsAwarded} poin.`
                        : 'Silakan tinjau kembali modul terkait dan ulangi ujian untuk mencapai skor minimal 80%.'}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                    {examResult.passed && (
                      <button
                        onClick={() => {
                          const updated =
                            certs.find((c) => c.slug === activeExamCert.slug) || activeExamCert;
                          setActiveExamCert(null);
                          handlePreviewCertificate({
                            ...updated,
                            certCode: examResult.certCode,
                            score: examResult.pctScore,
                          });
                        }}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-sm"
                      >
                        <Sparkles className="w-4 h-4" strokeWidth={1.75} />
                        Buka Sertifikat Resmi ({examResult.certCode})
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setExamResult(null);
                        setSelectedAnswers({});
                      }}
                      className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold transition"
                    >
                      Coba Lagi
                    </button>
                    <button
                      onClick={() => setActiveExamCert(null)}
                      className="px-4 py-2.5 rounded-xl bg-brand-blue text-white text-xs font-semibold transition"
                    >
                      Selesai
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="p-3.5 rounded-xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200/80 dark:border-sky-800/60 text-xs text-slate-700 dark:text-slate-300">
                    Jawab seluruh pertanyaan studi kasus di bawah ini. Minimal skor kelulusan adalah{' '}
                    <strong>80%</strong> untuk menerbitkan sertifikat resmi{' '}
                    <strong>{activeExamCert.name}</strong>.
                  </div>

                  <div className="space-y-5">
                    {activeExamCert.questions.map((q, qIdx) => (
                      <div
                        key={qIdx}
                        className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-xs font-extrabold uppercase text-brand-blue dark:text-sky-400">
                            Soal {qIdx + 1} · {q.topic}
                          </span>
                        </div>
                        <p className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                          {q.q}
                        </p>
                        <div className="space-y-2">
                          {q.opts.map((opt, oIdx) => {
                            const isPicked = selectedAnswers[qIdx] === oIdx;
                            return (
                              <button
                                key={oIdx}
                                type="button"
                                onClick={() =>
                                  setSelectedAnswers((prev) => ({ ...prev, [qIdx]: oIdx }))
                                }
                                className={`w-full text-left p-3 rounded-xl border text-xs font-medium transition flex items-center gap-3 ${
                                  isPicked
                                    ? 'bg-brand-blue/10 dark:bg-sky-500/20 border-brand-blue dark:border-sky-400 text-slate-900 dark:text-white font-semibold'
                                    : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                                }`}
                              >
                                <span
                                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 ${
                                    isPicked
                                      ? 'bg-brand-blue text-white'
                                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                                  }`}
                                >
                                  {String.fromCharCode(65 + oIdx)}
                                </span>
                                <span>{opt}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Modal Footer */}
            {!examResult && (
              <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  Terjawab: {Object.keys(selectedAnswers).length} / {activeExamCert.questions.length}{' '}
                  soal
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveExamCert(null)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 transition"
                  >
                    Batal
                  </button>
                  <button
                    disabled={
                      submitting ||
                      Object.keys(selectedAnswers).length < activeExamCert.questions.length
                    }
                    onClick={handleSubmitExam}
                    className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-brand-blue hover:bg-brand-navy disabled:opacity-50 text-white text-xs font-bold transition shadow-xs"
                  >
                    <CheckCircle2 className="w-4 h-4" strokeWidth={1.75} />
                    {submitting ? 'Memeriksa Jawaban...' : 'Kumpulkan Ujian'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

