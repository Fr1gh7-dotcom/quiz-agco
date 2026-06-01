import { forwardRef } from 'react'
import { cn } from '@/lib/utils.js'

const Card = forwardRef(function Card({ className, ...props }, ref) {
  return (
    <div
      ref={ref}
      className={cn('rounded-xl border bg-card text-card-foreground shadow-elev-sm', className)}
      {...props}
    />
  )
})

const CardContent = forwardRef(function CardContent({ className, ...props }, ref) {
  return <div ref={ref} className={cn('p-5', className)} {...props} />
})

export { Card, CardContent }
