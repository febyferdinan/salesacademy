import { describe, it, expect } from 'vitest';
import { app } from '../index.js';
import type { Course, ProductMapping, AiProviderSettings, ChatMessage } from '../../shared/types.js';

interface ApiEnvelope<T> {
  success: boolean;
  data: T;
}

describe('LA Sales Academy Production API Suite', () => {
  it('GET /api/v1/health returns healthy status envelope', async () => {
    const res = await app.request('/api/v1/health');
    expect(res.status).toBe(200);
    const json = (await res.json()) as ApiEnvelope<{ status: string }>;
    expect(json.success).toBe(true);
    expect(json.data.status).toBe('ok');
  });

  it('GET /api/v1/bootstrap returns complete 6 courses, 8 products, 15 team members, and 3 certifications', async () => {
    const res = await app.request('/api/v1/bootstrap');
    expect(res.status).toBe(200);
    const json = (await res.json()) as ApiEnvelope<{
      courses: Course[];
      products: ProductMapping[];
      team: unknown[];
      certs: unknown[];
    }>;
    expect(json.success).toBe(true);
    expect(json.data.courses).toHaveLength(6);
    expect(json.data.products).toHaveLength(8);
    expect(json.data.team).toHaveLength(15);
    expect(json.data.certs).toHaveLength(3);
    // Verify each product has all 12 Battlecard sections
    for (const prod of json.data.products) {
      expect(prod.sections).toHaveLength(12);
    }
  });

  it('POST /api/v1/auth/switch-role switches active persona between sales, leader, and admin', async () => {
    const res = await app.request('/api/v1/auth/switch-role', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: 'leader' }),
    });
    expect(res.status).toBe(200);
    const json = (await res.json()) as ApiEnvelope<{ activeRole: string }>;
    expect(json.success).toBe(true);
    expect(json.data.activeRole).toBe('leader');

    // Switch back to sales
    await app.request('/api/v1/auth/switch-role', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: 'sales' }),
    });
  });

  it('POST /api/v1/learning/quiz-submit grades quiz and passes on 100% score', async () => {
    // Reset demo first to ensure fresh module state
    await app.request('/api/v1/auth/reset-demo', { method: 'POST' });

    const bootRes = await app.request('/api/v1/bootstrap');
    const bootJson = (await bootRes.json()) as ApiEnvelope<{ courses: Course[] }>;
    const course = bootJson.data.courses.find((c) => c.id === 'internet-dedicated')!;
    const mod3 = course.modules.find((m) => m.n === 3)!;
    const correctAnswers = mod3.quiz.map((q) => q.a);

    const res = await app.request('/api/v1/learning/quiz-submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        courseId: 'internet-dedicated',
        moduleNum: 3,
        answers: correctAnswers,
      }),
    });
    expect(res.status).toBe(200);
    const json = (await res.json()) as ApiEnvelope<{
      passed: boolean;
      score: number;
      pointsAwarded: number;
    }>;
    expect(json.success).toBe(true);
    expect(json.data.passed).toBe(true);
    expect(json.data.score).toBe(correctAnswers.length);
    expect(json.data.pointsAwarded).toBe(120);
  });

  it('POST /api/v1/team/assign creates task assignments and notifies team members', async () => {
    const res = await app.request('/api/v1/team/assign', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        memberNames: ['Raka Pratama', 'Dimas Wahyu'],
        taskTitle: 'Selesaikan Course: Lintasarta Cloudeka & Deka GPU',
        dueDate: '2026-04-30',
        reminder: 'H-2 & Hari H',
        targetRoute: '/course/cloudeka',
      }),
    });
    expect(res.status).toBe(200);
    const json = (await res.json()) as ApiEnvelope<{ assignedCount: number }>;
    expect(json.success).toBe(true);
    expect(json.data.assignedCount).toBe(2);
  });

  it('PUT /api/v1/admin/ai-config supports openai-compatible provider configuration and POST /api/v1/ai/chat returns grounded response with citations', async () => {
    const cfgRes = await app.request('/api/v1/admin/ai-config', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        provider: 'openai-compatible',
        baseUrl: 'https://dekallm.cloudeka.id/v1',
        apiKey: '',
        model: 'qwen2.5-72b-instruct',
        temperature: 0.3,
      }),
    });
    expect(cfgRes.status).toBe(200);
    const cfgJson = (await cfgRes.json()) as ApiEnvelope<{ aiSettings: AiProviderSettings }>;
    expect(cfgJson.success).toBe(true);
    expect(cfgJson.data.aiSettings.provider).toBe('openai-compatible');
    expect(cfgJson.data.aiSettings.baseUrl).toBe('https://dekallm.cloudeka.id/v1');

    // Chat request should gracefully synthesize grounded response with citations
    const chatRes = await app.request('/api/v1/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: 'Bagaimana cara menjawab keberatan harga Internet Dedicated dibanding broadband?',
        activeProductSlug: 'internet-dedicated',
      }),
    });
    expect(chatRes.status).toBe(200);
    const chatJson = (await chatRes.json()) as ApiEnvelope<{ reply: ChatMessage }>;
    expect(chatJson.success).toBe(true);
    expect(chatJson.data.reply.who).toBe('bot');
    expect((chatJson.data.reply.citations || []).length).toBeGreaterThan(0);
  });

  it('GET /api/v1/documents/download generates printable HTML for Battlecards and Certificates', async () => {
    const res = await app.request(
      '/api/v1/documents/download?type=certificate&title=Connectivity%20Associate'
    );
    expect(res.status).toBe(200);
    const html = await res.text();
    expect(html).toContain('Sertifikat Kompetensi Penjualan');
    expect(html).toContain('Connectivity Associate');
  });
});
