// Best-effort in-memory rate limiter for the serverless functions.
//
// State lives in a single warm instance only (serverless is stateless across
// cold starts and scales horizontally), so this is a speed bump against floods
// and brute force — not a hard guarantee. Lives OUTSIDE api/ so it's never an
// endpoint.
import type { VercelRequest } from '@vercel/node'

type Hit = { count: number; first: number }

// One bucket per logical limiter (e.g. 'login', 'admin-write').
const buckets = new Map<string, Map<string, Hit>>()

function prune(b: Map<string, Hit>, now: number, windowMs: number): void {
  // Opportunistic cleanup so inactive keys don't accumulate forever.
  if (b.size < 1000) return
  for (const [k, hit] of b) {
    if (now - hit.first > windowMs) b.delete(k)
  }
}

/**
 * Returns true when `key` has exceeded `max` requests within `windowMs` for the
 * given `bucket`. The first call in a fresh window always returns false.
 */
export function rateLimited(
  bucket: string,
  key: string,
  opts: { windowMs: number; max: number },
): boolean {
  let b = buckets.get(bucket)
  if (!b) {
    b = new Map()
    buckets.set(bucket, b)
  }
  const now = Date.now()
  prune(b, now, opts.windowMs)
  const hit = b.get(key)
  if (!hit || now - hit.first > opts.windowMs) {
    b.set(key, { count: 1, first: now })
    return false
  }
  hit.count += 1
  return hit.count > opts.max
}

/** Best-effort client IP from Vercel's forwarding header. */
export function clientIp(req: VercelRequest): string {
  const xff = req.headers['x-forwarded-for']
  return String(xff ?? '').split(',')[0].trim() || 'unknown'
}
