import type { VercelRequest, VercelResponse } from '@vercel/node'
import { v2 as cloudinary } from 'cloudinary'
import { FOLDER_BACKED_CATEGORY_IDS, categoryFolderPath } from '../src/data/galleryFolders.js'

// Serverless per-category gallery listing (Vercel, Node runtime).
//
// Each folder-backed category (see src/data/galleryFolders.ts) keeps its photos
// in a Cloudinary folder `gallery/<id>`. We list every configured folder
// server-side via the Admin Search API — the API secret stays in env vars and
// is never shipped to the browser — and return, per category, only the trimmed
// fields the client needs to build keyless delivery URLs. Adding or removing a
// photo in a folder is reflected here within the cache window: no code change,
// no redeploy.
//
// Robust to the account's folder mode: the expression matches BOTH `folder`
// (fixed-folder accounts, where the path lives in the public_id) and
// `asset_folder` (dynamic folders). An empty or failing folder yields [] so the
// client keeps showing that category's designed placeholder tiles.

// Search API caps a page at 500; one page covers even the largest folders here.
const MAX_PER_FOLDER = 500

// Trimmed shape sent to the browser — nothing else from the Admin response leaks.
type GalleryResource = {
  public_id: string
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

async function listFolder(folder: string): Promise<GalleryResource[]> {
  try {
    const result = await cloudinary.search
      .expression(`resource_type:image AND (folder="${folder}" OR asset_folder="${folder}")`)
      .sort_by('created_at', 'desc') // newest first, matching the tag gallery
      .max_results(MAX_PER_FOLDER)
      .execute()

    return ((result.resources as Record<string, unknown>[]) ?? []).map((r) => ({
      public_id: String(r.public_id),
      width: Number(r.width),
      height: Number(r.height),
      created_at: String(r.created_at),
    }))
  } catch (err) {
    // Degrade this folder to empty (→ placeholders) without failing the others.
    console.error(
      `[api/gallery-folders] list failed for ${folder}:`,
      err instanceof Error ? err.message : err,
    )
    return []
  }
}

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  // Short edge cache (+ SWR): folder edits appear within ~30s while the
  // Cloudinary Admin API is shielded to ~one origin sweep per 30s per edge
  // region; stale-while-revalidate serves the cached map during refresh so
  // bursts never hit the rate limit.
  res.setHeader('Cache-Control', 'public, s-maxage=30, stale-while-revalidate=120')

  const ids = FOLDER_BACKED_CATEGORY_IDS
  const lists = await Promise.all(ids.map((id) => listFolder(categoryFolderPath(id))))

  const folders: Record<string, GalleryResource[]> = {}
  ids.forEach((id, i) => {
    folders[id] = lists[i]
  })

  res.status(200).json({ folders })
}
