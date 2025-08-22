from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class PriceData(BaseModel):
    """Model for Bitcoin price data"""
    symbol: str = "BTC"
    current_price: float
    market_cap: Optional[float] = None
    total_volume: Optional[float] = None
    price_change_percentage_24h: Optional[float] = None
    last_updated: Optional[datetime] = None
    
    class Config:
        json_schema_extra = {
            "example": {
                "symbol": "BTC",
                "current_price": 43250.50,
                "market_cap": 847000000000,
                "total_volume": 28000000000,
                "price_change_percentage_24h": 2.5,
                "last_updated": "2024-01-15T10:30:00Z"
            }
        }

class PriceHistory(BaseModel):
    """Model for historical price data"""
    symbol: str = "BTC"
    prices: List[List[float]]  # [[timestamp, price], ...]
    market_caps: Optional[List[List[float]]] = None
    total_volumes: Optional[List[List[float]]] = None
    
    class Config:
        json_schema_extra = {
            "example": {
                "symbol": "BTC",
                "prices": [
                    [1705305600000, 42500.0],
                    [1705392000000, 43250.0]
                ],
                "market_caps": [
                    [1705305600000, 830000000000],
                    [1705392000000, 847000000000]
                ],
                "total_volumes": [
                    [1705305600000, 25000000000],
                    [1705392000000, 28000000000]
                ]
            }
        }

class PriceMetrics(BaseModel):
    """Model for derived price metrics"""
    symbol: str = "BTC"
    volatility_30d: Optional[float] = None
    rsi: Optional[float] = None
    moving_average_50d: Optional[float] = None
    moving_average_200d: Optional[float] = None
    all_time_high: Optional[float] = None
    all_time_low: Optional[float] = None
    
    class Config:
        json_schema_extra = {
            "example": {
                "symbol": "BTC",
                "volatility_30d": 45.2,
                "rsi": 58.7,
                "moving_average_50d": 41200.0,
                "moving_average_200d": 38500.0,
                "all_time_high": 69000.0,
                "all_time_low": 0.1
            }
        }