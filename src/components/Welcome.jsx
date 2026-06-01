import { Recycle, FileQuestion, Clock, Gift } from 'lucide-react'
import { Button } from './ui/button.jsx'
import { t } from '../i18n.js'

export default function Welcome({ lang, onStart }) {
  const tr = t[lang]
  const chips = [
    { icon: FileQuestion, label: tr.chipQuestions },
    { icon: Clock, label: tr.chipMinutes },
    { icon: Gift, label: tr.chipPrize },
  ]
  return (
    <div className="screen items-start justify-center gap-3.5 text-left">
      <div className="mb-1 flex items-center gap-2.5">
        <Recycle className="size-7 text-primary" strokeWidth={1.8} aria-hidden="true" />
        <span className="eyebrow">{tr.kickerWaste}</span>
      </div>
      <h1 className="max-w-[12ch] font-serif text-[29px] font-bold leading-[1.12] tracking-[-0.2px]">
        {tr.welcomeTitle}
      </h1>
      <p className="max-w-[32ch] text-[15px] leading-relaxed text-muted-foreground">{tr.welcomeSub}</p>

      <ul className="mt-3 flex flex-wrap gap-2" aria-hidden="true">
        {chips.map(({ icon: Icon, label }) => (
          <li
            key={label}
            className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/[0.06] px-3.5 py-2 text-[12.5px] font-bold text-primary"
          >
            <Icon className="size-3.5" aria-hidden="true" />
            {label}
          </li>
        ))}
      </ul>

      <Button size="lg" className="mt-4 w-full" onClick={onStart}>
        {tr.start}
      </Button>
      <p className="mt-auto pt-7 text-[11.5px] tracking-[0.3px] text-muted-foreground/70">{tr.poweredBy}</p>
    </div>
  )
}
