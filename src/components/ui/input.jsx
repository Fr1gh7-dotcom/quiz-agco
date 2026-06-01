import { forwardRef } from 'react'
import { cn } from '@/lib/utils.js'

const Input = forwardRef(function Input({ className, type = 'text', ...props }, ref) {
  return (
    <input
      ref={ref}
      type={type}
      className={cn(
        'flex h-12 w-full rounded-lg border border-input bg-card px-3.5 py-2 text-base text-foreground transition-shadow placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-primary focus-visible:ring-[3px] focus-visible:ring-primary/15 disabled:opacity-50',
        className
      )}
      {...props}
    />
  )
})

export { Input }
