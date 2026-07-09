import type { VercelRequest, VercelResponse } from '@vercel/node'
import { requireAuth } from '../../lib/auth'
import { cloudinary, GALLERY_TAG, SLOT_FOLDER } from '../../lib/cloudinaryServer'

// ~6MB decoded ceiling — comfortably under Vercel's request body cap. The
// client downscales before sending, so real payloads are far smaller.
const MAX_BASE64_LEN = 8_000_000

// Auth-required. Accepts a base64 data-URI image and uploads it to Cloudinary
// server-side. target:'gallery' tags it for the public gallery; anything else
// is a slot image, tucked in its own folder (never shown in the gallery).
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!requireAuth(req, res)) return
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'method_not_allowed' })
    return
  }

  const { image, target } = (req.body ?? {}) as { image?: unknown; target?: unknown }

  if (typeof image !== 'string' || !/^data:image\/[a-z0-9.+-]+;base64,/i.test(image)) {
    res.status(400).json({ error: 'invalid_image' })
    return
  }
  if (image.length > MAX_BASE64_LEN) {
    res.status(413).json({ error: 'image_too_large' })
    return
  }

  const isGallery = target === 'gallery'
  try {
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
