import { chromium } from 'playwright'
import { mkdir } from 'node:fs/promises'

const BASE = process.env.BASE || 'http://localhost:4173'
await mkdir('screenshots', { recursive: true })

const browser = await chromium.launch()
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 })
const page = await ctx.newPage()
const errors = []
page.on('pageerror', (e) => errors.push('PAGEERROR: ' + e.message))
page.on('console', (m) => { if (m.type() === 'error') errors.push('CONSOLE: ' + m.text()) })

async function shot(name) { await page.screenshot({ path: `screenshots/${name}.png` }) }

await page.goto(BASE, { waitUntil: 'networkidle' })
await shot('1-welcome')

// EN toggle check
await page.click('.lang-toggle button:has-text("EN")')
await page.waitForTimeout(150)
const enTitle = await page.textContent('.welcome h1')
console.log('EN title:', enTitle)
await page.click('.lang-toggle button:has-text("IT")')

// start
await page.click('.welcome .btn')
await shot('2-name')
await page.fill('input[autocomplete="given-name"]', 'Mario')
await page.fill('input[autocomplete="family-name"]', 'Rossi')
await page.click('.name-input .btn')
await shot('3-instructions')
await page.click('.instructions .btn')

// play 10 questions
for (let i = 0; i < 10; i++) {
  await page.waitForSelector('.options .option')
  if (i === 0) await shot('4-question')
  await page.click('.options .option >> nth=1') // pick B (may be right/wrong, doesn't matter)
  await page.waitForSelector('.q-feedback')
  if (i === 0) await shot('5-feedback')
  await page.click('.q-feedback .btn')
}

await page.waitForSelector('.result')
await shot('6-result')
await page.click('.result .btn')
await page.waitForSelector('.leaderboard')
await shot('7-leaderboard')

const rows = await page.$$eval('.board-row:not(.board-head)', (els) => els.length)
console.log('Leaderboard rows:', rows)

await browser.close()

if (errors.length) {
  console.error('\n❌ JS ERRORS:\n' + errors.join('\n'))
  process.exit(1)
}
console.log('\n✅ Smoke OK — full flow, no JS errors. Screenshots in ./screenshots/')
