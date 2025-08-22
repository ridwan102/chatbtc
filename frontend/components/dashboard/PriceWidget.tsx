'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import LoadingSpinner from '@/components/shared/LoadingSpinner'
import { usePrices } from '@/lib/hooks/usePrices'
import { formatPrice, formatLargeNumber, formatPercentage, getPriceChangeColor } from '@/lib/utils'
import { RefreshCw, TrendingUp, TrendingDown } from 'lucide-react'
import Link from 'next/link'

export default function PriceWidget() {
  const { price, summary, isLoading, error, refetch } = usePrices()

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <LoadingSpinner size="lg" message="Loading Bitcoin price..." bitcoin />
        </CardContent>
      </Card>
    )
  }

  if (error && !price) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span>Bitcoin Price</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={refetch}
              className="h-6 w-6"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground">
            <p>Unable to load price data</p>
            <Button variant="outline" onClick={refetch} className="mt-2">
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!price) return null

  const priceChange = price.price_change_percentage_24h || 0
  const isPositive = priceChange >= 0

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bitcoin-gradient rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xs">₿</span>
            </div>
            <span>Bitcoin Price</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={refetch}
            className="h-6 w-6"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Current Price */}
        <div className="text-center">
          <div className="text-3xl font-bold text-foreground">
            {formatPrice(price.current_price)}
          </div>
          <div className="flex items-center justify-center space-x-2 mt-1">
            <div className={`flex items-center space-x-1 ${getPriceChangeColor(priceChange)}`}>
              {isPositive ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              <span className="font-medium">
                {formatPercentage(priceChange)}
              </span>
            </div>
            <span className="text-sm text-muted-foreground">24h</span>
          </div>
        </div>

        {/* Market Stats */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Market Cap</p>
            <p className="font-semibold">
              {price.market_cap ? formatLargeNumber(price.market_cap) : 'N/A'}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">24h Volume</p>
            <p className="font-semibold">
              {price.total_volume ? formatLargeNumber(price.total_volume) : 'N/A'}
            </p>
          </div>
        </div>

        {/* Summary */}
        {summary && (
          <div className="pt-4 border-t">
            <p className="text-sm text-muted-foreground mb-2">Market Summary</p>
            <p className="text-sm leading-relaxed">
              Bitcoin is showing{' '}
              <span className={`font-medium ${
                summary.trend === 'bullish' || summary.trend === 'strongly bullish' 
                  ? 'text-green-600' 
                  : summary.trend === 'bearish' || summary.trend === 'strongly bearish'
                  ? 'text-red-600'
                  : 'text-gray-600'
              }`}>
                {summary.trend}
              </span>
              {' '}momentum with {formatPercentage(priceChange)} change in 24 hours.
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="pt-4 space-y-2">
          <Link href="/analytics" className="block">
            <Button variant="outline" className="w-full">
              View Charts & Analytics
            </Button>
          </Link>
          
          {price.note && (
            <p className="text-xs text-muted-foreground text-center">
              {price.note}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}