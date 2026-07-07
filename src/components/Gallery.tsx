import { Section, SectionHeading } from './ui/Section'
import { Reveal } from './ui/Reveal'
import { Button } from './ui/Button'
import { ImagePlaceholder } from './ImagePlaceholder'
import { GALLERY } from '../data/sections'

export function Gallery() {
  return (
    <Section id="gallery" className="bg-stone/30">
      <SectionHeading
        eyebrow={GALLERY.eyebrow}
        title={GALLERY.title}
        subtitle={GALLERY.subtitle}
      />

      {/* CSS columns → natural masonry with varied ratios */}
      <div className="columns-1 gap-4 sm:columns-2 md:gap-5 lg:columns-3">
        {GALLERY.tiles.map((tile, i) => (
          <Reveal key={`${tile.label}-${i}`} delay={(i % 3) * 0.06} className="mb-4 break-inside-avoid md:mb-5">
            <ImagePlaceholder label={tile.label} ratio={tile.ratio} className="shadow-soft" />
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.1} className="mt-12 flex justify-center">
        <Button as="a" href="#contact-form" variant="outline" size="lg">
          לתיאום סיור באחוזה
        </Button>
      </Reveal>
    </Section>
  )
}
