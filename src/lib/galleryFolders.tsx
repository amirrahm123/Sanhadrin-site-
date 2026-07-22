// Public per-category gallery photos: fetches the live folder listing
// (/api/gallery-folders) once and exposes it via context, so both the gallery
// landing cards and the per-category grids show whatever is in each Cloudinary
// folder. Read-only — no admin code, safe on public pages.
//
// Runs only in the browser (useEffect), so the live folders are reflected
// without a redeploy. During SSG / first paint (and on any fetch error, or for
// a still-empty folder) the map is empty and callers fall back to the category's
// designed placeholder tiles — good for SEO and never looks broken.
import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import type { GalleryCategory, GalleryImage } from '../data/galleryData'

// category id → ordered Cloudinary public_ids for that folder (newest first).
type FolderMap = Record<string, string[]>

const GalleryFoldersContext = createContext<FolderMap>({})

export function GalleryFoldersProvider({ children }: { children: ReactNode }) {
  const [folders, setFolders] = useState<FolderMap>({})

  useEffect(() => {
    let cancelled = false
    fetch('/api/gallery-folders', { headers: { Accept: 'application/json' } })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((data: { folders?: Record<string, { public_id: string }[]> }) => {
        if (cancelled || !data.folders) return
        const map: FolderMap = {}
        for (const [id, resources] of Object.entries(data.folders)) {
          map[id] = (resources ?? []).map((r) => r.public_id)
        }
        setFolders(map)
      })
      .catch(() => {
        /* keep empty → placeholders (today's site) */
      })
    return () => {
      cancelled = true
    }
  }, [])

  return <GalleryFoldersContext.Provider value={folders}>{children}</GalleryFoldersContext.Provider>
}

/**
 * The images to render for a category: the live folder photos (as GalleryImage
 * entries carrying the category's ratio + alt) when its Cloudinary folder has
 * any, otherwise the category's static placeholder tiles. Callers render the
 * result exactly the same either way.
 */
export function useCategoryImages(category: GalleryCategory): GalleryImage[] {
  const publicIds = useContext(GalleryFoldersContext)[category.id]
  if (!publicIds || publicIds.length === 0) return category.images
  return publicIds.map((publicId) => ({
    publicId,
    ratio: category.ratio,
    alt: category.photoAlt,
  }))
}
