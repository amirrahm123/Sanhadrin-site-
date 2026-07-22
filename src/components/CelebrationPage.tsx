import { Link } from 'react-router-dom'
import { Sparkles, ArrowLeft, Images } from 'lucide-react'
import type { CelebrationContent } from '../data/sections'
import { PageHero } from './PageHero'
import { Section } from './ui/Section'
import { Reveal } from './ui/Reveal'
import { ImagePlaceholder } from './ImagePlaceholder'
import { ContactCta } from './ContactCta'
import { Button } from './ui/Button'

type CelebrationPageProps = {
  content: CelebrationContent
  /** route path for SEO/h1 sourcing, e.g. "/bar-mitzvah" */
  path: string
  /** whatsapp/contact tracking location, e.g. "bar_mitzvah" */
  location: string
  /** sibling celebration links for internal linking */
  related: { label: string; to: string }[]
  /** matching gallery category page — renders a "לצפייה בגלריה" button when set */
  galleryLink?: string
  /** managed photo-slot key for the hero background */
  heroSlot?: string
  /** managed photo-slot key for the intro image */
  introSlot?: string
}

/**
 * Shared layout for the celebration pages (bar/bat mitzvah, henna): hero,
 * intro + image, feature grid, related-celebration links and a contact CTA.
 */
export function CelebrationPage({
  content,
  path,
  location,
  related,
  galleryLink,
  heroSlot,
  introSlot,
}: CelebrationPageProps) {
  return (
    <>
      <PageHero
        path={path}
        heroSlot={heroSlot}
        eyebrow={content.eyebrow}
        subtitle={content.heroSubtitle}
        breadcrumbs={[{ label: 'אירועים' }, { label: content.h1 }]}
      />

      {/* Intro + image */}
      <Section id="intro">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal className="order-2 flex flex-col gap-6 lg:order-1">
            <h2 className="text-3xl leading-tight md:text-4xl lg:text-5xl">{content.intro.title}</h2>
            <span className="hairline max-w-[7rem]" />
            {content.intro.paragraphs.map((p, i) => (
              <p key={i} className="text-base leading-relaxed text-muted md:text-lg">
                {p}
              </p>
            ))}
          </Reveal>
          <Reveal delay={0.15} className="order-1 lg:order-2">
            <div className="relative">
              <ImagePlaceholder
                label={content.intro.imageLabel}
                slot={introSlot}
                ratio="4/5"
                className="shadow-card"
              />
              <div className="pointer-events-none absolute -bottom-4 -left-4 -z-0 hidden h-full w-full rounded-2xl border border-gold/40 sm:block" />
            </div>
          </Reveal>
        </div>
      </Section>

      {/* Features */}
      <Section id="highlights" className="bg-stone/30">
        <div
          className={`grid gap-6 ${
            content.features.length === 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-2'
          }`}
        >
          {content.features.map((f, i) => (
            <Reveal key={f.title} delay={(i % 3) * 0.1}>
              <article className="flex h-full flex-col gap-3 rounded-3xl bg-ivory p-7 shadow-soft md:p-8">
                <h3 className="flex items-center gap-2 text-2xl text-emerald">
                  <Sparkles size={20} className="text-gold" />
                  {f.title}
                </h3>
                <p className="text-base leading-relaxed text-muted">{f.body}</p>
              </article>
            </Reveal>
          ))}
        </div>

        {/* Matching gallery category — visual proof */}
        {galleryLink && (
          <Reveal delay={0.1} className="mt-10 flex justify-center">
            <Button as="link" to={galleryLink} variant="outline" size="lg">
              <Images size={18} />
              לצפייה בגלריה
            </Button>
          </Reveal>
        )}

        {/* Related celebrations — internal linking */}
        {related.length > 0 && (
          <Reveal delay={0.1} className="mt-12">
            <div className="flex flex-col items-center gap-4 text-center">
              <p className="eyebrow">אירועים נוספים</p>
              <div className="flex flex-wrap justify-center gap-3">
                {related.map((r) => (
                  <Link
                    key={r.to}
                    to={r.to}
                    className="group inline-flex items-center gap-1.5 rounded-full border border-gold/50 bg-ivory px-5 py-2.5 text-sm font-medium text-emerald transition-colors hover:bg-gold hover:text-emerald-deep"
                  >
                    {r.label}
                    <ArrowLeft size={15} className="transition-transform group-hover:-translate-x-1" />
                  </Link>
                ))}
              </div>
            </div>
          </Reveal>
        )}
      </Section>

      <ContactCta title={content.closingTitle} body={content.closingBody} location={location} />
    </>
  )
}
