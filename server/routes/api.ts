import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { repo, type AppStateSnapshot } from '../db.js';
import { tanyaAiService } from '../services/ai.service.js';
import { documentService } from '../services/document.service.js';
import {
  loginSchema,
  switchRoleSchema,
  progressUpdateSchema,
  quizSubmitSchema,
  roleplaySubmitSchema,
  certExamSubmitSchema,
  assignTaskSchema,
  memberActionSchema,
  aiChatRequestSchema,
  aiConfigUpdateSchema,
  adminCreateNewsSchema,
  adminCreateCourseSchema,
} from '../../shared/types.js';

export const apiRoutes = new Hono();

function sanitizeStateForClient(state: AppStateSnapshot) {
  const clone = structuredClone(state);
  const rawKey = clone.aiSettings.apiKey || '';
  clone.aiSettings.hasKeyConfigured = rawKey.trim().length > 0;
  if (rawKey.length > 8) {
    clone.aiSettings.apiKey = `${rawKey.slice(0, 4)}••••••••${rawKey.slice(-4)}`;
  } else if (rawKey.length > 0) {
    clone.aiSettings.apiKey = '••••••••';
  }
  return clone;
}

// Bootstrap full application state
apiRoutes.get('/bootstrap', (c) => {
  const state = repo.getState();
  return c.json({
    success: true,
    data: sanitizeStateForClient(state),
    meta: { auditLogs: repo.getRecentAuditLogs(15) },
  });
});

// Auth: Corporate SSO Golden Path
apiRoutes.post('/auth/sso', (c) => {
  const state = repo.getState();
  state.loggedIn = true;
  state.activeRole = 'sales';
  state.users.sales.failedLogin = 0;
  state.users.sales.lockedUntil = null;
  repo.saveState(state);
  repo.logAudit(state.users.sales.email, 'SSO_LOGIN', 'Authenticated via Lintasarta Corporate SSO');
  return c.json({ success: true, data: sanitizeStateForClient(state) });
});

// Auth: Email & Password with 5-attempt lockout simulation (FR-AUTH-02)
apiRoutes.post('/auth/login', zValidator('json', loginSchema), (c) => {
  const { email, password } = c.req.valid('json');
  const state = repo.getState();
  const salesUser = state.users.sales;

  // If currently locked out
  if (salesUser.failedLogin >= 5) {
    return c.json(
      {
        success: false,
        error: {
          code: 'ACCOUNT_LOCKED',
          message:
            'Akun dikunci 15 menit karena 5 kali salah password. Silakan gunakan tombol Masuk dengan SSO Lintasarta.',
        },
        data: sanitizeStateForClient(state),
      },
      429
    );
  }

  // Allow login if password is "Lintasarta2026!" or "sso", otherwise increment failedLogin per FR-AUTH-02
  if (password === 'Lintasarta2026!') {
    state.loggedIn = true;
    salesUser.failedLogin = 0;
    salesUser.lockedUntil = null;
    if (email.includes('budi')) state.activeRole = 'leader';
    else if (email.includes('dewi')) state.activeRole = 'admin';
    else state.activeRole = 'sales';
    repo.saveState(state);
    repo.logAudit(email, 'PASSWORD_LOGIN_SUCCESS', 'Authenticated with corporate credentials');
    return c.json({ success: true, data: sanitizeStateForClient(state) });
  }

  salesUser.failedLogin += 1;
  if (salesUser.failedLogin >= 5) {
    salesUser.lockedUntil = Date.now() + 15 * 60 * 1000;
    repo.logAudit(email, 'ACCOUNT_LOCKED', '5 consecutive failed password attempts');
  }
  repo.saveState(state);

  return c.json(
    {
      success: false,
      error: {
        code: salesUser.failedLogin >= 5 ? 'ACCOUNT_LOCKED' : 'INVALID_CREDENTIALS',
        message:
          salesUser.failedLogin >= 5
            ? 'Akun dikunci 15 menit karena 5 kali salah password. Coba lagi nanti, atau masuk dengan SSO.'
            : `Password salah. Sisa ${5 - salesUser.failedLogin} percobaan sebelum akun dikunci 15 menit.`,
      },
      data: sanitizeStateForClient(state),
    },
    401
  );
});

