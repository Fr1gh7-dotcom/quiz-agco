import { useState } from 'react'
import { Button } from './ui/button.jsx'
import { Input } from './ui/input.jsx'
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
    <form className="screen justify-center gap-4" onSubmit={submit}>
      <span className="eyebrow -mb-1">{tr.kickerPlayer}</span>
      <h2 className="font-serif text-[22px] font-semibold leading-tight">{tr.welcomeTitle}</h2>

      <label className="flex flex-col gap-1.5 text-[13px] font-semibold text-muted-foreground">
        {tr.nome}
        <Input
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder={tr.nomePlaceholder}
          autoComplete="given-name"
        />
      </label>
      <label className="flex flex-col gap-1.5 text-[13px] font-semibold text-muted-foreground">
        {tr.cognome}
        <Input
          value={cognome}
          onChange={(e) => setCognome(e.target.value)}
          placeholder={tr.cognomePlaceholder}
          autoComplete="family-name"
        />
      </label>

      {touched && !valid && <p className="text-[13.5px] font-semibold text-agco-red">{tr.validation}</p>}
      <Button size="lg" type="submit" className="mt-2.5 w-full" disabled={!valid || checking}>
        {checking ? tr.checking : tr.start}
      </Button>
    </form>
  )
}
