import { HERO_TAGS } from '../lib/site'

const TAG_POS = [
  { left: '14%', top: '30%' },
  { left: '80%', top: '22%' },
  { left: '86%', top: '58%' },
  { left: '20%', top: '66%' },
]

/**
 * Static umbrella illustration for devices without WebGL (or after a 3D error).
 * Same composition and labels as the live scene, drawn in SVG.
 */
export default function HeroFallback({ desktop }: { desktop: boolean }) {
  const ribs = Array.from({ length: 7 }, (_, i) => 60 + i * 46.6)
  return (
    <div className="absolute inset-0" aria-hidden>
      <div
        className={desktop ? 'absolute top-1/2 left-[75%] w-[min(36vw,560px)] -translate-x-1/2 -translate-y-1/2' : 'absolute inset-0 m-auto h-[88%] w-[min(86vw,420px)]'}
      >
        <svg viewBox="0 0 400 440" className="h-full w-full" fill="none">
          <defs>
            <linearGradient id="fb-canopy" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#fff" stopOpacity="0.2" />
              <stop offset="1" stopColor="#fff" stopOpacity="0.03" />
            </linearGradient>
          </defs>
          <g transform="rotate(-12 200 200)">
            <path
              d="M40 190 C 60 90, 140 40, 200 40 C 260 40, 340 90, 360 190 Q 336 172, 313 188 Q 290 170, 267 186 Q 244 170, 221 186 Q 200 172, 179 186 Q 156 170, 133 186 Q 110 170, 87 188 Q 64 172, 40 190 Z"
              fill="url(#fb-canopy)"
              stroke="rgba(255,255,255,0.55)"
              strokeWidth="1.2"
            />
            {ribs.map((x) => (
              <path key={x} d={`M200 42 Q ${200 + (x - 200) * 0.62} 70, ${x} 186`} stroke="rgba(230,234,240,0.35)" strokeWidth="1" />
            ))}
            <line x1="200" y1="22" x2="200" y2="372" stroke="#c9ced6" strokeWidth="3" strokeLinecap="round" />
            <path d="M200 372 v 22 a 18 18 0 0 1 -36 0" stroke="#3a404a" strokeWidth="8" strokeLinecap="round" />
            {[87, 179, 267, 360].map((x, i) => (
              <circle key={i} cx={x === 360 ? 358 : x} cy={x === 360 ? 189 : 187} r="3.2" fill="#C6FF4D" />
            ))}
          </g>
        </svg>
        {HERO_TAGS.map((tag, i) => (
          <span
            key={tag}
            className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/12 bg-[rgba(14,16,20,0.8)] px-3 py-1.5 font-mono text-[10.5px] tracking-[0.2em] text-fg uppercase"
            style={TAG_POS[i]}
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  )
}
