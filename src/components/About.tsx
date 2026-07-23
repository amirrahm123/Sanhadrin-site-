import { Section } from './ui/Section'
import { Reveal } from './ui/Reveal'
import { ImagePlaceholder } from './ImagePlaceholder'
import { ABOUT } from '../data/sections'

export function About() {
  return (
    <Section id="about">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        {/* Text */}
        <Reveal className="order-2 flex flex-col gap-6 lg:order-1">
          <span className="eyebrow">{ABOUT.eyebrow}</span>
          <h2 className="text-3xl leading-tight md:text-4xl lg:text-5xl">{ABOUT.title}</h2>
          <span className="hairline max-w-[7rem]" />
          {ABOUT.paragraphs.map((p, i) => (
            <p key={i} className="text-base leading-relaxed text-muted md:text-lg">
              {p}
            </p>
          ))}
        </Reveal>

        {/* Image */}
        <Reveal delay={0.15} className="order-1 lg:order-2">
          <div className="relative">
            {/* gold frame accent — a ring hugging the photo edges. Placed after
                the image in DOM order (and z-10) so it paints on top of the
                photo's outer edge; inset-0 + matching radius makes it sit flush
                on the photo with zero gap, so no background shows through. */}
            <ImagePlaceholder
              label={ABOUT.imageLabel}
              slot="about_main"
              ratio="4/5"
              fit="cover"
              className="shadow-card"
            />
            <div className="pointer-events-none absolute inset-0 z-10 hidden rounded-2xl border border-gold/40 sm:block" />
          </div>
        </Reveal>
      </div>

      {/* Stats */}
      <Reveal delay={0.1} className="mt-16 md:mt-24">
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-stone bg-stone lg:grid-cols-4">
          {ABOUT.stats.map((s) => (
            <div key={s.label} className="bg-cream px-5 py-8 text-center">
              <div className="flex items-baseline justify-center gap-1">
                <span className="font-serif text-4xl font-bold text-emerald md:text-5xl">
                  {s.value}
                </span>
                <span className="font-serif text-lg text-gold">{s.unit}</span>
              </div>
              <p className="mt-2 text-sm text-muted">{s.label}</p>
            </div>
          ))}
        </div>
      </Reveal>
    </Section>
  )
}
