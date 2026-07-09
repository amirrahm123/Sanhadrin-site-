import type { VercelRequest, VercelResponse } from '@vercel/node'
import { createSessionToken, safeEqual, setSessionCookie } from '../../lib/auth'
import { clientIp, rateLimited } from '../../lib/rateLimit'

// Best-effort brute-force throttle (shared in-memory limiter): 10 attempts per
// IP per minute. Serverless is stateless across cold starts, so it's a speed
// bump, not a hard limit — combined with a fixed failure delay + generic errors.
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'method_not_allowed' })
    return
  }

  if (rateLimited('login', clientIp(req), { windowMs: 60_000, max: 10 })) {
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
