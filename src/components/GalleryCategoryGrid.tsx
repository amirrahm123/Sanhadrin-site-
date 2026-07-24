import { useState } from 'react'
import Lightbox from 'yet-another-react-lightbox'
import type { SlideImage } from 'yet-another-react-lightbox'
import Zoom from 'yet-another-react-lightbox/plugins/zoom'
import 'yet-another-react-lightbox/styles.css'
import { Reveal } from './ui/Reveal'
import { ImagePlaceholder } from './ImagePlaceholder'
import { resolveGalleryImage, type GalleryCategory, type GalleryImage } from '../data/galleryData'
import { buildLightboxSlide } from '../lib/cloudinary'
import { useCategoryImages } from '../lib/galleryFolders'

// Tile width per breakpoint, matching the grid below (2 cols ≤ desktop, 3 cols
// on desktop) so the browser fetches an appropriately-sized image: ~a third of
// the viewport on desktop, half elsewhere.
const TILE_SIZES = '(min-width: 1024px) 33vw, 50vw'

// A real photo becomes a large, zoomable lightbox slide; a placeholder (no
// publicId/src) is not clickable and has no slide.
function toSlide(img: GalleryImage): SlideImage | null {
  if (img.publicId) {
    return buildLightboxSlide(img.publicId, { alt: img.alt, width: img.width, height: img.height })
  }
  if (img.src) return { src: img.src, ...(img.alt ? { alt: img.alt } : {}) }
  return null
}

/**
 * The image grid for a single gallery category: 2 cols on mobile/tablet, 3 on
 * desktop — a deliberately low, FIXED column count (never tied to how many
 * photos the category has) so each tile stays large and easy to see; extra
 * photos add rows, not narrower columns. Reuses the designed ImagePlaceholder.
 * Photos come live from the category's Cloudinary folder (useCategoryImages),
 * falling back to the designed placeholder tiles until that folder has photos.
 * Clicking a real photo opens a full-screen lightbox (zoom / pan / arrow + swipe
 * navigation, Esc to close).
 */
export function GalleryCategoryGrid({ category }: { category: GalleryCategory }) {
  const images = useCategoryImages(category)
  const [index, setIndex] = useState(-1)

  // Lightbox slides = real photos only, in grid order. `slideOf[i]` maps a grid
  // tile to its slide index (-1 for a non-clickable placeholder), so clicking a
  // tile opens the matching slide even if some tiles have no photo.
  const slides: SlideImage[] = []
  const slideOf = images.map((img) => {
    const slide = toSlide(img)
    if (!slide) return -1
    slides.push(slide)
    return slides.length - 1
  })

  return (
    <>
      <div className="grid grid-cols-2 gap-4 md:gap-5 lg:grid-cols-3">
        {images.map((img, i) => {
          const { src, srcSet } = resolveGalleryImage(img)
          const slideIndex = slideOf[i]
          const tile = (
            <ImagePlaceholder
              src={src}
              srcSet={srcSet}
              alt={img.alt}
              sizes={src ? TILE_SIZES : undefined}
              ratio={img.ratio ?? '4/5'}
              label={src ? undefined : category.title}
              className="shadow-soft"
            />
          )
          return (
            <Reveal key={`${category.id}-${i}`} delay={(i % 3) * 0.05}>
              {slideIndex >= 0 ? (
                <button
                  type="button"
                  onClick={() => setIndex(slideIndex)}
                  aria-label={img.alt ? `הגדלת התמונה: ${img.alt}` : 'הגדלת התמונה'}
                  className="block w-full cursor-zoom-in rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
                >
                  {tile}
                </button>
              ) : (
                tile
              )}
            </Reveal>
          )
        })}
      </div>

      <Lightbox
        open={index >= 0}
        index={Math.max(index, 0)}
        close={() => setIndex(-1)}
        slides={slides}
        plugins={[Zoom]}
        controller={{ closeOnBackdropClick: true }}
        zoom={{ scrollToZoom: true, maxZoomPixelRatio: 3, doubleTapDelay: 300 }}
        styles={{ container: { backgroundColor: 'rgba(0, 0, 0, 0.85)' } }}
      />
    </>
  )
}
