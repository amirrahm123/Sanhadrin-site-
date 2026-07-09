import { Section } from './ui/Section'
import { Reveal } from './ui/Reveal'
import { ImagePlaceholder } from './ImagePlaceholder'
import { GARDEN } from '../data/sections'

export function Garden() {
  return (
    <Section id="garden" dark grain>
      <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
        <Reveal className="lg:col-span-5">
          <span className="eyebrow">{GARDEN.eyebrow}</span>
          <h2 className="mt-4 text-3xl leading-tight text-cream md:text-4xl lg:text-5xl">
            {GARDEN.title}
          </h2>
          <span className="mt-5 block h-px w-28 bg-gradient-to-l from-transparent via-gold/60 to-transparent" />
          <div className="mt-6 flex flex-col gap-5">
            {GARDEN.paragraphs.map((p, i) => (
              <p key={i} className="text-base leading-relaxed text-cream/75 md:text-lg">
                {p}
              </p>
            ))}
          </div>
        </Reveal>

        {/* Gallery */}
        <div className="lg:col-span-7">
          <div className="grid grid-cols-2 gap-4 md:gap-5">
            {GARDEN.gallery.map((g, i) => (
              <Reveal key={g.label} delay={i * 0.08} className={i % 2 === 1 ? 'mt-6 md:mt-10' : ''}>
                <ImagePlaceholder
                  label={g.label}
                  slot={`garden_${i + 1}`}
                  ratio={g.ratio}
                  tone="dark"
                  className="shadow-soft"
                />
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </Section>
  )
}
