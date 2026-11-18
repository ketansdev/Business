import { lazy, Suspense, useRef, useState } from 'react'
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion'
import { MaskLines, Reveal } from './ui/Reveal'
import { deviceTier, hasWebGL } from '../lib/env'
import { useInViewport } from '../hooks/useInViewport'
import { usePrefersReducedMotion } from '../hooks/useReducedMotion'
import { EASE_OUT } from '../lib/motion'

const About3D = lazy(() => import('./About3D'))

const DESCRIPTION =
  'KV DEV Studio brings design, technology and creativity together to help businesses create meaningful digital experiences.'

const PRINCIPLES = [
  { k: '01', title: 'Design with intent', text: 'Every layout, colour and interaction earns its place.' },
  { k: '02', title: 'Build for performance', text: 'Fast, responsive and accessible on every screen.' },
  { k: '03', title: 'Grow with clarity', text: 'Clear presence that helps the right customers find you.' },
]

export default function About() {
  return (
    <section id="about" aria-label="About KV DEV Studio" className="section overflow-hidden">
      <div className="container-x">
        <Reveal y={14}>
          <p className="label flex items-center gap-3">
            <span className="text-lime">(03)</span>
            <span aria-hidden className="h-px w-8 bg-white/20" />
            About the studio
          </p>
        </Reveal>

        <MaskLines
          as="h2"
          className="mt-6 font-display text-[clamp(2.9rem,8.6vw,9.25rem)] leading-[0.9] font-semibold tracking-[-0.055em]"
          lines={[
            <span className="text-dim">
              Small Studio.
            </span>,
            <>Big Digital</>,
            <>Thinking.</>,
          ]}
          stagger={0.12}
        />

        <div className="mt-16 grid gap-12 lg:mt-24 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <ArmillaryPanel />
          </div>
          <div className="flex flex-col lg:col-span-6 lg:col-start-7">
            <ScrollRevealText text={DESCRIPTION} />
            <ul className="mt-14 border-t border-white/10">
              {PRINCIPLES.map((p, i) => (
                <motion.li
                  key={p.k}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.8, ease: EASE_OUT, delay: i * 0.1 }}
                  className="group grid grid-cols-[3rem_1fr] gap-4 border-b border-white/10 py-6 sm:grid-cols-[4rem_1fr_1.2fr] sm:items-baseline"
                >
                  <span className="font-mono text-[12px] tracking-[0.18em] text-lime">{p.k}</span>
                  <span className="font-display text-[22px] leading-tight font-medium tracking-[-0.03em] transition-transform duration-500 ease-out-expo group-hover:translate-x-1.5">
                    {p.title}
                  </span>
                  <span className="col-start-2 text-[15px] leading-relaxed text-muted sm:col-start-3">{p.text}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

/** Description whose words brighten as the reader scrolls through it. */
function ScrollRevealText({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.45'] })
  const words = text.split(' ')
  return (
    <p ref={ref} className="font-display text-[clamp(1.6rem,2.7vw,2.45rem)] leading-[1.18] font-medium tracking-[-0.03em]">
      <span className="sr-only">{text}</span>
      <span aria-hidden>
        {words.map((w, i) => (
          <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>
            {w}
          </Word>
        ))}
      </span>
    </p>
  )
}

function Word({ children, progress, range }: { children: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.18, 1])
  const highlight = children.startsWith('design') || children.startsWith('technology') || children.startsWith('creativity')
  return (
    <motion.span style={{ opacity }} className={highlight ? 'text-lime' : undefined}>
      {children}{' '}
    </motion.span>
  )
}

function ArmillaryPanel() {
  const ref = useRef<HTMLDivElement>(null)
  const near = useInViewport(ref, '200px')
  const reduced = usePrefersReducedMotion()
  const [webgl] = useState(() => hasWebGL())
  const [quality] = useState(() => deviceTier())
  const [seen, setSeen] = useState(false)
  if (near && !seen) setSeen(true)

  return (
    <Reveal>
      <div
        ref={ref}
        className="relative aspect-square w-full overflow-hidden rounded-[32px] border border-white/[0.07] bg-[radial-gradient(ellipse_at_50%_35%,#171b21,#0b0c0f_72%)]"
      >
        <div aria-hidden className="grid-dots absolute inset-0 opacity-40 [mask-image:radial-gradient(circle_at_center,#000_30%,transparent_75%)]" />
        {webgl && seen ? (
          <Suspense fallback={null}>
            <About3D reduced={reduced} running={near} quality={quality} />
          </Suspense>
        ) : (
          <StaticRings />
        )}
        <div className="pointer-events-none absolute inset-x-6 bottom-6 flex items-center justify-between">
          <span className="label text-[10px] text-dim">Design · Technology · Creativity</span>
          <span className="size-1.5 rounded-full bg-lime" />
        </div>
      </div>
    </Reveal>
  )
}

function StaticRings() {
  return (
    <svg viewBox="0 0 200 200" className="absolute inset-0 m-auto h-3/4 w-3/4" aria-hidden fill="none">
      <ellipse cx="100" cy="100" rx="78" ry="30" stroke="rgba(230,234,240,0.5)" transform="rotate(-18 100 100)" />
      <ellipse cx="100" cy="100" rx="64" ry="62" stroke="rgba(230,234,240,0.35)" />
      <ellipse cx="100" cy="100" rx="52" ry="20" stroke="#C6FF4D" transform="rotate(38 100 100)" />
      <circle cx="100" cy="100" r="24" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.3)" />
    </svg>
  )
}
