import { useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties, type RefObject } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, X } from 'lucide-react'
import { TiltCard } from './TiltCard'
import { ServiceVisual } from './ServiceVisuals'
import { SERVICES, type Service } from '../../lib/site'
import { flash, registerServiceNavigator } from '../../lib/serviceNav'
import { EASE_OUT } from '../../lib/motion'
import { cn } from '../../lib/cn'

/* ---------------------------------------------------------------------------
   Depth roles. A card's role is a continuous function of d = index − t,
   where t (the timeline's "focus") runs −2 → 3 across the pinned runway.
     d = 0  active  · d = +1 upcoming (waiting below, deeper)
     d = −1 previous (receded above) · |d| = 2 off-stage
   y is in % of the stage height; z in px; b = blur px; br = brightness.
   --------------------------------------------------------------------------- */
type Role = { z: number; s: number; y: number; o: number; b: number; br: number; rx: number }
const ROLES: Array<[number, Role]> = [
  [-2, { z: -420, s: 0.74, y: -50, o: 0, b: 8, br: 0.4, rx: -8 }],
  [-1, { z: -180, s: 0.86, y: -31, o: 0.45, b: 3, br: 0.7, rx: -5 }],
  [0, { z: 0, s: 1, y: 0, o: 1, b: 0, br: 1, rx: 0 }],
  [1, { z: -350, s: 0.78, y: 32, o: 0.22, b: 6, br: 0.5, rx: 7 }],
  [2, { z: -450, s: 0.72, y: 38, o: 0, b: 10, br: 0.4, rx: 10 }],
]
const KEYS: Array<keyof Role> = ['z', 's', 'y', 'o', 'b', 'br', 'rx']

function roleAt(d: number, k: number): Role {
  const dd = Math.max(-2, Math.min(2, d))
  let i = 0
  while (i < ROLES.length - 2 && dd > ROLES[i + 1][0]) i++
  const [d0, a] = ROLES[i]
  const [d1, b] = ROLES[i + 1]
  let f = (dd - d0) / (d1 - d0)
  // Shape the hand-off around focus: the incoming card (0 < d < 1) sharpens
  // early, the outgoing card (−1 < d < 0) recedes early, so the crossover
  // never shows two half-blurred cards on top of each other.
  if (d0 === 0) f = Math.pow(f, 1.9)
  else if (d1 === 0) f = 1 - Math.pow(1 - f, 0.45)
  const out = {} as Role
  for (const key of KEYS) out[key] = a[key] + (b[key] - a[key]) * f
  // Tablet: shorter travel, shallower depth, lighter blur
  out.z *= k
  out.y *= k
  out.rx *= k
  out.b *= 0.5 + 0.5 * k
  return out
}

function applyRole(el: HTMLElement, d: number, k: number, stageH: number) {
  const r = roleAt(d, k)
  el.style.transform = `translate3d(-50%, calc(-50% + ${((r.y / 100) * stageH).toFixed(1)}px), ${r.z.toFixed(1)}px) scale(${r.s.toFixed(4)}) rotateX(${r.rx.toFixed(2)}deg)`
  el.style.opacity = r.o.toFixed(3)
  el.style.filter = r.b < 0.05 && r.br > 0.995 ? 'none' : `blur(${r.b.toFixed(2)}px) brightness(${r.br.toFixed(3)})`
  el.style.visibility = r.o < 0.004 ? 'hidden' : 'visible'
  el.style.zIndex = String(100 - Math.round(Math.abs(d) * 10))
  const on = Math.abs(d) < 0.5
  if (el.dataset.active !== String(on)) {
    el.dataset.active = String(on)
    el.inert = !on
  }
}

/** Timeline shape: entrance, then a hold per card with a transition between each. */
const ENTRANCE = 1.35
const TRANSITION = 1
const HOLD = 0.75

/**
 * Cinematic services: a 400svh runway with a sticky 100svh stage. One GSAP
 * ScrollTrigger (scrub) drives a single focus value; every card derives its
 * depth role from it, so forward and reverse scrolling are always continuous.
 */
