# ChatBTC Setup Scripts

This directory contains setup scripts for initializing the ChatBTC application database and knowledge base.

## Scripts

### 1. setup_database.py
Initializes the PostgreSQL database tables and Qdrant vector collections.

**Usage:**
```bash
cd /Users/ridwan/Documents/chatbtc
python scripts/setup_database.py
```

**What it does:**
- Creates PostgreSQL tables (users, chat_sessions, chat_messages)
- Creates Qdrant vector collection for Bitcoin knowledge
- Verifies database connections

### 2. ingest_corpus.py
Loads Bitcoin knowledge base into the Qdrant vector database.

**Usage:**
```bash
cd /Users/ridwan/Documents/chatbtc
python scripts/ingest_corpus.py
```

**What it does:**
- Loads Bitcoin glossary terms from `data/bitcoin_corpus/glossary/bitcoin_glossary.json`
- Generates embeddings for each term and definition
- Stores vectors in Qdrant for RAG functionality
- Verifies ingestion with test search

## Setup Order

1. **Start Docker services:**
   ```bash
   docker-compose up -d postgres qdrant redis
   ```

2. **Setup database:**
   ```bash
   python scripts/setup_database.py
   ```

3. **Ingest knowledge base:**
   ```bash
   python scripts/ingest_corpus.py
   ```

4. **Start full application:**
   ```bash
   docker-compose up
   ```

## Requirements

- Docker and Docker Compose
- Python 3.8+
- All dependencies from `backend/requirements.txt`

## Environment Variables

Ensure these are set in your `.env` file:
- `DATABASE_URL`
- `QDRANT_URL`
- `OPENAI_API_KEY`