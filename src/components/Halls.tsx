import { Check, Crown, ArrowLeft } from 'lucide-react'
import { Section, SectionHeading } from './ui/Section'
import { Reveal } from './ui/Reveal'
import { ImagePlaceholder } from './ImagePlaceholder'
import { HALLS, HALLS_SECTION } from '../data/halls'

export function Halls() {
  return (
    <Section id="halls">
      <SectionHeading
        eyebrow={HALLS_SECTION.eyebrow}
        title={HALLS_SECTION.title}
        subtitle={HALLS_SECTION.intro}
      />

      <div className="flex flex-col gap-10 lg:gap-14">
        {HALLS.map((hall, i) => {
          const reverse = i % 2 === 1
          return (
            <Reveal key={hall.id} delay={0.05}>
              <article
                className={`grid items-stretch gap-0 overflow-hidden rounded-3xl border border-stone bg-ivory shadow-soft lg:grid-cols-2 ${
                  hall.flagship ? 'ring-1 ring-gold/30' : ''
                }`}
              >
                {/* Image */}
                <div className={`relative ${reverse ? 'lg:order-2' : ''}`}>
                  <ImagePlaceholder
                    label={hall.imageLabel}
                    ratio="4/5"
                    rounded={false}
                    className="h-full min-h-[280px]"
                  />
                  {hall.flagship && (
                    <span className="absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-gold px-3.5 py-1.5 text-xs font-semibold text-emerald-deep shadow-soft">
                      <Crown size={14} />
                      אולם הדגל
                    </span>
                  )}
                </div>

                {/* Body */}
                <div className={`flex flex-col justify-center gap-5 p-7 md:p-10 ${reverse ? 'lg:order-1' : ''}`}>
                  <div>
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <h3 className="latin text-3xl font-semibold text-emerald md:text-4xl">
                        {hall.name}
                      </h3>
                      <span className="text-sm text-muted">{hall.he}</span>
                    </div>
                    <p className="mt-1 text-sm font-medium uppercase tracking-wide text-gold">
                      {hall.tagline}
                    </p>
                  </div>

                  <div className="inline-flex w-fit items-center gap-2 rounded-full bg-emerald/5 px-4 py-1.5 text-sm font-semibold text-emerald">
                    {hall.capacity}
                  </div>

                  <p className="text-base leading-relaxed text-muted">{hall.description}</p>

                  <ul className="flex flex-col gap-2.5">
                    {hall.highlights.map((h) => (
                      <li key={h} className="flex items-center gap-2.5 text-sm text-ink">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold/15 text-gold">
                          <Check size={13} />
                        </span>
                        {h}
                      </li>
                    ))}
                  </ul>

                  <a
                    href="#contact-form"
                    className="group mt-1 inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-emerald transition-colors hover:text-gold"
                  >
                    {HALLS_SECTION.cta}
                    <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
                  </a>
                </div>
              </article>
            </Reveal>
          )
        })}
      </div>

      {/* Shared highlights strip */}
      <Reveal delay={0.1} className="mt-12">
        <div className="rounded-3xl bg-emerald px-6 py-8 text-cream md:px-10 md:py-9">
          <p className="mb-6 text-center font-serif text-lg text-gold-soft md:text-xl">
            בכל אולם, כלול בכל אירוע
          </p>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {HALLS_SECTION.sharedHighlights.map((h) => (
              <div key={h} className="flex items-center gap-3 text-sm md:text-base">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gold/20 text-gold-soft">
                  <Check size={15} />
                </span>
                <span className="text-cream/90">{h}</span>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </Section>
  )
}
