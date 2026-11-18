/**
 * KV DEV STUDIO logo: the official KV mark (public/brand) with the "DEV STUDIO" wordmark beside it,
 * matching the stacked logo's lettering. `inverted` uses the white mark for dark backgrounds.
 * Full stacked logos are also available: /brand/kv-logo-dark.webp and /brand/kv-logo-light.webp.
 */
export default function Logo({ className = '', inverted = false }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <img
        src={`${import.meta.env.BASE_URL}brand/${inverted ? 'kv-mark-light' : 'kv-mark-dark'}.webp`}
        alt="KV"
        width="74"
        height="36"
        className="h-8 w-auto shrink-0 sm:h-9"
        decoding="async"
        fetchpriority={inverted ? undefined : 'high'}
      />
      <span
        className={`whitespace-nowrap font-display text-sm font-bold uppercase leading-none tracking-[0.18em] ${inverted ? 'text-paper' : 'text-ink'}`}
      >
        Dev Studio
      </span>
    </span>
  );
}
