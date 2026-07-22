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
            {/* gold frame accent — a ring just outside the photo edges. Placed
                before the image in DOM order so the image paints on top of it
                (no z-index needed); -inset keeps the border fully outside the
                photo, so it frames rather than overlaps. */}
            <div className="pointer-events-none absolute -inset-3 hidden rounded-[1.25rem] border border-gold/40 sm:block" />
            <ImagePlaceholder
              label={ABOUT.imageLabel}
              slot="about_main"
              ratio="4/5"
              fit="contain"
              className="shadow-card"
            />
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
