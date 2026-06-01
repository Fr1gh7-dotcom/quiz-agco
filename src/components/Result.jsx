import { t } from '../i18n.js'

export default function Result({ lang, score, seconds, rank, correct, total, saving, onLeaderboard, player }) {
  const tr = t[lang]
  return (
    <div className="screen result">
      <span className="eyebrow">{tr.resultTitle}</span>
      <h2>{player ? `${player.nome} ${player.cognome}` : tr.resultTitle}</h2>

      <div className="result-grid">
        <div className="stat stat-primary">
          <div className="stat-val">{score}</div>
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
        <div className="stat">
          <div className="stat-val">{saving ? '…' : `#${rank ?? '-'}`}</div>
          <div className="stat-label">{tr.yourRank}</div>
        </div>
      </div>

      <button className="btn btn-primary btn-lg" onClick={onLeaderboard} disabled={saving}>
        {saving ? tr.saving : tr.seeLeaderboard}
      </button>
    </div>
  )
}
