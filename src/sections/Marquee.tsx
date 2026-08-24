import { useEffect, useRef } from 'react'

const SKILLS = [
  'Power BI',
  'DAX',
  'Python',
  'SQL',
  'MySQL',
  'Power Query',
  'Data Visualisation',
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
 * Skills marquee, restrained.
 *
 * The pills are gone — at this scale a row of outlined capsules reads as a
 * tag cloud, which is the opposite of the register we want. What's left is
 * a single line of quiet type separated by hairline dots, drifting on
 * scroll rather than on a timer so it stays tied to the reader's motion.
 *
 * The row is tripled so the wrap point never lands in view. Masked at both
 * edges so it dissolves into the page instead of being cut off.
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
        const offset =
          (window.scrollY - sec.offsetTop + window.innerHeight) * 0.22
        const loop = r.scrollWidth / 3
        const x = loop ? (((offset - 200) % loop) + loop) % loop : 0
        r.style.transform = `translate3d(${-x}px,0,0)`
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
      aria-label="Skills"
      className="overflow-hidden border-y border-[var(--edge)] py-[26px]"
      style={{
        WebkitMaskImage:
          'linear-gradient(to right, transparent, #000 12%, #000 88%, transparent)',
        maskImage:
          'linear-gradient(to right, transparent, #000 12%, #000 88%, transparent)',
      }}
    >
      <div
        ref={row}
        className="flex w-max items-center gap-[38px]"
        style={{ willChange: 'transform' }}
      >
        {tripled.map((s, i) => (
          <span key={i} className="flex shrink-0 items-center gap-[38px]">
            <span className="mono whitespace-nowrap text-[11px] text-muted">
              {s}
            </span>
            <span className="h-[3px] w-[3px] rounded-full bg-[var(--line)] opacity-60" />
          </span>
        ))}
      </div>
    </section>
  )
}
