# Railway Optimized Dockerfile for ChatBTC Backend
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies (including those needed for ML libraries)
RUN apt-get update && apt-get install -y \
    build-essential \
    curl \
    gcc \
    g++ \
    git \
    libffi-dev \
    libssl-dev \
    && rm -rf /var/lib/apt/lists/*

# Upgrade pip and install build tools
RUN pip install --upgrade pip setuptools wheel

# Copy requirements and install Python dependencies
COPY backend/requirements.txt .

# Install lighter dependencies first, then heavy ML dependencies
RUN pip install --no-cache-dir fastapi uvicorn[standard] python-multipart
RUN pip install --no-cache-dir psycopg2-binary sqlalchemy pydantic pydantic-settings
RUN pip install --no-cache-dir httpx aiohttp requests python-dotenv
RUN pip install --no-cache-dir pandas numpy nltk python-jose[cryptography]
RUN pip install --no-cache-dir pytest pytest-asyncio
RUN pip install --no-cache-dir qdrant-client
RUN pip install --no-cache-dir openai

# Install heavy ML dependencies last (with timeout and retries)
RUN pip install --no-cache-dir --timeout 600 sentence-transformers || \
    pip install --no-cache-dir --timeout 900 sentence-transformers

# Copy application code
COPY backend/ .
COPY data/ ./data/

# Create necessary directories
RUN mkdir -p logs

# Set environment variables
ENV PYTHONPATH=/app
ENV PYTHONUNBUFFERED=1

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8000/api/health || exit 1

# Run the application
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "1"]