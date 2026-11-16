import { useEffect, useState } from 'react'

/* ------------------------------------------------------------------ *
 *  A word that decodes itself.
 *
 *  Each letter starts as a cycling monospace glyph and resolves, left
 *  to right, into the real letter in the display face — raw characters
 *  turning into a name, which is more or less the job description.
 *
 *  The real letter is always in the layout (just hidden until its turn),
 *  so the word holds its final width from the first frame and nothing
 *  around it shifts while the glyphs churn.
 * ------------------------------------------------------------------ */

const GLYPHS = 'ABCDEFGHJKLMNPQRSTUVWXYZ0123456789#%&/<>=+*'

const REDUCED =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

type Props = {
  text: string
  /** Seconds before the first letter starts to resolve. */
  delay?: number
  /** Seconds from the first letter resolving to the last. */
  duration?: number
  /** Milliseconds between glyph changes. */
  tick?: number
}

const pick = () => GLYPHS[Math.floor(Math.random() * GLYPHS.length)]

export default function ScrambleText({
  text,
  delay = 0.35,
  duration = 1.3,
  tick = 55,
}: Props) {
  const letters = Array.from(text)
  const [resolved, setResolved] = useState(REDUCED ? letters.length : 0)
  const [noise, setNoise] = useState(() => letters.map(pick))

  useEffect(() => {
    if (REDUCED) return
    const start = performance.now() + delay * 1000
    const id = window.setInterval(() => {
      const t = (performance.now() - start) / 1000
      // Ease-in: the first letters take their time, the last ones snap.
      const k = Math.min(1, Math.max(0, t / duration))
      const done = Math.floor(k * k * (letters.length + 0.999))
      setResolved(Math.min(letters.length, done))
      setNoise(letters.map(pick))
      if (done >= letters.length) window.clearInterval(id)
    }, tick)
    return () => window.clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, delay, duration, tick])

  return (
    <span aria-label={text} role="text" className="inline-block whitespace-nowrap">
      {letters.map((ch, i) => {
        const on = i < resolved
        return (
          <span key={i} aria-hidden className="relative inline-block">
            <span
              style={{
                opacity: on ? 1 : 0,
                filter: on ? 'blur(0)' : 'blur(6px)',
                transition: 'opacity 420ms ease, filter 420ms ease',
              }}
            >
              {ch}
            </span>
            {!on && (
              <span
                className="absolute inset-0 flex items-center justify-center
                           text-[0.42em] not-italic text-[var(--line)]"
                style={{
                  fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                  letterSpacing: 0,
                }}
              >
                {noise[i]}
              </span>
            )}
          </span>
        )
      })}
    </span>
  )
}
