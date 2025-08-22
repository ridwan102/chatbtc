from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class NewsArticle(BaseModel):
    """Model for news articles"""
    title: str
    url: str
    source: str
    published_at: Optional[str] = None
    summary: Optional[str] = None
    sentiment: str = "neutral"  # positive, negative, neutral
    currencies: List[str] = []
    
    class Config:
        json_schema_extra = {
            "example": {
                "title": "Bitcoin Price Surges Above $43K Amid ETF Optimism",
                "url": "https://example.com/bitcoin-news",
                "source": "CoinDesk",
                "published_at": "2024-01-15T10:30:00Z",
                "summary": "Bitcoin's price momentum continues as institutional adoption grows",
                "sentiment": "positive",
                "currencies": ["BTC"]
            }
        }

class NewsResponse(BaseModel):
    """Response model for news data"""
    articles: List[NewsArticle]
    total_count: int
    last_updated: datetime = datetime.now()
    
    class Config:
        json_schema_extra = {
            "example": {
                "articles": [
                    {
                        "title": "Bitcoin Price Analysis",
                        "url": "https://example.com/analysis",
                        "source": "CoinDesk",
                        "published_at": "2024-01-15T10:30:00Z",
                        "summary": "Technical analysis shows bullish momentum",
                        "sentiment": "positive",
                        "currencies": ["BTC"]
                    }
                ],
                "total_count": 1,
                "last_updated": "2024-01-15T10:30:00Z"
            }
        }

class NewsSummary(BaseModel):
    """Model for AI-generated news summaries"""
    title: str
    summary: str
    key_points: List[str]
    impact_level: str = "medium"  # low, medium, high
    related_topics: List[str] = []
    
    class Config:
        json_schema_extra = {
            "example": {
                "title": "Bitcoin Market Update",
                "summary": "Bitcoin shows strong momentum with institutional adoption driving prices higher",
                "key_points": [
                    "Price increased 2.5% in 24 hours",
                    "ETF applications gaining regulatory attention", 
                    "Corporate treasury adoption continues"
                ],
                "impact_level": "high",
                "related_topics": ["ETF", "regulation", "institutional adoption"]
            }
        }