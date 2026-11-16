import { motion } from 'framer-motion'
import { ContactButton } from '../components/Buttons'

const NAV = [
  { label: 'Work', href: '#projects' },
  { label: 'About', href: '#about' },
  { label: 'Experience', href: '#experience' },
  { label: 'Contact', href: '#contact' },
]

const REDUCED =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

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

      {/* ---------------- the statement ----------------------------------
          Centred in the viewport, as one block: greeting, name, line, button.
          Bottom-anchoring it left the whole upper half of the screen empty. */}
      <div className="relative z-20 my-auto flex flex-col items-center py-[8vh] text-center">
        <motion.p {...rise(0.12)} className="eyebrow mb-[30px] whitespace-nowrap">
          Chicago · Operations &amp; Data
        </motion.p>

        <h1 className="display">
          <motion.span
            {...rise(0.2)}
            className="block text-[clamp(1.9rem,4.6vw,4rem)] text-muted"
          >
            Hi, I&apos;m
          </motion.span>
          {/* Focus pull: the name starts soft and widely spaced, then
              tightens into focus. Skipped entirely under reduced motion. */}
          <motion.em
            initial={
              REDUCED
                ? false
                : { opacity: 0, filter: 'blur(22px)', letterSpacing: '0.2em', scale: 1.05 }
            }
            animate={{ opacity: 1, filter: 'blur(0px)', letterSpacing: '-0.015em', scale: 1 }}
            transition={{ delay: 0.35, duration: 1.7, ease: [0.16, 1, 0.3, 1] }}
            className="block whitespace-nowrap text-[clamp(4.6rem,17vw,15rem)] leading-[0.95]"
          >
            Rimsha
          </motion.em>
        </h1>

        <motion.p
          {...rise(1.5)}
          className="mt-[4vh] max-w-[46ch] text-[clamp(0.95rem,1.4vw,1.1rem)] leading-[1.75] text-muted"
        >
          I&apos;m an operations and data analyst. I build the dashboards and
          tools that make decisions clearer.
        </motion.p>

        <motion.div {...rise(1.65)} className="mt-[4vh]">
          <ContactButton />
        </motion.div>
      </div>

      {/* ---------------- scroll cue ------------------------------------- */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.1, duration: 1 }}
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
