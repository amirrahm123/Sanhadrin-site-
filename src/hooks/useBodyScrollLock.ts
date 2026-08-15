import { useEffect } from 'react'

/**
 * Freeze the page behind an open overlay (the mobile nav drawer) without losing
 * the reading position.
 *
 * Why not `body { overflow: hidden }`: iOS Safari ignores it for touch
 * scrolling. The document keeps panning (and rubber-banding) under the overlay,
 * which is exactly the reported bug. The technique that does hold everywhere is
 * to take the body out of flow — `position: fixed` with `top: -scrollY` — so
 * there is nothing left to scroll, while the viewport still shows the same
 * slice of the page. On release we put the styles back and jump to the saved
 * offset.
 *
 * Two details that are easy to get wrong:
 * - `html { scroll-behavior: smooth }` is set globally in index.css, so the
 *   restore scroll would ANIMATE back to position, reading as a visible jump.
 *   It's forced to `auto` for that one call and restored right after.
 * - Every touched property is captured and written back verbatim, so the hook
 *   never clobbers styles it didn't set.
 *
 * Fixed-position UI (the WhatsApp/Instagram floats, the a11y widget) is
 * unaffected: `position: fixed` on the body does not create a containing block
 * for fixed descendants — only transform/filter/will-change would — so those
 * stay pinned to the viewport exactly as before.
 */
export function useBodyScrollLock(locked: boolean): void {
  useEffect(() => {
    if (!locked) return

    const body = document.body
    const html = document.documentElement
    const scrollY = window.scrollY

    const prev = {
      position: body.style.position,
      top: body.style.top,
      left: body.style.left,
      right: body.style.right,
      width: body.style.width,
      overflow: body.style.overflow,
    }

    body.style.position = 'fixed'
    body.style.top = `-${scrollY}px`
    // left/right rather than insetInlineStart — physical sides are what pin the
    // body across the viewport, and they behave the same under dir="rtl".
    body.style.left = '0'
    body.style.right = '0'
    body.style.width = '100%'
    body.style.overflow = 'hidden'

    return () => {
      body.style.position = prev.position
      body.style.top = prev.top
      body.style.left = prev.left
      body.style.right = prev.right
      body.style.width = prev.width
      body.style.overflow = prev.overflow

      const prevBehavior = html.style.scrollBehavior
      html.style.scrollBehavior = 'auto'
      window.scrollTo(0, scrollY)
      html.style.scrollBehavior = prevBehavior
    }
  }, [locked])
}
