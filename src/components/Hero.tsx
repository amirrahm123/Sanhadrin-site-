import { motion, useReducedMotion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { BRAND, HERO } from '../data/sections'
import { Button } from './ui/Button'
import { HeroShell } from './ui/HeroShell'

export function Hero() {
  const reduce = useReducedMotion()

  const fade = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 28, filter: 'blur(8px)' },
          animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
          transition: { duration: 1, delay, ease: [0.22, 1, 0.36, 1] as const },
        }

  return (
    <HeroShell
      id="home"
      bottomSlot={
        <a
          href="#estate-intro"
          aria-label="גלילה למטה"
          className="absolute bottom-7 left-1/2 z-10 -translate-x-1/2 text-cream/70 transition-colors hover:text-gold-soft"
        >
          <ChevronDown size={28} className="animate-scroll-cue" />
        </a>
      }
    >
      <motion.span {...fade(0.1)} className="eyebrow text-gold-soft">
        {BRAND.latin}
      </motion.span>

      <motion.h1
        {...fade(0.25)}
        className="mt-5 font-serif text-5xl font-bold leading-[1.05] text-cream sm:text-6xl md:text-7xl"
      >
        {HERO.title}
      </motion.h1>

      <motion.p
        {...fade(0.4)}
        className="latin mt-4 text-2xl font-normal italic text-gold-soft sm:text-3xl md:text-4xl"
      >
        {HERO.latinLine}
      </motion.p>

      <motion.div {...fade(0.5)} className="mx-auto my-7 h-px w-24 bg-gold/60" />

      <motion.p
        {...fade(0.6)}
        className="mx-auto max-w-xl text-base leading-relaxed text-cream/90 sm:text-lg"
      >
        {HERO.positioning}
      </motion.p>

      <motion.div
        {...fade(0.75)}
        className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
      >
        <Button as="a" href="#contact-form" variant="primary" size="lg" className="w-full sm:w-auto">
          {HERO.primaryCta}
        </Button>
        <Button as="link" to="/gallery" variant="outlineLight" size="lg" className="w-full sm:w-auto">
          {HERO.secondaryCta}
        </Button>
      </motion.div>
    </HeroShell>
  )
}
