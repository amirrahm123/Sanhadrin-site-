import type { VercelRequest, VercelResponse } from '@vercel/node'
import { requireAuth } from '../../lib/auth'
import { assertBlobConfigured, readSlots, writeSlots } from '../../lib/blob'
import { clientIp, rateLimited } from '../../lib/rateLimit'
import { isValidSlotKey } from '../../src/data/photoSlots'

// Auth-required. Assigns a photo (publicId + optional alt) to a known slot in
// slots.json (read-modify-write). Rejects unknown slot keys.
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

  const { slotKey, publicId, alt } = (req.body ?? {}) as {
    slotKey?: unknown
    publicId?: unknown
    alt?: unknown
  }

  if (typeof slotKey !== 'string' || !isValidSlotKey(slotKey)) {
    res.status(400).json({ error: 'invalid_slot' })
    return
  }
  if (typeof publicId !== 'string' || !publicId) {
    res.status(400).json({ error: 'invalid_public_id' })
    return
  }

  try {
    assertBlobConfigured()
    const map = await readSlots()
    map[slotKey] = { publicId, ...(typeof alt === 'string' && alt ? { alt } : {}) }
    await writeSlots(map)
    res.status(200).json({ ok: true })
  } catch (err) {
    console.error('[api/admin/set-slot] failed:', err instanceof Error ? err.message : err)
    res.status(500).json({ error: 'set_slot_failed' })
  }
}
