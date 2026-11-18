import type { MouseEventHandler, ReactNode } from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { useMagnetic } from '../../hooks/useMagnetic'
import { cn } from '../../lib/cn'

type Variant = 'primary' | 'ghost'
type Size = 'sm' | 'md' | 'lg'

type Props = {
  href: string
  children: ReactNode
  variant?: Variant
  size?: Size
  icon?: boolean
  className?: string
  onClick?: MouseEventHandler<HTMLAnchorElement>
  ariaLabel?: string
  /** Opens in a new tab (WhatsApp, external sites). */
  external?: boolean
}

const base =
  'group relative inline-flex shrink-0 select-none items-center gap-3 rounded-full font-medium tracking-[-0.01em] whitespace-nowrap transition-[background-color,border-color,color,box-shadow] duration-300 ease-standard active:scale-[0.97]'

const variants: Record<Variant, string> = {
  primary:
    'bg-lime text-lime-ink hover:bg-[#d4ff74] hover:shadow-[0_10px_34px_-10px_rgba(198,255,77,0.55)]',
  ghost:
    'border border-line-2 bg-white/[0.03] text-fg backdrop-blur-md hover:border-white/25 hover:bg-white/[0.07]',
}

const sizes: Record<Size, { withIcon: string; plain: string; icon: string }> = {
  sm: { withIcon: 'h-10 pl-4 pr-1.5 text-[13.5px]', plain: 'h-10 px-4 text-[13.5px]', icon: 'size-7' },
  md: { withIcon: 'h-12 pl-6 pr-2 text-[15px]', plain: 'h-12 px-6 text-[15px]', icon: 'size-8' },
  lg: { withIcon: 'h-14 pl-7 pr-2 text-base', plain: 'h-14 px-7 text-base', icon: 'size-10' },
}

/** Pill CTA with a subtle magnetic pull and a rolling label on hover. */
export function Button({ href, children, variant = 'primary', size = 'md', icon = true, className, onClick, ariaLabel, external = false }: Props) {
  const m = useMagnetic<HTMLAnchorElement>(0.2)
  const s = sizes[size]
  return (
    <motion.a
      ref={m.ref}
      href={href}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      onClick={onClick}
      aria-label={ariaLabel}
      onPointerMove={m.onPointerMove}
      onPointerLeave={m.onPointerLeave}
      style={{ x: m.x, y: m.y }}
      className={cn(base, variants[variant], icon ? s.withIcon : s.plain, className)}
    >
      <span className="relative block overflow-hidden leading-[1.35]">
        <span className="block transition-transform duration-500 ease-out-expo group-hover:-translate-y-full">{children}</span>
        <span aria-hidden className="absolute inset-0 translate-y-full transition-transform duration-500 ease-out-expo group-hover:translate-y-0">
          {children}
        </span>
      </span>
      {icon && (
        <span
          className={cn(
            'grid place-items-center rounded-full transition-transform duration-500 ease-out-expo group-hover:rotate-45',
            s.icon,
            variant === 'primary' ? 'bg-lime-ink text-lime' : 'bg-white/10 text-fg',
          )}
        >
          <ArrowUpRight aria-hidden className="size-[15px]" strokeWidth={2.2} />
        </span>
      )}
    </motion.a>
  )
}
