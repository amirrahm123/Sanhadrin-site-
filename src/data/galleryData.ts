// Gallery page category structure. One entry per category, in display order.
//
// To drop in real photos later, just add a `src` (and ideally `alt`) to each
// image entry — an entry with no `src` renders the designed placeholder tile.
// You never need to touch the Gallery component: only edit the data below.

type Ratio = '16/9' | '4/5' | '1/1' | '3/2'

export type GalleryImage = {
  /** Real image path/URL. Leave empty for now → designed placeholder. */
  src?: string
  /** Alt text for the real image (accessibility). */
  alt?: string
  /** Tile aspect ratio. Keep a category's tiles uniform for a clean grid. */
  ratio?: Ratio
}

export type GalleryCategory = {
  /** Stable id used for the section anchor + React keys. */
  id: string
  /** Heading shown above the grid. */
  title: string
  /** Text direction of the heading. English headings use 'ltr'. */
  dir?: 'rtl' | 'ltr'
  images: GalleryImage[]
}

// Six placeholder tiles per category, uniform ratio for a tidy grid. Swap in
// real photos by adding `src` to each entry (or add/remove entries freely).
const placeholders = (ratio: Ratio, count = 6): GalleryImage[] =>
  Array.from({ length: count }, () => ({ ratio }))

export const GALLERY_CATEGORIES: GalleryCategory[] = [
  { id: 'new-garden', title: 'הגן החדש שלנו', images: placeholders('4/5') },
  // Heading kept in English by request ("Exclusive Events").
  { id: 'exclusive-events', title: 'Exclusive Events', dir: 'ltr', images: placeholders('16/9') },
  { id: 'two-halls', title: 'שני אולמות', images: placeholders('4/5') },
  { id: 'event-design', title: 'עיצוב אירועים', images: placeholders('1/1') },
  { id: 'noon-weddings', title: 'חתונות צהריים', images: placeholders('4/5') },
  { id: 'culinary', title: 'קולינריה', images: placeholders('1/1') },
  { id: 'chateau-small-hall', title: 'שאטו - אולם קטן', images: placeholders('4/5') },
  { id: 'palais-large-hall', title: 'פאלה - אולם גדול', images: placeholders('16/9') },
  { id: 'luxury-henna', title: 'חינות יוקרתיות', images: placeholders('4/5') },
  { id: 'winter-weddings', title: 'חתונות חורף', images: placeholders('4/5') },
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
