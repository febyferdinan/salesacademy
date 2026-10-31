import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(3000),
  CORS_ORIGINS: z
    .string()
    .default('http://localhost:5173,http://localhost:3000,https://salesacademy.ffs.my.id'),
  JWT_ACCESS_SECRET: z
    .string()
    .min(16)
    .default('la-sales-academy-prod-jwt-access-secret-2026-lintasarta'),
  JWT_REFRESH_SECRET: z
    .string()
    .min(16)
    .default('la-sales-academy-prod-jwt-refresh-secret-2026-lintasarta'),
  SQLITE_PATH: z.string().default('./data/salesacademy.db'),
  DATABASE_URL: z.string().optional(),
  AI_PROVIDER: z
    .enum(['deterministic', 'gemini', 'openai', 'openai-compatible'])
    .default('deterministic'),
  GEMINI_API_KEY: z.string().optional().default(''),
  GEMINI_MODEL: z.string().default('gemini-2.5-flash'),
  OPENAI_API_KEY: z.string().optional().default(''),
  OPENAI_MODEL: z.string().default('gpt-4o-mini'),
  AI_BASE_URL: z.string().default('https://api.openai.com/v1'),
  AI_API_KEY: z.string().optional().default(''),
  AI_MODEL: z.string().default('gpt-4o-mini'),
});

export const env = envSchema.parse(process.env);

