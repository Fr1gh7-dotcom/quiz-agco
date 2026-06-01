import { useEffect, useState } from 'react'
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
    <div className={`splash ${leaving ? 'leaving' : ''}`} role="status" aria-label={`${tr.splashLine} PHTRE`}>
      <div className="splash-glow" aria-hidden="true" />
      <div className="splash-inner">
        <svg className="splash-mark" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M7 19H4.815a1.83 1.83 0 0 1-1.57-.881 1.785 1.785 0 0 1-.004-1.784L7.196 9.5" />
          <path d="M11 19h8.203a1.83 1.83 0 0 0 1.556-.89 1.784 1.784 0 0 0 0-1.775l-1.226-2.12" />
          <path d="m14 16-3 3 3 3" />
          <path d="M8.293 13.596 7.196 9.5 3.1 10.598" />
          <path d="m9.344 5.811 1.093-1.892A1.83 1.83 0 0 1 11.985 3a1.784 1.784 0 0 1 1.546.888l3.943 6.843" />
          <path d="m13.378 9.633 4.096 1.098 1.097-4.096" />
        </svg>
        <span className="splash-kicker">{tr.splashLine}</span>
        <img
          src="/logo-phtre.png"
          alt="PHTRE"
          className="splash-logo"
          onError={(e) => {
            e.target.replaceWith(Object.assign(document.createElement('span'), {
              className: 'splash-logo-fallback',
              textContent: 'PHTRE',
            }))
          }}
        />
        <span className="splash-for">{tr.splashFor}</span>
      </div>
    </div>
  )
}
