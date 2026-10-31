import React, { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ChevronRight,
  ChevronDown,
  Download,
  Sparkles,
  Play,
  Calculator,
  CheckCircle2,
  XCircle,
  Copy,
  ShieldCheck,
  TrendingUp,
  ArrowUpRight,
  MessageSquareQuote,
} from 'lucide-react';
import { toast } from 'sonner';
import { useAcademyStore } from '../store/useAcademyStore';
import { formatIDR } from '../lib/utils';

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { products, courses, setChatOpen, sendAiPrompt, setPreviewDoc } = useAcademyStore();

  const product = useMemo(
    () => products.find((p) => p.slug === slug) || products[0],
    [products, slug]
  );

  const [activeChip, setActiveChip] = useState<string>('Semua');
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    if (product) {
      product.sections.forEach((s, idx) => {
        initial[s.key] = idx < 4; // First 4 sections expanded by default
      });
    }
    return initial;
  });

  // Interactive Business Impact & Downtime ROI Calculator state
  const [hourlyRevenueLoss, setHourlyRevenueLoss] = useState<number>(
    product?.roiDefaults?.defaultHourlyRevenueIdr || 25000000
  );
  const [downtimeHoursPerMonth, setDowntimeHoursPerMonth] = useState<number>(
    product?.roiDefaults?.defaultDowntimeHoursPerMonth || 6
  );
  const [solutionMonthlyCost, setSolutionMonthlyCost] = useState<number>(
    product?.roiDefaults?.monthlyDedicatedIdr || 8500000
  );

  // Sync ROI defaults when switching products
  React.useEffect(() => {
    if (product?.roiDefaults) {
      setHourlyRevenueLoss(product.roiDefaults.defaultHourlyRevenueIdr);
      setDowntimeHoursPerMonth(product.roiDefaults.defaultDowntimeHoursPerMonth);
      setSolutionMonthlyCost(product.roiDefaults.monthlyDedicatedIdr);
    }
    if (product) {
      const nextOpen: Record<string, boolean> = {};
      product.sections.forEach((s, idx) => {
        nextOpen[s.key] = idx < 4;
      });
      setOpenSections(nextOpen);
      setActiveChip('Semua');
    }
  }, [product?.slug]);

  if (!product) {
    return (
      <div className="p-8 text-center">
        <p className="text-slate-500">Produk tidak ditemukan.</p>
        <Link to="/products" className="text-brand-blue font-semibold mt-2 inline-block">
          Kembali ke Katalog Produk
        </Link>
      </div>
    );
  }

  const relatedCourse = courses.find((c) => c.id === product.relatedCourseId);
  const crossSellProducts = product.crossSellSlugs
    .map((csSlug) => products.find((p) => p.slug === csSlug))
    .filter(Boolean);

  // ROI Calculations
  const monthlyDowntimeRiskIdr = Math.round(hourlyRevenueLoss * downtimeHoursPerMonth);
  const slaReductionFactor = (product.roiDefaults?.slaGuaranteePct || 99.5) / 100;
  const protectedRevenuePerMonthIdr = Math.round(monthlyDowntimeRiskIdr * slaReductionFactor);
  const netMonthlyBenefitIdr = protectedRevenuePerMonthIdr - solutionMonthlyCost;
  const roiMultiplier =
    solutionMonthlyCost > 0 ? (protectedRevenuePerMonthIdr / solutionMonthlyCost).toFixed(1) : '0';

  const visibleSections =
    activeChip === 'Semua'
      ? product.sections
      : product.sections.filter((s) => s.label === activeChip || s.key === activeChip);

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const expandAll = (open: boolean) => {
    const next: Record<string, boolean> = {};
    product.sections.forEach((s) => {
      next[s.key] = open;
    });
    setOpenSections(next);
  };

  const handleDownloadBattlecard = () => {
    setPreviewDoc({
      title: `Battlecard — Lintasarta ${product.name}`,
      type: 'doc',
      meta: `${product.cat} · ${product.validated}`,
      summary: product.desc,
      sections: product.sections.map((s) => ({
        heading: s.label,
        content: s.body
          ? s.body
              .replace(/<[^>]+>/g, ' ')
              .split('.')
              .map((line) => line.trim())
              .filter(Boolean)
          : s.quotes
          ? s.quotes.map(([q, a]) => `${q} — ${a}`)
          : s.pair
          ? s.pair.map(([left, right]) => `${left}: ${right}`)
          : [],
      })),
    });
  };

  const handleCopyRoiPitch = () => {
    const pitch = [
      `📊 RINGKASAN BUSINESS CASE — LINTASARTA ${product.name.toUpperCase()}`,
      `• Estimasi Biaya Downtime Klien: ${formatIDR(hourlyRevenueLoss)} / jam`,
      `• Rata-rata Gangguan / Insiden Tanpa SLA: ${downtimeHoursPerMonth} jam / bulan`,
      `• Potensi Kerugian Bisnis Bulanan: ${formatIDR(monthlyDowntimeRiskIdr)} / bulan`,
      `• Proteksi Nilai Bisnis dengan SLA Lintasarta (${product.roiDefaults.slaGuaranteePct}%): ${formatIDR(protectedRevenuePerMonthIdr)} / bulan`,
      `• Estimasi Investasi Bulanan Solusi: ${formatIDR(solutionMonthlyCost)} / bulan`,
      `• Net Value Protection: ${formatIDR(Math.max(0, netMonthlyBenefitIdr))} / bulan (${roiMultiplier}x Cost-to-Risk Ratio)`,
    ].join('\n');

    navigator.clipboard.writeText(pitch);
    toast.success('Ringkasan ROI Business Case berhasil disalin ke clipboard!');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
        <Link to="/dashboard" className="hover:text-brand-blue transition-colors">
          Beranda
        </Link>
        <ChevronRight className="w-3.5 h-3.5" strokeWidth={1.5} />
        <Link to="/products" className="hover:text-brand-blue transition-colors">
          Product Mapping
        </Link>
        <ChevronRight className="w-3.5 h-3.5" strokeWidth={1.5} />
        <span className="font-semibold text-slate-900 dark:text-white">{product.name}</span>
      </nav>

      {/* Product Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0B1A33] via-[#10294D] to-[#0B4F9E] text-white p-6 lg:p-8 shadow-lg border border-white/10">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="max-w-3xl space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-sky-400/20 text-sky-200 border border-sky-300/25">
                {product.cat}
              </span>
              <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-400/15 text-emerald-200 border border-emerald-300/25 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" strokeWidth={1.75} />
                {product.validated}
              </span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight">
              Lintasarta {product.name}
            </h1>
            <p className="text-sm lg:text-base text-slate-200 leading-relaxed">{product.desc}</p>
          </div>

          <div className="flex flex-wrap lg:flex-col gap-2.5 shrink-0">
            <button
              onClick={handleDownloadBattlecard}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white text-slate-900 font-semibold text-sm hover:bg-slate-100 transition shadow-sm"
            >
              <Download className="w-4 h-4 text-brand-blue" strokeWidth={1.75} />
              Unduh Battlecard PDF
            </button>
            <button
              onClick={() => {
                setChatOpen(true, { activeProductSlug: product.slug });
                sendAiPrompt(
                  `Berikan 3 poin value proposition utama dan cara mengatasi keberatan harga untuk produk Lintasarta ${product.name}`
                );
              }}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 text-white border border-sky-300/30 font-semibold text-sm transition"
            >
              <Sparkles className="w-4 h-4 text-amber-300" strokeWidth={1.75} />
              Tanya AI Battlecard Ini
            </button>
          </div>
        </div>
      </div>

      {/* Filter Chips & Expand/Collapse Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
          <button
            onClick={() => setActiveChip('Semua')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition whitespace-nowrap ${
              activeChip === 'Semua'
                ? 'bg-brand-blue text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Semua ({product.sections.length})
          </button>
          {product.sections.map((s) => (
            <button
              key={s.key}
              onClick={() => {
                setActiveChip(s.label);
                setOpenSections((prev) => ({ ...prev, [s.key]: true }));
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition whitespace-nowrap ${
                activeChip === s.label
                  ? 'bg-brand-blue text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={() => expandAll(true)}
            className="px-2.5 py-1 rounded-md text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium"
          >
            Buka Semua
          </button>
          <span className="text-slate-300 dark:text-slate-700">|</span>
          <button
            onClick={() => expandAll(false)}
            className="px-2.5 py-1 rounded-md text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium"
          >
            Tutup Semua
          </button>
        </div>
      </div>

      {/* Main Two-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: 12 Battlecard Sections + Interactive ROI Calculator */}
        <div className="lg:col-span-8 space-y-4">
          {visibleSections.map((sec, idx) => {
            const isOpen = !!openSections[sec.key];
            return (
              <div
                key={sec.key}
                className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-xs overflow-hidden transition"
              >
                <button
                  onClick={() => toggleSection(sec.key)}
                  className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-brand-blue/10 dark:bg-sky-500/20 text-brand-blue dark:text-sky-300 text-xs font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-brand-blue dark:text-sky-400 block">
                        Section {idx + 1}
                      </span>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">
                        {sec.label}
                      </h3>
                    </div>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-brand-blue' : ''
                    }`}
                    strokeWidth={1.75}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-2 border-t border-slate-100 dark:border-slate-800/80 space-y-3">
                    {sec.body && (
                      <div
                        className="prose prose-sm dark:prose-invert max-w-none text-sm text-slate-700 dark:text-slate-300 leading-relaxed [&_ul]:list-disc [&_ul]:pl-5 [&_li]:my-1"
                        dangerouslySetInnerHTML={{ __html: sec.body }}
                      />
                    )}

                    {sec.quotes && (
                      <div className="space-y-3">
                        {sec.quotes.map(([q, a], i) => (
                          <div
                            key={i}
                            className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 space-y-1.5"
                          >
                            <div className="flex items-start gap-2 text-sm font-bold text-slate-900 dark:text-white">
                              <MessageSquareQuote
                                className="w-4 h-4 text-brand-blue shrink-0 mt-0.5"
                                strokeWidth={1.75}
                              />
                              <span>{q}</span>
                            </div>
                            <p className="text-xs text-slate-600 dark:text-slate-300 pl-6 leading-relaxed">
                              <strong className="text-brand-blue dark:text-sky-400">
                                Panduan AE:{' '}
                              </strong>
                              {a}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}

                    {sec.pair && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                        {sec.pair.map(([title, contentHtml], i) => {
                          const isDont =
                            title.toLowerCase().includes('jangan') ||
                            title.toLowerCase().includes("don't");
                          return (
                            <div
                              key={i}
                              className={`p-4 rounded-xl border ${
                                isDont
                                  ? 'bg-rose-50/70 dark:bg-rose-950/30 border-rose-200/80 dark:border-rose-800/50'
                                  : 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-200/80 dark:border-emerald-800/50'
                              }`}
                            >
                              <div
                                className={`flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider mb-2.5 ${
                                  isDont
                                    ? 'text-rose-700 dark:text-rose-300'
                                    : 'text-emerald-700 dark:text-emerald-300'
                                }`}
                              >
                                {isDont ? (
                                  <XCircle className="w-4 h-4" strokeWidth={2} />
                                ) : (
                                  <CheckCircle2 className="w-4 h-4" strokeWidth={2} />
                                )}
                                {title}
                              </div>
                              <div
                                className={`text-xs leading-relaxed [&_ul]:list-disc [&_ul]:pl-4 [&_li]:my-1 ${
                                  isDont
                                    ? 'text-rose-950 dark:text-rose-200'
                                    : 'text-emerald-950 dark:text-emerald-200'
                                }`}
                                dangerouslySetInnerHTML={{ __html: contentHtml }}
                              />
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {/* Interactive Business Impact & Downtime ROI Calculator */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-brand-blue/25 dark:border-sky-500/30 shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-brand-navy to-brand-blue px-6 py-4 text-white flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center">
                  <Calculator className="w-5 h-5 text-amber-300" strokeWidth={1.75} />
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-sky-200 block">
                    Interactive Consultative Tool
                  </span>
                  <h3 className="text-base font-bold">
                    Kalkulator Dampak Downtime & Justifikasi ROI — {product.name}
                  </h3>
                </div>
              </div>
              <button
                onClick={handleCopyRoiPitch}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/15 hover:bg-white/25 text-xs font-semibold text-white transition"
              >
                <Copy className="w-3.5 h-3.5" strokeWidth={1.75} />
                Salin Business Case
              </button>
            </div>

            <div className="p-6 space-y-6">
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Gunakan kalkulator ini saat discovery meeting dengan CFO / Kepala IT untuk menggeser
                diskusi dari <strong>perbandingan harga sewa bulanan</strong> menjadi{' '}
                <strong>biaya risiko downtime bisnis (Cost of Inaction)</strong>.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* Input 1 */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700 space-y-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-200 block">
                    1. Kerugian Klien Saat Downtime / Jam
                  </label>
                  <div className="text-base font-extrabold text-brand-blue dark:text-sky-400 font-mono">
                    {formatIDR(hourlyRevenueLoss)}
                  </div>
                  <input
                    type="range"
                    min={5000000}
                    max={150000000}
                    step={5000000}
                    value={hourlyRevenueLoss}
                    onChange={(e) => setHourlyRevenueLoss(Number(e.target.value))}
                    className="w-full accent-brand-blue cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>Rp 5 Jt/jam</span>
                    <span>Rp 150 Jt/jam</span>
                  </div>
                </div>

                {/* Input 2 */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700 space-y-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-200 block">
                    2. Estimasi Gangguan Tanpa SLA / Bulan
                  </label>
                  <div className="text-base font-extrabold text-amber-600 dark:text-amber-400 font-mono">
                    {downtimeHoursPerMonth} Jam / bulan
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={24}
                    step={1}
                    value={downtimeHoursPerMonth}
                    onChange={(e) => setDowntimeHoursPerMonth(Number(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>1 jam/bln</span>
                    <span>24 jam/bln</span>
                  </div>
                </div>

                {/* Input 3 */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700 space-y-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-200 block">
                    3. Estimasi Investasi Bulanan Solusi
                  </label>
                  <div className="text-base font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
                    {formatIDR(solutionMonthlyCost)}
                  </div>
                  <input
                    type="range"
                    min={2500000}
                    max={75000000}
                    step={2500000}
                    value={solutionMonthlyCost}
                    onChange={(e) => setSolutionMonthlyCost(Number(e.target.value))}
                    className="w-full accent-emerald-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>Rp 2,5 Jt</span>
                    <span>Rp 75 Jt</span>
                  </div>
                </div>
              </div>

              {/* Output Summary KPI Strip */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/60">
                  <span className="text-[11px] font-bold uppercase text-rose-700 dark:text-rose-300">
                    Risiko Kerugian Bulanan
                  </span>
                  <div className="text-lg font-extrabold text-rose-700 dark:text-rose-300 font-mono mt-1">
                    {formatIDR(monthlyDowntimeRiskIdr)}
                  </div>
                  <span className="text-[11px] text-rose-600/80 dark:text-rose-400">
                    Akibat {downtimeHoursPerMonth} jam gangguan operasional
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60">
                  <span className="text-[11px] font-bold uppercase text-emerald-700 dark:text-emerald-300">
                    Nilai Bisnis Terlindungi (SLA)
                  </span>
                  <div className="text-lg font-extrabold text-emerald-700 dark:text-emerald-300 font-mono mt-1">
                    {formatIDR(protectedRevenuePerMonthIdr)}
                  </div>
                  <span className="text-[11px] text-emerald-600/80 dark:text-emerald-400">
                    Proteksi SLA Enterprise ({product.roiDefaults.slaGuaranteePct}%)
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800/60">
                  <span className="text-[11px] font-bold uppercase text-brand-blue dark:text-sky-300">
                    Rasio Proteksi vs Investasi
                  </span>
                  <div className="text-lg font-extrabold text-brand-blue dark:text-sky-300 font-mono mt-1 flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4" strokeWidth={2} />
                    {roiMultiplier}x Lipat
                  </div>
                  <span className="text-[11px] text-slate-600 dark:text-slate-400">
                    Net Benefit: {formatIDR(Math.max(0, netMonthlyBenefitIdr))}/bln
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Action Sidebar */}
        <div className="lg:col-span-4 space-y-5 lg:sticky lg:top-20">
          {/* Card 1: Siapkan Meeting */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-xs space-y-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-brand-blue dark:text-sky-400">
                Action Co-Pilot
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                Siapkan Meeting Klien
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Akses cepat dokumen resmi, simulasi AI, dan modul video terkait {product.name}.
              </p>
            </div>

            <div className="space-y-2.5">
              <button
                onClick={handleDownloadBattlecard}
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-brand-blue hover:bg-brand-navy text-white font-semibold text-xs transition shadow-xs"
              >
                <span className="flex items-center gap-2.5">
                  <Download className="w-4 h-4" strokeWidth={1.75} />
                  Unduh Battlecard ({product.name})
                </span>
                <ArrowUpRight className="w-4 h-4 opacity-80" strokeWidth={1.75} />
              </button>

              <button
                onClick={() => {
                  setChatOpen(true, { activeProductSlug: product.slug });
                  sendAiPrompt(
                    `Buatkan daftar 5 pertanyaan discovery consultative dan cara menjawab keberatan harga untuk Lintasarta ${product.name}`
                  );
                }}
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-semibold text-xs transition"
              >
                <span className="flex items-center gap-2.5">
                  <Sparkles
                    className="w-4 h-4 text-brand-blue dark:text-sky-400"
                    strokeWidth={1.75}
                  />
                  Tanya AI tentang Produk Ini
                </span>
                <ChevronRight className="w-4 h-4 text-slate-400" strokeWidth={1.75} />
              </button>

              {relatedCourse && (
                <button
                  onClick={() => navigate(`/course/${relatedCourse.slug}`)}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-semibold text-xs transition"
                >
                  <span className="flex items-center gap-2.5 text-left">
                    <Play className="w-4 h-4 text-emerald-600 shrink-0" strokeWidth={1.75} />
                    <span className="truncate">Pelajari Course: {relatedCourse.title}</span>
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" strokeWidth={1.75} />
                </button>
              )}
            </div>
          </div>

          {/* Card 2: Cross-sell & Bundling */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-xs space-y-3.5">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                Multi-Product Bundling
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                Sering Dijual Bersama
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Tingkatkan ukuran deal (ACV) dan customer stickiness dengan kombinasi solusi ini:
              </p>
            </div>

            <div className="space-y-2.5">
              {crossSellProducts.map((cp) =>
                cp ? (
                  <Link
                    key={cp.slug}
                    to={`/product/${cp.slug}`}
                    className="block p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 hover:border-brand-blue dark:hover:border-sky-500 hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-brand-blue dark:text-sky-400">
                        {cp.cat}
                      </span>
                      <ArrowUpRight
                        className="w-3.5 h-3.5 text-slate-400 group-hover:text-brand-blue transition"
                        strokeWidth={1.75}
                      />
                    </div>
                    <div className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                      Lintasarta {cp.name}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                      {cp.desc}
                    </p>
                  </Link>
                ) : null
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
