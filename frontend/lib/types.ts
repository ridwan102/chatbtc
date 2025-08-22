// Chat Types
export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  citations?: string[]
  timestamp: Date
  model_used?: string
}

export interface ChatRequest {
  message: string
  session_id?: string
  use_rag?: boolean
}

export interface ChatResponse {
  message: string
  citations: string[]
  session_id: string
  model_used?: string
  timestamp: string
}

export interface ChatSession {
  session_id: string
  title?: string
  created_at: string
  message_count: number
}

// Price Types
export interface PriceData {
  symbol: string
  current_price: number
  market_cap?: number
  total_volume?: number
  price_change_percentage_24h?: number
  last_updated?: string
  note?: string
}

export interface PriceHistory {
  symbol: string
  prices: number[][]
  market_caps?: number[][]
  total_volumes?: number[][]
}

export interface ChartDataPoint {
  timestamp: number
  price: number
  date: number
}

export interface ChartData {
  timeframe: string
  interval: string
  symbol: string
  data: ChartDataPoint[]
  total_points: number
}

// News Types
export interface NewsArticle {
  title: string
  url: string
  source: string
  published_at?: string
  summary?: string
  sentiment: 'positive' | 'negative' | 'neutral'
  currencies: string[]
  image_url?: string
  keywords?: string[]
}

export interface NewsResponse {
  articles: NewsArticle[]
  total_count: number
  last_updated: string
}

export interface NewsSummary {
  total_articles: number
  overall_sentiment: 'positive' | 'negative' | 'neutral'
  sentiment_breakdown: {
    positive: number
    negative: number
    neutral: number
  }
  top_sources: string[]
  sources?: string[]
  latest_headline: string
  summary: string
  last_updated: string
}

// API Response Types
export interface ApiResponse<T> {
  data?: T
  error?: string
  status: 'success' | 'error'
  message?: string
}

// Health Check Types
export interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy'
  service: string
  version: string
  timestamp: string
  environment: string
  message: string
}

export interface DetailedHealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy'
  timestamp: string
  overall_health: boolean
  services: {
    [key: string]: {
      status: 'healthy' | 'degraded' | 'unhealthy' | 'initializing'
      type: string
      message: string
      last_price?: number
    }
  }
}

// UI Component Types
export interface LoadingState {
  isLoading: boolean
  error?: string
  message?: string
}

export interface ButtonProps {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  disabled?: boolean
  loading?: boolean
  onClick?: () => void
  children: React.ReactNode
  className?: string
}

export interface CardProps {
  title?: string
  description?: string
  children: React.ReactNode
  className?: string
}

// Utility Types
export type Theme = 'light' | 'dark'

export type TimeFrame = '1d' | '7d' | '30d' | '90d' | '1y'

export type SentimentType = 'positive' | 'negative' | 'neutral'

export type ServiceStatus = 'healthy' | 'degraded' | 'unhealthy' | 'initializing'