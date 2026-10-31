# Hono Reference (Lightweight / Edge)

Hono is the lightest TypeScript framework (~14kb), runs on Cloudflare Workers, Bun, Deno, Vercel, and Node.js. Use for edge APIs, serverless, microservices, low cold-start. Production-proven (adopted by Cloudflare, Vercel).

## Install
```bash
npm create hono@latest my-api
cd my-api
npm i zod @hono/zod-validator
npm i drizzle-orm postgres
npm i -D drizzle-kit
npm i hono/jwt          # built-in JWT helpers
npm i argon2            # or use Web Crypto on edge runtimes
```

## Project Structure
```
src/
├── index.ts             # app entry, middleware, route mounting
├── env.ts               # Zod-validated env
├── db/
│   ├── index.ts         # drizzle client
│   └── schema.ts        # table definitions
├── middleware/
│   ├── auth.ts          # JWT verify middleware
│   ├── error.ts         # error envelope handler
│   └── rate-limit.ts
├── routes/
│   ├── auth.ts          # route group
│   └── users.ts
├── services/            # business logic (no Hono context)
│   ├── auth.service.ts
│   └── users.service.ts
├── repositories/        # drizzle queries only
│   └── users.repository.ts
└── schemas/             # Zod request/response schemas
    └── auth.schema.ts
```

## Entry (src/index.ts)
```typescript
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { secureHeaders } from 'hono/secure-headers';
import { logger } from 'hono/logger';
import { authRoutes } from './routes/auth';
import { userRoutes } from './routes/users';
import { errorHandler } from './middleware/error';
import { env } from './env';

const app = new Hono();

app.use('*', logger());
app.use('*', secureHeaders());
app.use('*', cors({
  origin: env.CORS_ORIGINS.split(','),
  credentials: true,
}));

app.get('/health', (c) => c.json({ success: true, data: { status: 'ok' } }));

app.route('/api/v1/auth', authRoutes);
app.route('/api/v1/users', userRoutes);

app.onError(errorHandler);

export default app;
```

## Env Validation (src/env.ts)
```typescript
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  DATABASE_URL: z.string().url(),
  JWT_ACCESS_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),
  CORS_ORIGINS: z.string(),
});

export const env = envSchema.parse(process.env);
```

## Drizzle Schema (src/db/schema.ts)
```typescript
import { pgTable, uuid, varchar, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
```

## Drizzle Client (src/db/index.ts)
```typescript
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { env } from '../env';
import * as schema from './schema';

const client = postgres(env.DATABASE_URL);
export const db = drizzle(client, { schema });
```

## Route Group with Validation (src/routes/auth.ts)
```typescript
import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { registerSchema, loginSchema } from '../schemas/auth.schema';
import { AuthService } from '../services/auth.service';

export const authRoutes = new Hono();
const authService = new AuthService();

authRoutes.post('/register', zValidator('json', registerSchema), async (c) => {
  const dto = c.req.valid('json');
  const tokens = await authService.register(dto);
  return c.json({ success: true, data: tokens }, 201);
});

authRoutes.post('/login', zValidator('json', loginSchema), async (c) => {
  const dto = c.req.valid('json');
  const tokens = await authService.login(dto);
  return c.json({ success: true, data: tokens });
});
```

## Service (no Hono context — pure logic)
```typescript
import argon2 from 'argon2';
import { sign } from 'hono/jwt';
import { UsersRepository } from '../repositories/users.repository';
import { env } from '../env';

export class AuthService {
  private users = new UsersRepository();

  async register(dto: { email: string; name: string; password: string }) {
    const existing = await this.users.findByEmail(dto.email);
    if (existing) throw new HttpError(409, 'CONFLICT', 'Email already in use');

    const passwordHash = await argon2.hash(dto.password);
    const user = await this.users.create({ ...dto, passwordHash });
    return this.issueTokens(user.id);
  }

  async login(dto: { email: string; password: string }) {
    const user = await this.users.findByEmail(dto.email);
    if (!user || !(await argon2.verify(user.passwordHash, dto.password))) {
      throw new HttpError(401, 'UNAUTHORIZED', 'Invalid credentials');
    }
    return this.issueTokens(user.id);
  }

  private async issueTokens(userId: string) {
    const now = Math.floor(Date.now() / 1000);
    const accessToken = await sign({ sub: userId, exp: now + 900 }, env.JWT_ACCESS_SECRET);
    const refreshToken = await sign({ sub: userId, exp: now + 604800 }, env.JWT_REFRESH_SECRET);
    return { accessToken, refreshToken };
  }
}
```

## JWT Auth Middleware (src/middleware/auth.ts)
```typescript
import { createMiddleware } from 'hono/factory';
import { verify } from 'hono/jwt';
import { env } from '../env';

export const requireAuth = createMiddleware(async (c, next) => {
  const header = c.req.header('Authorization');
  if (!header?.startsWith('Bearer ')) {
    return c.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Missing token' } }, 401);
  }
  try {
    const payload = await verify(header.slice(7), env.JWT_ACCESS_SECRET);
    c.set('userId', payload.sub as string);
    await next();
  } catch {
    return c.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Invalid token' } }, 401);
  }
});
```

## Error Handler (src/middleware/error.ts)
```typescript
import type { ErrorHandler } from 'hono';

export class HttpError extends Error {
  constructor(public status: number, public code: string, message: string) {
    super(message);
  }
}

export const errorHandler: ErrorHandler = (err, c) => {
  if (err instanceof HttpError) {
    return c.json({ success: false, error: { code: err.code, message: err.message } }, err.status as any);
  }
  console.error(err);
  return c.json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } }, 500);
};
```

## Drizzle Config (drizzle.config.ts)
```typescript
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: { url: process.env.DATABASE_URL! },
});
```
```bash
npx drizzle-kit generate   # create migration
npx drizzle-kit migrate    # apply
```

## When Hono is the right call
- Edge/serverless deploys (Cloudflare Workers, Vercel Edge, Bun, Deno)
- Cold-start and bundle size matter
- Lightweight APIs / microservices without heavy architecture needs
- Cross-runtime portability
- Tradeoff: you assemble infra (queues, observability) yourself — smaller ecosystem than NestJS for org patterns
