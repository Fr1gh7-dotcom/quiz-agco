// Storage classifica: Supabase se configurato, altrimenti fallback localStorage.
// Tabella attesa: leaderboard (vedi supabase/schema.sql)
import { createClient } from '@supabase/supabase-js'

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
