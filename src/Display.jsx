import { useEffect, useRef, useState } from 'react'
import { Medal, Trash2, Lock, RotateCcw, LogOut, Settings2 } from 'lucide-react'
import {
  getLeaderboard, getSession, onAuthChange, signIn, signOut,
  resetLeaderboard, deleteEntry, SUPABASE_ENABLED,
} from './lib/storage.js'
import QuestionEditor from './components/QuestionEditor.jsx'
import { Button } from './components/ui/button.jsx'
import { cn } from '@/lib/utils.js'

const POLL_MS = 4000
const MEDAL = ['text-podium-gold', 'text-podium-silver', 'text-podium-bronze']

export default function Display({ admin = false }) {
  const [rows, setRows] = useState([])
  const [loadedAt, setLoadedAt] = useState(null)
  const [session, setSession] = useState(null)
  const [sessionReady, setSessionReady] = useState(false)
  const [view, setView] = useState('board')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [authErr, setAuthErr] = useState('')
  const [busy, setBusy] = useState(false)
  const seen = useRef(null)

  useEffect(() => {
    getSession().then((s) => { setSession(s); setSessionReady(true) })
    return onAuthChange(setSession)
  }, [])

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
    try { await signIn(email.trim(), password); setPassword('') }
    catch (err) { setAuthErr(err.message || 'Login fallito') }
    finally { setBusy(false) }
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

  const isAdmin = admin && Boolean(session)
  // Griglia condivisa header/righe (colonna azione extra solo da admin) → colonne allineate
  const gridCols = isAdmin
    ? 'grid-cols-[clamp(56px,7vw,88px)_1fr_clamp(74px,9vw,128px)_clamp(56px,7vw,92px)_36px]'
    : 'grid-cols-[clamp(56px,7vw,88px)_1fr_clamp(74px,9vw,128px)_clamp(56px,7vw,92px)]'

  // Rotta /admin non loggato → schermata di accesso.
  if (admin && sessionReady && !session) {
    return (
      <div className="grid min-h-screen place-items-center bg-grad-header px-5 text-white">
        <form
          onSubmit={doLogin}
          className="flex w-full max-w-[340px] flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-7"
        >
          <span className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[1.6px] text-white/55">
            <Lock className="size-3.5" /> Area riservata
          </span>
          <h1 className="mb-1.5 font-serif text-2xl text-white">Accesso admin</h1>
          {!SUPABASE_ENABLED ? (
            <p className="text-sm text-white/60">DB non configurato.</p>
          ) : (
            <>
              <input
                type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username"
                className="rounded-lg border border-white/20 bg-white/[0.08] px-3 py-2.5 text-[15px] text-white placeholder:text-white/45 focus:border-primary focus:outline-none"
              />
              <input
                type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password"
                className="rounded-lg border border-white/20 bg-white/[0.08] px-3 py-2.5 text-[15px] text-white placeholder:text-white/45 focus:border-primary focus:outline-none"
              />
              <Button variant="dark" type="submit" disabled={busy} className="h-11">{busy ? '…' : 'Entra'}</Button>
              {authErr && <span className="text-[13px] font-semibold text-red-300">{authErr}</span>}
            </>
          )}
          <a href="/classifica" className="mt-1 text-[13px] text-white/55 transition-colors hover:text-white">← Classifica pubblica</a>
        </form>
      </div>
    )
  }

  if (view === 'questions' && isAdmin) {
    return <QuestionEditor onBack={() => setView('board')} />
  }

  return (
    <div className="mx-auto min-h-screen max-w-[1000px] bg-brand-header px-[clamp(18px,4vw,56px)] pb-14 pt-[clamp(22px,3.5vw,44px)] text-white">
      <header className="mb-2 border-b-2 border-agco-red pb-[18px]">
        {isAdmin && (
          <div className="mb-4 flex flex-wrap justify-end gap-2 border-b border-white/10 pb-4">
            <Button variant="dark" size="sm" onClick={() => setView('questions')} disabled={busy}><Settings2 className="size-4" /> Gestisci domande</Button>
            <Button variant="destructive" size="sm" onClick={doReset} disabled={busy}><RotateCcw className="size-4" /> Azzera classifica</Button>
            <Button variant="outline" size="sm" onClick={() => signOut()}><LogOut className="size-4" /> Esci</Button>
          </div>
        )}
        {!isAdmin && (
          <div className="mb-3.5 flex items-center gap-4">
            <img src="/logo-agco.png" alt="AGCO" className="h-[30px] w-auto object-contain" onError={(e) => { e.target.style.display = 'none' }} />
            <img src="/logo-phtre.png" alt="PHTRE" className="h-[38px] w-auto rounded-md bg-white object-contain px-2.5 py-[5px]" onError={(e) => { e.target.style.display = 'none' }} />
          </div>
        )}
        <div className="flex items-center gap-2.5">
          <span className="size-[9px] animate-live-pulse rounded-full bg-[#34d058]" />
          <span className="display-eyebrow">Classifica in tempo reale</span>
        </div>
        <h1 className="mt-1.5 font-serif text-[clamp(26px,4vw,42px)] text-white">Quiz Rifiuti AGCO</h1>
        <div className="tabular mt-2 flex gap-[18px] text-[13px] text-white/60">
          <span><b className="text-white">{rows.length}</b> partecipanti</span>
          {loadedAt && <span>agg. {loadedAt.toLocaleTimeString('it-IT')}</span>}
        </div>

      </header>

      {rows.length === 0 ? (
        <p className="py-16 text-center text-base text-white/50">In attesa dei primi partecipanti…</p>
      ) : (
        <>
        <div className={cn('mt-6 grid items-end gap-[clamp(10px,2vw,22px)] border-b border-white/10 px-[clamp(10px,1.4vw,18px)] pb-2.5 text-[clamp(10px,1.05vw,12px)] font-bold uppercase tracking-[1.2px] text-white/40', gridCols)}>
          <span className="text-center">Pos.</span>
          <span>Partecipante</span>
          <span className="text-right">Punti</span>
          <span className="text-right">Tempo</span>
          {isAdmin && <span />}
        </div>
        <ol className="mt-2 flex flex-col gap-1">
          {rows.map((r, i) => {
            const isNew = seen.current && !seen.current.has(r.id)
            if (seen.current) seen.current.add(r.id)
            const podium = i < 3
            return (
              <li
                key={r.id || i}
                className={cn(
                  'grid items-center gap-[clamp(10px,2vw,22px)] rounded-xl border border-transparent px-[clamp(10px,1.4vw,18px)] py-[clamp(13px,1.7vw,20px)] text-[clamp(17px,2.3vw,24px)]',
                  gridCols,
                  i === 0 && 'border-podium-gold/30 bg-gradient-to-r from-podium-gold/[0.16] via-podium-gold/[0.03] to-transparent py-[clamp(16px,2vw,24px)] text-[clamp(20px,2.8vw,30px)] shadow-[0_0_26px_rgba(232,181,58,0.14)]',
                  i === 1 && 'bg-gradient-to-r from-podium-silver/[0.09] to-transparent',
                  i === 2 && 'bg-gradient-to-r from-podium-bronze/[0.09] to-transparent',
                  isNew && 'animate-flash-new'
                )}
              >
                <span className="flex items-center justify-center gap-2 font-extrabold">
                  {podium && <Medal className={cn('size-[1.3em] drop-shadow', MEDAL[i])} aria-hidden="true" />}
                  <span className={cn('tabular', i === 0 ? 'text-podium-gold' : i === 1 ? 'text-podium-silver' : i === 2 ? 'text-podium-bronze' : 'text-white/50')}>{i + 1}</span>
                </span>
                <span className="truncate font-semibold">{r.nome} {r.cognome}</span>
                <span className={cn('tabular text-right font-extrabold', i === 0 ? 'text-podium-gold [text-shadow:0_0_18px_rgba(232,181,58,0.4)]' : 'text-white')}>
                  {r.punteggio}<span className="ml-1 text-[0.5em] font-bold uppercase tracking-wide text-white/40">pt</span>
                </span>
                <span className="tabular text-right text-[0.72em] text-white/55">{Math.round(r.tempoTotaleSecondi)}<span className="ml-0.5 text-[0.78em] text-white/40">s</span></span>
                {isAdmin && (
                  <button
                    title="Cancella" onClick={() => doDelete(r.id, `${r.nome} ${r.cognome}`)} disabled={busy}
                    className="grid size-7 place-items-center rounded-md border border-white/25 text-white/60 transition-colors hover:border-agco-red hover:bg-agco-red hover:text-white"
                  >
                    <Trash2 className="size-4" />
                  </button>
                )}
              </li>
            )
          })}
        </ol>
        </>
      )}
    </div>
  )
}
