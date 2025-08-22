import { cn } from '@/lib/utils'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
  message?: string
  bitcoin?: boolean
}

export default function LoadingSpinner({ 
  size = 'md', 
  className,
  message,
  bitcoin = false
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  }

  if (bitcoin) {
    return (
      <div className={cn('flex flex-col items-center justify-center space-y-2', className)}>
        <div className={cn(
          'bitcoin-gradient rounded-full flex items-center justify-center animate-pulse',
          sizeClasses[size]
        )}>
          <span className="text-white font-bold text-xs">₿</span>
        </div>
        {message && (
          <p className="text-sm text-muted-foreground">{message}</p>
        )}
      </div>
    )
  }

  return (
    <div className={cn('flex flex-col items-center justify-center space-y-2', className)}>
      <div
        className={cn(
          'animate-spin rounded-full border-2 border-muted border-t-bitcoin-orange',
          sizeClasses[size]
        )}
      />
      {message && (
        <p className="text-sm text-muted-foreground">{message}</p>
      )}
    </div>
  )
}

export function LoadingCard({ message }: { message?: string }) {
  return (
    <div className="flex items-center justify-center p-8 bg-muted/20 rounded-lg">
      <LoadingSpinner size="lg" message={message} bitcoin />
    </div>
  )
}

export function LoadingDots() {
  return (
    <div className="flex space-x-1">
      <div className="w-2 h-2 bg-bitcoin-orange rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
      <div className="w-2 h-2 bg-bitcoin-orange rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
      <div className="w-2 h-2 bg-bitcoin-orange rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
    </div>
  )
}