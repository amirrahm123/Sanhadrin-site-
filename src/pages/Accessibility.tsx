import { PageHero } from '../components/PageHero'
import { Section } from '../components/ui/Section'
import { Reveal } from '../components/ui/Reveal'
import { PhoneLink } from '../components/ui/TrackedLinks'
import { ACCESSIBILITY } from '../data/accessibility'

/**
 * Accessibility statement (הצהרת נגישות) — the destination for the footer link
 * and the "למידע נוסף" link inside the accessibility panel.
 *
 * The copy is the client's legal text, held verbatim in src/data/accessibility.ts.
 * This page is presentation only: it adds no wording of its own, so every visible
 * string here comes from that module.
 */
export function Component() {
  return (
    <>
      {/* No "לתיאום סיור" CTA — this is a legal page, not a sales page. */}
      <PageHero path="/accessibility" eyebrow="Accessibility" showCta={false} />

      <Section id="accessibility-statement">
        <Reveal className="mx-auto flex max-w-3xl flex-col gap-6">
          {ACCESSIBILITY.intro.map((p, i) => (
            <p key={i} className="text-base leading-relaxed text-muted md:text-lg">
              {p}
            </p>
          ))}

          {/* The intro sentence labels the list rather than a heading of our
              own — inventing an <h2> here would mean adding words the client
              did not write. */}
          <p id="a11y-features-intro" className="text-base leading-relaxed text-muted md:text-lg">
            {ACCESSIBILITY.featuresIntro}
          </p>
          <ul aria-labelledby="a11y-features-intro" className="flex flex-col gap-2.5">
            {ACCESSIBILITY.features.map((f) => (
              <li key={f} className="flex items-start gap-2.5 text-base leading-relaxed text-ink">
                <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                <span>{f}</span>
              </li>
            ))}
          </ul>

          {ACCESSIBILITY.outro.map((p, i) => (
            <p key={i} className="text-base leading-relaxed text-muted md:text-lg">
              {p}
            </p>
          ))}

          <div className="mt-4 flex flex-col gap-3">
            <h2 className="font-serif text-2xl text-emerald md:text-3xl">
              {ACCESSIBILITY.contactHeading}
            </h2>
            <span className="hairline max-w-[7rem]" />
            <p className="text-base leading-relaxed text-ink md:text-lg">
              {ACCESSIBILITY.emailLabel}{' '}
              <a
                href={`mailto:${ACCESSIBILITY.email}`}
                className="text-emerald underline underline-offset-4 transition-colors hover:text-gold"
              >
                {ACCESSIBILITY.email}
              </a>
            </p>
            <p className="text-base leading-relaxed text-ink md:text-lg">
              {ACCESSIBILITY.phoneLabel}{' '}
              <PhoneLink
                location="accessibility_statement"
                className="text-emerald underline underline-offset-4 transition-colors hover:text-gold"
              >
                {/* dir/ltr + inline-block so the RTL paragraph cannot reorder
                    the digits around the hyphen. */}
                <span dir="ltr" className="inline-block">
                  {ACCESSIBILITY.phone}
                </span>
              </PhoneLink>
            </p>
          </div>
        </Reveal>
      </Section>
    </>
  )
}
