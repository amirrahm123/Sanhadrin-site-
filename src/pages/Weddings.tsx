import { PageHero } from '../components/PageHero'
import { Weddings } from '../components/Weddings'
import { ContactCta } from '../components/ContactCta'

export function Component() {
  return (
    <>
      <PageHero
        path="/weddings"
        eyebrow="Weddings"
        subtitle="ערב אחד, בול תפור למידותיכם — מקבלת הפנים ועד הריקוד האחרון, בגנים ובאולמות של האחוזה."
        breadcrumbs={[{ label: 'אירועים' }, { label: 'חתונות' }]}
      />
      <Weddings />
      <ContactCta location="weddings" />
    </>
  )
}
