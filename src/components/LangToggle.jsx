export default function LangToggle({ lang, setLang }) {
  return (
    <div className="lang-toggle">
      <button
        className={lang === 'it' ? 'active' : ''}
        onClick={() => setLang('it')}
        aria-pressed={lang === 'it'}
      >
        IT
      </button>
      <button
        className={lang === 'en' ? 'active' : ''}
        onClick={() => setLang('en')}
        aria-pressed={lang === 'en'}
      >
        EN
      </button>
    </div>
  )
}
