import { PageHero } from '../components/PageHero'
import { About } from '../components/About'
import { Garden } from '../components/Garden'
import { ContactCta } from '../components/ContactCta'

export function Component() {
  return (
    <>
      <PageHero
        path="/about"
        heroSlot="about_hero"
        eyebrow="Our Estate"
        subtitle="כחמישים דונם של גנים פורחים, מזרקות ונחלים לאורך אקוודוקט רומי עתיק — הסיפור והמרחבים שמאחורי אחוזת סנדרין."
      />
      <About />
      <Garden />
      <ContactCta location="about" />
    </>
  )
}
