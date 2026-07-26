import { useEffect, useRef } from 'react'
import { mouse, attachMouseTracking } from '../lib/mouse'

/**
 * Mounted once at the app root. Two jobs:
 *  1. Start global mouse tracking (the 3D sentinel reads the same values).
 *  2. Paint a soft cyan radial glow at the cursor, on every section.
 *
 * The glow is written via CSS custom properties inside a requestAnimationFrame
 * loop, so we touch the DOM at most once per frame no matter how fast the
 * mouse moves.
 */
export default function CursorLight() {
  const raf = useRef<number>()

  useEffect(() => {
    const detach = attachMouseTracking()
    const root = document.documentElement

    const tick = () => {
      root.style.setProperty('--mx', `${mouse.px}px`)
      root.style.setProperty('--my', `${mouse.py}px`)
      raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)

    return () => {
      detach()
      if (raf.current) cancelAnimationFrame(raf.current)
    }
  }, [])

  return <div className="cursor-light" aria-hidden="true" />
}
