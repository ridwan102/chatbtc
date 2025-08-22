from fastapi import APIRouter, HTTPException
from app.models.chat import ChatRequest, ChatResponse
from app.services.llm_service import llm_service
from app.services.rag_service import rag_service
from app.db.postgres import postgres_client
from datetime import datetime

router = APIRouter(prefix="/chat", tags=["chat"])

@router.post("/message", response_model=ChatResponse)
async def chat_message(request: ChatRequest):
    """
    Send a message to Bitcoin ChatGPT and get AI response with citations
    
    This endpoint:
    1. Searches Bitcoin knowledge base for relevant context (RAG)
    2. Generates AI response using OpenAI with context
    3. Returns response with citations from Bitcoin sources
    4. Saves conversation to database
    """
    try:
        # Search Bitcoin knowledge base for relevant context
        context_results = []
        citations = []
        
        if request.use_rag:
            rag_results = await rag_service.search_knowledge(
                query=request.message,
                limit=3
            )
            
            for result in rag_results:
                context_results.append(result["content"])
                citations.append(result["citation"])
        
        # Generate AI response with Bitcoin context
        ai_response = await llm_service.generate_response(
            message=request.message,
            context=context_results,
            session_id=request.session_id
        )
        
        # Save user message to database
        await postgres_client.save_chat_message(
            session_id=request.session_id,
            role="user",
            content=request.message
        )
        
        # Save assistant response to database
        await postgres_client.save_chat_message(
            session_id=request.session_id,
            role="assistant", 
            content=ai_response,
            citations=citations
        )
        
        return ChatResponse(
            message=ai_response,
            citations=citations,
            session_id=request.session_id,
            model_used=llm_service.last_model_used,
            timestamp=datetime.now()
        )
        
    except Exception as e:
        print(f"Chat endpoint error: {e}")
        raise HTTPException(
            status_code=500, 
            detail=f"Failed to process chat message: {str(e)}"
        )

@router.get("/sessions/{session_id}/history")
async def get_chat_history(session_id: str, limit: int = 50):
    """Get chat history for a specific session"""
    try:
        history = await postgres_client.get_chat_history(session_id, limit)
        return {
            "session_id": session_id,
            "messages": history,
            "total_messages": len(history)
        }
    except Exception as e:
        print(f"Chat history error: {e}")
        raise HTTPException(status_code=500, detail="Failed to retrieve chat history")

@router.get("/test")
async def test_chat():
    """Test endpoint to verify chat functionality"""
    test_request = ChatRequest(
        message="What is Bitcoin?",
        session_id="test_session",
        use_rag=True
    )
    
    try:
        response = await chat_message(test_request)
        return {
            "status": "success",
            "test_response": response,
            "message": "Chat functionality is working!"
        }
    except Exception as e:
        return {
            "status": "error",
            "error": str(e),
            "message": "Chat functionality needs attention"
        }