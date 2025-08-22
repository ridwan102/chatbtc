from typing import List, Dict, Any
from app.db.qdrant_client import vector_db
from app.config import settings

class RAGService:
    def __init__(self):
        self.vector_db = vector_db
        
    async def search_knowledge(self, query: str, limit: int = 5) -> List[Dict[str, Any]]:
        """Search Bitcoin knowledge base using RAG"""
        try:
            # Search vector database for similar content
            results = await self.vector_db.search_similar(query, limit=limit)
            
            if not results:
                # Fallback to static Bitcoin knowledge if vector DB not ready
                return self._get_fallback_knowledge(query)
                
            return results
            
        except Exception as e:
            print(f"RAG search error: {e}")
            return self._get_fallback_knowledge(query)
    
    def _get_fallback_knowledge(self, query: str) -> List[Dict[str, Any]]:
        """Provide fallback Bitcoin knowledge when vector DB is unavailable"""
        query_lower = query.lower()
        
        # Static Bitcoin knowledge base for key topics
        knowledge_base = {
            "bitcoin": {
                "content": "Bitcoin is a decentralized digital currency created by Satoshi Nakamoto in 2008. It operates on a peer-to-peer network without central authority, enabling direct transactions between parties without financial institutions.",
                "citation": "Bitcoin Whitepaper - Abstract",
                "source": "Bitcoin Whitepaper",
                "score": 0.9
            },
            "proof of work": {
                "content": "Proof of Work is a consensus mechanism where network participants (miners) compete to solve computationally difficult puzzles to validate transactions and create new blocks. This system provides security and prevents double-spending.",
                "citation": "Bitcoin Whitepaper - Section 4: Proof-of-Work", 
                "source": "Bitcoin Whitepaper",
                "score": 0.9
            },
            "mining": {
                "content": "Bitcoin mining is the process of validating transactions and adding them to the blockchain by solving cryptographic puzzles. Miners are rewarded with newly created bitcoins and transaction fees for their computational work.",
                "citation": "Bitcoin Protocol Documentation",
                "source": "Bitcoin Network",
                "score": 0.85
            },
            "blockchain": {
                "content": "A blockchain is a distributed ledger that maintains a continuously growing list of records, called blocks, linked and secured using cryptography. Each block contains a cryptographic hash of the previous block.",
                "citation": "Bitcoin Whitepaper - Section 3: Timestamp Server",
                "source": "Bitcoin Whitepaper", 
                "score": 0.85
            },
            "satoshi nakamoto": {
                "content": "Satoshi Nakamoto is the pseudonymous creator of Bitcoin who published the Bitcoin whitepaper in 2008 and released the first Bitcoin software in 2009. Their true identity remains unknown.",
                "citation": "Bitcoin History Documentation",
                "source": "Bitcoin History",
                "score": 0.9
            },
            "private key": {
                "content": "A private key is a secret cryptographic key that allows the owner to spend bitcoin associated with a specific Bitcoin address. It must be kept secure as anyone with access to the private key can spend the associated bitcoins.",
                "citation": "Bitcoin Cryptography Documentation",
                "source": "Bitcoin Security Guide",
                "score": 0.85
            },
            "halving": {
                "content": "Bitcoin halving is an event that occurs approximately every 4 years where the block reward given to miners is reduced by half. This mechanism controls Bitcoin's inflation rate and ensures the 21 million coin supply limit.",
                "citation": "Bitcoin Monetary Policy",
                "source": "Bitcoin Protocol",
                "score": 0.85
            }
        }
        
        # Find relevant knowledge
        results = []
        for key, data in knowledge_base.items():
            if any(keyword in query_lower for keyword in key.split()):
                results.append(data)
        
        # If no specific matches, provide general Bitcoin info
        if not results:
            results.append(knowledge_base["bitcoin"])
            
        return results[:limit]
    
    async def add_knowledge(self, content: str, citation: str, source: str) -> bool:
        """Add new knowledge to the vector database"""
        try:
            # Generate a simple ID (in production, use proper ID generation)
            doc_id = hash(content) % 100000
            
            success = await self.vector_db.add_document(
                content=content,
                citation=citation,
                source=source,
                doc_id=doc_id
            )
            
            return success
            
        except Exception as e:
            print(f"Knowledge addition error: {e}")
            return False

# Global service instance
rag_service = RAGService()