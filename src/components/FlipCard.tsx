import { useState } from 'react'
import { motion } from 'framer-motion'

/* ------------------------------------------------------------------ *
 *  The slanted flip card.
 *
 *  Two rotations doing different jobs: a fixed Z tilt that never changes,
 *  which is what makes it read as *placed* rather than laid out, and a Y
 *  rotation that carries the flip. Keeping the tilt constant through the
 *  flip is the whole trick — the card turns in a plane that is already
 *  off-axis, so it never looks like a CSS demo.
 *
 *  Tap works as well as hover, so this is not a desktop-only affordance.
 * ------------------------------------------------------------------ */

const TILT = -7 // degrees, constant
const EASE = [0.22, 1, 0.36, 1] as const

export default function FlipCard({
  src = `${import.meta.env.BASE_URL}img/portrait-placeholder.jpg`,
  alt = 'Rimsha Ahmed',
}: {
  src?: string
  alt?: string
}) {
  const [flipped, setFlipped] = useState(false)

  return (
    <div
      className="[perspective:1600px]"
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
    >
      <motion.button
        type="button"
        aria-label={flipped ? 'Show portrait' : 'Show details'}
        onClick={() => setFlipped((f) => !f)}
        initial={false}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.9, ease: EASE }}
        style={{
          transformStyle: 'preserve-3d',
          rotate: `${TILT}deg`,
        }}
        className="relative block h-[clamp(320px,42vw,410px)] w-[clamp(246px,32vw,316px)]
                   cursor-pointer border-0 bg-transparent p-0 text-left
                   focus-visible:outline focus-visible:outline-1
                   focus-visible:outline-offset-8 focus-visible:outline-[var(--line)]"
      >
        {/* ---------- front ---------- */}
        <div
          className="absolute inset-0 overflow-hidden border border-[var(--edge)]
                     [backface-visibility:hidden]"
          style={{
            boxShadow:
              '0 44px 90px -34px rgba(0,0,0,0.92), inset 0 0 0 1px rgba(255,255,255,0.02)',
          }}
        >
          <img
            src={src}
            alt={alt}
            loading="lazy"
            className="h-full w-full object-cover"
          />
          {/* grade the lower third so the name plate always has ground */}
          <div
            className="absolute inset-x-0 bottom-0 h-[46%]"
            style={{
              background:
                'linear-gradient(to top, rgba(8,9,10,0.95) 12%, rgba(8,9,10,0.55) 48%, transparent)',
            }}
          />
          <div className="absolute bottom-[22px] left-[24px] right-[24px]">
            <span className="display block text-[25px] leading-none">
              Rimsha Ahmed
            </span>
            <span className="label mt-[7px] block">Operations &amp; Data</span>
          </div>
        </div>

        {/* ---------- back ---------- */}
        <div
          className="absolute inset-0 flex flex-col justify-center gap-[13px]
                     border border-[var(--edge)] px-[30px] [backface-visibility:hidden]"
          style={{
            transform: 'rotateY(180deg)',
            background: 'linear-gradient(150deg, #131619 0%, #0A0B0D 100%)',
            boxShadow:
              '0 44px 90px -34px rgba(0,0,0,0.92), inset 0 0 0 1px rgba(255,255,255,0.02)',
          }}
        >
          <span className="label">Currently</span>
          <p className="text-[13.5px] leading-[1.75] text-muted">
            Chicago-based. Building forecasting and reporting tools that
            recovered $40K+ in revenue and cut reporting cycles from days to
            under thirty minutes.
          </p>
          <div className="rule my-[5px]" />
          <span className="label">Open to</span>
          <p className="text-[13.5px] leading-[1.75] text-muted">
            Analytics and operations roles.
          </p>
        </div>
      </motion.button>
    </div>
  )
}
