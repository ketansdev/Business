import { ArrowUpRight } from '@phosphor-icons/react';

const variants = {
  primary: 'bg-ink text-paper hover:bg-night-3 shadow-soft',
  accent: 'bg-accent text-white hover:bg-accent-ink shadow-soft',
  secondary: 'bg-paper-raised text-ink ring-1 ring-line/10 hover:ring-line/25 hover:bg-paper-sunken',
  ghost: 'text-ink hover:bg-ink/5',
  whatsapp: 'bg-[#1FAF54] text-white hover:bg-[#178F44] shadow-soft',
  light: 'bg-paper text-ink hover:bg-white',
};

// Main buttons: 8px vertical, 12px horizontal (Spacing-75 / Spacing-100)
const sizes = {
  sm: 'py-2 px-3 button-sm gap-1',
  md: 'py-2 px-3 button-md gap-2',
};

/** Renders an <a> when `href` is set, otherwise a <button>. */
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
  return (
    <Comp
      href={href}
      className={`group inline-flex items-center justify-center whitespace-nowrap rounded-lg
        transition-[background-color,box-shadow,transform] duration-300 ease-base
        hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]
        disabled:pointer-events-none disabled:opacity-60
        ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {Icon && <Icon size={size === 'sm' ? 16 : 20} weight="regular" aria-hidden="true" />}
      {children}
      {arrow && (
        <ArrowUpRight
          size={size === 'sm' ? 16 : 18}
          aria-hidden="true"
          className="transition-transform duration-500 ease-base group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
        />
      )}
    </Comp>
  );
}
