import { useState, useEffect, useCallback } from 'react'
import { priceApi } from '../api'
import { PriceData, ChartData } from '../types'

interface UsePricesReturn {
  price: PriceData | null
  chartData: ChartData | null
  summary: any
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
  getChartData: (timeframe: string) => Promise<void>
}

export function usePrices(): UsePricesReturn {
  const [price, setPrice] = useState<PriceData | null>(null)
  const [chartData, setChartData] = useState<ChartData | null>(null)
  const [summary, setSummary] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCurrentPrice = useCallback(async () => {
    try {
      setError(null)
      const data = await priceApi.getCurrentPrice()
      setPrice(data)
    } catch (err) {
      console.error('Price fetch error:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch price data')
      
      // Set fallback price data
      setPrice({
        symbol: 'BTC',
        current_price: 43250.50,
        market_cap: 847000000000,
        total_volume: 28000000000,
        price_change_percentage_24h: 2.5,
        last_updated: new Date().toISOString(),
        note: 'Demo data - API unavailable'
      })
    }
  }, [])

  const fetchSummary = useCallback(async () => {
    try {
      const data = await priceApi.getPriceSummary()
      setSummary(data)
    } catch (err) {
      console.error('Summary fetch error:', err)
      // Create fallback summary
      setSummary({
        current_price: 43250.50,
        price_change_24h: 2.5,
        market_cap: 847000000000,
        volume: 28000000000,
        trend: 'bullish',
        summary: 'Bitcoin is trading at $43,250.50, bullish with a 2.5% change in the last 24 hours.',
        last_updated: new Date().toISOString()
      })
    }
  }, [])

  const getChartData = useCallback(async (timeframe: string = '7d') => {
    try {
      setError(null)
      const data = await priceApi.getChartData(timeframe)
      setChartData(data)
    } catch (err) {
      console.error('Chart data error:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch chart data')
      
      // Create fallback chart data
      const now = Date.now()
      const mockData = Array.from({ length: 7 }, (_, i) => ({
        timestamp: now - (7 - i) * 24 * 60 * 60 * 1000,
        price: 42000 + Math.random() * 2000,
        date: now - (7 - i) * 24 * 60 * 60 * 1000
      }))

      setChartData({
        timeframe,
        interval: 'daily',
        symbol: 'BTC',
        data: mockData,
        total_points: mockData.length
      })
    }
  }, [])

  const refetch = useCallback(async () => {
    setIsLoading(true)
    await Promise.all([
      fetchCurrentPrice(),
      fetchSummary(),
      getChartData('7d')
    ])
    setIsLoading(false)
  }, [fetchCurrentPrice, fetchSummary, getChartData])

  // Initial data load
  useEffect(() => {
    refetch()
  }, [refetch])

  // Auto-refresh every 60 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchCurrentPrice()
      fetchSummary()
    }, 60000) // 1 minute

    return () => clearInterval(interval)
  }, [fetchCurrentPrice, fetchSummary])

  return {
    price,
    chartData,
    summary,
    isLoading,
    error,
    refetch,
    getChartData
  }
}