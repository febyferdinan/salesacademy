import { create } from 'zustand';
import { toast } from 'sonner';
import { SEED_COURSES } from '../../shared/seedCourses';
import { SEED_PRODUCTS } from '../../shared/seedProducts';
import {
  SEED_TODAY,
  SEED_USERS,
  SEED_PROGRESS,
  SEED_LIBRARY_VIDEOS,
  SEED_MATERIALS,
  SEED_TOOLKIT,
  SEED_TEAM,
  SEED_WEEKLY,
  SEED_TASKS,
  SEED_INBOX,
  SEED_NOTIFICATIONS,
  SEED_AGENDA,
  SEED_CERTS,
  SEED_NEWS,
  SEED_PROCESS,
} from '../../shared/seedOperations';
import type {
  UserRole,
  UserProfile,
  Course,
  ProductMapping,
  ModuleProgressRecord,
  LibraryVideo,
  SupportingFile,
  TeamMember,
  TaskItem,
  InboxMessage,
  NotificationItem,
  AgendaItem,
  CertificationTrack,
  NewsItem,
  ProcessStep,
  AiProviderSettings,
  ChatMessage,
} from '../../shared/types';

export interface AuditLogEntry {
  id: number;
  actor: string;
  action: string;
  detail: string;
  createdAt: string;
}

export interface DocumentPreviewTarget {
  title: string;
  type: 'doc' | 'certificate';
  meta?: string;
  summary?: string;
  sections?: { heading: string; content: string[] }[];
  certData?: {
    certName: string;
    certCode: string;
    issuedAt: string;
    score: number;
  };
}

interface AcademyStore {
  // Server-synced state
  hydrated: boolean;
  today: string;
  activeRole: UserRole;
  loggedIn: boolean;
  users: Record<UserRole, UserProfile>;
  courses: Course[];
  products: ProductMapping[];
  progress: ModuleProgressRecord[];
  library: LibraryVideo[];
  materials: SupportingFile[];
  toolkit: SupportingFile[];
  team: TeamMember[];
  weekly: number[];
  tasks: TaskItem[];
  inbox: InboxMessage[];
  notifications: NotificationItem[];
  agenda: AgendaItem[];
  certs: CertificationTrack[];
  news: NewsItem[];
  process: ProcessStep[];
  aiSettings: AiProviderSettings;
  chatHistory: ChatMessage[];
  auditLogs: AuditLogEntry[];

  // Client UI state
  darkMode: boolean;
  chatOpen: boolean;
  chatLoading: boolean;
  chatContext: {
    activeProductSlug?: string;
    activeCourseId?: string;
    activeModuleNum?: number;
    videoTimestamp?: number;
  };
  cmdkOpen: boolean;
  previewDoc: DocumentPreviewTarget | null;
  mobileFrameOpen: boolean;
  demoBarMinimized: boolean;
  tourStep: number | null;

  // Actions
  bootstrap: () => Promise<void>;
  toggleDarkMode: () => void;
  setChatOpen: (open: boolean, ctx?: AcademyStore['chatContext']) => void;
  setCmdkOpen: (open: boolean) => void;
  setPreviewDoc: (doc: DocumentPreviewTarget | null) => void;
  setMobileFrameOpen: (open: boolean) => void;
  setDemoBarMinimized: (min: boolean) => void;
  setTourStep: (step: number | null) => void;

  ssoLogin: () => Promise<void>;
  passwordLogin: (email: string, password: string) => Promise<{ ok: boolean; message?: string }>;
  logout: () => Promise<void>;
  switchRole: (role: UserRole) => Promise<void>;
  resetDemo: () => Promise<void>;

  saveProgress: (courseId: string, moduleNum: number, watchedSec: number) => Promise<void>;
  toggleBookmark: (courseId: string) => Promise<void>;
  submitQuiz: (
    courseId: string,
    moduleNum: number,
    answers: number[]
  ) => Promise<{
    score: number;
    total: number;
    passed: boolean;
    pointsAwarded: number;
    wrongTopics: { topic: string; t: number; question: string }[];
  }>;
  submitRoleplay: (
    courseId: string,
    moduleNum: number,
    selectedOptionIds: string[]
  ) => Promise<{ avgScore: number; passed: boolean; pointsAwarded: number }>;
  submitCertExam: (
    certSlug: string,
    answers: number[]
  ) => Promise<{
    correct: number;
    total: number;
    pctScore: number;
    passed: boolean;
    certCode?: string;
    pointsAwarded: number;
  }>;

