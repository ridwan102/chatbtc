'use client'

import { useState } from 'react'
import ChatInterface from '@/components/chat/ChatInterface'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MessageSquare, BookOpen, Zap, TrendingUp } from 'lucide-react'

export default function ChatPage() {
  const [selectedSuggestion, setSelectedSuggestion] = useState<string>('')

  const suggestions = [
    {
      category: "Bitcoin Basics",
      icon: <BookOpen className="w-4 h-4" />,
      questions: [
        "What is Bitcoin and how does it work?",
        "Explain Bitcoin mining in simple terms",
        "What makes Bitcoin different from traditional money?",
        "How do Bitcoin transactions work?"
      ]
    },
    {
      category: "Technical",
      icon: <Zap className="w-4 h-4" />,
      questions: [
        "What is the Lightning Network?",
        "Explain Bitcoin's proof-of-work consensus",
        "How does Bitcoin's blockchain ensure security?",
        "What are Bitcoin addresses and private keys?"
      ]
    },
    {
      category: "Market & Economics",
      icon: <TrendingUp className="w-4 h-4" />,
      questions: [
        "Why is Bitcoin considered digital gold?",
        "What factors affect Bitcoin's price?",
        "How does Bitcoin halving work?",
        "What is Bitcoin's monetary policy?"
      ]
    }
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bitcoin-gradient rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <MessageSquare className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-2">
            Bitcoin <span className="bitcoin-orange">AI Assistant</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Ask questions about Bitcoin and get AI-powered answers with citations from reliable sources
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Suggestions Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Questions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {suggestions.map((category, categoryIndex) => (
                  <div key={categoryIndex} className="space-y-2">
                    <div className="flex items-center space-x-2">
                      {category.icon}
                      <span className="font-medium text-sm">{category.category}</span>
                    </div>
                    <div className="space-y-1">
                      {category.questions.map((question, questionIndex) => (
                        <Button
                          key={questionIndex}
                          variant="ghost"
                          size="sm"
                          className="w-full text-left justify-start h-auto p-2 text-xs"
                          onClick={() => setSelectedSuggestion(question)}
                        >
                          {question}
                        </Button>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Features */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Chat Features</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="text-xs">RAG</Badge>
                  <span className="text-sm">Knowledge base search</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="text-xs">Citations</Badge>
                  <span className="text-sm">Source references</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="text-xs">Real-time</Badge>
                  <span className="text-sm">Current market data</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="text-xs">Multi-LLM</Badge>
                  <span className="text-sm">Best AI responses</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Chat Interface */}
          <div className="lg:col-span-2">
            <ChatInterface initialMessage={selectedSuggestion} />
          </div>
        </div>
      </div>
    </div>
  )
}