// Thin dataLayer wrapper. Works before GTM's real container is live: it just
// initialises window.dataLayer and pushes events, which GTM (once configured)
// picks up. GA4 is wired through GTM — see README.
type TrackParams = Record<string, unknown>

export function track(event: string, params: TrackParams = {}): void {
  if (typeof window === 'undefined') return
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push({ event, ...params })
}
