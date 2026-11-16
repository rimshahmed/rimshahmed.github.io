/**
 * Shared sentinel state — the channel between <SentinelLayer /> (which knows
 * where he is on the page) and the 3D render loop (which decides what his
 * body does about it).
 *
 * Same reasoning as lib/scroll.ts and lib/mouse.ts: plain mutable fields,
 * written from motion-value listeners and read inside useFrame, so nothing
 * here ever re-renders React.
 */
export const sentinel = {
  /**
   * Scan requests. The layer bumps this when he lands — once after the entry
   * flight settles, once on arrival at contact — and the render loop starts a
   * scan whenever it sees the number change. A counter rather than a boolean
   * so a request can never be missed or double-read.
   */
  scanRequests: 0,
  /**
   * Lateral travel across the viewport, in element-widths per second.
   * Negative is moving left (arriving), positive is moving right (leaving).
   * The render loop banks him into it, so a slide reads as flight rather
   * than as a sprite being dragged.
   */
  travel: 0,
  /** Frames the render loop has drawn. Only read by verification scripts. */
  frames: 0,
}

export function requestScan() {
  sentinel.scanRequests += 1
}
