import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * On client-side route changes, reset scroll to the top — unless the URL carries
 * a hash, in which case native anchor scrolling (with scroll-padding) handles it.
 *
 * Also resets FOCUS to <main>. A client-side navigation swaps the page content
 * without the focus move a real page load gives you, so without this the
 * keyboard position is stranded on the (now unmounted) link and screen readers
 * announce nothing. Skipped on the first render so we never steal focus on
 * initial load — only genuine in-app navigations move it.
 *
 * Renders nothing.
 */
export function ScrollToTop() {
  const { pathname, hash } = useLocation()
  const firstRender = useRef(true)

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    if (hash) return

    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
    // preventScroll: the scrollTo above already put us at the top; focusing
    // without it would re-scroll to wherever <main> happens to start.
    document.getElementById('main-content')?.focus({ preventScroll: true })
  }, [pathname, hash])

  return null
}
