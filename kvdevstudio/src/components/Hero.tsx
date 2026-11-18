import { forwardRef, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import HeroStage from './HeroStage'
import { Button } from './ui/Button'
import { Eyebrow, MaskLines } from './ui/Reveal'
import { EASE_OUT } from '../lib/motion'
import { INTRO_DELAY } from '../lib/intro'
import { isFinePointer, prefersReducedMotion } from '../lib/env'
import { SERVICES, serviceAnchor } from '../lib/site'
import { canPinHero, goToService, heroState, keepService, releaseService, setActiveService, subscribeActive } from '../lib/heroState'
import { usePrefersReducedMotion } from '../hooks/useReducedMotion'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { cn } from '../lib/cn'

/**
 * Hero. With motion allowed it becomes a pinned, scroll-driven story:
 * a ~220svh runway behind a sticky stage. GSAP ScrollTrigger owns the
 * timeline (copy hand-off, caption, detail panel) and feeds raw progress to
 * the WebGL rig, which choreographs the umbrella, labels and service objects.
 * Under reduced motion it stays a normal, static hero.
 */
export default function Hero() {
  const reduced = usePrefersReducedMotion()
  const desktop = useMediaQuery('(min-width: 1024px)')
  const pinned = canPinHero(reduced)
  heroState.scrollDriven = pinned

  const sectionRef = useRef<HTMLElement>(null)
  const copyOuterRef = useRef<HTMLDivElement>(null)
  const copyRef = useRef<HTMLDivElement>(null)
  const backdropRef = useRef<HTMLDivElement>(null)
  const captionRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const cueRef = useRef<HTMLAnchorElement>(null)
  const railRef = useRef<HTMLSpanElement>(null)
  const d = INTRO_DELAY

  const rise = (delay: number) => ({
    initial: { opacity: 0, y: 22 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 1, ease: EASE_OUT, delay },
  })

  // ---- Pinned scroll timeline (GSAP is lazy-loaded; resting states are in the markup) ----
  useLayoutEffect(() => {
    if (!pinned || !sectionRef.current) {
      heroState.progress = 0
      return
    }
    let cancelled = false
    let revert = () => {}
    import('../lib/gsap').then(({ gsap, ScrollTrigger }) => {
      if (cancelled || !sectionRef.current) return
      const ctx = gsap.context(() => {
        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.6,
            onUpdate: (self) => {
              heroState.progress = self.progress
              if ((self.progress < 0.62 || self.progress > 0.9) && heroState.active >= 0) setActiveService(-1)
            },
            onRefresh: (self) => {
              heroState.progress = self.progress
            },
          },
        })
        // 0–20%: copy holds; 16–34%: it hands the stage over to the umbrella
        tl.to(
          copyOuterRef.current,
          {
            autoAlpha: 0,
            x: desktop ? -70 : 0,
            y: desktop ? 0 : -50,
            filter: 'blur(10px)',
            duration: 0.18,
            ease: 'power1.in',
          },
          0.16,
        )
          .to(cueRef.current, { autoAlpha: 0, duration: 0.05 }, 0.01)
          .to(backdropRef.current, { '--ax': '50%', '--ay': '46%', duration: 0.24, ease: 'power1.inOut' }, 0.2)
          // 40–60%: the chapter caption arrives with the labels
          .fromTo(captionRef.current, { autoAlpha: 0, y: 36 }, { autoAlpha: 1, y: 0, duration: 0.12, ease: 'power2.out' }, 0.4)
          // 72–90%: the explore panel; 84–100%: everything lifts toward Services
          .fromTo(panelRef.current, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.07, ease: 'power2.out' }, 0.72)
          .to(captionRef.current, { autoAlpha: 0, y: -40, duration: 0.1, ease: 'power1.in' }, 0.86)
          .to(panelRef.current, { autoAlpha: 0, y: 16, duration: 0.06, ease: 'power1.in' }, 0.88)
          .fromTo(railRef.current, { scaleY: 0 }, { scaleY: 1, duration: 1 }, 0)
          // The stage settles back as the Services sheet rises over it
          .to(sectionRef.current!.querySelector('[data-stage]'), { opacity: 0.45, duration: 0.14, ease: 'power1.in' }, 0.86)
      }, sectionRef)
      revert = () => ctx.revert()
      document.fonts?.ready.then(() => ScrollTrigger.refresh())
    })
    return () => {
      cancelled = true
      revert()
      heroState.progress = 0
    }
  }, [pinned, desktop])

  return (
    <section
      id="home"
      ref={sectionRef}
      aria-label="Introduction"
      className={cn('relative', pinned ? 'h-[300svh] lg:h-[320svh]' : 'isolate flex flex-col overflow-x-clip lg:min-h-[100svh]')}
    >
      <div className={cn(pinned ? 'sticky top-0 isolate h-[100svh] overflow-hidden' : 'contents')}>
        <HeroBackdrop ref={backdropRef} />

        <div ref={copyOuterRef} className="relative z-10">
          <div
            className={cn(
              'container-x flex flex-col justify-center pt-28 pb-6 sm:pt-40 lg:min-h-[100svh] lg:pt-28 lg:pb-24',
              pinned && 'max-lg:justify-start',
            )}
          >
            <div ref={copyRef} className="max-w-[40rem] lg:max-w-none">
              <motion.div {...rise(d)}>
                <Eyebrow>Independent Digital Creative Studio</Eyebrow>
              </motion.div>

              <MaskLines
                as="h1"
                onMount
                delay={d + 0.12}
                stagger={0.11}
                className="mt-6 w-fit font-display text-[clamp(2.5rem,10.4vw,4.6rem)] leading-[0.94] font-semibold tracking-[-0.048em] sm:mt-7 lg:text-[clamp(3.6rem,5.25vw,6.1rem)]"
                lineClassName="lg:whitespace-nowrap"
                lines={[
                  'Digital Experiences.',
                  'Built to Make',
                  <>
                    You <span className="text-lime">Stand Out.</span>
                  </>,
                ]}
              />

              <motion.p {...rise(d + 0.55)} className="mt-6 max-w-[28rem] text-[16px] leading-[1.6] text-muted sm:mt-8 sm:text-[17.5px]">
                We design, develop and elevate digital experiences that help ambitious businesses turn attention into growth.
              </motion.p>

              <motion.div {...rise(d + 0.68)} className="mt-7 flex flex-wrap items-center gap-3 sm:mt-9">
                <Button href="#services" size="lg">
                  Explore Our Services
                </Button>
                <Button href="#contact" size="lg" variant="ghost" icon={false}>
                  Start a Project
                </Button>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.2, delay: d + 0.95 }}
                className={cn('label mt-10 flex-wrap items-center gap-x-3 gap-y-1 text-dim', pinned ? 'hidden sm:flex' : 'flex')}
              >
                <span>Web Design</span>
                <span aria-hidden className="size-1 rounded-full bg-lime/80" />
                <span>Development</span>
                <span aria-hidden className="size-1 rounded-full bg-lime/80" />
                <span>Digital Growth</span>
              </motion.p>
            </div>
          </div>
        </div>

        <HeroStage copyRef={copyRef} startDelay={d} pinned={pinned} />

        {pinned && (
          <>
            <Caption ref={captionRef} />
            <ServicePanel ref={panelRef} reduced={reduced} desktop={desktop} />
            {/* Pinned-story progress rail */}
            <div aria-hidden className="absolute top-1/2 right-6 z-20 hidden h-36 w-px -translate-y-1/2 bg-white/10 lg:block xl:right-10">
              <span ref={railRef} className="absolute inset-0 origin-top scale-y-0 bg-lime" />
            </div>
          </>
        )}

        {/* Scroll cue */}
        <motion.a
          ref={cueRef}
          href="#services"
          aria-label="Scroll to services"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: d + 1.4 }}
          className="group absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-3 lg:flex"
        >
          <span className="label text-[10px] text-dim transition-colors group-hover:text-fg">Scroll</span>
          <span className="relative h-10 w-px overflow-hidden bg-white/10">
            <span className="absolute inset-x-0 top-0 h-1/2 animate-[scroll-cue_2.2s_cubic-bezier(0.65,0,0.35,1)_infinite] bg-lime" />
          </span>
        </motion.a>
      </div>
    </section>
  )
}