export default function ServiceStage({ tablet }: { tablet: boolean }) {
  const runwayRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const shells = useRef<(HTMLDivElement | null)[]>([])
  const fillRef = useRef<HTMLSpanElement>(null)
  const navigateRef = useRef<(i: number, smooth: boolean) => void>(() => {})
  const activeRef = useRef(0)
  const [active, setActive] = useState(0)
  const k = tablet ? 0.68 : 1

  // Fail-safe resting state (card 01 in focus) until GSAP takes over.
  const initial = useMemo(() => {
    const h = typeof window === 'undefined' ? 900 : window.innerHeight
    return SERVICES.map((_, i) => {
      const r = roleAt(i, k)
      return {
        transform: `translate3d(-50%, calc(-50% + ${((r.y / 100) * h).toFixed(1)}px), ${r.z}px) scale(${r.s}) rotateX(${r.rx}deg)`,
        opacity: r.o,
        filter: i === 0 ? 'none' : `blur(${r.b}px) brightness(${r.br})`,
        zIndex: 100 - i * 10,
      } as CSSProperties
    })
  }, [k])

  useLayoutEffect(() => {
    let cancelled = false
    let revert = () => {}

    import('../../lib/gsap').then(({ gsap, ScrollTrigger }) => {
      const runway = runwayRef.current
      if (cancelled || !runway) return
      const ctx = gsap.context(() => {
        const focus = { t: -2 }
        const render = () => {
          const h = stageRef.current?.clientHeight ?? window.innerHeight
          const t = focus.t
          shells.current.forEach((el, i) => el && applyRole(el, i - t, k, h))
          const idx = Math.max(0, Math.min(SERVICES.length - 1, Math.round(t)))
          if (idx !== activeRef.current) {
            activeRef.current = idx
            setActive(idx)
          }
          if (fillRef.current) fillRef.current.style.transform = `scaleY(${Math.max(0, Math.min(1, t / (SERVICES.length - 1))).toFixed(4)})`
        }

        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          onUpdate: render,
          scrollTrigger: {
            trigger: runway,
            // Begins as the stage rises into view, so card 01's approach is seen
            start: 'top 40%',
            end: 'bottom bottom',
            scrub: 0.8,
            invalidateOnRefresh: true,
          },
        })
        tl.to(focus, { t: 0, duration: ENTRANCE, ease: 'power2.out' })
        SERVICES.forEach((_, i) => {
          if (i > 0) tl.to(focus, { t: i, duration: TRANSITION, ease: 'power2.inOut' })
          const end = tl.duration()
          const hold = i === SERVICES.length - 1 ? HOLD * 1.5 : HOLD
          tl.addLabel(`s${i}`, end + hold / 2)
          tl.to(focus, { t: i, duration: hold }, end)
        })
        render()

        navigateRef.current = (i, smooth) => {
          const st = tl.scrollTrigger
          if (!st) return
          window.scrollTo({ top: st.labelToScroll(`s${i}`), behavior: smooth ? 'smooth' : 'instant' })
          const card = shells.current[i]?.querySelector('.svc-stage-card')
          if (card) flash(card, smooth ? 900 : 0)
        }
        registerServiceNavigator((i, smooth) => navigateRef.current(i, smooth))
      }, runway)

      revert = () => {
        registerServiceNavigator(null)
        ctx.revert()
      }
      document.fonts?.ready.then(() => ScrollTrigger.refresh())
    })

    return () => {
      cancelled = true
      revert()
    }
  }, [k])

  return (
    <div ref={runwayRef} className="relative h-[400svh]">
      <div
        ref={stageRef}
        className={cn('sticky top-0 h-[100svh] overflow-hidden', tablet ? '[perspective:1100px]' : '[perspective:1400px]')}
      >
        {/* Lighting + texture */}
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_58%_52%_at_50%_50%,rgba(255,255,255,0.05),transparent_72%)]" />
          <div className="absolute inset-x-0 bottom-0 h-2/3 bg-[radial-gradient(ellipse_45%_55%_at_50%_100%,rgba(198,255,77,0.06),transparent_70%)]" />
          <div className="grid-dots absolute inset-0 opacity-50 [mask-image:radial-gradient(ellipse_72%_62%_at_50%_50%,#000_25%,transparent_80%)]" />
        </div>

        <div role="list" aria-label="Services" className="absolute inset-0">
          {SERVICES.map((s, i) => (
            <div
              key={s.index}
              role="listitem"
              ref={(el) => {
                shells.current[i] = el
              }}
              className="svc-shell absolute top-1/2 left-1/2"
              style={initial[i]}
            >
              <StageCard service={s} isActive={active === i} tablet={tablet} />
            </div>
          ))}
        </div>

        {/* Edge fades keep receding cards from fighting the header and the next section */}
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 z-[150] h-32 bg-gradient-to-b from-ink to-transparent" />
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 z-[150] h-24 bg-gradient-to-t from-ink to-transparent" />

        <Indicator active={active} fillRef={fillRef} onNavigate={(i) => navigateRef.current(i, true)} />
      </div>
    </div>
  )
}

