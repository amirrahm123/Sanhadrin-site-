import { Reveal } from './ui/Reveal'
import { ImagePlaceholder } from './ImagePlaceholder'
import type { GalleryCategory } from '../data/galleryData'

// Grid tile can span the full row on mobile down to a quarter on desktop.
const TILE_SIZES = '(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw'

/**
 * The image grid for a single gallery category: 2 cols on mobile, 3 on tablet,
 * 4 on desktop. Reuses the designed ImagePlaceholder — drop a `src` into the
 * category's images (galleryData.ts) to swap in real photos.
 */
export function GalleryCategoryGrid({ category }: { category: GalleryCategory }) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-5 lg:grid-cols-4">
      {category.images.map((img, i) => (
        <Reveal key={`${category.id}-${i}`} delay={(i % 4) * 0.05}>
          <ImagePlaceholder
            src={img.src}
            alt={img.alt}
            sizes={img.src ? TILE_SIZES : undefined}
            ratio={img.ratio ?? '4/5'}
            label={img.src ? undefined : category.title}
            className="shadow-soft"
          />
        </Reveal>
      ))}
    </div>
  )
}
