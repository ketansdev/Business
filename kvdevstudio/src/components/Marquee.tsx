import { Fragment } from 'react'

const PHRASES = ['Creative Thinking.', 'Smart Development.', 'Digital Growth.']

function Star() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="mx-7 size-4 shrink-0 text-lime sm:mx-10 sm:size-5">
      <path fill="currentColor" d="M12 0c.6 6.4 5.6 11.4 12 12-6.4.6-11.4 5.6-12 12-.6-6.4-5.6-11.4-12-12C6.4 11.4 11.4 6.4 12 0Z" />
    </svg>
  )
}

function Row({ hidden = false }: { hidden?: boolean }) {
  return (
    <div className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {[0, 1].map((k) => (
        <Fragment key={k}>
          {PHRASES.map((p, i) => (
            <Fragment key={p}>
              <span
                className={
                  'font-display text-[clamp(1.35rem,2.6vw,2.2rem)] leading-none font-medium tracking-[-0.03em] whitespace-nowrap uppercase ' +
                  (i === 1 ? 'text-outline' : 'text-fg')
                }
              >
                {p}
              </span>
              <Star />
            </Fragment>
          ))}
        </Fragment>
      ))}
    </div>
  )
}

/** Values strip under the hero — a slow, linear marquee (paused for reduced motion). */
export default function Marquee() {
  return (
    <section aria-label="Creative thinking. Smart development. Digital growth." className="relative border-y border-line bg-ink-2/50 py-7 sm:py-9">
      <div className="fade-x overflow-hidden">
        <div className="flex w-max animate-marquee motion-reduce:animate-none">
          <Row />
          <Row hidden />
        </div>
      </div>
    </section>
  )
}
