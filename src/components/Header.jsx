import LangToggle from './LangToggle.jsx'

// Header scuro: loghi AGCO (bianco) + PHTRE (chip bianco) + filo rosso brand.
export default function Header({ lang, setLang }) {
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between gap-3 bg-grad-header px-[18px] py-3 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:bg-agco-red">
      <img
        src="/logo-agco.png"
        alt="AGCO"
        className="h-6 w-auto object-contain"
        onError={(e) => {
          e.target.replaceWith(Object.assign(document.createElement('span'), {
            className: 'text-[15px] font-extrabold tracking-wide text-white',
            textContent: 'AGCO',
          }))
        }}
      />
      <LangToggle lang={lang} setLang={setLang} />
      <img
        src="/logo-phtre.png"
        alt="PHTRE"
        className="h-[30px] w-auto rounded-md bg-white object-contain px-[7px] py-1"
        onError={(e) => {
          e.target.replaceWith(Object.assign(document.createElement('span'), {
            className: 'text-[15px] font-extrabold tracking-wide text-white',
            textContent: 'PHTRE',
          }))
        }}
      />
    </header>
  )
}
