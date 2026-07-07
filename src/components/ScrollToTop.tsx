import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * On client-side route changes, reset scroll to the top — unless the URL carries
 * a hash, in which case native anchor scrolling (with scroll-padding) handles it.
 * Renders nothing.
 */
export function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) return
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [pathname, hash])

  return null
}
