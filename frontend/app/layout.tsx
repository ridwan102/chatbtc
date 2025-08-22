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
          <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
            <div className="container mx-auto px-4 py-4">
              <div className="flex items-center justify-between">
                <Link href="/" className="flex items-center space-x-2">
                  <div className="w-8 h-8 bitcoin-gradient rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">₿</span>
                  </div>
                  <h1 className="text-xl font-bold">
                    Bitcoin <span className="bitcoin-orange">ChatGPT</span>
                  </h1>
                </Link>
                
                <nav className="hidden md:flex space-x-6">
                  <Link 
                    href="/" 
                    className="hover:text-bitcoin-orange transition-colors font-medium"
                  >
                    Dashboard
                  </Link>
                  <Link 
                    href="/chat" 
                    className="hover:text-bitcoin-orange transition-colors font-medium"
                  >
                    Chat
                  </Link>
                  <Link 
                    href="/news" 
                    className="hover:text-bitcoin-orange transition-colors font-medium"
                  >
                    News
                  </Link>
                  <Link 
                    href="/analytics" 
                    className="hover:text-bitcoin-orange transition-colors font-medium"
                  >
                    Analytics
                  </Link>
                  <Link 
                    href="/sentiment" 
                    className="text-muted-foreground cursor-not-allowed"
                    title="Available in Phase 2"
                  >
                    Sentiment
                  </Link>
                </nav>
                
                {/* Mobile Navigation */}
                <div className="md:hidden">
                  <div className="flex space-x-4">
                    <Link href="/chat" className="text-bitcoin-orange font-medium">
                      Chat
                    </Link>
                    <Link href="/analytics" className="hover:text-bitcoin-orange transition-colors">
                      Charts
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1">
            {children}
          </main>

          {/* Footer */}
          <footer className="border-t bg-muted/20 mt-12">
            <div className="container mx-auto px-4 py-6">
              <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                <div className="text-sm text-muted-foreground">
                  © 2024 Bitcoin ChatGPT - Educational purposes only, not financial advice
                </div>
                <div className="flex space-x-6 text-sm">
                  <span className="text-muted-foreground">
                    Sprint 1: Chat, News & Analytics
                  </span>
                  <a 
                    href="http://localhost:8000/docs" 
                    target="_blank"
                    className="hover:text-bitcoin-orange transition-colors"
                  >
                    API Docs
                  </a>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}