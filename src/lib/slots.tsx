// Public slot overrides: fetches the slot→image mapping (/api/slots) once and
// exposes it via context so any ImagePlaceholder with a `slot` prop can swap in
// the manager's chosen photo. Read-only — no admin code, safe on public pages.
import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import type { SlotMap } from '../data/photoSlots'
import { buildResponsiveImage } from './cloudinary'

const SlotsContext = createContext<SlotMap>({})

export function SlotsProvider({ children }: { children: ReactNode }) {
  const [slots, setSlots] = useState<SlotMap>({})

  useEffect(() => {
    let cancelled = false
    fetch('/api/slots', { headers: { Accept: 'application/json' } })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((data: { slots?: SlotMap }) => {
        if (!cancelled && data.slots) setSlots(data.slots)
      })
      .catch(() => {
        /* keep empty → placeholders (today's site) */
      })
    return () => {
      cancelled = true
    }
  }, [])

  return <SlotsContext.Provider value={slots}>{children}</SlotsContext.Provider>
}

export type ResolvedSlotImage = {
  src: string
  srcSet: string
  alt?: string
  /** Per-photo focal point (CSS object-position) if the manager set one. */
  objectPosition?: string
}

/**
 * Resolve a slot key to its override image, or null when there's no override
 * (→ caller renders the designed placeholder). Safe to call without a provider
 * (defaults to no overrides).
 */
export function useSlotOverride(slotKey?: string): ResolvedSlotImage | null {
  const slots = useContext(SlotsContext)
  if (!slotKey) return null
  const entry = slots[slotKey]
  if (!entry?.publicId) return null
  return {
    ...buildResponsiveImage(entry.publicId),
    alt: entry.alt,
    objectPosition: entry.objectPosition,
  }
}
