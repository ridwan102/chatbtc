#!/usr/bin/env python3
"""
Database setup script for ChatBTC application.
Initializes PostgreSQL tables and Qdrant collections.
"""

import asyncio
import os
import sys
from pathlib import Path

# Add backend to path
sys.path.append(str(Path(__file__).parent.parent / "backend"))

from app.db.postgres import PostgreSQLClient
from app.db.qdrant_client import QdrantVectorDB
from app.config import settings

async def setup_postgresql():
    """Initialize PostgreSQL database tables."""
    print("Setting up PostgreSQL database...")
    
    postgres_client = PostgreSQLClient()
    
    # Create tables
    success = await postgres_client.execute_command("""
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            email VARCHAR(255) UNIQUE NOT NULL,
            name VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    
    if success:
        await postgres_client.execute_command("""
            CREATE TABLE IF NOT EXISTS chat_sessions (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id),
                title VARCHAR(500),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        await postgres_client.execute_command("""
            CREATE TABLE IF NOT EXISTS chat_messages (
                id SERIAL PRIMARY KEY,
                session_id INTEGER REFERENCES chat_sessions(id),
                content TEXT NOT NULL,
                role VARCHAR(50) NOT NULL,  -- 'user' or 'assistant'
                citations JSONB,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        print("✅ PostgreSQL tables created successfully")
        return True
    else:
        print("❌ Failed to create PostgreSQL tables")
        return False

async def setup_qdrant():
    """Initialize Qdrant vector database collections."""
    print("Setting up Qdrant vector database...")
    
    qdrant_client = QdrantVectorDB()
    await qdrant_client.initialize()
    
    # Create Bitcoin knowledge collection
    try:
        from qdrant_client.http import models
        
        # Check if collection exists
        try:
            collection_info = qdrant_client.client.get_collection("bitcoin_knowledge")
            print("ℹ️ Qdrant 'bitcoin_knowledge' collection already exists")
            return True
        except:
            # Collection doesn't exist, create it
            qdrant_client.client.create_collection(
                collection_name="bitcoin_knowledge",
                vectors_config=models.VectorParams(
                    size=384,  # sentence-transformers/all-MiniLM-L6-v2 dimension
                    distance=models.Distance.COSINE
                )
            )
            print("✅ Qdrant 'bitcoin_knowledge' collection created successfully")
            return True
            
    except Exception as e:
        print(f"❌ Error creating Qdrant collection: {e}")
        return False

async def main():
    """Main setup function."""
    print("🚀 Starting ChatBTC database setup...")
    print(f"Database URL: {settings.database_url}")
    print(f"Qdrant URL: {settings.qdrant_url}")
    print("-" * 50)
    
    try:
        # Setup PostgreSQL
        postgres_success = await setup_postgresql()
        
        # Setup Qdrant
        qdrant_success = await setup_qdrant()
        
        if postgres_success and qdrant_success:
            print("-" * 50)
            print("✅ Database setup completed successfully!")
            print("💡 Next steps:")
            print("   1. Run 'python scripts/ingest_corpus.py' to load Bitcoin knowledge")
            print("   2. Start the application with 'docker-compose up'")
        else:
            print("❌ Database setup completed with errors")
            sys.exit(1)
        
    except Exception as e:
        print(f"❌ Database setup failed: {e}")
        sys.exit(1)

if __name__ == "__main__":
    asyncio.run(main())