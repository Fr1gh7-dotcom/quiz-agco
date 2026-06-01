// Storage classifica: Supabase se configurato, altrimenti fallback localStorage.
// Tabella attesa: leaderboard (vedi supabase/schema.sql)
import { createClient } from '@supabase/supabase-js'
import fallbackQuestions from '../data/questions.json'

const URL = import.meta.env.VITE_SUPABASE_URL
const KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

const useSupabase = Boolean(URL && KEY && !URL.includes('xxxx'))
const supabase = useSupabase ? createClient(URL, KEY) : null

export const STORAGE_MODE = useSupabase ? 'supabase' : 'local'
const LS_KEY = 'agco_quiz_leaderboard'
const DONE_KEY = 'agco_quiz_done'

// Blocco "una volta sola" per device. Ritorna l'entry salvata o null.
export function hasPlayed() {
  try {
    return JSON.parse(localStorage.getItem(DONE_KEY) || 'null')
  } catch {
    return null
  }
}

export function markPlayed(entry) {
  try {
    localStorage.setItem(DONE_KEY, JSON.stringify(entry))
  } catch {
    /* storage pieno o disabilitato: ignora */
  }
}

// Backstop lato server: il nome+cognome ha già giocato? (case-insensitive)
// Copre i casi in cui localStorage non persiste (webview QR, modalità privata).
export async function alreadyPlayedByName(nome, cognome) {
  if (useSupabase) {
    const { data, error } = await supabase
      .from('leaderboard')
      .select('nome, cognome, punteggio, tempo_totale_secondi, risposte_corrette, created_at')
      .ilike('nome', nome)
      .ilike('cognome', cognome)
      .limit(1)
    if (error || !data || data.length === 0) return null
    const r = data[0]
    return {
      nome: r.nome,
      cognome: r.cognome,
      punteggio: r.punteggio,
      tempoTotaleSecondi: r.tempo_totale_secondi,
      risposteCorrette: r.risposte_corrette,
      dataOra: r.created_at,
    }
  }
  const hit = readLocal().find(
    (r) =>
      r.nome.toLowerCase() === nome.toLowerCase() &&
      r.cognome.toLowerCase() === cognome.toLowerCase()
  )
  return hit || null
}

function readLocal() {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY) || '[]')
  } catch {
    return []
  }
}

function writeLocal(rows) {
  localStorage.setItem(LS_KEY, JSON.stringify(rows))
}

// entry: { nome, cognome, punteggio, tempoTotaleSecondi, risposteCorrette }
export async function submitScore(entry) {
  const row = { ...entry, dataOra: new Date().toISOString() }
  if (useSupabase) {
    const { error } = await supabase.from('leaderboard').insert({
      nome: row.nome,
      cognome: row.cognome,
      punteggio: row.punteggio,
      tempo_totale_secondi: row.tempoTotaleSecondi,
      risposte_corrette: row.risposteCorrette,
    })
    if (error) {
      console.error('Supabase insert error, fallback local:', error)
      const rows = readLocal()
      rows.push(row)
      writeLocal(rows)
    }
  } else {
    const rows = readLocal()
    rows.push(row)
    writeLocal(rows)
  }
  return row
}

// Ritorna top N ordinata: punteggio DESC, tempo ASC
export async function getLeaderboard(limit = 50) {
  if (useSupabase) {
    const { data, error } = await supabase
      .from('leaderboard')
      .select('*')
      .order('punteggio', { ascending: false })
      .order('tempo_totale_secondi', { ascending: true })
      .limit(limit)
    if (error) {
      console.error('Supabase select error, fallback local:', error)
      return sortLocal(readLocal()).slice(0, limit)
    }
    return data.map((r) => ({
      id: r.id,
      nome: r.nome,
      cognome: r.cognome,
      punteggio: r.punteggio,
      tempoTotaleSecondi: r.tempo_totale_secondi,
      risposteCorrette: r.risposte_corrette,
      dataOra: r.created_at,
    }))
  }
  return sortLocal(readLocal()).slice(0, limit)
}

function sortLocal(rows) {
  return [...rows].sort(
    (a, b) =>
      b.punteggio - a.punteggio ||
      a.tempoTotaleSecondi - b.tempoTotaleSecondi
  )
}

export const SUPABASE_ENABLED = useSupabase

// ============================================================
// DOMANDE (dal DB se disponibile, fallback al JSON statico)
// ============================================================
function mapDbQuestion(r) {
  return {
    id: r.id,
    ordine: r.ordine,
    categoria: r.categoria,
    it: { domanda: r.it_domanda, opzioni: r.it_opzioni },
    en: { domanda: r.en_domanda, opzioni: r.en_opzioni },
    rispostaCorretta: r.risposta_corretta,
    cer: r.cer,
    note: { it: r.note_it, en: r.note_en },
    attiva: r.attiva,
  }
}

// Domande attive per il quiz. Se il DB è vuoto/irraggiungibile → JSON.
export async function getQuestions() {
  if (useSupabase) {
    try {
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .eq('attiva', true)
        .order('ordine', { ascending: true })
      if (!error && data && data.length) return data.map(mapDbQuestion)
    } catch (e) {
      console.error('getQuestions fallback JSON:', e)
    }
  }
  return fallbackQuestions
}

// Tutte le domande (anche disattivate) — pannello admin.
export async function getAllQuestions() {
  if (!useSupabase) return fallbackQuestions
  const { data, error } = await supabase.from('questions').select('*').order('ordine', { ascending: true })
  if (error) throw error
  return data.map(mapDbQuestion)
}

function toRow(q) {
  return {
    ordine: q.ordine ?? 0,
    categoria: q.categoria ?? null,
    it_domanda: q.it.domanda,
    it_opzioni: q.it.opzioni,
    en_domanda: q.en.domanda,
    en_opzioni: q.en.opzioni,
    risposta_corretta: q.rispostaCorretta,
    cer: q.cer ?? null,
    note_it: q.note?.it ?? null,
    note_en: q.note?.en ?? null,
    attiva: q.attiva ?? true,
  }
}

export async function saveQuestion(q) {
  const row = toRow(q)
  const res = q.id
    ? await supabase.from('questions').update(row).eq('id', q.id)
    : await supabase.from('questions').insert(row)
  if (res.error) throw res.error
}

export async function deleteQuestion(id) {
  const { error } = await supabase.from('questions').delete().eq('id', id)
  if (error) throw error
}

// ============================================================
// ADMIN — reset classifica / cancella singolo (richiede login)
// ============================================================
const NEVER_ID = '00000000-0000-0000-0000-000000000000'

export async function resetLeaderboard() {
  const { error } = await supabase.from('leaderboard').delete().neq('id', NEVER_ID)
  if (error) throw error
}

export async function deleteEntry(id) {
  const { error } = await supabase.from('leaderboard').delete().eq('id', id)
  if (error) throw error
}

// ============================================================
// AUTH — singolo utente admin (Supabase Auth)
// ============================================================
export async function signIn(email, password) {
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
}

export async function signOut() {
  if (supabase) await supabase.auth.signOut()
}

export async function getSession() {
  if (!supabase) return null
  const { data } = await supabase.auth.getSession()
  return data.session
}

export function onAuthChange(cb) {
  if (!supabase) return () => {}
  const { data } = supabase.auth.onAuthStateChange((_e, session) => cb(session))
  return () => data.subscription.unsubscribe()
}
