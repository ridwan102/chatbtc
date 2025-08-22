#!/usr/bin/env python3
"""
Corpus ingestion script for ChatBTC application.
Loads Bitcoin knowledge base into Qdrant vector database.
"""

import asyncio
import json
import os
import sys
from pathlib import Path
from typing import List, Dict, Any
import uuid

# Add backend to path
sys.path.append(str(Path(__file__).parent.parent / "backend"))

from app.services.rag_service import rag_service
from app.db.qdrant_client import vector_db

async def load_glossary_terms() -> List[Dict[str, Any]]:
    """Load Bitcoin glossary terms from JSON file."""
    glossary_path = Path(__file__).parent.parent / "data" / "bitcoin_corpus" / "glossary" / "bitcoin_glossary.json"
    
    print(f"Loading glossary from: {glossary_path}")
    
    if not glossary_path.exists():
        raise FileNotFoundError(f"Glossary file not found: {glossary_path}")
    
    with open(glossary_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    terms = data.get('terms', [])
    print(f"✅ Loaded {len(terms)} glossary terms")
    return terms

async def prepare_documents(terms: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """Prepare documents for vector storage."""
    documents = []
    
    for term in terms:
        # Create document content combining term and definition
        content = f"Term: {term['term']}\n\nDefinition: {term['definition']}"
        
        document = {
            "id": str(uuid.uuid4()),
            "content": content,
            "metadata": {
                "term": term['term'],
                "definition": term['definition'],
                "source": term.get('source', ''),
                "category": term.get('category', ''),
                "type": "glossary_term"
            }
        }
        documents.append(document)
    
    print(f"✅ Prepared {len(documents)} documents for ingestion")
    return documents

async def ingest_documents(documents: List[Dict[str, Any]]):
    """Ingest documents into Qdrant vector database."""
    print("Starting document ingestion into Qdrant...")
    
    # Initialize vector database
    await vector_db.initialize()
    
    # Check if collection exists
    try:
        collection_info = vector_db.client.get_collection("bitcoin_knowledge")
        print(f"✅ Found collection 'bitcoin_knowledge' with {collection_info.points_count} existing documents")
            
    except Exception as e:
        print(f"❌ Error checking collection: {e}")
        print("Please run setup_database.py first.")
        return False
    
    # Store documents using the RAG service
    success_count = 0
    error_count = 0
    
    for i, doc in enumerate(documents):
        try:
            print(f"Processing document {i+1}/{len(documents)}: {doc['metadata']['term']}")
            
            # Store using RAG service
            success = await rag_service.add_knowledge(
                content=doc['content'],
                citation=doc['metadata'].get('source', 'Bitcoin Knowledge Base'),
                source=doc['metadata'].get('source', 'Bitcoin Documentation')
            )
            
            if success:
                success_count += 1
            else:
                error_count += 1
            
        except Exception as e:
            print(f"❌ Error processing document '{doc['metadata']['term']}': {e}")
            error_count += 1
    
    print(f"\n📊 Ingestion Results:")
    print(f"   ✅ Successfully ingested: {success_count} documents")
    print(f"   ❌ Failed to ingest: {error_count} documents")
    
    return error_count == 0

async def verify_ingestion():
    """Verify that documents were successfully ingested."""
    print("\n🔍 Verifying ingestion...")
    
    try:
        # Get collection info
        collection_info = vector_db.client.get_collection("bitcoin_knowledge")
        document_count = collection_info.points_count
        
        print(f"✅ Collection 'bitcoin_knowledge' contains {document_count} documents")
        
        # Test search functionality
        test_query = "What is Bitcoin?"
        search_results = await rag_service.search_knowledge(test_query, limit=3)
        
        if search_results:
            print(f"✅ Search test successful - found {len(search_results)} relevant results")
            print(f"   Top result: {search_results[0].get('content', 'Unknown')[:100]}...")
        else:
            print("⚠️ Search test returned no results")
            
        return True
        
    except Exception as e:
        print(f"❌ Verification failed: {e}")
        return False

async def main():
    """Main ingestion function."""
    print("🚀 Starting ChatBTC corpus ingestion...")
    print("-" * 50)
    
    try:
        # Load glossary terms
        terms = await load_glossary_terms()
        
        # Prepare documents
        documents = await prepare_documents(terms)
        
        # Ingest into vector database
        success = await ingest_documents(documents)
        
        if success:
            # Verify ingestion
            await verify_ingestion()
            
            print("-" * 50)
            print("✅ Corpus ingestion completed successfully!")
            print("💡 The Bitcoin knowledge base is now ready for use")
            print("🚀 You can now start the ChatBTC application with 'docker-compose up'")
        else:
            print("❌ Corpus ingestion completed with errors")
            sys.exit(1)
            
    except Exception as e:
        print(f"❌ Corpus ingestion failed: {e}")
        sys.exit(1)

if __name__ == "__main__":
    asyncio.run(main())