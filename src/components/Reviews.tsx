import { useEffect, useId, useRef, useState } from 'react'
import { Star, Quote, ArrowLeft } from 'lucide-react'
import { Section, SectionHeading } from './ui/Section'
import { Reveal } from './ui/Reveal'
import { REVIEWS, REVIEWS_SUMMARY } from '../data/reviews'
import type { Review } from '../data/reviews'

/* The review body is locked to one type size at every breakpoint so the collapsed
   height is a constant, not a measurement: 15px × 1.8 line-height = 27px a line,
   × 6 lines = 162px. Keeping these three in sync is the whole trick — it lets the
   card render already-collapsed on the server (no flash of a 12-line review on
   first paint) and animate with a plain CSS transition. */
const BODY_CLS = 'text-[15px] leading-[1.8] text-ink/85'
const COLLAPSED_PX = 162

/** Official Google "G" — lucide has no brand mark, so this is the real glyph. */
function GoogleGlyph({ size = 13 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true" className="block shrink-0">
      <path fill="#4285F4" d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z" />
      <path fill="#34A853" d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z" />
      <path fill="#FBBC05" d="M11.69 28.18C11.25 26.86 11 25.45 11 24s.25-2.86.69-4.18v-5.7H4.34C2.85 17.09 2 20.45 2 24s.85 6.91 2.34 9.88l7.35-5.7z" />
      <path fill="#EA4335" d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.35 5.7c1.73-5.2 6.58-9.07 12.31-9.07z" />
    </svg>
  )
}

/** Five full gold stars — every review here is a 5-star one. */
function Stars() {
  return (
    <div className="flex items-center gap-0.5" role="img" aria-label="דירוג 5 מתוך 5 כוכבים">
      {Array.from({ length: 5 }, (_, i) => (
        <Star key={i} size={15} className="fill-gold text-gold" aria-hidden="true" />
      ))}
    </div>
  )
}

function ReviewCard({ review }: { review: Review }) {
  const [expanded, setExpanded] = useState(false)
  // Assume clamping is needed so the server-rendered markup carries the button;
  // the effect below drops it for reviews that already fit.
  const [clamps, setClamps] = useState(true)
  const bodyRef = useRef<HTMLParagraphElement>(null)
  const bodyId = useId()

  useEffect(() => {
    const measure = () => {
      const el = bodyRef.current
      if (!el) return
      // max-height + overflow-hidden (unlike -webkit-line-clamp) keeps
      // scrollHeight equal to the full content height, so this stays accurate
      // while collapsed.
      setClamps(el.scrollHeight > COLLAPSED_PX + 4)
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  const collapsed = clamps && !expanded

  return (
    <article className="relative flex h-fit flex-col gap-4 overflow-hidden rounded-3xl border border-stone bg-ivory p-6 shadow-soft md:p-7">
      {/* decorative quote mark — mirrored for RTL so it opens the text */}
      <Quote
        size={44}
        aria-hidden="true"
        className="pointer-events-none absolute -top-1 left-5 -scale-x-100 text-gold/15"
        strokeWidth={1.5}
      />

      <header className="flex items-center gap-3">
        <span
          aria-hidden="true"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gold/15 font-serif text-lg font-semibold text-gold-deep"
        >
          {review.author.trim().charAt(0)}
        </span>
        <div className="min-w-0">
          <h3 className="truncate text-base font-semibold text-emerald">{review.author}</h3>
          <p className="text-xs text-muted">{review.date}</p>
        </div>
      </header>

      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <Stars />
        <span className="inline-flex items-center gap-1.5 rounded-full bg-stone/40 px-2.5 py-1 text-[11px] font-medium text-muted">
          <GoogleGlyph />
          {REVIEWS_SUMMARY.sourceLabel}
        </span>
      </div>

      {/* The wrapper animates its max-height; the paragraph itself never changes,
          so text never reflows mid-animation. */}
      <div className="relative">
        <p
          id={bodyId}
          ref={bodyRef}
          className={`overflow-hidden whitespace-pre-line transition-[max-height] duration-500 ease-out motion-reduce:transition-none ${BODY_CLS}`}
          style={{ maxHeight: collapsed ? `${COLLAPSED_PX}px` : '160rem' }}
        >
          {review.text}
        </p>
        {/* soft fade so the cut line doesn't read as the end of the sentence */}
        {collapsed && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-ivory to-transparent" />
        )}
      </div>

      {clamps && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          aria-controls={bodyId}
          className="w-fit rounded-full text-sm font-semibold text-emerald transition-colors hover:text-gold-deep focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
        >
          {expanded ? 'הצג פחות' : 'קרא עוד'}
        </button>
      )}
    </article>
  )
}

export function Reviews() {
  return (
    <Section id="reviews">
      <SectionHeading eyebrow={REVIEWS_SUMMARY.eyebrow} title={REVIEWS_SUMMARY.title} />

      {/* Aggregate row — plain text on purpose (no AggregateRating markup). */}
      <Reveal className="mb-12 flex justify-center">
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 rounded-full border border-gold/30 bg-ivory px-6 py-3 shadow-soft">
          <span className="flex items-baseline gap-1.5">
            <span className="font-serif text-3xl font-bold text-emerald">
              {REVIEWS_SUMMARY.rating}
            </span>
            <Star size={20} className="translate-y-0.5 fill-gold text-gold" aria-hidden="true" />
          </span>
          <span className="hidden h-6 w-px bg-stone sm:block" />
          <span className="text-sm text-muted md:text-base">{REVIEWS_SUMMARY.countLabel}</span>
        </div>
      </Reveal>

      {/* items-start: each card owns its height, so opening one never stretches
          its neighbour — it just grows in place. */}
      <div className="grid items-start gap-5 md:grid-cols-2 md:gap-6">
        {REVIEWS.map((review, i) => (
          <Reveal key={review.author} delay={(i % 2) * 0.08}>
            <ReviewCard review={review} />
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.1} className="mt-12 flex justify-center">
        <a
          href={REVIEWS_SUMMARY.ctaHref}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center justify-center gap-2 rounded-full border border-gold/70 px-8 py-3.5 text-base font-medium tracking-wide text-emerald transition-all duration-300 ease-out hover:border-gold hover:bg-gold hover:text-emerald-deep focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
        >
          {REVIEWS_SUMMARY.cta}
          <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" />
        </a>
      </Reveal>
    </Section>
  )
}
