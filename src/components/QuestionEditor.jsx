import { useEffect, useState } from 'react'
import { ArrowLeft, Plus, Save, Trash2 } from 'lucide-react'
import { getAllQuestions, saveQuestion, deleteQuestion } from '../lib/storage.js'
import { Button } from './ui/button.jsx'
import { cn } from '@/lib/utils.js'

const LETTERS = ['A', 'B', 'C', 'D']
const fieldCls =
  'w-full rounded-lg border border-input bg-card px-2.5 py-2 text-sm text-foreground focus:border-primary focus:outline-none'
const labelCls = 'flex flex-col gap-1 text-[11px] font-bold uppercase tracking-wide text-muted-foreground/70'

function blank(ordine) {
  return {
    id: null, ordine, categoria: '', attiva: true,
    it: { domanda: '', opzioni: ['', '', '', ''] },
    en: { domanda: '', opzioni: ['', '', '', ''] },
    rispostaCorretta: 0, cer: '', note: { it: '', en: '' },
  }
}

export default function QuestionEditor({ onBack }) {
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState('')

  async function load() {
    setLoading(true); setErr('')
    try { setList(await getAllQuestions()) }
    catch (e) { setErr(e.message) }
    finally { setLoading(false) }
  }
  useEffect(() => { load() }, [])

  function patch(i, fn) {
    setList((l) => l.map((q, j) => (j === i ? fn({ ...q }) : q)))
  }

  function addNew() {
    const maxOrd = list.reduce((m, q) => Math.max(m, q.ordine || 0), 0)
    setList((l) => [...l, blank(maxOrd + 1)])
  }

  async function save(i) {
    const q = list[i]
    if (!q.it.domanda.trim() || q.it.opzioni.some((o) => !o.trim())) {
      alert('Compila la domanda IT e tutte e 4 le opzioni IT.'); return
    }
    try { await saveQuestion(q); await load() }
    catch (e) { alert('Errore salvataggio: ' + e.message) }
  }

  async function remove(i) {
    const q = list[i]
    if (q.id && !confirm('Eliminare definitivamente questa domanda?')) return
    if (!q.id) { setList((l) => l.filter((_, j) => j !== i)); return }
    try { await deleteQuestion(q.id); await load() }
    catch (e) { alert('Errore: ' + e.message) }
  }

  return (
    <div className="mx-auto min-h-screen max-w-[840px] bg-muted px-[clamp(16px,3vw,32px)] pb-16 pt-[22px] text-foreground">
      <header className="sticky top-0 z-[5] flex items-center justify-between gap-3 bg-muted py-2.5 pb-3.5">
        <Button variant="secondary" size="sm" onClick={onBack}><ArrowLeft className="size-4" /> Classifica</Button>
        <h2 className="font-serif text-[19px] font-semibold">Gestisci domande {list.length > 0 && `(${list.length})`}</h2>
        <Button size="sm" onClick={addNew}><Plus className="size-4" /> Nuova</Button>
      </header>

      {loading && <p className="py-4 text-muted-foreground">Caricamento…</p>}
      {err && <p className="py-4 text-agco-red">Errore: {err}</p>}

      {list.map((q, i) => (
        <div key={q.id || `new-${i}`} className={cn('mb-3.5 rounded-xl border border-border bg-card p-4 shadow-elev-sm', !q.attiva && 'opacity-60')}>
          <div className="mb-3 flex flex-wrap gap-3">
            <label className={cn(labelCls, 'w-20')}>Ordine
              <input type="number" className={fieldCls} value={q.ordine} onChange={(e) => patch(i, (x) => ({ ...x, ordine: Number(e.target.value) }))} />
            </label>
            <label className={cn(labelCls, 'min-w-[120px] flex-1')}>Categoria
              <input type="text" className={fieldCls} value={q.categoria || ''} onChange={(e) => patch(i, (x) => ({ ...x, categoria: e.target.value }))} />
            </label>
            <label className={cn(labelCls, 'w-[130px]')}>Codice EER
              <input type="text" className={fieldCls} value={q.cer || ''} onChange={(e) => patch(i, (x) => ({ ...x, cer: e.target.value }))} />
            </label>
            <label className="flex items-center gap-1.5 self-end pb-2 text-sm font-semibold">
              <input type="checkbox" className="accent-brand-green" checked={q.attiva} onChange={(e) => patch(i, (x) => ({ ...x, attiva: e.target.checked }))} /> attiva
            </label>
          </div>

          {['it', 'en'].map((lng) => (
            <div key={lng} className="relative mt-3 border-t border-dashed border-border pt-3">
              <span className="rounded bg-accent px-1.5 py-0.5 text-[10px] font-extrabold tracking-wider text-primary">{lng.toUpperCase()}</span>
              <textarea
                rows={2} placeholder={`Domanda (${lng})`} className={cn(fieldCls, 'my-2 resize-y')}
                value={q[lng].domanda}
                onChange={(e) => patch(i, (x) => ({ ...x, [lng]: { ...x[lng], domanda: e.target.value } }))}
              />
              {q[lng].opzioni.map((opt, oi) => (
                <div key={oi} className="mb-1.5 flex items-center gap-2">
                  <input
                    type="radio" name={`corr-${q.id || i}`} checked={q.rispostaCorretta === oi} className="shrink-0 accent-brand-green"
                    onChange={() => patch(i, (x) => ({ ...x, rispostaCorretta: oi }))} title="Risposta corretta"
                  />
                  <span className="w-[18px] text-[13px] font-extrabold text-muted-foreground">{LETTERS[oi]}</span>
                  <input
                    type="text" placeholder={`Opzione ${LETTERS[oi]} (${lng})`} value={opt} className={fieldCls}
                    onChange={(e) => patch(i, (x) => {
                      const opzioni = [...x[lng].opzioni]; opzioni[oi] = e.target.value
                      return { ...x, [lng]: { ...x[lng], opzioni } }
                    })}
                  />
                </div>
              ))}
              <input
                type="text" placeholder={`Nota (${lng}) — opzionale`} className={cn(fieldCls, 'mt-2')}
                value={q.note?.[lng] || ''}
                onChange={(e) => patch(i, (x) => ({ ...x, note: { ...x.note, [lng]: e.target.value } }))}
              />
            </div>
          ))}

          <div className="mt-3.5 flex gap-2">
            <Button size="sm" onClick={() => save(i)}><Save className="size-4" /> Salva</Button>
            <Button variant="destructive" size="sm" onClick={() => remove(i)}><Trash2 className="size-4" /> Elimina</Button>
          </div>
        </div>
      ))}
    </div>
  )
}
