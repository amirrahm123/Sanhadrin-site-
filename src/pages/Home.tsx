import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Hero } from '../components/Hero'
import { Aqueduct } from '../components/Aqueduct'
import { Section, SectionHeading } from '../components/ui/Section'
import { Reveal } from '../components/ui/Reveal'
import { Button } from '../components/ui/Button'
import { ImagePlaceholder } from '../components/ImagePlaceholder'
import { ContactCta } from '../components/ContactCta'
import { Seo } from '../components/Seo'
import { ABOUT, GALLERY } from '../data/sections'
import { GALLERY_IMAGE_ALT, useCloudinaryGallery } from '../lib/cloudinary'

// Preview tiles render at ~50vw (mobile) / 33vw (>=md).
const PREVIEW_SIZES = '(min-width: 768px) 33vw, 50vw'

// Curated gateway cards — each links out to a dedicated, indexable page so the
// home page stays a hub and page content isn't duplicated across the site.
const EVENT_CARDS = [
  { to: '/weddings', label: 'חתונות', slot: 'event_card_weddings', desc: 'ערב אחד שנחקק בלב — בגנים ובאולמות של האחוזה.' },
  { to: '/bar-bat-mitzvah', label: 'בר/בת מצווה', slot: 'event_card_barbat', desc: 'חגיגה מלכותית לבר ולבת המצווה, בין גנים לאולמות מפוארים.' },
  { to: '/henna', label: 'חינה יוקרתית', slot: 'event_card_henna', desc: 'חינה צבעונית וחמה — מסורת בהתחדשות, באירוח מפואר.' },
]

const AREA_CARDS = [
  { to: '/about', label: 'האחוזה והגנים', slot: 'area_card_about', desc: 'חמישים דונם, אקוודוקט רומי עתיק וגן זכוכית ייחודי.' },
  { to: '/halls', label: 'האולמות', slot: 'area_card_halls', desc: 'שלושה אולמות וגנים פרטיים — לכל גודל אירוע.' },
  { to: '/culinary', label: 'קולינריה', slot: 'area_card_culinary', desc: 'מטבח גבוה, עמדות שף, והכול כשר בהשגחת הרבנות.' },
]

