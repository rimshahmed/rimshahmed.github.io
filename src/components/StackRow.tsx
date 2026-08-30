import { ICON_PATHS, STACK_ICONS } from './ToolIcons'

/* ------------------------------------------------------------------ *
 *  Tool icons.
 *
 *  Monochrome at rest so six saturated brand palettes don't land on a
 *  page built to avoid them; the icon warms to sage on hover and its
 *  name slides in beside it.
 *
 *  That label is not decoration. Several of these glyphs are drawn
 *  rather than official — Microsoft doesn't license Power BI's mark for
 *  icon sets — so without a name on hover, "ascending bars" could be any
 *  BI tool on the market. The hover both prettifies and disambiguates.
 * ------------------------------------------------------------------ */

export default function StackRow({
  stack,
  size = 18,
}: {
  stack: string[]
  size?: number
}) {
  return (
    <ul className="flex flex-wrap items-center gap-x-[18px] gap-y-[12px]">
      {stack.map((tool) => {
        const key = STACK_ICONS[tool]
        const path = key ? ICON_PATHS[key] : undefined

        // Anything without a glyph falls back to the old mono label, so
        // adding a new tool to a project never renders an empty gap.
        if (!path) {
          return (
            <li key={tool} className="mono text-[9.5px] text-faint">
              {tool}
            </li>
          )
        }

        return (
          <li key={tool} className="group/icon flex items-center">
            <svg
              role="img"
              aria-label={tool}
              viewBox="0 0 24 24"
              width={size}
              height={size}
              className="shrink-0 fill-[var(--muted,#8D949E)] opacity-70
                         transition-[fill,opacity] duration-500 ease-lux
                         group-hover/icon:fill-[var(--line)]
                         group-hover/icon:opacity-100"
            >
              <path d={path} />
            </svg>
            {/* Width animates from 0 so the row doesn't reflow on hover —
                the label grows into space it takes from nothing. */}
            <span
              aria-hidden
              className="mono block max-w-0 overflow-hidden whitespace-nowrap
                         text-[9px] text-[var(--line)] opacity-0
                         transition-all duration-500 ease-lux
                         group-hover/icon:ml-[8px] group-hover/icon:max-w-[140px]
                         group-hover/icon:opacity-100"
            >
              {tool}
            </span>
          </li>
        )
      })}
    </ul>
  )
}
