import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Server, Sparkles, Cloud, Shield, Users, BookOpen } from 'lucide-react';
import { AppShell } from '../components/layout/AppShell';
import { useAcademyStore } from '../store/useAcademyStore';

export const CoursesPage: React.FC = () => {
  const navigate = useNavigate();
  const { courses, progress } = useAcademyStore();
  const [catFilter, setCatFilter] = useState('Semua');

  const categories = [
    'Semua',
    'Connectivity',
    'Data Center',
    'Cloudeka',
    'SQURA Cybersec',
    'Sales skill',
  ];

  const getCourseProgressPct = (courseId: string, modCount: number) => {
    const doneMods = progress.filter(
      (p) => p.courseId === courseId && p.status === 'done'
    ).length;
    if (courseId === 'internet-dedicated') {
      const m3Done = progress.some(
        (p) => p.courseId === 'internet-dedicated' && p.moduleNum === 3 && p.status === 'done'
      );
      return m3Done ? Math.max(74, Math.round((doneMods / modCount) * 100)) : 68;
    }
    return Math.round((doneMods / Math.max(1, modCount)) * 100);
  };

  const renderIcon = (icon: string) => {
    switch (icon) {
      case 'server':
        return <Server className="w-5 h-5 text-white" strokeWidth={1.5} />;
      case 'sparkle':
        return <Sparkles className="w-5 h-5 text-white" strokeWidth={1.5} />;
      case 'cloud':
        return <Cloud className="w-5 h-5 text-white" strokeWidth={1.5} />;
      case 'shield':
        return <Shield className="w-5 h-5 text-white" strokeWidth={1.5} />;
      case 'users':
        return <Users className="w-5 h-5 text-white" strokeWidth={1.5} />;
      case 'book':
        return <BookOpen className="w-5 h-5 text-white" strokeWidth={1.5} />;
      default:
        return <Play className="w-5 h-5 text-white fill-white" strokeWidth={1.5} />;
    }
  };

  const filtered = courses.filter((c) => catFilter === 'Semua' || c.category === catFilter);

  return (
    <AppShell
      title="Courses"
      subtitle={`Learning path Oktober 2026 · ${courses.length} kurikulum portofolio tersedia penuh`}
    >
      {/* Category Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setCatFilter(cat)}
            className={`px-4 py-2 rounded-full text-xs font-bold transition shrink-0 ${
              catFilter === cat
                ? 'bg-la-blue text-white shadow-brand'
                : 'bg-surface border border-line text-ink-2 hover:border-la-blue/40'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Course Cards Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((c) => {
          const pct = getCourseProgressPct(c.id, c.modules.length);
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => navigate(`/course/${c.slug}`)}
              className="text-left p-6 rounded-3xl bg-surface border border-line shadow-card hover:shadow-card-hover hover:border-la-blue/40 transition flex flex-col justify-between gap-4 group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span
                    className={`w-12 h-12 rounded-2xl ${c.g} flex items-center justify-center shadow-xs group-hover:scale-105 transition`}
                  >
                    {renderIcon(c.icon)}
                  </span>
                  {c.isNew && (
                    <span className="px-2.5 py-1 rounded-full bg-la-amberSoft text-amber-800 text-[11px] font-bold">
                      Baru
                    </span>
                  )}
                </div>

                <h3 className="text-base font-extrabold text-ink leading-snug group-hover:text-la-blue transition">
                  {c.title}
                </h3>
                <p className="text-xs text-muted-custom line-clamp-2 leading-relaxed">{c.lead}</p>
              </div>

              <div className="space-y-2.5 pt-2">
                <div className="flex items-center gap-2 text-xs">
                  <span className="px-2.5 py-0.5 rounded-full bg-subtle font-semibold text-ink-2">
                    {c.category}
                  </span>
                  <span className="text-muted-custom">{c.modules.length} modul</span>
                </div>

                <div className="grid grid-cols-12 gap-1 h-2">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <span
                      key={i}
                      className={`rounded-full ${
                        i < Math.round((pct / 100) * 12)
                          ? pct === 100
                            ? 'bg-la-green'
                            : 'bg-la-blue'
                          : 'bg-subtle'
                      }`}
                    />
                  ))}
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-muted-custom">
                    {pct === 100 ? 'Selesai (100%)' : pct ? `${pct}% selesai` : 'Belum mulai'}
                  </span>
                  <span className="font-bold text-la-blue group-hover:translate-x-0.5 transition">
                    Buka Course →
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </AppShell>
  );
};

