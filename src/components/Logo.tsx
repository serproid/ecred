import { getBrandLower } from '../lib/brand'
import { cn } from '../lib/cn'

type LogoProps = {
  className?: string
  variant?: 'light' | 'dark'
}

export function Logo({ className, variant = 'light' }: LogoProps) {
  return (
    <div className={cn('flex items-baseline font-bold tracking-tighter', className)}>
      <span className={variant === 'light' ? 'text-foreground' : 'text-white'}>
        {getBrandLower()}
      </span>
      <span className="text-primary">.</span>
    </div>
  )
}
