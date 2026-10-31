import type { AppStateSnapshot } from '../db.js';

export class DocumentService {
  private escapeHtml(str: string): string {
    return String(str).replace(/[&<>"']/g, (c) => {
      const map: Record<string, string> = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
      };
      return map[c] || c;
    });
  }

  public generateCertificateHtml(params: {
    recipientName: string;
    roleTitle: string;
    area: string;
    certName: string;
    certCode: string;
    issuedAt: string;
    score: number;
  }): string {
    const { recipientName, roleTitle, area, certName, certCode, issuedAt, score } = params;
    return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="utf-8" />
  <title>Sertifikat ${this.escapeHtml(certName)} — ${this.escapeHtml(recipientName)}</title>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&family=JetBrains+Mono:wght@500&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; }
    body {
      margin: 0;
      padding: 32px;
      font-family: 'Plus Jakarta Sans', sans-serif;
      background: #0B1A33;
      color: #0B1A33;
      display: flex;
      flex-direction: column;
      align-items: center;
      min-height: 100vh;
    }
    .toolbar {
      display: flex;
      gap: 12px;
      margin-bottom: 24px;
    }
    .btn {
      background: #0B6FD0;
      color: #fff;
      border: 0;
      padding: 10px 20px;
      border-radius: 10px;
      font-weight: 700;
      cursor: pointer;
      font-family: inherit;
    }
    .cert {
      width: 960px;
      max-width: 100%;
      background: #FFFFFF;
      border-radius: 24px;
      padding: 56px 64px;
      position: relative;
      border: 8px solid #39A3FF;
      box-shadow: 0 25px 70px rgba(0,0,0,0.45);
    }
    .badge {
      display: inline-block;
      background: #EAF3FD;
      color: #0B6FD0;
      font-weight: 700;
      padding: 6px 14px;
      border-radius: 999px;
      font-size: 13px;
      letter-spacing: 0.06em;
      text-transform: uppercase;
    }
    h1 {
      font-size: 40px;
      margin: 16px 0 8px;
      color: #0B1A33;
      letter-spacing: -0.02em;
    }
    .recipient {
      font-size: 34px;
      font-weight: 800;
      color: #0B6FD0;
      margin: 24px 0 6px;
      border-bottom: 2px solid #DCE5F0;
      display: inline-block;
      padding-bottom: 8px;
    }
    .meta-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
      margin-top: 40px;
      padding-top: 24px;
      border-top: 1px solid #DCE5F0;
    }
    .mono {
      font-family: 'JetBrains Mono', monospace;
      font-size: 14px;
      color: #0B1A33;
      font-weight: 600;
    }
    .label {
      font-size: 12px;
      color: #64748B;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 4px;
    }
    @media print {
      body { background: #fff; padding: 0; }
      .toolbar { display: none; }
      .cert { box-shadow: none; width: 100%; }
    }
  </style>
</head>
<body>
  <div class="toolbar">
    <button class="btn" onclick="window.print()">Cetak / Simpan sebagai PDF</button>
  </div>
  <div class="cert">
    <span class="badge">LA Sales Academy · Official Enterprise Certification</span>
    <h1>Sertifikat Kompetensi Penjualan</h1>
    <p style="color:#64748B;font-size:16px;margin:0">Diberikan secara resmi oleh PT Aplikanusa Lintasarta kepada:</p>
    <div class="recipient">${this.escapeHtml(recipientName)}</div>
    <p style="color:#33435E;font-size:15px;margin:4px 0 24px">${this.escapeHtml(roleTitle)} · Regional ${this.escapeHtml(area)}</p>
    <p style="font-size:16px;line-height:1.6;color:#33435E">
      Telah menyelesaikan seluruh kurikulum pembelajaran, simulasi studi kasus, serta lulus ujian kompetensi untuk kualifikasi:
    </p>
    <h2 style="font-size:28px;color:#0B1A33;margin:14px 0 4px">${this.escapeHtml(certName)}</h2>
    <p style="color:#12924F;font-weight:700;font-size:15px">Skor Evaluasi Akhir: ${score} / 100 (LULUS DENGAN PREDIKAT SANGAT BAIK)</p>
    <div class="meta-grid">
      <div>
        <div class="label">Kode Verifikasi Digital</div>
        <div class="mono">${this.escapeHtml(certCode)}</div>
      </div>
      <div>
        <div class="label">Tanggal Penerbitan</div>
        <div class="mono">${this.escapeHtml(issuedAt)}</div>
      </div>
      <div>
        <div class="label">Otorisasi</div>
        <div class="mono">Sales Enablement &amp; Commerce Ops</div>
      </div>
    </div>
  </div>
</body>
</html>`;
  }

  public generateBattlecardOrDocHtml(title: string, state: AppStateSnapshot): string {
    const cleanTitle = title.trim();
    const matchedProduct = state.products.find(
      (p) =>
        cleanTitle.toLowerCase().includes(p.name.toLowerCase()) ||
        p.name.toLowerCase().includes(cleanTitle.replace(/battlecard/i, '').trim().toLowerCase())
    );

    if (matchedProduct) {
      const sectionsHtml = matchedProduct.sections
        .map((s, idx) => {
          let inner = s.body || '';
          if (s.quotes) {
            inner = s.quotes
              .map(
                (q) =>
                  `<div style="background:#F4F8FD;border-left:4px solid #0B6FD0;padding:10px 14px;margin:8px 0;border-radius:8px"><strong>${this.escapeHtml(
                    q[0]
                  )}</strong><div style="font-size:12px;color:#64748B;margin-top:4px">${this.escapeHtml(
                    q[1]
                  )}</div></div>`
              )
              .join('');
          }
          if (s.pair) {
            inner = `<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
              <div style="background:#E5F6EC;padding:12px;border-radius:10px"><strong style="color:#12924F">DO (Lakukan)</strong><ul>${s.pair
                .map((x) => `<li>${this.escapeHtml(x[0])}</li>`)
                .join('')}</ul></div>
              <div style="background:#FDECEC;padding:12px;border-radius:10px"><strong style="color:#D33B3B">DON'T (Hindari)</strong><ul>${s.pair
                .map((x) => `<li>${this.escapeHtml(x[1])}</li>`)
                .join('')}</ul></div>
            </div>`;
          }
          return `<div style="border:1px solid #DCE5F0;border-radius:14px;padding:16px;margin-bottom:14px;break-inside:avoid">
            <div style="font-size:12px;font-weight:700;color:#0B6FD0;text-transform:uppercase">Bagian ${String(
              idx + 1
            ).padStart(2, '0')} · ${this.escapeHtml(s.label)}</div>
            <div style="margin-top:8px;font-size:14px;line-height:1.55;color:#0B1A33">${inner}</div>
          </div>`;
        })
        .join('');

      return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="utf-8" />
  <title>Battlecard — ${this.escapeHtml(matchedProduct.name)}</title>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Plus Jakarta Sans', sans-serif; margin: 0; padding: 32px; background: #F4F8FD; color: #0B1A33; }
    .container { max-width: 900px; margin: 0 auto; background: #fff; padding: 40px; border-radius: 20px; box-shadow: 0 10px 30px rgba(11,26,51,0.08); }
    .btn { background: #0B6FD0; color: #fff; border: 0; padding: 10px 18px; border-radius: 10px; font-weight: 700; cursor: pointer; margin-bottom: 20px; }
    @media print { body { background: #fff; padding: 0; } .btn { display: none; } .container { box-shadow: none; padding: 0; } }
  </style>
</head>
<body>
  <div style="max-width:900px;margin:0 auto">
    <button class="btn" onclick="window.print()">Cetak / Simpan PDF</button>
  </div>
  <div class="container">
    <div style="background:linear-gradient(118deg,#0A5DBE,#1F7FE6);color:#fff;padding:28px;border-radius:16px;margin-bottom:24px">
      <div style="font-size:12px;text-transform:uppercase;letter-spacing:0.08em;opacity:0.9">LA Sales Academy · Official Sales Battlecard</div>
      <h1 style="margin:8px 0;font-size:28px">${this.escapeHtml(matchedProduct.name)}</h1>
      <p style="margin:0;opacity:0.92;font-size:14px">${this.escapeHtml(matchedProduct.desc)}</p>
      <div style="margin-top:12px;font-size:12px;opacity:0.85">${this.escapeHtml(matchedProduct.validated)}</div>
    </div>
    ${sectionsHtml}
  </div>
</body>
</html>`;
    }

    // Generic document template for SOP / Toolkit / Deck
    return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="utf-8" />
  <title>${this.escapeHtml(cleanTitle)} — LA Sales Academy</title>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Plus Jakarta Sans', sans-serif; margin: 0; padding: 32px; background: #F4F8FD; color: #0B1A33; }
    .container { max-width: 840px; margin: 0 auto; background: #fff; padding: 40px; border-radius: 20px; box-shadow: 0 10px 30px rgba(11,26,51,0.08); }
    .btn { background: #0B6FD0; color: #fff; border: 0; padding: 10px 18px; border-radius: 10px; font-weight: 700; cursor: pointer; margin-bottom: 20px; }
    @media print { body { background: #fff; padding: 0; } .btn { display: none; } .container { box-shadow: none; padding: 0; } }
  </style>
</head>
<body>
  <div style="max-width:840px;margin:0 auto">
    <button class="btn" onclick="window.print()">Cetak / Simpan PDF</button>
  </div>
  <div class="container">
    <span style="background:#EAF3FD;color:#0B6FD0;padding:5px 12px;border-radius:999px;font-size:12px;font-weight:700">Dokumen Tervalidasi · PT Aplikanusa Lintasarta</span>
    <h1 style="margin:16px 0 8px;font-size:28px">${this.escapeHtml(cleanTitle)}</h1>
    <p style="color:#64748B;font-size:14px">Diterbitkan oleh Sales Enablement &amp; Commerce Operation · Oktober 2026</p>
    <hr style="border:0;border-top:1px solid #DCE5F0;margin:24px 0" />
    <h3>1. Tujuan &amp; Panduan Penggunaan</h3>
    <p style="line-height:1.65;color:#33435E">
      Dokumen <strong>${this.escapeHtml(cleanTitle)}</strong> ini merupakan referensi standar bagi Account Executive dan Sales Leader Lintasarta dalam mempersiapkan pertemuan pelanggan, menyusun proposal bernilai bisnis tinggi, dan memastikan kepatuhan proses komersial.
    </p>
    <h3>2. Poin Kunci Eksekusi Lapangan</h3>
    <ul style="line-height:1.75;color:#33435E">
      <li>Pastikan selalu memulai diskusi dari kebutuhan bisnis, aplikasi kritikal, dan potensi risiko downtime pelanggan.</li>
      <li>Gunakan data tervalidasi dari halaman Product Mapping (Internet Dedicated, SD-WAN, Metro Ethernet, Data Center Tier III, Cloudeka, Deka GPU, dan SQURA).</li>
      <li>Libatkan tim Presales dan Commerce Operation sesuai matriks otorisasi sebelum menjanjikan kustomisasi SLA.</li>
    </ul>
  </div>
</body>
</html>`;
  }
}

export const documentService = new DocumentService();

