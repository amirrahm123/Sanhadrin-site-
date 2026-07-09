// Client helpers for the admin API. All calls are same-origin and rely on the
// httpOnly session cookie set by /api/auth/login — the browser never sees the
// token contents. Nothing secret lives here.
import type { SlotMap } from '../data/photoSlots'

export async function fetchIsAdmin(): Promise<boolean> {
  try {
    const res = await fetch('/api/auth/me', { headers: { Accept: 'application/json' } })
    if (!res.ok) return false
    const data = (await res.json()) as { admin?: boolean }
    return data.admin === true
  } catch {
    return false
  }
}

/** Returns true on successful login. Generic failure otherwise (no field hints). */
export async function login(username: string, password: string): Promise<boolean> {
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })
    return res.ok
  } catch {
    return false
  }
}

export async function logout(): Promise<void> {
  try {
    await fetch('/api/auth/logout', { method: 'POST' })
  } catch {
    /* ignore */
  }
}

/** Current slot→image map (same public endpoint the site reads). */
export async function fetchSlots(): Promise<SlotMap> {
  try {
    const res = await fetch('/api/slots', { headers: { Accept: 'application/json' } })
    if (!res.ok) return {}
    const data = (await res.json()) as { slots?: SlotMap }
    return data.slots ?? {}
  } catch {
    return {}
  }
}

export type UploadResult = { publicId: string; width?: number; height?: number }

/** Upload a downscaled data-URL image. target 'gallery' tags it for the gallery. */
export async function uploadImage(
  dataUrl: string,
  target: 'slot' | 'gallery',
): Promise<UploadResult | null> {
  try {
    const res = await fetch('/api/admin/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: dataUrl, target }),
    })
    if (!res.ok) return null
    return (await res.json()) as UploadResult
  } catch {
    return null
  }
}

export async function setSlot(slotKey: string, publicId: string, alt?: string): Promise<boolean> {
  try {
    const res = await fetch('/api/admin/set-slot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slotKey, publicId, alt }),
    })
    return res.ok
  } catch {
    return false
  }
}

export async function removeSlot(slotKey: string): Promise<boolean> {
  try {
    const res = await fetch('/api/admin/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ target: 'slot', slotKey }),
    })
    return res.ok
  } catch {
    return false
  }
}

export async function deleteGalleryImage(publicId: string): Promise<boolean> {
  try {
    const res = await fetch('/api/admin/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ target: 'gallery', publicId }),
    })
    return res.ok
  } catch {
    return false
  }
}
