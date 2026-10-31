# FastAPI Reference (Python — AI/ML & Data-Intensive)

FastAPI is the standard for Python backends in 2026, especially for AI/ML integration, LangChain/LLM backends, and data-heavy services. Async-first, Pydantic-validated, auto OpenAPI docs.

## Install
```bash
python -m venv .venv && source .venv/bin/activate
pip install "fastapi[standard]" uvicorn[standard]
pip install sqlalchemy[asyncio] asyncpg alembic
pip install pydantic-settings
pip install "passlib[argon2]" python-jose[cryptography]
pip install slowapi          # rate limiting
pip install structlog
pip install redis
```

## Project Structure
```
app/
├── main.py               # app factory, middleware, router mounting
├── core/
│   ├── config.py         # Pydantic Settings (env validation)
│   ├── security.py       # password hashing, JWT
│   └── logging.py        # structlog config
├── db/
│   ├── session.py        # async engine + session
│   └── base.py           # declarative base
├── models/               # SQLAlchemy ORM models
│   └── user.py
├── schemas/              # Pydantic request/response models
│   └── auth.py
├── repositories/         # DB access only
│   └── user.py
├── services/             # business logic
│   └── auth.py
├── api/
│   ├── deps.py           # dependencies (get_db, get_current_user)
│   └── v1/
│       ├── auth.py       # routers
│       └── users.py
└── exceptions.py         # error envelope
```

## Settings (app/core/config.py)
```python
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    ENV: str = "development"
    DATABASE_URL: str
    REDIS_URL: str
    JWT_ACCESS_SECRET: str
    JWT_REFRESH_SECRET: str
    CORS_ORIGINS: str

    @property
    def cors_origins_list(self) -> list[str]:
        return [o.strip() for o in self.CORS_ORIGINS.split(",")]

settings = Settings()  # raises at startup if required vars missing
```

## App Factory (app/main.py)
```python
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter
from slowapi.util import get_remote_address
from app.core.config import settings
from app.api.v1 import auth, users
from app.exceptions import register_exception_handlers

limiter = Limiter(key_func=get_remote_address)

@asynccontextmanager
async def lifespan(app: FastAPI):
    yield  # startup/shutdown hooks here

def create_app() -> FastAPI:
    app = FastAPI(title="API", version="1.0.0", lifespan=lifespan)
    app.state.limiter = limiter

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins_list,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    register_exception_handlers(app)

    app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])
    app.include_router(users.router, prefix="/api/v1/users", tags=["users"])

    @app.get("/health")
    async def health():
        return {"success": True, "data": {"status": "ok"}}

    return app

app = create_app()
```

## Async DB Session (app/db/session.py)
```python
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from app.core.config import settings

engine = create_async_engine(settings.DATABASE_URL, pool_pre_ping=True)
SessionLocal = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

async def get_db() -> AsyncSession:
    async with SessionLocal() as session:
        yield session
```

## Model (app/models/user.py)
```python
import uuid
from datetime import datetime
from sqlalchemy import String, DateTime, func
from sqlalchemy.orm import Mapped, mapped_column
from app.db.base import Base

class User(Base):
    __tablename__ = "users"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    name: Mapped[str] = mapped_column(String(255))
    password_hash: Mapped[str] = mapped_column(String(255))
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
```

## Pydantic Schemas (app/schemas/auth.py)
```python
from pydantic import BaseModel, EmailStr, Field

class RegisterRequest(BaseModel):
    email: EmailStr
    name: str = Field(min_length=1, max_length=255)
    password: str = Field(min_length=8, max_length=128)

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
```

## Security (app/core/security.py)
```python
from datetime import datetime, timedelta, timezone
from passlib.context import CryptContext
from jose import jwt
from app.core.config import settings

pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)

def create_token(user_id: str, secret: str, expires_minutes: int) -> str:
    expire = datetime.now(timezone.utc) + timedelta(minutes=expires_minutes)
    return jwt.encode({"sub": user_id, "exp": expire}, secret, algorithm="HS256")

def issue_tokens(user_id: str) -> dict:
    return {
        "access_token": create_token(user_id, settings.JWT_ACCESS_SECRET, 15),
        "refresh_token": create_token(user_id, settings.JWT_REFRESH_SECRET, 60 * 24 * 7),
    }
```

## Service (business logic)
```python
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.user import UserRepository
from app.core.security import hash_password, verify_password, issue_tokens
from app.exceptions import AppError

class AuthService:
    def __init__(self, db: AsyncSession):
        self.users = UserRepository(db)

    async def register(self, data: RegisterRequest) -> dict:
        if await self.users.find_by_email(data.email):
            raise AppError(409, "CONFLICT", "Email already in use")
        user = await self.users.create(
            email=data.email, name=data.name,
            password_hash=hash_password(data.password),
        )
        return issue_tokens(str(user.id))

    async def login(self, data: LoginRequest) -> dict:
        user = await self.users.find_by_email(data.email)
        if not user or not verify_password(data.password, user.password_hash):
            raise AppError(401, "UNAUTHORIZED", "Invalid credentials")
        return issue_tokens(str(user.id))
```

## Router (app/api/v1/auth.py)
```python
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.api.deps import get_db
from app.schemas.auth import RegisterRequest, LoginRequest, TokenResponse
from app.services.auth import AuthService

router = APIRouter()

@router.post("/register", status_code=201)
async def register(data: RegisterRequest, db: AsyncSession = Depends(get_db)):
    tokens = await AuthService(db).register(data)
    return {"success": True, "data": tokens}

@router.post("/login")
async def login(data: LoginRequest, db: AsyncSession = Depends(get_db)):
    tokens = await AuthService(db).login(data)
    return {"success": True, "data": tokens}
```

## Error Envelope (app/exceptions.py)
```python
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

class AppError(Exception):
    def __init__(self, status: int, code: str, message: str):
        self.status, self.code, self.message = status, code, message

def register_exception_handlers(app: FastAPI):
    @app.exception_handler(AppError)
    async def app_error_handler(_: Request, exc: AppError):
        return JSONResponse(
            status_code=exc.status,
            content={"success": False, "error": {"code": exc.code, "message": exc.message}},
        )
```

## Migrations (Alembic)
```bash
alembic init alembic
# edit alembic/env.py to use settings.DATABASE_URL + Base.metadata
alembic revision --autogenerate -m "create users"
alembic upgrade head
```

## Run
```bash
uvicorn app.main:app --reload   # dev
# prod: uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

Auto docs available at `/docs` (Swagger) and `/redoc`.

## When FastAPI is the right call
- AI/ML, LLM, LangChain, data science integration is core
- Team works in Python
- Data-intensive microservices
- Consider hybrid: TypeScript for web API + FastAPI for AI/ML microservice
