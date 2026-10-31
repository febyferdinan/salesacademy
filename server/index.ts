import fs from 'node:fs';
import path from 'node:path';
import { serve } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { secureHeaders } from 'hono/secure-headers';
import { logger } from 'hono/logger';
import { env } from './env.js';
import { apiRoutes } from './routes/api.js';

const app = new Hono();

app.use('*', logger());
app.use('*', secureHeaders());
app.use(
  '/api/*',
  cors({
    origin: env.CORS_ORIGINS.split(',').map((s) => s.trim()),
    credentials: true,
  })
);

// Health & Readiness probes
app.get('/health', (c) =>
  c.json({
    success: true,
    data: {
      status: 'ok',
      service: 'la-sales-academy',
      version: '2.0.0',
      timestamp: new Date().toISOString(),
    },
  })
);

app.get('/ready', (c) =>
  c.json({
    success: true,
    data: { ready: true },
  })
);

app.get('/api/v1/health', (c) =>
  c.json({
    success: true,
    data: { status: 'ok', service: 'la-sales-academy-api', version: '2.0.0' },
  })
);

// Mount REST API v1
app.route('/api/v1', apiRoutes);

// Global error envelope handler
app.onError((err, c) => {
  console.error('[API Error]', err);
  return c.json(
    {
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: err.message || 'Terjadi kesalahan pada server internal.',
      },
    },
    500
  );
});

// Serve compiled frontend SPA in production when dist/ exists
const distPath = path.resolve(process.cwd(), 'dist');
if (fs.existsSync(distPath)) {
  app.use('/assets/*', serveStatic({ root: './dist' }));
  app.use('/*', serveStatic({ root: './dist' }));
  app.get('*', (c) => {
    const indexFile = path.join(distPath, 'index.html');
    if (fs.existsSync(indexFile)) {
      return c.html(fs.readFileSync(indexFile, 'utf-8'));
    }
    return c.text('LA Sales Academy UI build not found', 404);
  });
}

if (process.env.VITEST !== 'true') {
  const server = serve(
    {
      fetch: app.fetch,
      port: env.PORT,
    },
    (info) => {
      console.log(
        `🚀 LA Sales Academy Server running on http://0.0.0.0:${info.port} [${env.NODE_ENV}]`
      );
    }
  );

  // Graceful shutdown
  const shutdown = () => {
    console.log('Shutting down LA Sales Academy server gracefully...');
    server.close(() => process.exit(0));
  };
  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
}

export { app };
export default app;
