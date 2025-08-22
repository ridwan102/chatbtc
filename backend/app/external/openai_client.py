from openai import AsyncOpenAI
from typing import List, Optional
from app.config import settings

class OpenAIClient:
    def __init__(self):
        self.client = AsyncOpenAI(api_key=settings.openai_api_key)
        self.model = settings.openai_model
        
    async def generate_response(
        self, 
        system_prompt: str, 
        user_message: str, 
        context: List[str] = None,
        temperature: float = None
    ) -> str:
        """Generate response from OpenAI GPT-4"""
        try:
            # Build system prompt with context
            if context:
                context_text = "\n\n".join(context)
                system_prompt += f"\n\nKNOWLEDGE BASE CONTEXT:\n{context_text}"
            
            messages = [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_message}
            ]
            
            response = await self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                temperature=temperature or settings.openai_temperature,
                max_tokens=settings.max_tokens
            )
            
            return response.choices[0].message.content
            
        except Exception as e:
            print(f"OpenAI API error: {e}")
            return f"I'm having trouble processing your request. Please try again. (Error: {str(e)})"
    
    async def is_available(self) -> bool:
        """Check if OpenAI API is available"""
        try:
            await self.client.models.list()
            return True
        except:
            return False

# Global client instance
openai_client = OpenAIClient()