from fastapi import APIRouter, HTTPException, Query
from app.models.news import NewsResponse
from app.services.news_service import news_service
from typing import Optional

router = APIRouter(prefix="/news", tags=["news"])

@router.get("/latest", response_model=NewsResponse)
async def get_latest_news(
    limit: int = Query(default=10, ge=1, le=50, description="Number of news articles to return")
):
    """
    Get latest Bitcoin news articles
    
    Parameters:
    - limit: Number of articles (1-50, default: 10)
    
    Returns:
    - Latest Bitcoin news with summaries
    - Source attribution and sentiment analysis
    - Publication timestamps and URLs
    """
    try:
        news_response = await news_service.get_latest_news(limit=limit)
        return news_response
        
    except Exception as e:
        print(f"News endpoint error: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to retrieve latest news: {str(e)}"
        )

@router.get("/summary")
async def get_news_summary():
    """
    Get Bitcoin news summary with sentiment analysis
    
    Returns:
    - Overall market sentiment (positive/negative/neutral)
    - Top news sources and article counts
    - Recent headline highlights
    - Sentiment breakdown statistics
    """
    try:
        summary = await news_service.get_news_summary()
        return summary
        
    except Exception as e:
        print(f"News summary error: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate news summary: {str(e)}"
        )

@router.get("/sentiment")
async def get_news_sentiment(
    period: str = Query(default="24h", description="Time period: 1h, 24h, 7d")
):
    """
    Get Bitcoin news sentiment analysis for specified period
    
    Parameters:
    - period: Time period (1h, 24h, 7d)
    
    Returns:
    - Sentiment distribution (positive/negative/neutral percentages)
    - Trend analysis and key themes
    - Source reliability metrics
    """
    try:
        # For Sprint 1, we'll use the same data regardless of period
        # In future sprints, this will filter by actual time periods
        summary = await news_service.get_news_summary()
        
        total_articles = summary["total_articles"]
        sentiment_counts = summary["sentiment_breakdown"]
        
        # Calculate percentages
        sentiment_percentages = {}
        for sentiment, count in sentiment_counts.items():
            sentiment_percentages[sentiment] = round((count / total_articles * 100), 1) if total_articles > 0 else 0
        
        return {
            "period": period,
            "total_articles_analyzed": total_articles,
            "overall_sentiment": summary["overall_sentiment"],
            "sentiment_distribution": {
                "positive": sentiment_percentages.get("positive", 0),
                "negative": sentiment_percentages.get("negative", 0), 
                "neutral": sentiment_percentages.get("neutral", 0)
            },
            "sentiment_counts": sentiment_counts,
            "top_sources": summary["top_sources"],
            "analysis_summary": f"Over the {period} period, Bitcoin news sentiment is {summary['overall_sentiment']} with {sentiment_percentages.get('positive', 0)}% positive coverage.",
            "last_updated": summary["last_updated"]
        }
        
    except Exception as e:
        print(f"News sentiment error: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to analyze news sentiment: {str(e)}"
        )

@router.get("/sources")
async def get_news_sources():
    """
    Get available news sources and their reliability metrics
    
    Returns:
    - List of news sources
    - Article counts and update frequencies
    - Reliability and bias indicators
    """
    try:
        # Get recent news to analyze sources
        news_response = await news_service.get_latest_news(limit=20)
        
        # Count articles by source
        source_stats = {}
        for article in news_response.articles:
            source = article.source
            if source not in source_stats:
                source_stats[source] = {
                    "name": source,
                    "article_count": 0,
                    "sentiment_distribution": {"positive": 0, "negative": 0, "neutral": 0}
                }
            
            source_stats[source]["article_count"] += 1
            source_stats[source]["sentiment_distribution"][article.sentiment] += 1
        
        # Convert to list and add reliability scores (static for Sprint 1)
        sources = []
        reliability_map = {
            "CoinDesk": 9.5,
            "Bitcoin Magazine": 9.0,
            "CoinTelegraph": 8.5,
            "Reuters": 9.8,
            "Bloomberg": 9.7,
            "Unknown": 7.0
        }
        
        for source_name, stats in source_stats.items():
            sources.append({
                **stats,
                "reliability_score": reliability_map.get(source_name, 8.0),
                "update_frequency": "Multiple daily" if stats["article_count"] > 3 else "Daily"
            })
        
        return {
            "total_sources": len(sources),
            "sources": sorted(sources, key=lambda x: x["reliability_score"], reverse=True),
            "analysis_period": "Recent articles",
            "last_updated": news_response.last_updated
        }
        
    except Exception as e:
        print(f"News sources error: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to analyze news sources: {str(e)}"
        )