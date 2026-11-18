import type { CSSProperties } from 'react'
import { Bookmark, Heart, MessageCircle, MousePointer2, Search, Send, Smartphone, Store } from 'lucide-react'
import { LogoMark } from '../Logo'
import type { ServiceVisualKey } from '../../lib/site'

const depth = (px: number) => ({ '--depth': `${px}px` }) as CSSProperties

/* ---------------------------------------------------------------------------
   01 — Floating browser with a live website preview
   --------------------------------------------------------------------------- */
function WebVisual() {
  return (
    <div className="absolute inset-0 grid place-items-center [perspective:1100px]">
      <div className="svc-layer relative w-[76%] max-w-[440px]" style={depth(-9)}>
        <div className="overflow-hidden rounded-[14px] border border-white/10 bg-[#0c0e12] shadow-[0_40px_70px_-28px_rgba(0,0,0,0.95)] [transform:rotateX(9deg)_rotateY(-13deg)_rotateZ(1deg)]">
          <div className="flex items-center gap-1.5 border-b border-white/[0.06] px-3 py-2.5">
            <span className="size-2 rounded-full bg-white/15" />
            <span className="size-2 rounded-full bg-white/15" />
            <span className="size-2 rounded-full bg-white/15" />
            <span className="mx-auto flex h-[18px] w-[48%] items-center justify-center rounded-full bg-white/[0.05] font-mono text-[8.5px] tracking-wider text-dim">
              yourbrand.com
            </span>
          </div>
          <div className="relative aspect-[16/10] overflow-hidden">
            <div className="absolute inset-x-0 top-0 animate-[browser-scroll_12s_cubic-bezier(0.65,0,0.35,1)_infinite] space-y-[7%] p-[5%]">
              <div className="flex items-center justify-between">
                <span className="size-3 rounded-[4px] bg-lime" />
                <span className="flex gap-2">
                  <span className="h-1.5 w-6 rounded-full bg-white/20" />
                  <span className="h-1.5 w-6 rounded-full bg-white/20" />
                  <span className="h-1.5 w-6 rounded-full bg-white/20" />
                </span>
              </div>
              <div className="space-y-2">
                <span className="block h-3 w-[78%] rounded-full bg-white/85" />
                <span className="block h-3 w-[52%] rounded-full bg-white/85" />
                <span className="block h-1.5 w-[60%] rounded-full bg-white/20" />
                <span className="mt-3 block h-4 w-[24%] animate-[btn-press_12s_linear_infinite] rounded-full bg-lime" />
              </div>
              <div className="relative aspect-[16/7] overflow-hidden rounded-lg bg-[linear-gradient(140deg,#1d232c,#0f1216_70%)]">
                <span className="absolute top-[20%] right-[14%] aspect-square w-[11%] rounded-full bg-[radial-gradient(circle_at_35%_35%,#e6ff9f,#c6ff4d_45%,#5d7a17)] opacity-90" />
                <span className="absolute inset-x-0 bottom-0 h-1/2 bg-[linear-gradient(to_top,#0b0d10,transparent)]" />
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="space-y-1.5 rounded-md border border-white/[0.06] bg-white/[0.03] p-2">
                    <span className={`block size-3 rounded ${i === 1 ? 'bg-lime/80' : 'bg-white/20'}`} />
                    <span className="block h-1 w-[80%] rounded-full bg-white/25" />
                    <span className="block h-1 w-[55%] rounded-full bg-white/15" />
                  </div>
                ))}
              </div>
              <div className="space-y-1.5">
                <span className="block h-1.5 w-full rounded-full bg-white/15" />
                <span className="block h-1.5 w-[86%] rounded-full bg-white/15" />
                <span className="block h-1.5 w-[64%] rounded-full bg-white/15" />
              </div>
            </div>
            <MousePointer2
              aria-hidden
              className="absolute top-[84%] left-[78%] size-4 animate-[cursor-path_12s_cubic-bezier(0.65,0,0.35,1)_infinite] fill-white text-ink drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]"
            />
          </div>
        </div>
      </div>
      <div className="svc-layer absolute top-[13%] right-[8%]" style={depth(16)}>
        <span className="glass flex animate-float items-center gap-2 rounded-full px-3 py-1.5 font-mono text-[10.5px] text-fg">
          <span className="text-lime">&lt;/&gt;</span> clean code
        </span>
      </div>
      <div className="svc-layer absolute bottom-[12%] left-[7%]" style={depth(20)}>
        <span className="glass flex animate-float-slow items-center gap-2 rounded-full px-3 py-1.5 text-[11px] text-fg">
          <Smartphone aria-hidden className="size-3.5 text-lime" /> Responsive
        </span>
      </div>
    </div>
  )
}

