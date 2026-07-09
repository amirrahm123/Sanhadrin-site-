import type { VercelRequest, VercelResponse } from '@vercel/node'
import { createSessionToken, safeEqual, setSessionCookie } from '../../lib/auth'

// Best-effort brute-force throttle. In-memory, so it only spans a single warm
// instance (serverless is stateless across cold starts) — a modest speed bump,
// not a hard limit. Combined with a fixed failure delay + generic errors.
const attempts = new Map<string, { count: number; first: number }>()
const WINDOW_MS = 60_000
const MAX_ATTEMPTS = 10

function tooMany(ip: string): boolean {
  const now = Date.now()
  const rec = attempts.get(ip)
  if (!rec || now - rec.first > WINDOW_MS) {
    attempts.set(ip, { count: 1, first: now })
    return false
  }
  rec.count += 1
  return rec.count > MAX_ATTEMPTS
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'method_not_allowed' })
    return
  }

  const ip = String(req.headers['x-forwarded-for'] ?? '').split(',')[0].trim() || 'unknown'
  if (tooMany(ip)) {
    res.status(429).json({ error: 'too_many_attempts' })
    return
  }

  const { username, password } = (req.body ?? {}) as { username?: unknown; password?: unknown }
  const U = process.env.ADMIN_USERNAME
  const P = process.env.ADMIN_PASSWORD

  const ok =
    !!U &&
    !!P &&
    !!process.env.ADMIN_SESSION_SECRET &&
    typeof username === 'string' &&
    typeof password === 'string' &&
    safeEqual(username, U) &&
    safeEqual(password, P)

  if (!ok) {
    // Slow brute force + never reveal which field was wrong.
    await new Promise((r) => setTimeout(r, 400))
    res.status(401).json({ error: 'invalid_credentials' })
    return
  }

  const token = createSessionToken(username as string)
  if (!token) {
    // Secret missing — fail safe.
    res.status(500).json({ error: 'server_misconfigured' })
    return
  }
  setSessionCookie(res, token)
  res.status(200).json({ ok: true })
}
