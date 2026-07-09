// Server-only Cloudinary SDK, configured from env vars (secret never leaves the
// server). Shared by the admin upload/delete functions. Outside api/ so it's
// never an endpoint.
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
})

export { cloudinary }

// The gallery is curated by this tag; slot images go in their own folder so
// they never leak into the public gallery listing.
export const GALLERY_TAG = 'sandrine_gallery'
export const SLOT_FOLDER = 'sandrine_slots'

// Call inside a handler (never at module load, so importing this file stays
// side-effect-free for tests). Throws with a clear message the handler logs and
// turns into a 500, instead of a cryptic Cloudinary auth error deep in a call.
export function assertCloudinaryConfigured(): void {
  const missing = (
    ['CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET'] as const
  ).filter((k) => !process.env[k])
  if (missing.length > 0) {
    throw new Error(`cloudinary not configured — missing env: ${missing.join(', ')}`)
  }
}