/* ---------------------------------------------------------------------------
   02 — 3D location pin over a perspective map
   --------------------------------------------------------------------------- */
function LocalVisual() {
  return (
    <div className="absolute inset-0 overflow-hidden [perspective:900px]">
      <div className="svc-layer absolute inset-0" style={depth(-6)}>
        <div className="absolute top-[60%] left-1/2 aspect-square w-[140%] [transform:translate(-50%,-50%)_rotateX(62deg)_rotateZ(-26deg)]">
          <svg viewBox="0 0 400 400" className="absolute inset-0 h-full w-full" aria-hidden>
            <defs>
              <radialGradient id="map-fade" cx="50%" cy="50%" r="50%">
                <stop offset="0.55" stopColor="#fff" />
                <stop offset="1" stopColor="#fff" stopOpacity="0" />
              </radialGradient>
              <mask id="map-mask">
                <rect width="400" height="400" fill="url(#map-fade)" />
              </mask>
            </defs>
            <g mask="url(#map-mask)">
              <rect width="400" height="400" fill="#0e1014" />
              {Array.from({ length: 11 }, (_, i) => (
                <g key={i} stroke="rgba(255,255,255,0.05)" strokeWidth="1">
                  <line x1={i * 40} y1="0" x2={i * 40} y2="400" />
                  <line x1="0" y1={i * 40} x2="400" y2={i * 40} />
                </g>
              ))}
              {[
                [52, 48, 96, 60],
                [252, 46, 92, 66],
                [44, 248, 104, 96],
                [262, 244, 90, 104],
                [168, 286, 56, 70],
              ].map(([x, y, w, h], i) => (
                <rect key={i} x={x} y={y} width={w} height={h} rx="6" fill="#151920" />
              ))}
              <rect x="166" y="52" width="64" height="88" rx="8" fill="rgba(198,255,77,0.08)" />
              <path d="M0 200 H400 M200 0 V400" stroke="#232831" strokeWidth="14" />
              <path d="M0 132 C 120 150, 260 110, 400 160" stroke="#1c2027" strokeWidth="8" fill="none" />
              <path d="M200 200 L 330 330" stroke="rgba(198,255,77,0.55)" strokeWidth="3" strokeDasharray="6 7" strokeLinecap="round" />
              <circle cx="330" cy="330" r="6" fill="#f5f5f5" />
            </g>
          </svg>
          <span className="absolute top-1/2 left-1/2 size-16 -translate-x-1/2 -translate-y-1/2 animate-[ring-pulse_3.2s_ease-out_infinite] rounded-full border border-lime/60" />
          <span className="absolute top-1/2 left-1/2 size-16 -translate-x-1/2 -translate-y-1/2 animate-[ring-pulse_3.2s_ease-out_1.6s_infinite] rounded-full border border-lime/40" />
          <span className="absolute top-1/2 left-1/2 h-5 w-9 -translate-x-1/2 -translate-y-1/2 animate-[pin-shadow_3.2s_ease-in-out_infinite] rounded-[50%] bg-black/70 blur-[3px]" />
        </div>
      </div>

      <div className="svc-layer absolute top-[60%] left-1/2" style={depth(14)}>
        <div className="absolute w-[58px] -translate-x-1/2 -translate-y-full animate-[pin-bob_3.2s_ease-in-out_infinite] drop-shadow-[0_18px_18px_rgba(0,0,0,0.55)]">
          <svg viewBox="0 0 64 84" aria-hidden>
            <defs>
              <linearGradient id="pin-body" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#e8ffad" />
                <stop offset="0.42" stopColor="#c6ff4d" />
                <stop offset="1" stopColor="#6f9a14" />
              </linearGradient>
              <radialGradient id="pin-gloss" cx="34%" cy="26%" r="40%">
                <stop offset="0" stopColor="#fff" stopOpacity="0.75" />
                <stop offset="1" stopColor="#fff" stopOpacity="0" />
              </radialGradient>
            </defs>
            <path d="M32 2C16 2 4 14 4 30c0 21 24 46 26.4 50.6a1.8 1.8 0 0 0 3.2 0C36 76 60 51 60 30 60 14 48 2 32 2Z" fill="url(#pin-body)" />
            <path d="M32 2C16 2 4 14 4 30c0 21 24 46 26.4 50.6a1.8 1.8 0 0 0 3.2 0C36 76 60 51 60 30 60 14 48 2 32 2Z" fill="url(#pin-gloss)" />
            <circle cx="32" cy="29" r="11" fill="#0b0f02" />
            <circle cx="32" cy="29" r="4.5" fill="#c6ff4d" />
          </svg>
        </div>
      </div>

      <div className="svc-layer absolute top-[10%] left-[7%]" style={depth(18)}>
        <span className="glass flex items-center gap-2 rounded-full py-2 pr-4 pl-3 text-[11.5px] text-muted">
          <Search aria-hidden className="size-3.5 text-fg" />
          studios near me
        </span>
      </div>
      <div className="svc-layer absolute top-[16%] right-[6%] w-[44%] max-w-[200px]" style={depth(24)}>
        <div className="animate-float-slow rounded-2xl border border-white/10 bg-[rgba(17,20,25,0.92)] p-3 shadow-[0_24px_50px_-20px_rgba(0,0,0,0.9)]">
          <div className="flex items-center gap-2.5">
            <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-lime text-lime-ink">
              <Store aria-hidden className="size-4" />
            </span>
            <span className="min-w-0 flex-1 space-y-1.5">
              <span className="block h-2 w-[85%] rounded-full bg-white/75" />
              <span className="block h-1.5 w-[55%] rounded-full bg-white/20" />
            </span>
          </div>
          <div className="mt-3 flex gap-1.5">
            {['Directions', 'Call', 'Website'].map((c) => (
              <span key={c} className="rounded-full border border-white/10 px-2 py-1 text-[8.5px] whitespace-nowrap text-muted">
                {c}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ---------------------------------------------------------------------------
   03 — Fanned social posts with floating creative assets
   --------------------------------------------------------------------------- */
const POST_ART = [
  'bg-[radial-gradient(circle_at_30%_28%,#e4ff9e_0,#c6ff4d_18%,#4a6413_52%,#12160b_85%)]',
  'bg-[linear-gradient(150deg,#353c49,#14171d_70%)]',
  'bg-[conic-gradient(from_210deg_at_60%_40%,#1b1f26,#4b5361,#1b1f26_70%)]',
]

function Post({ art, liked = false, className = '' }: { art: string; liked?: boolean; className?: string }) {
  return (
    <div className={`absolute inset-0 rounded-[18px] border border-white/10 bg-[#111418] p-2.5 shadow-[0_30px_60px_-24px_rgba(0,0,0,0.95)] ${className}`}>
      <div className="flex items-center gap-2 px-0.5 pb-2">
        <span className="size-5 rounded-full bg-[conic-gradient(#c6ff4d,#f5f5f5,#c6ff4d)] p-[1.5px]">
          <span className="block size-full rounded-full bg-[#111418]" />
        </span>
        <span className="h-1.5 w-12 rounded-full bg-white/50" />
      </div>
      <div className={`relative aspect-square overflow-hidden rounded-xl ${art}`}>
        <span className="absolute inset-x-[18%] bottom-[16%] h-[3px] rounded-full bg-white/40" />
        <span className="absolute inset-x-[30%] bottom-[24%] h-[3px] rounded-full bg-white/25" />
      </div>
      <div className="flex items-center gap-2.5 px-0.5 pt-2.5 text-white/70">
        <Heart aria-hidden className={`size-3.5 ${liked ? 'fill-lime text-lime' : ''}`} />
        <MessageCircle aria-hidden className="size-3.5" />
        <Send aria-hidden className="size-3.5" />
        <Bookmark aria-hidden className="ml-auto size-3.5" />
      </div>
    </div>
  )
}

function SocialVisual() {
  return (
    <div className="absolute inset-0 grid place-items-center [perspective:1100px]">
      <div className="svc-layer relative aspect-[4/5.3] h-[80%]" style={depth(-8)}>
        <div className="absolute inset-0 animate-[card-bob_7s_ease-in-out_infinite] [transform:translateX(-50%)_rotate(-11deg)_scale(0.86)] opacity-80">
          <Post art={POST_ART[1]} />
        </div>
        <div className="absolute inset-0 animate-[card-bob_7s_ease-in-out_1.2s_infinite] [transform:translateX(50%)_rotate(10deg)_scale(0.86)] opacity-80">
          <Post art={POST_ART[2]} />
        </div>
        <div className="absolute inset-0 animate-[card-bob_7s_ease-in-out_0.6s_infinite]">
          <Post art={POST_ART[0]} liked />
        </div>
      </div>
      <div className="svc-layer absolute top-[14%] right-[16%]" style={depth(22)}>
        <span className="grid size-11 animate-float place-items-center rounded-full bg-lime text-lime-ink shadow-[0_16px_30px_-12px_rgba(198,255,77,0.6)]">
          <Heart aria-hidden className="size-5 fill-current" />
        </span>
      </div>
      <div className="svc-layer absolute bottom-[16%] left-[13%]" style={depth(18)}>
        <span className="glass flex animate-float-slow items-center gap-2 rounded-full px-3 py-1.5 text-[11px] text-fg">
          <span className="size-1.5 rounded-full bg-lime" /> New post
        </span>
      </div>
    </div>
  )
}

/* ---------------------------------------------------------------------------
   04 — Floating type, mark and design materials
   --------------------------------------------------------------------------- */
function BrandVisual() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="grid-dots absolute inset-0 opacity-50" />
      <div className="svc-layer absolute top-1/2 left-[9%] -translate-y-[56%]" style={depth(16)}>
        <div className="relative font-display text-[clamp(88px,13vw,150px)] leading-none font-semibold tracking-[-0.07em]">
          <span aria-hidden className="text-outline absolute top-[6px] left-[6px] opacity-40">
            Aa
          </span>
          <span aria-hidden className="text-outline absolute top-[3px] left-[3px] opacity-70">
            Aa
          </span>
          <span className="relative bg-[linear-gradient(180deg,#ffffff,#9aa0a8)] bg-clip-text text-transparent">Aa</span>
        </div>
        <span className="label mt-2 block text-[9.5px] text-dim">Space Grotesk / 600</span>
      </div>

      <div className="svc-layer absolute top-[13%] right-[9%] w-[30%] max-w-[150px]" style={depth(-10)}>
        <div className="grid aspect-square animate-float-slow place-items-center rounded-[22px] border border-white/10 bg-[#111419] shadow-[0_30px_60px_-24px_rgba(0,0,0,0.95)]">
          <LogoMark className="w-[46%]" />
        </div>
      </div>

      <div className="svc-layer absolute right-[10%] bottom-[14%] flex items-center gap-3" style={depth(22)}>
        <span className="flex -space-x-2.5">
          {['#C6FF4D', '#F5F5F5', '#3A404A', '#08090B'].map((c) => (
            <span key={c} className="size-8 rounded-full border-2 border-[#15181d] shadow-md" style={{ background: c }} />
          ))}
        </span>
        <span className="font-mono text-[10px] tracking-wider text-dim">#C6FF4D</span>
      </div>

      <svg viewBox="0 0 300 120" className="svc-layer absolute bottom-[8%] left-[6%] w-[52%] max-w-[300px]" style={depth(8)} aria-hidden>
        <path
          d="M10 96 C 70 96, 80 24, 150 24 S 240 90, 290 40"
          fill="none"
          stroke="#c6ff4d"
          strokeWidth="1.6"
          pathLength={1}
          strokeDasharray="1"
          className="animate-[draw_3.2s_cubic-bezier(0.65,0,0.35,1)_infinite_alternate]"
        />
        <g stroke="rgba(255,255,255,0.45)" strokeWidth="1">
          <line x1="150" y1="24" x2="104" y2="24" />
          <line x1="150" y1="24" x2="196" y2="24" />
        </g>
        {[
          [10, 96],
          [150, 24],
          [290, 40],
        ].map(([x, y]) => (
          <rect key={x} x={x - 4} y={y - 4} width="8" height="8" fill="#15181d" stroke="#f5f5f5" strokeWidth="1.2" />
        ))}
        <circle cx="104" cy="24" r="3" fill="#f5f5f5" />
        <circle cx="196" cy="24" r="3" fill="#f5f5f5" />
      </svg>
    </div>
  )
}

export function ServiceVisual({ kind }: { kind: ServiceVisualKey }) {
  switch (kind) {
    case 'web':
      return <WebVisual />
    case 'local':
      return <LocalVisual />
    case 'social':
      return <SocialVisual />
    case 'brand':
      return <BrandVisual />
  }
}
