import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Menu, X, ChevronDown, Instagram, Facebook } from 'lucide-react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { NAV_ITEMS, BRAND, CONTACT, HERO, isNavGroup } from '../data/sections'
import { Button } from './ui/Button'
import { useBodyScrollLock } from '../hooks/useBodyScrollLock'
import logoUrl from '../assets/logo.avif'

// Same selector the accessibility panel uses for its own trap — one definition
// of "focusable" across the site's two modal surfaces.
const FOCUSABLE =
  'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'

// Tailwind's `xl` — the breakpoint at which the drawer is replaced by the
// desktop nav (`xl:hidden` on the drawer, `xl:flex` on the nav).
const XL_QUERY = '(min-width: 1280px)'

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const reduce = useReducedMotion()
  const barRef = useRef<HTMLDivElement>(null)
  const drawerRef = useRef<HTMLDivElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const drawerId = useId()
  const drawerTitleId = useId()
  const { pathname } = useLocation()

  const isHome = pathname === '/'

  // Closing always hands focus back to the hamburger, however it was closed.
  const closeDrawer = useCallback(() => {
    setOpen(false)
    toggleRef.current?.focus()
  }, [])

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

  // Freeze the page behind the drawer (iOS-safe, keeps the scroll position).
  useBodyScrollLock(open)

  // Crossing up to the desktop breakpoint hides the drawer via CSS while `open`
  // would stay true — leaving the page scroll-locked with nothing on screen to
  // explain it. Close it as soon as the desktop nav takes over.
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return
    const mq = window.matchMedia(XL_QUERY)
    const onChange = (e: MediaQueryListEvent | MediaQueryList) => {
      if (e.matches) setOpen(false)
    }
    onChange(mq)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  // Modal behaviour for the drawer: focus moves in on open, Tab cycles inside
  // it, Escape closes and returns focus to the hamburger.
  useEffect(() => {
    if (!open) return
    const drawer = drawerRef.current
    if (!drawer) return

    drawer.querySelector<HTMLElement>(FOCUSABLE)?.focus({ preventScroll: true })

    const onKey = (e: KeyboardEvent) => {
      // The accessibility panel is a portalled dialog that renders ABOVE this
      // one and runs an identical trap on `document`. When it is open, it owns
      // the keyboard — otherwise both traps would fight over Tab and a single
      // Escape would close both.
      const a11yOverlay = document.querySelector('.a11y-overlay')
      if (a11yOverlay?.contains(document.activeElement)) return

      if (e.key === 'Escape') {
        closeDrawer()
        return
      }
      if (e.key !== 'Tab') return

      // The hamburger sits outside the drawer but belongs to it — it's the
      // close control — and it precedes the drawer in the DOM, so the cycle is
      // [hamburger, ...drawer items] and matches the natural tab order.
      const toggle = toggleRef.current
      const cycle = [
        ...(toggle ? [toggle] : []),
        ...Array.from(drawer.querySelectorAll<HTMLElement>(FOCUSABLE)),
      ]
      if (cycle.length === 0) return
      const first = cycle[0]
      const last = cycle[cycle.length - 1]
      const active = document.activeElement

      if (e.shiftKey && active === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && active === last) {
        e.preventDefault()
        first.focus()
      } else if (!cycle.includes(active as HTMLElement)) {
        // Focus escaped some other way (browser chrome, a stray programmatic
        // focus) — pull it back into the drawer.
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, closeDrawer])

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
        {/* Logo (RTL start / top-right). Native 266x180 -> ~1.48:1 aspect.
            The negative vertical margin (-my-2) lets the mark grow into the
            bar's padding so it reads clearly larger WITHOUT increasing the
            bar's outer height — the row height still tracks the original. */}
        <Link to="/" className="flex items-center" aria-label={BRAND.he}>
          <img
            src={logoUrl}
            alt={BRAND.he}
            width={266}
            height={180}
            className={`-my-2 h-20 w-auto md:h-24 ${
              // Extra lift only over the transparent (dark hero) header.
              solid ? '' : 'drop-shadow-[0_2px_10px_rgba(0,0,0,0.45)]'
            }`}
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 xl:flex">
          {NAV_ITEMS.map((item) =>
            isNavGroup(item) ? (
              <NavGroup
                key={item.label}
                label={item.label}
                to={item.to}
                items={item.children}
                solid={solid}
              />
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
            ref={toggleRef}
            onClick={() => (open ? closeDrawer() : setOpen(true))}
            aria-label={open ? 'סגירת תפריט' : 'פתיחת תפריט'}
            aria-expanded={open}
            aria-controls={drawerId}
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
            // overflow-hidden so the panel is clipped while its height animates
            // — the inner .drawer-scroll element is what actually scrolls.
            className="overflow-hidden xl:hidden"
            initial={reduce ? false : { opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* .drawer-scroll (index.css) caps the height at the visual viewport
                minus the nav bar and scrolls internally, with overscroll
                containment + safe-area padding. */}
            <div
              ref={drawerRef}
              id={drawerId}
              role="dialog"
              aria-modal="true"
              aria-labelledby={drawerTitleId}
              className="drawer-scroll border-t border-stone/70 bg-cream px-5 pt-2 sm:px-8"
            >
              <h2 id={drawerTitleId} className="sr-only">
                תפריט ניווט
              </h2>
              <nav className="flex flex-col">
                {NAV_ITEMS.map((item) =>
                  isNavGroup(item) ? (
                    <div key={item.label} className="border-b border-stone/50 py-3">
                      {item.to ? (
                        <NavLink
                          to={item.to}
                          end
                          onClick={() => setOpen(false)}
                          className={({ isActive }) =>
                            // Drawer sits on cream: gold-soft was 1.60:1 here,
                            // the worst pair on the site. Both states use
                            // gold-deep now, with an underline (not colour
                            // alone) marking the current page.
                            `mb-1 block text-sm font-semibold uppercase tracking-wider text-gold-deep transition-colors ${
                              isActive ? 'underline underline-offset-4' : 'hover:text-emerald'
                            }`
                          }
                        >
                          {item.label}
                        </NavLink>
                      ) : (
                        <p className="mb-1 text-sm font-semibold uppercase tracking-wider text-gold-deep">
                          {item.label}
                        </p>
                      )}
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
        className={`relative px-3 py-2 text-base font-medium transition-colors ${
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
        // solid = cream bar → gold-deep (4.78:1); transparent = over the dark
        // hero → gold-soft. Same accent, picked per surface.
        `relative px-3 py-2 text-base font-medium transition-colors ${
          solid
            ? isActive
              ? 'text-gold-deep'
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

/**
 * Desktop dropdown group. Opens on hover and on keyboard focus — but the open
 * state now lives in React rather than in `group-hover:` classes, so the trigger
 * can expose `aria-expanded`/`aria-controls` and Escape can dismiss the panel.
 * A CSS-only dropdown can do neither: the state is invisible to assistive tech
 * and unreachable from the keyboard.
 */
function NavGroup({
  label,
  to,
  items,
  solid,
}: {
  label: string
  /** When set, the group label itself links here (e.g. גלריה → landing). */
  to?: string
  items: { label: string; to: string }[]
  solid: boolean
}) {
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLAnchorElement & HTMLButtonElement>(null)
  const panelId = useId()
  // Active when the label's own route or any child route is current.
  const groupActive = to === pathname || items.some((i) => i.to === pathname)

  const triggerCls = `inline-flex items-center gap-1 px-3 py-2 text-base font-medium transition-colors ${
    solid
      ? groupActive
        ? 'text-gold-deep'
        : 'text-ink/80 hover:text-emerald'
      : groupActive
        ? 'text-gold-soft'
        : 'text-cream/90 hover:text-cream'
  }`

  const triggerProps = {
    className: triggerCls,
    'aria-expanded': open,
    'aria-controls': panelId,
  }

  return (
    <div
      ref={wrapRef}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      // Don't yank the panel away on mouse-out while the keyboard is inside it.
      onMouseLeave={() => {
        if (!wrapRef.current?.contains(document.activeElement)) setOpen(false)
      }}
      // React maps onFocus/onBlur to focusin/focusout, so these fire for
      // anything inside the group — the keyboard equivalent of hover.
      onFocus={() => setOpen(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setOpen(false)
      }}
      onKeyDown={(e) => {
        if (e.key === 'Escape' && open) {
          setOpen(false)
          triggerRef.current?.focus()
        }
      }}
    >
      {to ? (
        <NavLink to={to} end ref={triggerRef} {...triggerProps}>
          {label}
          <ChevronDown
            size={14}
            className={`transition-transform ${open ? 'rotate-180' : ''}`}
          />
        </NavLink>
      ) : (
        <button type="button" ref={triggerRef} {...triggerProps}>
          {label}
          <ChevronDown
            size={14}
            className={`transition-transform ${open ? 'rotate-180' : ''}`}
          />
        </button>
      )}
      <div
        id={panelId}
        className={`absolute right-0 top-full z-50 min-w-[12rem] pt-2 transition-all duration-200 ${
          open ? 'visible translate-y-0 opacity-100' : 'invisible translate-y-1 opacity-0'
        }`}
      >
        {/* Solid cream panel so the dark item text always reads (a transparent
            panel over the dark hero made the items blend in). */}
        <ul className="overflow-hidden rounded-2xl border border-stone bg-ivory p-1.5 shadow-card">
          {items.map((i) => (
            <li key={i.to}>
              <NavLink
                to={i.to}
                className={({ isActive }) =>
                  // Ivory panel → gold-deep on both the active row's gold/15
                  // tint (4.65:1) and the plain panel (5.24:1).
                  `block rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${
                    isActive
                      ? 'bg-gold/15 text-gold-deep'
                      : 'text-emerald hover:bg-stone/60 hover:text-gold-deep'
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
        // Cream drawer → gold-deep, plus an underline so the current page is
        // not signalled by colour alone.
        `${base} ${
          isActive ? 'text-gold-deep underline underline-offset-4' : 'text-ink hover:text-emerald'
        }`
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
