/**
 * Shown when WebGL is unavailable: a calm, light gradient with soft sage and
 * blue light fields. Deliberately photo-free, so no photograph is ever cropped
 * to fill the screen or repeated from elsewhere on the site.
 */
export function HeroFallback() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-gradient-to-br from-paper via-mist to-haze-soft">
      <div aria-hidden className="absolute -right-24 top-1/4 h-[34rem] w-[34rem] rounded-full bg-sage/25 blur-3xl motion-safe:animate-[heroGlow_14s_ease-in-out_infinite_alternate]" />
      <div aria-hidden className="absolute -bottom-32 right-1/3 h-[30rem] w-[30rem] rounded-full bg-haze/35 blur-3xl motion-safe:animate-[heroGlow_18s_ease-in-out_infinite_alternate-reverse]" />
      <div aria-hidden className="absolute right-[12%] top-[18%] hidden h-[58%] w-[26%] rounded-t-full border border-line bg-paper/50 shadow-[var(--shadow-soft)] backdrop-blur-sm md:block" />
      <style>{`@keyframes heroGlow{from{transform:translate3d(0,0,0) scale(1)}to{transform:translate3d(-6%,4%,0) scale(1.08)}}`}</style>
    </div>
  );
}
