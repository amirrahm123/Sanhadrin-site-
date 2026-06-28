import { UtensilsCrossed, BadgeCheck } from 'lucide-react'
import { Section } from './ui/Section'
import { Reveal } from './ui/Reveal'
import { ImagePlaceholder } from './ImagePlaceholder'
import { CULINARY } from '../data/sections'

export function Culinary() {
  return (
    <Section id="culinary">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        {/* Image */}
        <Reveal className="lg:order-2">
          <div className="relative">
            <ImagePlaceholder label={CULINARY.imageLabel} ratio="4/5" className="shadow-card" />
            <div className="pointer-events-none absolute -bottom-4 -right-4 -z-0 hidden h-full w-full rounded-2xl border border-gold/40 sm:block" />
          </div>
        </Reveal>

        {/* Text */}
        <Reveal delay={0.12} className="flex flex-col gap-6 lg:order-1">
          <span className="eyebrow">{CULINARY.eyebrow}</span>
          <h2 className="text-3xl leading-tight md:text-4xl lg:text-5xl">{CULINARY.title}</h2>
          <span className="hairline max-w-[7rem]" />
          {CULINARY.paragraphs.map((p, i) => (
            <p key={i} className="text-base leading-relaxed text-muted md:text-lg">
              {p}
            </p>
          ))}

          {/* Stations */}
          <div className="mt-2">
            <p className="mb-3 flex items-center gap-2 font-serif text-lg text-emerald">
              <UtensilsCrossed size={18} className="text-gold" />
              עמדות קבלת הפנים
            </p>
            <ul className="grid grid-cols-1 gap-x-6 gap-y-2.5 sm:grid-cols-2">
              {CULINARY.stations.map((s) => (
                <li key={s} className="flex items-center gap-2.5 text-sm text-ink">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                  {s}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-2 inline-flex w-fit items-center gap-2 rounded-full bg-emerald/5 px-4 py-2 text-sm font-semibold text-emerald">
            <BadgeCheck size={16} className="text-gold" />
            {CULINARY.kosher}
          </div>
        </Reveal>
      </div>
    </Section>
  )
}
