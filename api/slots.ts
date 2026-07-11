import type { VercelRequest, VercelResponse } from '@vercel/node'
import { readSlots } from '../lib/blob.js'

// Public, read-only: the current slot→image mapping so the public site can
// render the chosen photos. Only public image ids — safe to expose. Briefly
// edge-cached so visitors get a fast cached response while admin writes
// propagate to the public site within ~10s.
export default async function handler(_req: VercelRequest, res: VercelResponse) {
  res.setHeader('Cache-Control', 'public, s-maxage=10, stale-while-revalidate=30')
  const slots = await readSlots()
  res.status(200).json({ slots })
}
