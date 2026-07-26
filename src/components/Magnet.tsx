import { useEffect, useRef, useState, type ReactNode } from 'react'

type Props = {
  children: ReactNode
  /** how close (px) the cursor must get before the element starts following */
  padding?: number
  /** higher = less movement. 4 means the element moves 1/4 of the cursor offset */
  strength?: number
  className?: string
}

/**
 * Magnetic hover. When the cursor comes within `padding` of the element,
 * the element leans toward it. Snappy on the way in, slow on the way out —
 * that asymmetry is what makes it feel physical rather than springy.
 */
export default function Magnet({
  children,
  padding = 100,
  strength = 4,
  className,
}: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(false)
  const [pos, setPos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const el = ref.current
      if (!el) return
      const r = el.getBoundingClientRect()
      const cx = r.left + r.width / 2
      const cy = r.top + r.height / 2
      const dx = e.clientX - cx
      const dy = e.clientY - cy

      const withinX = Math.abs(dx) < r.width / 2 + padding
      const withinY = Math.abs(dy) < r.height / 2 + padding

      if (withinX && withinY) {
        setActive(true)
        setPos({ x: dx / strength, y: dy / strength })
      } else {
        setActive(false)
        setPos({ x: 0, y: 0 })
      }
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [padding, strength])

  return (
    <div
      ref={ref}
      className={className}
      style={{
        display: 'inline-block',
        transform: `translate3d(${pos.x}px, ${pos.y}px, 0)`,
        transition: active
          ? 'transform 0.3s ease-out'
          : 'transform 0.6s ease-in-out',
        willChange: 'transform',
      }}
    >
      {children}
    </div>
  )
}
