// ---------------------------------------------------------------------------
// SINGLE SOURCE OF TRUTH for launch-time values. Everything the client must
// swap before go-live lives here (see README launch checklist).
// ---------------------------------------------------------------------------
export const SITE = {
  // No trailing slash. Used for canonical URLs, OG URLs and the sitemap.
  // TODO(launch): replace with Sandrine's real domain.
  url: 'https://REPLACE-WITH-DOMAIN.com',

  name: 'אחוזת סנדרין',
  nameLatin: 'Sandrine Events',
  locale: 'he_IL',

  // 1200×630 social share image (public/og-image.svg placeholder for now).
  // TODO(launch): replace with a real estate photo exported to og-image.jpg.
  ogImage: '/og-image.svg',

  // Google Tag Manager container. GA4 is configured *through* GTM (see README).
  // TODO(launch): replace with the real GTM container id.
  gtmId: 'GTM-XXXXXXX',

  // GA4 measurement id — configured inside GTM, kept here for reference.
  // TODO(launch): replace with the real GA4 id.
  ga4Id: 'G-XXXXXXXXXX',

  // Google Search Console verification token (meta-tag method).
  // TODO(launch): replace with the real token.
  searchConsoleToken: 'REPLACE_WITH_SEARCH_CONSOLE_TOKEN',

  // Web3Forms access key — register morvsandrine@gmail.com at web3forms.com.
  // TODO(launch): replace with the real access key.
  web3formsKey: 'REPLACE_WITH_WEB3FORMS_KEY',

  // LocalBusiness geo coordinates. Left null on purpose — do NOT guess precise
  // coordinates. TODO(launch): look up מתחם רגבה / BIG Regba and fill in; geo is
  // then emitted into the JSON-LD automatically.
  geo: null as { lat: number; lng: number } | null,
} as const

/** Absolute URL for a route path ('/', '/weddings', …). */
export function absoluteUrl(path: string): string {
  return SITE.url + (path === '/' ? '/' : path)
}
