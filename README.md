# Quiz Rifiuti AGCO + Presentazione — PHTRE

Pacchetto consegna per **AGCO SPA**: quiz QR sulla gestione rifiuti in produzione + presentazione digital signage. Bilingue IT/EN.

## Contenuto

```
Quizagco/
├── src/                 # codice quiz React
├── scripts/genqr.mjs    # generatore QR code (3 dimensioni)
├── supabase/schema.sql  # tabella classifica
├── qr/                  # QR code generati (poster A4, A5, web)
├── presentazione/
│   ├── AGCO_Rifiuti_Presentazione.pptx   # 18 slide editabili
│   ├── AGCO_Rifiuti_Presentazione.pdf    # backup PDF
│   ├── build_deck.py / build_pdf.py      # generatori (rigenera se cambi testi)
├── ISTRUZIONI.md        # come stampare QR e installare il PPT
└── README.md            # questo file
```

## 1. Quiz — sviluppo locale

```bash
npm install
cp .env.example .env.local   # poi inserisci le chiavi Supabase
npm run dev                  # http://localhost:5173
```

Senza chiavi Supabase il quiz **funziona comunque**: la classifica usa `localStorage`
(locale al singolo device). Per la classifica condivisa cross-device serve Supabase.

## 2. Classifica condivisa (Supabase)

1. Crea progetto gratis su [supabase.com](https://supabase.com)
2. SQL Editor → incolla `supabase/schema.sql` → Run
3. Project Settings → API → copia `URL` e `anon key`
4. Inseriscile in `.env.local`:
   ```
   VITE_SUPABASE_URL=https://xxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGci...
   ```

## 3. Deploy (Vercel o Netlify, gratis)

```bash
npm run build      # genera dist/
```

- **Vercel**: `vercel` (o importa la repo su vercel.com). Aggiungi le 2 env var `VITE_SUPABASE_*` nel pannello.
- **Netlify**: trascina la cartella `dist/` su netlify.com, oppure collega la repo. Build command `npm run build`, publish dir `dist`.

## 4. QR code

```bash
node scripts/genqr.mjs https://IL-TUO-URL.vercel.app
```
Genera in `qr/`: poster A4 300dpi, volantino A5 300dpi, web 1024px.

## 5. Modifica domande

Tutte le 10 domande sono in `src/data/questions.json` (bilingue + codice CER).
Modifica → `npm run build` → redeploy. Nessun'altra modifica al codice serve.

## 6. Modifica presentazione

18 slide costruite **dentro il template ufficiale AGCO** (`AGCO Brand Presentation Template.potx`):
layout nativo `Title_Text_One Image` (cornice brand: linea arancio, logo AGCO, swirl, font
Noto Serif + Tilda Sans). Contenuto: titolo + sottotitolo EN + foto reale Pexels nel riquadro
+ destination box (bidone) + nota + CER. Crediti foto in `presentazione/CREDITI_FOTO.md`.

Pipeline (richiede venv con `python-pptx` + `PyMuPDF`, LibreOffice per il PDF, key Pexels in `.env.local`):
```bash
node presentazione/fetch_photos.mjs            # scarica foto in photos/ (o: ... oli spray  per refetch mirato)
.venv/bin/python presentazione/build_native.py # -> .pptx sul template AGCO
/Applications/LibreOffice.app/Contents/MacOS/soffice --headless --convert-to pdf \
  --outdir presentazione presentazione/AGCO_Rifiuti_Presentazione.pptx   # -> .pdf
```
- **Testi/bidoni**: array `SLIDES` in `presentazione/build_native.py`
- **Query foto**: `QUERIES` in `presentazione/fetch_photos.mjs`
- **Template base**: `presentazione/brand/agco_template.pptx` (potx ufficiale, slide esempio rimosse)

Il `.pptx` è nativo del template AGCO (editabile in PowerPoint), auto-advance 10s + loop kiosk.

---
Quiz powered by **PHTRE ecologia globale** per **AGCO SPA** · 2026