export function Component() {
  const gallery = useCloudinaryGallery()
  // Newest 6 from the live folder; null → keep the designed placeholder tiles.
  const previewImages = gallery.status === 'ready' ? gallery.images.slice(0, 6) : null

  return (
    <>
      <Seo path="/" />
      <Hero />

      {/* Estate intro teaser → /about */}
      <Section id="estate-intro">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal className="order-2 flex flex-col gap-6 lg:order-1">
            <span className="eyebrow">{ABOUT.eyebrow}</span>
            <h2 className="text-3xl leading-tight md:text-4xl lg:text-5xl">{ABOUT.title}</h2>
            <span className="hairline max-w-[7rem]" />
            <p className="text-base leading-relaxed text-muted md:text-lg">{ABOUT.paragraphs[0]}</p>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {ABOUT.stats.map((s) => (
                <div key={s.label} className="text-center sm:text-start">
                  <div className="flex items-baseline justify-center gap-1 sm:justify-start">
                    <span className="font-serif text-3xl font-bold text-emerald">{s.value}</span>
                    <span className="font-serif text-base text-gold">{s.unit}</span>
                  </div>
                  <p className="mt-1 text-xs text-muted">{s.label}</p>
                </div>
              ))}
            </div>
            <Button as="link" to="/about" variant="outline" size="md" className="w-fit">
              לסיפור המלא של האחוזה
            </Button>
          </Reveal>
          <Reveal delay={0.15} className="order-1 lg:order-2">
            <div className="relative">
              {/* gold frame accent — a ring hugging the photo edges. Placed after
                  the image in DOM order (and z-10) so it paints on top of the
                  photo's outer edge; inset-0 + matching radius makes it sit flush
                  on the photo with zero gap, so no background shows through. */}
              <ImagePlaceholder
                label={ABOUT.imageLabel}
                slot="about_main"
                ratio="2/3"
                fit="cover"
                // Tall 9:16 aerial → a 2/3 box shows nearly the whole scene, and
                // biasing the crop to the bottom keeps the full venue (building +
                // the lit monument on the lawn) in frame, trimming only the top
                // sliver of sky rather than the grounds beneath.
                objectPosition="center bottom"
                className="shadow-card"
              />
              <div className="pointer-events-none absolute inset-0 z-10 hidden rounded-2xl border border-gold/40 sm:block" />
            </div>
          </Reveal>
        </div>
      </Section>

      {/* Signature differentiator → the ancient Roman aqueduct, its own moment */}
      <Aqueduct />

      {/* Event types → dedicated celebration pages */}
      <Section id="events" className="bg-stone/30">
        <SectionHeading
          eyebrow="Celebrations"
          title="כל אירוע מתחיל בהתאמה מדויקת"
          subtitle="חתונות, בר ובת מצווה וחינות יוקרתיות — כל אירוע נתפר למידותיכם בגנים ובאולמות של סנדרין."
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {EVENT_CARDS.map((c, i) => (
            <Reveal key={c.to} delay={(i % 3) * 0.08}>
              <Link
                to={c.to}
                className="group flex h-full flex-col overflow-hidden rounded-3xl bg-ivory shadow-soft transition-shadow hover:shadow-card"
              >
                <ImagePlaceholder label={c.label} slot={c.slot} ratio="4/5" rounded={false} />
                <div className="flex flex-1 flex-col gap-2 p-6">
                  <h3 className="flex items-center justify-between text-2xl text-emerald">
                    {c.label}
                    <ArrowLeft
                      size={18}
                      className="text-gold transition-transform group-hover:-translate-x-1"
                    />
                  </h3>
                  <p className="text-sm leading-relaxed text-muted">{c.desc}</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Explore the venue → about / halls / culinary */}
      <Section id="explore">
        <SectionHeading eyebrow="The Estate" title="מסע אל תוך המתחם" />
        <div className="grid gap-6 md:grid-cols-3 md:gap-8">
          {AREA_CARDS.map((c, i) => (
            <Reveal key={c.to} delay={(i % 3) * 0.08}>
              <Link
                to={c.to}
                className="group flex h-full flex-col gap-5 rounded-3xl border border-stone bg-ivory p-8 shadow-soft transition-shadow hover:shadow-card md:p-9"
              >
                <ImagePlaceholder label={c.label} slot={c.slot} ratio="4/5" />
                <h3 className="flex items-center justify-between text-2xl text-emerald md:text-3xl">
                  {c.label}
                  <ArrowLeft
                    size={20}
                    className="text-gold transition-transform group-hover:-translate-x-1"
                  />
                </h3>
                <p className="text-base leading-relaxed text-muted">{c.desc}</p>
              </Link>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Gallery preview → /gallery */}
      <Section id="gallery-preview" className="bg-stone/30">
        <SectionHeading eyebrow={GALLERY.eyebrow} title={GALLERY.title} subtitle={GALLERY.subtitle} />
        {/* Square grid; shows the newest live photos, else placeholder tiles. */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-5">
          {previewImages
            ? previewImages.map((img, i) => (
                <Reveal key={img.publicId} delay={(i % 3) * 0.06}>
                  <ImagePlaceholder
                    src={img.src}
                    srcSet={img.srcSet}
                    sizes={PREVIEW_SIZES}
                    alt={GALLERY_IMAGE_ALT}
                    ratio="1/1"
                    className="shadow-soft"
                  />
                </Reveal>
              ))
            : GALLERY.tiles.slice(0, 6).map((tile, i) => (
                <Reveal key={`${tile.label}-${i}`} delay={(i % 3) * 0.06}>
                  <ImagePlaceholder label={tile.label} ratio="1/1" className="shadow-soft" />
                </Reveal>
              ))}
        </div>
        <Reveal delay={0.1} className="mt-12 flex justify-center">
          <Button as="link" to="/gallery" variant="outline" size="lg">
            {GALLERY.cta}
          </Button>
        </Reveal>
      </Section>

      <ContactCta location="home" />
    </>
  )
}
