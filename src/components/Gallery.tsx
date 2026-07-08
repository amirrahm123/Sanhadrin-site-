import { Section, SectionHeading } from './ui/Section'
import { Reveal } from './ui/Reveal'
import { Button } from './ui/Button'
import { ImagePlaceholder } from './ImagePlaceholder'
import { GALLERY } from '../data/sections'
import { GALLERY_IMAGE_ALT, useCloudinaryGallery } from '../lib/cloudinary'

// Masonry breaks across up to 3 CSS columns; a tile spans ~100/50/33vw.
const TILE_SIZES = '(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw'

export function Gallery() {
  const gallery = useCloudinaryGallery()
  const live = gallery.status === 'ready'

  return (
    <Section id="gallery" className="bg-stone/30">
      <SectionHeading
        eyebrow={GALLERY.eyebrow}
        title={GALLERY.title}
        subtitle={GALLERY.subtitle}
      />

      {/* CSS columns → natural masonry with varied ratios. Shows the live
          Cloudinary folder (newest first); falls back to the designed
          placeholder tiles while loading, when empty, or on error. */}
      <div className="columns-1 gap-4 sm:columns-2 md:gap-5 lg:columns-3">
        {live
          ? gallery.images.map((img, i) => (
              <Reveal
                key={img.publicId}
                delay={(i % 3) * 0.06}
                className="mb-4 break-inside-avoid md:mb-5"
              >
                <ImagePlaceholder
                  src={img.src}
                  srcSet={img.srcSet}
                  sizes={TILE_SIZES}
                  alt={GALLERY_IMAGE_ALT}
                  ratio={img.ratio}
                  className="shadow-soft"
                />
              </Reveal>
            ))
          : GALLERY.tiles.map((tile, i) => (
              <Reveal
                key={`${tile.label}-${i}`}
                delay={(i % 3) * 0.06}
                className="mb-4 break-inside-avoid md:mb-5"
              >
                <ImagePlaceholder label={tile.label} ratio={tile.ratio} className="shadow-soft" />
              </Reveal>
            ))}
      </div>

      <Reveal delay={0.1} className="mt-12 flex justify-center">
        <Button as="a" href="#contact-form" variant="outline" size="lg">
          לתיאום סיור באחוזה
        </Button>
      </Reveal>
    </Section>
  )
}
