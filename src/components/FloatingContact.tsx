import { useEffect, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { CONTACT } from '../data/sections'

// Official WhatsApp glyph (lucide has no brand mark). Drawn on a 32-unit grid
// and centered within the viewBox so it sits perfectly inside the round button.
function WhatsAppIcon({ size = 30 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="currentColor"
      aria-hidden="true"
      className="block shrink-0"
    >
      <path d="M16.003 5.333c-5.887 0-10.667 4.78-10.667 10.667 0 1.88.494 3.72 1.433 5.34L5.333 26.667l5.5-1.42a10.62 10.62 0 0 0 5.166 1.32h.004c5.884 0 10.664-4.78 10.664-10.667 0-2.85-1.11-5.53-3.126-7.546a10.6 10.6 0 0 0-7.542-3.354Zm0 1.92a8.71 8.71 0 0 1 6.19 2.564 8.68 8.68 0 0 1 2.563 6.183c0 4.83-3.926 8.747-8.75 8.747h-.003a8.68 8.68 0 0 1-4.42-1.21l-.316-.188-3.263.855.87-3.18-.206-.328a8.68 8.68 0 0 1-1.328-4.63c.002-4.826 3.927-8.75 8.663-8.75Zm-4.863 4.69c-.23 0-.6.086-.913.427-.313.34-1.196 1.168-1.196 2.847s1.224 3.302 1.395 3.53c.17.228 2.4 3.665 5.816 5.14.812.35 1.446.56 1.94.717.816.26 1.558.223 2.145.135.654-.098 2.01-.822 2.294-1.616.283-.795.283-1.475.198-1.617-.085-.142-.312-.227-.652-.398-.34-.17-2.01-.99-2.322-1.104-.313-.114-.54-.17-.767.17-.227.34-.88 1.104-1.08 1.332-.198.227-.397.256-.737.086-.34-.17-1.435-.53-2.734-1.688-1.01-.9-1.693-2.014-1.892-2.354-.198-.34-.02-.523.15-.693.153-.152.34-.397.51-.596.17-.198.227-.34.34-.567.114-.227.057-.426-.028-.596-.085-.17-.767-1.85-1.05-2.532-.276-.665-.558-.575-.767-.586l-.653-.012Z" />
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
          whileTap={reduce ? undefined : { scale: 0.95 }}
          className="fixed bottom-5 left-5 z-40 flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_4px_16px_rgba(37,211,102,0.45)] transition-shadow duration-300 hover:shadow-[0_8px_24px_rgba(37,211,102,0.6)]"
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
