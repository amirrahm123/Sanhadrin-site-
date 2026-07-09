import type { CSSProperties } from 'react'
import { useSlotOverride } from '../lib/slots'

type Ratio = '16/9' | '4/5' | '1/1' | '3/2' | '21/9'

type ImagePlaceholderProps = {
  label?: string
  ratio?: Ratio
  /** swap-in real image later: just pass src (+ alt) and the motif is replaced */
  src?: string
  alt?: string
  /** optional responsive sources (only used when `src` is set) */
  srcSet?: string
  sizes?: string
  /**
   * Managed photo-slot key (see photoSlots.ts). When the admin has assigned a
   * photo to this slot it renders here; otherwise the designed placeholder
   * shows. An explicit `src` (e.g. gallery images) always takes precedence.
   */
  slot?: string
  className?: string
  /** darker stone/emerald variant for hero & overlays */
  tone?: 'light' | 'dark'
  rounded?: boolean
  /** eager-load (above-the-fold, e.g. the hero); otherwise lazy. */
  eager?: boolean
}

const ratioClass: Record<Ratio, string> = {
  '16/9': 'aspect-[16/9]',
  '4/5': 'aspect-[4/5]',
  '1/1': 'aspect-square',
  '3/2': 'aspect-[3/2]',
  '21/9': 'aspect-[21/9]',
}

// Intrinsic width/height (px) per ratio — set on real <img> to reserve space
// and prevent layout shift (CLS).
const ratioDims: Record<Ratio, [number, number]> = {
  '16/9': [1200, 675],
  '4/5': [1200, 1500],
  '1/1': [1200, 1200],
  '3/2': [1200, 800],
  '21/9': [1200, 514],
}

/**
 * A deliberate, designed placeholder: soft stone/cream gradient, a faint
 * decorative aqueduct/arch motif, and an italic caption. Reads as intentional,
 * never broken. To use a real photo later, pass `src` (and `alt`).
 */
export function ImagePlaceholder({
  label,
  ratio = '16/9',
  src,
  alt,
  srcSet,
  sizes,
  slot,
  className = '',
  tone = 'light',
  rounded = true,
  eager = false,
}: ImagePlaceholderProps) {
  const radius = rounded ? 'rounded-2xl' : ''

  // Admin-assigned photo for this slot (null when none → placeholder). An
  // explicit `src` prop still wins (used by the gallery).
  const override = useSlotOverride(slot)
  const effectiveSrc = src ?? override?.src
  const effectiveSrcSet = srcSet ?? override?.srcSet
  const effectiveAlt = alt ?? override?.alt ?? label ?? ''

  // Real photo path. Renders a real <img> (object-cover, width/height reserved
  // for CLS, lazy unless eager) whenever a slot override or explicit src exists.
  if (effectiveSrc) {
    const [w, h] = ratioDims[ratio]
    return (
      <div className={`relative overflow-hidden ${radius} ${ratioClass[ratio]} ${className}`}>
        <img
          src={effectiveSrc}
          {...(effectiveSrcSet ? { srcSet: effectiveSrcSet } : {})}
          {...(sizes ? { sizes } : {})}
          alt={effectiveAlt}
          width={w}
          height={h}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          {...(eager ? { fetchPriority: 'high' as const } : {})}
          className="h-full w-full object-cover"
        />
      </div>
    )
  }

  const bg =
    tone === 'dark'
      ? { background: 'linear-gradient(135deg, #143a30 0%, #0f3329 55%, #0b2820 100%)' }
      : { background: 'linear-gradient(135deg, #efe9da 0%, #e6decf 50%, #f3eee2 100%)' }

  const motifStroke = tone === 'dark' ? 'rgba(194,161,77,0.30)' : 'rgba(24,70,58,0.16)'
  const captionColor = tone === 'dark' ? 'text-cream/80' : 'text-emerald/70'
  const sealColor = tone === 'dark' ? 'rgba(217,193,137,0.55)' : 'rgba(194,161,77,0.65)'

  return (
    <div
      className={`group relative overflow-hidden ${radius} ${ratioClass[ratio]} ${className}`}
      style={bg as CSSProperties}
      role="img"
      aria-label={label ?? 'תמונת המחשה'}
    >
      {/* decorative aqueduct / arch motif */}
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 400 225"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="ph-fade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={motifStroke} stopOpacity="0.9" />
            <stop offset="100%" stopColor={motifStroke} stopOpacity="0.2" />
          </linearGradient>
        </defs>
        {/* row of roman arches */}
        <g fill="none" stroke="url(#ph-fade)" strokeWidth="1.5">
          {[0, 1, 2, 3, 4, 5].map((i) => {
            const x = 20 + i * 64
            return (
              <g key={i}>
                <path d={`M${x} 150 L${x} 110 A28 28 0 0 1 ${x + 56} 110 L${x + 56} 150`} />
                <line x1={x} y1="150" x2={x} y2="175" />
                <line x1={x + 56} y1="150" x2={x + 56} y2="175" />
              </g>
            )
          })}
          {/* aqueduct top rail + ground line */}
          <line x1="8" y1="92" x2="392" y2="92" strokeWidth="1" />
          <line x1="8" y1="178" x2="392" y2="178" strokeWidth="1" />
        </g>
      </svg>

      {/* subtle vignette */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            tone === 'dark'
              ? 'radial-gradient(120% 120% at 50% 0%, transparent 40%, rgba(11,40,32,0.45) 100%)'
              : 'radial-gradient(120% 120% at 50% 30%, transparent 55%, rgba(43,42,38,0.06) 100%)',
        }}
      />

      {/* centered seal + caption */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-4 text-center">
        <svg width="34" height="34" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M6 19V11a6 6 0 0 1 12 0v8"
            stroke={sealColor}
            strokeWidth="1.4"
            strokeLinecap="round"
          />
          <path d="M4 19h16" stroke={sealColor} strokeWidth="1.4" strokeLinecap="round" />
          <circle cx="12" cy="7" r="1.1" fill={sealColor} />
        </svg>
        {label && (
          <span
            className={`latin-caption font-serif text-sm md:text-[0.95rem] italic ${captionColor}`}
            style={{ fontFamily: '"Frank Ruhl Libre", serif' }}
          >
            {label}
          </span>
        )}
      </div>
    </div>
  )
}
