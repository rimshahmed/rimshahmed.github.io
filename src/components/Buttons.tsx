import type { ReactNode } from 'react'
import Magnet from './Magnet'

export function ContactButton({
  label = 'Contact Me',
  href = 'mailto:rimshaa314@gmail.com',
}: {
  label?: string
  href?: string
}) {
  return (
    <Magnet padding={80} strength={5}>
      <a
        href={href}
        className="inline-block rounded-full text-white font-medium uppercase tracking-widest px-8 py-3 sm:px-10 sm:py-3.5 md:px-12 md:py-4 text-xs sm:text-sm md:text-base"
        style={{
          background:
            'linear-gradient(123deg, #18011F 7%, #B600A8 37%, #7621B0 72%, #BE4C00 100%)',
          boxShadow:
            '0px 4px 4px rgba(181, 1, 167, 0.25), 4px 4px 12px #7721B1 inset',
          outline: '2px solid #fff',
          outlineOffset: '-3px',
        }}
      >
        {label}
      </a>
    </Magnet>
  )
}

export function GhostButton({
  children,
  href,
}: {
  children: ReactNode
  href: string
}) {
  return (
    <a
      href={href}
      className="inline-block rounded-full border-2 border-ink text-ink font-medium uppercase tracking-widest px-8 py-3 sm:px-10 sm:py-3.5 text-sm sm:text-base transition-colors duration-300 hover:bg-ink/10 hover:border-monitor"
    >
      {children}
    </a>
  )
}
