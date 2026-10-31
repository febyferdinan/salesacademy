import { z } from 'zod';

export type UserRole = 'sales' | 'leader' | 'admin';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  first: string;
  initials: string;
  role: UserRole;
  title: string;
  area: string;
  team: string;
  manager: string;
  avatarColor: string;
  points: number;
  streakDays: number;
  studyHoursMonth: number;
  studyHoursDelta: number;
  savedCourseIds: string[];
  focusProducts: string[];
  onboarded: boolean;
  failedLogin: number;
  lockedUntil: number | null;
}

export interface VideoChapter {
  t: number;
  title: string;
  head: string;
  tiles: number[];
}

export interface VideoSubtitle {
  t: number;
  text: string;
}

export interface VideoTakeaway {
  title: string;
  body: string;
}

export interface QuizQuestion {
  q: string;
  opts: string[];
  a: number;
  t: number;
  topic: string;
}

export interface RoleplayOption {
  id: string;
  text: string;
  score: number; // 0 to 100
  feedback: string;
  customerReaction: string;
  tag: 'Consultative' | 'Value-Based' | 'Defensive' | 'Price-Trap';
}

export interface RoleplayTurn {
  step: number;
  customerSpeaker: string;
  customerRole: string;
  situation: string;
  customerQuote: string;
  options: RoleplayOption[];
}

export interface CourseModule {
  n: number;
  title: string;
  sub: string;
  dur: string;
  durationSec: number;
  sim?: boolean;
  videoUrl?: string;
  chapters: VideoChapter[];
  subs: VideoSubtitle[];
  takeaways: VideoTakeaway[];
  quiz: QuizQuestion[];
  roleplay?: {
    customerCompany: string;
    industry: string;
    dealSize: string;
    objective: string;
    turns: RoleplayTurn[];
  };
}

export interface SupportingFile {
  id: string;
  type: 'PDF' | 'PPT' | 'PNG' | 'ZIP';
  name: string;
  meta: string;
  cat?: string;
  summary?: string;
  sections?: { heading: string; content: string[] }[];
}

export interface Course {
  id: string;
  slug: string;
  title: string;
  short: string;
  category: string;
  desc: string;
  lead: string;
  outcomes: string[];
  cert: string;
  target: string;
  g: 'g-blue' | 'g-navy' | 'g-amber' | 'g-teal' | 'g-violet';
  icon: string;
  isNew?: boolean;
  modules: CourseModule[];
  files: SupportingFile[];
  facilitators: {
    name: string;
    initials: string;
    role: string;
    tag: string;
    c: string;
  }[];
}

export interface ModuleProgressRecord {
  courseId: string;
  moduleNum: number;
  watchedSec: number;
  status: 'todo' | 'now' | 'done';
  score?: [number, number];
  roleplayScore?: number;
  updatedAt: string;
}

export interface ProductSection {
  key:
    | 'overview'
    | 'pain'
    | 'icp'
    | 'value'
    | 'features'
    | 'benefits'
    | 'usecase'
    | 'diff'
    | 'discovery'
    | 'objection'
    | 'crosssell'
    | 'dodont';
  label: string;
  body?: string;
  quotes?: [string, string][];
  pair?: [string, string][];
}

export interface ProductMapping {
  id: string;
  slug: string;
  name: string;
  cat: string;
  group: 'Connectivity' | 'Data Center & Cloud' | 'Security & Collaboration';
  desc: string;
  validated: string;
  relatedCourseId: string;
  crossSellSlugs: string[];
  roiDefaults: {
    monthlyDedicatedIdr: number;
    monthlyBroadbandIdr: number;
    defaultHourlyRevenueIdr: number;
    defaultDowntimeHoursPerMonth: number;
    slaGuaranteePct: number;
  };
  sections: ProductSection[];
}

export interface LibraryVideo {
  id: string;
  title: string;
  cat: string;
  dur: string;
  sec: number;
  g: 'g-blue' | 'g-navy' | 'g-amber' | 'g-teal' | 'g-violet';
  flag?: string;
  prog: number;
  courseId: string;
  moduleNum: number;
  summary: string;
}

export interface TeamMember {
  id: string;
  name: string;
  initials: string;
  email: string;
  c: string;
  prog: number;
  cert: string;
  score: number;
  note: string;
  attn: boolean;
  reminded?: boolean;
  appreciated?: boolean;
  lastActive: string;
}

