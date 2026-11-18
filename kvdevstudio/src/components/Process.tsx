import { useRef } from 'react'
import { motion, useScroll, useSpring, useTransform, type MotionValue } from 'framer-motion'
import { Compass, Code2, PenTool, Rocket, type LucideIcon } from 'lucide-react'
import { SectionHeader } from './ui/SectionHeader'
import { PROCESS } from '../lib/site'
import { EASE_OUT } from '../lib/motion'

const ICONS: LucideIcon[] = [Compass, PenTool, Code2, Rocket]

/** Four connected steps; the timeline fills with lime as the reader scrolls. */
export default function Process() {
  const track = useRef<HTMLOListElement>(null)
  const { scrollYProgress } = useScroll({ target: track, offset: ['start 0.75', 'end 0.55'] })
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 26, mass: 0.4 })

  return (
    <section id="process" aria-labelledby="process-title" className="section">
      <div className="container-x">
        <SectionHeader
          index="04"
          label="Process"
          lines={[<span id="process-title">From Idea to Impact.</span>]}
          sub="A clear, collaborative path from the first conversation to a launched, growing presence."
        />

        <ol ref={track} className="relative mt-16 grid gap-0 sm:mt-24 lg:grid-cols-4 lg:gap-6">
          {/* Desktop: horizontal line through the nodes */}
          <div aria-hidden className="absolute top-[27px] right-0 left-0 hidden h-px bg-white/10 lg:block">
            <motion.div className="h-full origin-left bg-lime" style={{ scaleX: progress }} />
          </div>
          {/* Stacked: vertical line through the nodes */}
          <div aria-hidden className="absolute top-2 bottom-2 left-[27px] w-px bg-white/10 lg:hidden">
            <motion.div className="h-full w-full origin-top bg-lime" style={{ scaleY: progress }} />
          </div>

          {PROCESS.map((step, i) => (
            <Step key={step.index} step={step} i={i} progress={progress} />
          ))}
        </ol>
      </div>
    </section>
  )
}

function Step({ step, i, progress }: { step: (typeof PROCESS)[number]; i: number; progress: MotionValue<number> }) {
  const Icon = ICONS[i]
  const at = i / (PROCESS.length - 1)
  const lit = useTransform(progress, [Math.max(0, at - 0.06), at + 0.02], [0, 1])
  const ring = useTransform(lit, (v) => `rgba(198,255,77,${0.15 + v * 0.85})`)
  const bg = useTransform(lit, (v) => `rgba(198,255,77,${v})`)
  const fg = useTransform(lit, (v) => (v > 0.5 ? '#0b0f02' : '#f5f5f5'))

  return (
    <motion.li
      className="relative grid grid-cols-[56px_1fr] gap-x-6 pb-12 last:pb-0 lg:block lg:pb-0"
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.9, ease: EASE_OUT, delay: i * 0.08 }}
    >
      <motion.span
        className="relative z-10 grid size-14 place-items-center rounded-full border bg-ink"
        style={{ borderColor: ring }}
      >
        <motion.span className="absolute inset-1.5 rounded-full" style={{ backgroundColor: bg }} />
        <motion.span className="relative" style={{ color: fg }}>
          <Icon aria-hidden className="size-5" strokeWidth={1.8} />
        </motion.span>
      </motion.span>

      <div className="lg:mt-10 lg:pr-6">
        <span className="font-mono text-[12px] tracking-[0.2em] text-dim">{step.index}</span>
        <h3 className="mt-3 font-display text-[clamp(1.6rem,2.3vw,2.1rem)] leading-none font-medium tracking-[-0.04em]">{step.title}</h3>
        <p className="mt-4 max-w-[19rem] text-[15.5px] leading-[1.65] text-muted">{step.text}</p>
      </div>
    </motion.li>
  )
}
