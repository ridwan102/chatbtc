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
          {/* Header Navigation */}
          <header className="border-b border-border/20 sticky top-0 z-50 bg-background/80 backdrop-blur-sm">
            <div className="container mx-auto px-4 py-3">
              <div className="flex items-center justify-between">
                <Link href="/" className="flex items-center space-x-2">
                  <div className="w-7 h-7 bitcoin-gradient rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">₿</span>
                  </div>
                  <h1 className="text-lg font-semibold">
                    Bitcoin ChatGPT
                  </h1>
                </Link>
                
                <Link 
                  href="/chat" 
                  className="text-sm font-medium hover:text-bitcoin-orange transition-colors"
                >
                  New chat
                </Link>
              </div>
            </div>
          </header>

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