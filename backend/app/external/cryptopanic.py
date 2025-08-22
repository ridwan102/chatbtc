import httpx
from typing import List, Dict, Any, Optional
from app.config import settings
import asyncio

class CryptoPanicClient:
    def __init__(self):
        self.base_url = settings.cryptopanic_base_url
        self.api_key = settings.cryptopanic_api_key
        
    async def get_bitcoin_news(self, limit: int = 10) -> List[Dict[str, Any]]:
        """Get latest Bitcoin news from CryptoPanic"""
        try:
            # Prepare parameters
            params = {
                "auth_token": self.api_key,
                "public": "true",
                "currencies": "BTC",
                "filter": "rising",
                "limit": str(limit)
            }
            
            # Remove auth_token if not available
            if not self.api_key:
                del params["auth_token"]
                
            url = f"{self.base_url}/posts/"
            
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.get(url, params=params)
                response.raise_for_status()
                data = response.json()
                
                news_articles = []
                for item in data.get("results", []):
                    article = {
                        "title": item.get("title", ""),
                        "url": item.get("url", ""),
                        "source": item.get("source", {}).get("title", "Unknown"),
                        "published_at": item.get("published_at", ""),
                        "summary": item.get("title", "")[:200],  # Use title as summary
                        "sentiment": self._determine_sentiment(item.get("kind", "")),
                        "currencies": item.get("currencies", [])
                    }
                    news_articles.append(article)
                
                return news_articles
                
        except Exception as e:
            print(f"CryptoPanic API error: {e}")
            
        # Return fallback news if API fails
        return self._get_fallback_news()
    
    def _determine_sentiment(self, kind: str) -> str:
        """Determine sentiment from CryptoPanic kind"""
        positive_kinds = ["positive", "rising"]
        negative_kinds = ["negative", "falling"]
        
        if kind in positive_kinds:
            return "positive"
        elif kind in negative_kinds:
            return "negative"
        else:
            return "neutral"
    
    def _get_fallback_news(self) -> List[Dict[str, Any]]:
        """Get fallback news data when API is unavailable"""
        return [
            {
                "title": "Bitcoin Price Analysis: BTC Shows Strength Above $43K",
                "url": "https://example.com/bitcoin-analysis",
                "source": "CoinDesk",
                "published_at": "2024-01-15T10:30:00Z",
                "summary": "Bitcoin maintains bullish momentum as institutional adoption continues",
                "sentiment": "positive",
                "currencies": ["BTC"]
            },
            {
                "title": "SEC Reviews Bitcoin ETF Applications",
                "url": "https://example.com/sec-etf-review", 
                "source": "Reuters",
                "published_at": "2024-01-15T08:15:00Z",
                "summary": "Regulatory developments could impact Bitcoin's institutional adoption",
                "sentiment": "neutral",
                "currencies": ["BTC"]
            },
            {
                "title": "MicroStrategy Adds More Bitcoin to Treasury",
                "url": "https://example.com/microstrategy-bitcoin",
                "source": "Bitcoin Magazine",
                "published_at": "2024-01-15T06:45:00Z", 
                "summary": "Corporate adoption of Bitcoin continues with latest purchase",
                "sentiment": "positive",
                "currencies": ["BTC"]
            }
        ]

# Global client instance  
cryptopanic_client = CryptoPanicClient()