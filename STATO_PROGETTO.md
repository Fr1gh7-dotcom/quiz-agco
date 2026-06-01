# STATO PROGETTO — Quiz Rifiuti AGCO (PHTRE)

> **Leggi questo file all'inizio di ogni sessione.** È la fonte di verità sullo stato del progetto.
> Ultimo aggiornamento: 2026-06-01.

## Cos'è
Quiz QR bilingue (IT/EN) sulla gestione rifiuti in produzione, per **AGCO SPA**, realizzato da **PHTRE**.
I dipendenti scansionano un QR, fanno 10 domande a tempo, finiscono in una classifica condivisa.
C'è anche uno schermo classifica live per TV/monitor e un pannello admin.

## URL e account
- **Quiz (QR):** https://quiz-agco.vercel.app
- **Schermo live pubblico (TV):** https://quiz-agco.vercel.app/classifica
- **Pannello admin (login):** https://quiz-agco.vercel.app/admin
- **GitHub (pubblico):** https://github.com/Fr1gh7-dotcom/quiz-agco
- **Vercel project:** `fr1gh7-dotcoms-projects/quiz-agco` (account `fr1gh7-dotcom`)
- **Supabase project ref:** `fhhvztdypcedjmncvckj` → `https://fhhvztdypcedjmncvckj.supabase.co`
- **Git user:** Fr1gh7-dotcom

## Stack
Vite + React 18 (SPA statica), `@supabase/supabase-js`, CSS vanilla.
Font: **Noto Serif** (titoli) + **Archivo** (UI/numeri). Tema chiaro corporate; header e scoreboard grafite scuro `#16202e`.
Deploy: Vercel (statico, CDN). DB/Auth: Supabase (free tier).

