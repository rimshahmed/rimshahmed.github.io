/**
 * Shared scroll state, written once per frame by <SentinelLayer /> and read
 * inside the 3D animation loop.
 *
 * Same reasoning as lib/mouse.ts: this changes on every scroll event, and
 * routing it through React state would re-render the tree dozens of times a
 * second for a value only the render loop cares about.
 */
export const scroll = {
  /** 0 at the top of the document, 1 at the bottom. */
  progress: 0,
  /** Signed, roughly -1..1. Positive means scrolling down. Decays to 0. */
  velocity: 0,
}
