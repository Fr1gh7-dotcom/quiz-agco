import { useEffect, useRef, useState } from 'react'
import { Check, X, ArrowRight, FileText } from 'lucide-react'
import Timer from './Timer.jsx'
import { Button } from './ui/button.jsx'
import { Badge } from './ui/badge.jsx'
import { cn } from '@/lib/utils.js'
import { t } from '../i18n.js'

const LETTERS = ['A', 'B', 'C', 'D']

export default function Question({ lang, q, index, total, onAnswer, onNext }) {
  const tr = t[lang]
  const data = q[lang]
  const [startAt, setStartAt] = useState(Date.now())
  const [selected, setSelected] = useState(null)
  const [seconds, setSeconds] = useState(null)
  const feedbackRef = useRef(null)

  useEffect(() => {
    setStartAt(Date.now())
    setSelected(null)
    setSeconds(null)
  }, [q.id])

  useEffect(() => {
    if (selected !== null && feedbackRef.current) {
      feedbackRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' })
    }
  }, [selected])

  function choose(i) {
    if (selected !== null) return
    const elapsed = (Date.now() - startAt) / 1000
    setSelected(i)
    setSeconds(elapsed)
    onAnswer({ correct: i === q.rispostaCorretta, seconds: elapsed })
  }

  const answered = selected !== null
  const last = index === total - 1
  const isOk = selected === q.rispostaCorretta

  return (
    <div className="screen">
      <div className="mb-2.5 flex items-center justify-between">
        <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/70">
          {tr.question} {index + 1} {tr.of} {total}
        </span>
        <Timer startAt={startAt} frozen={seconds} />
      </div>

      <div className="mb-[22px] h-[5px] overflow-hidden rounded-full bg-accent">
        <div
          className="h-full rounded-full bg-grad-blue shadow-[0_0_8px_rgba(27,58,140,0.4)] transition-[width] duration-500 ease-out"
          style={{ width: `${((index + 1) / total) * 100}%` }}
        />
      </div>

      <h2 className="mb-5 font-serif text-[21px] font-semibold leading-[1.32] tracking-[-0.1px]">
        {data.domanda}
      </h2>

      <div className="flex flex-col gap-2.5">
        {data.opzioni.map((opt, i) => {
          const correct = answered && i === q.rispostaCorretta
          const wrong = answered && i === selected && !correct
          const dim = answered && !correct && !wrong
          return (
            <button
              key={i}
              onClick={() => choose(i)}
              disabled={answered}
              style={{ animationDelay: `${i * 55}ms` }}
              className={cn(
                'group flex animate-opt-in items-center gap-3.5 rounded-lg border bg-card p-3.5 text-left text-[15px] shadow-elev-sm transition-all duration-150 active:translate-y-px',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                !answered && 'border-input hover:border-primary hover:bg-muted hover:shadow-elev-md',
                correct && 'border-brand-green bg-brand-green/[0.08] shadow-elev-md ring-1 ring-brand-green/25',
                wrong && 'border-agco-red bg-agco-red/[0.07]',
                dim && 'border-input opacity-50'
              )}
            >
              <span
                className={cn(
                  'grid size-[30px] shrink-0 place-items-center rounded-lg border text-sm font-extrabold transition-all',
                  !answered && 'border-input bg-[#dfe3ea] text-primary group-hover:border-primary group-hover:bg-primary group-hover:text-white',
                  correct && 'animate-pop border-brand-green bg-brand-green text-white',
                  wrong && 'animate-pop border-agco-red bg-agco-red text-white',
                  dim && 'border-input bg-[#dfe3ea] text-primary'
                )}
              >
                {correct ? <Check className="size-4" strokeWidth={3} /> : wrong ? <X className="size-4" strokeWidth={3} /> : LETTERS[i]}
              </span>
              <span className="flex-1">{opt}</span>
            </button>
          )
        })}
      </div>

      {answered && (
        <div className="mt-4 flex animate-rise flex-col gap-3" ref={feedbackRef} role="status" aria-live="polite">
          <div className="flex items-center gap-2.5">
            <span
              className={cn(
                'grid size-[26px] place-items-center rounded-full text-white animate-pop',
                isOk ? 'bg-brand-green' : 'bg-agco-red'
              )}
            >
              {isOk ? <Check className="size-4" strokeWidth={3} /> : <X className="size-4" strokeWidth={3} />}
            </span>
            <Badge variant={isOk ? 'solidGreen' : 'solidRed'}>{isOk ? tr.correct : tr.wrong}</Badge>
          </div>
          <p className="flex gap-2.5 rounded-lg border-l-2 border-primary bg-muted px-3.5 py-3 text-[13px] leading-relaxed text-muted-foreground">
            <FileText className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
            <span>
              <b className="tabular text-foreground">EER {q.cer}</b>
              {q.note && q.note[lang] ? ` — ${q.note[lang]}` : ''}
            </span>
          </p>
          <Button onClick={onNext} className="sticky bottom-3 w-full shadow-[0_6px_20px_rgba(21,24,29,0.14)]">
            {last ? tr.seeResult : tr.next}
            <ArrowRight className="size-[18px]" />
          </Button>
        </div>
      )}
    </div>
  )
}
