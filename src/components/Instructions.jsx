import { ListChecks, Timer, Trophy } from 'lucide-react'
import { Button } from './ui/button.jsx'
import { t } from '../i18n.js'

export default function Instructions({ lang, onGo }) {
  const tr = t[lang]
  const steps = [
    { icon: ListChecks, text: tr.instr1 },
    { icon: Timer, text: tr.instr2 },
    { icon: Trophy, text: tr.instr3 },
  ]
  return (
    <div className="screen justify-center gap-[18px]">
      <h2 className="font-serif text-[22px] font-semibold leading-tight">{tr.instrTitle}</h2>
      <ul className="flex flex-col gap-2.5">
        {steps.map(({ icon: Icon, text }, i) => (
          <li
            key={i}
            className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 text-[15px] shadow-elev-sm"
          >
            <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
              <Icon className="size-5" aria-hidden="true" />
            </span>
            {text}
          </li>
        ))}
      </ul>
      <Button size="lg" className="mt-1.5 w-full" onClick={onGo}>
        {tr.instrGo}
      </Button>
    </div>
  )
}
