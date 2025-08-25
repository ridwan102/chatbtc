'use client'

import { Button } from '@/components/ui/button'
import { ArrowRight, MessageSquare } from 'lucide-react'
import Link from 'next/link'

export default function HomePage() {
  const examples = [
    "What is Bitcoin and how does it work?",
    "Explain Bitcoin mining in simple terms", 
    "What makes Bitcoin different from traditional money?",
    "Who created Bitcoin and why?"
  ]

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-6 text-center">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Hero Section */}
        <div className="space-y-6">
          <div className="w-24 h-24 bitcoin-gradient rounded-full flex items-center justify-center mx-auto">
            <span className="text-white font-bold text-4xl">₿</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold">
            Bitcoin <span className="bitcoin-orange">ChatGPT</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
            Get instant, accurate answers about Bitcoin from our AI assistant
          </p>
        </div>

        {/* CTA Button */}
        <div className="flex justify-center">
          <Link href="/chat">
            <Button size="lg" className="bg-bitcoin-orange hover:bg-bitcoin-orange/90 text-white px-8 py-4 text-lg font-semibold group">
              Start chatting
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        {/* Example Questions */}
        <div className="mt-16 space-y-6">
          <h2 className="text-2xl font-semibold text-muted-foreground">
            Try asking
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
            {examples.map((example, index) => (
              <Link key={index} href={`/chat?q=${encodeURIComponent(example)}`}>
                <div className="group p-4 rounded-lg border border-border hover:border-bitcoin-orange/50 hover:shadow-md transition-all cursor-pointer text-left">
                  <div className="flex items-start space-x-3">
                    <MessageSquare className="w-5 h-5 text-muted-foreground group-hover:text-bitcoin-orange transition-colors flex-shrink-0 mt-0.5" />
                    <p className="text-sm group-hover:text-bitcoin-orange transition-colors">
                      {example}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}