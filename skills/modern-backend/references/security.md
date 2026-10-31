# Security Reference

Security is non-negotiable. Apply these to every backend regardless of framework.

## Authentication: JWT Access + Refresh Pattern

**Flow:**
1. User logs in → server issues short-lived **access token** (15 min) + long-lived **refresh token** (7 days)
2. Client sends access token in `Authorization: Bearer <token>` on each request
3. When access token expires → client calls `/auth/refresh` with refresh token → gets new pair
4. **Refresh token rotation**: each refresh invalidates the old refresh token (store a hash/jti in DB or Redis)
5. Logout → revoke the refresh token server-side

**Token contents:** keep payload minimal — `{ sub: userId, exp }`. Never put sensitive data or roles that can change in the token without short expiry.

## Refresh Token Storage & Rotation
```
- Store refresh token hashes (or a jti) in Redis or a DB table keyed by user
- On refresh: verify the presented token matches stored hash, then rotate (delete old, store new)
- On reuse of an already-rotated token → treat as compromise → revoke all sessions for that user
```

Example Redis keys:
```
refresh:{userId}:{jti}  →  hashed token, TTL = 7 days
```

## Password Hashing
- **Argon2id** is the preferred algorithm (winner of Password Hashing Competition)
- bcrypt is acceptable if Argon2 unavailable
- NEVER store plaintext, NEVER use fast hashes (MD5, SHA) for passwords
- Use library defaults for cost parameters (they're tuned)

```typescript
// TypeScript
import argon2 from 'argon2';
const hash = await argon2.hash(password);          // type defaults to argon2id
const valid = await argon2.verify(hash, password);
```
```python
# Python
from passlib.context import CryptContext
pwd = CryptContext(schemes=["argon2"], deprecated="auto")
hash = pwd.hash(password)
valid = pwd.verify(password, hash)
```

## Input Validation
- Validate **every** request body, params, and query with a schema at the boundary
- Reject unknown fields (strict mode) where possible
- Validate types, lengths, formats, ranges — not just presence
- TS: Zod `.strict()`; Python: Pydantic with `extra="forbid"` where appropriate

## Rate Limiting
Apply per-IP globally and stricter per-route on sensitive endpoints:
```
- Global:           100 req / minute / IP
- Auth (login):     5 req  / minute / IP   (prevents brute force)
- Password reset:   3 req  / hour   / IP
- Registration:     10 req / hour   / IP
```
- NestJS: `@nestjs/throttler` with `@Throttle()` per-route overrides
- Hono: custom middleware backed by Redis (INCR + EXPIRE)
- FastAPI: `slowapi` with `@limiter.limit("5/minute")` decorators

## CORS
- Explicit origin allowlist from env — **never** `origin: '*'` with credentials in production
- Restrict methods and headers to what's actually used

## Security Headers (Helmet / secureHeaders)
Set: `Content-Security-Policy`, `Strict-Transport-Security` (HSTS), `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy`.
- NestJS/Express: `helmet()`
- Hono: `secureHeaders()`
- FastAPI: add via middleware or a proxy (e.g. nginx / cloudflare)

## SQL Injection Prevention
- Always use the ORM's parameterized queries or query builder
- NEVER concatenate user input into raw SQL strings
- If raw SQL is unavoidable, use parameter binding (`$1`, `:param`)

## Secrets Management
- All secrets in environment variables, validated at startup (Zod / Pydantic Settings)
- Provide `.env.example` with every required key (no real values)
- Never commit `.env` — add to `.gitignore`
- Rotate JWT secrets if leaked; secrets ≥ 32 chars, high entropy
- In production use a secrets manager (AWS Secrets Manager, Doppler, Vault) not flat files

## Authorization (beyond authentication)
- Authentication = who you are; Authorization = what you can do
- Implement role/permission checks in guards/middleware/dependencies
- Check ownership on resource access (user can only edit their own records)
- Deny by default — explicit allow

## Other Essentials
- Hash/encrypt PII at rest where required by compliance
- Log auth events (login, failed login, token refresh) but NEVER log secrets/passwords/tokens
- Use HTTPS everywhere (TLS termination at the proxy/load balancer)
- Set secure, httpOnly, sameSite cookies if using cookie-based refresh tokens
- Implement account lockout or exponential backoff after repeated failed logins

## Common Mistakes to Avoid
- Putting mutable authorization data (roles) in long-lived tokens
- Returning different error messages for "user not found" vs "wrong password" (enables enumeration) — use a generic "Invalid credentials"
- Leaking stack traces or internal errors to clients
- Trusting client-supplied IDs without ownership checks
- Forgetting to validate query/path params (only validating the body)
