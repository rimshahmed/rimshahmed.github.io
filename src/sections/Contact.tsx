import FadeIn from '../components/FadeIn'
import { ContactButton } from '../components/Buttons'

const LINKS = [
  {
    label: 'Email',
    value: 'rimshaa314@gmail.com',
    href: 'mailto:rimshaa314@gmail.com',
  },
  {
    label: 'LinkedIn',
    value: 'in/rimsha-ahmed-997163223',
    href: 'https://linkedin.com/in/rimsha-ahmed-997163223',
  },
  {
    label: 'Résumé',
    value: 'Download PDF',
    href: `${import.meta.env.BASE_URL}Rimsha_Ahmed_Resume.pdf`,
  },
]

export default function Contact() {
  return (
    <section
      id="contact"
      className="mx-auto max-w-[1180px] px-[6vw] pb-[8vh] pt-[14vh]"
    >
      <FadeIn y={30}>
        <div className="mb-[7vh] flex items-baseline gap-[18px]">
          <span className="label">05</span>
          <div className="rule w-[clamp(40px,7vw,90px)]" />
          <span className="eyebrow">Contact</span>
        </div>
      </FadeIn>

      <FadeIn y={34}>
        <h2 className="display max-w-[15ch] text-[clamp(2.8rem,8vw,7rem)]">
          Let&apos;s <em>talk</em>
        </h2>
      </FadeIn>

      <FadeIn y={24} delay={0.12}>
        <p className="mt-[30px] max-w-[46ch] text-[clamp(0.95rem,1.25vw,1.075rem)] leading-[1.85] text-muted">
          Open to analytics and operations roles. The fastest way to reach me is
          email — I answer everything.
        </p>
      </FadeIn>

      <div className="mt-[8vh] grid grid-cols-1 sm:grid-cols-3">
        {LINKS.map((l, i) => (
          <FadeIn key={l.label} delay={0.16 + i * 0.08}>
            <a
              href={l.href}
              {...(l.href.startsWith('http')
                ? { target: '_blank', rel: 'noreferrer noopener' }
                : {})}
              className="group block border-t border-[var(--edge)] py-[22px] pr-6
                         transition-colors duration-500 ease-lux
                         hover:border-[var(--line)]"
            >
              <span className="label mb-[10px] block">{l.label}</span>
              <span className="relative inline-block text-[15px] text-ink">
                {l.value}
                <span
                  aria-hidden
                  className="absolute -bottom-[3px] left-0 h-px w-full origin-left
                             scale-x-0 bg-[var(--line)] transition-transform
                             duration-500 ease-lux group-hover:scale-x-100"
                />
              </span>
            </a>
          </FadeIn>
        ))}
      </div>

      <FadeIn delay={0.4}>
        <div className="mt-[7vh]">
          <ContactButton label="Email me" />
        </div>
      </FadeIn>

      <p className="mono mt-[12vh] border-t border-[var(--edge)] pt-[22px] text-[9.5px] text-faint">
        © 2026 Rimsha Ahmed · Built from scratch in React
      </p>
    </section>
  )
}
