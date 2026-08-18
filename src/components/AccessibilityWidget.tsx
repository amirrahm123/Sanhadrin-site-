import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import {
  Contrast,
  Droplet,
  Link as LinkIcon,
  MousePointer,
  Moon,
  Pause,
  RotateCcw,
  Type,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

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

type StepperKey = 'fontSize' | 'brightness' | 'saturation'

type Settings = Partial<Record<StepperKey, string | null>> & Partial<Record<ToggleKey, boolean>>

// Graded controls: pick-one rows of percentage buttons. `cls: null` is the
// neutral/off step, so "no class on <html>" is always the default state and
// reset simply clears the key.
//
// Every row is rendered in a 3-column grid, so each `steps` list should be a
// multiple of 3 — otherwise the last row sits short (which is exactly how the
// font row used to render 5 + 1).
const STEPPERS: { key: StepperKey; label: string; steps: { cls: string | null; label: string }[] }[] =
  [
    {
      key: 'fontSize',
      label: 'גודל טקסט',
      steps: [
        { cls: 'a11y-font-75', label: '75%' },
        { cls: 'a11y-font-90', label: '90%' },
        { cls: null, label: '100%' },
        { cls: 'a11y-font-110', label: '110%' },
        { cls: 'a11y-font-125', label: '125%' },
        { cls: 'a11y-font-150', label: '150%' },
      ],
    },
    // Deliberately narrow ranges. The panel is portalled into <body>, so the
    // page filter dims/desaturates the panel itself — keeping the extremes
    // mild is what guarantees the controls stay legible enough to undo.
    {
      key: 'brightness',
      label: 'בהירות',
      steps: [
        { cls: 'a11y-bright-75', label: '75%' },
        { cls: null, label: '100%' },
        { cls: 'a11y-bright-125', label: '125%' },
      ],
    },
    {
      key: 'saturation',
      label: 'רוויה',
      steps: [
        { cls: 'a11y-sat-50', label: '50%' },
        { cls: null, label: '100%' },
        { cls: 'a11y-sat-150', label: '150%' },
      ],
    },
  ]

// Real SVG icons rather than text glyphs (◐ ◑ ◒ 🔗 ⏸ 🖱): a bare character
// falls back to whatever the Hebrew font stack has, which is how the reset
// button ended up rendering a stray ט.
const TOGGLES: { key: ToggleKey; cls: string; label: string; icon: LucideIcon }[] = [
  { key: 'contrast', cls: 'a11y-contrast-high', label: 'ניגודיות גבוהה', icon: Contrast },
  { key: 'invert', cls: 'a11y-invert', label: 'ניגודיות הפוכה', icon: Moon },
  { key: 'grayscale', cls: 'a11y-grayscale', label: 'גווני אפור', icon: Droplet },
  { key: 'links', cls: 'a11y-links', label: 'הדגשת קישורים', icon: LinkIcon },
  { key: 'readable', cls: 'a11y-readable', label: 'פונט קריא', icon: Type },
  { key: 'noMotion', cls: 'a11y-no-motion', label: 'עצירת אנימציות', icon: Pause },
  { key: 'cursor', cls: 'a11y-cursor', label: 'סמן גדול', icon: MousePointer },
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
  STEPPERS.forEach((s) => s.steps.forEach((step) => step.cls && html.classList.remove(step.cls)))
  TOGGLES.forEach((t) => html.classList.remove(t.cls))
  // Only re-add a stored class that this row actually owns — never write an
  // arbitrary string from localStorage onto <html> (same rule as the
  // pre-hydration script in index.html).
  STEPPERS.forEach((s) => {
    const cls = settings[s.key]
    if (cls && s.steps.some((step) => step.cls === cls)) html.classList.add(cls)
  })
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

  const setStep = (key: StepperKey, cls: string | null) => update({ ...settings, [key]: cls })
  const toggle = (key: ToggleKey) => update({ ...settings, [key]: !settings[key] })
  // Clears steppers and toggles alike — every setting lives in this one object.
  const reset = () => update({})

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
          {STEPPERS.map((s) => {
            const current = settings[s.key] ?? null
            return (
              <div key={s.key} className="a11y-step-group">
                <div className="a11y-section-label" id={`${titleId}-${s.key}`}>
                  {s.label}
                </div>
                <div
                  className="a11y-step-row"
                  role="group"
                  aria-labelledby={`${titleId}-${s.key}`}
                >
                  {s.steps.map((step) => (
                    <button
                      type="button"
                      key={step.label}
                      className={`a11y-step-btn${step.cls === current ? ' active' : ''}`}
                      aria-pressed={step.cls === current}
                      onClick={() => setStep(s.key, step.cls)}
                    >
                      {step.label}
                    </button>
                  ))}
                </div>
              </div>
            )
          })}

          <div className="a11y-step-group">
            <div className="a11y-section-label" id={`${titleId}-display`}>
              תצוגה
            </div>
            <div className="a11y-toggles" role="group" aria-labelledby={`${titleId}-display`}>
              {TOGGLES.map((t) => {
                const Icon = t.icon
                return (
                  <button
                    type="button"
                    key={t.key}
                    className={`a11y-option-btn${settings[t.key] ? ' active' : ''}`}
                    aria-pressed={!!settings[t.key]}
                    onClick={() => toggle(t.key)}
                  >
                    <Icon size={20} aria-hidden="true" />
                    <span>{t.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* A real SVG icon, not a text glyph — the bare ↺ (U+21BA) fell back
              to a wrong glyph in the Hebrew font stack. */}
          <button type="button" className="a11y-reset-btn" onClick={reset}>
            <RotateCcw size={16} aria-hidden="true" />
            איפוס הגדרות
          </button>

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
