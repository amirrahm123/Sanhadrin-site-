import { PageHero } from '../components/PageHero'
import { Gallery } from '../components/Gallery'
import { ContactCta } from '../components/ContactCta'

export function Component() {
  return (
    <>
      <PageHero
        eyebrow="Gallery"
        title="גלריה"
        subtitle="רגעים, מרחבים ופרטים מתוך אירועים באחוזה — טעימה ממה שמחכה לכם בסנדרין."
      />
      <Gallery />
      <ContactCta location="gallery" />
    </>
  )
}
