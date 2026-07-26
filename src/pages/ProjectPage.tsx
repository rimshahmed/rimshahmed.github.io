import { useParams, Link } from 'react-router-dom'
import { useEffect } from 'react'
import CursorLight from '../components/CursorLight'
import FadeIn from '../components/FadeIn'
import { projects } from '../data/projects'

export default function ProjectPage() {
  const { slug } = useParams()
  const p = projects.find((x) => x.slug === slug)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [slug])

  if (!p) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center gap-6">
        <h1 className="hero-heading font-black uppercase text-6xl">404</h1>
        <Link to="/" className="text-monitor underline">
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

      <nav className="px-6 md:px-10 pt-6 md:pt-8">
        <Link
          to="/"
          className="text-ink font-medium uppercase tracking-wider text-sm md:text-lg hover:opacity-70 transition-opacity"
        >
          ← Back
        </Link>
      </nav>

      <header className="px-5 sm:px-8 md:px-10 pt-16 pb-10 max-w-[900px] mx-auto">
        <FadeIn y={20}>
          <p className="text-muted uppercase tracking-[0.18em] text-xs font-light mb-4">
            {p.category}
          </p>
        </FadeIn>
        <FadeIn delay={0.08} y={30}>
          <h1
            className="hero-heading font-black uppercase leading-none tracking-tight"
            style={{ fontSize: 'clamp(2.5rem, 9vw, 6rem)' }}
          >
            {p.name}
          </h1>
        </FadeIn>
        <FadeIn delay={0.16}>
          <div className="mt-8 flex flex-wrap items-end gap-10">
            <div>
              <div
                className="font-semibold leading-none"
                style={{ color: 'var(--monitor)', fontSize: 'clamp(2rem, 4vw, 3.2rem)' }}
              >
                {p.metric}
              </div>
              <div className="text-muted uppercase tracking-[0.18em] text-[11px] mt-2 font-light">
                {p.metricLabel}
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {p.stack.map((s) => (
                <span
                  key={s}
                  className="rounded-full border px-4 py-1.5 text-[11px] uppercase tracking-[0.16em] text-muted font-light"
                  style={{ borderColor: 'var(--line)' }}
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        </FadeIn>
      </header>

      <FadeIn delay={0.2}>
        <div className="px-5 sm:px-8 md:px-10 max-w-[1100px] mx-auto grid md:grid-cols-3 gap-3">
          <img src={p.images.a} alt="" className="w-full h-56 object-cover rounded-[30px]" />
          <img src={p.images.b} alt="" className="w-full h-56 object-cover rounded-[30px]" />
          <img src={p.images.tall} alt="" className="w-full h-56 object-cover rounded-[30px]" />
        </div>
      </FadeIn>

      <div className="px-5 sm:px-8 md:px-10 max-w-[760px] mx-auto py-20 space-y-12">
        {sections.map((s, i) => (
          <FadeIn key={s.label} delay={i * 0.05}>
            <div>
              <p className="text-muted uppercase tracking-[0.18em] text-xs font-light mb-3">
                {s.label}
              </p>
              <p className="text-ink font-light leading-relaxed text-lg">
                {s.body}
              </p>
            </div>
          </FadeIn>
        ))}
      </div>

      <div className="px-5 pb-24 text-center">
        <Link
          to="/#projects"
          className="inline-block rounded-full border-2 border-ink text-ink font-medium uppercase tracking-widest px-10 py-3.5 hover:bg-ink/10 hover:border-monitor transition-colors"
        >
          All projects
        </Link>
      </div>
    </main>
  )
}
