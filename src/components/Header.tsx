import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Menu, X, ChevronDown, Instagram, Facebook } from 'lucide-react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { NAV_ITEMS, BRAND, CONTACT, HERO, isNavGroup } from '../data/sections'
import { Button } from './ui/Button'
import logoUrl from '../assets/logo.avif'

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const reduce = useReducedMotion()
  const barRef = useRef<HTMLDivElement>(null)
  const { pathname } = useLocation()

  const isHome = pathname === '/'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Publish the measured nav-bar height so anchor scrolling / layout can offset
  // by the real height. Re-measures across breakpoints via ResizeObserver.
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

  // Close the drawer whenever the route changes.
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  // lock body scroll while drawer is open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  // Solid bar when scrolled, when the drawer is open, or on any inner page
  // (only the home hero is dark/full-bleed enough for a transparent bar).
  const solid = scrolled || open || !isHome

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        solid ? 'bg-cream/95 backdrop-blur-md shadow-header' : 'bg-transparent'
      }`}
    >
      <div
        ref={barRef}
        className="mx-auto flex max-w-content items-center justify-between gap-4 px-5 py-4 sm:px-8 lg:px-10"
      >
        {/* Logo (RTL start / top-right). Native 266x180 -> ~1.48:1 aspect. */}
        <Link to="/" className="flex items-center" aria-label={BRAND.he}>
          <img
            src={logoUrl}
            alt={BRAND.he}
            width={266}
            height={180}
            className={`h-16 w-auto md:h-20 ${
              // Extra lift only over the transparent (dark hero) header.
              solid ? '' : 'drop-shadow-[0_2px_10px_rgba(0,0,0,0.45)]'
            }`}
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 xl:flex">
          {NAV_ITEMS.map((item) =>
            isNavGroup(item) ? (
              <NavGroup key={item.label} label={item.label} items={item.children} solid={solid} />
            ) : (
              <NavItemLink key={item.to} to={item.to} label={item.label} solid={solid} />
            ),
          )}
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
            href="#contact-form"
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
                {NAV_ITEMS.map((item) =>
                  isNavGroup(item) ? (
                    <div key={item.label} className="border-b border-stone/50 py-3">
                      <p className="mb-1 text-sm font-semibold uppercase tracking-wider text-gold">
                        {item.label}
                      </p>
                      <div className="flex flex-col">
                        {item.children.map((c) => (
                          <MobileLink
                            key={c.to}
                            to={c.to}
                            label={c.label}
                            nested
                            onNavigate={() => setOpen(false)}
                          />
                        ))}
                      </div>
                    </div>
                  ) : (
                    <MobileLink
                      key={item.to}
                      to={item.to}
                      label={item.label}
                      onNavigate={() => setOpen(false)}
                    />
                  ),
                )}
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
                <Button as="a" href="#contact-form" onClick={() => setOpen(false)} variant="primary">
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

function NavItemLink({ to, label, solid }: { to: string; label: string; solid: boolean }) {
  // Scroll link (e.g. #contact-form) — plain anchor so native/CSS smooth scroll
  // (which honours prefers-reduced-motion) handles it on any page.
  if (to.startsWith('#')) {
    return (
      <a
        href={to}
        className={`relative px-3 py-2 text-sm font-medium transition-colors ${
          solid ? 'text-ink/80 hover:text-emerald' : 'text-cream/90 hover:text-cream'
        }`}
      >
        {label}
      </a>
    )
  }
  return (
    <NavLink
      to={to}
      end={to === '/'}
      className={({ isActive }) =>
        `relative px-3 py-2 text-sm font-medium transition-colors ${
          solid
            ? isActive
              ? 'text-gold'
              : 'text-ink/80 hover:text-emerald'
            : isActive
              ? 'text-gold-soft'
              : 'text-cream/90 hover:text-cream'
        }`
      }
    >
      {({ isActive }) => (
        <>
          {label}
          {isActive && <span className="absolute inset-x-3 -bottom-0.5 h-px bg-gold" />}
        </>
      )}
    </NavLink>
  )
}

/** Desktop dropdown group. Opens on hover and on keyboard focus (focus-within). */
function NavGroup({
  label,
  items,
  solid,
}: {
  label: string
  items: { label: string; to: string }[]
  solid: boolean
}) {
  const { pathname } = useLocation()
  const groupActive = items.some((i) => i.to === pathname)

  return (
    <div className="group relative">
      <button
        type="button"
        aria-haspopup="true"
        className={`inline-flex items-center gap-1 px-3 py-2 text-sm font-medium transition-colors ${
          solid
            ? groupActive
              ? 'text-gold'
              : 'text-ink/80 hover:text-emerald'
            : groupActive
              ? 'text-gold-soft'
              : 'text-cream/90 hover:text-cream'
        }`}
      >
        {label}
        <ChevronDown size={14} className="transition-transform group-hover:rotate-180" />
      </button>
      <div className="invisible absolute right-0 top-full z-50 min-w-[12rem] translate-y-1 pt-2 opacity-0 transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
        {/* Solid cream panel so the dark item text always reads (a transparent
            panel over the dark hero made the items blend in). */}
        <ul className="overflow-hidden rounded-2xl border border-stone bg-ivory p-1.5 shadow-card">
          {items.map((i) => (
            <li key={i.to}>
              <NavLink
                to={i.to}
                className={({ isActive }) =>
                  `block rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${
                    isActive
                      ? 'bg-gold/15 text-gold'
                      : 'text-emerald hover:bg-stone/60 hover:text-gold'
                  }`
                }
              >
                {i.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function MobileLink({
  to,
  label,
  nested = false,
  onNavigate,
}: {
  to: string
  label: string
  nested?: boolean
  onNavigate?: () => void
}) {
  const base = `${nested ? 'py-2.5 text-base' : 'border-b border-stone/50 py-3.5 text-lg'} font-medium transition-colors`

  // Scroll link (e.g. #contact-form) — anchor + close the drawer on tap.
  if (to.startsWith('#')) {
    return (
      <a href={to} onClick={onNavigate} className={`${base} text-ink hover:text-emerald`}>
        {label}
      </a>
    )
  }
  return (
    <NavLink
      to={to}
      end={to === '/'}
      onClick={onNavigate}
      className={({ isActive }) =>
        `${base} ${isActive ? 'text-gold' : 'text-ink hover:text-emerald'}`
      }
    >
      {label}
    </NavLink>
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
