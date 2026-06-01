import { chromium } from 'playwright'
const BASE = 'http://localhost:4173'
const OUT = 'screenshots/new'
import { mkdirSync } from 'node:fs'
mkdirSync(OUT, { recursive: true })

const browser = await chromium.launch()

async function snap(page, name) { await page.screenshot({ path: `${OUT}/${name}.png` }); console.log('✓', name) }

// ---- MOBILE quiz flow ----
const m = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 })
const p = await m.newPage()
await p.goto(BASE, { waitUntil: 'networkidle' })
await p.waitForTimeout(500)
await snap(p, 'm1-welcome')

await p.getByText('Inizia', { exact: true }).click()
await p.waitForTimeout(400)
await p.locator('input').first().fill('Marco')
await p.locator('input').nth(1).fill('Bianchi')
await snap(p, 'm2-name')
await p.getByRole('button').filter({ hasText: /pronto|Sono pronto|Avanti|Conferma|Continua|→/ }).first().click().catch(async () => {
  await p.locator('button.btn-primary').click()
})
await p.waitForTimeout(500)
// instructions
await snap(p, 'm3-instructions')
await p.locator('button.btn-primary').click()
await p.waitForTimeout(600)
await snap(p, 'm4-question')
// answer first option
await p.locator('.option').first().click()
await p.waitForTimeout(700)
await snap(p, 'm5-answered')
// play through remaining
for (let i = 0; i < 9; i++) {
  await p.locator('.q-next').click()
  await p.waitForTimeout(250)
  await p.locator('.option').nth(1).click()
  await p.waitForTimeout(250)
}
await p.waitForTimeout(900)
await snap(p, 'm6-result')
await p.locator('button.btn-primary').click().catch(() => {})
await p.waitForTimeout(800)
await snap(p, 'm7-leaderboard')
await m.close()

// ---- DESKTOP welcome + question ----
const d = await browser.newContext({ viewport: { width: 1280, height: 860 }, deviceScaleFactor: 2 })
const pd = await d.newPage()
await pd.goto(BASE, { waitUntil: 'networkidle' })
await pd.waitForTimeout(500)
await snap(pd, 'd1-welcome')
await pd.getByText('Inizia', { exact: true }).click()
await pd.waitForTimeout(300)
await pd.locator('input').first().fill('Giulia')
await pd.locator('input').nth(1).fill('Rossi')
await pd.locator('button.btn-primary').click()
await pd.waitForTimeout(400)
await pd.locator('button.btn-primary').click()
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
