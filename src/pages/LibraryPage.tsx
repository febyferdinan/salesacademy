import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Play, Download, Sparkles, X } from 'lucide-react';
import { AppShell } from '../components/layout/AppShell';
import { useAcademyStore } from '../store/useAcademyStore';
import { formatTime } from '../lib/utils';
import type { LibraryVideo } from '../../shared/types';

const CATEGORIES = [
  'Semua',
  'Connectivity',
  'Data Center',
  'Cloudeka',
  'SQURA Cybersec',
  'Collaboration',
  'Sales skill',
];

export const LibraryPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { library, materials, progress, setPreviewDoc, setChatOpen, sendAiPrompt } =
    useAcademyStore();

  const [tab, setTab] = useState<'video' | 'mat'>(
    searchParams.get('tab') === 'mat' ? 'mat' : 'video'
  );
  const [cat, setCat] = useState<string>('Semua');
  const [durFilter, setDurFilter] = useState<'all' | 'lt2' | '2to3'>('all');
  const [sortBy, setSortBy] = useState<'new' | 'short' | 'az'>('new');
  const [selectedVideo, setSelectedVideo] = useState<LibraryVideo | null>(null);

  const m3Prog = progress.find((p) => p.courseId === 'internet-dedicated' && p.moduleNum === 3);
  const m3Done = m3Prog?.status === 'done';
  const m3Sec = m3Prog?.watchedSec ?? 80;
  const m3Pct = Math.min(100, Math.round((m3Sec / 170) * 100));

  let videoList = library.filter(
    (v) =>
      (cat === 'Semua' || v.cat === cat) &&
      (durFilter === 'all' || (durFilter === 'lt2' ? v.sec < 120 : v.sec >= 120 && v.sec <= 180))
  );
  if (sortBy === 'short') videoList = [...videoList].sort((a, b) => a.sec - b.sec);
  if (sortBy === 'az') videoList = [...videoList].sort((a, b) => a.title.localeCompare(b.title));

  const matList = materials.filter((m) => cat === 'Semua' || m.cat === cat);

  return (
    <AppShell
      title="Learning Library"
      subtitle="38 video mikro · 24 materi akademi · update terakhir 31 Okt 2026"
    >
      {/* Top Toolbar */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="inline-flex p-1 rounded-2xl bg-surface border border-line">
          <button
            type="button"
            onClick={() => setTab('video')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              tab === 'video' ? 'bg-la-blue text-white shadow-sm' : 'text-ink-2 hover:text-ink'
            }`}
          >
            Video Learning ({library.length})
          </button>
          <button
            type="button"
            onClick={() => setTab('mat')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              tab === 'mat' ? 'bg-la-blue text-white shadow-sm' : 'text-ink-2 hover:text-ink'
            }`}
          >
            Academy Materials ({materials.length})
          </button>
        </div>

        {tab === 'video' && (
          <div className="flex items-center gap-2">
            <select
              value={durFilter}
              onChange={(e) => setDurFilter(e.target.value as 'all' | 'lt2' | '2to3')}
              aria-label="Filter Durasi"
              className="h-10 px-3 rounded-xl bg-surface border border-line text-xs font-semibold text-ink focus:outline-none focus:ring-2 focus:ring-la-blue"
            >
              <option value="all">Durasi: Semua</option>
              <option value="lt2">Di bawah 2 menit</option>
              <option value="2to3">2–3 menit</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'new' | 'short' | 'az')}
              aria-label="Urutkan"
              className="h-10 px-3 rounded-xl bg-surface border border-line text-xs font-semibold text-ink focus:outline-none focus:ring-2 focus:ring-la-blue"
            >
              <option value="new">Terbaru</option>
              <option value="short">Terpendek</option>
              <option value="az">A–Z</option>
            </select>
          </div>
        )}
      </div>

      {/* Category Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCat(c)}
            className={`px-4 py-2 rounded-full text-xs font-bold transition shrink-0 ${
              cat === c
                ? 'bg-la-blue text-white shadow-brand'
                : 'bg-surface border border-line text-ink-2 hover:border-la-blue/40'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {tab === 'video' ? (
        <div className="space-y-6">
          {/* Resume Watching Card */}
          {!m3Done && (cat === 'Semua' || cat === 'Connectivity') && (
            <button
              type="button"
              onClick={() => navigate('/player/internet-dedicated/3')}
              className="w-full text-left p-5 sm:p-6 rounded-3xl navy-gradient text-white shadow-brand grid sm:grid-cols-[200px_1fr] gap-5 items-center group"
            >
              <div className="h-32 rounded-2xl g-blue flex items-center justify-center relative overflow-hidden">
                <span className="w-12 h-12 rounded-full bg-white/20 backdrop-blur flex items-center justify-center group-hover:scale-110 transition">
                  <Play className="w-5 h-5 fill-white ml-0.5" strokeWidth={1.5} />
                </span>
                <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/60 font-mono text-[11px]">
                  {formatTime(m3Sec)} / 02:50
                </span>
              </div>
              <div className="space-y-2">
                <span className="text-xs font-bold text-sky-300">Lanjutkan menonton</span>
                <h3 className="text-lg sm:text-xl font-extrabold">
                  Internet Dedicated: Use Case &amp; Differentiator
                </h3>
                <p className="text-xs text-slate-300">
                  Modul 3 dari 5 · Connectivity · Bagian dari sertifikasi Connectivity Associate
                </p>
                <div className="flex items-center gap-3 pt-1">
                  <div className="flex-1 h-2 rounded-full bg-white/20 overflow-hidden">
                    <div
                      className="h-full bg-la-sky rounded-full"
                      style={{ width: `${m3Pct}%` }}
                    />
                  </div>
                  <span className="font-mono text-xs font-bold text-sky-200">{m3Pct}%</span>
                </div>
              </div>
            </button>
          )}

          {/* Video Grid */}
          {videoList.length > 0 ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-extrabold text-ink">Direkomendasikan untukmu</h2>
                <span className="text-xs text-muted-custom">
                  Berdasarkan produk fokus &amp; hasil quick check
                </span>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {videoList.map((v) => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setSelectedVideo(v)}
                    className="text-left p-4 rounded-3xl bg-surface border border-line shadow-card hover:shadow-card-hover hover:border-la-blue/40 transition flex flex-col justify-between gap-3 group"
                  >
                    <div
                      className={`h-36 rounded-2xl ${v.g} relative flex items-center justify-center overflow-hidden`}
                    >
                      {v.flag && (
                        <span
                          className={`absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                            v.flag === 'Baru'
                              ? 'glass-pill text-white'
                              : 'bg-la-amber text-la-navy'
                          }`}
                        >
                          {v.flag}
                        </span>
                      )}
                      <span className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white group-hover:scale-110 transition">
                        <Play className="w-5 h-5 fill-white ml-0.5" strokeWidth={1.5} />
                      </span>
                      <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded bg-black/65 font-mono text-[11px] text-white">
                        {v.dur}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-sm font-bold text-ink group-hover:text-la-blue transition line-clamp-1">
                        {v.title}
                      </h4>
                      <div className="flex items-center justify-between text-xs">
                        <span className="px-2.5 py-0.5 rounded-full bg-subtle font-semibold text-ink-2">
                          {v.cat}
                        </span>
                        <span
                          className={`font-semibold ${
                            v.prog === 100 ? 'text-la-green' : 'text-muted-custom'
                          }`}
                        >
                          {v.prog === 100
                            ? 'Selesai'
                            : v.prog
                            ? `${v.prog}% ditonton`
                            : 'Belum ditonton'}
                        </span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-subtle overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            v.prog === 100 ? 'bg-la-green' : 'bg-la-blue'
                          }`}
                          style={{ width: `${v.prog}%` }}
                        />
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-8 rounded-3xl bg-surface border border-line text-center space-y-3">
              <h3 className="text-base font-extrabold text-ink">
                Belum ada video {cat === 'Semua' ? '' : `${cat} `}dengan filter durasi ini.
              </h3>
              <p className="text-xs text-muted-custom">
                Hapus filter durasi untuk melihat seluruh koleksi video pembelajaran.
              </p>
              <button
                type="button"
                onClick={() => {
                  setDurFilter('all');
                  setCat('Semua');
                }}
                className="px-4 py-2 rounded-xl bg-la-blue text-white text-xs font-bold"
              >
                Reset Filter
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Academy Materials Tab */
        <div className="p-6 rounded-3xl bg-surface border border-line shadow-card divide-y divide-line">
          {matList.map((m) => (
            <div
              key={m.id}
              className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <span
                  className={`px-3 py-1.5 rounded-xl font-mono text-xs font-extrabold shrink-0 ${
                    m.type === 'PDF'
                      ? 'bg-la-redSoft text-la-red'
                      : 'bg-la-amberSoft text-amber-800'
                  }`}
                >
                  {m.type}
                </span>
                <div className="min-w-0">
                  <h4 className="text-sm font-bold text-ink truncate">{m.name}</h4>
                  <div className="text-xs text-muted-custom truncate">{m.meta}</div>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-subtle text-xs font-semibold text-ink-2">
                  {m.cat}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setPreviewDoc({
                      title: m.name,
                      type: 'doc',
                      meta: m.meta,
                      summary: m.summary,
                      sections: m.sections,
                    })
                  }
                  className="px-3.5 py-2 rounded-xl bg-subtle hover:bg-la-blue hover:text-white text-la-blue text-xs font-bold inline-flex items-center gap-1.5 transition"
                >
                  <Download className="w-3.5 h-3.5" strokeWidth={1.5} />
                  <span>Pratinjau &amp; Unduh</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Video Detail Modal */}
      {selectedVideo && (
        <div
          onClick={() => setSelectedVideo(null)}
          className="fixed inset-0 z-50 bg-la-navy/65 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg rounded-3xl bg-surface border border-line p-6 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-lg font-extrabold text-ink">{selectedVideo.title}</h2>
              <button
                type="button"
                onClick={() => setSelectedVideo(null)}
                className="p-1.5 rounded-xl hover:bg-subtle text-muted-custom"
              >
                <X className="w-5 h-5" strokeWidth={1.5} />
              </button>
            </div>

            <div
              className={`h-44 rounded-2xl ${selectedVideo.g} flex items-center justify-center relative`}
            >
              <span className="w-14 h-14 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-white">
                <Play className="w-6 h-6 fill-white ml-0.5" strokeWidth={1.5} />
              </span>
              <span className="absolute bottom-3 right-3 px-2.5 py-1 rounded bg-black/65 font-mono text-xs text-white">
                {selectedVideo.dur}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-ink-2 leading-relaxed">
              {selectedVideo.summary}
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => {
                  const title = selectedVideo.title;
                  setSelectedVideo(null);
                  setChatOpen(true);
                  sendAiPrompt(`Jelaskan poin utama dari video "${title}" untuk bahan pitching`);
                }}
                className="px-4 py-2.5 rounded-xl border border-line text-xs font-bold text-ink-2 hover:bg-subtle inline-flex items-center gap-1.5"
              >
                <Sparkles className="w-4 h-4 text-la-blue" strokeWidth={1.5} />
                <span>Tanya AI Topik Ini</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  const target = `/player/${selectedVideo.courseId}/${selectedVideo.moduleNum}`;
                  setSelectedVideo(null);
                  navigate(target);
                }}
                className="px-5 py-2.5 rounded-xl bg-la-blue hover:bg-la-bluePress text-white text-xs font-bold shadow-brand inline-flex items-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5 fill-white" strokeWidth={1.5} />
                <span>Putar Modul Video Sekarang</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
};