apiRoutes.post('/auth/logout', (c) => {
  const state = repo.getState();
  state.loggedIn = false;
  repo.saveState(state);
  return c.json({ success: true, data: sanitizeStateForClient(state) });
});

apiRoutes.post('/auth/switch-role', zValidator('json', switchRoleSchema), (c) => {
  const { role } = c.req.valid('json');
  const state = repo.getState();
  state.loggedIn = true;
  state.activeRole = role;
  repo.saveState(state);
  repo.logAudit(state.users[role].email, 'SWITCH_ROLE', `Switched persona to ${role}`);
  return c.json({ success: true, data: sanitizeStateForClient(state) });
});

apiRoutes.post('/auth/reset-demo', (c) => {
  const fresh = repo.resetState();
  return c.json({ success: true, data: sanitizeStateForClient(fresh) });
});

// Learning: Save playback progress
apiRoutes.post('/learning/progress', zValidator('json', progressUpdateSchema), (c) => {
  const { courseId, moduleNum, watchedSec } = c.req.valid('json');
  const state = repo.getState();
  const existing = state.progress.find(
    (p) => p.courseId === courseId && p.moduleNum === moduleNum
  );
  if (existing) {
    existing.watchedSec = Math.max(0, Math.floor(watchedSec));
    existing.updatedAt = new Date().toISOString();
  } else {
    state.progress.push({
      courseId,
      moduleNum,
      watchedSec: Math.max(0, Math.floor(watchedSec)),
      status: 'now',
      updatedAt: new Date().toISOString(),
    });
  }
  repo.saveState(state);
  return c.json({ success: true, data: sanitizeStateForClient(state) });
});

// Learning: Bookmark course
apiRoutes.post('/learning/bookmark/:courseId', (c) => {
  const courseId = c.req.param('courseId');
  const state = repo.getState();
  const u = state.users[state.activeRole];
  const idx = u.savedCourseIds.indexOf(courseId);
  const saved = idx === -1;
  if (saved) u.savedCourseIds.push(courseId);
  else u.savedCourseIds.splice(idx, 1);
  repo.saveState(state);
  return c.json({
    success: true,
    data: { saved, state: sanitizeStateForClient(state) },
  });
});

// Learning: Submit Quick Check Quiz
apiRoutes.post('/learning/quiz-submit', zValidator('json', quizSubmitSchema), (c) => {
  const { courseId, moduleNum, answers } = c.req.valid('json');
  const state = repo.getState();
  const course = state.courses.find((x) => x.id === courseId || x.slug === courseId);
  if (!course) {
    return c.json({ success: false, error: { code: 'NOT_FOUND', message: 'Course tidak ditemukan' } }, 404);
  }
  const mod = course.modules.find((m) => m.n === moduleNum);
  if (!mod || !mod.quiz.length) {
    return c.json({ success: false, error: { code: 'NOT_FOUND', message: 'Modul kuis tidak ditemukan' } }, 404);
  }

  const total = mod.quiz.length;
  const wrongItems = mod.quiz
    .map((q, i) => ({ q, i, chosen: answers[i] }))
    .filter(({ q, chosen }) => chosen !== q.a);
  const score = total - wrongItems.length;
  const passThreshold = Math.max(1, Math.ceil(total * 0.75));
  const passed = score >= passThreshold;

  let pointsAwarded = 0;
  if (passed) {
    let rec = state.progress.find(
      (p) => p.courseId === course.id && p.moduleNum === moduleNum
    );
    const alreadyDone = rec?.status === 'done';
    if (!rec) {
      rec = {
        courseId: course.id,
        moduleNum,
        watchedSec: mod.durationSec,
        status: 'done',
        score: [score, total],
        updatedAt: new Date().toISOString(),
      };
      state.progress.push(rec);
    } else {
      rec.status = 'done';
      rec.watchedSec = mod.durationSec;
      rec.score = [score, total];
      rec.updatedAt = new Date().toISOString();
    }

    // Unlock next module if exists
    const nextMod = course.modules.find((m) => m.n === moduleNum + 1);
    if (nextMod) {
      const nextRec = state.progress.find(
        (p) => p.courseId === course.id && p.moduleNum === nextMod.n
      );
      if (!nextRec) {
        state.progress.push({
          courseId: course.id,
          moduleNum: nextMod.n,
          watchedSec: 0,
          status: 'now',
          updatedAt: new Date().toISOString(),
        });
      }
    }

    if (!alreadyDone) {
      pointsAwarded = 120;
      state.users.sales.points += pointsAwarded;

      // Update Raka's row in Team Leader dashboard
      const rakaTeam = state.team.find((m) => m.name === 'Raka Pratama');
      if (rakaTeam) {
        rakaTeam.prog = Math.min(100, rakaTeam.prog + 8);
        rakaTeam.score = Math.min(100, rakaTeam.score + 2);
      }

      // Mark matching due task as done
      if (course.id === 'internet-dedicated' && moduleNum === 3) {
        const tsk = state.tasks.find((t) => t.id === 'tsk-1');
        if (tsk) tsk.state = 'done';
      }
    }

    repo.logAudit(
      state.users.sales.email,
      'QUIZ_PASSED',
      `Passed ${course.short} Modul ${moduleNum} (${score}/${total})`
    );
  }

  repo.saveState(state);
  return c.json({
    success: true,
    data: {
      score,
      total,
      passed,
      pointsAwarded,
      wrongTopics: wrongItems.map((w) => ({
        topic: w.q.topic,
        t: w.q.t,
        question: w.q.q,
      })),
      state: sanitizeStateForClient(state),
    },
  });
});