/* ---------------------------------------------------------------------------
   Progress indicator + service navigation
   --------------------------------------------------------------------------- */
function Indicator({
  active,
  fillRef,
  onNavigate,
}: {
  active: number
  fillRef: RefObject<HTMLSpanElement | null>
  onNavigate: (i: number) => void
}) {
  return (
    <nav aria-label="Service chapters" className="absolute top-1/2 left-[clamp(18px,3.2vw,52px)] z-[200] -translate-y-1/2">
      <div className="flex gap-5">
        <div aria-hidden className="relative w-px bg-white/10">
          <span ref={fillRef} className="absolute inset-0 origin-top bg-lime" style={{ transform: 'scaleY(0)' }} />
        </div>
        <ol className="flex flex-col gap-7 py-1">
          {SERVICES.map((s, i) => {
            const on = active === i
            return (
              <li key={s.index}>
                <button
                  type="button"
                  onClick={() => onNavigate(i)}
                  aria-current={on ? 'step' : undefined}
                  aria-label={`${s.index} of 04: ${s.title}`}
                  className="group block cursor-pointer text-left"
                >
                  <span
                    className={cn(
                      'font-mono text-[11px] tracking-[0.2em] transition-colors duration-300',
                      on ? 'text-lime' : 'text-dim group-hover:text-fg',
                    )}
                  >
                    {s.index}
                    <span className="hidden min-[1360px]:inline"> / 04</span>
                  </span>
                  <span
                    className={cn(
                      'mt-1.5 hidden max-w-[11.5rem] text-[10.5px] leading-snug font-medium tracking-[0.16em] uppercase transition-colors duration-300 min-[1360px]:block',
                      on ? 'text-fg' : 'text-dim/80 group-hover:text-muted',
                    )}
                  >
                    {s.indicator}
                  </span>
                </button>
              </li>
            )
          })}
        </ol>
      </div>
    </nav>
  )
}

/* ---------------------------------------------------------------------------
   One service card
   --------------------------------------------------------------------------- */
const reveal = {
  off: { opacity: 0.35, y: 14 },
  on: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE_OUT, delay: 0.08 + i * 0.07 } }),
}

