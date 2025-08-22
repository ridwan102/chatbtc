'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import PriceWidget from '@/components/dashboard/PriceWidget'
import { usePrices } from '@/lib/hooks/usePrices'
import { formatPrice, formatPercentage, getPriceChangeColor } from '@/lib/utils'
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Calendar,
  Activity,
  PieChart,
  LineChart
} from 'lucide-react'

export default function AnalyticsPage() {
  const { price } = usePrices()

  const marketMetrics = [
    {
      title: "Market Cap",
      value: price?.market_cap ? `$${(price.market_cap / 1e12).toFixed(2)}T` : 'Loading...',
      change: null,
      icon: <DollarSign className="w-5 h-5" />,
      description: "Total market value"
    },
    {
      title: "24h Volume",
      value: price?.total_volume ? `$${(price.total_volume / 1e9).toFixed(1)}B` : 'Loading...',
      change: null,
      icon: <Activity className="w-5 h-5" />,
      description: "Trading volume"
    },
    {
      title: "Circulating Supply",
      value: "19.8M BTC", // Static value since API doesn't provide this
      change: null,
      icon: <PieChart className="w-5 h-5" />,
      description: "BTC in circulation"
    },
    {
      title: "Max Supply",
      value: "21M BTC",
      change: null,
      icon: <BarChart3 className="w-5 h-5" />,
      description: "Total BTC ever"
    }
  ]

  const timeframes = [
    { label: "1H", value: "1h", active: false },
    { label: "24H", value: "24h", active: true },
    { label: "7D", value: "7d", active: false },
    { label: "30D", value: "30d", active: false },
    { label: "1Y", value: "1y", active: false },
    { label: "ALL", value: "all", active: false }
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <BarChart3 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-2">
            Bitcoin <span className="text-blue-600">Analytics</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Comprehensive Bitcoin market data, charts, and analytical insights
          </p>
        </div>

        {/* Current Price Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5" />
              <span>Bitcoin Price Overview</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-foreground mb-1">
                  {price ? formatPrice(price.current_price) : 'Loading...'}
                </div>
                <p className="text-sm text-muted-foreground">Current Price</p>
                {price?.price_change_percentage_24h && (
                  <div className={`text-sm font-medium mt-1 ${getPriceChangeColor(price.price_change_percentage_24h)}`}>
                    {formatPercentage(price.price_change_percentage_24h)} (24h)
                  </div>
                )}
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 mb-1">
                  Coming Soon
                </div>
                <p className="text-sm text-muted-foreground">24h High</p>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600 mb-1">
                  Coming Soon
                </div>
                <p className="text-sm text-muted-foreground">24h Low</p>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600 mb-1">
                  Coming Soon
                </div>
                <p className="text-sm text-muted-foreground">All-Time High</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Market Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {marketMetrics.map((metric, index) => (
            <Card key={index}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between space-y-0 pb-2">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      {metric.title}
                    </p>
                    <div className="text-2xl font-bold">
                      {metric.value}
                    </div>
                    {metric.change && (
                      <div className={`text-xs ${getPriceChangeColor(metric.change)}`}>
                        {formatPercentage(metric.change)} (24h)
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {metric.description}
                    </p>
                  </div>
                  <div className="text-muted-foreground">
                    {metric.icon}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Price Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <LineChart className="w-5 h-5" />
                    <span>Price Chart</span>
                  </CardTitle>
                  <div className="flex space-x-1">
                    {timeframes.map((timeframe) => (
                      <Button
                        key={timeframe.value}
                        variant={timeframe.active ? "default" : "outline"}
                        size="sm"
                        className="text-xs px-3 py-1"
                      >
                        {timeframe.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-96 flex items-center justify-center bg-muted/20 rounded-lg">
                  <div className="text-center space-y-2">
                    <LineChart className="w-12 h-12 text-muted-foreground mx-auto" />
                    <p className="text-muted-foreground">
                      Interactive price chart coming soon
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Will display historical price data with technical indicators
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Live Price Widget */}
          <div className="lg:col-span-1">
            <PriceWidget />
          </div>
        </div>

        {/* Advanced Analytics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Market Analysis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Fear & Greed Index</span>
                  <Badge variant="secondary">Coming Soon</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Volatility (30d)</span>
                  <Badge variant="secondary">Coming Soon</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">RSI (14d)</span>
                  <Badge variant="secondary">Coming Soon</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Moving Avg (50d)</span>
                  <Badge variant="secondary">Coming Soon</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Network Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Hash Rate</span>
                  <Badge variant="secondary">Coming Soon</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Mining Difficulty</span>
                  <Badge variant="secondary">Coming Soon</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Mempool Size</span>
                  <Badge variant="secondary">Coming Soon</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Lightning Capacity</span>
                  <Badge variant="secondary">Coming Soon</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Feature Notice */}
        <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-3">
              <BarChart3 className="w-6 h-6 text-blue-600 mt-1" />
              <div>
                <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  Advanced Analytics Coming Soon
                </h4>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  This page will feature interactive charts, technical indicators, on-chain analytics, 
                  and advanced market data visualization tools. Currently showing basic market metrics 
                  as part of Sprint 1 functionality.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}