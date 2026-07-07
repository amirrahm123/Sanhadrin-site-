import { PageHero } from '../components/PageHero'
import { ContactForm } from '../components/ContactForm'

export function Component() {
  return (
    <>
      <PageHero
        eyebrow="Get in Touch"
        title="צור קשר"
        subtitle="השאירו פרטים ונחזור אליכם לתיאום סיור באחוזה — או דברו איתנו ישירות בטלפון ובוואטסאפ."
      />
      <ContactForm />
    </>
  )
}