export interface TaskItem {
  id: string;
  title: string;
  src: string;
  due: string;
  state: 'due' | 'open' | 'done';
  go: string;
  assignedTo: string;
  reminder?: string;
}

export interface InboxMessage {
  id: string;
  from: string;
  initials: string;
  c: string;
  title: string;
  body: string;
  time: string;
  unread: boolean;
}

export interface NotificationItem {
  id: string;
  icon: string;
  title: string;
  body: string;
  time: string;
  unread: boolean;
  go?: string;
}

export interface AgendaItem {
  id: string;
  d: string;
  m: string;
  title: string;
  meta: string;
  speaker: string;
  location: string;
  registered: boolean;
}

export interface CertificationTrack {
  id: string;
  slug: string;
  name: string;
  category: string;
  done: number;
  need: number;
  state: 'Sedang berjalan' | 'Tersertifikasi' | 'Siap Ujian';
  exam: string;
  score?: number;
  certCode?: string;
  issuedAt?: string;
  requiredCourseIds: string[];
  questions: QuizQuestion[];
}

export interface NewsItem {
  id: string;
  tag: string;
  title: string;
  body: string;
  date: string;
  author?: string;
}

export interface ProcessStep {
  step: number;
  t: string;
  d: string;
  deliverable: string;
  owner: string;
}

export type AiProviderType = 'deterministic' | 'gemini' | 'openai' | 'openai-compatible';

export interface AiProviderSettings {
  provider: AiProviderType;
  baseUrl: string;
  apiKey: string;
  model: string;
  temperature: number;
  hasKeyConfigured?: boolean;
}

export interface AiCitation {
  label: string;
  route: string;
  type: 'battlecard' | 'video' | 'sop' | 'course';
  timestampSec?: number;
  sectionKey?: string;
}

export interface ChatMessage {
  id: string;
  who: 'me' | 'bot';
  text: string;
  html?: string;
  citations?: AiCitation[];
  providerUsed?: string;
  createdAt: string;
}

// ==================== ZOD SCHEMAS ====================

export const loginSchema = z.object({
  email: z.string().email('Format email kantor tidak valid'),
  password: z.string().min(1, 'Masukkan password, atau masuk dengan SSO.'),
});

export const switchRoleSchema = z.object({
  role: z.enum(['sales', 'leader', 'admin']),
});

export const progressUpdateSchema = z.object({
  courseId: z.string(),
  moduleNum: z.number().int().min(1).max(10),
  watchedSec: z.number().min(0),
});

export const quizSubmitSchema = z.object({
  courseId: z.string(),
  moduleNum: z.number().int().min(1).max(10),
  answers: z.array(z.number().int()),
});

export const roleplaySubmitSchema = z.object({
  courseId: z.string(),
  moduleNum: z.number().int().min(1).max(10),
  selectedOptionIds: z.array(z.string()),
});

export const certExamSubmitSchema = z.object({
  certSlug: z.string(),
  answers: z.array(z.number().int()),
});

export const assignTaskSchema = z.object({
  memberNames: z.array(z.string()).min(1, 'Pilih minimal 1 anggota tim'),
  taskTitle: z.string().min(3),
  dueDate: z.string(),
  reminder: z.string(),
  targetRoute: z.string().optional(),
});

export const memberActionSchema = z.object({
  memberName: z.string().min(1),
  action: z.enum(['remind', 'appreciate']),
});

export const aiChatRequestSchema = z.object({
  prompt: z.string().min(1).max(2000),
  contextRoute: z.string().optional(),
  activeProductSlug: z.string().optional(),
  activeCourseId: z.string().optional(),
  activeModuleNum: z.number().optional(),
  videoTimestamp: z.number().optional(),
});

export const aiConfigUpdateSchema = z.object({
  provider: z.enum(['deterministic', 'gemini', 'openai', 'openai-compatible']),
  baseUrl: z.string().optional().default('https://api.openai.com/v1'),
  apiKey: z.string().optional().default(''),
  model: z.string().min(1).default('gpt-4o-mini'),
  temperature: z.number().min(0).max(1.5).optional().default(0.3),
});

export const adminCreateNewsSchema = z.object({
  tag: z.string().min(2),
  title: z.string().min(5),
  body: z.string().min(10),
});

export const adminCreateCourseSchema = z.object({
  slug: z.string().min(2),
  title: z.string().min(5),
  short: z.string().min(2),
  category: z.string().min(2),
  lead: z.string().min(10),
  desc: z.string().min(10),
  cert: z.string().min(2),
  outcomes: z.array(z.string()).min(1),
});

