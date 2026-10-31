import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import type { DatabaseSync as DatabaseSyncType } from 'node:sqlite';

const require = createRequire(import.meta.url);
const { DatabaseSync } = require('node:sqlite') as { DatabaseSync: typeof DatabaseSyncType };
import { env } from './env.js';
import { SEED_COURSES } from '../shared/seedCourses.js';
import { SEED_PRODUCTS } from '../shared/seedProducts.js';
import {
  SEED_USERS,
  SEED_PROGRESS,
  SEED_LIBRARY_VIDEOS,
  SEED_MATERIALS,
  SEED_TOOLKIT,
  SEED_AGENDA,
  SEED_NOTIFICATIONS,
  SEED_INBOX,
  SEED_TASKS,
  SEED_TEAM,
  SEED_WEEKLY,
  SEED_CERTS,
  SEED_NEWS,
  SEED_PROCESS,
  SEED_TODAY,
} from '../shared/seedOperations.js';
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
} from '../shared/types.js';

export interface AppStateSnapshot {
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
}

class SalesAcademyRepository {
  private db: DatabaseSyncType;

  constructor() {
    const dbFile = path.resolve(env.SQLITE_PATH);
    const dir = path.dirname(dbFile);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    this.db = new DatabaseSync(dbFile);
    this.initSchema();
  }

  private initSchema() {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS kv_store (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS audit_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        actor TEXT NOT NULL,
        action TEXT NOT NULL,
        detail TEXT NOT NULL,
        created_at TEXT NOT NULL
      );
    `);

    const existing = this.db
      .prepare('SELECT value FROM kv_store WHERE key = ?')
      .get('app_state') as { value: string } | undefined;

    if (!existing) {
      this.seedInitialState();
    }
  }

  public getDefaultAiSettings(): AiProviderSettings {
    if (env.AI_PROVIDER === 'gemini' || env.GEMINI_API_KEY) {
      return {
        provider: 'gemini',
        baseUrl: 'https://generativelanguage.googleapis.com',
        apiKey: env.GEMINI_API_KEY || '',
        model: env.GEMINI_MODEL || 'gemini-2.5-flash',
        temperature: 0.3,
      };
    }
    if (env.AI_PROVIDER === 'openai' || env.OPENAI_API_KEY) {
      return {
        provider: 'openai',
        baseUrl: 'https://api.openai.com/v1',
        apiKey: env.OPENAI_API_KEY || '',
        model: env.OPENAI_MODEL || 'gpt-4o-mini',
        temperature: 0.3,
      };
    }
    if (env.AI_PROVIDER === 'openai-compatible' || env.AI_API_KEY) {
      return {
        provider: 'openai-compatible',
        baseUrl: env.AI_BASE_URL || 'https://api.openai.com/v1',
        apiKey: env.AI_API_KEY || '',
        model: env.AI_MODEL || 'gpt-4o-mini',
        temperature: 0.3,
      };
    }
    return {
      provider: 'deterministic',
      baseUrl: env.AI_BASE_URL || 'https://api.openai.com/v1',
      apiKey: '',
      model: 'la-rag-synthesizer-v2',
      temperature: 0.2,
    };
  }

  public createFreshState(keepAiSettings?: AiProviderSettings): AppStateSnapshot {
    return {
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
      aiSettings: keepAiSettings || this.getDefaultAiSettings(),
      chatHistory: [
        {
          id: 'msg-welcome',
          who: 'bot',
          text: 'Hai Raka! Saya asisten Tanya AI LA Sales Academy. Saya siap membantu menyiapkan skrip pitching, discovery questions, jawaban keberatan harga vs broadband, hingga simulasi hitungan kerugian downtime pelanggan. Semua jawaban bersumber dari Battlecard & materi resmi Lintasarta.',
          citations: [
            {
              label: 'Battlecard Internet Dedicated',
              route: '/product/internet-dedicated',
              type: 'battlecard',
              sectionKey: 'diff',
            },
            {
              label: 'Modul 3 · 02:10',
              route: '/player/internet-dedicated/3?t=130',
              type: 'video',
              timestampSec: 130,
            },
          ],
          providerUsed: 'LA Grounded RAG',
          createdAt: new Date().toISOString(),
        },
      ],
    };
  }

  public seedInitialState(): AppStateSnapshot {
    const fresh = this.createFreshState();
    this.saveState(fresh);
    this.logAudit('system', 'SEED_DATABASE', 'Initial Lintasarta Sales Academy database seeded');
    return fresh;
  }

  public getState(): AppStateSnapshot {
    const row = this.db
      .prepare('SELECT value FROM kv_store WHERE key = ?')
      .get('app_state') as { value: string } | undefined;
    if (!row) {
      return this.seedInitialState();
    }
    try {
      return JSON.parse(row.value) as AppStateSnapshot;
    } catch {
      return this.seedInitialState();
    }
  }

  public saveState(state: AppStateSnapshot): void {
    const now = new Date().toISOString();
    this.db
      .prepare(
        `INSERT INTO kv_store (key, value, updated_at)
         VALUES (?, ?, ?)
         ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at`
      )
      .run('app_state', JSON.stringify(state), now);
  }

  public resetState(): AppStateSnapshot {
    const current = this.getState();
    const fresh = this.createFreshState(current.aiSettings);
    this.saveState(fresh);
    this.logAudit('user', 'RESET_DEMO', 'Demo state reset to initial baseline');
    return fresh;
  }

  public logAudit(actor: string, action: string, detail: string): void {
    this.db
      .prepare('INSERT INTO audit_logs (actor, action, detail, created_at) VALUES (?, ?, ?, ?)')
      .run(actor, action, detail, new Date().toISOString());
  }

  public getRecentAuditLogs(limit = 25) {
    return this.db
      .prepare('SELECT id, actor, action, detail, created_at as createdAt FROM audit_logs ORDER BY id DESC LIMIT ?')
      .all(limit);
  }
}

export const repo = new SalesAcademyRepository();
