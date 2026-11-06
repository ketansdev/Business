import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { FLAVOURS } from '../data/flavours'
import { formatPrice } from '../data/collection'

gsap.registerPlugin(ScrollTrigger)

const SETTLED = { x: 0, y: 0, scale: 1, rotation: 0, rotationX: 0, rotationY: 0, autoAlpha: 1 }
const BOKEH = [
  { x: -36, y: -28, z: -260, s: 46 },
  { x: 38, y: -34, z: -180, s: 30 },
  { x: 42, y: 26, z: 120, s: 18 },
  { x: -40, y: 30, z: 60, s: 24 },
  { x: 8, y: -44, z: -340, s: 60 },
]

/**
 * 06 — FIND YOUR MELT. One stage, four flavour states.
 *
 * Everything is rendered once and stacked; switching flavour is a GSAP
 * timeline (exit → atmosphere → entrance → settle), so nothing re-mounts and
 * React state only drives the selector UI.
 *
 * Transform ownership:
 *   .fym-rig          → pointer tilt (quickTo)
 *   .fym-comp__depth  → entrance / exit timeline
 *   .fym-comp__float  → idle float (one tween per flavour, only the active one plays)
 */
export default function FindYourMelt({ reducedMotion, onExplore }) {
  const root = useRef(null)
  const [active, setActive] = useState(0)
  const activeRef = useRef(0)
  const tlRef = useRef(null)
  const floats = useRef([])
  const inView = useRef(false)
  const revealed = useRef(false)
  const tabRefs = useRef([])

  const $ = (s) => root.current.querySelector(s)
  const $$ = (s) => [...root.current.querySelectorAll(s)]

  const playFloat = useCallback((i) => {
    floats.current.forEach((f, k) => (k === i && inView.current && !reducedMotion ? f.play() : f.pause()))
  }, [reducedMotion])

  // ------------------------------------------------------------ setup + scroll entrance
  useLayoutEffect(() => {
    const section = root.current
    const mm = gsap.matchMedia()
    const ctx = gsap.context(() => {
      const comps = $$('.fym-comp__depth')
      const panels = $$('.fym-panel')
      const moods = $$('.fym-mood')

      // initial state: only flavour 01 exists, still hidden until the section arrives
      comps.forEach((el) => gsap.set(el, { autoAlpha: 0 }))
      panels.forEach((el, i) => gsap.set(el, { autoAlpha: i === 0 ? 1 : 0 }))
      moods.forEach((el, i) => gsap.set(el, { autoAlpha: i === 0 ? 1 : 0 }))
      gsap.set(section, { '--fym-accent': FLAVOURS[0].accent })

      floats.current = $$('.fym-comp__float').map((el, i) =>
        gsap.to(el, { y: i % 2 ? 12 : -12, rotation: i % 2 ? -1.2 : 1.2, duration: 3.4 + i * 0.3, ease: 'sine.inOut', yoyo: true, repeat: -1, paused: true }),
      )

      const intro = gsap.timeline({ paused: true, defaults: { ease: 'power3.out' } })
      const first = FLAVOURS[0].entrance
      if (reducedMotion) {
        intro.fromTo(['.fym-atmo', '.fym-head > *', '.fym-nav', comps[0], '.fym-panel[data-i="0"]'], { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.6, stagger: 0.06 })
      } else {
        intro
          .fromTo('.fym-atmo', { autoAlpha: 0 }, { autoAlpha: 1, duration: 1.4, ease: 'sine.out' }, 0)
          .fromTo('.fym-head .w__i', { yPercent: 115 }, { yPercent: 0, duration: 1.1, stagger: 0.06 }, 0.15)
          .fromTo('.fym-head .fym-fade', { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.08 }, 0.35)
          .fromTo('.fym-nav li', { autoAlpha: 0, x: -30 }, { autoAlpha: 1, x: 0, duration: 0.9, stagger: 0.08 }, 0.55)
          .fromTo(comps[0], { ...first, autoAlpha: 0 }, { ...SETTLED, duration: 1.6, ease: 'power3.out' }, 0.7)
          .fromTo('.fym-panel[data-i="0"] [data-r]', { autoAlpha: 0, y: 22 }, { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.07 }, 1.0)
          .fromTo('.fym-panel[data-i="0"] .fym-prod', { autoAlpha: 0, y: 26 }, { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.1 }, 1.35)
      }
      intro.eventCallback('onComplete', () => playFloat(activeRef.current))

      // the alternate compositions are hidden until chosen, so the browser would defer them:
      // fetch all four (and their product thumbnails) as the section approaches
      ScrollTrigger.create({
        trigger: section,
        start: 'top 250%',
        once: true,
        onEnter: () => section.querySelectorAll('img[loading="lazy"]').forEach((im) => (im.loading = 'eager')),
      })
      ScrollTrigger.create({
        trigger: section,
        start: 'top 68%',
        once: true,
        onEnter: () => {
          revealed.current = true
          intro.play()
        },
      })
      // floats only run while the section is on screen
      ScrollTrigger.create({
        trigger: section,
        start: 'top bottom',
        end: 'bottom top',
        onToggle: (self) => {
          inView.current = self.isActive
          if (revealed.current && !tlRef.current?.isActive()) playFloat(activeRef.current)
          else if (!self.isActive) playFloat(-1)
        },
      })
      // subtle scroll drift for the heading (entrance + exit), desktop only
      if (!reducedMotion) {
        mm.add('(min-width: 768px)', () => {
          gsap.fromTo('.fym-head', { y: 40 }, { y: -40, ease: 'none', scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: true } })
        })
      }
    }, section)
    return () => {
      tlRef.current?.kill()
      mm.revert()
      ctx.revert()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reducedMotion, playFloat])

  // ------------------------------------------------------------ flavour transition
  const select = useCallback((to) => {
    const from = activeRef.current
    if (to === from) return
    activeRef.current = to
    setActive(to)
    const section = root.current
    const comps = $$('.fym-comp__depth')
    const panels = $$('.fym-panel')
    const moods = $$('.fym-mood')
    const f = FLAVOURS[to]

    // if the section hasn't revealed yet, just swap states silently
    tlRef.current?.kill()
    playFloat(-1)
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' }, onComplete: () => playFloat(to) })
    tlRef.current = tl
    const others = (arr) => arr.filter((_, i) => i !== to)

    if (reducedMotion || !revealed.current) {
      tl.to(others(comps), { autoAlpha: 0, duration: 0.3 }, 0)
        .to(others(panels), { autoAlpha: 0, duration: 0.3 }, 0)
        .to(others(moods), { autoAlpha: 0, duration: 0.6 }, 0)
        .to(moods[to], { autoAlpha: 1, duration: 0.6 }, 0)
        .to(section, { '--fym-accent': f.accent, duration: 0.6 }, 0)
        .set(panels[to].querySelectorAll('[data-r], .fym-prod'), { autoAlpha: 1, y: 0 }, 0)
        .to(comps[to], { ...SETTLED, duration: 0.5 }, 0.2)
        .to(panels[to], { autoAlpha: 1, duration: 0.4 }, 0.2)
      return
    }

    // PHASE 1 — exit (from wherever things are now, so rapid clicks never snap)
    const dir = to > from ? -1 : 1
    tl.to(others(comps), { autoAlpha: 0, scale: 0.9, x: dir * 70, y: -18, rotationY: dir * -10, duration: 0.5, ease: 'power2.in' }, 0)
      .to(others(panels).map((p) => p.querySelectorAll('[data-r], .fym-prod')), { autoAlpha: 0, y: -14, duration: 0.35, stagger: 0.02, ease: 'power2.in' }, 0)
      .set(others(panels), { autoAlpha: 0 }, 0.4)
    // PHASE 2 — atmosphere + indicator colour
      .to(others(moods), { autoAlpha: 0, duration: 1.1, ease: 'sine.inOut' }, 0.15)
      .to(moods[to], { autoAlpha: 1, duration: 1.1, ease: 'sine.inOut' }, 0.15)
      .to(section, { '--fym-accent': f.accent, duration: 0.9, ease: 'sine.inOut' }, 0.15)
    // PHASE 3 — entrance, art-directed per flavour
      .fromTo(comps[to], { ...f.entrance }, { x: 0, y: 0, scale: 1, rotation: 0, rotationX: 0, rotationY: 0, duration: f.entrance.duration, ease: f.entrance.ease }, 0.26)
      .fromTo(comps[to], { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.55, ease: 'power1.out' }, 0.26) // presence arrives early
      .set(panels[to], { autoAlpha: 1 }, 0.4)
      .fromTo(panels[to].querySelectorAll('[data-r]'), { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.07 }, 0.5)
      .fromTo(panels[to].querySelectorAll('.fym-prod'), { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.1 }, 0.85)
    // PHASE 4 — settle: onComplete starts the float
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reducedMotion, playFloat])

  // keep the selected flavour visible in the horizontal selector (phones); never scrolls the page
  useEffect(() => {
    const tab = tabRefs.current[active]
    const list = tab?.closest('ol')
    if (!list || list.scrollWidth <= list.clientWidth) return
    const left = tab.parentElement.offsetLeft - (list.clientWidth - tab.parentElement.offsetWidth) / 2
    list.scrollTo({ left: Math.max(0, left), behavior: reducedMotion ? 'auto' : 'smooth' })
  }, [active, reducedMotion])

  // ------------------------------------------------------------ pointer parallax (desktop)
  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine) and (min-width: 1024px)').matches
    if (!fine || reducedMotion) return
    const stage = $('.fym-stage')
    const rig = $('.fym-rig')
    const ry = gsap.quickTo(rig, 'rotationY', { duration: 1.2, ease: 'power3.out' })
    const rx = gsap.quickTo(rig, 'rotationX', { duration: 1.2, ease: 'power3.out' })
    const tx = gsap.quickTo(rig, 'x', { duration: 1.2, ease: 'power3.out' })
    const move = (e) => {
      const r = stage.getBoundingClientRect()
      const nx = (e.clientX - r.left) / r.width - 0.5
      const ny = (e.clientY - r.top) / r.height - 0.5
      ry(nx * 16)
      rx(-ny * 11)
      tx(nx * 18)
    }
    const leave = () => {
      ry(0)
      rx(0)
      tx(0)
    }
    stage.addEventListener('pointermove', move)
    stage.addEventListener('pointerleave', leave)
    return () => {
      stage.removeEventListener('pointermove', move)
      stage.removeEventListener('pointerleave', leave)
      gsap.killTweensOf(rig)
      gsap.set(rig, { clearProps: 'transform' })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reducedMotion])

  // ------------------------------------------------------------ keyboard (roving tabs)
  const onNavKey = (e) => {
    const step = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key]
    let i = null
    if (step) i = (activeRef.current + step + FLAVOURS.length) % FLAVOURS.length
    if (e.key === 'Home') i = 0
    if (e.key === 'End') i = FLAVOURS.length - 1
    if (i === null) return
    e.preventDefault()
    select(i)
    tabRefs.current[i]?.focus()
  }

  const explore = (target) => onExplore?.(target)

  const headline = 'What are you craving today?'.split(' ')
  return (
    <section className="fym" id="find-your-melt" ref={root} aria-labelledby="fym-title" data-flavour={FLAVOURS[active].id}>
      <div className="fym-atmo" aria-hidden="true">
        {FLAVOURS.map((f) => (
          <span key={f.id} className="fym-mood" style={{ '--g': f.mood.glow, '--h': f.mood.high, '--l': f.mood.low }} />
        ))}
      </div>

      <div className="fym-inner">
        <header className="fym-head">
          <p className="eyebrow fym-fade"><span className="eyebrow__no">(06)</span> Find your melt <i className="fym-sep">—</i> A flavour for every mood</p>
          <h2 className="fym-title" id="fym-title">
            {headline.map((w, i) => (
              <span key={i}>
                <span className="w"><span className={`w__i${i >= 3 ? ' fym-title__serif' : ''}`}>{w}</span></span>
                {i < headline.length - 1 ? ' ' : ''}
              </span>
            ))}
          </h2>
          <p className="fym-support fym-fade">Every craving has a personality. Discover the flavour that speaks to yours.</p>
        </header>

        <div className="fym-main">
          {/* ---------------------------------------------- flavour navigation */}
          <nav className="fym-nav" aria-label="Flavour personalities">
            <ol role="tablist" aria-orientation="vertical" onKeyDown={onNavKey}>
              {FLAVOURS.map((f, i) => (
                <li key={f.id}>
                  <button
                    ref={(el) => (tabRefs.current[i] = el)}
                    type="button"
                    role="tab"
                    id={`fym-tab-${f.id}`}
                    aria-selected={i === active}
                    aria-controls={`fym-panel-${f.id}`}
                    tabIndex={i === active ? 0 : -1}
                    className="fym-tab"
                    onClick={() => select(i)}
                  >
                    <span className="fym-tab__no">{f.no}</span>
                    <span className="fym-tab__name">{f.name}</span>
                  </button>
                </li>
              ))}
            </ol>
          </nav>

          {/* ---------------------------------------------- the 3D stage */}
          <div className="fym-stage">
            <div className="fym-rig">
              <span className="fym-halo" aria-hidden="true" />
              <span className="fym-floor" aria-hidden="true" />
              {BOKEH.map((b, i) => (
                <span key={i} className="fym-bokeh" aria-hidden="true"
                  style={{ '--bx': `${b.x}%`, '--by': `${b.y}%`, '--bz': `${b.z}px`, '--bs': `${b.s}px` }} />
              ))}
              {FLAVOURS.map((f, i) => (
                <div className="fym-comp" key={f.id} data-i={i}>
                  <div className="fym-comp__depth">
                    <div className="fym-comp__float">
                      <img
                        src={f.image.src}
                        srcSet={f.image.srcSet}
                        sizes="(max-width: 767px) 86vw, (max-width: 1100px) 52vw, 44vw"
                        width="1000"
                        height="1000"
                        alt={f.alt}
                        loading="lazy"
                        decoding="async"
                        draggable="false"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ---------------------------------------------- details + recommendations */}
          <div className="fym-panels">
            {FLAVOURS.map((f, i) => (
              <article
                key={f.id}
                className="fym-panel"
                data-i={i}
                id={`fym-panel-${f.id}`}
                role="tabpanel"
                aria-labelledby={`fym-tab-${f.id}`}
                inert={i !== active}
              >
                <p className="fym-panel__count" data-r><b>{f.no}</b> / 04</p>
                <h3 className="fym-panel__name" data-r>{f.name}</h3>
                <p className="fym-panel__line" data-r>{f.line}</p>
                <p className="fym-panel__desc" data-r>{f.desc}</p>
                <p className="fym-panel__label" data-r><span aria-hidden="true" /> Your perfect match</p>
                <ul className="fym-prods">
                  {f.products.filter(Boolean).map((p) => (
                    <li key={p.id} className="fym-prod">
                      <button type="button" onClick={() => explore({ category: p.category, product: p.id })} aria-label={`${p.name}, ${formatPrice(p.price)}, view in the collection`}>
                        <span className="fym-prod__img">
                          <img src={p.image.src} srcSet={p.image.srcSet} sizes="96px" width="400" height="400" alt="" loading="lazy" decoding="async" />
                        </span>
                        <span className="fym-prod__meta">
                          <span className="fym-prod__cat">{p.categoryLabel}</span>
                          <span className="fym-prod__name">{p.name}</span>
                        </span>
                        <span className="fym-prod__price">{formatPrice(p.price)}</span>
                      </button>
                    </li>
                  ))}
                </ul>
                <button type="button" className="fym-cta" data-r onClick={() => explore(f.explore)}>
                  <span>Explore this flavour</span>
                  <span className="fym-cta__ring" aria-hidden="true">
                    <svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                  </span>
                </button>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
