from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class ChatRequest(BaseModel):
    """Request model for chat messages"""
    message: str
    session_id: Optional[str] = "default"
    use_rag: bool = True
    
    class Config:
        json_schema_extra = {
            "example": {
                "message": "What is Bitcoin?",
                "session_id": "user_123",
                "use_rag": True
            }
        }

class ChatResponse(BaseModel):
    """Response model for chat messages"""
    message: str
    citations: List[str] = []
    session_id: str
    model_used: Optional[str] = None
    timestamp: datetime = datetime.now()
    
    class Config:
        json_schema_extra = {
            "example": {
                "message": "Bitcoin is a decentralized digital currency...",
                "citations": [
                    "Bitcoin Whitepaper - Abstract",
                    "Bitcoin.org - What is Bitcoin?"
                ],
                "session_id": "user_123",
                "model_used": "openai",
                "timestamp": "2024-01-15T10:30:00Z"
            }
        }

class ChatSession(BaseModel):
    """Model for chat sessions"""
    session_id: str
    title: Optional[str] = None
    created_at: datetime
    message_count: int = 0
    
    class Config:
        json_schema_extra = {
            "example": {
                "session_id": "user_123",
                "title": "Bitcoin Basics Discussion",
                "created_at": "2024-01-15T10:00:00Z",
                "message_count": 5
            }
        }

class ChatMessage(BaseModel):
    """Model for individual chat messages"""
    role: str  # "user" or "assistant"
    content: str
    citations: List[str] = []
    timestamp: datetime
    
    class Config:
        json_schema_extra = {
            "example": {
                "role": "assistant",
                "content": "Bitcoin is a peer-to-peer electronic cash system...",
                "citations": ["Bitcoin Whitepaper - Abstract"],
                "timestamp": "2024-01-15T10:30:00Z"
            }
        }