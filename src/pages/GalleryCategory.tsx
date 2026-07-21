import { Head } from 'vite-react-ssg'
import { useParams } from 'react-router-dom'
import { PageHero } from '../components/PageHero'
import { Section } from '../components/ui/Section'
import { GalleryCategoryGrid } from '../components/GalleryCategoryGrid'
import { ContactCta } from '../components/ContactCta'
import { Button } from '../components/ui/Button'
import { BRAND } from '../data/sections'
import { findGalleryCategory, galleryPath } from '../data/galleryData'

/**
 * Dedicated page for one gallery category. The slug maps to an entry in
 * GALLERY_CATEGORIES (galleryData.ts); the build pre-renders one HTML page per
 * category via getStaticPaths in routes.tsx.
 */
export function Component() {
  const { slug } = useParams()
  const category = findGalleryCategory(slug)

  if (!category) {
    return (
      <>
        <Head>
          <title>הדף לא נמצא | {BRAND.he}</title>
          <meta name="robots" content="noindex" />
        </Head>
        <PageHero
          title="הדף לא נמצא"
          subtitle="הקטגוריה שחיפשתם אינה קיימת. חזרו לגלריה המלאה."
          breadcrumbs={[{ label: 'גלריה', to: '/gallery' }, { label: '404' }]}
          showCta={false}
        />
        <section className="bg-cream px-5 py-20 text-center sm:px-8 lg:px-10">
          <div className="mx-auto flex max-w-md flex-col items-center gap-6">
            <Button as="link" to="/gallery" variant="primary" size="lg">
              חזרה לגלריה
            </Button>
          </div>
        </section>
      </>
    )
  }

  return (
    <>
      <PageHero
        path={galleryPath(category.id)}
        eyebrow="Gallery"
        breadcrumbs={[{ label: 'גלריה', to: '/gallery' }, { label: category.title }]}
      />
      <Section id={`gallery-${category.id}`}>
        <GalleryCategoryGrid category={category} />
      </Section>
      <ContactCta location={`gallery_${category.id}`} />
    </>
  )
}
