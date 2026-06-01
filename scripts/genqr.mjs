// Genera QR code in 3 dimensioni dall'URL del quiz.
// Uso: QUIZ_URL=https://... node scripts/genqr.mjs
//   oppure: node scripts/genqr.mjs https://quiz-agco.vercel.app
import QRCode from 'qrcode'
import { mkdir } from 'node:fs/promises'

const url = process.argv[2] || process.env.QUIZ_URL
if (!url || url.includes('example')) {
  console.error('❌ Manca URL. Uso: node scripts/genqr.mjs https://tuo-quiz.vercel.app')
  process.exit(1)
}

const OUT = 'qr'
await mkdir(OUT, { recursive: true })

// width px. A4 poster ~ 2480px lato (300dpi su 21cm), A5 ~1748, web 1024.
const sizes = [
  { name: 'qr-poster-A4-300dpi.png', width: 2480, margin: 4 },
  { name: 'qr-volantino-A5-300dpi.png', width: 1748, margin: 4 },
  { name: 'qr-web-1024.png', width: 1024, margin: 2 },
]

const opts = {
  errorCorrectionLevel: 'H', // alta tolleranza: regge il logo sopra
  color: { dark: '#1B3A8C', light: '#FFFFFF' },
}

for (const s of sizes) {
  const path = `${OUT}/${s.name}`
  await QRCode.toFile(path, url, { ...opts, width: s.width, margin: s.margin })
  console.log(`✅ ${path}  (${s.width}px)`)
}

console.log(`\n🔗 URL codificato: ${url}`)
console.log(`📁 File in ./${OUT}/`)
