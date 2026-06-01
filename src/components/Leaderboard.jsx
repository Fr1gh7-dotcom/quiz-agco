import { Medal } from 'lucide-react'
import { Button } from './ui/button.jsx'
import { cn } from '@/lib/utils.js'
import { t } from '../i18n.js'

const MEDAL = ['text-podium-gold', 'text-podium-silver', 'text-podium-bronze']

export default function Leaderboard({ lang, rows, me, onPlayAgain, locked }) {
  const tr = t[lang]
  return (
    <div className="screen gap-3.5">
      <span className="eyebrow flex items-center gap-2.5 before:h-0.5 before:w-[26px] before:bg-agco-red">
        {tr.leaderboardTitle}
      </span>
      <h2 className="font-serif text-[22px] font-semibold leading-tight">{tr.leaderboardSub}</h2>

      {rows.length === 0 ? (
        <p className="py-9 text-center text-muted-foreground/70">{tr.emptyBoard}</p>
      ) : (
        <ol className="flex flex-col">
          <li className="grid grid-cols-[30px_1fr_58px_50px] gap-2.5 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-muted-foreground/70">
            <span className="text-center">{tr.rank}</span>
            <span>{tr.player}</span>
            <span className="text-right">{tr.score}</span>
            <span className="text-right">{tr.time}</span>
          </li>
          {rows.map((r, i) => {
            const isMe =
              me &&
              r.nome === me.nome &&
              r.cognome === me.cognome &&
              r.punteggio === me.punteggio &&
              r.tempoTotaleSecondi === me.tempoTotaleSecondi
            return (
              <li
                key={i}
                className={cn(
                  'grid grid-cols-[30px_1fr_58px_50px] items-center gap-2.5 border-b border-border px-3 py-3 text-sm',
                  i === 0 && 'rounded-lg border-b-transparent bg-gradient-to-r from-podium-gold/10 to-transparent',
                  isMe && 'rounded-lg border-b-transparent bg-primary/[0.05]'
                )}
              >
                <span className="tabular flex justify-center text-center font-extrabold text-muted-foreground">
                  {i < 3 ? <Medal className={cn('size-[18px]', MEDAL[i])} aria-hidden="true" /> : i + 1}
                </span>
                <span className="truncate font-semibold">
                  {r.nome} {r.cognome} {isMe && <em className="font-bold not-italic text-primary">({tr.you})</em>}
                </span>
                <span className="tabular text-right font-extrabold">{r.punteggio}</span>
                <span className="tabular text-right text-muted-foreground/70">
                  {Math.round(r.tempoTotaleSecondi)}{tr.seconds}
                </span>
              </li>
            )
          })}
        </ol>
      )}

      {locked ? (
        <p className="mt-2 rounded-lg border border-border bg-muted px-4 py-3.5 text-center text-[13.5px] font-semibold leading-relaxed text-muted-foreground">
          {tr.alreadyDone}
        </p>
      ) : (
        <Button variant="secondary" size="lg" className="mt-2 w-full" onClick={onPlayAgain}>
          {tr.playAgain}
        </Button>
      )}
    </div>
  )
}
