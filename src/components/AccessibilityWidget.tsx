import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'

/**
 * Floating accessibility panel (IS 5568 / תקנות נגישות השירות).
 *
 * Settings live in localStorage and are expressed as classes on <html>, which
 * plain CSS in index.css turns into global display modes. There is no store or
 * context — this component owns the state.
 *
 * SSG NOTE: this render runs in Node during `vite-react-ssg build`, so nothing
 * here may touch `localStorage`, `document` or `window` at render time. State
 * starts empty and is hydrated from storage in an effect; every browser API is
 * behind a `typeof window` guard. The saved classes are applied *before*
 * hydration by the inline script in index.html, so there is no flash — this
 * component only has to keep them in sync afterwards.
 */

const STORAGE_KEY = 'sandrine-a11y'

type ToggleKey = 'contrast' | 'invert' | 'grayscale' | 'links' | 'readable' | 'noMotion' | 'cursor'

type Settings = {
  fontSize?: string | null
} & Partial<Record<ToggleKey, boolean>>

const FONT_SIZES: { cls: string | null; label: string }[] = [
  { cls: 'a11y-font-75', label: '75%' },
  { cls: 'a11y-font-90', label: '90%' },
  { cls: null, label: '100%' },
  { cls: 'a11y-font-110', label: '110%' },
  { cls: 'a11y-font-125', label: '125%' },
  { cls: 'a11y-font-150', label: '150%' },
]

const TOGGLES: { key: ToggleKey; cls: string; label: string; icon: string }[] = [
  { key: 'contrast', cls: 'a11y-contrast-high', label: 'ניגודיות גבוהה', icon: '◐' },
  { key: 'invert', cls: 'a11y-invert', label: 'ניגודיות הפוכה', icon: '◑' },
  { key: 'grayscale', cls: 'a11y-grayscale', label: 'גווני אפור', icon: '◒' },
  { key: 'links', cls: 'a11y-links', label: 'הדגשת קישורים', icon: '🔗' },
  { key: 'readable', cls: 'a11y-readable', label: 'פונט קריא', icon: 'Aa' },
  { key: 'noMotion', cls: 'a11y-no-motion', label: 'עצירת אנימציות', icon: '⏸' },
  { key: 'cursor', cls: 'a11y-cursor', label: 'סמן גדול', icon: '🖱' },
]

const FOCUSABLE =
  'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'

function loadSettings(): Settings {
  if (typeof window === 'undefined') return {}
  try {
    return (JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? 'null') as Settings) || {}
  } catch {
    return {}
  }
}

function saveSettings(s: Settings) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(s))
  } catch {
    /* private mode / quota — the session still works, it just won't persist */
  }
}

function applyToDOM(settings: Settings) {
  if (typeof document === 'undefined') return
  const html = document.documentElement
  FONT_SIZES.forEach((f) => f.cls && html.classList.remove(f.cls))
  TOGGLES.forEach((t) => html.classList.remove(t.cls))
  if (settings.fontSize) html.classList.add(settings.fontSize)
  TOGGLES.forEach((t) => settings[t.key] && html.classList.add(t.cls))
}

