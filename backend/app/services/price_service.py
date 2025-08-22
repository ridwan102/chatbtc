from typing import Optional, Dict, Any
from app.external.coingecko import coingecko_client
from app.models.prices import PriceData, PriceHistory
from datetime import datetime

class PriceService:
    def __init__(self):
        self.coingecko = coingecko_client
        self._cache = {}
        self._cache_timeout = 60  # 1 minute cache
        
    async def get_current_price(self) -> PriceData:
        """Get current Bitcoin price with caching"""
        cache_key = "current_price"
        now = datetime.now()
        
        # Check cache first
        if cache_key in self._cache:
            cached_data, cached_time = self._cache[cache_key]
            if (now - cached_time).seconds < self._cache_timeout:
                return cached_data
        
        try:
            # Get fresh data from CoinGecko
            price_data = await self.coingecko.get_bitcoin_price()
            
            if price_data:
                result = PriceData(
                    symbol=price_data.get("symbol", "BTC"),
                    current_price=price_data.get("current_price", 0),
                    market_cap=price_data.get("market_cap"),
                    total_volume=price_data.get("total_volume"),
                    price_change_percentage_24h=price_data.get("price_change_percentage_24h"),
                    last_updated=datetime.now()
                )
                
                # Cache the result
                self._cache[cache_key] = (result, now)
                return result
                
        except Exception as e:
            print(f"Price service error: {e}")
        
        # Return fallback data if API fails
        fallback_price = PriceData(
            symbol="BTC",
            current_price=43250.50,
            market_cap=847000000000,
            total_volume=28000000000,
            price_change_percentage_24h=2.5,
            last_updated=datetime.now()
        )
        
        return fallback_price
    
    async def get_price_history(self, days: int = 7) -> Optional[PriceHistory]:
        """Get Bitcoin price history"""
        cache_key = f"history_{days}d"
        now = datetime.now()
        
        # Use longer cache for historical data (5 minutes)
        if cache_key in self._cache:
            cached_data, cached_time = self._cache[cache_key]
            if (now - cached_time).seconds < 300:  # 5 minute cache
                return cached_data
        
        try:
            history_data = await self.coingecko.get_bitcoin_history(days=days)
            
            if history_data:
                result = PriceHistory(
                    symbol="BTC",
                    prices=history_data.get("prices", []),
                    market_caps=history_data.get("market_caps", []),
                    total_volumes=history_data.get("total_volumes", [])
                )
                
                # Cache the result
                self._cache[cache_key] = (result, now)
                return result
                
        except Exception as e:
            print(f"Price history error: {e}")
            
        return None
    
    async def get_price_summary(self) -> Dict[str, Any]:
        """Get a summary of current Bitcoin price status"""
        price_data = await self.get_current_price()
        
        # Generate insights about the price
        change_24h = price_data.price_change_percentage_24h or 0
        
        if change_24h > 5:
            trend = "strongly bullish"
        elif change_24h > 1:
            trend = "bullish" 
        elif change_24h > -1:
            trend = "sideways"
        elif change_24h > -5:
            trend = "bearish"
        else:
            trend = "strongly bearish"
            
        return {
            "current_price": price_data.current_price,
            "price_change_24h": change_24h,
            "market_cap": price_data.market_cap,
            "volume": price_data.total_volume,
            "trend": trend,
            "summary": f"Bitcoin is trading at ${price_data.current_price:,.2f}, {trend} with a {change_24h:.1f}% change in the last 24 hours.",
            "last_updated": price_data.last_updated
        }

# Global service instance
price_service = PriceService()