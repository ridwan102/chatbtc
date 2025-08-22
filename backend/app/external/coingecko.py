import httpx
from typing import Dict, Any, Optional
from app.config import settings
import asyncio

class CoinGeckoClient:
    def __init__(self):
        self.base_url = settings.coingecko_base_url
        self.api_key = settings.coingecko_api_key
        
    async def get_bitcoin_price(self) -> Optional[Dict[str, Any]]:
        """Get current Bitcoin price and market data"""
        try:
            # Prepare headers
            headers = {}
            if self.api_key:
                headers["x-cg-demo-api-key"] = self.api_key
            
            # Request current Bitcoin data
            url = f"{self.base_url}/simple/price"
            params = {
                "ids": "bitcoin",
                "vs_currencies": "usd",
                "include_market_cap": "true",
                "include_24hr_vol": "true",
                "include_24hr_change": "true",
                "include_last_updated_at": "true"
            }
            
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.get(url, params=params, headers=headers)
                response.raise_for_status()
                data = response.json()
                
                if "bitcoin" in data:
                    btc_data = data["bitcoin"]
                    return {
                        "symbol": "BTC",
                        "current_price": btc_data.get("usd"),
                        "market_cap": btc_data.get("usd_market_cap"),
                        "total_volume": btc_data.get("usd_24h_vol"),
                        "price_change_percentage_24h": btc_data.get("usd_24h_change"),
                        "last_updated": btc_data.get("last_updated_at")
                    }
                    
        except Exception as e:
            print(f"CoinGecko API error: {e}")
            
        # Fallback data if API fails
        return {
            "symbol": "BTC",
            "current_price": 43250.0,
            "market_cap": 847000000000,
            "total_volume": 28000000000,
            "price_change_percentage_24h": 2.5,
            "last_updated": None,
            "note": "Demo data - API unavailable"
        }
    
    async def get_bitcoin_history(self, days: int = 30) -> Optional[Dict[str, Any]]:
        """Get Bitcoin price history"""
        try:
            headers = {}
            if self.api_key:
                headers["x-cg-demo-api-key"] = self.api_key
                
            url = f"{self.base_url}/coins/bitcoin/market_chart"
            params = {
                "vs_currency": "usd",
                "days": str(days),
                "interval": "daily" if days > 1 else "hourly"
            }
            
            async with httpx.AsyncClient(timeout=15.0) as client:
                response = await client.get(url, params=params, headers=headers)
                response.raise_for_status()
                return response.json()
                
        except Exception as e:
            print(f"CoinGecko history error: {e}")
            return None

# Global client instance
coingecko_client = CoinGeckoClient()