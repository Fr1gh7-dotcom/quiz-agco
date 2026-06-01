import { t } from '../i18n.js'

export default function Instructions({ lang, onGo }) {
  const tr = t[lang]
  return (
    <div className="screen instructions">
      <h2>{tr.instrTitle}</h2>
      <ul className="instr-list">
        <li><span className="instr-num">01</span> {tr.instr1}</li>
        <li><span className="instr-num">02</span> {tr.instr2}</li>
        <li><span className="instr-num">03</span> {tr.instr3}</li>
      </ul>
      <button className="btn btn-primary btn-lg" onClick={onGo}>
        {tr.instrGo}
      </button>
    </div>
  )
}
