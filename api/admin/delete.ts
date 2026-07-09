import type { VercelRequest, VercelResponse } from '@vercel/node'
import { requireAuth } from '../../lib/auth'
import { assertBlobConfigured, readSlots, writeSlots } from '../../lib/blob'
import { clientIp, rateLimited } from '../../lib/rateLimit'
import { isValidSlotKey } from '../../src/data/photoSlots'
import { assertCloudinaryConfigured, cloudinary } from '../../lib/cloudinaryServer'

// Auth-required.
//   target:'slot'    → clear the slot (revert to placeholder) + delete its asset
//   target:'gallery' → delete a gallery photo by publicId
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

  const { target, slotKey, publicId } = (req.body ?? {}) as {
    target?: unknown
    slotKey?: unknown
    publicId?: unknown
  }

  try {
    if (target === 'slot') {
      if (typeof slotKey !== 'string' || !isValidSlotKey(slotKey)) {
        res.status(400).json({ error: 'invalid_slot' })
        return
      }
      assertBlobConfigured()
      const map = await readSlots()
      const existing = map[slotKey]
      delete map[slotKey]
      await writeSlots(map)
      // Best-effort asset cleanup — never block the slot clear on it.
      if (existing?.publicId) {
        try {
          await cloudinary.uploader.destroy(existing.publicId)
        } catch {
          /* orphaned asset is harmless */
        }
      }
      res.status(200).json({ ok: true })
      return
    }

    if (target === 'gallery') {
      if (typeof publicId !== 'string' || !publicId) {
        res.status(400).json({ error: 'invalid_public_id' })
        return
      }
      assertCloudinaryConfigured()
      await cloudinary.uploader.destroy(publicId)
      res.status(200).json({ ok: true })
      return
    }

    res.status(400).json({ error: 'invalid_target' })
  } catch (err) {
    console.error('[api/admin/delete] failed:', err instanceof Error ? err.message : err)
    res.status(500).json({ error: 'delete_failed' })
  }
}