// Learning: Submit Customer Role-Play Simulation (Module 5)
apiRoutes.post('/learning/roleplay-submit', zValidator('json', roleplaySubmitSchema), (c) => {
  const { courseId, moduleNum, selectedOptionIds } = c.req.valid('json');
  const state = repo.getState();
  const course = state.courses.find((x) => x.id === courseId || x.slug === courseId);
  const mod = course?.modules.find((m) => m.n === moduleNum);
  if (!course || !mod || !mod.roleplay) {
    return c.json({ success: false, error: { code: 'NOT_FOUND', message: 'Simulasi tidak ditemukan' } }, 404);
  }

  const turns = mod.roleplay.turns;
  let totalScore = 0;
  turns.forEach((turn, idx) => {
    const picked = turn.options.find((o) => o.id === selectedOptionIds[idx]);
    if (picked) totalScore += picked.score;
  });
  const avgScore = Math.round(totalScore / Math.max(1, turns.length));
  const passed = avgScore >= 75;

  let pointsAwarded = 0;
  if (passed) {
    let rec = state.progress.find(
      (p) => p.courseId === course.id && p.moduleNum === moduleNum
    );
    const alreadyDone = rec?.status === 'done';
    if (!rec) {
      state.progress.push({
        courseId: course.id,
        moduleNum,
        watchedSec: mod.durationSec,
        status: 'done',
        score: [turns.length, turns.length],
        roleplayScore: avgScore,
        updatedAt: new Date().toISOString(),
      });
    } else {
      rec.status = 'done';
      rec.roleplayScore = avgScore;
      rec.score = [turns.length, turns.length];
      rec.updatedAt = new Date().toISOString();
    }

    if (!alreadyDone) {
      pointsAwarded = 150;
      state.users.sales.points += pointsAwarded;
      const simTask = state.tasks.find((t) => t.id === 'tsk-2');
      if (simTask && course.id === 'internet-dedicated') simTask.state = 'done';
    }
    repo.logAudit(
      state.users.sales.email,
      'ROLEPLAY_COMPLETED',
      `Completed roleplay ${course.short} with score ${avgScore}/100`
    );
  }

  repo.saveState(state);
  return c.json({
    success: true,
    data: {
      avgScore,
      passed,
      pointsAwarded,
      state: sanitizeStateForClient(state),
    },
  });
});

