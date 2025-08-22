import axios, { AxiosResponse } from 'axios'
import { 
  ChatRequest, 
  ChatResponse, 
  PriceData, 
  ChartData,
  NewsResponse, 
  NewsSummary,
  HealthStatus,
  DetailedHealthStatus 
} from './types'

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor for logging
api.interceptors.request.use((config) => {
  console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`)
  return config
})

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message)
    return Promise.reject(error)
  }
)

// Chat API functions
export const chatApi = {
  sendMessage: async (request: ChatRequest): Promise<ChatResponse> => {
    const response: AxiosResponse<ChatResponse> = await api.post('/api/chat/message', request)
    return response.data
  },

  getChatHistory: async (sessionId: string, limit: number = 50) => {
    const response = await api.get(`/api/chat/sessions/${sessionId}/history?limit=${limit}`)
    return response.data
  },

  testChat: async () => {
    const response = await api.get('/api/chat/test')
    return response.data
  }
}

// Price API functions
export const priceApi = {
  getCurrentPrice: async (): Promise<PriceData> => {
    const response: AxiosResponse<PriceData> = await api.get('/api/prices/current')
    return response.data
  },

  getPriceHistory: async (days: number = 7) => {
    const response = await api.get(`/api/prices/history?days=${days}`)
    return response.data
  },

  getPriceSummary: async () => {
    const response = await api.get('/api/prices/summary')
    return response.data
  },

  getChartData: async (timeframe: string = '7d', interval: string = 'daily'): Promise<ChartData> => {
    const response: AxiosResponse<ChartData> = await api.get(`/api/prices/chart?timeframe=${timeframe}&interval=${interval}`)
    return response.data
  }
}

// News API functions
export const newsApi = {
  getLatestNews: async (limit: number = 10): Promise<NewsResponse> => {
    const response: AxiosResponse<NewsResponse> = await api.get(`/api/news/latest?limit=${limit}`)
    return response.data
  },

  getNewsSummary: async (): Promise<NewsSummary> => {
    const response: AxiosResponse<NewsSummary> = await api.get('/api/news/summary')
    return response.data
  },

  getNewsSentiment: async (period: string = '24h') => {
    const response = await api.get(`/api/news/sentiment?period=${period}`)
    return response.data
  },

  getNewsSources: async () => {
    const response = await api.get('/api/news/sources')
    return response.data
  }
}

// Health API functions
export const healthApi = {
  getHealth: async (): Promise<HealthStatus> => {
    const response: AxiosResponse<HealthStatus> = await api.get('/api/health')
    return response.data
  },

  getDetailedHealth: async (): Promise<DetailedHealthStatus> => {
    const response: AxiosResponse<DetailedHealthStatus> = await api.get('/api/health/detailed')
    return response.data
  },

  getReadiness: async () => {
    const response = await api.get('/api/health/ready')
    return response.data
  },

  getLiveness: async () => {
    const response = await api.get('/api/health/live')
    return response.data
  }
}

// Utility functions
export const apiUtils = {
  // Check if API is accessible
  isApiAccessible: async (): Promise<boolean> => {
    try {
      await healthApi.getHealth()
      return true
    } catch {
      return false
    }
  },

  // Get API status summary
  getApiStatus: async () => {
    try {
      const [health, detailedHealth] = await Promise.allSettled([
        healthApi.getHealth(),
        healthApi.getDetailedHealth()
      ])

      return {
        accessible: true,
        health: health.status === 'fulfilled' ? health.value : null,
        detailed: detailedHealth.status === 'fulfilled' ? detailedHealth.value : null,
        error: null
      }
    } catch (error) {
      return {
        accessible: false,
        health: null,
        detailed: null,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }
}

export default api