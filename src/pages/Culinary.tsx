import { PageHero } from '../components/PageHero'
import { Culinary } from '../components/Culinary'
import { ContactCta } from '../components/ContactCta'

export function Component() {
  return (
    <>
      <PageHero
        eyebrow="Culinary"
        title="קולינריה"
        subtitle="מטבח גבוה, חומרי גלם משובחים ועמדות קבלת פנים מכל קצוות העולם — והכול כשר בהשגחת הרבנות."
      />
      <Culinary />
      <ContactCta location="culinary" />
    </>
  )
}
