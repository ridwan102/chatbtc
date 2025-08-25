import './globals.css'
import { Inter } from 'next/font/google'
import Link from 'next/link'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Bitcoin ChatGPT - AI Bitcoin Assistant',
  description: 'AI-powered Bitcoin knowledge platform with chat, news, and analytics',
  keywords: 'Bitcoin, AI, ChatGPT, cryptocurrency, blockchain, price, news',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-background text-foreground">
          {/* Main Content */}
          <main className="flex-1">
            {children}
          </main>

          {/* Footer */}
          <footer className="border-t border-border/10 mt-auto">
            <div className="container mx-auto px-4 py-4">
              <div className="text-center text-xs text-muted-foreground">
                Educational purposes only, not financial advice
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}