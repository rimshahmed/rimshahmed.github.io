import FadeIn from '../components/FadeIn'
import { attention } from '../lib/attention'

export default function Interests() {
  return (
    <section id="interests" className="px-5 sm:px-8 md:px-10 py-24">
      <FadeIn y={40}>
        <h2
          className="hero-heading font-black uppercase leading-none tracking-tight text-center mb-16"
          style={{ fontSize: 'clamp(2.2rem, 8vw, 110px)' }}
        >
          Interests &amp; what's next
        </h2>
      </FadeIn>

      <div className="max-w-[1000px] mx-auto grid md:grid-cols-2 gap-10 md:gap-16">
        <FadeIn delay={0.1}>
          <p className="text-muted uppercase tracking-[0.18em] text-xs font-light mb-4">
            Interests
          </p>
          <p className="text-ink font-light leading-relaxed text-lg">
            I'm drawn to data analytics because it's problem-solving with
            receipts — finding the answer <em>and</em> building the tool that
            scales it to a whole team. Outside of work: local pickup volleyball,
            and video games.{' '}
            <span
              className="cursor-default transition-colors duration-300 hover:text-monitor"
              onMouseEnter={() => (attention.on = true)}
              onMouseLeave={() => (attention.on = false)}
            >
              (Yes, that's a Guilty Spark cameo up top. He's here to help.)
            </span>
          </p>
        </FadeIn>

        <FadeIn delay={0.2}>
          <p className="text-muted uppercase tracking-[0.18em] text-xs font-light mb-4">
            What's next
          </p>
          <p className="text-ink font-light leading-relaxed text-lg">
            Turning the sales lead tool into a fully scripted, automated
            pipeline — and building it out as a standalone app so other small
            sales teams can use it.
          </p>
        </FadeIn>
      </div>
    </section>
  )
}
