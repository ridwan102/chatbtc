'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import LoadingSpinner, { LoadingDots } from '@/components/shared/LoadingSpinner'
import { useChat } from '@/lib/hooks/useChat'
import { Copy, ArrowUp } from 'lucide-react'

interface ChatInterfaceProps {
  sessionId?: string
  className?: string
  initialMessage?: string
}

export default function ChatInterface({ sessionId = 'default', className, initialMessage }: ChatInterfaceProps) {
  const [inputMessage, setInputMessage] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { messages, isLoading, error, sendMessage, clearError } = useChat(sessionId)

  const examples = [
    "What is Bitcoin and how does it work?",
    "Explain Bitcoin mining in simple terms",
    "What makes Bitcoin different from traditional money?",
    "Who created Bitcoin and why?"
  ]

  // Set initial message and send it
  useEffect(() => {
    if (initialMessage && initialMessage !== inputMessage) {
      setInputMessage(initialMessage)
      // Auto-send the initial message
      setTimeout(() => {
        sendMessage(initialMessage, sessionId)
      }, 100)
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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
    } catch (err) {
      console.error('Failed to copy text:', err)
    }
  }

  return (
    <div className={`flex flex-col h-full max-w-4xl mx-auto ${className}`}>
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4">
        {/* Welcome Screen */}
        {messages.length === 0 && !isLoading && (
          <div className="flex flex-col items-center justify-center h-full space-y-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bitcoin-gradient rounded-full flex items-center justify-center mx-auto">
                <span className="text-white font-bold text-2xl">₿</span>
              </div>
              <h2 className="text-3xl font-semibold">I'm ready for all your Bitcoin questions</h2>
            </div>

            {/* Example Questions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-2xl">
              {examples.map((example, index) => (
                <button
                  key={index}
                  onClick={() => setInputMessage(example)}
                  className="p-4 rounded-lg border border-border hover:bg-muted transition-colors text-left text-sm"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="space-y-6 py-6">
          {messages.map((message) => (
            <div key={message.id} className="group">
              <div className={`flex items-start space-x-4 ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}>
                {message.role === 'assistant' && (
                  <div className="w-8 h-8 bitcoin-gradient rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white font-bold text-sm">₿</span>
                  </div>
                )}
                
                <div className={`max-w-[70%] ${message.role === 'user' ? 'order-2' : ''}`}>
                  <div className={`${
                    message.role === 'user' 
                      ? 'bg-bitcoin-orange text-white rounded-2xl px-4 py-3' 
                      : 'text-foreground'
                  }`}>
                    <div className="whitespace-pre-wrap leading-relaxed">
                      {message.content}
                    </div>
                  </div>

                  {/* Citations for assistant messages */}
                  {message.role === 'assistant' && message.citations && message.citations.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-border">
                      <p className="text-sm font-medium mb-2 text-muted-foreground">Sources:</p>
                      <div className="space-y-1">
                        {message.citations.map((citation, index) => (
                          <div key={index} className="text-sm text-muted-foreground">
                            {citation}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Copy button for assistant messages */}
                  {message.role === 'assistant' && (
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity mt-2">
                      <button
                        onClick={() => copyToClipboard(message.content)}
                        className="p-1 rounded hover:bg-muted transition-colors"
                        title="Copy message"
                      >
                        <Copy className="w-4 h-4 text-muted-foreground" />
                      </button>
                    </div>
                  )}
                </div>

                {message.role === 'user' && (
                  <div className="w-8 h-8 bg-bitcoin-orange rounded-full flex items-center justify-center flex-shrink-0 mt-1 order-1">
                    <span className="text-white font-bold text-sm">U</span>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bitcoin-gradient rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-sm">₿</span>
              </div>
              <div className="flex items-center space-x-2">
                <LoadingDots />
                <span className="text-sm text-muted-foreground">Thinking...</span>
              </div>
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-700">{error}</p>
              <button
                onClick={clearError}
                className="text-xs text-red-600 hover:underline mt-1"
              >
                Dismiss
              </button>
            </div>
          )}
        </div>
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="sticky bottom-0 bg-background p-4">
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Message Bitcoin ChatGPT..."
              disabled={isLoading}
              className="pr-12 py-3 rounded-2xl border-border focus:border-bitcoin-orange"
            />
            <Button
              onClick={handleSendMessage}
              disabled={isLoading || !inputMessage.trim()}
              size="sm"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 p-0 rounded-full bg-bitcoin-orange hover:bg-bitcoin-orange/90 disabled:bg-muted disabled:text-muted-foreground"
            >
              {isLoading ? (
                <LoadingSpinner size="sm" />
              ) : (
                <ArrowUp className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}