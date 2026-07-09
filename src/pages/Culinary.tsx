import { PageHero } from '../components/PageHero'
import { Culinary } from '../components/Culinary'
import { ContactCta } from '../components/ContactCta'

export function Component() {
  return (
    <>
      <PageHero
        path="/culinary"
        heroSlot="culinary_hero"
        eyebrow="Culinary"
        subtitle="מטבח גבוה, חומרי גלם משובחים ועמדות קבלת פנים מכל קצוות העולם — והכול כשר בהשגחת הרבנות."
      />
      <Culinary />
      <ContactCta location="culinary" />
    </>
  )
}
