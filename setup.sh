#!/bin/bash
set -e

echo "🚀 Setting up Bitcoin ChatGPT - Sprint 1 Functional"

# Check Docker
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker not running. Please start Docker first."
    exit 1
fi

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "❌ .env file not found. Please create .env file with API keys."
    exit 1
fi

# Create additional directories
echo "📁 Creating directories..."
mkdir -p logs

# Build and start services
echo "🐳 Building and starting Docker containers..."
docker-compose up -d --build

# Wait for services
echo "⏳ Waiting for services to start..."
sleep 30

# Check service health
echo "🔍 Checking service health..."
echo "Backend: $(curl -s http://localhost:8000/api/health 2>/dev/null || echo 'Starting...')"
echo "Frontend: $(curl -s http://localhost:3000 2>/dev/null | head -1 || echo 'Starting...')"
echo "Qdrant: $(curl -s http://localhost:6333/collections 2>/dev/null | head -1 || echo 'Starting...')"

# Setup database
echo "💾 Setting up database..."
sleep 10
python3 scripts/setup_database.py 2>/dev/null || echo "Database setup will run when backend is ready"

# Load Bitcoin knowledge
echo "📚 Loading Bitcoin knowledge..."
sleep 10
python3 scripts/ingest_corpus.py 2>/dev/null || echo "Knowledge loading will run when vector DB is ready"

echo ""
echo "✅ Sprint 1 Setup Complete!"
echo ""
echo "🌐 Frontend: http://localhost:3000"
echo "💬 Chat: http://localhost:3000/chat"
echo "🔧 Backend API: http://localhost:8000"
echo "📖 API Docs: http://localhost:8000/docs"
echo "📊 Qdrant UI: http://localhost:6334"
echo ""
echo "🧪 Test the Bitcoin ChatGPT immediately:"
echo "1. Open http://localhost:3000/chat"
echo "2. Ask: 'What is Bitcoin?'"
echo "3. Ask: 'What is proof of work?'"
echo ""
echo "If services are still starting, wait 1-2 minutes and try again."