function StageCard({ service: s, isActive, tablet }: { service: Service; isActive: boolean; tablet: boolean }) {
  const [open, setOpen] = useState(false)
  useEffect(() => {
    if (!isActive) setOpen(false)
  }, [isActive])
  const state = isActive ? 'on' : 'off'

  return (
    <TiltCard
      max={4}
      className="svc-stage-card group/card overflow-hidden rounded-[32px] border border-white/[0.09] bg-[linear-gradient(160deg,rgba(29,33,40,0.97),rgba(19,22,27,0.98)_52%,rgba(14,16,20,0.99))] shadow-[0_70px_140px_-50px_rgba(0,0,0,0.95),inset_0_1px_0_rgba(255,255,255,0.06)] transition-[border-color] duration-500 hover:border-lime/30"
    >
      <span aria-hidden className="svc-card-glow pointer-events-none absolute inset-x-16 top-0 z-10 h-px bg-gradient-to-r from-transparent via-lime/80 to-transparent" />

      <div className={cn('grid h-full', tablet ? 'grid-rows-[minmax(0,1.05fr)_auto]' : 'grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]')}>
        {/* Content */}
        <div className={cn('relative flex min-h-0 flex-col', tablet ? 'order-2 px-8 pt-6 pb-8' : 'p-[clamp(28px,4.2vh,48px)]')}>
          <motion.div custom={0} variants={reveal} initial={false} animate={state} className="flex items-start justify-between gap-4">
            <span className="text-outline font-display text-[clamp(3rem,7.5vh,5.25rem)] leading-[0.78] font-semibold tracking-[-0.06em]">{s.index}</span>
            <span className="label pt-1 text-right text-[10px]">{s.category}</span>
          </motion.div>

          <div className={cn(tablet ? 'mt-5' : 'mt-auto')}>
            <motion.h3
              custom={1}
              variants={reveal}
              initial={false}
              animate={state}
              className="font-display text-[clamp(1.85rem,min(3.1vw,5.4vh),3.3rem)] leading-[1.02] font-semibold tracking-[-0.042em] text-balance"
            >
              {s.title}
            </motion.h3>
            <motion.p
              custom={2}
              variants={reveal}
              initial={false}
              animate={state}
              className="mt-[clamp(12px,2.2vh,22px)] max-w-[31rem] text-[clamp(14.5px,1.9vh,16.5px)] leading-[1.62] text-muted"
            >
              {s.description}
            </motion.p>
            <motion.div custom={3} variants={reveal} initial={false} animate={state} className="mt-[clamp(18px,3.4vh,34px)] flex flex-wrap items-center gap-x-6 gap-y-3">
              <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
                aria-controls={`svc-details-${s.visual}`}
                className="group/cta inline-flex h-11 items-center gap-3 rounded-full bg-lime pr-1.5 pl-5 text-[14px] font-medium text-lime-ink transition-shadow duration-300 hover:shadow-[0_12px_32px_-12px_rgba(198,255,77,0.6)] active:scale-[0.97]"
              >
                {open ? 'Hide details' : 'Explore service'}
                <span className="grid size-8 place-items-center rounded-full bg-lime-ink text-lime transition-transform duration-500 ease-out-expo group-hover/cta:translate-x-0.5 group-hover/cta:rotate-45">
                  <ArrowUpRight aria-hidden className="size-4" />
                </span>
              </button>
              <a href="#contact" className="link-underline text-[14px] font-medium text-muted transition-colors hover:text-fg">
                Start a project
              </a>
            </motion.div>
          </div>
        </div>

        {/* Visual */}
        <div
          className={cn(
            'svc-visual relative min-h-0 overflow-hidden rounded-[24px] border border-white/[0.05] bg-[radial-gradient(ellipse_at_50%_20%,#1c2028,#0d0f13_72%)]',
            tablet ? 'order-1 m-3 mb-0' : 'm-3',
          )}
        >
          <motion.div
            className="absolute inset-0"
            initial={false}
            animate={{ scale: isActive ? 1 : 0.94, opacity: open ? 0.35 : isActive ? 1 : 0.75 }}
            transition={{ duration: 0.9, ease: EASE_OUT }}
          >
            <ServiceVisual kind={s.visual} />
          </motion.div>

          <AnimatePresence>
            {open && (
              <motion.div
                id={`svc-details-${s.visual}`}
                role="region"
                aria-label={`${s.title}: what's included`}
                className="glass absolute inset-x-4 bottom-4 rounded-[20px] p-5 sm:p-6"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 16 }}
                transition={{ duration: 0.45, ease: EASE_OUT }}
              >
                <div className="flex items-center justify-between">
                  <p className="label text-[10px] text-lime">What&rsquo;s included</p>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    aria-label="Close details"
                    className="grid size-8 place-items-center rounded-full border border-white/10 text-muted transition-colors hover:text-fg"
                  >
                    <X aria-hidden className="size-4" />
                  </button>
                </div>
                <ul className="mt-3 grid gap-x-6 gap-y-2.5 text-[14px] leading-snug text-fg sm:grid-cols-2">
                  {s.details.map((d, i) => (
                    <motion.li
                      key={d}
                      className="flex items-start gap-2.5"
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.08 + i * 0.05, ease: EASE_OUT }}
                    >
                      <span aria-hidden className="mt-[7px] size-1.5 shrink-0 rounded-full bg-lime" />
                      {d}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </TiltCard>
  )
}
