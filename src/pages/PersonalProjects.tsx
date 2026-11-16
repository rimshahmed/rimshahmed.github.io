import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { useScroll } from 'framer-motion'
import CursorLight from '../components/CursorLight'
import FadeIn from '../components/FadeIn'
import { RuleLink } from '../components/Buttons'
import { Card } from '../sections/Projects'
import { projects } from '../data/projects'

/**
 * Everything that is not in the main stack: work tools still in
 * development, then the things built for myself. Kept off the home page so
 * the stack there only holds work a team already relies on.
 *
 * Same Card component as the main section, so the two pages cannot drift
 * apart visually.
 */
const personal = projects
  .filter((p) => p.kind === 'other' || p.kind === 'personal')
  .sort((x, y) => Number(y.kind === 'other') - Number(x.kind === 'other'))

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
            <span className="label">O</span>
            <div className="rule w-[clamp(40px,7vw,90px)]" />
            <span className="eyebrow">Other projects</span>
          </div>
        </FadeIn>

        <FadeIn y={34}>
          <h1 className="display max-w-[16ch] text-[clamp(2.4rem,7vw,5.5rem)]">
            The rest of the <em>shelf</em>
          </h1>
        </FadeIn>

        <FadeIn y={24} delay={0.12}>
          <p className="mt-[30px] max-w-[54ch] text-[clamp(0.95rem,1.25vw,1.075rem)]
                        leading-[1.85] text-muted">
            Work tools still in development, and things I built for myself.
            Some are finished. Some aren&apos;t yet.
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
