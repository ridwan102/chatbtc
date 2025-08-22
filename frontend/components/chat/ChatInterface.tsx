'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import LoadingSpinner, { LoadingDots } from '@/components/shared/LoadingSpinner'
import { useChat } from '@/lib/hooks/useChat'
import { formatDateTime } from '@/lib/utils'
import { Send, Copy, ExternalLink } from 'lucide-react'

interface ChatInterfaceProps {
  sessionId?: string
  className?: string
  initialMessage?: string
}

export default function ChatInterface({ sessionId = 'default', className, initialMessage }: ChatInterfaceProps) {
  const [inputMessage, setInputMessage] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { messages, isLoading, error, sendMessage, clearError } = useChat(sessionId)

  // Set initial message when provided
  useEffect(() => {
    if (initialMessage && initialMessage !== inputMessage) {
      setInputMessage(initialMessage)
    }
  }, [initialMessage])

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return

    const message = inputMessage.trim()
    setInputMessage('')
    await sendMessage(message, sessionId)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      // Could add a toast notification here
    } catch (err) {
      console.error('Failed to copy text:', err)
    }
  }

  return (
    <Card className={className}>
      <CardHeader className="border-b">
        <CardTitle className="flex items-center space-x-2">
          <div className="w-8 h-8 bitcoin-gradient rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">₿</span>
          </div>
          <span>Bitcoin ChatGPT</span>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Ask me anything about Bitcoin - I'll search the knowledge base for accurate answers
        </p>
      </CardHeader>
      
      <CardContent className="flex flex-col h-[600px]">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto space-y-4 py-4">
          {messages.length === 0 && !isLoading && (
            <div className="text-center text-muted-foreground py-8">
              <div className="mb-4">
                <div className="w-16 h-16 bitcoin-gradient rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-2xl">₿</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Welcome to Bitcoin ChatGPT!</h3>
                <p className="text-sm">Ask me anything about Bitcoin and I'll provide accurate answers with citations.</p>
              </div>
              <div className="space-y-2 text-sm">
                <p className="font-medium">Try asking:</p>
                <div className="space-y-1">
                  <button 
                    onClick={() => setInputMessage("What is Bitcoin?")}
                    className="block w-full text-left hover:text-bitcoin-orange transition-colors"
                  >
                    • "What is Bitcoin?"
                  </button>
                  <button 
                    onClick={() => setInputMessage("What is proof of work?")}
                    className="block w-full text-left hover:text-bitcoin-orange transition-colors"
                  >
                    • "What is proof of work?"
                  </button>
                  <button 
                    onClick={() => setInputMessage("Who created Bitcoin?")}
                    className="block w-full text-left hover:text-bitcoin-orange transition-colors"
                  >
                    • "Who created Bitcoin?"
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-4 py-3 ${
                  message.role === 'user'
                    ? 'bg-bitcoin-orange text-white ml-4'
                    : 'bg-muted text-foreground mr-4'
                }`}
              >
                <div className="whitespace-pre-wrap leading-relaxed">
                  {message.content}
                </div>
                
                {/* Citations */}
                {message.citations && message.citations.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-muted-foreground/20">
                    <p className="text-sm font-semibold mb-2 opacity-90">Sources:</p>
                    <div className="space-y-1">
                      {message.citations.map((citation, index) => (
                        <div key={index} className="text-sm opacity-80 flex items-start space-x-2">
                          <ExternalLink className="w-3 h-3 mt-0.5 flex-shrink-0" />
                          <span>{citation}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Message metadata */}
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-muted-foreground/20">
                  <span className="text-xs opacity-70">
                    {formatDateTime(message.timestamp)}
                  </span>
                  <div className="flex items-center space-x-2">
                    {message.model_used && (
                      <span className="text-xs opacity-70">{message.model_used}</span>
                    )}
                    <button
                      onClick={() => copyToClipboard(message.content)}
                      className="opacity-70 hover:opacity-100 transition-opacity"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {/* Loading indicator */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-lg px-4 py-3 mr-4">
                <div className="flex items-center space-x-2">
                  <LoadingDots />
                  <span className="text-sm text-muted-foreground">
                    Searching Bitcoin knowledge...
                  </span>
                </div>
              </div>
            </div>
          )}
          
          {/* Error message */}
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 mx-4">
              <p className="text-sm text-destructive">{error}</p>
              <button
                onClick={clearError}
                className="text-xs text-destructive hover:underline mt-1"
              >
                Dismiss
              </button>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t pt-4">
          <div className="flex space-x-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me about Bitcoin..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button
              onClick={handleSendMessage}
              disabled={isLoading || !inputMessage.trim()}
              variant="bitcoin"
              size="icon"
            >
              {isLoading ? (
                <LoadingSpinner size="sm" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Press Enter to send • Shift+Enter for new line
          </p>
        </div>
      </CardContent>
    </Card>
  )
}