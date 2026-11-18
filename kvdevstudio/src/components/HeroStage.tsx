import { lazy, Suspense, useEffect, useMemo, useRef, useState, type RefObject } from 'react'
import CanvasErrorBoundary from './CanvasErrorBoundary'
import HeroFallback from './HeroFallback'
import type { StageRefs } from './Scene3D'
import { HERO_TAGS, SERVICES } from '../lib/site'
import { deviceTier, hasWebGL } from '../lib/env'
import { bindPointer } from '../lib/pointer'
import { goToService, heroState, holdService, releaseService, subscribeActive } from '../lib/heroState'
import { useInViewport } from '../hooks/useInViewport'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { usePrefersReducedMotion } from '../hooks/useReducedMotion'
import { cn } from '../lib/cn'

/** Compact node labels for narrow screens. */
const NODE_SHORT = ['Websites', 'Local SEO', 'Social', 'Branding']

// three.js + R3F ship in their own chunk, fetched after first paint.
const Scene3D = lazy(() => import('./Scene3D'))

type Props = { copyRef: RefObject<HTMLElement | null>; startDelay: number; pinned: boolean }

/**
 * The hero's 3D stage plus its DOM overlay (labels, lime nodes, threads and
 * interactive service nodes), all positioned every frame by the scene.
 * Pinned: fills the sticky viewport. Otherwise desktop = full-bleed behind the
 * copy, stacked layouts = its own block below the copy.
 */
