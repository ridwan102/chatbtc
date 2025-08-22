'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import NewsPreview from '@/components/dashboard/NewsPreview'
import { useNews } from '@/lib/hooks/useNews'
import { formatDistanceToNow } from 'date-fns'
import { 
  Globe, 
  Search, 
  Filter, 
  Clock, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  ExternalLink,
  RefreshCw
} from 'lucide-react'

export default function NewsPage() {
  const { news, summary, isLoading, refetch } = useNews()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSentiment, setSelectedSentiment] = useState<string>('all')
  const [selectedTimeframe, setSelectedTimeframe] = useState('24h')

  const sentimentFilters = [
    { label: 'All', value: 'all', count: news?.length || 0 },
    { label: 'Positive', value: 'positive', count: news.filter(a => a.sentiment === 'positive').length || 0 },
    { label: 'Neutral', value: 'neutral', count: news.filter(a => a.sentiment === 'neutral').length || 0 },
    { label: 'Negative', value: 'negative', count: news.filter(a => a.sentiment === 'negative').length || 0 }
  ]

  const timeframeFilters = [
    { label: '1H', value: '1h' },
    { label: '6H', value: '6h' },
    { label: '24H', value: '24h' },
    { label: '7D', value: '7d' }
  ]

  const filteredArticles = news.filter(article => {
    const matchesSearch = !searchTerm || 
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (article.summary && article.summary.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesSentiment = selectedSentiment === 'all' || article.sentiment === selectedSentiment
    
    return matchesSearch && matchesSentiment
  })

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return <TrendingUp className="w-4 h-4 text-green-600" />
      case 'negative':
        return <TrendingDown className="w-4 h-4 text-red-600" />
      default:
        return <Minus className="w-4 h-4 text-gray-600" />
    }
  }

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'text-green-600 bg-green-50 border-green-200'
      case 'negative':
        return 'text-red-600 bg-red-50 border-red-200'
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Globe className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-2">
            Bitcoin <span className="text-purple-600">News</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Stay updated with the latest Bitcoin news, analysis, and market sentiment from trusted sources
          </p>
        </div>

        {/* News Summary */}
        {summary && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>News Summary (24h)</span>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={refetch}
                  disabled={isLoading}
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-foreground">
                    {summary.total_articles}
                  </div>
                  <p className="text-sm text-muted-foreground">Total Articles</p>
                </div>
                
                <div className="text-center">
                  <div className={`text-3xl font-bold ${
                    summary.overall_sentiment === 'positive' ? 'text-green-600' :
                    summary.overall_sentiment === 'negative' ? 'text-red-600' :
                    'text-gray-600'
                  }`}>
                    {summary.overall_sentiment.charAt(0).toUpperCase() + summary.overall_sentiment.slice(1)}
                  </div>
                  <p className="text-sm text-muted-foreground">Overall Sentiment</p>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">
                    {summary.top_sources?.length || 0}
                  </div>
                  <p className="text-sm text-muted-foreground">News Sources</p>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600">
                    <Clock className="w-8 h-8 mx-auto" />
                  </div>
                  <p className="text-sm text-muted-foreground">Real-time Updates</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Filters */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 space-y-4">
            {/* Search */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex space-x-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Search Bitcoin news..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <div className="flex space-x-2">
                    {timeframeFilters.map((timeframe) => (
                      <Button
                        key={timeframe.value}
                        variant={selectedTimeframe === timeframe.value ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedTimeframe(timeframe.value)}
                      >
                        {timeframe.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Sentiment Filters */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-4">
                  <Filter className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Filter by sentiment:</span>
                  <div className="flex space-x-2">
                    {sentimentFilters.map((filter) => (
                      <Button
                        key={filter.value}
                        variant={selectedSentiment === filter.value ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedSentiment(filter.value)}
                        className="space-x-1"
                      >
                        <span>{filter.label}</span>
                        <Badge variant="secondary" className="text-xs">
                          {filter.count}
                        </Badge>
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Articles List */}
            <div className="space-y-4">
              {isLoading ? (
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-center py-8">
                      <RefreshCw className="w-6 h-6 animate-spin text-muted-foreground mr-2" />
                      <span className="text-muted-foreground">Loading latest Bitcoin news...</span>
                    </div>
                  </CardContent>
                </Card>
              ) : filteredArticles && filteredArticles.length > 0 ? (
                filteredArticles.map((article, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardContent className="pt-6">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center space-x-2">
                              {getSentimentIcon(article.sentiment)}
                              <Badge className={`text-xs ${getSentimentColor(article.sentiment)}`}>
                                {article.sentiment}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {article.source}
                              </span>
                              <span className="text-xs text-muted-foreground">•</span>
                              <span className="text-xs text-muted-foreground">
                                {formatDistanceToNow(new Date(article.published_at || Date.now()), { addSuffix: true })}
                              </span>
                            </div>
                            <h3 className="font-semibold text-lg leading-tight hover:text-bitcoin-orange transition-colors">
                              <a href={article.url} target="_blank" rel="noopener noreferrer">
                                {article.title}
                              </a>
                            </h3>
                            {article.summary && (
                              <p className="text-muted-foreground text-sm line-clamp-2">
                                {article.summary}
                              </p>
                            )}
                          </div>
                          {article.image_url && (
                            <div className="ml-4 flex-shrink-0">
                              <img
                                src={article.image_url}
                                alt={article.title}
                                className="w-24 h-24 object-cover rounded-lg"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none'
                                }}
                              />
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center justify-between pt-2">
                          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                            {article.keywords && (
                              <div className="flex space-x-1">
                                {article.keywords.slice(0, 3).map((keyword, idx) => (
                                  <Badge key={idx} variant="outline" className="text-xs">
                                    {keyword}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                          <Button variant="ghost" size="sm" asChild>
                            <a href={article.url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="w-4 h-4 mr-1" />
                              Read Full Article
                            </a>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center py-8">
                      <Globe className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="font-semibold mb-2">No articles found</h3>
                      <p className="text-muted-foreground text-sm">
                        Try adjusting your search or filter criteria
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <NewsPreview />
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">News Sources</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {summary?.sources?.map((source, index) => (
                  <div key={index} className="flex justify-between items-center text-sm">
                    <span>{source}</span>
                    <Badge variant="outline" className="text-xs">
                      {news.filter(a => a.source === source).length || 0}
                    </Badge>
                  </div>
                )) || (
                  <p className="text-sm text-muted-foreground">Loading sources...</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Trending Keywords</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {['Bitcoin', 'BTC', 'Cryptocurrency', 'Mining', 'Blockchain', 'DeFi', 'ETF', 'Lightning'].map((keyword) => (
                    <Badge key={keyword} variant="secondary" className="text-xs">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Feature Notice */}
        <Card className="bg-purple-50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-800">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-3">
              <Globe className="w-6 h-6 text-purple-600 mt-1" />
              <div>
                <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">
                  News Aggregation Active
                </h4>
                <p className="text-sm text-purple-700 dark:text-purple-300">
                  Bitcoin news is automatically aggregated from multiple sources with sentiment analysis. 
                  Advanced features like source ranking, topic clustering, and personalized feeds 
                  will be added in future sprints.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}