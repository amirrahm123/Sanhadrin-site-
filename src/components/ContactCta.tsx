import { MessageCircle } from 'lucide-react'
import { Reveal } from './ui/Reveal'
import { Button } from './ui/Button'
import { WhatsAppLink } from './ui/TrackedLinks'

type ContactCtaProps = {
  title?: string
  body?: string
  /** for the whatsapp_click tracking param */
  location?: string
}

/**
 * Emerald conversion band closing the content pages: routes to /contact and
 * offers a tracked WhatsApp shortcut. Reused site-wide for consistent internal
 * linking toward the contact page.
 */
export function ContactCta({
  title = 'מוכנים לתכנן את האירוע שלכם?',
  body = 'צוות האחוזה ישמח לארח אתכם לסיור, להכיר את החלום שלכם ולתפור לו מסגרת מושלמת.',
  location = 'contact_cta',
}: ContactCtaProps) {
  return (
    <section className="bg-cream px-5 py-16 sm:px-8 md:py-20 lg:px-10">
      <Reveal className="mx-auto max-w-content">
        <div className="grain relative overflow-hidden rounded-3xl bg-emerald px-6 py-12 text-center text-cream md:px-12 md:py-16">
          <div className="relative z-10 mx-auto flex max-w-2xl flex-col items-center gap-5">
            <h2 className="font-serif text-3xl leading-tight text-cream md:text-4xl">{title}</h2>
            <span className="hairline max-w-[7rem] opacity-70" />
            <p className="text-base leading-relaxed text-cream/80 md:text-lg">{body}</p>
            <div className="mt-3 flex flex-col items-center gap-3 sm:flex-row">
              <Button as="a" href="#contact-form" variant="primary" size="lg" className="w-full bg-gold text-emerald-deep hover:bg-gold-soft sm:w-auto">
                לתיאום סיור
              </Button>
              <WhatsAppLink
                location={location}
                ariaLabel="שליחת הודעת וואטסאפ"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-gold/70 px-8 py-3.5 text-base font-medium text-cream transition-all duration-300 hover:bg-gold hover:text-emerald-deep sm:w-auto"
              >
                <MessageCircle size={18} />
                שיחה בוואטסאפ
              </WhatsAppLink>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  )
}
