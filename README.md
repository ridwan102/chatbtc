# Bitcoin ChatGPT - Sprint 1 Functional

AI-powered Bitcoin knowledge and analytics platform with RAG (Retrieval Augmented Generation).

## ✅ Sprint 1 Features (100% Functional)
- **Bitcoin ChatGPT**: Ask questions, get AI answers with citations from Bitcoin knowledge base
- **Live Price Data**: Real-time Bitcoin price and charts from CoinGecko
- **News Feed**: Latest Bitcoin news with AI-generated summaries from CryptoPanic
- **RAG System**: Searches Bitcoin whitepaper, glossary, and timeline for accurate responses

## 🚀 Quick Start

1. **Setup & Start**:
   ```bash
   ./setup.sh
   ```

2. **Test Chat**:
   - Open http://localhost:3000/chat
   - Ask: "What is Bitcoin?"
   - Ask: "What is proof of work?"
   - Ask: "Who created Bitcoin?"

3. **View Dashboard**:
   - Open http://localhost:3000
   - See live Bitcoin price, news, and quick actions

## 🔧 Services
- **Frontend**: http://localhost:3000 (Next.js + Tailwind CSS)
- **Backend API**: http://localhost:8000 (FastAPI + Python)
- **API Docs**: http://localhost:8000/docs
- **Qdrant UI**: http://localhost:6334 (Vector database interface)
- **PostgreSQL**: localhost:5432

## 💬 Chat Testing
The chat should work immediately with:
- Bitcoin knowledge from whitepaper, glossary, and timeline
- Citations from reliable sources (Bitcoin Whitepaper, Bitcoin History, etc.)
- AI responses via OpenAI GPT-4

## 🧠 RAG System
- **Vector Database**: Qdrant stores Bitcoin knowledge embeddings
- **Knowledge Sources**: Bitcoin whitepaper, glossary terms, historical timeline
- **Search**: Semantic similarity search finds relevant context for questions
- **Citations**: All responses include source attribution

## 🏗️ Architecture
- **Frontend**: Next.js 14 with App Router, TypeScript, Tailwind CSS
- **Backend**: FastAPI with async/await, PostgreSQL, Qdrant vector DB
- **LLM**: OpenAI GPT-4 integration with context-aware prompting
- **Data**: CoinGecko (prices), CryptoPanic (news), Bitcoin knowledge base

Ready for Phase 2 foundations after testing!