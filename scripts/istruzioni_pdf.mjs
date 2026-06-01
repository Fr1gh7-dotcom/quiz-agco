// Genera ISTRUZIONI.pdf (A4) stampando un HTML con Playwright/Chromium.
import { chromium } from 'playwright'

const HTML = `<!doctype html><html lang="it"><head><meta charset="utf-8">
<style>
  * { box-sizing: border-box; }
  body { font-family: -apple-system, 'Helvetica Neue', Arial, sans-serif; color: #1a1a1a; margin: 0; }
  .page { padding: 42px 54px; }
  h1 { color: #1B3A8C; font-size: 26px; margin: 0 0 4px; }
  .lead { color: #555; font-size: 13px; margin: 0 0 22px; }
  h2 { color: #C8102E; font-size: 18px; margin: 26px 0 8px; border-bottom: 2px solid #eee; padding-bottom: 6px; }
  h3 { font-size: 14px; margin: 16px 0 6px; }
  p, li { font-size: 12.5px; line-height: 1.55; }
  .link { background: #f4f6fb; border: 1px solid #d6deec; border-radius: 8px; padding: 10px 14px; font-size: 13px; margin: 8px 0; }
  table { width: 100%; border-collapse: collapse; margin: 8px 0; }
  th, td { border: 1px solid #e2e2e2; padding: 7px 10px; font-size: 12px; text-align: left; }
  th { background: #1B3A8C; color: #fff; }
  .tag { display: inline-block; background: #4CAF50; color: #fff; border-radius: 5px; padding: 1px 7px; font-size: 11px; font-weight: 700; }
  .note { background: #fff7e6; border-left: 4px solid #FFA000; padding: 8px 12px; font-size: 12px; margin: 10px 0; }
  .fill { color: #C8102E; font-weight: 700; }
  footer { margin-top: 30px; color: #888; font-size: 11px; border-top: 1px solid #eee; padding-top: 10px; }
  ol, ul { margin: 6px 0; padding-left: 22px; }
</style></head><body><div class="page">

<h1>Istruzioni d'uso — Quiz + Presentazione AGCO</h1>
<p class="lead">Documento per il referente AGCO · gestione rifiuti in produzione · PHTRE 2026</p>

<h2>A · Il Quiz (QR code)</h2>
<div class="link">Link quiz: <span class="fill">https://_____________________</span> &nbsp;<em>(inserire URL dopo il deploy)</em></div>
<h3>Come si usa</h3>
<ol>
  <li>I dipendenti inquadrano il <b>QR code</b> con la fotocamera dello smartphone.</li>
  <li>Si apre il quiz nel browser — <b>nessuna app</b> da installare.</li>
  <li>Inseriscono <b>nome e cognome</b> e scelgono lingua <b>IT o EN</b>.</li>
  <li>Rispondono a <b>10 domande</b> (timer attivo: più veloci = più punti).</li>
  <li>A fine quiz: <b>punteggio, tempo e posizione</b> in classifica condivisa.</li>
</ol>
<h3>Stampa del QR code</h3>
<table>
  <tr><th>File (cartella quiz/)</th><th>Uso consigliato</th></tr>
  <tr><td>qr-poster-A4-300dpi.png</td><td>Poster A4 da bacheca / parete</td></tr>
  <tr><td>qr-volantino-A5-300dpi.png</td><td>Volantino A5 o mezza pagina</td></tr>
  <tr><td>qr-web-1024.png</td><td>Schermi, email, intranet</td></tr>
</table>
<p>Stampa il file A4 a <b>dimensione reale</b> (non ridimensionare). Testato: scansione da ~50 cm.</p>
<p>La classifica è <span class="tag">CONDIVISA</span> e in tempo reale tra tutti i partecipanti (top 20 + posizione personale).</p>

<h2>B · La Presentazione (schermi)</h2>
<p>File: <b>AGCO_Rifiuti_Presentazione.pptx</b> (+ <b>.pdf</b> di backup). 18 slide, 16:9, bilingue IT/EN.</p>
<h3>Installazione in loop automatico</h3>
<ol>
  <li>Copia il <b>.pptx</b> sul PC collegato allo schermo, apri con <b>PowerPoint</b>.</li>
  <li>Menu <b>Presentazione → Imposta presentazione</b>: spunta <b>“Presentazione continua fino a ESC”</b> (loop).</li>
  <li>Le slide avanzano <b>da sole ogni 10 secondi</b> (già impostato).</li>
  <li>Avvia con <b>F5</b>. Ciclo ≈ 3 minuti, poi riparte.</li>
</ol>
<div class="note">Se lo schermo non è 16:9, usa il <b>PDF di backup</b> a tutto schermo.</div>

<h2>C · Supporto</h2>
<p>Referente PHTRE: <span class="fill">_______________</span> — tel. <span class="fill">_______________</span></p>
<p>Check di verifica proposto a <b>1 settimana</b> dalla messa online (n° partecipanti + feedback).</p>

<footer>Quiz powered by PHTRE ecologia globale per AGCO SPA · 2026</footer>
</div></body></html>`

const browser = await chromium.launch()
const page = await browser.newPage()
await page.setContent(HTML, { waitUntil: 'networkidle' })
await page.pdf({
  path: 'ISTRUZIONI.pdf',
  format: 'A4',
  printBackground: true,
  margin: { top: '0', bottom: '0', left: '0', right: '0' },
})
await browser.close()
console.log('✅ ISTRUZIONI.pdf generato')
