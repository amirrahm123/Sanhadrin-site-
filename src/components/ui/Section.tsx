import type { ReactNode } from 'react'
import { Reveal } from './Reveal'

type SectionProps = {
  id: string
  children: ReactNode
  className?: string
  /** dark emerald background variant */
  dark?: boolean
  /** add subtle grain texture (pairs well with dark) */
  grain?: boolean
}

export function Section({ id, children, className = '', dark = false, grain = false }: SectionProps) {
  return (
    <section
      id={id}
      className={`relative py-20 md:py-28 lg:py-32 ${
        dark ? 'bg-emerald-deep text-cream' : ''
      } ${grain ? 'grain' : ''} ${className}`}
    >
      <div className="relative z-10 mx-auto w-full max-w-content px-5 sm:px-8 lg:px-10">
        {children}
      </div>
    </section>
  )
}

type SectionHeadingProps = {
  eyebrow?: string
  title: string
  subtitle?: string
  align?: 'center' | 'start'
  dark?: boolean
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = 'center',
  dark = false,
}: SectionHeadingProps) {
  const alignCls = align === 'center' ? 'text-center items-center mx-auto' : 'text-start items-start'
  return (
    <Reveal className={`flex flex-col gap-4 ${alignCls} max-w-2xl mb-12 md:mb-16`}>
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <h2 className={`text-3xl md:text-4xl lg:text-5xl leading-tight ${dark ? 'text-cream' : ''}`}>
        {title}
      </h2>
      {align === 'center' && <span className="hairline max-w-[7rem]" />}
      {subtitle && (
        <p className={`text-base md:text-lg leading-relaxed ${dark ? 'text-cream/70' : 'text-muted'}`}>
          {subtitle}
        </p>
      )}
    </Reveal>
  )
}
