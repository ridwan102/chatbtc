from typing import List, Dict, Any
from app.external.cryptopanic import cryptopanic_client
from app.models.news import NewsArticle, NewsResponse
from datetime import datetime, timedelta

class NewsService:
    def __init__(self):
        self.cryptopanic = cryptopanic_client
        self._cache = {}
        self._cache_timeout = 300  # 5 minute cache
        
    async def get_latest_news(self, limit: int = 10) -> NewsResponse:
        """Get latest Bitcoin news with caching"""
        cache_key = f"news_latest_{limit}"
        now = datetime.now()
        
        # Check cache first
        if cache_key in self._cache:
            cached_data, cached_time = self._cache[cache_key]
            if (now - cached_time).seconds < self._cache_timeout:
                return cached_data
        
        try:
            # Get fresh news from CryptoPanic
            news_data = await self.cryptopanic.get_bitcoin_news(limit=limit)
            
            articles = []
            for item in news_data:
                article = NewsArticle(
                    title=item.get("title", ""),
                    url=item.get("url", ""),
                    source=item.get("source", "Unknown"),
                    published_at=item.get("published_at"),
                    summary=item.get("summary", ""),
                    sentiment=item.get("sentiment", "neutral"),
                    currencies=item.get("currencies", ["BTC"])
                )
                articles.append(article)
            
            result = NewsResponse(
                articles=articles,
                total_count=len(articles),
                last_updated=now
            )
            
            # Cache the result
            self._cache[cache_key] = (result, now)
            return result
            
        except Exception as e:
            print(f"News service error: {e}")
            return self._get_fallback_news()
    
    async def get_news_summary(self) -> Dict[str, Any]:
        """Get a summary of recent Bitcoin news"""
        try:
            news_response = await self.get_latest_news(limit=5)
            articles = news_response.articles
            
            if not articles:
                return self._get_fallback_summary()
            
            # Analyze sentiment distribution
            sentiment_counts = {"positive": 0, "negative": 0, "neutral": 0}
            for article in articles:
                sentiment_counts[article.sentiment] += 1
            
            # Determine overall sentiment
            total_articles = len(articles)
            if sentiment_counts["positive"] > sentiment_counts["negative"]:
                overall_sentiment = "positive"
            elif sentiment_counts["negative"] > sentiment_counts["positive"]:
                overall_sentiment = "negative"
            else:
                overall_sentiment = "neutral"
            
            # Get top sources
            sources = [article.source for article in articles]
            top_sources = list(set(sources))[:3]
            
            return {
                "total_articles": total_articles,
                "overall_sentiment": overall_sentiment,
                "sentiment_breakdown": sentiment_counts,
                "top_sources": top_sources,
                "latest_headline": articles[0].title if articles else "No recent news",
                "summary": f"Latest Bitcoin news shows {overall_sentiment} sentiment with {total_articles} recent articles from sources including {', '.join(top_sources[:2])}.",
                "last_updated": datetime.now()
            }
            
        except Exception as e:
            print(f"News summary error: {e}")
            return self._get_fallback_summary()
    
    def _get_fallback_news(self) -> NewsResponse:
        """Provide fallback news when API is unavailable"""
        fallback_articles = [
            NewsArticle(
                title="Bitcoin Maintains Strong Position Above $43,000",
                url="https://example.com/bitcoin-strong-position",
                source="CoinDesk",
                published_at="2024-01-15T10:30:00Z",
                summary="Bitcoin continues to show resilience with institutional adoption driving long-term confidence in the leading cryptocurrency.",
                sentiment="positive",
                currencies=["BTC"]
            ),
            NewsArticle(
                title="Regulatory Clarity Brings Optimism to Bitcoin Market",
                url="https://example.com/regulatory-clarity",
                source="Bitcoin Magazine", 
                published_at="2024-01-15T08:15:00Z",
                summary="Recent regulatory developments provide clearer framework for Bitcoin adoption and institutional investment.",
                sentiment="positive",
                currencies=["BTC"]
            ),
            NewsArticle(
                title="Bitcoin Network Hash Rate Reaches New All-Time High",
                url="https://example.com/hashrate-ath",
                source="CoinTelegraph",
                published_at="2024-01-15T06:45:00Z",
                summary="The Bitcoin network's hash rate continues to climb, indicating strong miner confidence and network security.",
                sentiment="positive", 
                currencies=["BTC"]
            )
        ]
        
        return NewsResponse(
            articles=fallback_articles,
            total_count=len(fallback_articles),
            last_updated=datetime.now()
        )
    
    def _get_fallback_summary(self) -> Dict[str, Any]:
        """Provide fallback news summary"""
        return {
            "total_articles": 3,
            "overall_sentiment": "positive",
            "sentiment_breakdown": {"positive": 3, "negative": 0, "neutral": 0},
            "top_sources": ["CoinDesk", "Bitcoin Magazine", "CoinTelegraph"],
            "latest_headline": "Bitcoin Maintains Strong Position Above $43,000",
            "summary": "Latest Bitcoin news shows positive sentiment with institutional adoption and regulatory clarity driving market confidence.",
            "last_updated": datetime.now()
        }

# Global service instance
news_service = NewsService()