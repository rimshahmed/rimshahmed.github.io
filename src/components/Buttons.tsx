import type { ReactNode } from 'react'

/* ------------------------------------------------------------------ *
 *  One button, three sizes.
 *
 *  The whole treatment is: hairline box, small wide-tracked caps, and
 *  a fill that climbs up from the bottom edge on hover while the label
 *  inverts to near-black. No gradient, no glow, no purple.
 *
 *  The fill is --fill (a near-black green). Because it is so dark, the
 *  hover reads as the button quietly filling with shadow rather than
 *  switching colour — which is the restrained version of this move.
 * ------------------------------------------------------------------ */

type Size = 'sm' | 'md' | 'lg'

const SIZES: Record<Size, string> = {
  sm: 'px-[18px] py-[9px] text-[9.5px] tracking-[0.2em]',
  md: 'px-[22px] py-[11px] text-[10.5px] tracking-[0.2em]',
  lg: 'px-[30px] py-[14px] text-[11px] tracking-[0.22em]',
}

function Base({
  children,
  href,
  size = 'md',
  external = false,
  className = '',
}: {
  children: ReactNode
  href: string
  size?: Size
  external?: boolean
  className?: string
}) {
  return (
    <a
      href={href}
      {...(external ? { target: '_blank', rel: 'noreferrer noopener' } : {})}
      className={`group relative inline-flex items-center gap-[11px] overflow-hidden
        border border-[var(--edge-strong)] font-mono uppercase text-ink no-underline
        transition-[color,border-color] duration-500 ease-lux
        hover:border-[var(--fill-2)] ${SIZES[size]} ${className}`}
    >
      {/* the climbing fill */}
      <span
        aria-hidden
        className="absolute inset-0 z-[1] translate-y-full bg-[var(--fill)]
          transition-transform duration-[550ms] ease-lux group-hover:translate-y-0"
      />
      <span className="relative z-[2]">{children}</span>
      {/* the accent dot — the only piece of colour at rest */}
      <span
        aria-hidden
        className="relative z-[2] h-[2.5px] w-[2.5px] rounded-full bg-[var(--line)]
          transition-transform duration-500 ease-lux group-hover:scale-[1.9]"
      />
    </a>
  )
}

export function ContactButton({
  label = 'Contact me',
  href = 'mailto:rimshaa314@gmail.com',
  size = 'lg',
}: {
  label?: string
  href?: string
  size?: Size
}) {
  return (
    <Base href={href} size={size}>
      {label}
    </Base>
  )
}

export function GhostButton({
  children,
  href,
  size = 'md',
  external = false,
}: {
  children: ReactNode
  href: string
  size?: Size
  external?: boolean
}) {
  return (
    <Base href={href} size={size} external={external}>
      {children}
    </Base>
  )
}

/* A borderless variant for inline links inside body copy — just a label
   over a hairline that draws in on hover. Used for "view project" style
   affordances where a full box would be too much furniture. */
export function RuleLink({
  children,
  href,
  external = false,
}: {
  children: ReactNode
  href: string
  external?: boolean
}) {
  return (
    <a
      href={href}
      {...(external ? { target: '_blank', rel: 'noreferrer noopener' } : {})}
      className="group relative inline-flex items-center gap-[10px] py-[7px] font-mono
        text-[10.5px] uppercase tracking-[0.2em] text-ink no-underline"
    >
      <span className="relative z-[2]">{children}</span>
      <span
        aria-hidden
        className="relative z-[2] h-[2.5px] w-[2.5px] rounded-full bg-[var(--line)]
          transition-transform duration-500 ease-lux group-hover:translate-x-[4px]"
      />
      <span
        aria-hidden
        className="absolute bottom-0 left-0 h-px w-full bg-[var(--edge-strong)]"
      />
      <span
        aria-hidden
        className="absolute bottom-0 left-0 h-px w-full origin-left scale-x-0
          bg-[var(--line)] transition-transform duration-500 ease-lux
          group-hover:scale-x-100"
      />
    </a>
  )
}
