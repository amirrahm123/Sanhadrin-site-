import { Reveal } from './ui/Reveal'
import { ImagePlaceholder } from './ImagePlaceholder'
import { resolveGalleryImage, type GalleryCategory } from '../data/galleryData'
import { useCategoryImages } from '../lib/galleryFolders'

// Grid tile can span the full row on mobile down to a quarter on desktop.
const TILE_SIZES = '(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw'

/**
 * The image grid for a single gallery category: 2 cols on mobile, 3 on tablet,
 * 4 on desktop. Reuses the designed ImagePlaceholder. Photos come live from the
 * category's Cloudinary folder (useCategoryImages), falling back to the designed
 * placeholder tiles until that folder has photos.
 */
export function GalleryCategoryGrid({ category }: { category: GalleryCategory }) {
  const images = useCategoryImages(category)
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-5 lg:grid-cols-4">
      {images.map((img, i) => {
        const { src, srcSet } = resolveGalleryImage(img)
        return (
          <Reveal key={`${category.id}-${i}`} delay={(i % 4) * 0.05}>
            <ImagePlaceholder
              src={src}
              srcSet={srcSet}
              alt={img.alt}
              sizes={src ? TILE_SIZES : undefined}
              ratio={img.ratio ?? '4/5'}
              label={src ? undefined : category.title}
              className="shadow-soft"
            />
          </Reveal>
        )
      })}
    </div>
  )
}
