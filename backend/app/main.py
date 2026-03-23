from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware

from app.api.routes import admin, auth, parent, public, tutor
from app.core.config import settings
from app.core.limiter import limiter
from app.core.security_headers import SecurityHeadersMiddleware
from app.db.session import Base, engine
from app.models import entities  # noqa: F401


@asynccontextmanager
async def lifespan(_: FastAPI):
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(
    title="GuruHome API",
    version="1.0.0",
    docs_url="/api/docs",
    openapi_url="/api/openapi.json",
    lifespan=lifespan,
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
app.add_middleware(SlowAPIMiddleware)
app.add_middleware(SecurityHeadersMiddleware)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.backend_cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/v1/auth", tags=["Auth"])
app.include_router(public.router, prefix="/api/v1/public", tags=["Public"])
app.include_router(parent.router, prefix="/api/v1/parent", tags=["Parent"])
app.include_router(tutor.router, prefix="/api/v1/tutor", tags=["Tutor"])
app.include_router(admin.router, prefix="/api/v1/admin", tags=["Admin"])


@app.get("/api/health")
def healthcheck():
    return {"status": "ok"}

