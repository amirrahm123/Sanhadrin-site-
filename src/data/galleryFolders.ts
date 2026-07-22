// Which gallery categories are "folder-backed": their photos live in a
// Cloudinary folder named `gallery/<id>` (id === the category id in
// galleryData.ts) and are listed live by /api/gallery-folders, so adding or
// removing a photo in the Media Library updates the site with no code change.
//
// Pure data, ZERO imports: safe to import from both the React client and the
// serverless functions under api/ without pulling React into the function
// bundle (mirrors photoSlots.ts). To make a NEW category folder-backed, add its
// id here and create the matching `gallery/<id>` folder in Cloudinary.

export const GALLERY_FOLDER_ROOT = 'gallery'

export const FOLDER_BACKED_CATEGORY_IDS = [
  'new-garden',
  'exclusive-events',
  'noon-weddings',
  'culinary',
  'luxury-henna',
  'winter-weddings',
] as const

export type FolderBackedCategoryId = (typeof FOLDER_BACKED_CATEGORY_IDS)[number]

/** Cloudinary folder path for a category id, e.g. 'gallery/culinary'. */
export const categoryFolderPath = (id: string): string => `${GALLERY_FOLDER_ROOT}/${id}`

export const isFolderBackedCategory = (id: string): boolean =>
  (FOLDER_BACKED_CATEGORY_IDS as readonly string[]).includes(id)
