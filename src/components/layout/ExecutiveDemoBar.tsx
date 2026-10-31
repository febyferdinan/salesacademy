import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Smartphone, RotateCcw, Grid, X, ShieldCheck, Users, UserCheck } from 'lucide-react';
import { useAcademyStore } from '../../store/useAcademyStore';

export const ExecutiveDemoBar: React.FC = () => {
  const navigate = useNavigate();
  const {
    activeRole,
    loggedIn,
    switchRole,
    resetDemo,
    demoBarMinimized,
    setDemoBarMinimized,
    mobileFrameOpen,
    setMobileFrameOpen,
  } = useAcademyStore();

  // Hide inside mobile preview iframe
  if (typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('frame')) {
    return null;
  }

  return (
    <>
      <div
        className="fixed bottom-4 left-4 z-40 flex items-center gap-1.5 p-1.5 rounded-full bg-la-navy/95 text-white border border-white/15 shadow-2xl backdrop-blur-md text-xs"
        aria-label="Kontrol Persona & Demo"
      >
        <button
          type="button"
          onClick={() => setDemoBarMinimized(!demoBarMinimized)}
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 font-semibold transition"
          title={demoBarMinimized ? 'Tampilkan kontrol peran' : 'Sembunyikan kontrol peran'}
        >
          {demoBarMinimized ? (
            <>
              <Grid className="w-3.5 h-3.5 text-sky-300" strokeWidth={1.5} />
              <span>Persona</span>
            </>
          ) : (
            <X className="w-3.5 h-3.5" strokeWidth={1.5} />
          )}
        </button>

        {!demoBarMinimized && (
          <>
            <span className="hidden sm:inline-block px-2 text-[11px] text-slate-400 font-medium">
              Lihat sebagai:
            </span>
            <button
              type="button"
              onClick={async () => {
                await switchRole('sales');
                navigate('/dashboard');
              }}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-semibold transition ${
                loggedIn && activeRole === 'sales'
                  ? 'bg-la-blue text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" strokeWidth={1.5} />
              <span>Sales (Raka)</span>
            </button>

            <button
              type="button"
              onClick={async () => {
                await switchRole('leader');
                navigate('/team');
              }}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-semibold transition ${
                loggedIn && activeRole === 'leader'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Users className="w-3.5 h-3.5" strokeWidth={1.5} />
              <span>Sales Leader (Budi)</span>
            </button>

            <button
              type="button"
              onClick={async () => {
                await switchRole('admin');
                navigate('/admin');
              }}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-semibold transition ${
                loggedIn && activeRole === 'admin'
                  ? 'bg-violet-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" strokeWidth={1.5} />
              <span>Admin &amp; AI</span>
            </button>

            <span className="w-px h-4 bg-white/15 mx-0.5 hidden md:inline-block" />

            <button
              type="button"
              onClick={() => setMobileFrameOpen(true)}
              className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition"
            >
              <Smartphone className="w-3.5 h-3.5" strokeWidth={1.5} />
              <span>Mobile</span>
            </button>

            <button
              type="button"
              onClick={async () => {
                await resetDemo();
                navigate('/dashboard');
              }}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition"
              title="Reset seluruh progress ke awal"
            >
              <RotateCcw className="w-3.5 h-3.5" strokeWidth={1.5} />
              <span className="hidden sm:inline">Reset</span>
            </button>
          </>
        )}
      </div>

      {/* Mobile Viewport Simulator Overlay */}
      {mobileFrameOpen && (
        <div
          onClick={() => setMobileFrameOpen(false)}
          className="fixed inset-0 z-50 bg-la-navy/85 backdrop-blur-md flex items-center justify-center p-6 gap-8"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-[390px] h-[812px] max-h-[90vh] rounded-[44px] border-[10px] border-slate-800 bg-canvas shadow-2xl overflow-hidden relative"
          >
            <iframe
              title="Tampilan Mobile LA Sales Academy"
              src={`${window.location.origin}/?frame=1`}
              className="w-full h-full border-0"
            />
          </div>
          <div
            onClick={(e) => e.stopPropagation()}
            className="hidden lg:flex flex-col gap-3 max-w-xs text-white"
          >
            <span className="px-3 py-1 rounded-full bg-white/10 text-sky-300 text-xs font-bold w-fit">
              Mobile Field View (390 × 812)
            </span>
            <h3 className="text-2xl font-extrabold">Belajar &amp; Siapkan Pitch di Perjalanan</h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Account Executive mengakses Battlecard, Kalkulator ROI, dan Tanya AI dari smartphone
              5 menit sebelum masuk ke ruang meeting pelanggan.
            </p>
            <button
              type="button"
              onClick={() => setMobileFrameOpen(false)}
              className="mt-2 px-5 py-2.5 rounded-xl bg-white text-la-navy font-bold text-sm hover:bg-slate-100 transition w-fit"
            >
              Tutup Simulasi Mobile
            </button>
          </div>
        </div>
      )}
    </>
  );
};

