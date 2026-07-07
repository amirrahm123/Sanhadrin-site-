import { Link } from 'react-router-dom'
import { Seo } from './Seo'
import { SEO } from '../data/seo'

export type Crumb = { label: string; to?: string }

type PageHeroProps = {
  eyebrow?: string
  /**
   * Route path (e.g. "/weddings"). When given, the <h1> and all head/meta tags
   * are sourced from src/data/seo.ts — the single source of truth.
   */
  path?: string
  /** Explicit <h1>, for pages without an SEO entry (e.g. 404). */
  title?: string
  subtitle?: string
  /** Trail after "בית". Defaults to just this page. */
  breadcrumbs?: Crumb[]
}

/**
 * Compact emerald banner for inner pages: renders the per-page <Seo> head,
 * breadcrumb, eyebrow and the page's single <h1> (from the SEO config) + an
 * optional lead, over a faint aqueduct-arch motif (the brand signature).
 */
export function PageHero({ eyebrow, path, title, subtitle, breadcrumbs }: PageHeroProps) {
  const h1 = path ? SEO[path]?.h1 ?? title ?? '' : title ?? ''
  const trail: Crumb[] = [{ label: 'בית', to: '/' }, ...(breadcrumbs ?? [{ label: h1 }])]

  return (
    <section className="grain relative overflow-hidden bg-emerald-deep text-cream">
      {path && <Seo path={path} />}
      {/* faint arch motif */}
      <svg
        className="pointer-events-none absolute inset-x-0 bottom-0 h-40 w-full opacity-[0.12]"
        viewBox="0 0 400 120"
        preserveAspectRatio="xMidYMax slice"
        aria-hidden="true"
      >
        <g fill="none" stroke="#D9C189" strokeWidth="1.2">
          {[0, 1, 2, 3, 4, 5, 6].map((i) => {
            const x = 8 + i * 60
            return (
              <path key={i} d={`M${x} 118 L${x} 70 A24 24 0 0 1 ${x + 48} 70 L${x + 48} 118`} />
            )
          })}
          <line x1="0" y1="54" x2="400" y2="54" strokeWidth="0.8" />
        </g>
      </svg>

      <div className="relative z-10 mx-auto w-full max-w-content px-5 pb-14 pt-28 sm:px-8 md:pb-20 md:pt-36 lg:px-10">
        {/* Breadcrumbs */}
        <nav aria-label="פירורי לחם" className="mb-5 text-sm text-cream/60">
          <ol className="flex flex-wrap items-center gap-1.5">
            {trail.map((c, i) => (
              <li key={i} className="flex items-center gap-1.5">
                {c.to && i < trail.length - 1 ? (
                  <Link to={c.to} className="transition-colors hover:text-gold">
                    {c.label}
                  </Link>
                ) : (
                  <span className="text-cream/80" aria-current="page">
                    {c.label}
                  </span>
                )}
                {i < trail.length - 1 && <span className="text-cream/30">/</span>}
              </li>
            ))}
          </ol>
        </nav>

        {eyebrow && <span className="eyebrow text-gold-soft">{eyebrow}</span>}
        <h1 className="mt-3 font-serif text-4xl font-bold leading-tight text-cream md:text-5xl lg:text-6xl">
          {h1}
        </h1>
        {subtitle && (
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-cream/75 md:text-lg">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  )
}
