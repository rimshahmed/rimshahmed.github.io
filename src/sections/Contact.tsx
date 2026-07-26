import FadeIn from '../components/FadeIn'
import { ContactButton } from '../components/Buttons'

const LINKS = [
  { label: 'Email', value: 'rimshaa314@gmail.com', href: 'mailto:rimshaa314@gmail.com' },
  {
    label: 'LinkedIn',
    value: 'in/rimsha-ahmed-997163223',
    href: 'https://linkedin.com/in/rimsha-ahmed-997163223',
  },
  { label: 'Résumé', value: 'Download PDF', href: '/Rimsha_Ahmed_Resume.pdf' },
]

export default function Contact() {
  return (
    <section
      id="contact"
      className="min-h-[60vh] flex flex-col items-center justify-center px-5 sm:px-8 md:px-10 py-24"
    >
      <FadeIn y={40}>
        <h2
          className="hero-heading font-black uppercase leading-none tracking-tight text-center"
          style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
        >
          Let's talk
        </h2>
      </FadeIn>

      <div className="mt-12 flex flex-col sm:flex-row items-center gap-8 sm:gap-14">
        {LINKS.map((l, i) => (
          <FadeIn key={l.label} delay={0.1 + i * 0.08}>
            <a href={l.href} className="group block text-center sm:text-left">
              <span className="block text-muted uppercase tracking-[0.18em] text-[11px] font-light mb-1">
                {l.label}
              </span>
              <span className="text-ink font-light text-lg sm:text-xl relative">
                {l.value}
                <span
                  className="absolute left-0 -bottom-1 h-px w-0 group-hover:w-full transition-all duration-400"
                  style={{ background: 'var(--monitor)' }}
                />
              </span>
            </a>
          </FadeIn>
        ))}
      </div>

      <div className="mt-14">
        <FadeIn delay={0.35}>
          <ContactButton />
        </FadeIn>
      </div>

      <p className="mt-20 text-muted font-light text-xs uppercase tracking-[0.16em] text-center">
        © 2026 Rimsha Ahmed · Built from scratch in React ·{' '}
        <a
          href="https://github.com/"
          className="hover:text-ink transition-colors"
        >
          Source on GitHub →
        </a>
      </p>
    </section>
  )
}
