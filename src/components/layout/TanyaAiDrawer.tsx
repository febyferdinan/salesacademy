import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Sparkles,
  X,
  Send,
  RotateCcw,
  Settings2,
  ExternalLink,
  BookOpen,
  PlayCircle,
  FileText,
} from 'lucide-react';
import { useAcademyStore } from '../../store/useAcademyStore';

const SUGGESTIONS = [
  'Customer bilang broadband lebih murah',
  'Discovery questions untuk logistik',
  'Beda dedicated vs broadband?',
  'Keunggulan Cloudeka & Deka GPU?',
  'Kapan tawarkan SQURA SOC 24/7?',
];

export const TanyaAiDrawer: React.FC = () => {
  const navigate = useNavigate();
  const {
    chatOpen,
    setChatOpen,
    chatHistory,
    chatLoading,
    sendAiPrompt,
    clearAiChat,
    aiSettings,
  } = useAcademyStore();
  const [input, setInput] = useState('');
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [chatHistory, chatLoading, chatOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || chatLoading) return;
    const q = input;
    setInput('');
    await sendAiPrompt(q);
  };

  const renderFormattedText = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, i) => {
      const trimmed = line.trim();
      if (!trimmed) return <div key={i} className="h-2" />;

      // Format bold **text** and inline code `code`
      const parts = trimmed.split(/(\*\*.*?\*\*|`.*?`)/g);
      const renderedParts = parts.map((part, idx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={idx} className="font-bold">
              {part.slice(2, -2)}
            </strong>
          );
        }
        if (part.startsWith('`') && part.endsWith('`')) {
          return (
            <code
              key={idx}
              className="font-mono text-xs bg-la-ice dark:bg-slate-800 text-la-blue dark:text-sky-300 px-1.5 py-0.5 rounded"
            >
              {part.slice(1, -1)}
            </code>
          );
        }
        return part;
      });

      if (trimmed.startsWith('- ') || trimmed.startsWith('• ')) {
        return (
          <div key={i} className="flex items-start gap-2 pl-1 my-1">
            <span className="text-la-blue dark:text-sky-400 font-bold mt-0.5">•</span>
            <span className="flex-1">{renderedParts}</span>
          </div>
        );
      }
      if (/^\d+\.\s/.test(trimmed)) {
        const numMatch = trimmed.match(/^(\d+\.)\s(.*)$/);
        if (numMatch) {
          return (
            <div key={i} className="flex items-start gap-2 pl-1 my-1">
              <span className="text-la-blue dark:text-sky-400 font-bold font-mono text-xs mt-0.5">
                {numMatch[1]}
              </span>
              <span className="flex-1">{renderedParts}</span>
            </div>
          );
        }
      }
      return (
        <p key={i} className="leading-relaxed">
          {renderedParts}
        </p>
      );
    });
  };

  const providerBadgeLabel =
    aiSettings.provider === 'deterministic'
      ? 'Grounded RAG Engine'
      : `${aiSettings.provider.toUpperCase()} · ${aiSettings.model}`;

  return (
    <AnimatePresence>
      {chatOpen && (
        <motion.section
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.96 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          className="fixed bottom-20 right-4 md:bottom-6 md:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[430px] max-h-[80vh] flex flex-col rounded-3xl bg-surface border border-line shadow-2xl overflow-hidden"
          role="dialog"
          aria-label="Tanya AI"
        >
          {/* Header */}
          <div className="flex items-center gap-3 px-5 py-4 navy-gradient text-white">
            <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-sky-300" strokeWidth={1.5} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <b className="text-sm font-bold tracking-tight">Tanya AI Co-Pilot</b>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-white/15 text-sky-200 truncate">
                  {providerBadgeLabel}
                </span>
              </div>
              <p className="text-xs text-slate-300 truncate">
                Sumber: Battlecard &amp; Kurikulum Tervalidasi Lintasarta
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setChatOpen(false);
                navigate('/admin');
              }}
              title="Konfigurasi LLM Provider (Gemini / OpenAI / Compatible)"
              className="p-2 rounded-xl hover:bg-white/10 text-slate-200 transition"
            >
              <Settings2 className="w-4 h-4" strokeWidth={1.5} />
            </button>
            <button
              type="button"
              onClick={() => clearAiChat()}
              title="Bersihkan percakapan"
              className="p-2 rounded-xl hover:bg-white/10 text-slate-200 transition"
            >
              <RotateCcw className="w-4 h-4" strokeWidth={1.5} />
            </button>
            <button
              type="button"
              onClick={() => setChatOpen(false)}
              aria-label="Tutup Tanya AI"
              className="p-2 rounded-xl hover:bg-white/10 text-white transition"
            >
              <X className="w-5 h-5" strokeWidth={1.5} />
            </button>
          </div>

          {/* Messages */}
          <div
            ref={bodyRef}
            className="flex-1 overflow-y-auto p-4 space-y-3 bg-canvas max-h-[420px]"
          >
            {chatHistory.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.who === 'me' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[90%] rounded-2xl px-4 py-3 text-sm ${
                    m.who === 'me'
                      ? 'bg-la-blue text-white rounded-br-xs shadow-brand'
                      : 'bg-surface text-ink border border-line rounded-bl-xs shadow-xs'
                  }`}
                >
                  <div className="space-y-1">{renderFormattedText(m.text)}</div>

                  {m.citations && m.citations.length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-line/70 flex flex-wrap gap-1.5">
                      {m.citations.map((cit, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            navigate(cit.route);
                          }}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-la-ice dark:bg-slate-800 text-la-blue dark:text-sky-300 hover:bg-la-blue hover:text-white transition"
                        >
                          {cit.type === 'video' ? (
                            <PlayCircle className="w-3.5 h-3.5" strokeWidth={1.5} />
                          ) : cit.type === 'battlecard' ? (
                            <BookOpen className="w-3.5 h-3.5" strokeWidth={1.5} />
                          ) : (
                            <FileText className="w-3.5 h-3.5" strokeWidth={1.5} />
                          )}
                          <span>{cit.label}</span>
                          <ExternalLink className="w-3 h-3 opacity-70" strokeWidth={1.5} />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                {m.providerUsed && m.who === 'bot' && (
                  <span className="text-[10px] font-mono text-muted-custom mt-1 px-1">
                    Dijawab via {m.providerUsed}
                  </span>
                )}
              </div>
            ))}

            {chatLoading && (
              <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-surface border border-line w-fit text-xs text-muted-custom">
                <span className="flex gap-1">
                  <span className="w-2 h-2 rounded-full bg-la-blue animate-bounce" />
                  <span className="w-2 h-2 rounded-full bg-la-sky animate-bounce [animation-delay:150ms]" />
                  <span className="w-2 h-2 rounded-full bg-la-amber animate-bounce [animation-delay:300ms]" />
                </span>
                <span>Menyusun skrip dari Battlecard Lintasarta…</span>
              </div>
            )}
          </div>

          {/* Quick Suggestion Chips */}
          <div className="px-4 py-2.5 bg-surface border-t border-line flex gap-1.5 overflow-x-auto no-scrollbar">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => sendAiPrompt(s)}
                disabled={chatLoading}
                className="shrink-0 text-xs font-medium px-3 py-1.5 rounded-full bg-subtle text-la-blue dark:text-sky-300 hover:bg-la-blue hover:text-white transition"
              >
                {s}
              </button>
            ))}
          </div>

          {/* Input Form */}
          <form
            onSubmit={handleSubmit}
            className="p-3 bg-surface border-t border-line flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Tanya skrip objection, discovery, SLA, Cloudeka…"
              className="flex-1 bg-canvas border border-line rounded-xl px-3.5 py-2.5 text-sm text-ink placeholder:text-muted-custom focus:outline-none focus:ring-2 focus:ring-la-blue"
            />
            <button
              type="submit"
              disabled={!input.trim() || chatLoading}
              className="px-4 py-2.5 rounded-xl bg-la-blue hover:bg-la-bluePress disabled:opacity-50 text-white font-semibold text-sm flex items-center gap-1.5 transition shadow-brand"
            >
              <Send className="w-4 h-4" strokeWidth={1.5} />
            </button>
          </form>
        </motion.section>
      )}
    </AnimatePresence>
  );
};

