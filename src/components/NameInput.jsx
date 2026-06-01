import { useState } from 'react'
import { t } from '../i18n.js'

export default function NameInput({ lang, onConfirm, checking }) {
  const tr = t[lang]
  const [nome, setNome] = useState('')
  const [cognome, setCognome] = useState('')
  const [touched, setTouched] = useState(false)

  const valid = nome.trim().length >= 2 && cognome.trim().length >= 2

  function submit(e) {
    e.preventDefault()
    setTouched(true)
    if (valid) onConfirm({ nome: nome.trim(), cognome: cognome.trim() })
  }

  return (
    <form className="screen name-input" onSubmit={submit}>
      <span className="eyebrow">{tr.kickerPlayer}</span>
      <h2>{tr.welcomeTitle}</h2>
      <label>
        {tr.nome}
        <input
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder={tr.nomePlaceholder}
          autoComplete="given-name"
        />
      </label>
      <label>
        {tr.cognome}
        <input
          type="text"
          value={cognome}
          onChange={(e) => setCognome(e.target.value)}
          placeholder={tr.cognomePlaceholder}
          autoComplete="family-name"
        />
      </label>
      {touched && !valid && <p className="error">{tr.validation}</p>}
      <button className="btn btn-primary btn-lg" type="submit" disabled={!valid || checking}>
        {checking ? tr.checking : tr.start}
      </button>
    </form>
  )
}
