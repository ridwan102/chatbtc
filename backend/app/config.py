from pydantic_settings import BaseSettings
from typing import Optional
import os

class Settings(BaseSettings):
    # API Keys
    openai_api_key: str
    coingecko_api_key: Optional[str] = None
    cryptopanic_api_key: Optional[str] = None
    
    # Database URLs
    database_url: str = "postgresql://chatbtc:password@localhost:5432/chatbtc_db"
    qdrant_url: str = "http://localhost:6333"
    
    # Environment
    environment: str = "development"
    debug: bool = True
    log_level: str = "info"
    
    # API Configuration
    openai_model: str = "gpt-4"
    openai_temperature: float = 0.7
    max_tokens: int = 1000
    
    # RAG Configuration
    rag_top_k: int = 3
    embedding_model: str = "all-MiniLM-L6-v2"
    
    # External API URLs
    coingecko_base_url: str = "https://api.coingecko.com/api/v3"
    cryptopanic_base_url: str = "https://cryptopanic.com/api/v1"
    
    class Config:
        env_file = ".env"
        case_sensitive = False

# Global settings instance
settings = Settings()