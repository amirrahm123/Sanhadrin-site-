import { Head } from 'vite-react-ssg'
import { SITE, absoluteUrl } from '../data/site'
import { SEO } from '../data/seo'

/**
 * Per-page document head: title, description, canonical, Open Graph and Twitter
 * card tags. Sourced from src/data/seo.ts keyed by route path. Rendered into the
 * pre-rendered HTML by vite-react-ssg (react-helmet-async under the hood).
 */
export function Seo({ path }: { path: string }) {
  const entry = SEO[path]
  if (!entry) return null

  const canonical = absoluteUrl(path)
  const ogImage = SITE.url + (entry.ogImage ?? SITE.ogImage)

  return (
    <Head>
      <html lang="he" dir="rtl" />
      <title>{entry.title}</title>
      <meta name="description" content={entry.description} />
      <link rel="canonical" href={canonical} />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE.name} />
      <meta property="og:locale" content={SITE.locale} />
      <meta property="og:title" content={entry.title} />
      <meta property="og:description" content={entry.description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={ogImage} />
      {/* Explicit dimensions/type let WhatsApp render the preview on the first
          fetch instead of showing a bare card until it crawls the image. */}
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:type" content="image/jpeg" />
      <meta property="og:image:alt" content={entry.h1} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={entry.title} />
      <meta name="twitter:description" content={entry.description} />
      <meta name="twitter:image" content={ogImage} />
    </Head>
  )
}
