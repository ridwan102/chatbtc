from qdrant_client import QdrantClient
from qdrant_client.http import models
from sentence_transformers import SentenceTransformer
from typing import List, Dict, Any
from app.config import settings
import asyncio

class QdrantVectorDB:
    def __init__(self):
        self.client = None
        self.model = None
        self.collection_name = "bitcoin_knowledge"
        
    async def initialize(self):
        """Initialize Qdrant client and embedding model"""
        try:
            # Initialize Qdrant client
            qdrant_host = settings.qdrant_url.replace("http://", "").replace("https://", "")
            host, port = qdrant_host.split(":")
            self.client = QdrantClient(host=host, port=int(port))
            
            # Initialize embedding model
            self.model = SentenceTransformer(settings.embedding_model)
            
            print("✅ Qdrant vector database initialized")
            
        except Exception as e:
            print(f"⚠️ Qdrant initialization failed: {e}")
            print("Vector database will be initialized when Qdrant is ready")
    
    async def search_similar(self, query: str, limit: int = 5) -> List[Dict[str, Any]]:
        """Search for similar content in the knowledge base"""
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