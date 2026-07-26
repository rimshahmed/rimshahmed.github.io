import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

/**
 * Character-by-character scroll reveal. Every character starts at 20% opacity
 * and brightens as the paragraph passes through the viewport.
 *
 * Each character is rendered twice: once invisible (to hold the layout, so
 * text wraps normally) and once absolutely positioned on top (the animated
 * copy). That avoids any reflow while animating.
 */
export default function AnimatedText({
  text,
  className,
  style,
}: {
  text: string
  className?: string
  style?: React.CSSProperties
}) {
  const ref = useRef<HTMLParagraphElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.8', 'end 0.2'],
  })

  // Split into WORDS first, then characters inside each word. If we split the
  // whole string into loose inline-blocks, the browser is free to break a line
  // between any two letters — you get "e / xport". Wrapping each word in a
  // nowrap span keeps normal word wrapping.
  const words = text.split(' ')
  const total = text.length
  let cursor = 0

  return (
    <p ref={ref} className={className} style={style}>
      {words.map((word, wi) => {
        const start = cursor
        cursor += word.length + 1 // +1 for the space that follows
        return (
          <span
            key={wi}
            style={{ display: 'inline-block', whiteSpace: 'nowrap' }}
          >
            {word.split('').map((c, ci) => (
              <Char
                key={ci}
                char={c}
                progress={scrollYProgress}
                range={[(start + ci) / total, (start + ci + 1) / total]}
              />
            ))}
            {wi < words.length - 1 && ' '}
          </span>
        )
      })}
    </p>
  )
}

function Char({
  char,
  progress,
  range,
}: {
  char: string
  progress: any
  range: [number, number]
}) {
  const opacity = useTransform(progress, range, [0.2, 1])
  return (
    <span style={{ position: 'relative', display: 'inline-block' }}>
      <span style={{ opacity: 0 }}>{char === ' ' ? ' ' : char}</span>
      <motion.span
        style={{ position: 'absolute', left: 0, top: 0, opacity }}
        aria-hidden="true"
      >
        {char === ' ' ? ' ' : char}
      </motion.span>
    </span>
  )
}
