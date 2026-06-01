import { useEffect, useRef, useState } from 'react'

// Timer robusto: misura tempo reale con Date.now(), non si blocca al lock screen.
// onTick non serve; il tempo vero viene letto al momento della risposta.
export default function Timer({ startAt, frozen }) {
  const [, force] = useState(0)
  const raf = useRef(null)

  useEffect(() => {
    if (frozen) return
    let mounted = true
    const loop = () => {
      if (!mounted) return
      force((n) => n + 1)
      raf.current = setTimeout(loop, 250)
    }
    loop()
    return () => {
      mounted = false
      clearTimeout(raf.current)
    }
  }, [frozen, startAt])

  const elapsed = frozen ? frozen : (Date.now() - startAt) / 1000
  const within = elapsed <= 30
  return (
    <div className={`timer ${within ? 'timer-good' : 'timer-late'}`}>
      {elapsed.toFixed(1)}s
    </div>
  )
}
