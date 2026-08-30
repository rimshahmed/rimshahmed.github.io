import { useEffect, useRef, useState } from 'react'

/* ------------------------------------------------------------------ *
 *  Project media.
 *
 *  Takes a still and, optionally, a short screen recording. If a clip is
 *  supplied it plays muted on loop; otherwise the still stands in, so
 *  the page is never broken by a missing file and clips can be added one
 *  project at a time.
 *
 *  Deliberately not a GIF. A GIF of a dashboard is several megabytes and
 *  capped at 256 colours, which makes careful work look cheap. An MP4 of
 *  the same clip is roughly a tenth the size and actually sharp.
 *
 *  Playback only starts once the element is on screen, and stops when it
 *  leaves — three autoplaying videos decoding continuously behind a
 *  sticky card stack is a real battery cost on a laptop.
 * ------------------------------------------------------------------ */

export default function ProjectMedia({
  src,
  video,
  alt = '',
  className = '',
  style,
}: {
  src: string
  video?: string
  alt?: string
  className?: string
  style?: React.CSSProperties
}) {
  const ref = useRef<HTMLVideoElement>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || !video || failed) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // play() rejects on some browsers until the user interacts; that
          // is not an error worth surfacing, the poster simply stays up.
          void el.play().catch(() => {})
        } else {
          el.pause()
        }
      },
      { threshold: 0.15 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [video, failed])

  if (!video || failed) {
    return (
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className={className}
        style={style}
      />
    )
  }

  return (
    <video
      ref={ref}
      poster={src}
      muted
      loop
      playsInline
      preload="metadata"
      aria-label={alt || undefined}
      onError={() => setFailed(true)}
      className={className}
      style={style}
    >
      <source src={video} type="video/mp4" />
    </video>
  )
}
