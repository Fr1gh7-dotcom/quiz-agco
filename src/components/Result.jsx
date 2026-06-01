import { useEffect, useState } from 'react'
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

export default function Result({ lang, score, seconds, rank, correct, total, saving, onLeaderboard, player }) {
  const tr = t[lang]
  const shown = useCountUp(score, !saving)
  const medal = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : null

  return (
    <div className="screen result">
      <span className="eyebrow">{tr.resultTitle}</span>
      <h2>{player ? `${player.nome} ${player.cognome}` : tr.resultTitle}</h2>

      <div className="result-grid">
        <div className="stat stat-primary">
          <div className="stat-val">{shown}</div>
          <div className="stat-label">{tr.yourScore}</div>
        </div>
        <div className="stat">
          <div className="stat-val">{correct}/{total}</div>
          <div className="stat-label">{tr.correctAnswers}</div>
        </div>
        <div className="stat">
          <div className="stat-val">{seconds.toFixed(0)}{tr.seconds}</div>
          <div className="stat-label">{tr.yourTime}</div>
        </div>
        <div className={`stat ${medal ? 'stat-medal' : ''}`}>
          <div className="stat-val">
            {medal && <span className="stat-medal-icon" aria-hidden="true">{medal}</span>}
            {saving ? '…' : `#${rank ?? '-'}`}
          </div>
          <div className="stat-label">{tr.yourRank}</div>
        </div>
      </div>

      <button className="btn btn-primary btn-lg" onClick={onLeaderboard} disabled={saving}>
        {saving ? tr.saving : tr.seeLeaderboard}
      </button>
    </div>
  )
}
