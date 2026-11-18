import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { EASE_OUT, VIEWPORT_ONCE, stagger as staggerVariants } from '../../lib/motion'
import { cn } from '../../lib/cn'

type RevealProps = {
  children: ReactNode
  className?: string
  delay?: number
  y?: number
  amount?: number
}

/** Fade + rise once when scrolled into view. */
export function Reveal({ children, className, delay = 0, y = 28, amount = 0.25 }: RevealProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration: 0.9, delay, ease: EASE_OUT }}
    >
      {children}
    </motion.div>
  )
}

type MaskLinesProps = {
  lines: ReactNode[]
  as?: 'h1' | 'h2' | 'h3' | 'p'
  className?: string
  lineClassName?: string
  delay?: number
  stagger?: number
  /** Animate on mount instead of on scroll (hero). */
  onMount?: boolean
}

/** Headline lines that rise out of a mask, one after another. */
export function MaskLines({ lines, as = 'h2', className, lineClassName, delay = 0, stagger = 0.1, onMount = false }: MaskLinesProps) {
  const Tag = as
  const trigger = onMount
    ? ({ initial: 'hidden', animate: 'show' } as const)
    : ({ initial: 'hidden', whileInView: 'show', viewport: VIEWPORT_ONCE } as const)
  return (
    <Tag className={className}>
      <motion.span className="block" variants={staggerVariants(stagger, delay)} {...trigger}>
        {lines.map((line, i) => (
          <span key={i} className="-mb-[0.12em] block overflow-hidden pb-[0.12em]">
            <motion.span
              className={cn('block', lineClassName)}
              variants={{ hidden: { y: '115%' }, show: { y: '0%', transition: { duration: 1.15, ease: EASE_OUT } } }}
            >
              {line}
            </motion.span>
          </span>
        ))}
      </motion.span>
    </Tag>
  )
}

/** Small mono eyebrow led by a lime hairline. */
export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cn('label flex items-center gap-3', className)}>
      <span aria-hidden className="h-px w-8 bg-lime/80" />
      {children}
    </p>
  )
}
