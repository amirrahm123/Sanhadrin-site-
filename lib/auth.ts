// Shared server-only auth helpers for the admin serverless functions.
//
// Lives OUTSIDE api/ so Vercel never turns it into an endpoint; the functions
// import it. Sessions are stateless: a signed (HMAC-SHA256) token in an
// httpOnly cookie, verified on every admin request. The signing key and
// credentials come only from env vars — never shipped to the browser.
import crypto from 'node:crypto'
import type { VercelRequest, VercelResponse } from '@vercel/node'

const COOKIE_NAME = 'sandrine_admin'
const SESSION_TTL_MS = 1000 * 60 * 60 * 12 // 12 hours

type Payload = { u: string; exp: number }

function signingKey(): string | undefined {
  return process.env.ADMIN_SESSION_SECRET
}

function b64url(input: string): string {
  return Buffer.from(input).toString('base64url')
}

function hmac(payloadB64: string, key: string): string {
  return crypto.createHmac('sha256', key).update(payloadB64).digest('base64url')
}

/** Create a signed session token, or null if the secret env var is missing. */
export function createSessionToken(username: string): string | null {
  const key = signingKey()
  if (!key) return null
  const payloadB64 = b64url(JSON.stringify({ u: username, exp: Date.now() + SESSION_TTL_MS }))
  return `${payloadB64}.${hmac(payloadB64, key)}`
}

/** Verify a token's signature + expiry. Fails safe (false) on any problem. */
export function verifyToken(token: string | undefined): boolean {
  const key = signingKey()
  if (!key || !token) return false
  const parts = token.split('.')
  if (parts.length !== 2) return false
  const [payloadB64, sig] = parts
  const expected = hmac(payloadB64, key)
  const a = new Uint8Array(Buffer.from(sig))
  const b = new Uint8Array(Buffer.from(expected))
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return false
  try {
    const payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf8')) as Payload
    return typeof payload.exp === 'number' && payload.exp > Date.now()
  } catch {
    return false
  }
}

function parseCookies(header: string | undefined): Record<string, string> {
  const out: Record<string, string> = {}
  if (!header) return out
  for (const part of header.split(';')) {
    const idx = part.indexOf('=')
    if (idx === -1) continue
    const k = part.slice(0, idx).trim()
    if (k) out[k] = decodeURIComponent(part.slice(idx + 1).trim())
  }
  return out
}

/** True if the request carries a valid admin session cookie. */
export function isAuthed(req: VercelRequest): boolean {
  return verifyToken(parseCookies(req.headers.cookie)[COOKIE_NAME])
}

function cookie(value: string, maxAgeSeconds: number): string {
  return `${COOKIE_NAME}=${value}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${maxAgeSeconds}`
}

export function setSessionCookie(res: VercelResponse, token: string): void {
  res.setHeader('Set-Cookie', cookie(token, Math.floor(SESSION_TTL_MS / 1000)))
}

export function clearSessionCookie(res: VercelResponse): void {
  res.setHeader('Set-Cookie', cookie('', 0))
}

/**
 * Guard for admin endpoints. Returns true when authenticated; otherwise writes
 * a 401 and returns false — callers must `if (!requireAuth(req,res)) return`.
 */
export function requireAuth(req: VercelRequest, res: VercelResponse): boolean {
  if (isAuthed(req)) return true
  res.status(401).json({ error: 'unauthorized' })
  return false
}

/** Constant-time string equality that also hides length (compares sha256s). */
export function safeEqual(a: string, b: string): boolean {
  const ha = new Uint8Array(crypto.createHash('sha256').update(a).digest())
  const hb = new Uint8Array(crypto.createHash('sha256').update(b).digest())
  return crypto.timingSafeEqual(ha, hb)
}
