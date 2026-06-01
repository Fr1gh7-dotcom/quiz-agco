import LangToggle from './LangToggle.jsx'

// Loghi: metti i file in public/. Se mancano, mostra testo segnaposto.
export default function Header({ lang, setLang }) {
  return (
    <header className="app-header">
      <img
        src="/logo-agco.png"
        alt="AGCO"
        className="logo"
        onError={(e) => {
          e.target.replaceWith(Object.assign(document.createElement('span'), {
            className: 'logo-fallback',
            textContent: 'AGCO',
          }))
        }}
      />
      <LangToggle lang={lang} setLang={setLang} />
      <img
        src="/logo-phtre.png"
        alt="PHTRE"
        className="logo"
        onError={(e) => {
          e.target.replaceWith(Object.assign(document.createElement('span'), {
            className: 'logo-fallback',
            textContent: 'PHTRE',
          }))
        }}
      />
    </header>
  )
}
