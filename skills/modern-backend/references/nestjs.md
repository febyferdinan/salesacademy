# NestJS Reference (Enterprise Default)

NestJS is the default for serious, long-lived backends. Class-based, dependency injection, strong conventions — ideal for teams of 3+.

## Install
```bash
npm i -g @nestjs/cli
nest new my-api
cd my-api
npm i @nestjs/config @nestjs/jwt @nestjs/passport passport passport-jwt
npm i @prisma/client && npm i -D prisma
npm i zod nestjs-zod
npm i argon2
npm i @nestjs/throttler          # rate limiting
npm i helmet
npm i pino nestjs-pino pino-http # structured logging
npm i ioredis
npx prisma init
```

## Project Structure
```
src/
├── main.ts                  # bootstrap, helmet, CORS, global pipes
├── app.module.ts            # root module
├── config/
│   └── env.validation.ts    # Zod-validated env
├── common/
│   ├── filters/             # global exception filter (error envelope)
│   ├── interceptors/        # response envelope, logging
│   ├── guards/              # JwtAuthGuard, RolesGuard
│   └── decorators/          # @CurrentUser(), @Roles()
├── prisma/
│   ├── prisma.module.ts
│   └── prisma.service.ts
├── modules/
│   ├── auth/
│   │   ├── auth.module.ts
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts   # business logic only
│   │   ├── auth.repository.ts
│   │   └── dto/              # Zod schemas
│   └── users/
│       ├── users.module.ts
│       ├── users.controller.ts
│       ├── users.service.ts
│       └── users.repository.ts
└── health/
    └── health.controller.ts
```

## main.ts (bootstrap)
```typescript
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { Logger } from 'nestjs-pino';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  app.useLogger(app.get(Logger));
  app.use(helmet());
  app.enableCors({
    origin: process.env.CORS_ORIGINS?.split(',') ?? [],
    credentials: true,
  });
  app.setGlobalPrefix('api/v1');
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.enableShutdownHooks();

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
```

## Env Validation (config/env.validation.ts)
```typescript
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.string().url(),
  REDIS_URL: z.string().url(),
  JWT_ACCESS_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),
  CORS_ORIGINS: z.string(),
});

export type Env = z.infer<typeof envSchema>;
export const validateEnv = (config: Record<string, unknown>): Env =>
  envSchema.parse(config);
```

## Prisma Service
```typescript
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() { await this.$connect(); }
  async onModuleDestroy() { await this.$disconnect(); }
}
```

## Controller (delegates only — no logic)
```typescript
import { Controller, Post, Body, UseGuards, Get } from '@nestjs/common';
import { ZodValidationPipe } from 'nestjs-zod';
import { AuthService } from './auth.service';
import { CreateUserSchema, CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body(new ZodValidationPipe(CreateUserSchema)) dto: CreateUserDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  login(@Body(new ZodValidationPipe(LoginSchema)) dto: LoginDto) {
    return this.authService.login(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@CurrentUser() user: { id: string }) {
    return this.authService.getProfile(user.id);
  }
}
```

## Service (business logic, framework-agnostic)
```typescript
import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { UsersRepository } from '../users/users.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly users: UsersRepository,
    private readonly jwt: JwtService,
  ) {}

  async register(dto: CreateUserDto) {
    const existing = await this.users.findByEmail(dto.email);
    if (existing) throw new ConflictException('Email already in use');

    const passwordHash = await argon2.hash(dto.password);
    const user = await this.users.create({ ...dto, passwordHash });
    return this.issueTokens(user.id);
  }

  async login(dto: LoginDto) {
    const user = await this.users.findByEmail(dto.email);
    if (!user || !(await argon2.verify(user.passwordHash, dto.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.issueTokens(user.id);
  }

  private async issueTokens(userId: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwt.signAsync({ sub: userId }, { secret: process.env.JWT_ACCESS_SECRET, expiresIn: '15m' }),
      this.jwt.signAsync({ sub: userId }, { secret: process.env.JWT_REFRESH_SECRET, expiresIn: '7d' }),
    ]);
    return { accessToken, refreshToken };
  }
}
```

## Repository (DB access only)
```typescript
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }
  create(data: { email: string; name: string; passwordHash: string }) {
    return this.prisma.user.create({ data });
  }
}
```

## Global Exception Filter (error envelope)
```typescript
import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const res = host.switchToHttp().getResponse<Response>();
    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    const message = exception instanceof HttpException ? exception.message : 'Internal server error';
    const code = HttpStatus[status] ?? 'INTERNAL_ERROR';

    res.status(status).json({ success: false, error: { code, message } });
  }
}
```

## Rate Limiting (app.module.ts)
```typescript
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 100 }]),
  ],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
```

## When NestJS is the right call
- Team of 3+, conventions matter, codebase will live for years
- You want first-party modules for auth, GraphQL, microservices, websockets
- Enterprise/FinTech/SaaS with complex domain logic
- Tradeoff: more boilerplate and a steeper learning curve than Hono/Express