## Funzionalità FATTE
- ✅ Quiz 10 domande, timer, scoring `100 + (30-sec)*2` bonus (vedi `src/lib/scoring.js`)
- ✅ Classifica condivisa Supabase (fallback `localStorage` se DB non configurato)
- ✅ Blocco "una volta sola" a **doppio strato**: `localStorage` + verifica nome+cognome lato server
- ✅ **Ripresa dopo reload**: progressi salvati nel device, riprende dalla domanda interrotta (timer di quella domanda riparte; scade dopo 2h)
- ✅ Redesign professionale (no emoji, tema chiaro, card incorniciata su desktop)
- ✅ Header scuro con loghi AGCO (bianco) + PHTRE (chip bianco) + filo rosso brand
- ✅ `/classifica` schermo live polling 4s (scoreboard scuro full-screen per TV)
- ✅ `/admin` login (Supabase Auth, utente singolo): azzera classifica, cancella singolo, **editor domande** (CRUD bilingue, attiva/disattiva, ordine)
- ✅ Domande caricate dal **DB** (`questions`) con fallback al JSON statico
- ✅ **Keep-alive** GitHub Actions ogni 4 giorni (anti-pausa free tier Supabase) — ATTIVO
- ✅ QR generati in `qr/` (poster A4, volantino A5, web), puntano all'URL prod
- ✅ **Migrazione UI a Tailwind + shadcn + lucide (2026-06-02, branch `feat/tailwind-shadcn-redesign`)**: stack grafico passato da CSS vanilla a **Tailwind 3** + primitive stile **shadcn** (`src/components/ui/` Button/Card/Input/Badge con CVA + `cn`) + icone vettoriali **lucide-react** (Medal/Check/X/Recycle/Clock/Trophy/ArrowRight ecc., niente più emoji). Token AGCO mappati su variabili HSL shadcn in `src/index.css` (+ brand color in `tailwind.config.js`). Alias `@` in `vite.config.js`. Tutti i componenti riscritti con utility Tailwind mantenendo logica e parità funzionale. Build: CSS ~30KB (gzip 6.8KB), JS ~436KB (gzip 126KB, lucide tree-shaked). **Da mergiare in `main` e deployare dopo ok utente.**
- ✅ **Splash brand intro (2026-06-02)**: all'avvio (~3s) overlay grafite "Questo progetto è stato realizzato da PHTRE" + logo, poi fade-out che rivela il gioco. Bilingue, reduced-motion-safe. Solo rotta quiz (`/`), non TV/admin. File: `src/components/Splash.jsx`.
- ✅ **Polish premium grafico (2026-06-02)**: design system a livelli (shadow/gradiente/ring), `prefers-reduced-motion` globale, focus-visible coerente. Quiz tattile (stagger opzioni, icone ✓/✕ nei chip, feedback `aria-live`, timer a pillola con pulse oltre 30s, barra progresso gradiente). Risultato con count-up punteggio + medaglia top-3. Podio TV `/classifica` scenico (medaglie oro/argento/bronzo, riga #1 grande con glow oro, loghi brand). Welcome con chip valore (10 domande · ~3 min · premi). Board mobile con medaglie podio.
- ✅ **Asset/meta (2026-06-02)**: `favicon.svg` + `favicon-32.png` + `apple-touch-icon.png` + `icon-512.png` + `og-image.png` (1200×630) + `manifest.webmanifest`. `index.html` con Open Graph/Twitter card/apple-touch/manifest. Risolto il 404 della favicon mancante. Generatore: `scripts/genassets.mjs` (Playwright). Screenshot QA in `screenshots/new/`.

## DA FARE (pending)
- ⏳ **Creare l'utente admin** in Supabase → Authentication → Users → Add user (email+password, ✅ Auto Confirm). Senza, il login `/admin` dà errore credenziali.
- 🟡 (eventuale) pulire righe di test in classifica (si fa da `/admin` → Azzera classifica)

## Supabase — schema e sicurezza
- Tabelle: **`leaderboard`** (punteggi) e **`questions`** (domande dinamiche, seed 10)
- File SQL da eseguire nel dashboard (SQL Editor): `supabase/schema.sql` (leaderboard) e `supabase/admin_schema.sql` (questions + seed + policy delete). **Entrambi già applicati** in prod.
- RLS:
  - `leaderboard`: insert + select per `anon`; **delete solo `authenticated`** (admin)
  - `questions`: select per `anon`+`authenticated`; **insert/update/delete solo `authenticated`**
- Auth: un solo utente admin (da creare). Le credenziali stanno in Supabase, non nel codice.
- **anon key**: pubblica per design (è già nel bundle e nel keep-alive). NON è un segreto. Il `service_role` NON è mai usato/esposto.

## Env e segreti
- `.env.local` (gitignored): `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `QUIZ_URL`, `PEXELS_API_KEY`
- Su Vercel (production): `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` già impostate
- `.env.local` e `.vercel/` sono ignorati da git (verificato: nessun segreto committato)

## Operazioni comuni
- **Deploy:** `npm run build` poi `npx vercel --prod --yes`
- **Build di test in modalità localStorage** (senza scrivere su prod): `VITE_SUPABASE_URL=https://xxxx.supabase.co VITE_SUPABASE_ANON_KEY=x npm run build` (storage.js tratta `xxxx` come "non configurato")
- **Modificare domande:** da `/admin` (consigliato, live) oppure `src/data/questions.json` + redeploy (è solo il fallback; il DB ha la verità)
- **Reset classifica:** `/admin` → Azzera classifica
- **Rigenerare QR:** `node scripts/genqr.mjs https://quiz-agco.vercel.app`
- **Smoke test:** `npm run preview` + `node scripts/smoke.mjs` (o gli script playwright inline)
- **Test DB via Node:** usare REST con `fetch` (Node 20 non ha WebSocket nativo → `createClient` di supabase-js crasha negli script Node; nel browser funziona)

## Mappa file chiave
- `src/App.jsx` — orchestratore quiz (schermate, scoring, once-only, ripresa)
- `src/Display.jsx` — schermo `/classifica` + `/admin` (board live, login gate, toolbar admin)
- `src/components/QuestionEditor.jsx` — editor domande CRUD
- `src/components/Question.jsx` — singola domanda (timer, feedback, Avanti sticky)
- `src/lib/storage.js` — TUTTO l'accesso dati: classifica, once-only, ripresa, domande, auth, admin
- `src/lib/scoring.js` — regole punteggio
- `src/i18n.js` — testi IT/EN
- `src/index.css` — tutto lo stile (tema chiaro quiz + scoreboard scuro + editor)
- `src/main.jsx` — routing minimale per path (`/`, `/classifica`, `/admin`)
- `supabase/schema.sql`, `supabase/admin_schema.sql` — schema DB
- `.github/workflows/keepalive.yml` — keep-alive
- `scripts/genqr.mjs` — generatore QR

## Convenzioni / vincoli IMPORTANTI
- ⛔ **NON committare la cartella `presentazione/`**: è lavorata in parallelo dall'utente su un altro terminale. Committare sempre con pathspec espliciti dei file dell'app, mai `git add -A`.
- I commit finora sono solo dei file app. `presentazione/` resta staged ma non committata.
- Commit message: conventional, in italiano, con footer `Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>`
- Capacità: sito statico = praticamente illimitato; Supabase free regge decine/centinaia di giocatori (poche richieste a testa). Tenere `/classifica` aperto solo sulle TV, non sui telefoni (polling 4s).

## Limiti noti
- Once-only per device bypassabile (incognito/altro telefono) ma c'è il backstop server sul nome; due omonimi → il 2° viene bloccato (edge case accettato).
- Keep-alive GitHub: se il repo resta 60gg senza commit, GitHub sospende lo schedule (mail di avviso, 1 click per riattivare).
- Vercel Hobby è gratis per uso non-commerciale (ToS): per uso aziendale valutare Pro.
