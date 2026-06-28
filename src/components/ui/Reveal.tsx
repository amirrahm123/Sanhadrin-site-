import type { ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

type RevealProps = {
  children: ReactNode
  /** stagger delay in seconds */
  delay?: number
  /** vertical travel distance in px */
  y?: number
  className?: string
  as?: 'div' | 'li' | 'section' | 'span'
}

/**
 * Gentle fade-up + slight blur-in on scroll into view.
 * Honours prefers-reduced-motion: renders content with no transform/blur.
 */
export function Reveal({ children, delay = 0, y = 24, className, as = 'div' }: RevealProps) {
  const reduce = useReducedMotion()
  const MotionTag = motion[as]

  if (reduce) {
    const Tag = as
    return <Tag className={className}>{children}</Tag>
  }

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y, filter: 'blur(8px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </MotionTag>
  )
}
