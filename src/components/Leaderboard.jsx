import { t } from '../i18n.js'

export default function Leaderboard({ lang, rows, me, onPlayAgain, locked }) {
  const tr = t[lang]
  return (
    <div className="screen leaderboard">
      <span className="eyebrow">{tr.leaderboardTitle}</span>
      <h2>{tr.leaderboardSub}</h2>

      {rows.length === 0 ? (
        <p className="empty">{tr.emptyBoard}</p>
      ) : (
        <ol className="board">
          <li className="board-head">
            <span className="b-rank">{tr.rank}</span>
            <span className="b-name">{tr.player}</span>
            <span className="b-score">{tr.score}</span>
            <span className="b-time">{tr.time}</span>
          </li>
          {rows.map((r, i) => {
            const isMe =
              me &&
              r.nome === me.nome &&
              r.cognome === me.cognome &&
              r.punteggio === me.punteggio &&
              r.tempoTotaleSecondi === me.tempoTotaleSecondi
            const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : null
            return (
              <li key={i} className={`board-row ${isMe ? 'me' : ''} ${i < 3 ? 'podium p' + (i + 1) : ''}`}>
                <span className="b-rank">{medal ? <span className="b-medal" aria-hidden="true">{medal}</span> : i + 1}</span>
                <span className="b-name">
                  {r.nome} {r.cognome} {isMe && <em>({tr.you})</em>}
                </span>
                <span className="b-score">{r.punteggio}</span>
                <span className="b-time">{Math.round(r.tempoTotaleSecondi)}{tr.seconds}</span>
              </li>
            )
          })}
        </ol>
      )}

      {locked ? (
        <p className="locked-note">{tr.alreadyDone}</p>
      ) : (
        <button className="btn btn-secondary btn-lg" onClick={onPlayAgain}>
          {tr.playAgain}
        </button>
      )}
    </div>
  )
}
