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

// The admin must always see current data, so its reads bypass the edge cache
// that the public site relies on: a unique `t` query param forces a CDN cache
// MISS (Vercel keys on the full URL) and `no-store` skips the browser cache.
// The public endpoints keep their Cache-Control headers untouched — only these
// admin-side fetches opt out. Callers are admin-only (see file header).
function noStore(path: string): Promise<Response> {
  const sep = path.includes('?') ? '&' : '?'
  return fetch(`${path}${sep}t=${Date.now()}`, {
    headers: { Accept: 'application/json' },
    cache: 'no-store',
  })
}

/** Current slot→image map (same public endpoint the site reads). */
export async function fetchSlots(): Promise<SlotMap> {
  try {
    const res = await noStore('/api/slots')
    if (!res.ok) return {}
    const data = (await res.json()) as { slots?: SlotMap }
    return data.slots ?? {}
  } catch {
    return {}
  }
}

export type GalleryItem = { publicId: string; width?: number; height?: number }

/** Current gallery photos (auth not required — same public listing the site uses). */
export async function fetchGallery(): Promise<GalleryItem[]> {
  try {
    const res = await noStore('/api/gallery')
    if (!res.ok) return []
    const data = (await res.json()) as {
      resources?: { public_id: string; width?: number; height?: number }[]
    }
    return (data.resources ?? []).map((r) => ({
      publicId: r.public_id,
      width: r.width,
      height: r.height,
    }))
  } catch {
    return []
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

export type SetSlotOptions = {
  alt?: string
  /** Per-photo focal point as CSS object-position, strict '<x>% <y>%' form. */
  objectPosition?: string
}

export async function setSlot(
  slotKey: string,
  publicId: string,
  opts: SetSlotOptions = {},
): Promise<boolean> {
  try {
    const res = await fetch('/api/admin/set-slot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slotKey, publicId, alt: opts.alt, objectPosition: opts.objectPosition }),
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
