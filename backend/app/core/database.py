from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import asyncio
import psycopg2
from app.config import settings

# SQLAlchemy setup
engine = create_engine(settings.database_url)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

async def init_db():
    """Initialize database connection and create tables if needed"""
    try:
        # Test connection
        conn = psycopg2.connect(settings.database_url)
        conn.close()
        print("✅ Database connection established")
        
        # Create tables (will be done by setup script)
        print("💾 Database ready for Sprint 1")
        
    except Exception as e:
        print(f"⚠️ Database connection failed: {e}")
        print("Database will be initialized when PostgreSQL is ready")