import type { ReactNode } from 'react'
import { MaskLines, Reveal } from './Reveal'
import { cn } from '../../lib/cn'

type Props = {
  index: string
  label: string
  lines: ReactNode[]
  sub?: ReactNode
  className?: string
}

/** "(02) — Work" label, masked display heading, and a supporting line on the right. */
export function SectionHeader({ index, label, lines, sub, className }: Props) {
  return (
    <div className={cn('grid gap-8 lg:grid-cols-12 lg:items-end', className)}>
      <div className="lg:col-span-8">
        <Reveal y={14}>
          <p className="label flex items-center gap-3">
            <span className="text-lime">({index})</span>
            <span aria-hidden className="h-px w-8 bg-white/20" />
            {label}
          </p>
        </Reveal>
        <MaskLines as="h2" className="h2 mt-6" lines={lines} />
      </div>
      {sub && (
        <Reveal className="lg:col-span-4 lg:pb-3" delay={0.15}>
          <p className="max-w-[26rem] text-[17px] leading-[1.6] text-muted lg:ml-auto">{sub}</p>
        </Reveal>
      )}
    </div>
  )
}
