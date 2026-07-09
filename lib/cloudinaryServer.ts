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
