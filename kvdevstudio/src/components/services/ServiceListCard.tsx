import { ArrowUpRight } from 'lucide-react'
import { TiltCard } from './TiltCard'
import { ServiceVisual } from './ServiceVisuals'
import type { Service } from '../../lib/site'

/** Service card for the stacked list (phones, reduced motion). */
export function ServiceCard({ service: s }: { service: Service }) {
  return (
    <TiltCard className="svc-card group flex h-full flex-col overflow-hidden rounded-[28px] border border-line bg-card transition-colors duration-500 hover:border-white/[0.16]">
      {/* lime hairline that lights up on hover */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-10 top-0 z-10 h-px bg-gradient-to-r from-transparent via-lime/70 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
      />
      <div className="svc-visual relative m-2 h-[270px] overflow-hidden rounded-[22px] border border-white/[0.05] bg-[radial-gradient(ellipse_at_50%_0%,#1a1e25,#0e1014_70%)] sm:h-[310px] lg:h-[330px]">
        <div className="svc-stage absolute inset-0 transition-[opacity,filter] duration-500">
          <ServiceVisual kind={s.visual} />
        </div>
        <div className="svc-overlay glass absolute inset-x-3 bottom-3 rounded-2xl p-5">
          <p className="label text-[10px] text-lime">What&rsquo;s included</p>
          <ul className="mt-3 grid gap-x-5 gap-y-2 text-[13.5px] leading-snug text-fg sm:grid-cols-2">
            {s.details.map((d) => (
              <li key={d} className="flex items-start gap-2.5">
                <span aria-hidden className="mt-[7px] size-1.5 shrink-0 rounded-full bg-lime" />
                {d}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex flex-1 flex-col px-6 pt-5 pb-7 sm:px-8 sm:pb-8">
        <div className="flex items-center justify-between">
          <span className="label">Service {s.index}</span>
          <span className="font-mono text-[11px] tracking-[0.15em] text-dim">{s.index} / 04</span>
        </div>
        <h3 className="mt-5 max-w-[22ch] font-display text-balance text-[clamp(1.55rem,2.3vw,2.05rem)] leading-[1.06] font-medium tracking-[-0.035em]">
          {s.title}
        </h3>
        <p className="mt-4 max-w-[34rem] text-[15.5px] leading-[1.65] text-muted">{s.description}</p>
        <ul className="svc-tags mt-6 flex flex-wrap gap-2" aria-label={`${s.short} includes`}>
          {s.details.map((d) => (
            <li key={d} className="rounded-full border border-white/10 px-3 py-1.5 text-[12.5px] text-muted">
              {d}
            </li>
          ))}
        </ul>
        <a
          href="#contact"
          className="mt-auto inline-flex w-fit items-center gap-2 pt-7 text-[14px] font-medium text-fg transition-colors hover:text-lime"
          aria-label={`Discuss ${s.title}`}
        >
          <span className="link-underline">Discuss this service</span>
          <ArrowUpRight aria-hidden className="size-4 transition-transform duration-500 ease-out-expo group-hover:rotate-45" />
        </a>
      </div>
    </TiltCard>
  )
}