export function AccessibilityWidget() {
  const [open, setOpen] = useState(false)
  const [settings, setSettings] = useState<Settings>({})
  // Gate: without it the first apply would run with the empty initial state and
  // wipe the classes the pre-hydration inline script already set.
  const [hydrated, setHydrated] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const titleId = useId()

  useEffect(() => {
    setSettings(loadSettings())
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (hydrated) applyToDOM(settings)
  }, [settings, hydrated])

  // Closing always returns focus to the trigger, however it was closed
  // (Escape, the × button, or a click on the backdrop).
  const close = useCallback(() => {
    setOpen(false)
    triggerRef.current?.focus()
  }, [])

  // Focus into the panel on open, trap Tab inside it, close on Escape.
  useEffect(() => {
    if (!open) return
    const panel = panelRef.current
    if (!panel) return

    panel.querySelector<HTMLElement>(FOCUSABLE)?.focus()

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        close()
        return
      }
      if (e.key !== 'Tab') return
      const items = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE))
      if (items.length === 0) return
      const first = items[0]
      const last = items[items.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, close])

  const update = (next: Settings) => {
    setSettings(next)
    saveSettings(next)
  }

  const setFontSize = (cls: string | null) => update({ ...settings, fontSize: cls })
  const toggle = (key: ToggleKey) => update({ ...settings, [key]: !settings[key] })
  const reset = () => update({})

  const currentFont = settings.fontSize ?? null

  const panel = (
    <div
      className="a11y-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) close()
      }}
    >
      <div
        ref={panelRef}
        className="a11y-panel"
        dir="rtl"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <div className="a11y-panel-header">
          <h2 id={titleId}>הגדרות נגישות</h2>
          <button type="button" className="a11y-panel-close" onClick={close} aria-label="סגירה">
            &times;
          </button>
        </div>

        <div className="a11y-panel-body">
          <div className="a11y-section-label" id={`${titleId}-font`}>
            גודל טקסט
          </div>
          <div className="a11y-font-row" role="group" aria-labelledby={`${titleId}-font`}>
            {FONT_SIZES.map((f) => (
              <button
                type="button"
                key={f.label}
                className={`a11y-font-btn${f.cls === currentFont ? ' active' : ''}`}
                aria-pressed={f.cls === currentFont}
                onClick={() => setFontSize(f.cls)}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="a11y-section-label" id={`${titleId}-display`}>
            תצוגה
          </div>
          <div className="a11y-toggles" role="group" aria-labelledby={`${titleId}-display`}>
            {TOGGLES.map((t) => (
              <button
                type="button"
                key={t.key}
                className={`a11y-option-btn${settings[t.key] ? ' active' : ''}`}
                aria-pressed={!!settings[t.key]}
                onClick={() => toggle(t.key)}
              >
                <span className="a11y-option-icon" aria-hidden="true">
                  {t.icon}
                </span>
                <span>{t.label}</span>
              </button>
            ))}
          </div>

          <button type="button" className="a11y-reset-btn" onClick={reset}>
            <span aria-hidden="true">↺</span> איפוס הגדרות
          </button>

          {/* TODO(launch): /accessibility (הצהרת נגישות) does not exist yet —
              the catch-all route renders the 404 page until it is written.
              The footer link at Footer.tsx should point at the same path. */}
          <Link to="/accessibility" className="a11y-statement-link" onClick={close}>
            למידע נוסף — הצהרת נגישות
          </Link>
        </div>
      </div>
    </div>
  )

  return (
    <>
      <button
        type="button"
        ref={triggerRef}
        className="a11y-float"
        onClick={() => setOpen((o) => !o)}
        aria-label="הגדרות נגישות"
        aria-expanded={open}
        title="הגדרות נגישות"
      >
        <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor" aria-hidden="true">
          <circle cx="12" cy="4" r="2" />
          <path d="M19 13v-2c-1.54.02-3.09-.75-4.07-1.83l-1.29-1.43c-.17-.19-.38-.34-.61-.45-.01 0-.01-.01-.02-.01H13c-.35-.2-.75-.3-1.19-.26C10.76 7.11 10 8.04 10 9.09V15c0 1.1.9 2 2 2h5v5h2v-5.5c0-1.1-.9-2-2-2h-3v-3.45c1.29 1.07 3.25 1.94 5 1.95zm-6.17 5c-.41 1.16-1.52 2-2.83 2-1.66 0-3-1.34-3-3 0-1.31.84-2.41 2-2.83V12.1c-2.28.46-4 2.48-4 4.9 0 2.76 2.24 5 5 5 2.42 0 4.44-1.72 4.9-4h-2.07z" />
        </svg>
      </button>

      {open && typeof document !== 'undefined' && createPortal(panel, document.body)}
    </>
  )
}
