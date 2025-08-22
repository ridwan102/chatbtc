'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import PriceWidget from '@/components/dashboard/PriceWidget'
import NewsPreview from '@/components/dashboard/NewsPreview'
import { usePrices } from '@/lib/hooks/usePrices'
import { useNews } from '@/lib/hooks/useNews'
import { formatPrice, formatPercentage, getPriceChangeColor } from '@/lib/utils'
import { MessageSquare, BarChart3, Newspaper, TrendingUp, Users, Globe } from 'lucide-react'
import Link from 'next/link'

export default function Dashboard() {
  const { price } = usePrices()
  const { summary } = useNews()

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <div className="w-20 h-20 bitcoin-gradient rounded-full flex items-center justify-center mx-auto shadow-lg">
          <span className="text-white font-bold text-3xl">₿</span>
        </div>
        <h1 className="text-4xl font-bold">
          Bitcoin <span className="bitcoin-orange">ChatGPT</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          AI-powered Bitcoin knowledge platform with real-time data, news analysis, and intelligent chat
        </p>
      </div>

      {/* Quick Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Market Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-foreground">
                {price ? formatPrice(price.current_price) : 'Loading...'}
              </div>
              <p className="text-sm text-muted-foreground">Bitcoin Price</p>
              {price?.price_change_percentage_24h && (
                <div className={`text-sm font-medium mt-1 ${getPriceChangeColor(price.price_change_percentage_24h)}`}>
                  {formatPercentage(price.price_change_percentage_24h)} (24h)
                </div>
              )}
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-foreground">
                {summary ? summary.total_articles : '0'}
              </div>
              <p className="text-sm text-muted-foreground">Recent Articles</p>
              {summary && (
                <div className={`text-sm font-medium mt-1 ${getPriceChangeColor(
                  summary.overall_sentiment === 'positive' ? 1 : 
                  summary.overall_sentiment === 'negative' ? -1 : 0
                )}`}>
                  {summary.overall_sentiment} sentiment
                </div>
              )}
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-bitcoin-orange">
                24/7
              </div>
              <p className="text-sm text-muted-foreground">AI Assistant</p>
              <p className="text-sm font-medium mt-1 text-green-600">Always Available</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* What Changed Section */}
      <Card>
        <CardHeader>
          <CardTitle>What's Happening (Last 24h)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {price && (
              <div className="flex items-center space-x-3">
                <TrendingUp className={`w-5 h-5 ${
                  (price.price_change_percentage_24h || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                }`} />
                <span className="text-sm">
                  Bitcoin price {(price.price_change_percentage_24h || 0) >= 0 ? 'increased' : 'decreased'} by{' '}
                  <span className="font-medium">
                    {Math.abs(price.price_change_percentage_24h || 0).toFixed(2)}%
                  </span>{' '}
                  to {formatPrice(price.current_price)}
                </span>
              </div>
            )}
            
            {price?.total_volume && (
              <div className="flex items-center space-x-3">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                <span className="text-sm">
                  Trading volume: <span className="font-medium">${(price.total_volume / 1e9).toFixed(1)}B</span> in 24 hours
                </span>
              </div>
            )}
            
            {summary && (
              <div className="flex items-center space-x-3">
                <Newspaper className="w-5 h-5 text-purple-600" />
                <span className="text-sm">
                  <span className="font-medium">{summary.total_articles}</span> news articles with{' '}
                  <span className={`font-medium ${
                    summary.overall_sentiment === 'positive' ? 'text-green-600' :
                    summary.overall_sentiment === 'negative' ? 'text-red-600' :
                    'text-gray-600'
                  }`}>
                    {summary.overall_sentiment}
                  </span>{' '}
                  sentiment
                </span>
              </div>
            )}
            
            <div className="flex items-center space-x-3">
              <Users className="w-5 h-5 text-orange-600" />
              <span className="text-sm">
                <span className="font-medium">AI knowledge base</span> updated with latest Bitcoin information
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Price Widget */}
        <PriceWidget />
        
        {/* News Preview */}
        <NewsPreview />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="w-12 h-12 bitcoin-gradient rounded-full flex items-center justify-center mx-auto">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Ask Bitcoin Questions</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Get AI-powered answers about Bitcoin with citations from reliable sources
                </p>
                <Link href="/chat">
                  <Button className="w-full bg-bitcoin-orange hover:bg-bitcoin-orange/90">
                    Start Chat
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">View Price Charts</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Analyze Bitcoin price trends and market data with interactive charts
                </p>
                <Link href="/analytics">
                  <Button variant="outline" className="w-full border-blue-600 text-blue-600 hover:bg-blue-50">
                    View Analytics
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Latest Bitcoin News</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Stay updated with Bitcoin news, analysis, and market sentiment
                </p>
                <Link href="/news">
                  <Button variant="outline" className="w-full border-purple-600 text-purple-600 hover:bg-purple-50">
                    Read News
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Feature Highlights */}
      <Card>
        <CardHeader>
          <CardTitle>Platform Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold">🧠 AI-Powered Knowledge</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• RAG system with Bitcoin whitepaper and documentation</li>
                <li>• Multi-LLM routing for optimal responses</li>
                <li>• Source citations for all answers</li>
                <li>• Real-time knowledge base updates</li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold">📊 Real-Time Data</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Live Bitcoin price and market data</li>
                <li>• News aggregation with sentiment analysis</li>
                <li>• Interactive price charts and analytics</li>
                <li>• Automated data updates every minute</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}