import { useEffect, useRef, useState } from 'react'
import { Menu, X, Instagram, Facebook } from 'lucide-react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { NAV_ITEMS, BRAND, CONTACT, HERO } from '../data/sections'
import { useScrollSpy } from '../hooks/useScrollSpy'
import { Button } from './ui/Button'

// Stable id list so the scroll-spy observer isn't rebuilt on every render.
const NAV_IDS = NAV_ITEMS.map((n) => n.id)

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const reduce = useReducedMotion()
  const active = useScrollSpy(NAV_IDS)
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Publish the *measured* nav-bar height (the top bar only — not the open
  // mobile drawer) so anchor scrolling can offset by the real height instead of
  // a hardcoded guess. Re-measures across breakpoints via ResizeObserver.
  useEffect(() => {
    const bar = barRef.current
    if (!bar) return
    const apply = () =>
      document.documentElement.style.setProperty('--nav-h', `${bar.offsetHeight}px`)
    apply()
    const ro = new ResizeObserver(apply)
    ro.observe(bar)
    return () => ro.disconnect()
  }, [])

  // lock body scroll while drawer is open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const solid = scrolled || open

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        solid ? 'bg-cream/95 backdrop-blur-md shadow-header' : 'bg-transparent'
      }`}
    >
      <div
        ref={barRef}
        className="mx-auto flex max-w-content items-center justify-between gap-4 px-5 py-3.5 sm:px-8 lg:px-10"
      >
        {/* Logo lockup */}
        <a href="#home" className="group flex flex-col leading-none" aria-label={BRAND.he}>
          <span
            className={`font-serif text-xl font-bold tracking-tight transition-colors md:text-2xl ${
              solid ? 'text-emerald' : 'text-cream'
            }`}
          >
            {BRAND.he}
          </span>
          <span
            className={`latin text-[0.7rem] font-medium uppercase transition-colors md:text-xs ${
              solid ? 'text-gold' : 'text-gold-soft'
            }`}
          >
            {BRAND.latin}
          </span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 xl:flex">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`relative px-3 py-2 text-sm font-medium transition-colors ${
                solid
                  ? active === item.id
                    ? 'text-gold'
                    : 'text-ink/80 hover:text-emerald'
                  : active === item.id
                    ? 'text-gold-soft'
                    : 'text-cream/90 hover:text-cream'
              }`}
            >
              {item.label}
              {active === item.id && (
                <span className="absolute inset-x-3 -bottom-0.5 h-px bg-gold" />
              )}
            </a>
          ))}
        </nav>

        {/* Right cluster */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden items-center gap-1 sm:flex">
            <SocialIcon href={CONTACT.instagram} label="Instagram" solid={solid}>
              <Instagram size={18} />
            </SocialIcon>
            <SocialIcon href={CONTACT.facebook} label="Facebook" solid={solid}>
              <Facebook size={18} />
            </SocialIcon>
          </div>

          <Button
            as="a"
            href="#contact"
            variant={solid ? 'primary' : 'outlineLight'}
            size="md"
            className="hidden md:inline-flex"
          >
            {HERO.primaryCta}
          </Button>

          {/* Mobile toggle */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'סגירת תפריט' : 'פתיחת תפריט'}
            aria-expanded={open}
            className={`inline-flex h-10 w-10 items-center justify-center rounded-full transition-colors xl:hidden ${
              solid ? 'text-emerald hover:bg-stone/60' : 'text-cream hover:bg-cream/10'
            }`}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="xl:hidden"
            initial={reduce ? false : { opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="border-t border-stone/70 bg-cream px-5 pb-8 pt-2 sm:px-8">
              <nav className="flex flex-col">
                {NAV_ITEMS.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    onClick={() => setOpen(false)}
                    className={`border-b border-stone/50 py-3.5 text-lg font-medium transition-colors ${
                      active === item.id ? 'text-gold' : 'text-ink hover:text-emerald'
                    }`}
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
              <div className="mt-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <SocialIcon href={CONTACT.instagram} label="Instagram" solid>
                    <Instagram size={20} />
                  </SocialIcon>
                  <SocialIcon href={CONTACT.facebook} label="Facebook" solid>
                    <Facebook size={20} />
                  </SocialIcon>
                </div>
                <Button as="a" href="#contact" onClick={() => setOpen(false)} variant="primary">
                  {HERO.primaryCta}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

function SocialIcon({
  href,
  label,
  solid,
  children,
}: {
  href: string
  label: string
  solid: boolean
  children: React.ReactNode
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className={`inline-flex h-9 w-9 items-center justify-center rounded-full transition-colors ${
        solid ? 'text-emerald hover:bg-stone/60 hover:text-gold' : 'text-cream/90 hover:bg-cream/10'
      }`}
    >
      {children}
    </a>
  )
}
