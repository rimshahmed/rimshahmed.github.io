import FadeIn from '../components/FadeIn'
import { attention } from '../lib/attention'

export default function Interests() {
  return (
    <section
      id="interests"
      className="mx-auto max-w-[1180px] px-[6vw] py-[14vh]"
    >
      <FadeIn y={30}>
        <div className="mb-[7vh] flex items-baseline gap-[18px]">
          <span className="label">04</span>
          <div className="rule w-[clamp(40px,7vw,90px)]" />
          <span className="eyebrow">Interests &amp; what&apos;s next</span>
        </div>
      </FadeIn>

      <div className="grid gap-[7vh] md:grid-cols-2 md:gap-[7vw]">
        <FadeIn delay={0.08} y={26}>
          <p className="label mb-[20px]">Interests</p>
          <p className="text-[clamp(0.95rem,1.25vw,1.075rem)] leading-[1.85] text-muted">
            I&apos;m drawn to data analytics because it&apos;s problem-solving
            with receipts — finding the answer <em>and</em> building the tool
            that scales it to a whole team. Outside of work: local pickup
            volleyball, and video games.{' '}
            <span
              className="cursor-default text-ink transition-colors duration-500
                         ease-lux hover:text-[var(--eye)]"
              onMouseEnter={() => (attention.on = true)}
              onMouseLeave={() => (attention.on = false)}
            >
              (Yes, that&apos;s a Guilty Spark cameo in the corner. He&apos;s
              here to help.)
            </span>
          </p>
        </FadeIn>

        <FadeIn delay={0.16} y={26}>
          <p className="label mb-[20px]">What&apos;s next</p>
          <p className="text-[clamp(0.95rem,1.25vw,1.075rem)] leading-[1.85] text-muted">
            Turning the sales lead tool into a fully scripted, automated
            pipeline — and building it out as a standalone app so other small
            sales teams can use it.
          </p>
        </FadeIn>
      </div>
    </section>
  )
}
