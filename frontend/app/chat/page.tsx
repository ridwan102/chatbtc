'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import ChatInterface from '@/components/chat/ChatInterface'

export default function ChatPage() {
  const [initialMessage, setInitialMessage] = useState<string>('')
  const searchParams = useSearchParams()

  useEffect(() => {
    const q = searchParams.get('q')
    if (q) {
      setInitialMessage(q)
    }
  }, [searchParams])

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 overflow-hidden">
        <ChatInterface initialMessage={initialMessage} />
      </div>
    </div>
  )
}