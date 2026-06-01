import { cn } from '@/lib/utils.js'

export default function LangToggle({ lang, setLang }) {
  return (
    <div className="flex rounded-lg border border-border bg-accent p-[3px]">
      {['it', 'en'].map((l) => (
        <button
          key={l}
          className={cn(
            'rounded-md px-3 py-1.5 text-xs font-bold uppercase tracking-wide transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
            lang === l ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'
          )}
          onClick={() => setLang(l)}
          aria-pressed={lang === l}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  )
}
