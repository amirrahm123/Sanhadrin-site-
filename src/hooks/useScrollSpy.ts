import { useEffect, useState } from 'react'

/**
 * Returns the id of the section currently in view, for highlighting the active
 * nav link. Uses IntersectionObserver against the provided section ids.
 */
export function useScrollSpy(ids: string[], offset = 0): string {
  const [active, setActive] = useState<string>(ids[0] ?? '')

  useEffect(() => {
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)

    if (elements.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the entry nearest the top that is intersecting.
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)

        if (visible[0]) {
          setActive(visible[0].target.id)
        }
      },
      {
        // trigger when a section's upper third reaches the header line
        rootMargin: `-${offset + 80}px 0px -55% 0px`,
        threshold: 0,
      },
    )

    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [ids, offset])

  return active
}
