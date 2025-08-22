import { useState, useCallback } from 'react'
import { chatApi } from '../api'
import { ChatMessage, ChatRequest, ChatResponse } from '../types'

interface UseChatReturn {
  messages: ChatMessage[]
  isLoading: boolean
  error: string | null
  sendMessage: (message: string, sessionId?: string) => Promise<void>
  clearMessages: () => void
  clearError: () => void
}

export function useChat(initialSessionId: string = 'default'): UseChatReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const sendMessage = useCallback(async (message: string, sessionId: string = initialSessionId) => {
    if (!message.trim()) return

    // Clear any previous error
    setError(null)

    // Add user message immediately
    const userMessage: ChatMessage = {
      id: `user_${Date.now()}`,
      role: 'user',
      content: message,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)

    try {
      // Send request to API
      const request: ChatRequest = {
        message: message.trim(),
        session_id: sessionId,
        use_rag: true
      }

      const response: ChatResponse = await chatApi.sendMessage(request)

      // Add assistant response
      const assistantMessage: ChatMessage = {
        id: `assistant_${Date.now()}`,
        role: 'assistant',
        content: response.message,
        citations: response.citations,
        timestamp: new Date(response.timestamp),
        model_used: response.model_used
      }

      setMessages(prev => [...prev, assistantMessage])

    } catch (err) {
      console.error('Chat error:', err)
      
      // Add error message
      const errorMessage: ChatMessage = {
        id: `error_${Date.now()}`,
        role: 'assistant',
        content: 'Sorry, I encountered an error processing your request. Please try again.',
        timestamp: new Date()
      }

      setMessages(prev => [...prev, errorMessage])
      setError(err instanceof Error ? err.message : 'Failed to send message')

    } finally {
      setIsLoading(false)
    }
  }, [initialSessionId])

  const clearMessages = useCallback(() => {
    setMessages([])
    setError(null)
  }, [])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
    clearError
  }
}