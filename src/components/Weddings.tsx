import { Link } from 'react-router-dom'
import { Sparkles, ArrowLeft } from 'lucide-react'
import { Section, SectionHeading } from './ui/Section'
import { Reveal } from './ui/Reveal'
import { ImagePlaceholder } from './ImagePlaceholder'
import { WEDDINGS } from '../data/sections'

export function Weddings() {
  return (
    <Section id="weddings" className="bg-stone/30">
      <SectionHeading
        eyebrow={WEDDINGS.eyebrow}
        title={WEDDINGS.title}
        subtitle={WEDDINGS.intro}
      />

      <div className="grid gap-8 md:grid-cols-2 md:gap-10">
        {WEDDINGS.features.map((f, i) => (
          <Reveal key={f.id} delay={i * 0.12}>
            <Link
              to={f.to}
              aria-label={f.title}
              className="group flex h-full flex-col overflow-hidden rounded-3xl bg-ivory shadow-soft transition-shadow hover:shadow-card focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-stone"
            >
              <ImagePlaceholder
                label={f.imageLabel}
                slot={`weddings_${i + 1}`}
                ratio="3/2"
                rounded={false}
                className="transition-transform duration-500 group-hover:scale-[1.03]"
              />
              <div className="flex flex-1 flex-col gap-4 p-7 md:p-8">
                <h3 className="flex items-center gap-2 text-2xl text-emerald md:text-3xl">
                  <Sparkles size={20} className="text-gold" />
                  {f.title}
                </h3>
                <p className="text-base leading-relaxed text-muted">{f.body}</p>
                <ul className="flex flex-wrap gap-2 pt-2">
                  {f.bullets.map((b) => (
                    <li
                      key={b}
                      className="rounded-full border border-gold/40 bg-gold/5 px-3.5 py-1.5 text-xs font-medium text-emerald"
                    >
                      {b}
                    </li>
                  ))}
                </ul>
                <span className="mt-auto inline-flex items-center gap-1.5 pt-2 text-sm font-medium text-emerald transition-colors group-hover:text-gold">
                  לעמוד המלא
                  <ArrowLeft size={15} className="transition-transform group-hover:-translate-x-1" />
                </span>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
