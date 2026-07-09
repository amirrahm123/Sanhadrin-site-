import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { Seo } from './Seo'
import { SEO } from '../data/seo'
import { Button } from './ui/Button'
import { HeroShell } from './ui/HeroShell'

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
  /** Short, page-specific intro line (do NOT reuse the homepage hero copy). */
  subtitle?: string
  /** Trail after "בית". Defaults to just this page. */
  breadcrumbs?: Crumb[]
  /** Show the "לתיאום סיור" CTA (scrolls to the footer form). */
  showCta?: boolean
  /** managed photo-slot key for this page's hero background */
  heroSlot?: string
}

/**
 * Inner-page hero — the SAME tall, arch-background hero treatment as the
 * homepage (via HeroShell), only the text differs per page. Renders the
 * per-page <Seo> head and the page's single <h1> (from the SEO config), plus
 * breadcrumbs and a CTA that scrolls to the footer contact form.
 */
export function PageHero({
  eyebrow,
  path,
  title,
  subtitle,
  breadcrumbs,
  showCta = true,
  heroSlot,
}: PageHeroProps) {
  const reduce = useReducedMotion()
  const h1 = path ? SEO[path]?.h1 ?? title ?? '' : title ?? ''
  const trail: Crumb[] = [{ label: 'בית', to: '/' }, ...(breadcrumbs ?? [{ label: h1 }])]

  const fade = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 28, filter: 'blur(8px)' },
          animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
          transition: { duration: 1, delay, ease: [0.22, 1, 0.36, 1] as const },
        }

  return (
    <HeroShell
      minHClass="min-h-[80svh]"
      photoSlot={heroSlot}
      topSlot={
        <nav
          aria-label="פירורי לחם"
          className="absolute inset-x-0 top-0 z-10 mx-auto w-full max-w-content px-5 pt-24 text-sm text-cream/70 sm:px-8 lg:px-10"
        >
          <ol className="flex flex-wrap items-center gap-1.5">
            {trail.map((c, i) => (
              <li key={i} className="flex items-center gap-1.5">
                {c.to && i < trail.length - 1 ? (
                  <Link to={c.to} className="transition-colors hover:text-gold-soft">
                    {c.label}
                  </Link>
                ) : (
                  <span className="text-cream/90" aria-current="page">
                    {c.label}
                  </span>
                )}
                {i < trail.length - 1 && <span className="text-cream/40">/</span>}
              </li>
            ))}
          </ol>
        </nav>
      }
    >
      {path && <Seo path={path} />}

      {eyebrow && (
        <motion.span {...fade(0.1)} className="eyebrow text-gold-soft">
          {eyebrow}
        </motion.span>
      )}

      <motion.h1
        {...fade(0.2)}
        className="mt-5 font-serif text-5xl font-bold leading-[1.05] text-cream sm:text-6xl md:text-7xl"
      >
        {h1}
      </motion.h1>

      <motion.div {...fade(0.35)} className="mx-auto my-7 h-px w-24 bg-gold/60" />

      {subtitle && (
        <motion.p
          {...fade(0.45)}
          className="mx-auto max-w-xl text-base leading-relaxed text-cream/90 sm:text-lg"
        >
          {subtitle}
        </motion.p>
      )}

      {showCta && (
        <motion.div {...fade(0.6)} className="mt-9 flex justify-center">
          <Button as="a" href="#contact-form" variant="primary" size="lg" className="w-full sm:w-auto">
            לתיאום סיור
          </Button>
        </motion.div>
      )}
    </HeroShell>
  )
}
