import { PageHero } from '../components/PageHero'
import { Gallery } from '../components/Gallery'
import { ContactCta } from '../components/ContactCta'

export function Component() {
  return (
    <>
      <PageHero
        path="/gallery"
        heroSlot="gallery_hero"
        eyebrow="Gallery"
        subtitle="רגעים, מרחבים ופרטים מתוך אירועים באחוזה — טעימה ממה שמחכה לכם בסנדרין."
      />
      <Gallery />
      <ContactCta location="gallery" />
    </>
  )
}
