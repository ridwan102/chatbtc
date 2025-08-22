from qdrant_client import QdrantClient
from qdrant_client.http import models
from typing import List, Dict, Any
from app.config import settings
import asyncio
import os

# Try to import sentence transformers, fall back gracefully if not available
try:
    from sentence_transformers import SentenceTransformer
    SENTENCE_TRANSFORMERS_AVAILABLE = True
except ImportError:
    print("⚠️ sentence-transformers not available, RAG features will be disabled")
    SentenceTransformer = None
    SENTENCE_TRANSFORMERS_AVAILABLE = False

class QdrantVectorDB:
    def __init__(self):
        self.client = None
        self.model = None
        self.collection_name = "bitcoin_knowledge"
        self.rag_enabled = SENTENCE_TRANSFORMERS_AVAILABLE and os.getenv("RAG_ENABLED", "true").lower() == "true"
        
    async def initialize(self):
        """Initialize Qdrant client and embedding model"""
        try:
            # Initialize Qdrant client
            qdrant_host = settings.qdrant_url.replace("http://", "").replace("https://", "")
            if ":" in qdrant_host:
                host, port = qdrant_host.split(":")
                self.client = QdrantClient(host=host, port=int(port))
            else:
                self.client = QdrantClient(host=qdrant_host, port=6333)
            
            # Initialize embedding model only if available
            if self.rag_enabled and SENTENCE_TRANSFORMERS_AVAILABLE:
                self.model = SentenceTransformer(settings.embedding_model)
                print("✅ Qdrant vector database initialized with RAG")
            else:
                print("✅ Qdrant vector database initialized (RAG disabled)")
            
        except Exception as e:
            print(f"⚠️ Qdrant initialization failed: {e}")
            print("Vector database will be initialized when Qdrant is ready")
            self.rag_enabled = False
    
    async def search_similar(self, query: str, limit: int = 5) -> List[Dict[str, Any]]:
        """Search for similar content in the knowledge base"""
        if not self.rag_enabled:
            print("RAG disabled, returning empty results")
            return []
            
        if not self.client or not self.model:
            print("Qdrant not initialized, returning empty results")
            return []
            
        try:
            # Generate query embedding
            query_vector = self.model.encode(query).tolist()
            
            # Search in Qdrant
            search_results = self.client.search(
                collection_name=self.collection_name,
                query_vector=query_vector,
                limit=limit
            )
            
            # Format results
            results = []
            for result in search_results:
                results.append({
                    "content": result.payload.get("content", ""),
                    "citation": result.payload.get("citation", ""),
                    "source": result.payload.get("source", ""),
                    "score": result.score
                })
            
            return results
            
        except Exception as e:
            print(f"Vector search error: {e}")
            return []
    
    async def add_document(self, content: str, citation: str, source: str, doc_id: int):
        """Add a document to the vector database"""
        if not self.rag_enabled:
            print("RAG disabled, skipping document addition")
            return False
            
        if not self.client or not self.model:
            return False
            
        try:
            # Generate embedding
            vector = self.model.encode(content).tolist()
            
            # Add to Qdrant
            self.client.upsert(
                collection_name=self.collection_name,
                points=[
                    models.PointStruct(
                        id=doc_id,
                        vector=vector,
                        payload={
                            "content": content,
                            "citation": citation,
                            "source": source
                        }
                    )
                ]
            )
            return True
            
        except Exception as e:
            print(f"Document addition error: {e}")
            return False

# Global vector DB instance
vector_db = QdrantVectorDB()

async def init_qdrant():
    """Initialize Qdrant vector database"""
    await vector_db.initialize()