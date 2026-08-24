import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Link } from 'react-router-dom'
import FadeIn from '../components/FadeIn'
import { projects, type Project } from '../data/projects'

/**
 * Stacked project cards. The sticky-stack mechanic is kept — it's the one
 * piece of the old page that earned its keep — but the styling is stripped
 * back: hairline borders instead of 2px, a 2px corner radius instead of
 * 60px, and the metric set in mono so it reads as a figure rather than a
 * decorative number.
 */
export default function Projects() {
  const container = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start start', 'end end'],
  })

  return (
    <section id="projects" className="relative z-10 py-[14vh]">
      <div className="mx-auto max-w-[1180px] px-[6vw]">
        <FadeIn y={30}>
          <div className="mb-[7vh] flex items-baseline gap-[18px]">
            <span className="label">02</span>
            <div className="rule w-[clamp(40px,7vw,90px)]" />
            <span className="eyebrow">Selected work</span>
          </div>
        </FadeIn>
      </div>

      <div ref={container} className="px-[4vw]">
        {projects.map((p, i) => (
          <Card
            key={p.slug}
            project={p}
            index={i}
            total={projects.length}
            progress={scrollYProgress}
          />
        ))}
      </div>
    </section>
  )
}

function Card({
  project,
  index,
  total,
  progress,
}: {
  project: Project
  index: number
  total: number
  progress: any
}) {
  // Each card shrinks a touch as the next slides over it, so the stack has
  // depth rather than flat overlap.
  const targetScale = 1 - (total - 1 - index) * 0.025
  const range: [number, number] = [index / total, 1]
  const scale = useTransform(progress, range, [1, targetScale])

  return (
    <div className="sticky top-[12vh] flex h-[86vh] items-start justify-center">
      <motion.article
        style={{ scale, top: `${index * 22}px`, position: 'relative' }}
        className="group w-full max-w-[1180px] border border-[var(--edge)]
                   bg-surface p-[clamp(18px,2.6vw,34px)] transition-colors
                   duration-700 ease-lux hover:border-[var(--edge-strong)]"
      >
        {/* ---------- head ---------- */}
        <div className="mb-[26px] flex flex-wrap items-start justify-between gap-5">
          <div className="flex items-baseline gap-[22px]">
            <span className="label pt-[6px]">{project.index}</span>
            <div>
              <p className="eyebrow mb-[7px]">{project.category}</p>
              <h3 className="display text-[clamp(1.7rem,3.4vw,2.9rem)]">
                {project.name}
              </h3>
            </div>
          </div>

          <Link
            to={`/projects/${project.slug}`}
            className="relative inline-flex items-center gap-[11px] overflow-hidden
                       border border-[var(--edge-strong)] px-[22px] py-[11px] font-mono
                       text-[10.5px] uppercase tracking-[0.2em] text-ink no-underline
                       transition-colors duration-500 ease-lux hover:border-[var(--fill-2)]"
          >
            <span
              aria-hidden
              className="absolute inset-0 z-[1] translate-y-full bg-[var(--fill)]
                         transition-transform duration-[550ms] ease-lux
                         group-hover:translate-y-0"
            />
            <span className="relative z-[2]">View project</span>
            <span
              aria-hidden
              className="relative z-[2] h-[2.5px] w-[2.5px] rounded-full bg-[var(--line)]"
            />
          </Link>
        </div>

        {/* ---------- blurb + the number ---------- */}
        <div className="mb-[26px] flex flex-wrap items-end justify-between gap-6
                        border-t border-[var(--edge)] pt-[22px]">
          <p className="max-w-[62ch] text-[clamp(0.9rem,1.15vw,1rem)] leading-[1.8] text-muted">
            {project.blurb}
          </p>
          <div className="text-right">
            <div className="font-mono text-[clamp(1.5rem,2.4vw,2.1rem)] leading-none text-[var(--line-bright)]">
              {project.metric}
            </div>
            <div className="label mt-[9px]">{project.metricLabel}</div>
          </div>
        </div>

        {/* ---------- media ---------- */}
        <div className="grid grid-cols-1 gap-[10px] md:grid-cols-5">
          <div className="flex flex-col gap-[10px] md:col-span-2">
            <img
              src={project.images.a}
              alt=""
              loading="lazy"
              className="w-full border border-[var(--edge)] object-cover"
              style={{ height: 'clamp(100px, 11vw, 160px)' }}
            />
            <img
              src={project.images.b}
              alt=""
              loading="lazy"
              className="w-full border border-[var(--edge)] object-cover"
              style={{ height: 'clamp(120px, 15vw, 215px)' }}
            />
          </div>
          <div className="md:col-span-3">
            <img
              src={project.images.tall}
              alt=""
              loading="lazy"
              className="h-full w-full border border-[var(--edge)] object-cover"
              style={{ minHeight: 'clamp(170px, 26vw, 385px)' }}
            />
          </div>
        </div>

        {/* ---------- stack ---------- */}
        <div className="mt-[22px] flex flex-wrap items-center gap-x-[20px] gap-y-[8px]
                        border-t border-[var(--edge)] pt-[18px]">
          {project.stack.map((s) => (
            <span key={s} className="mono text-[9.5px] text-faint">
              {s}
            </span>
          ))}
        </div>
      </motion.article>
    </div>
  )
}
