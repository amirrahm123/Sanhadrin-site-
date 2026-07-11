import type { VercelRequest, VercelResponse } from '@vercel/node'
import { v2 as cloudinary } from 'cloudinary'

// Serverless gallery listing (Vercel, Node runtime).
//
// The keyless `res.cloudinary.com/.../image/list/<tag>.json` endpoint is locked
// on this account (401), so we list server-side via the Cloudinary Admin API
// with the API secret kept in env vars — never shipped to the browser. The
// client fetches `/api/gallery` and gets back only the fields it needs to build
// delivery URLs; delivery itself (f_auto/q_auto/...) still works keylessly.
//
// Photos are curated by TAG: any asset tagged `sandrine_gallery` appears here.

// The `sandrine_gallery` tag is how the social-media manager marks a photo for
// the gallery. Tag-based listing is folder-structure agnostic, so it works
// regardless of the account's folder mode.
const GALLERY_TAG = 'sandrine_gallery'
const MAX_RESULTS = 100

// Trimmed shape sent to the browser — nothing from the Admin response leaks
// beyond these five fields.
type GalleryResource = {
  public_id: string
  format: string
  width: number
  height: number
  created_at: string
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
})

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Short edge cache (+ SWR) so gallery edits show on the public site within
  // ~10s while still shielding the Cloudinary Admin API: at most ~one origin
  // call per 10s per edge region, and stale-while-revalidate serves the cached
  // list during refresh so bursts never hit the rate limit.
  res.setHeader('Cache-Control', 'public, s-maxage=10, stale-while-revalidate=30')

  try {
    const result = await cloudinary.api.resources_by_tag(GALLERY_TAG, {
      max_results: MAX_RESULTS,
      // Don't pull tags/context/metadata we don't need.
      resource_type: 'image',
    })

    const resources: GalleryResource[] = (result.resources ?? [])
      .map((r: Record<string, unknown>) => ({
        public_id: String(r.public_id),
        format: String(r.format),
        width: Number(r.width),
        height: Number(r.height),
        created_at: String(r.created_at),
      }))
      // Newest first.
      .sort((a, b) => (a.created_at < b.created_at ? 1 : a.created_at > b.created_at ? -1 : 0))

    res.status(200).json({ resources })
  } catch (err) {
    // Log server-side only (message, never the credentials) and degrade to an
    // empty list so the client falls back to placeholder tiles.
    console.error('[api/gallery] Cloudinary list failed:', err instanceof Error ? err.message : err)
    res.status(200).json({ resources: [] })
  }
}
