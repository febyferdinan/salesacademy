import React, { useState, useEffect } from 'react';
import {
  Cpu,
  BookPlus,
  ShieldAlert,
  Sparkles,
  Save,
  CheckCircle2,
  Server,
  KeyRound,
  Sliders,
  Plus,
  Newspaper,
  RotateCcw,
} from 'lucide-react';
import { useAcademyStore } from '../store/useAcademyStore';
import type { AiProviderType } from '../../shared/types';

export const AdminStudioPage: React.FC = () => {
  const {
    aiSettings,
    updateAiConfig,
    createCourse,
    createNews,
    auditLogs,
    setChatOpen,
    sendAiPrompt,
    resetDemo,
  } = useAcademyStore();

  const [activeTab, setActiveTab] = useState<'ai' | 'content' | 'audit'>('ai');

  // AI Provider state
  const [provider, setProvider] = useState<AiProviderType>(aiSettings.provider);
  const [baseUrl, setBaseUrl] = useState<string>(aiSettings.baseUrl);
  const [apiKey, setApiKey] = useState<string>(aiSettings.apiKey);
  const [model, setModel] = useState<string>(aiSettings.model);
  const [temperature, setTemperature] = useState<number>(aiSettings.temperature);
  const [savingAi, setSavingAi] = useState(false);

  useEffect(() => {
    setProvider(aiSettings.provider);
    setBaseUrl(aiSettings.baseUrl);
    setApiKey(aiSettings.apiKey);
    setModel(aiSettings.model);
    setTemperature(aiSettings.temperature);
  }, [aiSettings]);

  // Course Builder Form state
  const [courseTitle, setCourseTitle] = useState('');
  const [courseShort, setCourseShort] = useState('');
  const [courseCategory, setCourseCategory] = useState('Cloud & AI');
  const [courseLead, setCourseLead] = useState('Dewi Anggraini · Commercial Enablement');
  const [courseDesc, setCourseDesc] = useState('');
  const [courseCert, setCourseCert] = useState('Data Center & Cloud Associate');
  const [courseOutcomes, setCourseOutcomes] = useState(
    'Memahami positioning solusi terhadap kebutuhan korporasi\nMenguasai 5 pertanyaan discovery utama\nMampu menangani keberatan harga vs nilai SLA'
  );

  // News Form state
  const [newsTag, setNewsTag] = useState('Update Produk');
  const [newsTitle, setNewsTitle] = useState('');
  const [newsBody, setNewsBody] = useState('');

  const handleSelectProvider = (nextProvider: AiProviderType) => {
    setProvider(nextProvider);
    if (nextProvider === 'gemini') {
      setModel('gemini-2.5-flash');
      setBaseUrl('https://generativelanguage.googleapis.com');
    } else if (nextProvider === 'openai') {
      setModel('gpt-4o-mini');
      setBaseUrl('https://api.openai.com/v1');
    } else if (nextProvider === 'openai-compatible') {
      if (!baseUrl || baseUrl.includes('googleapis')) {
        setBaseUrl('https://dekallm.cloudeka.id/v1');
      }
      if (!model || model.includes('gemini')) {
        setModel('qwen2.5-72b-instruct');
      }
    } else {
      setModel('la-grounded-rag-v2');
    }
  };

  const handleSaveAiConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingAi(true);
    try {
      await updateAiConfig({
        provider,
        baseUrl,
        apiKey,
        model,
        temperature,
      });
    } finally {
      setSavingAi(false);
    }
  };

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseTitle.trim()) return;
    const slug = courseTitle
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    await createCourse({
      slug,
      title: courseTitle,
      short: courseShort || courseTitle,
      category: courseCategory,
      lead: courseLead,
      desc:
        courseDesc ||
        `Kurikulum komersial resmi Lintasarta untuk penguasaan solusi ${courseTitle}.`,
      cert: courseCert,
      outcomes: courseOutcomes
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
    });
    setCourseTitle('');
    setCourseShort('');
    setCourseDesc('');
  };

  const handleCreateNews = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsTitle.trim() || !newsBody.trim()) return;
    await createNews({
      tag: newsTag,
      title: newsTitle,
      body: newsBody,
    });
    setNewsTitle('');
    setNewsBody('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-brand-blue dark:text-sky-400">
            Commercial Enablement Governance Studio
          </span>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
            Admin Studio & Konfigurasi Tanya AI
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
            Kelola engine LLM untuk Tanya AI (Gemini, OpenAI, maupun OpenAI-Compatible seperti
            Cloudeka Deka LLM / Ollama / OpenRouter), publikasikan kurikulum baru, dan audit aktivitas.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => resetDemo()}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold transition"
          >
            <RotateCcw className="w-4 h-4" strokeWidth={1.75} />
            Reset Demo ke Seed Awal
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex flex-wrap items-center gap-2 bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <button
          onClick={() => setActiveTab('ai')}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition ${
            activeTab === 'ai'
              ? 'bg-brand-blue text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Cpu className="w-4 h-4" strokeWidth={1.75} />
          1. Konfigurasi Engine Tanya AI (Multi-LLM & OpenAI-Compatible)
        </button>

        <button
          onClick={() => setActiveTab('content')}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition ${
            activeTab === 'content'
              ? 'bg-brand-blue text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <BookPlus className="w-4 h-4" strokeWidth={1.75} />
          2. Publikasi Course & Pengumuman Baru
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition ${
            activeTab === 'audit'
              ? 'bg-brand-blue text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <ShieldAlert className="w-4 h-4" strokeWidth={1.75} />
          3. System Audit Trail ({auditLogs.length})
        </button>
      </div>

      {/* TAB 1: TANYA AI CONFIGURATION */}
      {activeTab === 'ai' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <form
            onSubmit={handleSaveAiConfig}
            className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-6 shadow-xs space-y-6"
          >
            <div>
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
                Pilih Provider AI Co-Pilot
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Seluruh provider secara otomatis diperkaya dengan Grounded RAG Context dari 8
                Battlecard Produk, 6 Kurikulum Course, dan SOP Penjualan Lintasarta.
              </p>
            </div>

            {/* 4 Provider Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {(
                [
                  {
                    id: 'deterministic',
                    name: 'Grounded RAG Synthesizer (Built-in)',
                    badge: 'Zero API Key · Instant',
                    desc: 'Mesin sintesis deterministik lokal berbasis korpus Battlecard & Transkrip Video Lintasarta.',
                  },
                  {
                    id: 'gemini',
                    name: 'Google Gemini API',
                    badge: 'gemini-2.5-flash / pro',
                    desc: 'Koneksi langsung ke Google Generative Language API dengan grounding kurikulum.',
                  },
                  {
                    id: 'openai',
                    name: 'OpenAI Official API',
                    badge: 'gpt-4o / gpt-4o-mini',
                    desc: 'Menggunakan endpoint standar api.openai.com/v1/chat/completions.',
                  },
                  {
                    id: 'openai-compatible',
                    name: 'OpenAI-Compatible API (Custom Endpoint)',
                    badge: 'Cloudeka Deka LLM · Ollama · vLLM · OpenRouter',
                    desc: 'Gunakan endpoint kustom berstandar OpenAI (/v1/chat/completions) milik korporasi atau lokal.',
                  },
                ] as const
              ).map((item) => {
                const isSelected = provider === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelectProvider(item.id)}
                    className={`p-4 rounded-2xl border text-left transition flex flex-col justify-between gap-2 ${
                      isSelected
                        ? 'border-brand-blue bg-sky-50/70 dark:bg-sky-950/40 ring-2 ring-brand-blue/30'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] font-bold text-brand-blue dark:text-sky-400">
                          {item.badge}
                        </span>
                        {isSelected && (
                          <CheckCircle2
                            className="w-4 h-4 text-brand-blue shrink-0"
                            strokeWidth={2}
                          />
                        )}
                      </div>
                      <div className="text-sm font-extrabold text-slate-900 dark:text-white">
                        {item.name}
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      {item.desc}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Quick Presets for OpenAI-Compatible */}
            {provider === 'openai-compatible' && (
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2.5">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-200 block">
                  Preset Endpoint OpenAI-Compatible Populer (Klik untuk isi otomatis):
                </span>
                <div className="flex flex-wrap gap-2">
                  {[
                    {
                      label: 'Cloudeka Deka LLM (Sovereign AI)',
                      url: 'https://dekallm.cloudeka.id/v1',
                      m: 'qwen2.5-72b-instruct',
                    },
                    {
                      label: 'OpenRouter',
                      url: 'https://openrouter.ai/api/v1',
                      m: 'google/gemini-2.5-flash',
                    },
                    {
                      label: 'Ollama Local',
                      url: 'http://localhost:11434/v1',
                      m: 'llama3.1:8b',
                    },
                    {
                      label: 'Groq Cloud',
                      url: 'https://api.groq.com/openai/v1',
                      m: 'llama-3.3-70b-versatile',
                    },
                  ].map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => {
                        setBaseUrl(preset.url);
                        setModel(preset.m);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:border-brand-blue transition"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Connection Parameters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Server className="w-3.5 h-3.5 text-brand-blue" strokeWidth={1.75} />
                  Base URL Endpoint
                </label>
                <input
                  type="text"
                  value={baseUrl}
                  onChange={(e) => setBaseUrl(e.target.value)}
                  disabled={provider === 'deterministic'}
                  placeholder="https://api.openai.com/v1"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono text-slate-900 dark:text-white disabled:opacity-50"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-brand-blue" strokeWidth={1.75} />
                  Nama Model (Model ID)
                </label>
                <input
                  type="text"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  disabled={provider === 'deterministic'}
                  placeholder="gpt-4o-mini / gemini-2.5-flash / qwen2.5-72b"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono text-slate-900 dark:text-white disabled:opacity-50"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-brand-blue" strokeWidth={1.75} />
                  API Key / Bearer Token
                </label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  disabled={provider === 'deterministic'}
                  placeholder={
                    provider === 'deterministic'
                      ? 'Tidak memerlukan API Key'
                      : 'sk-... atau AIza...'
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono text-slate-900 dark:text-white disabled:opacity-50"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-brand-blue" strokeWidth={1.75} />
                    Temperature
                  </span>
                  <span className="font-mono font-bold text-brand-blue">{temperature}</span>
                </label>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.1}
                  value={temperature}
                  onChange={(e) => setTemperature(Number(e.target.value))}
                  className="w-full accent-brand-blue cursor-pointer mt-2"
                />
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="submit"
                disabled={savingAi}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-blue hover:bg-brand-navy text-white text-xs font-bold transition shadow-xs"
              >
                <Save className="w-4 h-4" strokeWidth={1.75} />
                {savingAi ? 'Menyimpan Konfigurasi...' : 'Simpan Konfigurasi AI'}
              </button>

              <button
                type="button"
                onClick={() => {
                  setChatOpen(true);
                  sendAiPrompt(
                    'Jelaskan keunggulan Deka GPU Lintasarta untuk beban kerja Sovereign AI dan sebutkan produk cross-sell yang relevan.'
                  );
                }}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-800 dark:text-amber-300 border border-amber-400/40 text-xs font-bold transition"
              >
                <Sparkles className="w-4 h-4" strokeWidth={1.75} />
                Uji Coba Live di Panel Tanya AI
              </button>
            </div>
          </form>

          {/* Right Sidebar: RAG Corpus Health */}
          <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-xs space-y-4">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Grounded Knowledge Base Status
            </span>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Indeks RAG Lintasarta Aktif
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Setiap pertanyaan AE ke Tanya AI secara otomatis mencocokkan entitas produk, modul
              video, dan SOP sebelum dikirim ke LLM pilihan Anda. Jika API eksternal gagal/offline,
              sistem otomatis melakukan <strong>graceful fallback</strong> ke Grounded RAG
              Synthesizer tanpa error.
            </p>
            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-between">
                <span className="font-semibold">Battlecard Produk Terindeks</span>
                <span className="font-mono font-bold text-emerald-600">8 Produk × 12 Seksi</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-between">
                <span className="font-semibold">Transkrip & Chapter Video</span>
                <span className="font-mono font-bold text-emerald-600">6 Course × 5 Modul</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-between">
                <span className="font-semibold">SOP & Dokumen Toolkit</span>
                <span className="font-mono font-bold text-emerald-600">21 Dokumen Resmi</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CREATE COURSE & NEWS */}
      {activeTab === 'content' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* Create Course Form */}
          <form
            onSubmit={handleCreateCourse}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-6 shadow-xs space-y-4"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-sky-50 dark:bg-sky-950 text-brand-blue flex items-center justify-center">
                <BookPlus className="w-5 h-5" strokeWidth={1.75} />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                  Publikasikan Course Baru
                </h2>
                <p className="text-xs text-slate-500">
                  Otomatis men-generate struktur modul video, kuis, dan simulasi role-play.
                </p>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                Judul Lengkap Course
              </label>
              <input
                type="text"
                required
                value={courseTitle}
                onChange={(e) => setCourseTitle(e.target.value)}
                placeholder="Contoh: Sovereign AI & Deka GPU Enterprise Selling"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  Kategori
                </label>
                <select
                  value={courseCategory}
                  onChange={(e) => setCourseCategory(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white"
                >
                  <option value="Connectivity">Connectivity</option>
                  <option value="Data Center">Data Center</option>
                  <option value="Cloud & AI">Cloud & AI</option>
                  <option value="Cybersecurity">Cybersecurity</option>
                  <option value="Sales Skills">Sales Skills</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  Track Sertifikasi
                </label>
                <input
                  type="text"
                  value={courseCert}
                  onChange={(e) => setCourseCert(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                Deskripsi Ringkas
              </label>
              <textarea
                rows={2}
                value={courseDesc}
                onChange={(e) => setCourseDesc(e.target.value)}
                placeholder="Ringkasan tujuan pembelajaran bagi Account Executive..."
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                Target Kompetensi (1 poin per baris)
              </label>
              <textarea
                rows={3}
                value={courseOutcomes}
                onChange={(e) => setCourseOutcomes(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
              />
            </div>

            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-brand-blue hover:bg-brand-navy text-white text-xs font-bold transition"
            >
              <Plus className="w-4 h-4" strokeWidth={2} />
              Publikasikan Course ke Katalog
            </button>
          </form>

          {/* Create News Form */}
          <form
            onSubmit={handleCreateNews}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-6 shadow-xs space-y-4"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 flex items-center justify-center">
                <Newspaper className="w-5 h-5" strokeWidth={1.75} />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                  Terbitkan Berita / Update Komersial
                </h2>
                <p className="text-xs text-slate-500">
                  Tampil langsung di Beranda AE dan halaman Berita Produk.
                </p>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                Kategori Tag
              </label>
              <select
                value={newsTag}
                onChange={(e) => setNewsTag(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white"
              >
                <option value="Update Produk">Update Produk</option>
                <option value="Kebijakan Komersial">Kebijakan Komersial</option>
                <option value="Win Story">Win Story</option>
                <option value="Sertifikasi">Sertifikasi</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                Judul Pengumuman
              </label>
              <input
                type="text"
                required
                value={newsTitle}
                onChange={(e) => setNewsTitle(e.target.value)}
                placeholder="Contoh: Kapasitas Baru Deka GPU H100 Tersedia di DC Technopark"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                Isi Pengumuman
              </label>
              <textarea
                rows={5}
                required
                value={newsBody}
                onChange={(e) => setNewsBody(e.target.value)}
                placeholder="Tuliskan poin penting yang perlu diketahui oleh Account Executive..."
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
              />
            </div>

            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-brand-navy hover:bg-brand-blue text-white text-xs font-bold transition"
            >
              <Plus className="w-4 h-4" strokeWidth={2} />
              Terbitkan Pengumuman
            </button>
          </form>
        </div>
      )}

      {/* TAB 3: AUDIT LOGS */}
      {activeTab === 'audit' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
              System Audit Trail (SQLite Persistent Log)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Rekaman real-time setiap aktivitas login, perubahan konfigurasi AI, kelulusan kuis,
              dan penugasan tim.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-[11px] font-bold uppercase text-slate-400 bg-slate-50/60 dark:bg-slate-800/40">
                  <th className="py-3 px-4">Waktu</th>
                  <th className="py-3 px-4">Aktor</th>
                  <th className="py-3 px-4">Aksi</th>
                  <th className="py-3 px-4">Detail Aktivitas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-4 font-mono text-slate-400 whitespace-nowrap">
                      {log.createdAt}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                      {log.actor}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-sky-50 dark:bg-sky-950 text-brand-blue dark:text-sky-300">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-300">{log.detail}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

