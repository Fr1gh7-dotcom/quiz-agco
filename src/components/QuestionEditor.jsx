import { useEffect, useState } from 'react'
import { getAllQuestions, saveQuestion, deleteQuestion } from '../lib/storage.js'

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
    <div className="qedit">
      <header className="qedit-top">
        <button className="abtn abtn-ghost" onClick={onBack}>← Classifica</button>
        <h2>Gestisci domande {list.length > 0 && `(${list.length})`}</h2>
        <button className="abtn" onClick={addNew}>+ Nuova</button>
      </header>

      {loading && <p className="qedit-msg">Caricamento…</p>}
      {err && <p className="qedit-msg err">Errore: {err}</p>}

      {list.map((q, i) => (
        <div className={`qcard ${q.attiva ? '' : 'inactive'}`} key={q.id || `new-${i}`}>
          <div className="qcard-row">
            <label className="qf-ord">Ordine
              <input type="number" value={q.ordine} onChange={(e) => patch(i, (x) => ({ ...x, ordine: Number(e.target.value) }))} />
            </label>
            <label className="qf-cat">Categoria
              <input type="text" value={q.categoria || ''} onChange={(e) => patch(i, (x) => ({ ...x, categoria: e.target.value }))} />
            </label>
            <label className="qf-cer">Codice EER
              <input type="text" value={q.cer || ''} onChange={(e) => patch(i, (x) => ({ ...x, cer: e.target.value }))} />
            </label>
            <label className="qf-active">
              <input type="checkbox" checked={q.attiva} onChange={(e) => patch(i, (x) => ({ ...x, attiva: e.target.checked }))} /> attiva
            </label>
          </div>

          {['it', 'en'].map((lng) => (
            <div className="qlang" key={lng}>
              <span className="qlang-tag">{lng.toUpperCase()}</span>
              <textarea
                className="qf-dom" rows={2} placeholder={`Domanda (${lng})`}
                value={q[lng].domanda}
                onChange={(e) => patch(i, (x) => ({ ...x, [lng]: { ...x[lng], domanda: e.target.value } }))}
              />
              {q[lng].opzioni.map((opt, oi) => (
                <div className="qf-opt" key={oi}>
                  <input
                    type="radio" name={`corr-${q.id || i}`} checked={q.rispostaCorretta === oi}
                    onChange={() => patch(i, (x) => ({ ...x, rispostaCorretta: oi }))}
                    title="Risposta corretta"
                  />
                  <span className="qf-letter">{['A', 'B', 'C', 'D'][oi]}</span>
                  <input
                    type="text" placeholder={`Opzione ${['A', 'B', 'C', 'D'][oi]} (${lng})`} value={opt}
                    onChange={(e) => patch(i, (x) => {
                      const opzioni = [...x[lng].opzioni]; opzioni[oi] = e.target.value
                      return { ...x, [lng]: { ...x[lng], opzioni } }
                    })}
                  />
                </div>
              ))}
              <input
                className="qf-note" type="text" placeholder={`Nota (${lng}) — opzionale`}
                value={q.note?.[lng] || ''}
                onChange={(e) => patch(i, (x) => ({ ...x, note: { ...x.note, [lng]: e.target.value } }))}
              />
            </div>
          ))}

          <div className="qcard-actions">
            <button className="abtn" onClick={() => save(i)}>Salva</button>
            <button className="abtn abtn-danger" onClick={() => remove(i)}>Elimina</button>
          </div>
        </div>
      ))}
    </div>
  )
}
