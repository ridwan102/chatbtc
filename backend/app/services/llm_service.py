from typing import List, Optional
from app.external.openai_client import openai_client
from app.config import settings

class LLMService:
    def __init__(self):
        self.openai = openai_client
        self.last_model_used = None
        
    async def generate_response(
        self, 
        message: str, 
        context: List[str] = None,
        session_id: Optional[str] = None
    ) -> str:
        """Generate response using OpenAI with Bitcoin-focused prompting"""
        
        # Build Bitcoin-focused system prompt
        system_prompt = self._build_bitcoin_system_prompt(context)
        
        try:
            # Try OpenAI first
            if await self.openai.is_available():
                response = await self.openai.generate_response(
                    system_prompt=system_prompt,
                    user_message=message,
                    context=context
                )
                self.last_model_used = "openai"
                return response
            else:
                raise Exception("OpenAI not available")
                
        except Exception as e:
            print(f"LLM generation error: {e}")
            self.last_model_used = "fallback"
            return self._get_fallback_response(message)
    
    def _build_bitcoin_system_prompt(self, context: List[str] = None) -> str:
        """Build Bitcoin-specific system prompt with RAG context"""
        base_prompt = """You are a Bitcoin expert assistant with deep knowledge of Bitcoin technology, economics, and history.

GUIDELINES:
1. Focus specifically on Bitcoin - not general cryptocurrency
2. Use the provided knowledge base context to answer questions accurately
3. Always cite your sources when referencing specific information
4. Be educational and informative, but avoid giving financial advice
5. If you don't know something, say so clearly and suggest reliable sources
6. Keep responses concise but comprehensive

RESPONSE FORMAT:
- Provide clear, accurate answers based on Bitcoin knowledge
- Include "Sources:" section at the end when using knowledge base content
- Use technical accuracy but explain complex concepts clearly
- No price predictions or investment advice

IMPORTANT: You have access to authoritative Bitcoin sources including the Bitcoin whitepaper, technical documentation, and historical data. Use this knowledge to provide accurate, well-sourced answers."""

        if context:
            context_text = "\n\n".join(context)
            base_prompt += f"\n\nKNOWLEDGE BASE CONTEXT:\n{context_text}"
        
        return base_prompt
    
    def _get_fallback_response(self, message: str) -> str:
        """Provide fallback response when LLM services are unavailable"""
        message_lower = message.lower()
        
        # Simple keyword-based responses for common questions
        if "what is bitcoin" in message_lower:
            return """Bitcoin is a decentralized digital currency created by Satoshi Nakamoto in 2008. It operates on a peer-to-peer network without the need for central authorities like banks or governments.

Key features:
• Decentralized and permissionless
• Limited supply of 21 million coins
• Secured by proof-of-work consensus
• Enables direct peer-to-peer transactions

Sources: Bitcoin Whitepaper (2008)

Note: This is a basic response. For more detailed information, the full AI system will provide comprehensive answers with citations."""
            
        elif "proof of work" in message_lower:
            return """Proof of Work is the consensus mechanism that secures the Bitcoin network. Miners compete to solve computationally difficult puzzles to validate transactions and create new blocks.

Key aspects:
• Miners use computational power to solve cryptographic puzzles
• First miner to solve the puzzle gets to add the next block
• Provides security through economic incentives
• Makes the network resistant to attacks

Sources: Bitcoin Whitepaper, Section 4 - Proof-of-Work

Note: This is a basic response. The full AI system provides more detailed explanations with proper citations."""
            
        else:
            return f"""I'd be happy to help answer your Bitcoin question: "{message}"

However, the AI system is currently initializing. Please wait a moment and try again, or check that all services are running properly.

In the meantime, you can explore reliable Bitcoin resources:
• Bitcoin.org - Official Bitcoin website
• Bitcoin Whitepaper - Original technical paper
• Bitcoin Wiki - Community documentation

The full system will provide comprehensive answers with citations from the Bitcoin knowledge base."""

# Global service instance
llm_service = LLMService()