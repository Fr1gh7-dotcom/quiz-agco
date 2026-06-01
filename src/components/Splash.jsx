import { useEffect, useState } from 'react'
import { Recycle } from 'lucide-react'
import { cn } from '@/lib/utils.js'
import { t } from '../i18n.js'

// Intro brand ~3s: "Questo progetto è stato realizzato da PHTRE" + logo,
// poi fade-out che rivela il gioco. Rispetta prefers-reduced-motion.
export default function Splash({ lang, onDone }) {
  const tr = t[lang]
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const hold = 2600
    const fade = reduce ? 0 : 650
    const t1 = setTimeout(() => setLeaving(true), hold)
    const t2 = setTimeout(onDone, hold + fade)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [onDone])

  return (
    <div
      role="status"
      aria-label={`${tr.splashLine} PHTRE`}
      className={cn(
        'fixed inset-0 z-[200] grid place-items-center overflow-hidden bg-grad-header',
        'after:absolute after:inset-x-0 after:bottom-0 after:h-[3px] after:bg-agco-red',
        leaving ? 'animate-splash-out' : 'animate-rise'
      )}
    >
      <div
        className="pointer-events-none absolute -right-[14%] -top-[22%] size-[70vmax] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(27,58,140,0.42), transparent 60%)' }}
        aria-hidden="true"
      />
      <div className="relative flex animate-splash-rise flex-col items-center gap-5 px-7 text-center">
        <Recycle className="size-11 text-white/90" strokeWidth={1.7} aria-hidden="true" />
        <span className="max-w-[26ch] text-xs font-bold uppercase leading-relaxed tracking-[2px] text-white/60">
          {tr.splashLine}
        </span>
        <img
          src="/logo-phtre.png"
          alt="PHTRE"
          className="h-[58px] w-auto rounded-[14px] bg-white object-contain px-[22px] py-3.5 shadow-elev-lg"
          onError={(e) => {
            e.target.replaceWith(Object.assign(document.createElement('span'), {
              className: 'text-[34px] font-extrabold tracking-wide text-white',
              textContent: 'PHTRE',
            }))
          }}
        />
        <span className="font-serif text-sm tracking-[0.4px] text-white/50">{tr.splashFor}</span>
      </div>
    </div>
  )
}
