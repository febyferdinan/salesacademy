import type { AppStateSnapshot } from '../db.js';
import type { AiCitation, ChatMessage } from '../../shared/types.js';

interface RagChunk {
  title: string;
  content: string;
  citation: AiCitation;
  keywords: string[];
}

export class TanyaAiService {
  /**
   * Build searchable RAG corpus from all live courses, video transcripts, and product battlecards
   */
  private buildCorpus(state: AppStateSnapshot): RagChunk[] {
    const chunks: RagChunk[] = [];

    for (const prod of state.products) {
      const secText = prod.sections
        .map((s) => {
          const bodyClean = (s.body || '').replace(/<[^>]+>/g, ' ');
          const quotesClean = (s.quotes || []).map((q) => `${q[0]} (${q[1]})`).join(' | ');
          const pairClean = (s.pair || []).map((p) => `Do: ${p[0]}; Don't: ${p[1]}`).join(' | ');
          return `[${s.label}] ${bodyClean} ${quotesClean} ${pairClean}`;
        })
        .join('\n');

      chunks.push({
        title: `Battlecard ${prod.name} (${prod.cat})`,
        content: `${prod.name} — ${prod.desc}\n${secText}`,
        citation: {
          label: `Battlecard ${prod.name}`,
          route: `/product/${prod.slug}`,
          type: 'battlecard',
          sectionKey: 'diff',
        },
        keywords: [
          prod.name.toLowerCase(),
          prod.slug.toLowerCase(),
          prod.cat.toLowerCase(),
          ...prod.name.toLowerCase().split(/\s+/),
        ],
      });
    }

    for (const course of state.courses) {
      for (const mod of course.modules) {
        const subText = mod.subs.map((s) => `[${s.t}s] ${s.text}`).join(' ');
        const takeText = mod.takeaways.map((t) => `${t.title}: ${t.body}`).join(' | ');
        chunks.push({
          title: `${course.short} · Modul ${mod.n}: ${mod.title}`,
          content: `${course.title} (${mod.title} - ${mod.sub}). Takeaways: ${takeText}. Transkrip: ${subText}`,
          citation: {
            label: `${course.short} · Modul ${mod.n}`,
            route: `/player/${course.slug}/${mod.n}?t=0`,
            type: 'video',
            timestampSec: 0,
          },
          keywords: [
            course.short.toLowerCase(),
            mod.title.toLowerCase(),
            course.category.toLowerCase(),
          ],
        });
      }
    }

    return chunks;
  }

  private retrieveTopChunks(query: string, state: AppStateSnapshot, activeProductSlug?: string): RagChunk[] {
    const corpus = this.buildCorpus(state);
    const qLower = query.toLowerCase();
    const tokens = qLower.split(/[^a-z0-9]+/).filter((t) => t.length >= 2);

    const scored = corpus.map((chunk) => {
      let score = 0;
      const hay = (chunk.title + ' ' + chunk.content).toLowerCase();
      for (const tok of tokens) {
        if (chunk.keywords.some((k) => k.includes(tok))) score += 5;
        if (hay.includes(tok)) score += 2;
      }
      if (activeProductSlug && chunk.citation.route.includes(activeProductSlug)) {
        score += 4;
      }
      return { chunk, score };
    });

    scored.sort((a, b) => b.score - a.score);
    const top = scored.filter((s) => s.score > 0).slice(0, 3).map((s) => s.chunk);
    return top.length > 0 ? top : corpus.slice(0, 2);
  }

