import Link from 'next/link'
import { usePrices } from '@/lib/hooks/usePrices'
import { formatPrice, formatPercentage, getPriceChangeColor } from '@/lib/utils'

export default function Header() {
  const { price, isLoading } = usePrices()

  return (
    <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo and Brand */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bitcoin-gradient rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">₿</span>
            </div>
            <div>
              <h1 className="text-xl font-bold">
                Bitcoin <span className="bitcoin-orange">ChatGPT</span>
              </h1>
              <p className="text-xs text-muted-foreground hidden sm:block">
                AI Bitcoin Assistant
              </p>
            </div>
          </Link>
          
          {/* Price Ticker */}
          <div className="hidden md:flex items-center space-x-6">
            <div className="flex items-center space-x-4 bg-muted/30 rounded-lg px-4 py-2">
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 loading-bitcoin">₿</div>
                  <span className="text-sm text-muted-foreground">Loading...</span>
                </div>
              ) : price ? (
                <>
                  <div className="text-sm">
                    <span className="text-muted-foreground">BTC </span>
                    <span className="font-semibold">
                      {formatPrice(price.current_price)}
                    </span>
                  </div>
                  {price.price_change_percentage_24h !== undefined && (
                    <div className={`text-sm font-medium ${getPriceChangeColor(price.price_change_percentage_24h)}`}>
                      {formatPercentage(price.price_change_percentage_24h)}
                    </div>
                  )}
                </>
              ) : (
                <span className="text-sm text-muted-foreground">Price unavailable</span>
              )}
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex items-center space-x-6">
            <Link 
              href="/" 
              className="hidden sm:block hover:text-bitcoin-orange transition-colors font-medium text-sm"
            >
              Dashboard
            </Link>
            <Link 
              href="/chat" 
              className="hover:text-bitcoin-orange transition-colors font-medium text-sm bg-bitcoin-orange/10 px-3 py-1 rounded-md"
            >
              Chat
            </Link>
            <Link 
              href="/news" 
              className="hidden sm:block hover:text-bitcoin-orange transition-colors font-medium text-sm"
            >
              News
            </Link>
            <Link 
              href="/analytics" 
              className="hidden sm:block hover:text-bitcoin-orange transition-colors font-medium text-sm"
            >
              Charts
            </Link>
            
            {/* Mobile Price */}
            <div className="md:hidden">
              {price && (
                <div className="text-right">
                  <div className="text-sm font-semibold">
                    {formatPrice(price.current_price)}
                  </div>
                  {price.price_change_percentage_24h !== undefined && (
                    <div className={`text-xs ${getPriceChangeColor(price.price_change_percentage_24h)}`}>
                      {formatPercentage(price.price_change_percentage_24h)}
                    </div>
                  )}
                </div>
              )}
            </div>
          </nav>
        </div>
      </div>
    </header>
  )
}