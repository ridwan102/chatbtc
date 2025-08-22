from fastapi import APIRouter
from app.api import chat, prices, news, health

# Create main API router
api_router = APIRouter()

# Include all endpoint routers
api_router.include_router(chat.router, tags=["chat"])
api_router.include_router(prices.router, tags=["prices"]) 
api_router.include_router(news.router, tags=["news"])
api_router.include_router(health.router, tags=["health"])

@api_router.get("/")
async def api_root():
    return {
        "message": "Bitcoin ChatGPT API - Sprint 1",
        "version": "1.0.0",
        "endpoints": [
            "/api/chat/message",
            "/api/prices/current",
            "/api/news/latest", 
            "/api/health"
        ]
    }