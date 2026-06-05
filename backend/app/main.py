from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.db.database import init_db
from app.routes import health, investigations, auth


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: create tables + initialize MCP
    init_db()
    from app.services.mcp_client import splunk_mcp
    await splunk_mcp.initialize()
    yield


app = FastAPI(
    title=settings.app_name,
    description="Digital Operational Twins for Institutional Knowledge Preservation",
    version="0.2.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router)
app.include_router(auth.router)
app.include_router(investigations.router)
