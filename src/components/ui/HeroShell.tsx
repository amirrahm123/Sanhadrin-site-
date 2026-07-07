import type { ReactNode } from 'react'
import { ImagePlaceholder } from '../ImagePlaceholder'

type HeroShellProps = {
  /** height utility — home uses full viewport; inner pages a touch shorter */
  minHClass?: string
  /** absolutely-positioned top slot (e.g. breadcrumbs) */
  topSlot?: ReactNode
  /** absolutely-positioned bottom-center slot (e.g. scroll cue) */
  bottomSlot?: ReactNode
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
          eager
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

      <div className="relative z-10 mx-auto max-w-3xl px-6 pt-24 pb-16 text-center text-cream">
        {children}
      </div>

      {bottomSlot}
    </section>
  )
}
