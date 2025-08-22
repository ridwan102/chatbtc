'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import LoadingSpinner from '@/components/shared/LoadingSpinner'
import { useNews } from '@/lib/hooks/useNews'
import { getSentimentColor, getTimeAgo } from '@/lib/utils'
import { RefreshCw, ExternalLink, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import Link from 'next/link'

export default function NewsPreview() {
  const { news, summary, isLoading, error, refetch } = useNews(5)

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <LoadingSpinner size="lg" message="Loading Bitcoin news..." bitcoin />
        </CardContent>
      </Card>
    )
  }

  if (error && news.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Bitcoin News</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground">
            <p>Unable to load news</p>
            <Button variant="outline" onClick={refetch} className="mt-2">
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment.toLowerCase()) {
      case 'positive':
        return <TrendingUp className="w-4 h-4 text-green-600" />
      case 'negative':
        return <TrendingDown className="w-4 h-4 text-red-600" />
      default:
        return <Minus className="w-4 h-4 text-gray-600" />
    }
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <span>Bitcoin News</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={refetch}
            className="h-6 w-6"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </CardTitle>
        {summary && (
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              {getSentimentIcon(summary.overall_sentiment)}
              <span>{summary.overall_sentiment} sentiment</span>
            </div>
            <span>{summary.total_articles} articles</span>
          </div>
        )}
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* News Articles */}
        <div className="space-y-3">
          {news.slice(0, 4).map((article, index) => (
            <div key={index} className="group border-b pb-3 last:border-b-0">
              <div className="flex items-start justify-between space-x-3">
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm leading-tight group-hover:text-bitcoin-orange transition-colors line-clamp-2">
                    {article.title}
                  </h4>
                  
                  {article.summary && (
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {article.summary}
                    </p>
                  )}
                  
                  <div className="flex items-center space-x-3 mt-2">
                    <span className="text-xs text-muted-foreground">
                      {article.source}
                    </span>
                    
                    <div className="flex items-center space-x-1">
                      {getSentimentIcon(article.sentiment)}
                      <span className={`text-xs ${getSentimentColor(article.sentiment)}`}>
                        {article.sentiment}
                      </span>
                    </div>
                    
                    {article.published_at && (
                      <span className="text-xs text-muted-foreground">
                        {getTimeAgo(article.published_at)}
                      </span>
                    )}
                  </div>
                </div>
                
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ExternalLink className="w-4 h-4 text-muted-foreground hover:text-bitcoin-orange" />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Summary Stats */}
        {summary && (
          <div className="pt-4 border-t">
            <p className="text-sm text-muted-foreground mb-2">Market Sentiment</p>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="space-y-1">
                <div className="text-sm font-medium text-green-600">
                  {summary.sentiment_breakdown.positive}
                </div>
                <div className="text-xs text-muted-foreground">Positive</div>
              </div>
              <div className="space-y-1">
                <div className="text-sm font-medium text-gray-600">
                  {summary.sentiment_breakdown.neutral}
                </div>
                <div className="text-xs text-muted-foreground">Neutral</div>
              </div>
              <div className="space-y-1">
                <div className="text-sm font-medium text-red-600">
                  {summary.sentiment_breakdown.negative}
                </div>
                <div className="text-xs text-muted-foreground">Negative</div>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="pt-4 space-y-2">
          <Link href="/news" className="block">
            <Button variant="outline" className="w-full">
              View All News
            </Button>
          </Link>
          
          {summary && (
            <p className="text-xs text-muted-foreground text-center">
              {summary.summary}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}