  assignTask: (payload: {
    memberNames: string[];
    taskTitle: string;
    dueDate: string;
    reminder: string;
    targetRoute?: string;
  }) => Promise<void>;
  memberAction: (memberName: string, action: 'remind' | 'appreciate') => Promise<void>;

  markInboxRead: (id: string) => Promise<void>;
  markNotificationsSeen: () => Promise<void>;
  toggleCalendarRegistration: (id: string) => Promise<void>;

  sendAiPrompt: (prompt: string) => Promise<void>;
  clearAiChat: () => Promise<void>;
  updateAiConfig: (cfg: AiProviderSettings) => Promise<void>;
  createNews: (dto: { tag: string; title: string; body: string }) => Promise<void>;
  createCourse: (dto: {
    slug: string;
    title: string;
    short: string;
    category: string;
    lead: string;
    desc: string;
    cert: string;
    outcomes: string[];
  }) => Promise<void>;
}

export const useAcademyStore = create<AcademyStore>((set, get) => ({
  hydrated: false,
  today: SEED_TODAY,
  activeRole: 'sales',
  loggedIn: true,
  users: structuredClone(SEED_USERS),
  courses: structuredClone(SEED_COURSES),
  products: structuredClone(SEED_PRODUCTS),
  progress: structuredClone(SEED_PROGRESS),
  library: structuredClone(SEED_LIBRARY_VIDEOS),
  materials: structuredClone(SEED_MATERIALS),
  toolkit: structuredClone(SEED_TOOLKIT),
  team: structuredClone(SEED_TEAM),
  weekly: [...SEED_WEEKLY],
  tasks: structuredClone(SEED_TASKS),
  inbox: structuredClone(SEED_INBOX),
  notifications: structuredClone(SEED_NOTIFICATIONS),
  agenda: structuredClone(SEED_AGENDA),
  certs: structuredClone(SEED_CERTS),
  news: structuredClone(SEED_NEWS),
  process: structuredClone(SEED_PROCESS),
  aiSettings: {
    provider: 'deterministic',
    baseUrl: 'https://api.openai.com/v1',
    apiKey: '',
    model: 'la-rag-synthesizer-v2',
    temperature: 0.2,
  },
  chatHistory: [
    {
      id: 'msg-welcome',
      who: 'bot',
      text: 'Hai Raka! Saya asisten Tanya AI LA Sales Academy. Saya siap membantu menyiapkan skrip pitching, discovery questions, jawaban keberatan harga vs broadband, hingga simulasi hitungan kerugian downtime pelanggan.',
      citations: [
        {
          label: 'Battlecard Internet Dedicated',
          route: '/product/internet-dedicated',
          type: 'battlecard',
        },
        {
          label: 'Video Modul 3 · 02:10',
          route: '/player/internet-dedicated/3?t=130',
          type: 'video',
          timestampSec: 130,
        },
      ],
      providerUsed: 'LA Grounded RAG',
      createdAt: new Date().toISOString(),
    },
  ],
  auditLogs: [],

  darkMode: false,
  chatOpen: false,
  chatLoading: false,
  chatContext: {},
  cmdkOpen: false,
  previewDoc: null,
  mobileFrameOpen: false,
  demoBarMinimized: false,
  tourStep: null,

  bootstrap: async () => {
    try {
      const res = await fetch('/api/v1/bootstrap');
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          set({
            ...json.data,
            auditLogs: json.meta?.auditLogs || [],
            hydrated: true,
          });
          return;
        }
      }
    } catch {
      // Fallback to local seed state if backend not reachable
    }
    set({ hydrated: true });
  },

  toggleDarkMode: () => {
    const next = !get().darkMode;
    document.documentElement.classList.toggle('dark', next);
    set({ darkMode: next });
  },

  setChatOpen: (open, ctx) => {
    set((s) => ({
      chatOpen: open,
      chatContext: ctx ? { ...s.chatContext, ...ctx } : s.chatContext,
    }));
  },

  setCmdkOpen: (open) => set({ cmdkOpen: open }),
  setPreviewDoc: (doc) => set({ previewDoc: doc }),
  setMobileFrameOpen: (open) => set({ mobileFrameOpen: open }),
  setDemoBarMinimized: (min) => set({ demoBarMinimized: min }),
  setTourStep: (step) => set({ tourStep: step }),

  ssoLogin: async () => {
    try {
      const res = await fetch('/api/v1/auth/sso', { method: 'POST' });
      const json = await res.json();
      if (json.success && json.data) {
        set({ ...json.data });
      }
    } catch {
      set({ loggedIn: true, activeRole: 'sales' });
    }
    toast.success('Terhubung ke SSO Lintasarta. Selamat datang kembali, Raka!');
  },

  passwordLogin: async (email, password) => {
    try {
      const res = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const json = await res.json();
      if (json.data) {
        set({ ...json.data });
      }
      if (!res.ok || !json.success) {
        return { ok: false, message: json.error?.message || 'Password salah.' };
      }
      toast.success('Berhasil masuk ke LA Sales Academy.');
      return { ok: true };
    } catch {
      return { ok: false, message: 'Gagal menghubungi server autentikasi.' };
    }
  },

  logout: async () => {
    try {
      const res = await fetch('/api/v1/auth/logout', { method: 'POST' });
      const json = await res.json();
      if (json.data) set({ ...json.data });
    } catch {
      set({ loggedIn: false });
    }
    toast.info('Anda telah keluar dari sesi.');
  },

  switchRole: async (role) => {
    set({ activeRole: role, loggedIn: true });
    try {
      const res = await fetch('/api/v1/auth/switch-role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role }),
      });
      const json = await res.json();
      if (json.success && json.data) {
        set({ ...json.data });
      }
    } catch {
      // Optimistic state already updated
    }
    const labels: Record<UserRole, string> = {
      sales: 'Raka Pratama (Account Executive)',
      leader: 'Budi Santoso (Sales Leader)',
      admin: 'Dewi Anggraini (Enablement Admin)',
    };
    toast.success(`Beralih peran ke ${labels[role]}`);
  },

  resetDemo: async () => {
    try {
      const res = await fetch('/api/v1/auth/reset-demo', { method: 'POST' });
      const json = await res.json();
      if (json.success && json.data) {
        set({ ...json.data, chatOpen: false, tourStep: null });
      }
    } catch {
      // ignore
    }
    toast.info('State aplikasi direset ke kondisi awal demo.');
  },

  saveProgress: async (courseId, moduleNum, watchedSec) => {
    set((s) => {
      const list = [...s.progress];
      const idx = list.findIndex((p) => p.courseId === courseId && p.moduleNum === moduleNum);
      if (idx >= 0) {
        list[idx] = { ...list[idx], watchedSec: Math.floor(watchedSec) };
      } else {
        list.push({
          courseId,
          moduleNum,
          watchedSec: Math.floor(watchedSec),
          status: 'now',
          updatedAt: new Date().toISOString(),
        });
      }
      return { progress: list };
    });
    try {
      await fetch('/api/v1/learning/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId, moduleNum, watchedSec }),
      });
    } catch {
      // ignore
    }
  },

  toggleBookmark: async (courseId) => {
    try {
      const res = await fetch(`/api/v1/learning/bookmark/${courseId}`, { method: 'POST' });
      const json = await res.json();
      if (json.success && json.data) {
        set({ ...json.data.state });
        toast.success(
          json.data.saved ? 'Course disimpan ke daftar belajarmu.' : 'Course dihapus dari bookmark.'
        );
      }
    } catch {
      // ignore
    }
  },

  submitQuiz: async (courseId, moduleNum, answers) => {
    const res = await fetch('/api/v1/learning/quiz-submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ courseId, moduleNum, answers }),
    });
    const json = await res.json();
    if (json.success && json.data) {
      set({ ...json.data.state });
      return json.data;
    }
    throw new Error('Gagal mengirim jawaban kuis');
  },

  submitRoleplay: async (courseId, moduleNum, selectedOptionIds) => {
    const res = await fetch('/api/v1/learning/roleplay-submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ courseId, moduleNum, selectedOptionIds }),
    });
    const json = await res.json();
    if (json.success && json.data) {
      set({ ...json.data.state });
      return json.data;
    }
    throw new Error('Gagal mengirim evaluasi role-play');
  },

  submitCertExam: async (certSlug, answers) => {
    const res = await fetch('/api/v1/certifications/exam-submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ certSlug, answers }),
    });
    const json = await res.json();
    if (json.success && json.data) {
      set({ ...json.data.state });
      return json.data;
    }
    throw new Error('Gagal mengirim ujian sertifikasi');
  },

  assignTask: async (payload) => {
    const res = await fetch('/api/v1/team/assign', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (json.success && json.data) {
      set({ ...json.data.state });
      toast.success(
        `“${payload.taskTitle}” berhasil ditugaskan ke ${payload.memberNames.length} anggota tim (Deadline ${json.data.formattedDue}).`
      );
    }
  },

  memberAction: async (memberName, action) => {
    const res = await fetch('/api/v1/team/member-action', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ memberName, action }),
    });
    const json = await res.json();
    if (json.success && json.data) {
      set({ ...json.data });
      if (action === 'remind') {
        toast.success(`Pengingat dikirim ke Inbox & WhatsApp ${memberName.split(' ')[0]}.`);
      } else {
        toast.success(`Apresiasi (+20 poin) dikirim ke ${memberName.split(' ')[0]}!`);
      }
    }
  },

  markInboxRead: async (id) => {
    const res = await fetch(`/api/v1/inbox/${id}/read`, { method: 'POST' });
    const json = await res.json();
    if (json.success && json.data) set({ ...json.data });
  },

  markNotificationsSeen: async () => {
    const res = await fetch('/api/v1/notifications/seen', { method: 'POST' });
    const json = await res.json();
    if (json.success && json.data) set({ ...json.data });
  },

  toggleCalendarRegistration: async (id) => {
    const res = await fetch(`/api/v1/calendar/${id}/toggle`, { method: 'POST' });
    const json = await res.json();
    if (json.success && json.data) {
      set({ ...json.data.state });
      toast.success(
        json.data.registered
          ? 'Terdaftar! Undangan kalender telah dikirim ke email kantor kamu.'
          : 'Pendaftaran sesi dibatalkan.'
      );
    }
  },

  sendAiPrompt: async (prompt) => {
    if (!prompt.trim()) return;
    const optimisticUserMsg: ChatMessage = {
      id: `temp-${Date.now()}`,
      who: 'me',
      text: prompt,
      createdAt: new Date().toISOString(),
    };
    set((s) => ({
      chatHistory: [...s.chatHistory, optimisticUserMsg],
      chatLoading: true,
    }));

    try {
      const ctx = get().chatContext;
      const res = await fetch('/api/v1/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          ...ctx,
        }),
      });
      const json = await res.json();
      if (json.success && json.data) {
        set({
          ...json.data.state,
          chatLoading: false,
        });
      } else {
        set({ chatLoading: false });
      }
    } catch {
      set({ chatLoading: false });
      toast.error('Gagal memproses respons AI.');
    }
  },

  clearAiChat: async () => {
    const res = await fetch('/api/v1/ai/clear', { method: 'POST' });
    const json = await res.json();
    if (json.success && json.data) {
      set({ ...json.data });
    }
  },

  updateAiConfig: async (cfg) => {
    const res = await fetch('/api/v1/admin/ai-config', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cfg),
    });
    const json = await res.json();
    if (json.success && json.data) {
      set({ ...json.data });
      toast.success(`Konfigurasi Tanya AI (${cfg.provider.toUpperCase()}) berhasil disimpan!`);
    }
  },

  createNews: async (dto) => {
    const res = await fetch('/api/v1/admin/news', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dto),
    });
    const json = await res.json();
    if (json.success && json.data) {
      set({ ...json.data });
      toast.success('Pengumuman baru berhasil diterbitkan!');
    }
  },

  createCourse: async (dto) => {
    const res = await fetch('/api/v1/admin/courses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dto),
    });
    const json = await res.json();
    if (json.success && json.data) {
      set({ ...json.data });
      toast.success(`Course "${dto.title}" berhasil ditambahkan ke katalog!`);
    }
  },
}));

