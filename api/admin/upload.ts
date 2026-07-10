import type { VercelRequest, VercelResponse } from '@vercel/node'
import { requireAuth } from '../../lib/auth.js'
import { clientIp, rateLimited } from '../../lib/rateLimit.js'
import { assertCloudinaryConfigured, cloudinary, GALLERY_TAG, SLOT_FOLDER } from '../../lib/cloudinaryServer.js'

// The whole JSON body must stay under Vercel's ~4.5 MB serverless request cap;
// the data-URI string dominates it, so cap the string well below that. The
// client downscales/re-encodes to stay under this, so real payloads are far
// smaller — this is the server-side backstop.
const MAX_DATAURL_LEN = 4_000_000

// Only raster formats a browser <img> can actually render. Validated twice: the
// declared data-URI mime here, then the decoded magic bytes below (a lying
// header is rejected).
const ALLOWED_MIME = /^data:image\/(jpeg|png|webp|gif|avif);base64,/i

// Confirm the decoded bytes really start with a known image signature, so a
// forged `data:image/png;base64,` header wrapping arbitrary bytes is rejected.
function looksLikeImage(base64: string): boolean {
  const buf = Buffer.from(base64.slice(0, 64), 'base64')
  if (buf.length < 12) return false
  // JPEG FF D8 FF
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return true
  // PNG 89 50 4E 47
  if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) return true
  // GIF 47 49 46 38
  if (buf[0] === 0x47 && buf[1] === 0x49 && buf[2] === 0x46 && buf[3] === 0x38) return true
  // WEBP 'RIFF'....'WEBP'
  if (
    buf[0] === 0x52 && buf[1] === 0x49 && buf[2] === 0x46 && buf[3] === 0x46 &&
    buf[8] === 0x57 && buf[9] === 0x45 && buf[10] === 0x42 && buf[11] === 0x50
  ) {
    return true
  }
  // AVIF: an ISO-BMFF 'ftyp' box carrying the 'avif' brand near the start.
  const head = buf.subarray(0, 48).toString('latin1')
  if (buf.subarray(4, 8).toString('latin1') === 'ftyp' && head.includes('avif')) return true
  return false
}

// Auth-required. Accepts a base64 data-URI image and uploads it to Cloudinary
// server-side. target:'gallery' tags it for the public gallery; anything else
// is a slot image, tucked in its own folder (never shown in the gallery).
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

  const { image, target } = (req.body ?? {}) as { image?: unknown; target?: unknown }

  if (typeof image !== 'string' || !ALLOWED_MIME.test(image)) {
    res.status(400).json({ error: 'invalid_image' })
    return
  }
  if (image.length > MAX_DATAURL_LEN) {
    res.status(413).json({ error: 'image_too_large' })
    return
  }
  if (!looksLikeImage(image.slice(image.indexOf(',') + 1))) {
    res.status(400).json({ error: 'invalid_image' })
    return
  }

  const isGallery = target === 'gallery'
  try {
    assertCloudinaryConfigured()
    const result = await cloudinary.uploader.upload(
      image,
      isGallery ? { folder: GALLERY_TAG, tags: [GALLERY_TAG] } : { folder: SLOT_FOLDER },
    )
    res.status(200).json({
      publicId: result.public_id,
      width: result.width,
      height: result.height,
    })
  } catch (err) {
    console.error('[api/admin/upload] failed:', err instanceof Error ? err.message : err)
    res.status(500).json({ error: 'upload_failed' })
  }
}
