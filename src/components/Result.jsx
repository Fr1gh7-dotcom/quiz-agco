import { useEffect, useState } from 'react'
import { Medal, ListChecks, Clock, Hash, ArrowRight } from 'lucide-react'
import { Button } from './ui/button.jsx'
import { cn } from '@/lib/utils.js'
import { t } from '../i18n.js'

// Count-up sobrio del punteggio (~700ms ease-out). Rispetta prefers-reduced-motion.
function useCountUp(target, run) {
  const [val, setVal] = useState(run ? 0 : target)
  useEffect(() => {
    if (!run) { setVal(target); return }
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) { setVal(target); return }
    let raf
    const dur = 700, t0 = performance.now()
    const tick = (now) => {
      const p = Math.min(1, (now - t0) / dur)
      const eased = 1 - Math.pow(1 - p, 3)
      setVal(Math.round(target * eased))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, run])
  return val
}

function Stat({ icon: Icon, value, label, className }) {
  return (
    <div className={cn('rounded-xl border border-border bg-card p-4 shadow-elev-sm', className)}>
      <div className="tabular flex items-center gap-2 font-sans text-[30px] font-extrabold leading-none">
        {Icon && <Icon className="size-6 text-primary" aria-hidden="true" />}
        {value}
      </div>
      <div className="mt-2 text-[11px] font-bold uppercase tracking-wide text-muted-foreground/70">{label}</div>
    </div>
  )
}

export default function Result({ lang, score, seconds, rank, correct, total, saving, onLeaderboard, player }) {
  const tr = t[lang]
  const shown = useCountUp(score, !saving)
  const isMedal = rank >= 1 && rank <= 3
  const medalColor = rank === 1 ? 'text-podium-gold' : rank === 2 ? 'text-podium-silver' : 'text-podium-bronze'

  return (
    <div className="screen items-stretch justify-center gap-4 text-left">
      <span className="eyebrow flex items-center gap-2.5 before:h-0.5 before:w-[26px] before:bg-agco-red">
        {tr.resultTitle}
      </span>
      <h2 className="font-serif text-[22px] font-semibold leading-tight">
        {player ? `${player.nome} ${player.cognome}` : tr.resultTitle}
      </h2>

      <div className="my-1 grid grid-cols-2 gap-2.5">
        <div className="relative col-span-2 overflow-hidden rounded-xl bg-grad-blue p-5 shadow-elev-lg after:pointer-events-none after:absolute after:inset-0 after:bg-[radial-gradient(120%_90%_at_85%_-10%,rgba(255,255,255,0.16),transparent_55%)]">
          <div className="tabular relative text-[48px] font-extrabold leading-none text-white">{shown}</div>
          <div className="relative mt-2 text-[11px] font-bold uppercase tracking-wide text-white/[0.78]">{tr.yourScore}</div>
        </div>
        <Stat icon={ListChecks} value={`${correct}/${total}`} label={tr.correctAnswers} />
        <Stat icon={Clock} value={`${seconds.toFixed(0)}${tr.seconds}`} label={tr.yourTime} />
        <Stat
          className={cn('col-span-2', isMedal && 'border-podium-gold/50 bg-gradient-to-br from-podium-gold/10 to-card')}
          icon={isMedal ? () => <Medal className={cn('size-6', medalColor)} aria-hidden="true" /> : Hash}
          value={saving ? '…' : isMedal ? `#${rank}` : `#${rank ?? '-'}`}
          label={tr.yourRank}
        />
      </div>

      <Button size="lg" className="w-full" onClick={onLeaderboard} disabled={saving}>
        {saving ? tr.saving : tr.seeLeaderboard}
        {!saving && <ArrowRight className="size-[18px]" />}
      </Button>
    </div>
  )
}
