// Gallery page category structure. One entry per category, in display order.
//
// Photos come from one of two places:
//
// 1. FOLDER-BACKED categories (see src/data/galleryFolders.ts) show whatever
//    lives in their Cloudinary folder `gallery/<id>`, listed live by
//    /api/gallery-folders. Add/remove photos in the Media Library and the site
//    updates with no code change. Until a folder has photos, the category shows
//    the designed placeholder tiles below (`images`).
//
// 2. Any category may also hardcode images inline by giving an entry a
//    `publicId` (preferred) or `src` — used for the non-folder-backed
//    categories. An entry with neither renders the designed placeholder tile.

import { buildResponsiveImage } from '../lib/cloudinary'

type Ratio = '16/9' | '4/5' | '1/1' | '3/2'

export type GalleryImage = {
  /**
   * Cloudinary public_id (preferred). Resolved to an optimized, responsive
   * delivery URL by resolveGalleryImage(). Wins over `src` when both are set.
   */
  publicId?: string
  /** Raw image URL for a one-off external image. Ignored if `publicId` is set. */
  src?: string
  /** Alt text for the real image (accessibility). */
  alt?: string
  /** Tile aspect ratio. Keep a category's tiles uniform for a clean grid. */
  ratio?: Ratio
  /** Intrinsic pixel dimensions (folder photos) — used for lightbox zoom limits. */
  width?: number
  height?: number
}

/**
 * Resolve a gallery image to what an <img> needs. A `publicId` becomes an
 * optimized f_auto/q_auto src + 600/1200 responsive srcSet; otherwise the raw
 * `src` is used as-is (no srcSet). Returns empty when neither is set → the
 * caller renders the designed placeholder.
 */
export function resolveGalleryImage(img: GalleryImage): { src?: string; srcSet?: string } {
  if (img.publicId) return buildResponsiveImage(img.publicId)
  return { src: img.src }
}

export type GalleryCategory = {
  /** Stable id used for the section anchor + React keys. */
  id: string
  /** Heading shown above the grid. */
  title: string
  /** Text direction of the heading. English headings use 'ltr'. */
  dir?: 'rtl' | 'ltr'
  /** Uniform tile ratio — used for placeholders and for folder-listed photos. */
  ratio: Ratio
  /** Alt text applied to folder-listed photos (accessibility). */
  photoAlt?: string
  /** Static fallback tiles: designed placeholders shown until real photos exist. */
  images: GalleryImage[]
}

// Placeholder tiles for a category, uniform ratio for a tidy grid. Shown until a
// folder-backed category has real photos (or for categories with no photos yet).
const placeholders = (ratio: Ratio, count = 6): GalleryImage[] =>
  Array.from({ length: count }, () => ({ ratio }))

// A folder-backed category: photos are listed live from `gallery/<id>` (see
// galleryFolders.ts) — no image is hardcoded here. `images` is the placeholder
// fallback shown until that folder has photos. To wire real photos, just upload
// them to the matching folder in the Cloudinary Media Library (no code change).
const folderCategory = (
  id: string,
  title: string,
  ratio: Ratio,
  photoAlt: string,
  extra: { dir?: 'rtl' | 'ltr' } = {},
): GalleryCategory => ({ id, title, ratio, photoAlt, images: placeholders(ratio), ...extra })

export const GALLERY_CATEGORIES: GalleryCategory[] = [
  folderCategory('new-garden', 'הגן החדש שלנו', '4/5', 'הגן החדש באחוזת סנדרין'),
  // Heading kept in English by request ("Exclusive Events").
  folderCategory('exclusive-events', 'Exclusive Events', '16/9', 'Exclusive event at Sandrine', {
    dir: 'ltr',
  }),
  folderCategory('two-halls', 'שני אולמות', '4/5', 'שני האולמות באחוזת סנדרין'),
  { id: 'event-design', title: 'עיצוב אירועים', ratio: '1/1', images: placeholders('1/1') },
  // The 'החופה החדשה' set lives in this folder.
  folderCategory('noon-weddings', 'חתונות צהריים', '4/5', 'חתונת צהריים באחוזת סנדרין'),
  folderCategory('culinary', 'קולינריה', '1/1', 'קולינריה באחוזת סנדרין'),
  { id: 'chateau-small-hall', title: 'שאטו - אולם קטן', ratio: '4/5', images: placeholders('4/5') },
  folderCategory('palais-large-hall', 'פאלה - אולם גדול', '16/9', 'אולם פאלה הגדול באחוזת סנדרין'),
  folderCategory('luxury-henna', 'חינות יוקרתיות', '4/5', 'חינה יוקרתית באחוזת סנדרין'),
  folderCategory('winter-weddings', 'חתונות חורף', '4/5', 'חתונת חורף באחוזת סנדרין'),
]

/** Base path for the gallery section. */
export const GALLERY_BASE = '/gallery'

/** Route path for a single category page, e.g. "/gallery/new-garden". */
export const galleryPath = (id: string) => `${GALLERY_BASE}/${id}`

/** Look up a category by its id/slug (undefined if unknown). */
export const findGalleryCategory = (id: string | undefined) =>
  GALLERY_CATEGORIES.find((c) => c.id === id)

/**
 * Category links derived from the config above — consumed by both the nav
 * dropdown and the landing-page cards, so nothing is ever duplicated.
 */
export const GALLERY_NAV_LINKS = GALLERY_CATEGORIES.map((c) => ({
  label: c.title,
  to: galleryPath(c.id),
}))
