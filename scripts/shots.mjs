import { chromium } from 'playwright'
import { mkdirSync } from 'node:fs'
const BASE = 'http://localhost:4173'
const OUT = 'screenshots/new'
mkdirSync(OUT, { recursive: true })

const browser = await chromium.launch()
const snap = (page, name) => page.screenshot({ path: `${OUT}/${name}.png` }).then(() => console.log('✓', name))
const seedDone = () => {} // placeholder

async function runFlow(page, optionPicker) {
  await page.getByRole('button', { name: 'Inizia', exact: true }).click() // welcome
  await page.waitForTimeout(350)
  await page.locator('input').first().fill('Marco')
  await page.locator('input').nth(1).fill('Bianchi')
  await snap(page, 'm2-name')
  await page.getByRole('button', { name: 'Inizia', exact: true }).click() // name submit
  await page.waitForTimeout(500)
  await snap(page, 'm3-instructions')
  await page.getByRole('button', { name: 'Sono pronto' }).click()
  await page.waitForTimeout(600)
  await snap(page, 'm4-question')
  await page.locator('main button').nth(optionPicker(0)).click() // answer Q1
  await page.waitForTimeout(700)
  await snap(page, 'm5-answered')
  for (let i = 0; i < 10; i++) {
    const next = page.getByRole('button', { name: /Avanti|Vedi risultato/ })
    await next.click()
    await page.waitForTimeout(300)
    const opts = page.locator('main button')
    const count = await opts.count()
    if (count > 0) { await opts.nth(optionPicker(i + 1)).click().catch(() => {}); await page.waitForTimeout(250) }
    if (await page.getByText('Punteggio').count()) break
  }
}

// ---- MOBILE flow ----
const m = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 })
const p = await m.newPage()
await p.goto(BASE, { waitUntil: 'networkidle' })
await p.waitForTimeout(3600) // attende lo splash
await snap(p, 'm1-welcome')
await runFlow(p, () => 0)
await p.waitForTimeout(900)
await snap(p, 'm6-result')
await m.close()

// ---- MOBILE leaderboard (locked board seeded) ----
const lb = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 })
const plb = await lb.newPage()
await plb.addInitScript(() => {
  const rows = [
    { id: 1, nome: 'Marco', cognome: 'Bianchi', punteggio: 1588, tempoTotaleSecondi: 13 },
    { id: 2, nome: 'Bianca', cognome: 'Miola', punteggio: 1400, tempoTotaleSecondi: 31 },
    { id: 3, nome: 'Luca', cognome: 'Verdi', punteggio: 1180, tempoTotaleSecondi: 22 },
    { id: 4, nome: 'Sara', cognome: 'Neri', punteggio: 980, tempoTotaleSecondi: 40 },
  ]
  localStorage.setItem('agco_quiz_leaderboard', JSON.stringify(rows))
  localStorage.setItem('agco_quiz_done', JSON.stringify({ nome: 'Marco', cognome: 'Bianchi', punteggio: 1588, tempoTotaleSecondi: 13 }))
})
await plb.goto(BASE, { waitUntil: 'networkidle' })
await plb.waitForTimeout(3700)
await snap(plb, 'm7-leaderboard')
await lb.close()

// ---- SPLASH (early) ----
const sp = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 })
const psp = await sp.newPage()
await psp.goto(BASE, { waitUntil: 'domcontentloaded' })
await psp.waitForTimeout(700)
await snap(psp, 'splash-mobile')
await sp.close()

// ---- DESKTOP welcome + question ----
const d = await browser.newContext({ viewport: { width: 1280, height: 860 }, deviceScaleFactor: 2 })
const pd = await d.newPage()
await pd.goto(BASE, { waitUntil: 'networkidle' })
await pd.waitForTimeout(3600)
await snap(pd, 'd1-welcome')
await pd.getByRole('button', { name: 'Inizia', exact: true }).click()
await pd.waitForTimeout(300)
await pd.locator('input').first().fill('Giulia')
await pd.locator('input').nth(1).fill('Rossi')
await pd.getByRole('button', { name: 'Inizia', exact: true }).click()
await pd.waitForTimeout(400)
await pd.getByRole('button', { name: 'Sono pronto' }).click()
await pd.waitForTimeout(600)
await snap(pd, 'd2-question')
await d.close()

// ---- TV display with seeded board ----
const tv = await browser.newContext({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 })
const pt = await tv.newPage()
await pt.addInitScript(() => {
  const rows = [
    { id: 1, nome: 'Nicolo', cognome: 'Masullo', punteggio: 1588, tempoTotaleSecondi: 13 },
    { id: 2, nome: 'Bianca', cognome: 'Miola', punteggio: 1400, tempoTotaleSecondi: 31 },
    { id: 3, nome: 'Marco', cognome: 'Bianchi', punteggio: 1180, tempoTotaleSecondi: 22 },
    { id: 4, nome: 'Giulia', cognome: 'Rossi', punteggio: 980, tempoTotaleSecondi: 40 },
    { id: 5, nome: 'Luca', cognome: 'Verdi', punteggio: 740, tempoTotaleSecondi: 28 },
    { id: 6, nome: 'Sara', cognome: 'Neri', punteggio: 520, tempoTotaleSecondi: 35 },
  ]
  localStorage.setItem('agco_quiz_leaderboard', JSON.stringify(rows))
})
await pt.goto(`${BASE}/classifica`, { waitUntil: 'networkidle' })
await pt.waitForTimeout(1200)
await snap(pt, 'tv-classifica')
await tv.close()

await browser.close()
console.log('done')
