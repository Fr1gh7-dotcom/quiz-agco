// Genera asset grafici via Playwright (rasterizza SVG/HTML → PNG):
//   - apple-touch-icon.png (180x180)
//   - icon-512.png (512x512, maskable)
//   - og-image.png (1200x630, social preview)
// Uso: node scripts/genassets.mjs
import { chromium } from 'playwright'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const pub = join(__dirname, '..', 'public')

const favSvg = readFileSync(join(pub, 'favicon.svg'), 'utf8')

// Icona quadrata (riusa il favicon, con padding per la versione maskable)
function iconHTML(size, padRatio) {
  const pad = Math.round(size * padRatio)
  return `<!doctype html><meta charset="utf-8">
  <style>html,body{margin:0}#b{width:${size}px;height:${size}px;display:grid;place-items:center;background:#16202e}
  #i{width:${size - pad * 2}px;height:${size - pad * 2}px}</style>
  <div id="b"><div id="i">${favSvg}</div></div>`
}

// OG image 1200x630 — titolo + brand, tema grafite, filo rosso
function ogHTML() {
  return `<!doctype html><meta charset="utf-8">
  <link href="https://fonts.googleapis.com/css2?family=Archivo:wght@600;700;800&family=Noto+Serif:wght@600;700&display=swap" rel="stylesheet">
  <style>
    html,body{margin:0}
    #c{width:1200px;height:630px;position:relative;overflow:hidden;
       background:linear-gradient(160deg,#1c2838 0%,#16202e 70%,#111a26 100%);
       font-family:'Archivo',sans-serif;color:#fff;
       background-image:linear-gradient(160deg,#1c2838 0%,#16202e 70%,#111a26 100%),
         linear-gradient(rgba(255,255,255,0.03) 1px,transparent 1px),
         linear-gradient(90deg,rgba(255,255,255,0.03) 1px,transparent 1px);
       background-size:auto,44px 44px,44px 44px;}
    #c::after{content:'';position:absolute;left:0;right:0;bottom:0;height:8px;background:#c8102e}
    .glow{position:absolute;top:-180px;right:-120px;width:620px;height:620px;border-radius:50%;
       background:radial-gradient(circle,rgba(27,58,140,0.45),transparent 60%)}
    .wrap{position:absolute;inset:0;padding:78px 84px;display:flex;flex-direction:column;justify-content:space-between}
    .eyebrow{font-size:22px;font-weight:800;letter-spacing:3px;text-transform:uppercase;color:rgba(255,255,255,0.62)}
    h1{font-family:'Noto Serif',serif;font-weight:700;font-size:96px;line-height:1.02;margin:0;max-width:14ch}
    .mark{width:96px;height:96px;margin-bottom:30px}
    .foot{display:flex;align-items:center;gap:16px;font-size:26px;font-weight:700;color:rgba(255,255,255,0.85)}
    .dot{width:8px;height:8px;border-radius:50%;background:#c8102e}
  </style>
  <div id="c">
    <div class="glow"></div>
    <div class="wrap">
      <div>
        <div class="mark">${favSvg}</div>
        <div class="eyebrow">Gestione rifiuti in produzione</div>
        <h1>Quiz Rifiuti AGCO</h1>
      </div>
      <div class="foot"><span>AGCO SPA</span><span class="dot"></span><span>a cura di PHTRE</span></div>
    </div>
  </div>`
}

const browser = await chromium.launch()
const page = await browser.newPage({ deviceScaleFactor: 1 })

async function shot(html, w, h, file) {
  await page.setViewportSize({ width: w, height: h })
  await page.setContent(html, { waitUntil: 'networkidle' })
  await page.waitForTimeout(350)
  const el = await page.$('#c, #b')
  await el.screenshot({ path: join(pub, file) })
  console.log('✓', file)
}

await shot(iconHTML(512, 0.08), 512, 512, 'icon-512.png')
await shot(iconHTML(180, 0.0), 180, 180, 'apple-touch-icon.png')
await shot(ogHTML(), 1200, 630, 'og-image.png')

await browser.close()
console.log('Fatto.')
