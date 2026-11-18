/**
 * Designed brand-board cover for Taj Icecream (no project imagery exists in
 * this workspace yet). Replace with a real screenshot via PROJECTS[].image.
 */
const SCOOPS = [
  { name: 'Pistachio', hex: '#B9D98A' },
  { name: 'Mango', hex: '#F6B44B' },
  { name: 'Rose', hex: '#EBA3B4' },
  { name: 'Cocoa', hex: '#5A3A2E' },
]

export default function TajCover() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#f3ecdf] text-[#2a1d16]" role="img" aria-label="Taj Icecream brand board: wordmark and flavour colour palette">
      <div className="absolute -top-[30%] -right-[12%] aspect-square w-[62%] rounded-full bg-[#f6b44b] opacity-90" />
      <div className="absolute -top-[6%] right-[24%] aspect-square w-[30%] rounded-full bg-[#eba3b4]" />
      <div className="absolute top-[34%] -right-[4%] aspect-square w-[26%] rounded-full bg-[#b9d98a]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_10%,rgba(255,255,255,0.35),transparent_55%)]" />

      <div className="absolute inset-x-[7%] bottom-[9%] flex items-end justify-between gap-4">
        <div>
          <p className="font-display text-[clamp(3.2rem,9vw,6.5rem)] leading-[0.82] font-semibold tracking-[-0.06em]">
            Taj<span className="text-[#d8892a]">.</span>
          </p>
          <p className="mt-2 font-display text-[clamp(0.9rem,1.6vw,1.15rem)] font-medium tracking-[0.32em] uppercase opacity-80">Icecream</p>
        </div>
        <ul className="hidden gap-2 sm:flex" aria-hidden>
          {SCOOPS.map((s) => (
            <li key={s.name} className="flex flex-col items-center gap-2">
              <span className="block size-9 rounded-full shadow-[inset_0_-4px_0_rgba(0,0,0,0.12)] lg:size-11" style={{ background: s.hex }} />
              <span className="font-mono text-[8.5px] tracking-[0.18em] uppercase opacity-60">{s.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
