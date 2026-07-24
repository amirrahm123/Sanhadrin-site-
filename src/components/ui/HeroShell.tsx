import type { ReactNode } from 'react'
import { ImagePlaceholder } from '../ImagePlaceholder'

type HeroShellProps = {
  /** height utility — home uses full viewport; inner pages a touch shorter */
  minHClass?: string
  /** absolutely-positioned top slot (e.g. breadcrumbs) */
  topSlot?: ReactNode
  /** absolutely-positioned bottom-center slot (e.g. scroll cue) */
  bottomSlot?: ReactNode
  /** managed photo-slot key for the full-bleed hero background */
  photoSlot?: string
  /**
   * Show the empty-state seal icon over the arch background. Defaults to FALSE
   * for every hero: an empty hero renders as a clean arch background with no
   * icon in the middle. (Non-hero placeholders — gallery tiles, section images
   * — keep their marker; that's ImagePlaceholder's own default of true.)
   */
  showEmptyStateIcon?: boolean
  id?: string
  children: ReactNode
}

/**
 * Shared hero frame: full-bleed dark background with the aqueduct-arch motif
 * (via ImagePlaceholder), a legibility overlay and a centered content column.
 * Used by both the homepage Hero and the inner-page PageHero so they match.
 */
export function HeroShell({
  minHClass = 'min-h-[100svh]',
  topSlot,
  bottomSlot,
  photoSlot,
  showEmptyStateIcon = false,
  id,
  children,
}: HeroShellProps) {
  return (
    <section
      id={id}
      className={`relative flex ${minHClass} items-center justify-center overflow-hidden`}
    >
      {/* full-bleed background (arch motif) */}
      <div className="absolute inset-0">
        <ImagePlaceholder
          ratio="16/9"
          tone="dark"
          rounded={false}
          label=""
          slot={photoSlot}
          eager
          showEmptyStateIcon={showEmptyStateIcon}
          className="!aspect-auto h-full w-full"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, rgba(15,51,41,0.55) 0%, rgba(15,51,41,0.42) 45%, rgba(11,40,32,0.78) 100%)',
          }}
        />
      </div>

      {topSlot}

      {/* Top padding clears the FIXED navbar. When a topSlot (breadcrumbs) is
          present — every inner page via PageHero — the hero can hold tall content
          (e.g. a multi-paragraph gallery intro) that top-aligns instead of
          centering, so the clearance must beat the real navbar height (published
          as --nav-h, ~112px desktop) plus room for the breadcrumb row; the
          hardcoded pt-24 (96px) was shorter than the navbar and clipped the
          eyebrow. The homepage hero (no topSlot) keeps the plain 6rem. */}
      <div
        className="relative z-10 mx-auto max-w-3xl px-6 pb-16 text-center text-cream"
        style={{ paddingTop: topSlot ? 'calc(var(--nav-h, 6rem) + 3.5rem)' : '6rem' }}
      >
        {children}
      </div>

      {bottomSlot}
    </section>
  )
}
