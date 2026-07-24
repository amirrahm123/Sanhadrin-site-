import type { VercelRequest, VercelResponse } from '@vercel/node'
import { requireAuth } from '../../lib/auth.js'
import { assertBlobConfigured, readSlots, writeSlots } from '../../lib/blob.js'
import { clientIp, rateLimited } from '../../lib/rateLimit.js'
import { isValidSlotKey } from '../../src/data/photoSlots.js'

// '<x>% <y>%' with each value an integer 0–100 (e.g. '50% 42%'). Matches what
// the admin focal-point editor emits and is safe to place in a CSS
// object-position. Reject anything else.
function isValidObjectPosition(v: string): boolean {
  const m = /^(\d{1,3})% (\d{1,3})%$/.exec(v)
  if (!m) return false
  return Number(m[1]) <= 100 && Number(m[2]) <= 100
}

// Auth-required. Assigns a photo (publicId + optional alt + optional focal
// point) to a known slot in slots.json (read-modify-write). Rejects unknown
// slot keys.
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!requireAuth(req, res)) return
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'method_not_allowed' })
    return
  }
  if (rateLimited('admin-write', clientIp(req), { windowMs: 60_000, max: 120 })) {
    res.status(429).json({ error: 'too_many_requests' })
    return
  }

  const { slotKey, publicId, alt, objectPosition } = (req.body ?? {}) as {
    slotKey?: unknown
    publicId?: unknown
    alt?: unknown
    objectPosition?: unknown
  }

  if (typeof slotKey !== 'string' || !isValidSlotKey(slotKey)) {
    res.status(400).json({ error: 'invalid_slot' })
    return
  }
  if (typeof publicId !== 'string' || !publicId) {
    res.status(400).json({ error: 'invalid_public_id' })
    return
  }
  // Focal point is optional. Accept ONLY the strict '<x>% <y>%' form (0–100) the
  // editor emits, so nothing arbitrary can be written into the style attribute
  // that consumes it on the public site. Anything else is silently dropped.
  const focal = typeof objectPosition === 'string' && isValidObjectPosition(objectPosition)
    ? objectPosition
    : undefined

  try {
    assertBlobConfigured()
    const map = await readSlots()
    map[slotKey] = {
      publicId,
      ...(typeof alt === 'string' && alt ? { alt } : {}),
      ...(focal ? { objectPosition: focal } : {}),
    }
    await writeSlots(map)
    res.status(200).json({ ok: true })
  } catch (err) {
    console.error('[api/admin/set-slot] failed:', err instanceof Error ? err.message : err)
    res.status(500).json({ error: 'set_slot_failed' })
  }
}
