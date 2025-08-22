from fastapi import APIRouter
from app.config import settings
from app.db.postgres import postgres_client
from app.db.qdrant_client import vector_db
from app.external.openai_client import openai_client
from app.external.coingecko import coingecko_client
from datetime import datetime
import asyncio

router = APIRouter(prefix="/health", tags=["health"])

@router.get("/")
async def health_check():
    """
    Basic health check endpoint
    
    Returns:
    - Service status and version
    - Timestamp of health check
    - Basic system information
    """
    return {
        "status": "healthy",
        "service": "Bitcoin ChatGPT API",
        "version": "1.0.0",
        "timestamp": datetime.now(),
        "environment": settings.environment,
        "message": "All systems operational"
    }

@router.get("/detailed")
async def detailed_health_check():
    """
    Detailed health check with service dependencies
    
    Returns:
    - Status of all external services
    - Database connectivity
    - API availability checks  
    - Performance metrics
    """
    health_status = {
        "status": "healthy",
        "timestamp": datetime.now(),
        "services": {},
        "overall_health": True
    }
    
    # Check database connectivity
    try:
        # Test PostgreSQL
        await postgres_client.execute_query("SELECT 1")
        health_status["services"]["database"] = {
            "status": "healthy",
            "type": "PostgreSQL",
            "message": "Connected successfully"
        }
    except Exception as e:
        health_status["services"]["database"] = {
            "status": "unhealthy", 
            "type": "PostgreSQL",
            "message": f"Connection failed: {str(e)}"
        }
        health_status["overall_health"] = False
    
    # Check vector database
    try:
        if vector_db.client:
            health_status["services"]["vector_db"] = {
                "status": "healthy",
                "type": "Qdrant",
                "message": "Connected successfully"
            }
        else:
            health_status["services"]["vector_db"] = {
                "status": "initializing",
                "type": "Qdrant", 
                "message": "Still initializing"
            }
    except Exception as e:
        health_status["services"]["vector_db"] = {
            "status": "unhealthy",
            "type": "Qdrant",
            "message": f"Connection failed: {str(e)}"
        }
    
    # Check OpenAI API
    try:
        is_available = await openai_client.is_available()
        health_status["services"]["llm"] = {
            "status": "healthy" if is_available else "degraded",
            "type": "OpenAI",
            "message": "API accessible" if is_available else "API issues detected"
        }
        if not is_available:
            health_status["overall_health"] = False
    except Exception as e:
        health_status["services"]["llm"] = {
            "status": "unhealthy",
            "type": "OpenAI", 
            "message": f"API check failed: {str(e)}"
        }
        health_status["overall_health"] = False
    
    # Check CoinGecko API
    try:
        price_data = await coingecko_client.get_bitcoin_price()
        if price_data and price_data.get("current_price"):
            health_status["services"]["price_api"] = {
                "status": "healthy",
                "type": "CoinGecko",
                "message": "Price data available",
                "last_price": price_data.get("current_price")
            }
        else:
            health_status["services"]["price_api"] = {
                "status": "degraded", 
                "type": "CoinGecko",
                "message": "Using fallback data"
            }
    except Exception as e:
        health_status["services"]["price_api"] = {
            "status": "degraded",
            "type": "CoinGecko",
            "message": f"Using fallback data: {str(e)}"
        }
    
    # Set overall status
    if health_status["overall_health"]:
        health_status["status"] = "healthy"
    else:
        health_status["status"] = "degraded"
    
    return health_status

@router.get("/ready")
async def readiness_check():
    """
    Kubernetes-style readiness check
    
    Returns:
    - Whether service is ready to handle requests
    - Critical dependencies status
    """
    try:
        # Check critical services only
        await postgres_client.execute_query("SELECT 1")
        
        return {
            "status": "ready",
            "message": "Service ready to handle requests",
            "timestamp": datetime.now()
        }
    except Exception as e:
        return {
            "status": "not_ready",
            "message": f"Service not ready: {str(e)}",
            "timestamp": datetime.now()
        }

@router.get("/live")
async def liveness_check():
    """
    Kubernetes-style liveness check
    
    Returns:
    - Whether service is alive and responsive
    - Basic application health
    """
    return {
        "status": "alive",
        "message": "Service is alive and responsive", 
        "timestamp": datetime.now(),
        "uptime": "Service running"
    }