import { motion } from 'framer-motion'
import { ContactButton } from '../components/Buttons'

const NAV = [
  { label: 'Work', href: '#projects' },
  { label: 'About', href: '#about' },
  { label: 'Experience', href: '#experience' },
  { label: 'Contact', href: '#contact' },
]

const ease = [0.22, 1, 0.36, 1] as const
const rise = (delay: number) => ({
  initial: { opacity: 0, y: 26 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.9, ease },
})

export default function Hero() {
  return (
    <section
      id="home"
      className="relative flex min-h-screen flex-col px-[6vw] pb-[6vh] pt-[5vh]"
      style={{ overflowX: 'clip' }}
    >
      {/* ---------------- nav — left, so it never fights the sentinel ---- */}
      <motion.nav
        {...rise(0)}
        className="relative z-20 flex max-w-[62vw] flex-wrap items-center
                   gap-x-[15px] gap-y-[6px] sm:max-w-none sm:gap-x-[26px]"
      >
        <span className="mono text-[10.5px] text-ink">Rimsha Ahmed</span>
        <span className="hidden h-3 w-px bg-[var(--edge-strong)] sm:block" />
        {NAV.map((n) => (
          <a
            key={n.label}
            href={n.href}
            className="mono text-[10px] text-faint transition-colors duration-500
                       ease-lux hover:text-[var(--line)]"
          >
            {n.label}
          </a>
        ))}
      </motion.nav>

      {/* ---------------- the statement ---------------------------------- */}
      <div className="relative z-20 mt-auto">
        <motion.p
          {...rise(0.12)}
          className="eyebrow mb-[26px] whitespace-nowrap"
        >
          Chicago · Operations &amp; Data
        </motion.p>

        {/* Broken by hand rather than by measure — "Hi, I'm / Rimsha" is the
            only split that keeps the italic on its own line. */}
        <motion.h1
          {...rise(0.2)}
          className="display text-[clamp(3.2rem,10.5vw,9.5rem)]"
        >
          Hi, I&apos;m
          <br />
          <em>Rimsha</em>
        </motion.h1>
      </div>

      {/* ---------------- footer of the hero ----------------------------- */}
      <div className="relative z-20 mt-[7vh] flex flex-wrap items-end justify-between gap-8">
        <motion.p
          {...rise(0.34)}
          className="max-w-[42ch] text-[clamp(0.95rem,1.4vw,1.1rem)] leading-[1.75] text-muted"
        >
          Operations and data analyst turning messy exports into dashboards,
          forecasts, and tools teams actually open every morning.
        </motion.p>

        <motion.div {...rise(0.46)}>
          <ContactButton />
        </motion.div>
      </div>

      {/* ---------------- scroll cue ------------------------------------- */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1, duration: 1 }}
        /* Hidden on phones — at 390px it lands on top of the contact button,
           and the affordance is redundant on a touch device anyway. */
        className="pointer-events-none absolute bottom-[3vh] left-1/2 z-20 hidden
                   -translate-x-1/2 flex-col items-center gap-[10px] sm:flex"
      >
        <span className="eyebrow text-[9px]">Scroll</span>
        <motion.span
          animate={{ scaleY: [0.3, 1, 0.3], originY: 0 }}
          transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
          className="block h-[34px] w-px bg-[var(--line)] opacity-50"
        />
      </motion.div>
    </section>
  )
}
