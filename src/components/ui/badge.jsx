import { cva } from 'class-variance-authority'
import { cn } from '@/lib/utils.js'

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full font-bold uppercase tracking-wider transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-primary/10 text-primary',
        success: 'bg-brand-green/15 text-brand-green',
        danger: 'bg-agco-red/15 text-agco-red',
        amber: 'bg-brand-amber/15 text-brand-amber',
        solidGreen: 'bg-brand-green text-white',
        solidRed: 'bg-agco-red text-white',
      },
      size: {
        default: 'px-2.5 py-1 text-[10px]',
        sm: 'px-1.5 py-0.5 text-[10px]',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  }
)

function Badge({ className, variant, size, ...props }) {
  return <span className={cn(badgeVariants({ variant, size, className }))} {...props} />
}

export { Badge, badgeVariants }
