import { Suspense, lazy, useEffect, useState } from 'react'
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from 'framer-motion'
import { scroll as scrollState } from '../lib/scroll'

const Sentinel = lazy(() => import('./Sentinel'))

/* ------------------------------------------------------------------ *
 *  Where 343 lives now.
 *
 *  He is no longer the subject of the hero. He sits small in the top
 *  right, drifts down and dims as you read, disappears entirely through
 *  the middle of the page, and comes back once at the very bottom as a
 *  sign-off.
 *
 *  The layer is `fixed`, so "following down the page" is a drift down
 *  the viewport rather than a scroll-away. Everything is driven off a
 *  single spring-smoothed scroll progress value, which keeps the motion
 *  from tracking the scrollbar one-to-one — that one-to-one feel is what
 *  makes most scroll effects read as cheap.
 * ------------------------------------------------------------------ */

/* He leaves early and on purpose. By the time the project cards arrive he is
   already gone — a 250px chrome sphere hovering over a revenue figure is the
   exact opposite of what we want. Hero and About get him; the work does not. */

/* progress ->                 in    drift  receding  gone  gone  return  hold */
const P = /*              */ [0, 0.1, 0.2, 0.29, 0.88, 0.95, 1]
const OPACITY = /*        */ [1, 0.94, 0.55, 0, 0, 0.9, 0.9]
const DRIFT_Y = /*   × vh */ [0, 0.1, 0.21, 0.3, 0.1, 0.13, 0.15]
const DRIFT_X = /*   × vw */ [0, 0.008, 0.016, 0.024, 0.016, 0.006, 0.006]
const SCALE = /*          */ [1, 0.93, 0.84, 0.74, 0.62, 0.8, 0.8]

const REDUCED =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

export default function SentinelLayer() {
  const { scrollYProgress } = useScroll()
  const [vp, setVp] = useState({ w: 1440, h: 900 })

  useEffect(() => {
    const read = () => setVp({ w: window.innerWidth, h: window.innerHeight })
    read()
    window.addEventListener('resize', read, { passive: true })
    return () => window.removeEventListener('resize', read)
  }, [])

  // Spring-smooth the driver, not each output — one source of lag, so the
  // opacity, position and scale stay in agreement with each other.
  const p = useSpring(scrollYProgress, {
    stiffness: 60,
    damping: 22,
    mass: 0.6,
    restDelta: 0.0005,
  })

  /* Publish scroll state to the render loop. The 3D scene uses progress to
     decide how far to turn inward, and velocity for the slight brace when
     the page is moving quickly. Both are plain mutable fields rather than
     React state — see lib/scroll.ts. */
  const rawVelocity = useVelocity(scrollYProgress)
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    scrollState.progress = v
  })
  useMotionValueEvent(rawVelocity, 'change', (v) => {
    scrollState.velocity = Math.max(-2, Math.min(2, v))
  })

  const opacity = useTransform(p, P, OPACITY)
  const y = useTransform(p, P, DRIFT_Y.map((f) => f * vp.h))
  const x = useTransform(p, P, DRIFT_X.map((f) => f * vp.w))
  const scale = useTransform(p, P, SCALE)

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-30"
      style={{ contain: 'strict' }}
    >
      <motion.div
        /* Sits lower on phones so it clears the wrapped nav. */
        className="absolute right-[3.5vw] top-[13vh] h-[clamp(104px,13.5vw,206px)]
                   w-[clamp(104px,13.5vw,206px)] will-change-transform sm:top-[8vh]"
        style={
          REDUCED
            ? { opacity: 1 }
            : { opacity, x, y, scale, transformOrigin: 'center center' }
        }
      >
        <Suspense fallback={null}>
          <Sentinel />
        </Suspense>
      </motion.div>
    </div>
  )
}
