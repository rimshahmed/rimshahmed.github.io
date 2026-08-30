import { useState } from 'react'

const COMMENT_PREFIX: Record<string, string[]> = {
  sql: ['--'],
  python: ['#'],
  powerquery: ['//'],
}

/* ------------------------------------------------------------------ *
 *  A deliberately plain code block.
 *
 *  No syntax highlighting library. Six token colours would undo the
 *  restraint the rest of the page is built on, and a highlighter is
 *  ~40KB to make keywords purple. Comments dimming to the faint tone is
 *  enough hierarchy to read twelve lines by — and the comments are where
 *  the reasoning lives, so they are the part worth separating.
 * ------------------------------------------------------------------ */
export default function CodeBlock({
  lang,
  label,
  code,
}: {
  lang: string
  label: string
  code: string
}) {
  const [copied, setCopied] = useState(false)
  const prefixes = COMMENT_PREFIX[lang] ?? ['#']

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch {
      /* clipboard blocked — the text is selectable anyway */
    }
  }

  return (
    <figure className="mt-[30px]">
      <figcaption className="mb-[12px] flex flex-wrap items-center justify-between gap-3">
        <span className="label">{label}</span>
        <button
          type="button"
          onClick={copy}
          className="mono cursor-pointer border-0 bg-transparent p-0 text-[9px]
                     text-faint transition-colors duration-500 ease-lux
                     hover:text-[var(--line)]"
        >
          {copied ? 'Copied' : 'Copy'}
        </button>
      </figcaption>

      <pre className="code">
        <code>
          {code.split('\n').map((line, i) => {
            const trimmed = line.trimStart()
            const isComment = prefixes.some((p) => trimmed.startsWith(p))
            return (
              <span key={i} className={isComment ? 'cm' : undefined}>
                {line}
                {'\n'}
              </span>
            )
          })}
        </code>
      </pre>
    </figure>
  )
}