// Certification: Submit Proctored Exam
apiRoutes.post('/certifications/exam-submit', zValidator('json', certExamSubmitSchema), (c) => {
  const { certSlug, answers } = c.req.valid('json');
  const state = repo.getState();
  const cert = state.certs.find((ct) => ct.slug === certSlug || ct.id === certSlug);
  if (!cert) {
    return c.json({ success: false, error: { code: 'NOT_FOUND', message: 'Sertifikasi tidak ditemukan' } }, 404);
  }

  const total = cert.questions.length;
  let correct = 0;
  cert.questions.forEach((q, idx) => {
    if (answers[idx] === q.a) correct += 1;
  });
  const pctScore = Math.round((correct / Math.max(1, total)) * 100);
  const passed = pctScore >= 75;

  let pointsAwarded = 0;
  if (passed) {
    const wasCertified = cert.state === 'Tersertifikasi';
    cert.state = 'Tersertifikasi';
    cert.done = cert.need;
    cert.score = pctScore;
    cert.issuedAt = '31 Oktober 2026';
    cert.certCode = cert.certCode || `LA-CERT-2026-${Math.floor(1000 + Math.random() * 8999)}`;
    cert.exam = `Lulus 31 Okt 2026 · Skor ${pctScore}`;

    if (!wasCertified) {
      pointsAwarded = 250;
      state.users.sales.points += pointsAwarded;
      const rakaTeam = state.team.find((m) => m.name === 'Raka Pratama');
      if (rakaTeam) {
        rakaTeam.cert = '2 / 2';
        rakaTeam.attn = false;
        rakaTeam.note = 'On track (Tersertifikasi)';
      }
    }
    repo.logAudit(
      state.users.sales.email,
      'CERTIFICATION_PASSED',
      `Passed ${cert.name} (${pctScore}%) -> ${cert.certCode}`
    );
  }

  repo.saveState(state);
  return c.json({
    success: true,
    data: {
      correct,
      total,
      pctScore,
      passed,
      certCode: cert.certCode,
      pointsAwarded,
      state: sanitizeStateForClient(state),
    },
  });
});

