from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.core.database import init_db
from app.db.qdrant_client import init_qdrant
from app.api.router import api_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    print("🚀 Starting Bitcoin ChatGPT Backend...")
    await init_db()
    await init_qdrant()
    print("✅ Backend services initialized")
    yield
    print("🛑 Backend shutting down")

# Create FastAPI application
app = FastAPI(
    title="Bitcoin ChatGPT API - Sprint 1",
    description="AI-powered Bitcoin knowledge with RAG, prices, and news",
    version="1.0.0",
    lifespan=lifespan
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://frontend:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(api_router, prefix="/api")

# Root endpoint
@app.get("/")
async def root():
    return {
        "message": "Bitcoin ChatGPT API - Sprint 1 Functional",
        "status": "running",
        "version": "1.0.0",
        "endpoints": {
            "chat": "/api/chat/message",
            "prices": "/api/prices/current",
            "news": "/api/news/latest",
            "health": "/api/health"
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)