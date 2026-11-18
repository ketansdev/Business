import { ArrowRight } from '@phosphor-icons/react';

const variants = {
  primary: 'bg-ink text-paper hover:bg-night-3 shadow-soft',
  accent: 'bg-accent text-white hover:bg-accent-ink shadow-soft',
  secondary: 'bg-paper-raised text-ink ring-1 ring-inset ring-line/10 hover:ring-line/25',
  ghost: 'text-ink hover:bg-ink/5',
  whatsapp: 'bg-[#1FAF54] text-white hover:bg-[#178F44] shadow-soft',
  light: 'bg-paper text-ink hover:bg-white',
};

// Arrow chip: a contrasting circle at the end of the pill
const chips = {
  primary: 'bg-paper/15 text-paper',
  accent: 'bg-white/20 text-white',
  secondary: 'bg-ink text-paper',
  ghost: 'bg-ink/5 text-ink',
  whatsapp: 'bg-white/20 text-white',
  light: 'bg-ink text-paper',
};

// Two sizes only: md 48px tall, sm 40px tall. With an arrow the chip sits 4px from the pill edge.
const sizes = {
  md: { base: 'h-12 gap-2', pad: 'px-6', padArrow: 'pl-6 pr-1', chip: 'h-10 w-10', icon: 20, arrow: 18 },
  sm: { base: 'h-10 gap-2', pad: 'px-4', padArrow: 'pl-4 pr-1', chip: 'h-8 w-8', icon: 16, arrow: 16 },
};

/** Pill button. Renders an <a> when `href` is set, otherwise a <button>. */
export default function Button({
  href,
  variant = 'primary',
  size = 'md',
  arrow = false,
  icon: Icon,
  className = '',
  children,
  ...props
}) {
  const Comp = href ? 'a' : 'button';
  const s = sizes[size];
  return (
    <Comp
      href={href}
      className={`group type-ui inline-flex items-center justify-center whitespace-nowrap rounded-full font-semibold
        transition-[background-color,box-shadow,transform] duration-300 ease-base
        hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]
        disabled:pointer-events-none disabled:opacity-60
        ${variants[variant]} ${s.base} ${arrow ? s.padArrow : s.pad} ${className}`}
      {...props}
    >
      {Icon && <Icon size={s.icon} weight="regular" aria-hidden="true" className="shrink-0" />}
      {children}
      {arrow && (
        <span className={`ml-1 flex shrink-0 items-center justify-center rounded-full ${chips[variant]} ${s.chip}`} aria-hidden="true">
          <ArrowRight size={s.arrow} weight="bold" className="-rotate-45 transition-transform duration-500 ease-base group-hover:rotate-0" />
        </span>
      )}
    </Comp>
  );
}
