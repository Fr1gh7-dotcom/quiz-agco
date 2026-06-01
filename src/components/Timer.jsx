import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils.js'

// Timer robusto: misura tempo reale con Date.now(), non si blocca al lock screen.
export default function Timer({ startAt, frozen }) {
  const [, force] = useState(0)
  const raf = useRef(null)

  useEffect(() => {
    if (frozen) return
    let mounted = true
    const loop = () => {
      if (!mounted) return
      force((n) => n + 1)
      raf.current = setTimeout(loop, 250)
    }
    loop()
    return () => {
      mounted = false
      clearTimeout(raf.current)
    }
  }, [frozen, startAt])

  const elapsed = frozen ? frozen : (Date.now() - startAt) / 1000
  const within = elapsed <= 30
  return (
    <div
      className={cn(
        'tabular inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-extrabold tracking-[0.3px] transition-colors',
        within
          ? 'border-brand-green/20 bg-brand-green/10 text-brand-green'
          : 'border-brand-amber/25 bg-brand-amber/[0.12] text-brand-amber'
      )}
    >
      <span className="size-[7px] rounded-full bg-current" />
      {elapsed.toFixed(1)}s
    </div>
  )
}
