import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Link } from 'react-router-dom'
import FadeIn from '../components/FadeIn'
import { projects, type Project } from '../data/projects'

export default function Projects() {
  const container = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start start', 'end end'],
  })

  return (
    <section
      id="projects"
      className="relative z-10 -mt-10 sm:-mt-12 md:-mt-14 rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] pt-20 pb-40"
      style={{ background: 'var(--bg)' }}
    >
      <FadeIn y={40}>
        <h2
          className="hero-heading font-black uppercase leading-none tracking-tight text-center mb-16"
          style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
        >
          Projects
        </h2>
      </FadeIn>

      <div ref={container} className="px-4 sm:px-6 md:px-10">
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
  // Each card shrinks slightly as the next one slides over it,
  // so the stack has visible depth instead of flat overlap.
  const targetScale = 1 - (total - 1 - index) * 0.03
  const range: [number, number] = [index / total, 1]
  const scale = useTransform(progress, range, [1, targetScale])

  return (
    <div className="h-[85vh] flex items-start justify-center sticky top-24 md:top-32">
      <motion.article
        style={{ scale, top: `${index * 28}px`, position: 'relative' }}
        className="w-full max-w-[1200px] rounded-[40px] sm:rounded-[50px] md:rounded-[60px] border-2 p-4 sm:p-6 md:p-8 transition-colors duration-500 hover:border-monitor"
        // eslint-disable-next-line react/forbid-dom-props
      >
        <div
          className="absolute inset-0 rounded-[40px] sm:rounded-[50px] md:rounded-[60px] -z-10"
          style={{ background: 'var(--surface)', border: '2px solid var(--line)' }}
        />

        {/* Top row */}
        <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
          <div className="flex items-baseline gap-5">
            <span
              className="hero-heading font-black leading-none"
              style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}
            >
              {project.index}
            </span>
            <div>
              <p className="text-muted uppercase tracking-[0.18em] text-xs sm:text-sm font-light">
                {project.category}
              </p>
              <h3 className="text-ink font-semibold uppercase tracking-tight text-2xl sm:text-3xl md:text-4xl">
                {project.name}
              </h3>
            </div>
          </div>

          <Link
            to={`/projects/${project.slug}`}
            className="rounded-full border-2 border-ink text-ink font-medium uppercase tracking-widest px-8 py-3 sm:px-10 sm:py-3.5 text-sm sm:text-base transition-colors duration-300 hover:bg-ink/10 hover:border-monitor"
          >
            View Project
          </Link>
        </div>

        {/* Impact */}
        <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
          <p className="text-ink font-light max-w-[640px] leading-snug text-sm sm:text-base">
            {project.blurb}
          </p>
          <div className="text-right">
            <div
              className="font-semibold"
              style={{
                color: 'var(--monitor)',
                fontSize: 'clamp(1.8rem, 3vw, 2.6rem)',
                lineHeight: 1,
              }}
            >
              {project.metric}
            </div>
            <div className="text-muted uppercase tracking-[0.18em] text-[11px] mt-1 font-light">
              {project.metricLabel}
            </div>
          </div>
        </div>

        {/* Media */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 sm:gap-4">
          <div className="md:col-span-2 flex flex-col gap-3 sm:gap-4">
            <img
              src={project.images.a}
              alt=""
              loading="lazy"
              className="w-full object-cover rounded-[30px] sm:rounded-[40px] md:rounded-[50px]"
              style={{ height: 'clamp(110px, 12vw, 175px)' }}
            />
            <img
              src={project.images.b}
              alt=""
              loading="lazy"
              className="w-full object-cover rounded-[30px] sm:rounded-[40px] md:rounded-[50px]"
              style={{ height: 'clamp(130px, 16vw, 235px)' }}
            />
          </div>
          <div className="md:col-span-3">
            <img
              src={project.images.tall}
              alt=""
              loading="lazy"
              className="w-full h-full object-cover rounded-[30px] sm:rounded-[40px] md:rounded-[50px]"
              style={{ minHeight: 'clamp(180px, 28vw, 425px)' }}
            />
          </div>
        </div>

        {/* Stack */}
        <div className="flex flex-wrap gap-2 mt-5">
          {project.stack.map((s) => (
            <span
              key={s}
              className="rounded-full border px-4 py-1.5 text-[11px] uppercase tracking-[0.16em] text-muted font-light"
              style={{ borderColor: 'var(--line)' }}
            >
              {s}
            </span>
          ))}
        </div>
      </motion.article>
    </div>
  )
}