// Sales Leader: Assign Task to Team Members (writes real Task & Inbox to AE)
apiRoutes.post('/team/assign', zValidator('json', assignTaskSchema), (c) => {
  const { memberNames, taskTitle, dueDate, reminder, targetRoute } = c.req.valid('json');
  const state = repo.getState();

  const formattedDue = dueDate
    ? new Date(`${dueDate}T00:00:00`).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
      })
    : 'Segera';

  let route = targetRoute || '/course/internet-dedicated';
  if (/role-play|simulasi/i.test(taskTitle)) route = '/simulator/internet-dedicated';
  else if (/video|library/i.test(taskTitle)) route = '/library';
  else if (/discovery/i.test(taskTitle)) route = '/course/discovery';

  for (const name of memberNames) {
    state.tasks.unshift({
      id: `tsk-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      title: `${taskTitle} (${name.split(' ')[0]})`,
      src: `Dari Budi Santoso · Pengingat: ${reminder}`,
      due: formattedDue,
      state: 'open',
      go: route,
      assignedTo: name,
      reminder,
    });
  }

  // Push real inbox message so Sales AE sees it immediately
  state.inbox.unshift({
    id: `inb-${Date.now()}`,
    from: 'Budi Santoso (Sales Leader)',
    initials: 'BS',
    c: 'c2',
    title: `Tugas Baru: ${taskTitle}`,
    body: `Halo ${memberNames.join(', ')}, saya baru saja menugaskan materi "${taskTitle}" dengan target penyelesaian ${formattedDue} (${reminder}). Silakan buka menu Tasks untuk mulai mengerjakan.`,
    time: 'Baru saja',
    unread: true,
  });

  state.notifications.unshift({
    id: `ntf-${Date.now()}`,
    icon: 'clipboard',
    title: `Task baru dari Sales Leader`,
    body: `${taskTitle} · Tenggat ${formattedDue}`,
    time: 'Baru saja',
    unread: true,
    go: route,
  });

  repo.saveState(state);
  repo.logAudit(
    state.users.leader.email,
    'ASSIGN_TASK',
    `Assigned "${taskTitle}" to ${memberNames.join(', ')}`
  );

  return c.json({
    success: true,
    data: {
      assignedCount: memberNames.length,
      formattedDue,
      state: sanitizeStateForClient(state),
    },
  });
});

// Sales Leader: Remind or Appreciate Member
apiRoutes.post('/team/member-action', zValidator('json', memberActionSchema), (c) => {
  const { memberName, action } = c.req.valid('json');
  const state = repo.getState();
  const member = state.team.find((m) => m.name === memberName);
  if (!member) {
    return c.json({ success: false, error: { code: 'NOT_FOUND', message: 'Anggota tidak ditemukan' } }, 404);
  }

  if (action === 'remind') {
    member.reminded = true;
    state.inbox.unshift({
      id: `inb-${Date.now()}`,
      from: 'Budi Santoso',
      initials: 'BS',
      c: 'c2',
      title: `Pengingat Progres Learning Path — ${member.name.split(' ')[0]}`,
      body: `Halo ${member.name.split(' ')[0]}, mohon segera selesaikan modul yang jatuh tempo minggu ini agar target sertifikasi Q4 Tim Jabodetabek tercapai.`,
      time: 'Baru saja',
      unread: true,
    });
  } else {
    member.appreciated = true;
    member.reminded = true;
    if (member.name === 'Raka Pratama') {
      state.users.sales.points += 20;
    }
    state.inbox.unshift({
      id: `inb-${Date.now()}`,
      from: 'Budi Santoso',
      initials: 'BS',
      c: 'c2',
      title: `Apresiasi Sales Leader (+20 Poin) untuk ${member.name.split(' ')[0]}!`,
      body: `Kerja bagus ${member.name.split(' ')[0]}! Konsistensi belajarmu bulan ini sangat membantu kesiapan pitching tim. Pertahankan!`,
      time: 'Baru saja',
      unread: true,
    });
  }

  repo.saveState(state);
  repo.logAudit(state.users.leader.email, `MEMBER_${action.toUpperCase()}`, `Target: ${memberName}`);
  return c.json({ success: true, data: sanitizeStateForClient(state) });
});

// Inbox, Notifications, Calendar
apiRoutes.post('/inbox/:id/read', (c) => {
  const id = c.req.param('id');
  const state = repo.getState();
  const msg = state.inbox.find((m) => m.id === id);
  if (msg) msg.unread = false;
  repo.saveState(state);
  return c.json({ success: true, data: sanitizeStateForClient(state) });
});

apiRoutes.post('/notifications/seen', (c) => {
  const state = repo.getState();
  state.notifications.forEach((n) => {
    n.unread = false;
  });
  repo.saveState(state);
  return c.json({ success: true, data: sanitizeStateForClient(state) });
});

apiRoutes.post('/calendar/:id/toggle', (c) => {
  const id = c.req.param('id');
  const state = repo.getState();
  const ag = state.agenda.find((a) => a.id === id);
  if (ag) ag.registered = !ag.registered;
  repo.saveState(state);
  return c.json({
    success: true,
    data: { registered: ag?.registered ?? false, state: sanitizeStateForClient(state) },
  });
});

// Tanya AI Chat Endpoint (Multi-Provider LLM + Grounded RAG)
apiRoutes.post('/ai/chat', zValidator('json', aiChatRequestSchema), async (c) => {
  const dto = c.req.valid('json');
  const state = repo.getState();

  const userMsg = {
    id: `msg-u-${Date.now()}`,
    who: 'me' as const,
    text: dto.prompt,
    createdAt: new Date().toISOString(),
  };
  state.chatHistory.push(userMsg);

  const botMsg = await tanyaAiService.generateReply(dto.prompt, state, {
    activeProductSlug: dto.activeProductSlug,
    activeCourseId: dto.activeCourseId,
    activeModuleNum: dto.activeModuleNum,
    videoTimestamp: dto.videoTimestamp,
  });

  state.chatHistory.push(botMsg);
  repo.saveState(state);

  return c.json({
    success: true,
    data: {
      reply: botMsg,
      state: sanitizeStateForClient(state),
    },
  });
});

apiRoutes.post('/ai/clear', (c) => {
  const state = repo.getState();
  state.chatHistory = state.chatHistory.slice(0, 1);
  repo.saveState(state);
  return c.json({ success: true, data: sanitizeStateForClient(state) });
});

// Admin Studio: Update AI Provider Config (Gemini, OpenAI, OpenAI-Compatible, or Deterministic RAG)
apiRoutes.put('/admin/ai-config', zValidator('json', aiConfigUpdateSchema), (c) => {
  const dto = c.req.valid('json');
  const state = repo.getState();
  const existingKey = state.aiSettings.apiKey;
  const shouldKeepExistingKey = dto.apiKey.includes('••••') && existingKey;

  state.aiSettings = {
    provider: dto.provider,
    baseUrl: dto.baseUrl || 'https://api.openai.com/v1',
    apiKey: shouldKeepExistingKey ? existingKey : dto.apiKey.trim(),
    model: dto.model.trim(),
    temperature: dto.temperature ?? 0.3,
  };
  repo.saveState(state);
  repo.logAudit(
    state.users.admin.email,
    'UPDATE_AI_CONFIG',
    `Provider: ${dto.provider}, Model: ${dto.model}, BaseURL: ${dto.baseUrl}`
  );
  return c.json({ success: true, data: sanitizeStateForClient(state) });
});

// Admin Studio: Publish News & Announcement
apiRoutes.post('/admin/news', zValidator('json', adminCreateNewsSchema), (c) => {
  const dto = c.req.valid('json');
  const state = repo.getState();
  state.news.unshift({
    id: `nw-${Date.now()}`,
    tag: dto.tag,
    title: dto.title,
    body: dto.body,
    date: '31 Okt 2026',
    author: state.users.admin.name,
  });
  repo.saveState(state);
  repo.logAudit(state.users.admin.email, 'CREATE_NEWS', dto.title);
  return c.json({ success: true, data: sanitizeStateForClient(state) }, 201);
});

// Admin Studio: Create New Course
apiRoutes.post('/admin/courses', zValidator('json', adminCreateCourseSchema), (c) => {
  const dto = c.req.valid('json');
  const state = repo.getState();
  const slug = dto.slug.toLowerCase().replace(/[^a-z0-9-]+/g, '-');
  state.courses.push({
    id: slug,
    slug,
    title: dto.title,
    short: dto.short,
    category: dto.category,
    lead: dto.lead,
    desc: dto.desc,
    outcomes: dto.outcomes,
    cert: dto.cert,
    target: '30 Nov 2026',
    g: 'g-blue',
    icon: 'book',
    isNew: true,
    modules: [
      {
        n: 1,
        title: `Pengenalan & Value Proposition ${dto.short}`,
        sub: dto.lead,
        dur: '2:30',
        durationSec: 150,
        chapters: [
          { t: 0, title: 'Overview Solusi', head: dto.lead, tiles: [0, 1, 2] },
          { t: 75, title: 'Key Differentiator', head: 'Keunggulan kompetitif Lintasarta.', tiles: [3, 4, 5] },
        ],
        subs: [
          { t: 0, text: `Selamat datang di course ${dto.title}.` },
          { t: 45, text: dto.desc },
          { t: 95, text: 'Pastikan selalu mengaitkan solusi ini dengan dampak bisnis pelanggan.' },
        ],
        takeaways: dto.outcomes.map((o, i) => ({
          title: `Poin Kunci ${i + 1}`,
          body: o,
        })),
        quiz: [
          {
            q: `Apa fokus utama dari solusi ${dto.short} bagi pelanggan enterprise?`,
            opts: [dto.lead, 'Layanan tanpa SLA', 'Hanya untuk pengguna rumahan', 'Tidak memerlukan dukungan teknis'],
            a: 0,
            t: 0,
            topic: 'Overview Solusi',
          },
        ],
      },
    ],
    files: [
      {
        id: `file-${slug}`,
        type: 'PDF',
        name: `Battlecard ${dto.short}`,
        meta: 'PDF · 1,0 MB · Divalidasi Enablement',
        cat: dto.category,
        summary: dto.desc,
      },
    ],
    facilitators: [
      {
        name: state.users.admin.name,
        initials: state.users.admin.initials,
        role: state.users.admin.title,
        tag: 'Mentor',
        c: 'c3',
      },
    ],
  });
  repo.saveState(state);
  repo.logAudit(state.users.admin.email, 'CREATE_COURSE', dto.title);
  return c.json({ success: true, data: sanitizeStateForClient(state) }, 201);
});

// Printable / Downloadable Document & Certificate Endpoint
apiRoutes.get('/documents/download', (c) => {
  const type = c.req.query('type') || 'doc';
  const title = c.req.query('title') || 'Battlecard Internet Dedicated';
  const state = repo.getState();

  if (type === 'certificate') {
    const cert =
      state.certs.find((ct) => title.toLowerCase().includes(ct.name.toLowerCase())) ||
      state.certs[2];
    const u = state.users.sales;
    const html = documentService.generateCertificateHtml({
      recipientName: u.name,
      roleTitle: u.title,
      area: u.area,
      certName: cert.name,
      certCode: cert.certCode || 'LA-CERT-2026-8841',
      issuedAt: cert.issuedAt || '31 Oktober 2026',
      score: cert.score || 92,
    });
    return c.html(html);
  }

  const html = documentService.generateBattlecardOrDocHtml(title, state);
  return c.html(html);
});

