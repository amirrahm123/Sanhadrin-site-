import { useEffect } from 'react'
import type { CSSProperties } from 'react'
import { useRouteError } from 'react-router-dom'
import { BRAND, CONTACT } from '../data/sections'
import { TEL_HREF, WHATSAPP_HREF } from './ui/TrackedLinks'

/**
 * Root error boundary (wired as the root route's `errorElement` in routes.tsx).
 *
 * Without it, an exception thrown while rendering or hydrating any route
 * unmounts the whole React tree and leaves a blank white page — the pre-rendered
 * HTML paints, then vanishes.
 *
 * Deliberately dependency-light: no Layout, no context providers, no
 * ImagePlaceholder, no router <Link>. Whatever crashed may well be one of those,
 * and a fallback that can itself throw is worse than none. The arch motif is
 * inlined here rather than imported for the same reason. The "back home" action
 * is a plain <a>, so it triggers a FULL page load — that discards the broken
 * client state instead of navigating within it.
 *
 * Styling uses raw palette values, not Tailwind classes, so the page still looks
 * designed even if the stylesheet is what failed to load.
 */

const C = {
  emeraldDeep: '#0F3329',
  emerald: '#18463A',
  cream: '#F8F4EC',
  gold: '#C2A14D',
  goldSoft: '#D9C189',
}

export function ErrorFallback() {
  const error = useRouteError()

  useEffect(() => {
    // Surface it in the browser console (and to any error tracker wired later).
    console.error('[ErrorFallback] unhandled render error:', error)
  }, [error])

  return (
    <div
      dir="rtl"
      lang="he"
      style={{
        minHeight: '100dvh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1.25rem',
        textAlign: 'center',
        background: `linear-gradient(160deg, ${C.emerald} 0%, ${C.emeraldDeep} 60%, #0B2820 100%)`,
        color: C.cream,
        fontFamily: 'Heebo, system-ui, sans-serif',
      }}
    >
      <div style={{ maxWidth: '32rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* The site's aqueduct arches — the one motif that says "Sandrine"
            without needing an image request. */}
        <svg
          width="150"
          height="66"
          viewBox="0 0 200 88"
          fill="none"
          aria-hidden="true"
          style={{ opacity: 0.75 }}
        >
          <g stroke={C.gold} strokeWidth="1.4" opacity="0.85">
            {[0, 1, 2].map((i) => {
              const x = 14 + i * 60
              return (
                <g key={i}>
                  <path d={`M${x} 68 L${x} 40 A26 26 0 0 1 ${x + 52} 40 L${x + 52} 68`} />
                  <line x1={x} y1="68" x2={x} y2="80" />
                  <line x1={x + 52} y1="68" x2={x + 52} y2="80" />
                </g>
              )
            })}
            <line x1="4" y1="26" x2="196" y2="26" strokeWidth="1" />
            <line x1="4" y1="82" x2="196" y2="82" strokeWidth="1" />
          </g>
        </svg>

        <span
          style={{
            marginTop: '1.75rem',
            fontFamily: '"Cormorant Garamond", serif',
            fontSize: '0.875rem',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: C.goldSoft,
          }}
        >
          {BRAND.latin}
        </span>

        <h1
          style={{
            marginTop: '1rem',
            fontFamily: '"Frank Ruhl Libre", serif',
            fontSize: 'clamp(1.75rem, 6vw, 2.75rem)',
            fontWeight: 700,
            lineHeight: 1.15,
          }}
        >
          משהו השתבש לרגע
        </h1>

        <span
          style={{
            display: 'block',
            width: '6rem',
            height: '1px',
            margin: '1.5rem 0',
            background: `linear-gradient(to left, transparent, ${C.gold}, transparent)`,
          }}
        />

        <p style={{ fontSize: '1.0625rem', lineHeight: 1.75, color: 'rgba(248,244,236,0.85)' }}>
          נתקלנו בתקלה זמנית בטעינת העמוד. אפשר לרענן ולנסות שוב, לחזור לעמוד הבית,
          או פשוט לדבר איתנו — נשמח לעזור בכל שאלה על האחוזה.
        </p>

        <div
          style={{
            marginTop: '2rem',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.75rem',
            justifyContent: 'center',
          }}
        >
          {/* Plain anchors on purpose: a full navigation resets the crashed app. */}
          <a href="/" style={{ ...btn, background: C.gold, color: C.emeraldDeep }}>
            חזרה לעמוד הבית
          </a>
          <a
            href={TEL_HREF}
            style={{ ...btn, border: `1px solid ${C.gold}`, color: C.cream }}
          >
            {CONTACT.phone}
          </a>
          <a
            href={WHATSAPP_HREF}
            target="_blank"
            rel="noopener noreferrer"
            style={{ ...btn, border: `1px solid ${C.gold}`, color: C.cream }}
          >
            וואטסאפ
          </a>
        </div>
      </div>
    </div>
  )
}

const btn: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '2.75rem',
  padding: '0.75rem 1.75rem',
  borderRadius: '9999px',
  fontSize: '0.9375rem',
  fontWeight: 500,
  textDecoration: 'none',
}
