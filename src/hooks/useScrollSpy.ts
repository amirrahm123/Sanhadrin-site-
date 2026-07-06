import { useEffect, useState } from 'react'

/**
 * Returns the id of the section currently in view, for highlighting the active
 * nav link. A section becomes active when it reaches a thin trigger band across
 * the middle of the viewport, so the highlight matches what the visitor is
 * actually looking at — and stays correct regardless of the fixed-navbar height.
 */
export function useScrollSpy(ids: string[]): string {
  const [active, setActive] = useState<string>(ids[0] ?? '')

  useEffect(() => {
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)

    if (elements.length === 0) return

    // Track EVERY section's current visibility — not just the entries that
    // happened to change in a given callback. Relying on the callback's
    // `entries` alone makes the active pick depend on observer batching, which
    // is what caused the off-by-one lag.
    const visible = new Map<string, boolean>()

    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) visible.set(e.target.id, e.isIntersecting)
        // `elements` is in document order, so the first one touching the band
        // is the section currently crossing mid-screen.
        const current = elements.find((el) => visible.get(el.id))
        if (current) setActive(current.id)
      },
      {
        // Collapse the viewport to a thin band straddling its vertical middle.
        // A section counts as active only once it actually reaches mid-screen,
        // so the highlight switches exactly when a heading hits the centre —
        // matching in both scroll directions, with no navbar-height guesswork.
        rootMargin: '-45% 0px -45% 0px',
        threshold: 0,
      },
    )

    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [ids])

  return active
}
