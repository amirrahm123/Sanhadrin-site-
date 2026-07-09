import type { VercelRequest, VercelResponse } from '@vercel/node'
import { isAuthed } from '../../lib/auth'

// Whether the current request is an authenticated admin. Used by the client to
// gate the /admin dashboard UI. Never cached.
export default function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Cache-Control', 'no-store')
  res.status(200).json({ admin: isAuthed(req) })
}
