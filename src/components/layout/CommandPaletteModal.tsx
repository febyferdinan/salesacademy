import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Search,
  X,
  BookOpen,
  Play,
  Map,
  Briefcase,
  FileText,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { useAcademyStore } from '../../store/useAcademyStore';

interface SearchEntry {
  group: string;
  title: string;
  meta: string;
  route: string;
  icon: 'book' | 'play' | 'map' | 'briefcase' | 'file' | 'sparkle';
  aiPrompt?: string;
}

export const CommandPaletteModal: React.FC = () => {
  const navigate = useNavigate();
  const {
    cmdkOpen,
    setCmdkOpen,
    courses,
    products,
    library,
    materials,
    toolkit,
    setChatOpen,
    sendAiPrompt,
  } = useAcademyStore();

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const allEntries = useMemo<SearchEntry[]>(() => {
    const list: SearchEntry[] = [];
    courses.forEach((c) => {
      list.push({
        group: 'Course',
        title: c.title,
        meta: `${c.category} · ${c.modules.length} modul`,
        route: `/course/${c.slug}`,
        icon: 'book',
      });
    });
    products.forEach((p) => {
      list.push({
        group: 'Produk & Battlecard',
        title: `${p.name} — Full Battlecard (12 Bagian)`,
        meta: p.cat,
        route: `/product/${p.slug}`,
        icon: 'map',
      });
      list.push({
        group: 'Produk & Battlecard',
        title: `Discovery Questions: ${p.name}`,
        meta: 'Bagian 09',
        route: `/product/${p.slug}?sec=discovery`,
        icon: 'map',
      });
      list.push({
        group: 'Produk & Battlecard',
        title: `Objection Handling: ${p.name}`,
        meta: 'Bagian 10',
        route: `/product/${p.slug}?sec=objection`,
        icon: 'map',
      });
    });
    library.forEach((v) => {
      list.push({
        group: 'Video Learning',
        title: v.title,
        meta: `${v.cat} · ${v.dur}`,
        route: `/player/${v.courseId}/${v.moduleNum}`,
        icon: 'play',
      });
    });
    materials.forEach((m) => {
      list.push({
        group: 'Academy Materials',
        title: m.name,
        meta: m.meta,
        route: '/library?tab=mat',
        icon: 'file',
      });
    });
    toolkit.forEach((t) => {
      list.push({
        group: 'Sales Toolkit',
        title: t.name,
        meta: `${t.cat} · ${t.type}`,
        route: `/toolkit?cat=${encodeURIComponent(t.cat || 'Semua')}`,
        icon: 'briefcase',
      });
    });
    return list;
  }, [courses, products, library, materials, toolkit]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      return allEntries.slice(0, 8);
    }
    const hits = allEntries
      .filter(
        (x) =>
          x.title.toLowerCase().includes(q) ||
          x.group.toLowerCase().includes(q) ||
          x.meta.toLowerCase().includes(q)
      )
      .slice(0, 8);
    hits.push({
      group: 'Tanya AI Co-Pilot',
      title: `Tanya AI: “${query.trim()}”`,
      meta: 'Jawab instan dari Battlecard',
      route: '#',
      icon: 'sparkle',
      aiPrompt: query.trim(),
    });
    return hits;
  }, [query, allEntries]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query, cmdkOpen]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCmdkOpen(!cmdkOpen);
      } else if (cmdkOpen && e.key === 'Escape') {
        setCmdkOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [cmdkOpen, setCmdkOpen]);

  const handleSelect = (item: SearchEntry) => {
    setCmdkOpen(false);
    setQuery('');
    if (item.aiPrompt) {
      setChatOpen(true);
      sendAiPrompt(item.aiPrompt);
      return;
    }
    navigate(item.route);
  };

  const renderIcon = (icon: SearchEntry['icon']) => {
    switch (icon) {
      case 'book':
        return <BookOpen className="w-4 h-4 text-la-blue" strokeWidth={1.5} />;
      case 'play':
        return <Play className="w-4 h-4 text-la-blue" strokeWidth={1.5} />;
      case 'map':
        return <Map className="w-4 h-4 text-emerald-600" strokeWidth={1.5} />;
      case 'briefcase':
        return <Briefcase className="w-4 h-4 text-amber-600" strokeWidth={1.5} />;
      case 'sparkle':
        return <Sparkles className="w-4 h-4 text-violet-600" strokeWidth={1.5} />;
      default:
        return <FileText className="w-4 h-4 text-slate-600" strokeWidth={1.5} />;
    }
  };

  return (
    <AnimatePresence>
      {cmdkOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setCmdkOpen(false)}
          className="fixed inset-0 z-50 bg-la-navy/60 backdrop-blur-xs flex items-start justify-center pt-16 px-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -12 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl rounded-3xl bg-surface border border-line shadow-2xl overflow-hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Pencarian Global"
          >
            <div className="flex items-center gap-3 px-5 py-4 border-b border-line">
              <Search className="w-5 h-5 text-la-blue shrink-0" strokeWidth={1.5} />
              <input
                type="text"
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    setSelectedIndex((i) => Math.min(i + 1, filtered.length - 1));
                  } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    setSelectedIndex((i) => Math.max(i - 1, 0));
                  } else if (e.key === 'Enter' && filtered[selectedIndex]) {
                    e.preventDefault();
                    handleSelect(filtered[selectedIndex]);
                  }
                }}
                placeholder="Cari course, produk (Internet Dedicated, Cloudeka, Deka GPU, SQURA), atau materi…"
                className="flex-1 bg-transparent text-base text-ink placeholder:text-muted-custom focus:outline-none"
              />
              <span className="hidden sm:inline-block text-xs font-mono px-2 py-1 rounded bg-subtle text-muted-custom">
                ESC
              </span>
              <button
                type="button"
                onClick={() => setCmdkOpen(false)}
                className="p-1.5 rounded-xl hover:bg-subtle text-muted-custom"
              >
                <X className="w-5 h-5" strokeWidth={1.5} />
              </button>
            </div>

            <div className="max-h-[420px] overflow-y-auto p-3 space-y-1">
              <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-muted-custom">
                {query.trim() ? 'Hasil Pencarian' : 'Sering Dicari oleh Tim Sales'}
              </div>
              {filtered.map((item, idx) => (
                <button
                  key={`${item.title}-${idx}`}
                  type="button"
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-2xl text-left transition ${
                    idx === selectedIndex
                      ? 'bg-la-ice dark:bg-slate-800/90 text-ink'
                      : 'hover:bg-subtle/60 text-ink-2'
                  }`}
                >
                  <div className="w-9 h-9 rounded-xl bg-surface border border-line flex items-center justify-center shrink-0">
                    {renderIcon(item.icon)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold truncate">{item.title}</div>
                    <div className="text-xs text-muted-custom truncate">
                      {item.group} · {item.meta}
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-custom shrink-0" strokeWidth={1.5} />
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

