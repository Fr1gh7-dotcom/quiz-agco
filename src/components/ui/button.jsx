import { forwardRef } from 'react'
import { cva } from 'class-variance-authority'
import { cn } from '@/lib/utils.js'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-bold tracking-[0.2px] transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-40 active:translate-y-px [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default:
          'bg-grad-blue text-primary-foreground shadow-elev-md hover:brightness-110',
        secondary:
          'border border-input bg-card text-foreground hover:bg-muted shadow-elev-sm',
        destructive: 'bg-agco-red text-white hover:brightness-110 shadow-elev-sm',
        ghost: 'text-foreground hover:bg-accent',
        dark: 'bg-brand-blue text-white hover:brightness-110',
        outline: 'border border-white/30 bg-transparent text-white hover:bg-white/10',
      },
      size: {
        default: 'h-12 px-5 text-[15px]',
        lg: 'h-14 px-6 text-base [&_svg]:size-5',
        sm: 'h-9 px-3.5 text-[13px]',
        chip: 'h-9 px-3.5 text-[13px] rounded-md',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  }
)

const Button = forwardRef(function Button({ className, variant, size, ...props }, ref) {
  return <button ref={ref} className={cn(buttonVariants({ variant, size, className }))} {...props} />
})

export { Button, buttonVariants }
