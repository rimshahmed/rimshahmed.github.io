/**
 * One shared, mutable record of where the cursor is.
 *
 * Why a plain module object instead of React state: this updates on every
 * mousemove. Putting it in state would re-render the whole tree ~60x/second.
 * Instead the 3D scene reads `mouse.x / mouse.y` inside its animation frame,
 * and <CursorLight /> writes CSS variables directly to the DOM. No re-renders.
 */
export const mouse = {
  /** -1 (left edge) .. 1 (right edge) */
  x: 0,
  /** -1 (top edge) .. 1 (bottom edge) */
  y: 0,
  /** px, for CSS */
  px: 0,
  py: 0,
  /** performance.now() of the last real movement — used for the idle scan */
  lastMove: 0,
  /** true once we've seen any mousemove (false on touch devices) */
  active: false,
}

export function attachMouseTracking() {
  const onMove = (e: MouseEvent) => {
    mouse.px = e.clientX
    mouse.py = e.clientY
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1
    mouse.y = (e.clientY / window.innerHeight) * 2 - 1
    mouse.lastMove = performance.now()
    mouse.active = true
  }
  window.addEventListener('mousemove', onMove, { passive: true })
  return () => window.removeEventListener('mousemove', onMove)
}
