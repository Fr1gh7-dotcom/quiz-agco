import { useEffect, useRef, useState } from 'react'
import Timer from './Timer.jsx'
import { t } from '../i18n.js'

const LETTERS = ['A', 'B', 'C', 'D']

export default function Question({ lang, q, index, total, onAnswer, onNext }) {
  const tr = t[lang]
  const data = q[lang]
  const [startAt, setStartAt] = useState(Date.now())
  const [selected, setSelected] = useState(null)
  const [seconds, setSeconds] = useState(null)
  const feedbackRef = useRef(null)

  // reset quando cambia domanda
  useEffect(() => {
    setStartAt(Date.now())
    setSelected(null)
    setSeconds(null)
  }, [q.id])

  // dopo la risposta porta feedback + bottone "Avanti" in vista (niente scroll manuale)
  useEffect(() => {
    if (selected !== null && feedbackRef.current) {
      feedbackRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' })
    }
  }, [selected])

  function choose(i) {
    if (selected !== null) return
    const elapsed = (Date.now() - startAt) / 1000
    setSelected(i)
    setSeconds(elapsed)
    onAnswer({ correct: i === q.rispostaCorretta, seconds: elapsed })
  }

  const answered = selected !== null
  const last = index === total - 1

  return (
    <div className="screen question">
      <div className="q-top">
        <span className="q-progress">
          {tr.question} {index + 1} {tr.of} {total}
        </span>
        <Timer startAt={startAt} frozen={seconds} />
      </div>

      <div className="q-progress-bar">
        <div className="q-progress-fill" style={{ width: `${((index + 1) / total) * 100}%` }} />
      </div>

      <h2 className="q-text">{data.domanda}</h2>

      <div className="options">
        {data.opzioni.map((opt, i) => {
          let cls = 'option'
          if (answered) {
            if (i === q.rispostaCorretta) cls += ' correct'
            else if (i === selected) cls += ' wrong'
            else cls += ' dim'
          }
          return (
            <button key={i} className={cls} onClick={() => choose(i)} disabled={answered}>
              <span className="opt-letter">{LETTERS[i]}</span>
              <span className="opt-text">{opt}</span>
            </button>
          )
        })}
      </div>

      {answered && (
        <div className="q-feedback" ref={feedbackRef}>
          <div className={`fb-label ${selected === q.rispostaCorretta ? 'fb-ok' : 'fb-no'}`}>
            <span className="fb-tag">{selected === q.rispostaCorretta ? tr.correct : tr.wrong}</span>
          </div>
          <p className="q-ref">
            <b>EER {q.cer}</b>
            {q.note && q.note[lang] ? ` — ${q.note[lang]}` : ''}
          </p>
          <button className="btn btn-primary q-next" onClick={onNext}>
            {last ? tr.seeResult : tr.next}
          </button>
        </div>
      )}
    </div>
  )
}
