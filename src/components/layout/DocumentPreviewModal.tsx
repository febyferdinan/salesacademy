import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Download, Printer, Award, FileCheck2, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { useAcademyStore } from '../../store/useAcademyStore';

export const DocumentPreviewModal: React.FC = () => {
  const { previewDoc, setPreviewDoc, users, activeRole, setChatOpen, sendAiPrompt } =
    useAcademyStore();
  const user = users[activeRole];

  if (!previewDoc) return null;

  const downloadUrl = `/api/v1/documents/download?type=${encodeURIComponent(
    previewDoc.type
  )}&title=${encodeURIComponent(previewDoc.title)}`;

  const handleOpenPrintable = () => {
    window.open(downloadUrl, '_blank', 'noopener,noreferrer');
    toast.success(`Membuka dokumen "${previewDoc.title}" siap cetak/simpan PDF.`);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setPreviewDoc(null)}
        className="fixed inset-0 z-50 bg-la-navy/65 backdrop-blur-xs flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-3xl max-h-[88vh] flex flex-col rounded-3xl bg-surface border border-line shadow-2xl overflow-hidden"
          role="dialog"
          aria-modal="true"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-line bg-subtle/40">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-2xl bg-la-blue text-white flex items-center justify-center shrink-0">
                {previewDoc.type === 'certificate' ? (
                  <Award className="w-5 h-5" strokeWidth={1.5} />
                ) : (
                  <FileCheck2 className="w-5 h-5" strokeWidth={1.5} />
                )}
              </div>
              <div className="min-w-0">
                <h2 className="text-base font-bold text-ink truncate">{previewDoc.title}</h2>
                <p className="text-xs text-muted-custom truncate">
                  {previewDoc.meta || 'PT Aplikanusa Lintasarta · Dokumen Tervalidasi'}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setPreviewDoc(null)}
              className="p-2 rounded-xl hover:bg-subtle text-muted-custom"
            >
              <X className="w-5 h-5" strokeWidth={1.5} />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-canvas">
            {previewDoc.type === 'certificate' && previewDoc.certData ? (
              <div className="rounded-3xl bg-white text-la-navy border-4 border-la-sky p-8 shadow-xl space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-la-ice text-la-blue">
                    LA Sales Academy · Official Certification
                  </span>
                  <span className="font-mono text-xs font-semibold text-slate-500">
                    ID: {previewDoc.certData.certCode}
                  </span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-la-navy">
                  Sertifikat Kompetensi Penjualan B2B
                </h3>
                <p className="text-sm text-slate-600">
                  Diberikan secara resmi oleh PT Aplikanusa Lintasarta kepada:
                </p>
                <div className="text-2xl font-extrabold text-la-blue border-b-2 border-slate-200 pb-2 inline-block">
                  {user.name}
                </div>
                <p className="text-sm text-slate-700 leading-relaxed">
                  Atas kelulusan ujian kompetensi, penguasaan value proposition produk, dan simulasi
                  keberatan pelanggan pada jalur sertifikasi:
                </p>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <div className="text-lg font-extrabold text-la-navy">
                      {previewDoc.certData.certName}
                    </div>
                    <div className="text-xs text-emerald-700 font-semibold mt-0.5">
                      Lulus Evaluasi Akhir · Skor {previewDoc.certData.score}/100
                    </div>
                  </div>
                  <div className="text-right font-mono text-xs text-slate-500">
                    <div>Diterbitkan: {previewDoc.certData.issuedAt}</div>
                    <div>Valid: 2026–2028</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl bg-surface border border-line p-6 space-y-5">
                <div className="p-5 rounded-2xl hero-gradient text-white">
                  <span className="text-[11px] font-bold uppercase tracking-wider opacity-90">
                    LA Sales Academy · Materi Siap Pakai
                  </span>
                  <h3 className="text-xl font-bold mt-1">{previewDoc.title}</h3>
                  <p className="text-sm text-white/90 mt-1.5 leading-relaxed">
                    {previewDoc.summary ||
                      'Panduan tervalidasi Product Team & Sales Enablement Lintasarta untuk persiapan pitching, discovery questions, dan penanganan keberatan pelanggan.'}
                  </p>
                </div>

                {previewDoc.sections && previewDoc.sections.length > 0 ? (
                  <div className="space-y-4">
                    {previewDoc.sections.map((sec, i) => (
                      <div
                        key={i}
                        className="p-4 rounded-2xl bg-canvas border border-line space-y-2"
                      >
                        <h4 className="text-sm font-bold text-la-blue">{sec.heading}</h4>
                        <ul className="list-disc pl-5 text-sm text-ink-2 space-y-1.5">
                          {sec.content.map((item, j) => (
                            <li key={j}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-canvas border border-line">
                      <h4 className="text-sm font-bold text-ink mb-2">
                        Poin Utama Penggunaan di Lapangan
                      </h4>
                      <ul className="list-disc pl-4 text-xs text-ink-2 space-y-1.5 leading-relaxed">
                        <li>Gunakan pada tahap Discovery dan penyusunan Proposal Eksekutif.</li>
                        <li>
                          Fokuskan percakapan pada jaminan SLA, kepastian bisnis, dan efisiensi OPEX.
                        </li>
                        <li>
                          Padukan dengan Kalkulator Kerugian Downtime saat menghadapi keberatan
                          harga.
                        </li>
                      </ul>
                    </div>
                    <div className="p-4 rounded-2xl bg-canvas border border-line">
                      <h4 className="text-sm font-bold text-ink mb-2">Validasi &amp; Kepatuhan</h4>
                      <ul className="list-disc pl-4 text-xs text-ink-2 space-y-1.5 leading-relaxed">
                        <li>Telah diverifikasi oleh Product Marketing &amp; Presales Lintasarta.</li>
                        <li>Sesuai dengan matriks otorisasi harga Commerce Operation 2026.</li>
                        <li>Dapat dicetak langsung sebagai lampiran PDF untuk nasabah.</li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="px-6 py-4 border-t border-line bg-surface flex items-center justify-between flex-wrap gap-3">
            <button
              type="button"
              onClick={() => {
                const title = previewDoc.title;
                setPreviewDoc(null);
                setChatOpen(true);
                sendAiPrompt(`Buatkan poin ringkas cara mempresentasikan ${title} ke customer`);
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-subtle text-la-blue dark:text-sky-300 text-xs font-semibold hover:bg-la-blue hover:text-white transition"
            >
              <Sparkles className="w-4 h-4" strokeWidth={1.5} />
              <span>Tanya AI Cara Pakai Materi Ini</span>
            </button>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setPreviewDoc(null)}
                className="px-4 py-2.5 rounded-xl border border-line text-xs font-semibold text-ink-2 hover:bg-subtle transition"
              >
                Tutup
              </button>
              <button
                type="button"
                onClick={handleOpenPrintable}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-la-blue hover:bg-la-bluePress text-white text-xs font-bold shadow-brand transition"
              >
                <Printer className="w-4 h-4" strokeWidth={1.5} />
                <Download className="w-4 h-4" strokeWidth={1.5} />
                <span>Buka &amp; Cetak PDF Resmi</span>
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

