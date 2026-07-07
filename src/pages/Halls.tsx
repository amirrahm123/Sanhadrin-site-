import { PageHero } from '../components/PageHero'
import { Halls } from '../components/Halls'
import { ContactCta } from '../components/ContactCta'

export function Component() {
  return (
    <>
      <PageHero
        path="/halls"
        eyebrow="The Halls"
        subtitle="שלושה אולמות וגנים פרטיים — מאולם הדגל הענק ועד אולם בוטיק אינטימי, לכל אירוע הבמה המושלמת שלו."
      />
      <Halls />
      <ContactCta location="halls" />
    </>
  )
}
