import { useEffect, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { Instagram } from 'lucide-react'
import { WHATSAPP_HREF } from './ui/TrackedLinks'
import { CONTACT } from '../data/sections'
import { track } from '../lib/track'

// Official Simple Icons WhatsApp glyph (24-unit grid) so the proportions match
// the real WhatsApp mark.
function WhatsAppIcon({ size = 30 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className="block shrink-0"
    >
      <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2Zm0 1.67c2.2 0 4.26.86 5.82 2.42a8.19 8.19 0 0 1 2.41 5.82c0 4.54-3.7 8.23-8.24 8.23h-.01c-1.48 0-2.93-.4-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.188 8.188 0 0 1-1.26-4.38c.01-4.54 3.7-8.24 8.25-8.24ZM8.53 7.33c-.16 0-.43.06-.66.31-.22.25-.87.85-.87 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.46-.6 1.67-1.18.21-.58.21-1.07.14-1.18-.07-.11-.25-.17-.53-.31-.28-.14-1.65-.81-1.9-.9-.26-.09-.44-.14-.63.14-.18.28-.72.9-.88 1.08-.16.18-.33.2-.61.07-.28-.14-1.18-.44-2.25-1.39-.83-.74-1.39-1.65-1.55-1.93-.16-.28-.02-.43.12-.57.13-.13.28-.33.42-.5.14-.17.19-.29.28-.48.09-.19.05-.36-.02-.5-.07-.14-.63-1.51-.86-2.07-.23-.54-.46-.47-.63-.48-.16-.01-.35-.01-.53-.01Z" />
    </svg>
  )
}

/* ── Instagram colour options ──────────────────────────────────────────────
   Flip this single constant to switch looks — nothing else changes:
     'gradient' → the official Instagram brand gradient (orange→pink→purple)
     'brand'    → the site's gold-on-emerald palette, like the a11y widget
   ------------------------------------------------------------------------ */
const INSTAGRAM_STYLE: 'gradient' | 'brand' = 'gradient'

const INSTAGRAM_SKIN =
  INSTAGRAM_STYLE === 'gradient'
    ? {
        // 45° Instagram gradient, same 56px circle + shadow weight as WhatsApp.
        button:
          'bg-[linear-gradient(45deg,#F58529_0%,#DD2A7B_45%,#8134AF_75%,#515BD4_100%)] text-white shadow-[0_4px_16px_rgba(221,42,123,0.45)] hover:shadow-[0_8px_24px_rgba(221,42,123,0.6)]',
        ring: 'bg-[#DD2A7B]',
      }
    : {
        button:
          'bg-gold text-emerald-deep shadow-[0_4px_16px_rgba(194,161,77,0.45)] hover:shadow-[0_8px_24px_rgba(194,161,77,0.6)]',
        ring: 'bg-gold',
      }

// Shared geometry so the two floats read as one pair: identical 56px circle
// (well past the 44px minimum touch target), radius, transition and hover.
const FAB_CLS =
  'relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full transition-shadow duration-300'

export function FloatingContact() {
  const [visible, setVisible] = useState(false)
  const reduce = useReducedMotion()

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // One entrance/exit spec applied to both buttons — neither is the "primary".
  const motionProps = {
    initial: reduce ? { opacity: 0 } : { opacity: 0, scale: 0.6, y: 20 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: reduce ? { opacity: 0 } : { opacity: 0, scale: 0.6, y: 20 },
    transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
    whileHover: reduce ? undefined : { scale: 1.08 },
    whileTap: reduce ? undefined : { scale: 0.95 },
  }

  return (
    <AnimatePresence>
      {visible && (
        // dir="ltr" pins the visual order to the DOM order (WhatsApp nearest the
        // screen edge) regardless of the page's RTL direction. The row is
        // 56+12+56 = 124px wide + 20px gutter — safe on a 320px viewport — and
        // still 56px tall, so the a11y widget's 92px offset above it holds.
        <div
          dir="ltr"
          className="fixed bottom-5 left-5 z-40 flex items-center gap-3"
        >
          <motion.a
            {...motionProps}
            href={WHATSAPP_HREF}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="שלחו הודעה בוואטסאפ"
            title="שלחו הודעה בוואטסאפ"
            onClick={() => track('whatsapp_click', { link_location: 'floating_button' })}
            className={`${FAB_CLS} bg-[#25D366] text-white shadow-[0_4px_16px_rgba(37,211,102,0.45)] hover:shadow-[0_8px_24px_rgba(37,211,102,0.6)]`}
          >
            {/* gentle pulse ring */}
            {!reduce && (
              <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-[#25D366] opacity-30" />
            )}
            <WhatsAppIcon />
          </motion.a>

          <motion.a
            {...motionProps}
            href={CONTACT.instagram}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="עקבו אחרינו באינסטגרם"
            title="עקבו אחרינו באינסטגרם"
            onClick={() => track('instagram_click', { link_location: 'floating_button' })}
            className={`${FAB_CLS} ${INSTAGRAM_SKIN.button}`}
          >
            {!reduce && (
              <span
                className={`absolute inset-0 -z-10 animate-ping rounded-full opacity-30 ${INSTAGRAM_SKIN.ring}`}
              />
            )}
            <Instagram size={28} strokeWidth={1.9} aria-hidden="true" className="block shrink-0" />
          </motion.a>
        </div>
      )}
    </AnimatePresence>
  )
}
