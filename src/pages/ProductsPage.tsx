import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, ArrowRight, Calculator, Sparkles } from 'lucide-react';
import { AppShell } from '../components/layout/AppShell';
import { useAcademyStore } from '../store/useAcademyStore';

export const ProductsPage: React.FC = () => {
  const navigate = useNavigate();
  const { products } = useAcademyStore();

  const groups: ('Connectivity' | 'Data Center & Cloud' | 'Security & Collaboration')[] = [
    'Connectivity',
    'Data Center & Cloud',
    'Security & Collaboration',
  ];

  return (
    <AppShell
      title="Product Mapping"
      subtitle="Peta 8 produk unggulan Lintasarta lengkap dengan 12 bagian Battlecard & Kalkulator ROI"
    >
      <div className="space-y-6">
        {groups.map((groupName) => {
          const items = products.filter((p) => p.group === groupName);
          return (
            <div
              key={groupName}
              className="p-6 rounded-3xl bg-surface border border-line shadow-card space-y-4"
            >
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h2 className="text-lg font-extrabold text-ink">{groupName}</h2>
                <span className="text-xs text-muted-custom">
                  {items.length} solusi enterprise tervalidasi
                </span>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map((prod) => (
                  <button
                    key={prod.id}
                    type="button"
                    onClick={() => navigate(`/product/${prod.slug}`)}
                    className="text-left p-5 rounded-2xl bg-canvas hover:bg-subtle/60 border border-line hover:border-la-blue/50 transition flex flex-col justify-between gap-4 group"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <b className="text-base font-extrabold text-ink group-hover:text-la-blue transition">
                          {prod.name}
                        </b>
                        <ArrowRight
                          className="w-4 h-4 text-muted-custom group-hover:text-la-blue group-hover:translate-x-0.5 transition shrink-0"
                          strokeWidth={1.5}
                        />
                      </div>
                      <p className="text-xs text-muted-custom leading-relaxed line-clamp-2">
                        {prod.desc}
                      </p>
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-1 flex-wrap">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-la-greenSoft text-la-green text-[11px] font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5" strokeWidth={1.5} />
                        <span>{prod.sections.length} bagian · divalidasi</span>
                      </span>
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-la-blue">
                        <Calculator className="w-3.5 h-3.5" strokeWidth={1.5} />
                        <span>ROI Sim</span>
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </AppShell>
  );
};

