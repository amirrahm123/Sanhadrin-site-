import { useEffect, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { CONTACT } from '../data/sections'

// WhatsApp glyph (lucide has no brand mark)
function WhatsAppIcon({ size = 26 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 1.82c2.16 0 4.18.84 5.71 2.37a8.03 8.03 0 0 1 2.37 5.72c0 4.46-3.63 8.09-8.09 8.09a8.1 8.1 0 0 1-4.13-1.13l-.3-.18-3.12.82.83-3.04-.19-.31a8.05 8.05 0 0 1-1.24-4.29c0-4.46 3.63-8.09 8.09-8.09l.36.05Zm-4.5 4.34c-.21 0-.55.08-.84.39-.29.31-1.1 1.08-1.1 2.63s1.13 3.05 1.29 3.26c.16.21 2.22 3.39 5.38 4.62 2.62 1.03 3.15.83 3.72.78.57-.05 1.84-.75 2.1-1.48.26-.73.26-1.35.18-1.48-.08-.13-.29-.21-.6-.37-.31-.16-1.84-.91-2.13-1.01-.29-.1-.5-.16-.71.16-.21.31-.81 1.01-.99 1.22-.18.21-.37.24-.68.08-.31-.16-1.31-.48-2.5-1.54-.92-.82-1.54-1.84-1.72-2.15-.18-.31-.02-.48.14-.63.14-.14.31-.37.47-.55.16-.18.21-.31.31-.52.1-.21.05-.39-.03-.55-.08-.16-.71-1.72-.99-2.35-.26-.61-.52-.53-.71-.54l-.6-.01Z" />
    </svg>
  )
}

export function FloatingContact() {
  const [visible, setVisible] = useState(false)
  const reduce = useReducedMotion()

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.a
          href={`https://wa.me/${CONTACT.whatsapp}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="שליחת הודעת וואטסאפ"
          initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.6, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.6, y: 20 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          whileHover={reduce ? undefined : { scale: 1.08 }}
          className="fixed bottom-5 left-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-card"
        >
          {/* gentle pulse ring */}
          {!reduce && (
            <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-[#25D366] opacity-30" />
          )}
          <WhatsAppIcon />
        </motion.a>
      )}
    </AnimatePresence>
  )
}
