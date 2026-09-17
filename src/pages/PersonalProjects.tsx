import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { useScroll } from 'framer-motion'
import CursorLight from '../components/CursorLight'
import FadeIn from '../components/FadeIn'
import { RuleLink } from '../components/Buttons'
import { Card } from '../sections/Projects'
import { projects } from '../data/projects'

/**
 * The personal strand, on its own page rather than appended to the main
 * stack. Work built for a team that depends on it and work built for
 * myself are different claims about a person, and running them together
 * in one list quietly flattens both — the professional work loses the
 * weight of "people rely on this", and the personal work loses the
 * freedom of "I built this because I wanted it to exist".
 *
 * Same Card component as the main section, so the two pages cannot drift
 * apart visually.
 */
const personal = projects.filter((p) => p.kind === 'personal')

export default function PersonalProjects() {
  const container = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start start', 'end end'],
  })

  return (
    <main style={{ overflowX: 'clip', background: 'var(--bg)' }}>
      <CursorLight />

      <nav className="px-[6vw] pt-[5vh]">
        <Link
          to="/#projects"
          className="mono text-[10px] text-faint transition-colors duration-500
                     ease-lux hover:text-[var(--line)]"
        >
          ← Back
        </Link>
      </nav>

      <header className="mx-auto max-w-[1180px] px-[6vw] pb-[4vh] pt-[9vh]">
        <FadeIn y={30}>
          <div className="mb-[5vh] flex items-baseline gap-[18px]">
            <span className="label">P</span>
            <div className="rule w-[clamp(40px,7vw,90px)]" />
            <span className="eyebrow">Personal projects</span>
          </div>
        </FadeIn>

        <FadeIn y={34}>
          <h1 className="display max-w-[16ch] text-[clamp(2.4rem,7vw,5.5rem)]">
            Built because I <em>wanted</em> them
          </h1>
        </FadeIn>

        <FadeIn y={24} delay={0.12}>
          <p className="mt-[30px] max-w-[54ch] text-[clamp(0.95rem,1.25vw,1.075rem)]
                        leading-[1.85] text-muted">
            No brief, no stakeholder, no deadline — which means every decision in
            them is mine to defend. Some are finished. Some are honestly not.
          </p>
        </FadeIn>
      </header>

      <div ref={container} className="px-[4vw] pb-[6vh]">
        {personal.map((p, i) => (
          <Card
            key={p.slug}
            project={p}
            index={i}
            total={personal.length}
            progress={scrollYProgress}
          />
        ))}
      </div>

      <div className="px-[6vw] pb-[14vh]">
        <RuleLink href="/#projects">Back to selected work</RuleLink>
      </div>
    </main>
  )
}
