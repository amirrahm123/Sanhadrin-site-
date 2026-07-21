import { Link } from 'react-router-dom'
import { Section, SectionHeading } from './ui/Section'
import { Reveal } from './ui/Reveal'
import { ImagePlaceholder } from './ImagePlaceholder'
import { GALLERY } from '../data/sections'
import { GALLERY_CATEGORIES, galleryPath, type GalleryCategory } from '../data/galleryData'

const CARD_SIZES = '(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw'

/**
 * Gallery landing / index — one clickable card per category. Cards and the nav
 * dropdown both read from GALLERY_CATEGORIES, so the set stays in sync.
 */
export function Gallery() {
  return (
    <Section id="gallery" className="bg-stone/30">
      <SectionHeading
        eyebrow={GALLERY.eyebrow}
        title={GALLERY.title}
        subtitle={GALLERY.subtitle}
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
        {GALLERY_CATEGORIES.map((category, i) => (
          <Reveal key={category.id} delay={(i % 3) * 0.06}>
            <CategoryCard category={category} />
          </Reveal>
        ))}
      </div>
    </Section>
  )
}

function CategoryCard({ category }: { category: GalleryCategory }) {
  const cover = category.images[0]
  return (
    <Link
      to={galleryPath(category.id)}
      className="group block overflow-hidden rounded-2xl shadow-soft transition-shadow hover:shadow-card focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
      aria-label={category.title}
    >
      <div className="relative">
        <ImagePlaceholder
          src={cover?.src}
          alt={cover?.alt}
          sizes={cover?.src ? CARD_SIZES : undefined}
          ratio="4/5"
          label={cover?.src ? undefined : category.title}
          rounded={false}
          className="transition-transform duration-500 group-hover:scale-[1.03]"
        />
        {/* Title plate — always legible over photo or placeholder. */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-emerald-deep/80 via-emerald-deep/30 to-transparent p-5 pt-12">
          <h3
            className="font-serif text-xl font-semibold text-cream md:text-2xl"
            {...(category.dir === 'ltr' ? { dir: 'ltr' } : {})}
          >
            {category.title}
          </h3>
        </div>
      </div>
    </Link>
  )
}
