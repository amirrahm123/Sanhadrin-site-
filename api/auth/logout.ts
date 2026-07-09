import type { VercelRequest, VercelResponse } from '@vercel/node'
import { clearSessionCookie } from '../../lib/auth'

export default function handler(req: VercelRequest, res: VercelResponse) {
  clearSessionCookie(res)
  res.status(200).json({ ok: true })
}
