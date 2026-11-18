import { motion } from 'framer-motion'
import { Reveal } from '../ui/Reveal'
import { EASE_OUT } from '../../lib/motion'

type Word = { text: string; lime?: boolean; tail?: string }

const LINES: Word[][] = [
  [{ text: 'Digital' }, { text: 'Solutions.' }],
  [{ text: 'Designed' }, { text: 'to' }, { text: 'Move', lime: true }, { text: 'You', lime: true }, { text: 'Forward', lime: true, tail: '.' }],
]

/** Section introduction: eyebrow, word-by-word headline, supporting line. */
export default function ServicesIntro() {
  let n = 0
  return (
    <div className="relative">
      <div
        aria-hidden
        className="guide-lines pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_bottom,transparent,#000_25%,#000_75%,transparent)]"
      />
      <div className="container-x relative pt-[clamp(96px,12vw,168px)] pb-[clamp(48px,6vw,88px)]">
        <Reveal y={14}>
          <p className="label flex items-center gap-3">
            What we do
            <span aria-hidden className="h-px w-8 bg-white/20" />
            <span className="text-lime">001–004</span>
          </p>
        </Reveal>

        <motion.h2
          id="services-title"
          className="mt-7 font-display text-[clamp(2.55rem,5.7vw,6.25rem)] leading-[0.96] font-semibold tracking-[-0.05em]"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.075 } } }}
        >
          {LINES.map((line, li) => (
            <span key={li} className="block lg:whitespace-nowrap">
              {line.map((w) => {
                const key = n++
                return (
                  <span key={key} className="-mb-[0.1em] inline-block overflow-hidden pb-[0.1em] align-bottom">
                    <motion.span
                      className="inline-block"
                      variants={{
                        hidden: { y: '105%', opacity: 0, filter: 'blur(6px)' },
                        show: { y: '0%', opacity: 1, filter: 'blur(0px)', transition: { duration: 0.95, ease: EASE_OUT } },
                      }}
                    >
                      <span className={w.lime ? 'text-lime' : undefined}>{w.text}</span>
                      {w.tail}
                    </motion.span>
                    {' '}
                  </span>
                )
              })}
            </span>
          ))}
        </motion.h2>

        <div className="mt-10 grid lg:mt-14 lg:grid-cols-12">
          <Reveal delay={0.25} className="lg:col-span-5 lg:col-start-8">
            <p className="max-w-[28rem] text-[17px] leading-[1.6] text-muted lg:ml-auto">
              Four creative disciplines. One goal — building a stronger digital presence for your business.
            </p>
          </Reveal>
        </div>
      </div>
    </div>
  )
}
