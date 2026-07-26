import { useEffect, useRef } from 'react'
import { mouse } from '../lib/mouse'

const SKILLS = [
  'Power BI',
  'DAX',
  'Python',
  'SQL',
  'MySQL',
  'Power Query',
  'Data Visualization',
  'Demand Planning',
  'ERP Systems',
  'Excel (Advanced)',
  'Google Sheets',
  'C#',
  'C++',
  'Process Automation',
  'Inventory Forecasting',
]

/**
 * Skills marquee. The row's horizontal position is driven by how far the
 * page has scrolled, not by a timer — so it feels connected to the scroll.
 * The list is tripled so the wrap point is invisible.
 */
export default function Marquee() {
  const section = useRef<HTMLElement>(null)
  const row = useRef<HTMLDivElement>(null)
  const raf = useRef<number>()

  useEffect(() => {
    const tick = () => {
      const sec = section.current
      const r = row.current
      if (sec && r) {
        const sectionTop = sec.offsetTop
        const offset =
          (window.scrollY - sectionTop + window.innerHeight) * 0.3
        // one third of the tripled row = the loop length
        const loop = r.scrollWidth / 3
        const x = loop ? (((offset - 200) % loop) + loop) % loop : 0
        r.style.transform = `translateX(${-x}px)`

        // Light up pills near the cursor — the sentinel's beam passing over.
        if (mouse.active) {
          const pills = r.children
          for (let i = 0; i < pills.length; i++) {
            const el = pills[i] as HTMLElement
            const b = el.getBoundingClientRect()
            const cx = b.left + b.width / 2
            const cy = b.top + b.height / 2
            const d = Math.hypot(cx - mouse.px, cy - mouse.py)
            const near = d < 200
            el.style.borderColor = near
              ? 'var(--monitor)'
              : 'var(--line)'
            el.style.boxShadow = near
              ? '0 0 24px rgba(79,201,255,0.25)'
              : 'none'
          }
        }
      }
      raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current)
    }
  }, [])

  const tripled = [...SKILLS, ...SKILLS, ...SKILLS]

  return (
    <section
      ref={section}
      className="pt-24 sm:pt-32 md:pt-40 pb-10 overflow-hidden"
      style={{ background: 'var(--bg)' }}
      aria-label="Skills"
    >
      <div
        ref={row}
        className="flex gap-3 w-max"
        style={{ willChange: 'transform' }}
      >
        {tripled.map((s, i) => (
          <span
            key={i}
            className="rounded-full border text-ink font-normal uppercase tracking-widest px-8 py-4 whitespace-nowrap transition-all duration-300"
            style={{
              borderColor: 'var(--line)',
              background: 'var(--surface)',
              fontSize: 'clamp(0.9rem, 1.6vw, 1.4rem)',
            }}
          >
            {s}
          </span>
        ))}
      </div>
    </section>
  )
}
