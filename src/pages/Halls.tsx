import { PageHero } from '../components/PageHero'
import { Halls } from '../components/Halls'
import { ContactCta } from '../components/ContactCta'

export function Component() {
  return (
    <>
      <PageHero
        path="/halls"
        heroSlot="halls_hero"
        eyebrow="The Halls"
        subtitle="שלוש אחוזות וגנים פרטיים — מאחוזת הדגל הענקית ועד אחוזת בוטיק אינטימית, לכל אירוע הבמה המושלמת שלו."
      />
      <Halls />
      <ContactCta location="halls" />
    </>
  )
}