export default function HeroStage({ copyRef, startDelay, pinned }: Props) {
  const stageRef = useRef<HTMLDivElement>(null)
  const tags = useRef<(HTMLElement | null)[]>([])
  const nodes = useRef<(HTMLElement | null)[]>([])
  const dots = useRef<(HTMLElement | null)[]>([])
  const threads = useRef<(SVGLineElement | null)[]>([])
  const avoidX = useRef(0)
  const refs: StageRefs = useMemo(() => ({ tags, nodes, dots, threads, avoidX }), [])
  const reduced = usePrefersReducedMotion()
  const desktop = useMediaQuery('(min-width: 1024px)')
  const inView = useInViewport(stageRef, '120px')
  const [webgl] = useState(() => hasWebGL())
  const [quality] = useState(() => deviceTier())
  const [failed, setFailed] = useState(false)
  const [ready, setReady] = useState(false)
  const [mount, setMount] = useState(false)
  const [active, setActive] = useState(-1)
  const lastPointer = useRef<string>('mouse')

  useEffect(() => bindPointer(), [])
  useEffect(() => subscribeActive(setActive), [])

  // Let the page-load intro finish before spending the main thread on 3D.
  useEffect(() => {
    const id = window.setTimeout(() => setMount(true), Math.max(0, startDelay * 1000 - 500))
    return () => window.clearTimeout(id)
  }, [startDelay])

  // Intro labels fade where they would cross the headline (desktop only).
  useEffect(() => {
    const measure = () => {
      const copy = copyRef.current
      const stage = stageRef.current
      if (!copy || !stage) return
      const heading = copy.querySelector('h1') ?? copy
      avoidX.current = heading.getBoundingClientRect().right - stage.getBoundingClientRect().left
    }
    measure()
    const ro = new ResizeObserver(measure)
    if (copyRef.current) ro.observe(copyRef.current)
    window.addEventListener('resize', measure)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [copyRef])

  const live = webgl && !failed

  const onNodeClick = (i: number) => {
    // Touch: first tap explores (shows the detail panel), second tap navigates.
    if (lastPointer.current === 'touch' && heroState.active !== i) {
      holdService(i)
      return
    }
    goToService(i, reduced)
  }

  return (
    <div
      ref={stageRef}
      className={cn('w-full', pinned ? 'absolute inset-0' : 'relative h-[min(118vw,580px)] lg:absolute lg:inset-0 lg:h-auto')}
      data-stage={live ? 'webgl' : 'fallback'}
    >
      {live ? (
        <div className={cn('absolute inset-0 transition-opacity duration-[1600ms] ease-out-quint', ready ? 'opacity-100' : 'opacity-0')}>
          {mount && (
            <CanvasErrorBoundary onError={() => setFailed(true)}>
              <Suspense fallback={null}>
                <Scene3D quality={quality} reduced={reduced} running={inView} refs={refs} onReady={() => setReady(true)} />
              </Suspense>
            </CanvasErrorBoundary>
          )}

          {/* Intro labels riding the rib tips */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
            {HERO_TAGS.map((tag, i) => (
              <div
                key={tag}
                ref={(el) => {
                  tags.current[i] = el
                }}
                className="hero-tag absolute top-0 left-0 opacity-0 will-change-transform"
              >
                <span className="hero-tag__line" />
                <span className="absolute top-0 left-0 size-[7px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-lime shadow-[0_0_0_4px_rgba(198,255,77,0.14)]" />
                <span className="hero-tag__pill rounded-full border border-white/[0.13] bg-[rgba(14,16,20,0.82)] px-3 py-[7px] font-mono text-[10px] leading-none tracking-[0.22em] text-fg uppercase shadow-[0_10px_30px_-12px_rgba(0,0,0,0.8)] sm:text-[10.5px]">
                  {tag}
                </span>
              </div>
            ))}
          </div>

          {pinned && (
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              {/* Lime threads from each rib tip to its service */}
              <svg className="absolute inset-0 h-full w-full" aria-hidden>
                {SERVICES.map((s, i) => (
                  <line
                    key={s.index}
                    ref={(el) => {
                      threads.current[i] = el
                    }}
                    stroke="#c6ff4d"
                    strokeWidth={1}
                    strokeLinecap="round"
                    opacity={0}
                  />
                ))}
              </svg>
              {/* Glowing lime nodes on the rib tips */}
              {SERVICES.map((s, i) => (
                <span
                  key={s.index}
                  aria-hidden
                  ref={(el) => {
                    dots.current[i] = el
                  }}
                  className="hero-node-dot absolute top-0 left-0 -mt-1 -ml-1 size-2 rounded-full bg-lime opacity-0"
                />
              ))}
              {/* Interactive service nodes */}
              {SERVICES.map((s, i) => (
                <div
                  key={s.index}
                  ref={(el) => {
                    nodes.current[i] = el
                  }}
                  data-live="false"
                  className="svc-node invisible absolute top-0 left-0 opacity-0 will-change-transform"
                >
                  <button
                    type="button"
                    tabIndex={-1}
                    aria-label={`${s.title}: view service`}
                    className="svc-node__hit cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lime"
                    onPointerDown={(e) => {
                      lastPointer.current = e.pointerType
                    }}
                    onPointerEnter={(e) => {
                      if (e.pointerType === 'mouse') holdService(i)
                    }}
                    onPointerLeave={(e) => {
                      if (e.pointerType === 'mouse') releaseService()
                    }}
                    onFocus={(e) => {
                      // Keyboard focus explores; pointer focus is handled by hover/tap.
                      if (e.currentTarget.matches(':focus-visible')) holdService(i)
                    }}
                    onBlur={() => releaseService(150)}
                    onClick={() => onNodeClick(i)}
                  />
                  <span
                    aria-hidden
                    className={cn(
                      'svc-node__label pointer-events-none flex items-center gap-2 rounded-full border px-3 py-[7px] text-[11.5px] leading-none font-medium tracking-[-0.01em] shadow-[0_12px_30px_-14px_rgba(0,0,0,0.9)] sm:text-[12.5px]',
                      active === i ? 'border-lime/60 bg-[rgba(20,24,14,0.92)] text-fg' : 'border-white/[0.13] bg-[rgba(14,16,20,0.84)] text-fg/90',
                    )}
                  >
                    <span className="font-mono text-[10px] tracking-[0.12em] text-lime">{s.index}</span>
                    {desktop ? s.node : NODE_SHORT[i]}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <HeroFallback desktop={desktop} />
      )}
    </div>
  )
}