  /**
   * Deterministic Grounded RAG Synthesizer — works 100% offline/zero-config with rich domain scripts
   */
  public synthesizeDeterministicReply(
    prompt: string,
    state: AppStateSnapshot,
    ctx?: {
      activeProductSlug?: string;
      activeCourseId?: string;
      activeModuleNum?: number;
      videoTimestamp?: number;
    }
  ): { text: string; citations: AiCitation[] } {
    const s = prompt.toLowerCase();

    // 1. Pricing / Broadband / Murah / Mahal / ROI Objection
    if (/murah|harga|mahal|broadband|diskon|price|biaya|roi|downtime/.test(s)) {
      return {
        text: `**Strategi Menjawab Keberatan Harga ("Broadband Lebih Murah"):**\n\nJangan berdebat soal tarif per Mbps. Geser percakapan ke **Biaya Kerugian Downtime Bisnis**:\n1. **Tanyakan Aplikasi Kritikal:** *"Pak/Bu, jika sistem ERP, WMS, atau transaksi cabang terputus 1 jam di jam sibuk, berapa transaksi atau pengiriman yang tertahan?"*\n2. **Hitung Bersama (Rumus ROI):** \`Omzet per Jam × Jam Downtime per Bulan\`. Contoh: jika omzet Rp 25 Juta/jam dan broadband down 2 jam/bulan, kerugian mencapai **Rp 50 Juta/bulan**—jauh lebih besar dari selisih investasi Internet Dedicated.\n3. **Tekankan 3 Komitmen Kontrak:** Bandwidth murni **1:1 simetris**, pemantauan proaktif **NOC 24/7**, dan **SLA hingga 99,5%+** dengan restitusi resmi.`,
        citations: [
          {
            label: 'Battlecard Internet Dedicated · Objection',
            route: '/product/internet-dedicated?sec=objection',
            type: 'battlecard',
            sectionKey: 'objection',
          },
          {
            label: 'Video Modul 3 · 02:10',
            route: '/player/internet-dedicated/3?t=130',
            type: 'video',
            timestampSec: 130,
          },
          {
            label: 'Simulasi Role-Play Harga',
            route: '/simulator/internet-dedicated',
            type: 'course',
          },
        ],
      };
    }

    // 2. Discovery Questions / Logistik / Perbankan / Manufaktur / Meeting
    if (/discovery|pertanyaan|logistik|tanya|meeting|bank|manufaktur|ritel/.test(s)) {
      return {
        text: `**3 Discovery Questions Pembuka Kebutuhan (Tervalidasi Sales Enablement):**\n\n1. **Gali Business Impact:** *"Aplikasi operasional apa yang paling kritikal kalau koneksi terputus selama 1 jam di jam sibuk (mis. WMS gudang, ERP, atau POS kasir)?"*\n2. **Kuantifikasi Pain Terakhir:** *"Berapa lama insiden downtime terakhir dan apa dampaknya ke jadwal pengiriman atau SLA klien Bapak?"*\n3. **Tangkap Buying Trigger:** *"Apakah ada rencana membuka cabang/gudang baru, audit kepatuhan IT, atau migrasi beban kerja ke cloud tahun ini?"*\n\n💡 **Tips Lapangan:** Dengarkan 70% dan rangkum 3 prioritas customer sebelum mempresentasikan solusi Lintasarta.`,
        citations: [
          {
            label: 'Product Page · Bagian 09 Discovery Q',
            route: '/product/internet-dedicated?sec=discovery',
            type: 'battlecard',
            sectionKey: 'discovery',
          },
          {
            label: 'Course Discovery Questions',
            route: '/course/discovery',
            type: 'course',
          },
        ],
      };
    }

    // 3. Cloudeka / Deka GPU / AI / Cloud / Hyperscaler / Kurs / UU PDP
    if (/cloudeka|gpu|deka|cloud|ai|llm|aws|gcp|azure|kurs|dolar|pdp/.test(s)) {
      return {
        text: `**Positioning Cloudeka Sovereign Cloud & Deka GPU:**\n\n- **100% Data Residency di Indonesia:** Seluruh data disimpan & diproses di Data Center Tier III Lintasarta di Indonesia—mematuhi penuh **UU PDP**, regulasi **OJK/BI**, dan BUMN.\n- **Tagihan Rupiah Terprediksi & Zero Egress Surprise:** Bebas risiko lonjakan kurs USD dan biaya transfer data keluar (*egress fee*) yang sering membuat tagihan cloud asing membengkak 25–30%.\n- **Deka GPU untuk Private AI:** Klaster akselerator GPU NVIDIA enterprise di Indonesia agar korporasi bisa menjalankan Private LLM, e-KYC, dan analitik AI tanpa mengirim data rahasia keluar negeri.`,
        citations: [
          {
            label: 'Battlecard Cloudeka',
            route: '/product/cloudeka',
            type: 'battlecard',
          },
          {
            label: 'Battlecard Deka GPU',
            route: '/product/deka-gpu',
            type: 'battlecard',
          },
          {
            label: 'Course Cloudeka · Modul 1',
            route: '/player/cloudeka/1?t=0',
            type: 'video',
          },
        ],
      };
    }

    // 4. SQURA / Cybersecurity / SOC / DDoS / Firewall / Ransomware
    if (/squra|security|siber|soc|ddos|firewall|hack|ransomware|pentest|vapt/.test(s)) {
      return {
        text: `**Positioning SQURA Managed Security & Anti-DDoS:**\n\n- **Pertanyaan Pembuka Terbaik:** *"Jika terjadi anomali trafik atau indikasi serangan pada Sabtu pukul 02.00 dini hari, siapa yang memantau dan melakukan isolasi saat ini?"*\n- **Managed SOC 24/7:** Menggabungkan *People, Process, & Technology* tanpa customer harus merekrut 8–10 analis security internal.\n- **Clean Pipe Anti-DDoS di Hulu Backbone:** Menyaring serangan banjir trafik langsung di jaringan backbone Lintasarta sebelum menyentuh router pelanggan Internet Dedicated.`,
        citations: [
          {
            label: 'Battlecard SQURA Managed Security',
            route: '/product/squra-managed-security',
            type: 'battlecard',
          },
          {
            label: 'Course SQURA · Modul 1',
            route: '/player/squra/1?t=0',
            type: 'video',
          },
        ],
      };
    }

    // 5. Data Center / Colocation / Tier III / DRC / Server
    if (/data center|colocation|tier|drc|server|rak|rack|ups/.test(s)) {
      return {
        text: `**Positioning Data Center Tier III & DRC Lintasarta:**\n\n- **Concurrent Maintainability (Uptime 99,982%):** Seluruh jalur daya dan pendingin presisi memiliki redundansi N+1 sehingga pemeliharaan dilakukan tanpa mematikan server.\n- **Efisiensi CAPEX ke OPEX:** Menghemat CAPEX miliaran rupiah untuk peremajaan UPS ganda, PAC, genset, dan pemadam gas di ruang server kantor.\n- **Smart Hands 24/7 & Kepatuhan Audit:** Engineer on-site siap membantu 24/7 dan fasilitas telah tersertifikasi ISO 27001, PCI-DSS, serta standar OJK/BI.`,
        citations: [
          {
            label: 'Battlecard Data Center Tier III',
            route: '/product/data-center-tier-3',
            type: 'battlecard',
          },
          {
            label: 'Course Data Center · Modul 1',
            route: '/player/dc/1?t=55',
            type: 'video',
            timestampSec: 55,
          },
        ],
      };
    }

    // 6. Cabang / SD-WAN / Metro Ethernet / Differentiator / SLA
    if (/cabang|branch|sd-wan|metro|beda|pembeda|dedicated|sla|differentiator/.test(s)) {
      return {
        text: `**Pembeda Utama Konektivitas Enterprise Lintasarta (Dedicated, SD-WAN & Metro Ethernet):**\n\n- **Bandwidth Dedicated 1:1 Simetris:** Tidak dibagi dengan pelanggan lain; performa upload & download tetap konsisten di jam sibuk.\n- **SLA Terukur dengan Restitusi Resmi:** Komitmen ketersediaan tertulis di kontrak lengkap dengan kompensasi tagihan.\n- **NOC Proaktif 24/7:** Mendeteksi gangguan lebih awal sebelum cabang melapor.\n- **Strategi Multi-Cabang:** Gunakan **Internet Dedicated** di HQ & hub utama, lalu padukan dengan **SD-WAN Managed Service** untuk orkestrasi aplikasi terpusat dan failover otomatis.`,
        citations: [
          {
            label: 'Modul 3 · Key Differentiator (01:35)',
            route: '/player/internet-dedicated/3?t=95',
            type: 'video',
            timestampSec: 95,
          },
          {
            label: 'Battlecard SD-WAN',
            route: '/product/sd-wan',
            type: 'battlecard',
          },
          {
            label: 'Battlecard Internet Dedicated',
            route: '/product/internet-dedicated?sec=diff',
            type: 'battlecard',
            sectionKey: 'diff',
          },
        ],
      };
    }

    // Default Grounded Retrieval over top matching chunks
    const topChunks = this.retrieveTopChunks(prompt, state, ctx?.activeProductSlug);
    const summaryPoints = topChunks
      .map((c) => `- **${c.title}:** ${c.content.slice(0, 220)}...`)
      .join('\n');

    return {
      text: `Berikut panduan yang relevan dari materi tervalidasi **LA Sales Academy** untuk pertanyaan Anda:\n\n${summaryPoints}\n\nAnda dapat mengklik lencana sumber di bawah untuk membuka bagian Battlecard atau memutar ulang bab video terkait, atau tanyakan spesifik mengenai **keberatan harga**, **discovery questions**, **Cloudeka/Deka GPU**, **Data Center Tier III**, maupun **SQURA**.`,
      citations: topChunks.map((c) => c.citation),
    };
  }

