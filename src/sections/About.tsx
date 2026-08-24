import FadeIn from '../components/FadeIn'
import FlipCard from '../components/FlipCard'
import { RuleLink } from '../components/Buttons'

const FACTS = [
  ['Based', 'Chicago, IL'],
  ['Studied', 'B.S. Computer Information Systems'],
  ['Covering', 'Logistics · Analytics · Demand planning'],
]

export default function About() {
  return (
    <section
      id="about"
      className="relative mx-auto flex min-h-screen max-w-[1180px] flex-col
                 justify-center px-[6vw] py-[14vh]"
    >
      <FadeIn y={30}>
        <div className="mb-[7vh] flex items-baseline gap-[18px]">
          <span className="label">01</span>
          <div className="rule w-[clamp(40px,7vw,90px)]" />
          <span className="eyebrow">About</span>
        </div>
      </FadeIn>

      <div className="grid grid-cols-1 items-center gap-[9vh] md:grid-cols-[auto_1fr] md:gap-[7vw]">
        {/* ---------------- the card ---------------- */}
        <FadeIn x={-40} duration={1}>
          <div className="flex justify-center md:justify-start md:pl-[2vw]">
            <FlipCard />
          </div>
        </FadeIn>

        {/* ---------------- the words ---------------- */}
        <div>
          <FadeIn y={30} delay={0.12}>
            <h2 className="display mb-[34px] text-[clamp(2.4rem,5.2vw,4.4rem)]">
              A messy export
              <br />
              becomes a <em>tool</em>
            </h2>
          </FadeIn>

          <FadeIn y={24} delay={0.2}>
            <p className="max-w-[54ch] text-[clamp(0.95rem,1.25vw,1.075rem)] leading-[1.85] text-muted">
              I&apos;m an operations and data analyst in Chicago. At SM Beauty I
              built the company&apos;s first structured BI reporting
              infrastructure from scratch — replacing ad hoc spreadsheets with
              Power BI models that cut report cycles from days to under thirty
              minutes. I cover three functions at once: logistics and QC,
              analytics, and demand planning.
            </p>
          </FadeIn>

          <FadeIn y={24} delay={0.3}>
            <dl className="mt-[42px] flex flex-col gap-[2px]">
              {FACTS.map(([k, v]) => (
                <div
                  key={k}
                  className="flex flex-wrap items-baseline gap-x-[22px] gap-y-1
                             border-t border-[var(--edge)] py-[14px]"
                >
                  <dt className="label w-[74px] shrink-0">{k}</dt>
                  <dd className="text-[13.5px] text-ink">{v}</dd>
                </div>
              ))}
            </dl>
          </FadeIn>

          <FadeIn y={20} delay={0.4}>
            <div className="mt-[34px]">
              <RuleLink href="#projects">See the work</RuleLink>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}
