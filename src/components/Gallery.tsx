import { Reveal } from './ui/Reveal'
import { Button } from './ui/Button'
import { ImagePlaceholder } from './ImagePlaceholder'
import { GALLERY_CATEGORIES, type GalleryCategory } from '../data/galleryData'

// Grid tile can span the full row on mobile down to a quarter on desktop.
const TILE_SIZES = '(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw'

function CategorySection({ category, index }: { category: GalleryCategory; index: number }) {
  // Alternate a subtle stone wash so adjacent blocks read as separated.
  const banded = index % 2 === 1
  return (
    <section
      id={`gallery-${category.id}`}
      className={`py-16 md:py-20 lg:py-24 ${banded ? 'bg-stone/30' : ''}`}
    >
      <div className="mx-auto w-full max-w-content px-5 sm:px-8 lg:px-10">
        <Reveal className="mb-10 flex flex-col items-center gap-4 text-center md:mb-12">
          <h2
            className="text-3xl leading-tight md:text-4xl lg:text-5xl"
            {...(category.dir === 'ltr' ? { dir: 'ltr' } : {})}
          >
            {category.title}
          </h2>
          <span className="hairline max-w-[7rem]" />
        </Reveal>

        {/* 2 cols on mobile, 3 on tablet, 4 on desktop. */}
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
      </div>
    </section>
  )
}

export function Gallery() {
  return (
    <div id="gallery">
      {GALLERY_CATEGORIES.map((category, index) => (
        <CategorySection key={category.id} category={category} index={index} />
      ))}

      <div className="mx-auto w-full max-w-content px-5 pb-20 sm:px-8 lg:px-10">
        <Reveal className="flex justify-center">
          <Button as="a" href="#contact-form" variant="outline" size="lg">
            לתיאום סיור באחוזה
          </Button>
        </Reveal>
      </div>
    </div>
  )
}
