import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Info, Sparkles, CheckCircle2, X } from 'lucide-react';
import { toast } from 'sonner';
import { useAcademyStore } from '../store/useAcademyStore';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { users, ssoLogin, passwordLogin } = useAcademyStore();
  const salesUser = users.sales;
  const locked = salesUser.failedLogin >= 5;

  const [email, setEmail] = useState('raka.pratama@lintasarta.co.id');
  const [password, setPassword] = useState('');
  const [loadingSso, setLoadingSso] = useState(false);
  const [alertMsg, setAlertMsg] = useState<string | null>(null);
  const [inactiveModalOpen, setInactiveModalOpen] = useState(false);

  const handleSso = async () => {
    setLoadingSso(true);
    setTimeout(async () => {
      await ssoLogin();
      setLoadingSso(false);
      navigate('/dashboard');
    }, 450);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setAlertMsg('Masukkan password, atau masuk dengan SSO Lintasarta.');
      return;
    }
    const res = await passwordLogin(email, password);
    if (res.ok) {
      navigate('/dashboard');
    } else {
      setAlertMsg(res.message || 'Password salah.');
      setPassword('');
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-[1.15fr_1fr] bg-canvas">
      {/* Left Hero Brand Art */}
      <div className="relative overflow-hidden navy-gradient text-white p-8 sm:p-14 flex flex-col justify-between">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-la-sky/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 -left-20 w-80 h-80 rounded-full bg-la-blue/30 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl hero-gradient flex items-center justify-center font-extrabold text-lg shadow-brand">
            LA
          </div>
          <div>
            <div className="font-extrabold text-lg tracking-tight">LA Sales Academy</div>
            <div className="text-xs text-sky-300 font-medium">
              Lintasarta Growth &amp; Enablement
            </div>
          </div>
        </div>

        <div className="relative z-10 my-12 max-w-xl space-y-5">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-pill text-xs font-semibold text-sky-200">
            <Sparkles className="w-3.5 h-3.5" strokeWidth={1.5} />
            <span>Interactive Sales Enablement &amp; AI Co-Pilot</span>
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-[1.12]">
            Belajar hari ini, jualan lebih yakin besok.
          </h1>
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
            Course singkat, pemetaan 8 produk unggulan, simulasi role-play keberatan harga,
            kalkulator dampak bisnis, dan sertifikasi untuk tim Sales Lintasarta dalam satu tempat.
          </p>

          <div className="pt-4 flex flex-wrap gap-2">
            {['Discover', 'Learn', 'Practice', 'Apply', 'Prove', 'Recognize'].map((step, i) => (
              <span
                key={step}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold ${
                  i === 1 || i === 4
                    ? 'bg-la-sky text-la-navy shadow-sm'
                    : 'bg-white/10 text-slate-200 border border-white/15'
                }`}
              >
                {step}
              </span>
            ))}
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-6 text-xs text-slate-300 flex-wrap">
          <span className="inline-flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" strokeWidth={1.5} />6 Kurikulum
            Portofolio
          </span>
          <span className="inline-flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" strokeWidth={1.5} />8 Battlecard
            Tervalidasi
          </span>
          <span className="inline-flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" strokeWidth={1.5} />
            Tanya AI Multi-LLM &amp; RAG
          </span>
        </div>
      </div>

      {/* Right Auth Form */}
      <div className="flex items-center justify-center p-6 sm:p-12 bg-surface">
        <form onSubmit={handleSubmit} className="w-full max-w-md space-y-5" noValidate>
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">Masuk</h2>
            <p className="text-sm text-muted-custom mt-1">
              Gunakan akun kantor Lintasarta kamu untuk mengakses portal pembelajaran.
            </p>
          </div>

          <button
            type="button"
            disabled={loadingSso}
            onClick={handleSso}
            className="w-full h-12 rounded-2xl bg-la-blue hover:bg-la-bluePress disabled:opacity-60 text-white font-bold text-sm flex items-center justify-center gap-2.5 shadow-brand transition"
          >
            <Lock className="w-4 h-4" strokeWidth={1.5} />
            <span>
              {loadingSso ? 'Menghubungkan ke SSO…' : 'Masuk dengan akun Lintasarta (SSO)'}
            </span>
          </button>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-line" />
            <span className="shrink mx-3 text-xs text-muted-custom">atau dengan email kantor</span>
            <div className="flex-grow border-t border-line" />
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="em" className="block text-xs font-bold text-ink-2 mb-1.5">
                Email kantor
              </label>
              <input
                id="em"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="username"
                className="w-full h-11 px-3.5 rounded-xl bg-canvas border border-line text-sm text-ink focus:outline-none focus:ring-2 focus:ring-la-blue"
              />
            </div>

            <div>
              <label htmlFor="pw" className="block text-xs font-bold text-ink-2 mb-1.5">
                Password
              </label>
              <input
                id="pw"
                type="password"
                value={password}
                disabled={locked}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={locked ? 'Akun dikunci sementara' : 'Masukkan password kantor'}
                autoComplete="current-password"
                className={`w-full h-11 px-3.5 rounded-xl bg-canvas border text-sm text-ink focus:outline-none focus:ring-2 focus:ring-la-blue disabled:opacity-50 ${
                  salesUser.failedLogin > 0 ? 'border-la-red' : 'border-line'
                }`}
              />
            </div>
          </div>

          {(locked || salesUser.failedLogin > 0 || alertMsg) && (
            <div
              className={`p-3.5 rounded-2xl border text-xs flex items-start gap-2.5 ${
                locked
                  ? 'bg-la-redSoft border-la-red/30 text-la-red font-medium'
                  : 'bg-la-amberSoft border-la-amber/30 text-amber-900 font-medium'
              }`}
            >
              {locked ? (
                <Lock className="w-4 h-4 shrink-0 mt-0.5" strokeWidth={1.5} />
              ) : (
                <Info className="w-4 h-4 shrink-0 mt-0.5" strokeWidth={1.5} />
              )}
              <span>
                {locked
                  ? 'Akun dikunci 15 menit karena 5 kali salah password. Silakan gunakan tombol Masuk dengan SSO Lintasarta di atas.'
                  : alertMsg ||
                    `Password salah. Sisa ${5 - salesUser.failedLogin} percobaan sebelum akun dikunci 15 menit.`}
              </span>
            </div>
          )}

          <button
            type="submit"
            disabled={locked}
            className="w-full h-11 rounded-xl border border-line bg-canvas hover:bg-subtle disabled:opacity-50 text-ink font-bold text-sm transition"
          >
            Masuk dengan Password
          </button>

          <div className="flex items-center justify-between text-xs pt-1">
            <button
              type="button"
              onClick={() =>
                toast.success('Link reset password telah dikirim ke email kantor kamu.')
              }
              className="text-la-blue font-semibold hover:underline"
            >
              Lupa password?
            </button>
            <button
              type="button"
              onClick={() => setInactiveModalOpen(true)}
              className="text-la-blue font-semibold hover:underline"
            >
              Akun belum aktif?
            </button>
          </div>
        </form>
      </div>

      {/* Inactive Account Modal */}
      {inactiveModalOpen && (
        <div
          onClick={() => setInactiveModalOpen(false)}
          className="fixed inset-0 z-50 bg-la-navy/60 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-3xl bg-surface border border-line p-6 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-extrabold text-ink">Akun belum aktif?</h3>
              <button
                type="button"
                onClick={() => setInactiveModalOpen(false)}
                className="p-1.5 rounded-xl hover:bg-subtle text-muted-custom"
              >
                <X className="w-5 h-5" strokeWidth={1.5} />
              </button>
            </div>
            <p className="text-sm text-ink-2 leading-relaxed">
              Akun LA Sales Academy dibuat secara otomatis dari sinkronisasi data HCIS Lintasarta.
              Jika akun kamu belum aktif, silakan hubungi tim Commerce Operation:
            </p>
            <a
              href="mailto:commerce.operation@lintasarta.co.id"
              className="block p-3.5 rounded-2xl bg-subtle text-la-blue font-bold text-sm text-center"
            >
              commerce.operation@lintasarta.co.id
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

