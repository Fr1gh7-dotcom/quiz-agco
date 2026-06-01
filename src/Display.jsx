import { useEffect, useRef, useState } from 'react'
import {
  getLeaderboard, getSession, onAuthChange, signIn, signOut,
  resetLeaderboard, deleteEntry, SUPABASE_ENABLED,
} from './lib/storage.js'
import QuestionEditor from './components/QuestionEditor.jsx'

const POLL_MS = 4000

export default function Display() {
  const [rows, setRows] = useState([])
  const [loadedAt, setLoadedAt] = useState(null)
  const [session, setSession] = useState(null)
  const [view, setView] = useState('board') // 'board' | 'questions'
  const [showLogin, setShowLogin] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [authErr, setAuthErr] = useState('')
  const [busy, setBusy] = useState(false)
  const seen = useRef(null) // Set di id già visti (per evidenziare i nuovi)

  // Auth
  useEffect(() => {
    getSession().then(setSession)
    return onAuthChange(setSession)
  }, [])

  // Polling classifica
  useEffect(() => {
    let alive = true
    async function tick() {
      const board = await getLeaderboard(100)
      if (!alive) return
      if (seen.current === null) seen.current = new Set(board.map((r) => r.id))
      setRows(board)
      setLoadedAt(new Date())
    }
    tick()
    const t = setInterval(tick, POLL_MS)
    return () => { alive = false; clearInterval(t) }
  }, [])

  async function doLogin(e) {
    e.preventDefault()
    setAuthErr(''); setBusy(true)
    try {
      await signIn(email.trim(), password)
      setShowLogin(false); setPassword('')
    } catch (err) {
      setAuthErr(err.message || 'Login fallito')
    } finally { setBusy(false) }
  }

  async function doReset() {
    if (!confirm('Azzerare TUTTA la classifica? I punteggi verranno cancellati definitivamente.')) return
    setBusy(true)
    try { await resetLeaderboard(); seen.current = new Set(); setRows([]) }
    catch (err) { alert('Errore reset: ' + err.message) }
    finally { setBusy(false) }
  }

  async function doDelete(id, nome) {
    if (!confirm(`Cancellare "${nome}" dalla classifica?`)) return
    setBusy(true)
    try { await deleteEntry(id); setRows((r) => r.filter((x) => x.id !== id)) }
    catch (err) { alert('Errore: ' + err.message) }
    finally { setBusy(false) }
  }

  const isAdmin = Boolean(session)

  if (view === 'questions' && isAdmin) {
    return <QuestionEditor onBack={() => setView('board')} />
  }

  return (
    <div className="display">
      <header className="disp-header">
        <div className="disp-title">
          <span className="live-dot" />
          <span className="eyebrow">Classifica in tempo reale</span>
        </div>
        <h1>Quiz Rifiuti AGCO</h1>
        <div className="disp-meta">
          <span><b>{rows.length}</b> partecipanti</span>
          {loadedAt && <span>agg. {loadedAt.toLocaleTimeString('it-IT')}</span>}
        </div>

        <div className="disp-admin">
          {!SUPABASE_ENABLED ? (
            <span className="disp-note">DB non configurato</span>
          ) : isAdmin ? (
            <>
              <button className="abtn" onClick={() => setView('questions')} disabled={busy}>Gestisci domande</button>
              <button className="abtn abtn-danger" onClick={doReset} disabled={busy}>Azzera classifica</button>
              <button className="abtn abtn-ghost" onClick={() => signOut()}>Esci</button>
            </>
          ) : (
            <button className="abtn abtn-ghost" onClick={() => setShowLogin((s) => !s)}>Accedi</button>
          )}
        </div>
      </header>

      {showLogin && !isAdmin && (
        <form className="login-box" onSubmit={doLogin}>
          <input type="email" placeholder="Email admin" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username" />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
          <button className="abtn" type="submit" disabled={busy}>{busy ? '…' : 'Entra'}</button>
          {authErr && <span className="login-err">{authErr}</span>}
        </form>
      )}

      {rows.length === 0 ? (
        <p className="disp-empty">In attesa dei primi partecipanti…</p>
      ) : (
        <ol className="disp-board">
          {rows.map((r, i) => {
            const isNew = seen.current && !seen.current.has(r.id)
            if (seen.current) seen.current.add(r.id)
            return (
              <li key={r.id || i} className={`disp-row ${i < 3 ? 'podium p' + (i + 1) : ''} ${isNew ? 'is-new' : ''}`}>
                <span className="dr-rank">{i + 1}</span>
                <span className="dr-name">{r.nome} {r.cognome}</span>
                <span className="dr-score">{r.punteggio}</span>
                <span className="dr-time">{Math.round(r.tempoTotaleSecondi)}s</span>
                {isAdmin && (
                  <button className="dr-del" title="Cancella" onClick={() => doDelete(r.id, `${r.nome} ${r.cognome}`)} disabled={busy}>×</button>
                )}
              </li>
            )
          })}
        </ol>
      )}
    </div>
  )
}
