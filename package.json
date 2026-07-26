import { Suspense, lazy } from 'react'
import { motion } from 'framer-motion'
import { ContactButton } from '../components/Buttons'

const SentinelMonitor = lazy(() => import('../components/SentinelMonitor'))

const NAV = [
  { label: 'Home', href: '#home' },
  { label: 'Projects', href: '#projects' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
]

const ease = [0.25, 0.1, 0.25, 1] as const

export default function Hero() {
  return (
    <section
      id="home"
      className="relative h-screen flex flex-col"
      style={{ overflowX: 'clip' }}
    >
      {/* Navbar */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0, duration: 0.7, ease }}
        className="relative z-20 flex justify-between px-6 md:px-10 pt-6 md:pt-8"
      >
        {NAV.map((n) => (
          <a
            key={n.label}
            href={n.href}
            className="text-ink font-medium uppercase tracking-wider text-sm md:text-lg lg:text-[1.4rem] transition-opacity duration-200 hover:opacity-70"
          >
            {n.label}
          </a>
        ))}
      </motion.nav>

      {/* Heading */}
      <div className="overflow-hidden relative z-20 px-6 md:px-10">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.7, ease }}
          className="hero-heading font-black uppercase tracking-tight leading-none whitespace-nowrap w-full text-[13vw] sm:text-[12.5vw] md:text-[12vw] lg:text-[11.5vw] mt-6 sm:mt-4 md:-mt-5"
        >
          Hi, I'm Rimsha!
        </motion.h1>
      </div>

      {/* The sentinel — fills the lower hero, sits behind the text layer */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <Suspense fallback={null}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 1.2, ease }}
            className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 sm:top-auto sm:translate-y-0 sm:bottom-0 w-[280px] h-[280px] sm:w-[360px] sm:h-[360px] md:w-[440px] md:h-[440px] lg:w-[520px] lg:h-[520px]"
          >
            <SentinelMonitor />
          </motion.div>
        </Suspense>
      </div>

      {/* Bottom bar */}
      <div className="mt-auto relative z-20 flex justify-between items-end px-6 md:px-10 pb-7 sm:pb-8 md:pb-10">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.7, ease }}
          className="text-ink font-light uppercase tracking-wide leading-snug max-w-[160px] sm:max-w-[220px] md:max-w-[260px]"
          style={{ fontSize: 'clamp(0.75rem, 1.4vw, 1.5rem)' }}
        >
          Operations &amp; data analyst turning messy data into dashboards,
          forecasts, and tools teams actually use
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.7, ease }}
        >
          <ContactButton />
        </motion.div>
      </div>
    </section>
  )
}
