import { Section } from './ui/Section'
import { Reveal } from './ui/Reveal'
import { ImagePlaceholder } from './ImagePlaceholder'
import { AQUEDUCT } from '../data/sections'

/**
 * Homepage feature "moment" for the estate's signature differentiator — the
 * ancient Roman aqueduct. Mirrors the estate-intro split (featured image on one
 * side, short story on the other) but as its own dark emerald section so it
 * reads as a distinct beat right after the estate intro. The image is a managed
 * slot (`home_aqueduct`); until a photo is uploaded the designed aqueduct/arch
 * placeholder shows.
 */
export function Aqueduct() {
  return (
    <Section id="aqueduct" dark grain>
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        {/* Featured image — order-1 so it sits on the start side (RTL: right),
            flipping the estate-intro layout for visual rhythm. */}
        <Reveal className="order-1">
          <div className="relative">
            {/* gold frame accent — placed before the image (DOM order) with
                -inset so it frames the photo edges instead of overlapping it. */}
            <div className="pointer-events-none absolute -inset-3 hidden rounded-[1.25rem] border border-gold/40 sm:block" />
            <ImagePlaceholder
              label={AQUEDUCT.imageLabel}
              slot="home_aqueduct"
              ratio="3/2"
              tone="dark"
              className="shadow-card"
            />
          </div>
        </Reveal>

        {/* Story */}
        <Reveal delay={0.15} className="order-2 flex flex-col gap-6">
          <span className="eyebrow">{AQUEDUCT.eyebrow}</span>
          <h2 className="text-3xl leading-tight text-cream md:text-4xl lg:text-5xl">
            {AQUEDUCT.title}
          </h2>
          <span className="block h-px w-28 bg-gradient-to-l from-transparent via-gold/60 to-transparent" />
          <p className="text-base leading-relaxed text-cream/75 md:text-lg">{AQUEDUCT.body}</p>
          <p className="flex items-center gap-3 font-serif text-lg text-gold md:text-xl">
            <span className="h-px w-6 shrink-0 bg-gold/60" />
            {AQUEDUCT.emphasis}
          </p>
        </Reveal>
      </div>
    </Section>
  )
}
