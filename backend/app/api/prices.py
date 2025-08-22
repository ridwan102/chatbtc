from fastapi import APIRouter, HTTPException, Query
from app.models.prices import PriceData, PriceHistory
from app.services.price_service import price_service
from typing import Optional

router = APIRouter(prefix="/prices", tags=["prices"])

@router.get("/current", response_model=PriceData)
async def get_current_price():
    """
    Get current Bitcoin price and market data
    
    Returns:
    - Current BTC price in USD
    - Market cap and trading volume
    - 24-hour price change percentage
    - Last updated timestamp
    """
    try:
        price_data = await price_service.get_current_price()
        return price_data
        
    except Exception as e:
        print(f"Price endpoint error: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to retrieve current price: {str(e)}"
        )

@router.get("/history", response_model=Optional[PriceHistory])
async def get_price_history(
    days: int = Query(default=7, ge=1, le=365, description="Number of days of price history")
):
    """
    Get Bitcoin price history for specified number of days
    
    Parameters:
    - days: Number of days (1-365, default: 7)
    
    Returns:
    - Historical price, market cap, and volume data
    - Timestamps and values for charting
    """
    try:
        history_data = await price_service.get_price_history(days=days)
        
        if not history_data:
            raise HTTPException(
                status_code=404,
                detail="Price history data not available"
            )
            
        return history_data
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Price history error: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to retrieve price history: {str(e)}"
        )

@router.get("/summary")
async def get_price_summary():
    """
    Get Bitcoin price summary with trend analysis
    
    Returns:
    - Current price and market data
    - Price trend analysis (bullish/bearish/sideways)
    - Summary text describing current market conditions
    """
    try:
        summary = await price_service.get_price_summary()
        return summary
        
    except Exception as e:
        print(f"Price summary error: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate price summary: {str(e)}"
        )

@router.get("/chart")
async def get_chart_data(
    timeframe: str = Query(default="7d", description="Timeframe: 1d, 7d, 30d, 90d, 1y"),
    interval: str = Query(default="daily", description="Data interval: hourly, daily")
):
    """
    Get Bitcoin price data formatted for charts
    
    Parameters:
    - timeframe: 1d, 7d, 30d, 90d, 1y
    - interval: hourly, daily
    
    Returns:
    - Chart-ready price data with timestamps
    - OHLC data when available
    """
    try:
        # Map timeframes to days
        timeframe_map = {
            "1d": 1,
            "7d": 7, 
            "30d": 30,
            "90d": 90,
            "1y": 365
        }
        
        days = timeframe_map.get(timeframe, 7)
        history = await price_service.get_price_history(days=days)
        
        if not history:
            return {
                "timeframe": timeframe,
                "interval": interval,
                "data": [],
                "message": "Chart data not available"
            }
        
        # Format for charting (convert to simpler format)
        chart_data = []
        for price_point in history.prices:
            chart_data.append({
                "timestamp": price_point[0],
                "price": price_point[1],
                "date": price_point[0] # Will be converted to readable format by frontend
            })
        
        return {
            "timeframe": timeframe,
            "interval": interval,
            "symbol": "BTC",
            "data": chart_data,
            "total_points": len(chart_data)
        }
        
    except Exception as e:
        print(f"Chart data error: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to retrieve chart data: {str(e)}"
        )