/** Chapter caption shown while the umbrella holds centre stage (desktop). */
const Caption = forwardRef<HTMLDivElement>(function Caption(_, ref) {
  return (
    <div
      ref={ref}
      className="pointer-events-none invisible absolute inset-x-0 top-[13svh] z-10 hidden flex-col items-center text-center opacity-0 lg:flex"
    >
      <p className="label flex items-center gap-3">
        <span className="text-lime">(01)</span>
        <span aria-hidden className="h-px w-8 bg-white/20" />
        What we do
      </p>
      <p className="mt-4 font-display text-[clamp(1.9rem,2.9vw,3rem)] leading-none font-semibold tracking-[-0.045em]">
        Everything under one <span className="text-lime">umbrella.</span>
      </p>
    </div>
  )
})

/** Explore panel: describes the hovered/tapped service and links to it. */
const ServicePanel = forwardRef<HTMLDivElement, { reduced: boolean; desktop: boolean }>(function ServicePanel({ reduced, desktop }, ref) {
  const [active, setActive] = useState(-1)
  useEffect(() => subscribeActive(setActive), [])
  const s = active >= 0 ? SERVICES[active] : null

  return (
    <div
      ref={ref}
      className="invisible absolute inset-x-0 bottom-5 z-20 flex justify-center px-4 opacity-0 sm:bottom-7"
      onPointerEnter={keepService}
      onPointerLeave={(e) => e.pointerType === 'mouse' && releaseService()}
    >
      <div
        data-fab-avoid
        className="glass w-full max-w-[540px] rounded-[22px] px-4 py-3.5 shadow-[0_30px_70px_-30px_rgba(0,0,0,0.9)] sm:px-5 sm:py-4"
        aria-live="polite"
      >
        <AnimatePresence mode="wait" initial={false}>
          {s ? (
            <motion.div
              key={s.index}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.28, ease: EASE_OUT }}
              className="flex items-center gap-4"
            >
              <span className="font-mono text-[12px] tracking-[0.15em] text-lime">{s.index}</span>
              <div className="min-w-0 flex-1">
                <p className="font-display text-[15.5px] leading-tight font-semibold tracking-[-0.02em] text-fg sm:text-[17px]">
                  {desktop ? s.title : s.node}
                </p>
                <p className="mt-1 text-[13px] leading-snug text-muted sm:text-[13.5px]">{s.teaser}</p>
              </div>
              <a
                href={`#${serviceAnchor(s)}`}
                onClick={(e) => {
                  e.preventDefault()
                  goToService(active, reduced)
                }}
                aria-label={`Explore ${s.title}`}
                className="group flex shrink-0 items-center gap-2 rounded-full bg-lime p-1.5 text-[13px] font-medium text-lime-ink transition-shadow hover:shadow-[0_10px_30px_-10px_rgba(198,255,77,0.6)] sm:py-2 sm:pr-2 sm:pl-4"
              >
                <span className="hidden sm:inline">Explore</span>
                <span className="grid size-8 place-items-center rounded-full bg-lime-ink text-lime transition-transform duration-500 ease-out-expo group-hover:rotate-45 sm:size-6">
                  <ArrowUpRight aria-hidden className="size-3.5" />
                </span>
              </a>
            </motion.div>
          ) : (
            <motion.p
              key="hint"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="flex items-center justify-center gap-3 py-1.5 text-center text-[13.5px] text-muted"
            >
              <span aria-hidden className="size-1.5 rounded-full bg-lime" />
              {desktop ? 'Hover a service to explore it, click to jump straight there.' : 'Tap a service to explore it.'}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
})

/** Guide lines, ambient light and a soft cursor-following light. */
const HeroBackdrop = forwardRef<HTMLDivElement>(function HeroBackdrop(_, forwarded) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || !isFinePointer() || prefersReducedMotion()) return
    let raf = 0
    let tx = 0.72
    let ty = 0.42
    let x = tx
    let y = ty
    const tick = () => {
      x += (tx - x) * 0.08
      y += (ty - y) * 0.08
      el.style.setProperty('--mx', `${(x * 100).toFixed(2)}%`)
      el.style.setProperty('--my', `${(y * 100).toFixed(2)}%`)
      raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.0008 ? requestAnimationFrame(tick) : 0
    }
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      if (e.clientY > r.bottom) return
      tx = (e.clientX - r.left) / r.width
      ty = (e.clientY - r.top) / r.height
      if (!raf) raf = requestAnimationFrame(tick)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      window.removeEventListener('pointermove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div
      ref={(el) => {
        ref.current = el
        if (typeof forwarded === 'function') forwarded(el)
        else if (forwarded) forwarded.current = el
      }}
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 [--ax:74%] [--ay:42%]"
    >
      <div className="guide-lines absolute inset-0 [mask-image:linear-gradient(to_bottom,transparent,#000_20%,#000_70%,transparent)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_55%_60%_at_var(--ax)_var(--ay),rgba(255,255,255,0.055),transparent_70%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(520px_circle_at_var(--mx,72%)_var(--my,42%),rgba(214,232,196,0.045),transparent_65%)]" />
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-b from-transparent to-ink" />
    </div>
  )
})
