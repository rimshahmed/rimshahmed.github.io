import FadeIn from '../components/FadeIn'
import AnimatedText from '../components/AnimatedText'
import { ContactButton } from '../components/Buttons'

const ABOUT_TEXT =
  "I'm an operations and data analyst in Chicago with a B.S. in Computer Information Systems. At SM Beauty I built the company's first structured BI reporting infrastructure from scratch — replacing ad hoc spreadsheets with Power BI models that cut report cycles from days to under thirty minutes. I cover three functions at once: logistics and QC, analytics, and demand planning. I like the part where a messy export becomes a tool someone actually opens every morning."

const FACTS = [
  'Chicago, IL',
  'B.S. Computer Information Systems',
  '3 functional areas, 1 role',
]

const DECOR = [
  {
    src: '/decor/orbit.svg',
    cls: 'w-[120px] sm:w-[160px] md:w-[210px] top-[4%] left-[1%] sm:left-[2%] md:left-[4%]',
    delay: 0.1,
    x: -80,
    float: 'float-a',
  },
  {
    src: '/decor/nodes.svg',
    cls: 'w-[100px] sm:w-[140px] md:w-[180px] bottom-[8%] left-[3%] sm:left-[6%] md:left-[10%]',
    delay: 0.25,
    x: -80,
    float: 'float-b',
  },
  {
    src: '/decor/shard.svg',
    cls: 'w-[120px] sm:w-[160px] md:w-[210px] top-[4%] right-[1%] sm:right-[2%] md:right-[4%]',
    delay: 0.15,
    x: 80,
    float: 'float-c',
  },
  {
    src: '/decor/bars.svg',
    cls: 'w-[130px] sm:w-[170px] md:w-[220px] bottom-[8%] right-[3%] sm:right-[6%] md:right-[10%]',
    delay: 0.3,
    x: 80,
    float: 'float-d',
  },
]

export default function About() {
  return (
    <section
      id="about"
      className="relative min-h-screen flex flex-col items-center justify-center px-5 sm:px-8 md:px-10 py-20"
    >
      <style>{`
        @keyframes floaty { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-8px,12px)} }
        .float-a{animation:floaty 7s ease-in-out infinite}
        .float-b{animation:floaty 8.5s ease-in-out infinite .8s}
        .float-c{animation:floaty 6.5s ease-in-out infinite .4s}
        .float-d{animation:floaty 9s ease-in-out infinite 1.2s}
      `}</style>

      {DECOR.map((d) => (
        <FadeIn
          key={d.src}
          delay={d.delay}
          x={d.x}
          y={0}
          duration={0.9}
          className={`absolute pointer-events-none ${d.cls}`}
        >
          <img src={d.src} alt="" aria-hidden="true" className={d.float} />
        </FadeIn>
      ))}

      <FadeIn y={40}>
        <h2
          className="hero-heading font-black uppercase leading-none tracking-tight text-center"
          style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
        >
          About me
        </h2>
      </FadeIn>

      <div className="mt-10 sm:mt-14 md:mt-16 flex flex-col items-center gap-8">
        <AnimatedText
          text={ABOUT_TEXT}
          className="text-ink font-medium text-center leading-relaxed max-w-[560px]"
          style={{ fontSize: 'clamp(1rem, 2vw, 1.35rem)' }}
        />

        <FadeIn delay={0.2}>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-muted uppercase font-light text-xs sm:text-sm tracking-[0.18em]">
            {FACTS.map((f, i) => (
              <span key={f} className="flex items-center gap-4 sm:gap-6">
                {f}
                {i < FACTS.length - 1 && (
                  <span
                    className="inline-block w-px h-4"
                    style={{ background: 'var(--line)' }}
                  />
                )}
              </span>
            ))}
          </div>
        </FadeIn>
      </div>

      <div className="mt-16 sm:mt-20 md:mt-24">
        <FadeIn delay={0.3}>
          <ContactButton />
        </FadeIn>
      </div>
    </section>
  )
}