  /**
   * Execute chat completion against configured provider (Gemini, OpenAI, OpenAI-Compatible, or Deterministic RAG)
   */
  public async generateReply(
    prompt: string,
    state: AppStateSnapshot,
    ctx?: {
      activeProductSlug?: string;
      activeCourseId?: string;
      activeModuleNum?: number;
      videoTimestamp?: number;
    }
  ): Promise<ChatMessage> {
    const cfg = state.aiSettings;
    const topChunks = this.retrieveTopChunks(prompt, state, ctx?.activeProductSlug);
    const ragContext = topChunks
      .map((c, i) => `[SUMBER ${i + 1}: ${c.title}]\n${c.content.slice(0, 700)}`)
      .join('\n\n');

    const systemInstruction = `Kamu adalah "Tanya AI", asisten Sales Enablement & Presales Co-Pilot resmi untuk Account Executive di Lintasarta (LA Sales Academy).
Gunakan Bahasa Indonesia yang profesional, ringkas, taktis, dan berorientasi pada Consultative Selling B2B.
Jawab pertanyaan hanya berdasarkan materi resmi Lintasarta berikut:
${ragContext}

Aturan penting:
1. Berikan poin-poin skrip percakapan atau langkah taktis yang langsung bisa diucapkan Sales ke customer.
2. Untuk keberatan harga vs broadband, selalu tekankan rasio 1:1 simetris, SLA terukur dengan restitusi, NOC 24/7, dan rumus kerugian downtime bisnis per jam.
3. Jaga jawaban tetap ringkas (maksimal 160 kata).`;

    // If deterministic mode or no API key provided for cloud providers, use deterministic RAG
    if (cfg.provider === 'deterministic' || !cfg.apiKey?.trim()) {
      const det = this.synthesizeDeterministicReply(prompt, state, ctx);
      return {
        id: `msg-${Date.now()}`,
        who: 'bot',
        text: det.text,
        citations: det.citations,
        providerUsed: 'LA Grounded RAG Engine',
        createdAt: new Date().toISOString(),
      };
    }

    try {
      let llmText = '';

      if (cfg.provider === 'gemini') {
        const model = cfg.model || 'gemini-2.5-flash';
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
          model
        )}:generateContent?key=${encodeURIComponent(cfg.apiKey.trim())}`;

        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: systemInstruction }] },
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: cfg.temperature ?? 0.3,
              maxOutputTokens: 600,
            },
          }),
          signal: AbortSignal.timeout(12000),
        });

        if (!res.ok) {
          throw new Error(`Gemini API HTTP ${res.status}`);
        }
        const data = (await res.json()) as {
          candidates?: { content?: { parts?: { text?: string }[] } }[];
        };
        llmText = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';
      } else if (cfg.provider === 'openai' || cfg.provider === 'openai-compatible') {
        const baseUrl =
          cfg.provider === 'openai'
            ? 'https://api.openai.com/v1'
            : (cfg.baseUrl || 'https://api.openai.com/v1').replace(/\/+$/, '');
        const url = `${baseUrl}/chat/completions`;

        const res = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${cfg.apiKey.trim()}`,
          },
          body: JSON.stringify({
            model: cfg.model || 'gpt-4o-mini',
            temperature: cfg.temperature ?? 0.3,
            max_tokens: 600,
            messages: [
              { role: 'system', content: systemInstruction },
              { role: 'user', content: prompt },
            ],
          }),
          signal: AbortSignal.timeout(12000),
        });

        if (!res.ok) {
          throw new Error(`OpenAI-Compatible API HTTP ${res.status}`);
        }
        const data = (await res.json()) as {
          choices?: { message?: { content?: string } }[];
        };
        llmText = data.choices?.[0]?.message?.content?.trim() || '';
      }

      if (!llmText) {
        throw new Error('Empty response from LLM provider');
      }

      return {
        id: `msg-${Date.now()}`,
        who: 'bot',
        text: llmText,
        citations: topChunks.map((c) => c.citation),
        providerUsed: `${cfg.provider.toUpperCase()} (${cfg.model}) + RAG`,
        createdAt: new Date().toISOString(),
      };
    } catch (err) {
      // Automatic zero-downtime fallback to deterministic RAG synthesizer
      const fallback = this.synthesizeDeterministicReply(prompt, state, ctx);
      return {
        id: `msg-${Date.now()}`,
        who: 'bot',
        text: fallback.text,
        citations: fallback.citations,
        providerUsed: 'LA Grounded RAG (Fallback Mode)',
        createdAt: new Date().toISOString(),
      };
    }
  }
}

export const tanyaAiService = new TanyaAiService();

