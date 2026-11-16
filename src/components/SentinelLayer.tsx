import { Suspense, lazy, useCallback, useEffect, useRef, useState } from 'react'
import {
  animate,
  cubicBezier,
  easeIn,
  easeOut,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from 'framer-motion'
import { scroll as scrollState } from '../lib/scroll'
import { requestScan, sentinel } from '../lib/sentinel'

const Sentinel = lazy(() => import('./Sentinel'))

/* ------------------------------------------------------------------ *
 *  Where 343 lives, and how he gets there.
 *
 *  He sits small in the top right through the hero and About, is gone
 *  through the work, and comes back once at contact as a sign-off.
 *
 *  He never fades. Every arrival and departure is travel:
 *
 *    load     flies in from beyond the right edge, small to full size
 *    exit     drifts down, then slides off the right edge
 *    contact  flies back in from the right edge and settles
 *
 *  Two nested transforms do this. The outer one is the one-time entry
 *  flight, which has to be time-based because scroll progress is 0 at
 *  load and stays there. The inner one is scroll-driven, off a single
 *  spring-smoothed progress value so position and scale stay in
 *  agreement and nothing tracks the scrollbar one-to-one.
 *
 *  The fixed parent has `contain: strict`. That includes paint
 *  containment, so parking him past the viewport edge is clipped and can
 *  never produce a horizontal scrollbar. Do not remove it.
 * ------------------------------------------------------------------ */

/* He leaves early and on purpose. By the time the project cards arrive he is
   already gone — a chrome sphere hovering over a revenue figure is the exact
   opposite of what we want. Hero and About get him; the work does not. */

/* progress ->            rest  drift  leaving  gone   gone   landed  hold
   X is a fraction of the off-screen distance, not of the viewport.        */
const P = /*         */ [0, 0.1, 0.2, 0.28, 0.86, 0.93, 1]
/* Phones: the page is far longer and there is no margin beside the copy, so
   the same fractions would park him on top of the About card. He leaves
   before it arrives and lands later, once the contact block is in place. */
const P_NARROW = /*  */ [0, 0.03, 0.06, 0.1, 0.9, 0.96, 1]
const NARROW = 640
const SLIDE_X = /*   */ [0, 0.03, 0.35, 1, 1, 0, 0]
const DRIFT_Y = /* vh */ [0, 0.1, 0.21, 0.28, 0.2, 0.13, 0.15]
/* CSS scale never goes above 1 — the canvas is rasterised at the element's
   box size, so anything past 1 is a magnified bitmap and goes soft. */
const SCALE = /*     */ [1, 0.93, 0.84, 0.74, 0.5, 1, 1]

/* Per-segment easing. The exit accelerates away; the return decelerates in,
   and only x is allowed to overshoot (a few px past rest, then back) — scale
   uses a plain ease-out so the settle can never push it past 1. */
const linear = (t: number) => t
const settle = cubicBezier(0.2, 1.25, 0.4, 1)
const X_EASE = [linear, easeIn, easeIn, linear, settle, linear]
const Y_EASE = [linear, linear, linear, linear, easeOut, linear]
const S_EASE = [linear, linear, linear, linear, easeOut, linear]

/* Thresholds, derived from whichever curve is live.
   Park/wake: when he is off-screen the canvas stops rendering — two
   thresholds per side so the flag cannot chatter while the spring settles.
   Landed/re-arm: "arrived at contact", with the re-arm point well below. */
const thresholds = (c: number[]) => ({
  parkAfter: c[3] + 0.015,
  wakeBelow: c[3] + 0.005,
  parkBefore: c[4] - 0.015,
  wakeAbove: c[4] - 0.005,
  landed: c[5] - 0.005,
  rearm: c[4],
  heroEnd: c[2],
  contactStart: c[5] - 0.03,
})

/* Entry flight. */
const ENTRY_SCALE = 0.55
const ENTRY_DURATION = 1.15

const REDUCED =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

const BASE = import.meta.env.BASE_URL

/* Warm the HTTP cache for the model and its decoder the moment this module
   loads, rather than waiting for the lazy Three chunk to arrive and ask.
   Plain <link rel=preload> so none of Three is pulled into the main bundle;
   all three are same-origin, so still no third-party request. */
if (typeof document !== 'undefined') {
  for (const href of [
    `${BASE}models/spark.glb`,
    `${BASE}draco/draco_wasm_wrapper.js`,
    `${BASE}draco/draco_decoder.wasm`,
  ]) {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = 'fetch'
    link.crossOrigin = 'anonymous'
    link.href = href
    document.head.appendChild(link)
  }
}

const viewport = () =>
  typeof window === 'undefined'
    ? { w: 1440, h: 900 }
    : { w: window.innerWidth, h: window.innerHeight }

/** The element's rendered width — mirrors the CSS clamp on the anchor. */
const elementSize = (w: number) => Math.min(206, Math.max(104, 0.135 * w))
/** How far right he has to travel to be fully clear of the viewport. */
const offscreen = (w: number) => 0.035 * w + elementSize(w) + 24

type Zone = 'hero' | 'away' | 'contact'

export default function SentinelLayer() {
  const { scrollYProgress } = useScroll()
  const [vp, setVp] = useState(viewport)
  const [ready, setReady] = useState(false)
  const [visible, setVisible] = useState(true)
  const [zone, setZone] = useState<Zone>('hero')

  useEffect(() => {
    const read = () => setVp(viewport())
    read()
    window.addEventListener('resize', read, { passive: true })
    return () => window.removeEventListener('resize', read)
  }, [])

  const X_OFF = offscreen(vp.w)
  const curve = vp.w < NARROW ? P_NARROW : P
  const th = useRef(thresholds(curve))
  th.current = thresholds(curve)
  const el = elementSize(vp.w)

  // Spring-smooth the driver, not each output — one source of lag, so the
  // position and scale stay in agreement with each other.
  const p = useSpring(scrollYProgress, {
    stiffness: 60,
    damping: 22,
    mass: 0.6,
    restDelta: 0.0005,
  })

  /* Publish scroll state to the render loop. Plain mutable fields rather
     than React state — see lib/scroll.ts. */
  const rawVelocity = useVelocity(scrollYProgress)
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    scrollState.progress = v
  })
  useMotionValueEvent(rawVelocity, 'change', (v) => {
    scrollState.velocity = Math.max(-2, Math.min(2, v))
  })

  /* ---- scroll-driven slide (inner) --------------------------------- */
  const x = useTransform(p, curve, SLIDE_X.map((f) => f * X_OFF), { ease: X_EASE })
  const y = useTransform(p, curve, DRIFT_Y.map((f) => f * vp.h), { ease: Y_EASE })
  const scale = useTransform(p, curve, SCALE, { ease: S_EASE })

  /* ---- one-time entry flight (outer) ------------------------------- */
  const entryX = useMotionValue(REDUCED ? 0 : X_OFF)
  const entryY = useMotionValue(REDUCED ? 0 : -0.035 * vp.h)
  const entryScale = useMotionValue(REDUCED ? 1 : ENTRY_SCALE)
  const entered = useRef(REDUCED)

  // Until the flight starts, keep him parked at the *current* off-screen
  // distance so a resize before the model resolves cannot strand him in view.
  useEffect(() => {
    if (!entered.current) entryX.set(X_OFF)
  }, [X_OFF, entryX])

  /* Fired by the 3D scene once the model has resolved and a real frame has
     been drawn — not on mount. Starting earlier means he pops into existence
     halfway through the flight. */
  const onReady = useCallback(() => setReady(true), [])

  useEffect(() => {
    if (!ready || entered.current) return
    entered.current = true
    const controls = [
      // x carries the settle: a slight overshoot past rest, then back.
      animate(entryX, 0, { duration: ENTRY_DURATION, ease: [0.16, 1.18, 0.3, 1] }),
      animate(entryY, 0, { duration: ENTRY_DURATION, ease: [0.22, 1, 0.36, 1] }),
      // Scale decelerates without overshoot, so it never passes 1.
      animate(entryScale, 1, {
        duration: ENTRY_DURATION * 0.9,
        ease: [0.22, 1, 0.36, 1],
        // First look around, the moment he has settled — but only if he is
        // actually on screen (a reload halfway down the page lands parked).
        onComplete: () => {
          const at = p.get()
          if (at < th.current.heroEnd / 2 || at > th.current.landed) requestScan()
        },
      }),
    ]
    return () => controls.forEach((c) => c.stop())
  }, [ready, entryX, entryY, entryScale, p])

  /* ---- travel, for the bank ---------------------------------------- */
  const vSlide = useVelocity(x)
  const vEntry = useVelocity(entryX)
  const publishTravel = () => {
    sentinel.travel = (vSlide.get() + vEntry.get()) / el
  }
  useMotionValueEvent(vSlide, 'change', publishTravel)
  useMotionValueEvent(vEntry, 'change', publishTravel)

  /* ---- thresholds off the spring ----------------------------------- *
     These are the only places progress touches React state, and each one
     changes a handful of times per page view, not per frame.            */
  const contactArmed = useRef(true)
  useMotionValueEvent(p, 'change', (v) => {
    // park / wake the canvas
    const k = th.current
    if (v > k.parkAfter && v < k.parkBefore) setVisible(false)
    else if (v < k.wakeBelow || v > k.wakeAbove) setVisible(true)

    // scan once each time he lands at contact
    if (v >= k.landed && contactArmed.current) {
      contactArmed.current = false
      if (!REDUCED && entered.current) requestScan()
    } else if (v < k.rearm) {
      contactArmed.current = true
    }

    // reduced motion swaps position on these instead of sliding
    setZone(v < k.heroEnd ? 'hero' : v > k.contactStart ? 'contact' : 'away')
  })

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-30"
      style={{ contain: 'strict' }}
    >
      {/* Anchor. Sits lower on phones so it clears the wrapped nav. */}
      <div
        className="absolute right-[3.5vw] top-[13vh] h-[clamp(104px,13.5vw,206px)]
                   w-[clamp(104px,13.5vw,206px)] sm:top-[8vh]"
      >
        {/* outer — entry flight, runs once */}
        <motion.div
          className="h-full w-full will-change-transform"
          style={
            REDUCED
              ? undefined
              : { x: entryX, y: entryY, scale: entryScale }
          }
        >
          {/* inner — scroll-driven drift and slide */}
          <motion.div
            className="h-full w-full will-change-transform"
            style={
              REDUCED
                ? {
                    // No travel at all: present in the hero, absent through
                    // the work, present again at contact — swapped instantly.
                    visibility: zone === 'away' ? 'hidden' : 'visible',
                    y: zone === 'contact' ? DRIFT_Y[6] * vp.h : 0,
                  }
                : { x, y, scale, transformOrigin: 'center center' }
            }
          >
            <Suspense fallback={null}>
              <Sentinel
                active={REDUCED ? zone !== 'away' : visible}
                onReady={onReady}
              />
            </Suspense>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
