import type { VercelRequest, VercelResponse } from '@vercel/node'
import { readSlots } from '../lib/blob.js'
import { clientIp, rateLimited } from '../lib/rateLimit.js'

// Public, read-only: the current slot→image mapping so the public site can
// render the chosen photos. Only public image ids — safe to expose. Briefly
// edge-cached so visitors get a fast cached response while admin writes
// propagate to the public site within ~10s.
export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Cache-Control', 'public, s-maxage=10, stale-while-revalidate=30')

  // Cheapest of the three public reads (one Blob fetch), but still a billed
  // origin call that a varying query string can force past the edge cache.
  // Loosest limit of the three: every page load needs this one.
  if (rateLimited('public-read', clientIp(req), { windowMs: 60_000, max: 120 })) {
    res.status(429).json({ error: 'too_many_requests' })
    return
  }

  const slots = await readSlots()
  res.status(200).json({ slots })
}
