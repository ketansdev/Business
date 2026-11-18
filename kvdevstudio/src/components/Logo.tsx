import { cn } from '../lib/cn'

/** Custom monogram: a K whose upper arm hands off into a V. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden className={cn('shrink-0', className)}>
      <rect width="32" height="32" rx="9" fill="#C6FF4D" />
      <g fill="none" stroke="#08090B" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8.5 8.5v15M8.5 16.5 14.5 8.5M10.6 13.9l4.4 9.6M17.5 8.5l4 15 4-15" />
      </g>
    </svg>
  )
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn('flex items-center gap-2.5', className)}>
      <LogoMark className="size-8" />
      <span className="font-display text-[15px] leading-none font-semibold tracking-[-0.02em] whitespace-nowrap">
        KV DEV<span className="ml-1 font-normal text-muted">Studio</span>
      </span>
    </span>
  )
}
