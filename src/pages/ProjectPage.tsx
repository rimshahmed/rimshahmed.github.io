import { useParams, Link } from 'react-router-dom'
import { useEffect } from 'react'
import CursorLight from '../components/CursorLight'
import FadeIn from '../components/FadeIn'
import { RuleLink } from '../components/Buttons'
import { projects } from '../data/projects'

export default function ProjectPage() {
  const { slug } = useParams()
  const p = projects.find((x) => x.slug === slug)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [slug])

  if (!p) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-[26px]">
        <h1 className="display text-[clamp(3rem,10vw,7rem)]">404</h1>
        <Link to="/" className="label">
          Back home
        </Link>
      </main>
    )
  }

  const sections = [
    { label: 'The problem', body: p.caseStudy.problem },
    { label: 'What existed before', body: p.caseStudy.before },
    { label: 'What I built', body: p.caseStudy.built },
    { label: 'How it works', body: p.caseStudy.how },
    { label: 'The result', body: p.caseStudy.result },
    { label: "What's next", body: p.caseStudy.next },
  ]

  return (
    <main style={{ overflowX: 'clip', background: 'var(--bg)' }}>
      <CursorLight />

      <nav className="px-[6vw] pt-[5vh]">
        <Link
          to="/"
          className="mono text-[10px] text-faint transition-colors duration-500
                     ease-lux hover:text-[var(--line)]"
        >
          ← Back
        </Link>
      </nav>

      <header className="mx-auto max-w-[900px] px-[6vw] pb-[6vh] pt-[10vh]">
        <FadeIn y={20}>
          <p className="eyebrow mb-[22px]">{p.category}</p>
        </FadeIn>
        <FadeIn delay={0.08} y={30}>
          <h1 className="display text-[clamp(2.4rem,8vw,5.5rem)]">{p.name}</h1>
        </FadeIn>
        <FadeIn delay={0.16}>
          <div className="mt-[42px] flex flex-wrap items-end gap-x-[7vw] gap-y-[26px]
                          border-t border-[var(--edge)] pt-[26px]">
            <div>
              <div className="font-mono text-[clamp(1.8rem,3.4vw,2.8rem)] leading-none
                              text-[var(--line-bright)]">
                {p.metric}
              </div>
              <div className="label mt-[10px]">{p.metricLabel}</div>
            </div>
            <div className="flex flex-wrap items-center gap-x-[20px] gap-y-[8px]">
              {p.stack.map((s) => (
                <span key={s} className="mono text-[9.5px] text-faint">
                  {s}
                </span>
              ))}
            </div>
          </div>
        </FadeIn>
      </header>

      <FadeIn delay={0.2}>
        <div className="mx-auto grid max-w-[1100px] gap-[10px] px-[6vw] md:grid-cols-3">
          <img
            src={p.images.a}
            alt=""
            className="h-56 w-full border border-[var(--edge)] object-cover"
          />
          <img
            src={p.images.b}
            alt=""
            className="h-56 w-full border border-[var(--edge)] object-cover"
          />
          <img
            src={p.images.tall}
            alt=""
            className="h-56 w-full border border-[var(--edge)] object-cover"
          />
        </div>
      </FadeIn>

      <div className="mx-auto max-w-[760px] px-[6vw] py-[12vh]">
        {sections.map((s, i) => (
          <FadeIn key={s.label} delay={i * 0.05}>
            <div className="grid grid-cols-1 gap-x-[4vw] gap-y-[12px] border-t
                            border-[var(--edge)] py-[32px] md:grid-cols-[150px_1fr]">
              <p className="label pt-[5px]">{s.label}</p>
              <p className="text-[clamp(0.95rem,1.25vw,1.075rem)] leading-[1.85] text-muted">
                {s.body}
              </p>
            </div>
          </FadeIn>
        ))}
      </div>

      <div className="px-[6vw] pb-[14vh]">
        <RuleLink href="/#projects">All projects</RuleLink>
      </div>
    </main>
  )
}
