import React, { useState, useMemo } from 'react';
import {
  FileText,
  Presentation,
  Image as ImageIcon,
  FolderArchive,
  Search,
  Download,
  Sparkles,
  CheckCircle2,
  Eye,
} from 'lucide-react';
import { useAcademyStore } from '../store/useAcademyStore';
import type { SupportingFile } from '../../shared/types';

export const ToolkitPage: React.FC = () => {
  const { toolkit, setPreviewDoc, setChatOpen, sendAiPrompt } = useAcademyStore();
  const [activeCategory, setActiveCategory] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = useMemo(() => {
    const cats = Array.from(new Set(toolkit.map((t) => t.cat).filter(Boolean))) as string[];
    return ['Semua', ...cats];
  }, [toolkit]);

  const filteredFiles = useMemo(() => {
    return toolkit.filter((item) => {
      const matchCat = activeCategory === 'Semua' || item.cat === activeCategory;
      const matchSearch =
        !searchQuery.trim() ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.cat || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.summary || '').toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [toolkit, activeCategory, searchQuery]);

  const getFileBadge = (type: SupportingFile['type']) => {
    switch (type) {
      case 'PPT':
        return {
          icon: Presentation,
          bg: 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/60',
        };
      case 'PNG':
        return {
          icon: ImageIcon,
          bg: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60',
        };
      case 'ZIP':
        return {
          icon: FolderArchive,
          bg: 'bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300 border-violet-200 dark:border-violet-800/60',
        };
      default:
        return {
          icon: FileText,
          bg: 'bg-sky-50 dark:bg-sky-950/40 text-brand-blue dark:text-sky-300 border-sky-200 dark:border-sky-800/60',
        };
    }
  };

  const handleOpenPreview = (file: SupportingFile) => {
    setPreviewDoc({
      title: file.name,
      type: 'doc',
      meta: `${file.cat || 'Sales Toolkit'} · ${file.meta}`,
      summary:
        file.summary ||
        `Dokumen resmi Lintasarta Commercial Enablement (${file.cat || 'Toolkit'}) yang siap digunakan untuk mendukung aktivitas presales, presentasi eksekutif, dan administrasi tender B2B.`,
      sections: file.sections || [
        {
          heading: 'Ringkasan Penggunaan Dokumen',
          content: [
            `Nama Aset: ${file.name}`,
            `Kategori: ${file.cat || 'Sales Toolkit'}`,
            `Spesifikasi: ${file.meta}`,
            'Pastikan Anda selalu menggunakan versi terbaru dari portal LA Sales Academy sebelum mengirimkan materi ke pelanggan.',
          ],
        },
        {
          heading: 'Checklist Kepatuhan Komersial',
          content: [
            'Gunakan logo Lintasarta & identitas visual sesuai Brand Guideline 2026.',
            'Untuk klaim SLA, sertifikasi Tier-III, dan referensi klien, mengacu pada klausa standar Product Marketing.',
            'Konsultasikan kustomisasi harga/diskon melalui alur SOP Pricing Approval.',
          ],
        },
      ],
    });
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-brand-blue dark:text-sky-400">
            Commercial Enablement Repository
          </span>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
            Sales Toolkit & Collateral Resmi
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
            Company profile, poster gimmick solusi, kebijakan komersial, serta brand guideline resmi
            Lintasarta yang telah tervalidasi untuk kebutuhan proposal & pitching pelanggan.
          </p>
        </div>

        <button
          onClick={() => {
            setChatOpen(true);
            sendAiPrompt(
              'Dokumen toolkit apa saja yang harus saya siapkan sebelum presentasi eksekutif ke calon klien perbankan?'
            );
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-navy dark:bg-sky-600 text-white text-xs font-semibold hover:opacity-95 transition self-start lg:self-auto shadow-xs"
        >
          <Sparkles className="w-4 h-4 text-amber-300" strokeWidth={1.75} />
          Rekomendasi Dokumen via AI
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 no-scrollbar">
          {categories.map((cat) => {
            const count =
              cat === 'Semua' ? toolkit.length : toolkit.filter((t) => t.cat === cat).length;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition whitespace-nowrap ${
                  activeCategory === cat
                    ? 'bg-brand-blue text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>

        <div className="relative w-full md:w-72">
          <Search
            className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2"
            strokeWidth={1.75}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari SOP, company profile, poster..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-blue"
          />
        </div>
      </div>

      {/* Toolkit Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredFiles.map((file) => {
          const badge = getFileBadge(file.type);
          const IconComp = badge.icon;
          return (
            <div
              key={file.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-xs hover:shadow-md hover:border-brand-blue/40 transition flex flex-col justify-between gap-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div
                    className={`w-11 h-11 rounded-xl border flex items-center justify-center shrink-0 ${badge.bg}`}
                  >
                    <IconComp className="w-5 h-5" strokeWidth={1.75} />
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    {file.cat || 'Toolkit'}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                    {file.name}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1">
                    <span className="font-mono font-semibold text-brand-blue dark:text-sky-400">
                      {file.type}
                    </span>
                    <span>•</span>
                    <span>{file.meta}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {file.summary ||
                    'Dokumen resmi terstandarisasi Lintasarta Commercial Enablement untuk mendukung eksekusi penjualan B2B.'}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" strokeWidth={2} />
                  Terverifikasi 2026
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenPreview(file)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold transition"
                  >
                    <Eye className="w-3.5 h-3.5" strokeWidth={1.75} />
                    Pratinjau
                  </button>
                  <button
                    onClick={() => handleOpenPreview(file)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-blue hover:bg-brand-navy text-white text-xs font-semibold transition shadow-2xs"
                  >
                    <Download className="w-3.5 h-3.5" strokeWidth={1.75} />
                    Unduh
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

