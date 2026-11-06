import { useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { productImage } from '../lib/assets'
import { sequenceFor } from '../data/bestsellers'
import { formatPrice } from '../data/collection'

gsap.registerPlugin(ScrollTrigger)

const pad = (n) => String(n).padStart(2, '0')
const SIZES = '(max-width: 699px) 82vw, 66vh'

// master-timeline schedule (timeline seconds, mapped onto scroll by the pin)
const HOLD0 = 1.6 // product 01 on stage before the first handover
const GAP = 2.4 // distance between handovers
const XFADE = 1.4 // length of one handover
const handoverAt = (i) => HOLD0 + (i - 1) * GAP // i = 1..3
const END = handoverAt(3) + XFADE + 1.0 // final hold
const OUTRO = 0.8 // cupcake lifts before the pin releases

// per-position choreography (position = order in the sequence, not product)
const EXIT = [
  { xPercent: -36, yPercent: -64, scale: 0.5, rotation: -10, rotationY: 22 }, // up + sideways
  { xPercent: -62, yPercent: 52, scale: 0.55, rotation: -14, rotationY: -18 }, // diagonal
  { xPercent: 28, yPercent: -78, scale: 0.55, rotation: 10, rotationY: 16 }, // up + out
]
const ENTER = [
  null, // 01 arrives by flight from the Collections section
  { xPercent: 58, yPercent: 38, scale: 0.55, rotation: 10, rotationY: -40 }, // opposite side
  { xPercent: 0, yPercent: 88, scale: 0.7, rotation: 12, rotationY: 26 }, // from below
  { xPercent: 0, yPercent: 30, scale: 0.84, rotation: -4, rotationY: -18 }, // gentle float-in
]
const SETTLED = { xPercent: 0, yPercent: 0, scale: 1, rotation: 0, rotationY: 0 }

const soften = (o, k) => {
  // mobile: shorter, simpler moves (no 3D swing)
  const r = { ...o }
  for (const key of ['xPercent', 'yPercent', 'rotation']) if (key in r) r[key] *= k
  r.rotationY = 0
  return r
}

/**
 * 04 — THE OBSESSION. Pinned, scroll-scrubbed bestseller film.
 *
 * Transform ownership (one writer per node):
 *   .ob-tilt      → pointer tilt (ticker)          .ob-float → idle float (ticker)
 *   .ob-prod[i]   → master timeline (enter/exit)   .ob-fly   → section-to-section flight (ticker)
 */
export default function Obsession({ carriedCategory, reducedMotion }) {
  const seq = useMemo(() => sequenceFor(carriedCategory), [carriedCategory])
  const root = useRef(null)
  const q = useRef({}).current
  const ref = (k) => (el) => {
    q[k] = el
  }
  const flight = useRef({ st: null, cur: 0, applied: -1, card: null }).current
  const amp = useRef({ v: 0 }).current
  const carriedId = seq[0].id

  // ------------------------------------------------------------ master timeline
  useLayoutEffect(() => {
    const section = root.current
    const setH = () => section.style.setProperty('--ob-h', `${window.innerHeight}px`)
    setH()
    ScrollTrigger.addEventListener('refreshInit', setH)

    const mm = gsap.matchMedia(section)
    mm.add({ any: 'all', mobile: '(max-width: 699px)', reduce: '(prefers-reduced-motion: reduce)' }, (ctx) => {
      const { mobile, reduce } = ctx.conditions
      const prods = gsap.utils.toArray('.ob-prod', section)
      const infos = gsap.utils.toArray('.ob-info', section)
      const moods = gsap.utils.toArray('.ob-mood', section)
      const dashes = gsap.utils.toArray('.ob-hud__dash i', section)
      const k = mobile ? 0.6 : 1
      const exitOf = (i) => (mobile ? soften(EXIT[i], k) : EXIT[i])
      const enterOf = (i) => (mobile ? soften(ENTER[i], k) : ENTER[i])

      gsap.set(prods, { transformPerspective: 1100, transformOrigin: '50% 60%' })

      // ---- chrome fades in while the product is in flight (owns wrapper opacity only)
      const chrome = gsap.timeline()
      // (the scroll cue is owned by the master timeline alone, so a fast jump can't revive it)
      chrome.fromTo([q.atmo, q.ghost, q.hud], { autoAlpha: 0 }, { autoAlpha: 1, ease: 'power1.in', stagger: 0.05 })
      // reduced motion has no flight: product 01 simply fades up as the stage arrives
      if (reduce) chrome.fromTo(prods[0], { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5 }, 0.3)
      flight.st = ScrollTrigger.create({
        trigger: section,
        start: 'top bottom',
        end: 'top top',
        invalidateOnRefresh: true,
        animation: chrome,
        scrub: reduce ? true : 0.6,
      })

      // ---- the pinned film
      const switchAt = [1, 2, 3].map((i) => handoverAt(i) + XFADE * 0.5)
      const tl = gsap.timeline({
        defaults: { ease: 'power2.inOut' },
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${window.innerHeight * (mobile ? 3.2 : 4.4)}`,
          pin: q.stage,
          scrub: reduce ? true : mobile ? 0.6 : 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const t = self.progress * tl.duration()
            const n = switchAt.filter((s) => t >= s).length
            if (section.dataset.active !== String(n)) {
              section.dataset.active = String(n)
              q.hudNow.textContent = pad(n + 1)
            }
          },
        },
      })

      // initial states
      prods.forEach((el, i) => {
        if (i === 0) gsap.set(el, { ...SETTLED, autoAlpha: reduce ? 0 : 1 })
        else gsap.set(el, reduce ? { ...SETTLED, autoAlpha: 0 } : { ...enterOf(i), autoAlpha: 0 })
      })
      moods.forEach((el, i) => gsap.set(el, { autoAlpha: i === 0 ? 1 : 0 }))
      infos.forEach((el, i) => {
        gsap.set(el.querySelectorAll('[data-l]'), reduce ? { autoAlpha: 0 } : { yPercent: 110, autoAlpha: 1 })
        gsap.set(el, { autoAlpha: 1 })
        if (i > 0) gsap.set(el, { pointerEvents: 'none' })
      })
      gsap.set(dashes, { scaleX: 0 })

      const lineIn = (info, at) =>
        tl.to(info.querySelectorAll('[data-l]'), reduce
          ? { autoAlpha: 1, duration: 0.5, stagger: 0.05, ease: 'none' }
          : { yPercent: 0, duration: 0.75, stagger: 0.07, ease: 'power3.out' }, at)
      const lineOut = (info, at) =>
        tl.to(info.querySelectorAll('[data-l]'), reduce
          ? { autoAlpha: 0, duration: 0.4, ease: 'none' }
          : { yPercent: -110, duration: 0.55, stagger: 0.04, ease: 'power2.in' }, at)

      // 01 settles: float wakes up, copy reveals
      tl.to(amp, { v: reduce ? 0 : 1, duration: 0.6, ease: 'sine.out' }, 0)
      lineIn(infos[0], 0.1)
      tl.fromTo(q.cue, { autoAlpha: 0, y: 0 }, { autoAlpha: 1, duration: 0.3, ease: 'none' }, 0)
        .to(q.cue, { autoAlpha: 0, y: 12, duration: 0.5 }, handoverAt(1) - 0.7)

      // handovers 01→02, 02→03, 03→04
      for (let i = 1; i < prods.length; i++) {
        const at = handoverAt(i)
        const out = prods[i - 1]
        const inn = prods[i]
        if (reduce) {
          tl.to(out, { autoAlpha: 0, duration: XFADE * 0.5 }, at)
            .to(inn, { autoAlpha: 1, duration: XFADE * 0.5 }, at + XFADE * 0.4)
        } else {
          // the outgoing product gets a head start so the two pass rather than pile up
          tl.to(out, { ...exitOf(i - 1), duration: XFADE * 0.85, ease: 'power2.in' }, at)
            .to(out, { autoAlpha: 0, duration: XFADE * 0.32, ease: 'power1.in' }, at + XFADE * 0.42)
            .to(inn, {
              ...SETTLED,
              duration: i === 3 ? XFADE * 1.05 : XFADE * 0.85,
              ease: i === 3 ? 'sine.out' : 'power3.out',
            }, at + XFADE * 0.45)
            .to(inn, { autoAlpha: 1, duration: XFADE * 0.35, ease: 'power1.out' }, at + XFADE * 0.45)
        }
        lineOut(infos[i - 1], at)
        tl.set(infos[i - 1], { pointerEvents: 'none' }, at)
          .set(infos[i], { pointerEvents: 'auto' }, at + XFADE * 0.5)
        lineIn(infos[i], at + XFADE * 0.5)
        // lighting crossfades with the product
        tl.to(moods[i - 1], { autoAlpha: 0, duration: XFADE, ease: 'sine.inOut' }, at)
          .to(moods[i], { autoAlpha: 1, duration: XFADE, ease: 'sine.inOut' }, at)
          .to(dashes[i - 1], { scaleX: 1, duration: XFADE, ease: 'none' }, at)
      }

      // the outline word drifts across the whole film
      tl.fromTo(q.ghostWord, { xPercent: mobile ? 4 : 7 }, { xPercent: mobile ? -4 : -9, ease: 'none', duration: END + OUTRO }, 0)
      // final hold, then the cupcake lifts gently before the pin lets go
      tl.to({}, { duration: 0.01 }, END)
      if (!reduce) {
        tl.to(prods[3], { yPercent: -8, scale: 0.95, duration: OUTRO, ease: 'sine.in' }, END)
          .to(amp, { v: 0.4, duration: OUTRO }, END)
      } else {
        tl.to({}, { duration: OUTRO }, END)
      }

      return () => {
        flight.st = null
        amp.v = 0
      }
    })

    return () => {
      ScrollTrigger.removeEventListener('refreshInit', setH)
      mm.revert()
    }
  }, [amp, flight, q])

  // ------------------------------------------- flight + float + pointer (one ticker)
  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches && !reducedMotion
    const ptr = { tx: 0, ty: 0, x: 0, y: 0 }
    const lightX = fine ? gsap.quickTo(q.light, 'x', { duration: 0.8, ease: 'power3.out' }) : null
    const lightY = fine ? gsap.quickTo(q.light, 'y', { duration: 0.8, ease: 'power3.out' }) : null
    const onMove = (e) => {
      ptr.tx = (e.clientX / window.innerWidth) * 2 - 1
      ptr.ty = (e.clientY / window.innerHeight) * 2 - 1
      const r = q.stage.getBoundingClientRect()
      lightX(e.clientX - r.left)
      lightY(e.clientY - r.top)
    }
    if (fine) window.addEventListener('pointermove', onMove, { passive: true })

    const cardImg = () =>
      document.querySelector(`.pcard-slot[data-product="${carriedId}"] .pcard__media img`)
    const showCard = (el, show) => {
      if (el) el.style.visibility = show ? '' : 'hidden'
    }
    // a previous carried card (tab changed) must be visible again
    if (flight.card && flight.card !== cardImg()) showCard(flight.card, true)
    flight.applied = -1

    const applyFlight = (p) => {
      const fly = q.fly0
      const card = cardImg()
      if (flight.card && flight.card !== card) showCard(flight.card, true)
      flight.card = card
      if (p <= 0.001) {
        fly.style.visibility = 'hidden'
        fly.style.transform = ''
        showCard(card, true)
        return
      }
      fly.style.visibility = ''
      showCard(card, false)
      if (p >= 0.999) {
        fly.style.transform = ''
        return
      }
      const a = q.anchor.getBoundingClientRect()
      const c = card?.getBoundingClientRect()
      const ok = c && c.width > 0
      const dx = ok ? c.left + c.width / 2 - (a.left + a.width / 2) : 0
      const dy = ok ? c.top + c.height / 2 - (a.top + a.height / 2) : window.innerHeight * 0.6
      const s0 = ok ? c.width / a.width : 0.5
      const e = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2 // ease in-out
      const s = s0 + (1 - s0) * e
      const arc = Math.sin(p * Math.PI)
      fly.style.transform =
        `translate3d(${(dx * (1 - e)).toFixed(2)}px, ${(dy * (1 - e)).toFixed(2)}px, 0) ` +
        `scale(${s.toFixed(4)}) rotateY(${(-16 * arc).toFixed(2)}deg) rotateZ(${(-5 * arc).toFixed(2)}deg)`
    }

    const tick = (time, deltaMs) => {
      // frame-rate independent smoothing factor (≈0.2 per frame at 60 fps)
      const k = 1 - Math.exp(-Math.min(deltaMs, 100) / 75)
      // 1. flight (smoothed scroll progress; snaps exactly at both ends)
      if (!reducedMotion) {
        const target = flight.st ? flight.st.progress : 0
        flight.cur += (target - flight.cur) * k
        if (Math.abs(target - flight.cur) < 0.002) flight.cur = target
        if (flight.cur !== flight.applied) {
          applyFlight(flight.cur)
          flight.applied = flight.cur
        }
      }
      // 2. idle float + pointer tilt, scaled by how "settled" the stage is
      ptr.x += (ptr.tx - ptr.x) * k * 0.3
      ptr.y += (ptr.ty - ptr.y) * k * 0.3
      const a = amp.v
      if (a < 0.002) {
        if (q.float.style.transform) {
          q.float.style.transform = ''
          q.tilt.style.transform = ''
        }
        return
      }
      q.float.style.transform =
        `translate3d(0, ${(Math.sin(time * 0.9) * 12 * a).toFixed(2)}px, 0) rotateZ(${(Math.sin(time * 0.55) * 1.4 * a).toFixed(3)}deg)`
      const pa = fine ? a : 0
      q.tilt.style.transform =
        `translate3d(${(ptr.x * 14 * pa).toFixed(2)}px, ${(ptr.y * 8 * pa).toFixed(2)}px, 0) ` +
        `rotateY(${(ptr.x * 11 * pa).toFixed(3)}deg) rotateX(${(-ptr.y * 7 * pa).toFixed(3)}deg)`
    }
    gsap.ticker.add(tick)
    return () => {
      gsap.ticker.remove(tick)
      window.removeEventListener('pointermove', onMove)
      showCard(flight.card, true)
      if (q.fly0) {
        q.fly0.style.transform = ''
        q.fly0.style.visibility = ''
      }
    }
  }, [reducedMotion, carriedId, amp, flight, q])

  return (
    <section className="obsession" id="obsession" ref={root} aria-labelledby="obsession-title" data-active="0">
      <div className="ob-stage" ref={ref('stage')}>
        {/* lighting: one layer per featured product, crossfaded by the film */}
        <div className="ob-atmo" ref={ref('atmo')} aria-hidden="true">
          {seq.map((b, i) => (
            <span
              key={i}
              className="ob-mood"
              style={{ '--m-base': b.mood.base, '--m-high': b.mood.high, '--m-beam': b.mood.beam }}
            />
          ))}
          <span className="ob-light" ref={ref('light')} />
          <span className="ob-bokeh ob-bokeh--1" />
          <span className="ob-bokeh ob-bokeh--2" />
          <span className="ob-bokeh ob-bokeh--3" />
        </div>

        <div className="ob-ghost" ref={ref('ghost')} aria-hidden="true">
          <span className="ob-ghost__word" ref={ref('ghostWord')}>Obsession</span>
        </div>

        <h2 className="sr-only" id="obsession-title">The Obsession — signature bestsellers</h2>

        {/* the product stage: anchor is never transformed, so flight maths can measure it */}
        <div className="ob-anchor" ref={ref('anchor')}>
          <div className="ob-tilt" ref={ref('tilt')}>
            <div className="ob-float" ref={ref('float')}>
              <span className="ob-floor" aria-hidden="true" />
              {seq.map((b, i) => {
                const img = productImage(b.category, b.id)
                return (
                  <div className="ob-prod" key={i} data-i={i}>
                    <div className="ob-fly" ref={i === 0 ? ref('fly0') : undefined}>
                      <img
                        src={img.src}
                        srcSet={img.srcSet}
                        sizes={SIZES}
                        width="800"
                        height="800"
                        alt={b.name}
                        loading={i === 0 ? 'eager' : 'lazy'}
                        decoding="async"
                        draggable="false"
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* product information, one block per product, stacked */}
        <div className="ob-infos">
          {seq.map((b, i) => (
            <article className="ob-info" key={i}>
              <p className="ob-info__eyebrow">
                <span className="mask"><span data-l>Signature collection <i>—</i> <em>{b.categoryLabel}</em></span></span>
              </p>
              <p className="ob-info__count">
                <span className="mask"><span data-l><b>{pad(i + 1)}</b> / {pad(seq.length)}</span></span>
              </p>
              <h3 className="ob-info__name">
                <span className="mask"><span data-l>{b.name}</span></span>
              </h3>
              <p className="ob-info__desc">
                <span className="mask"><span data-l>{b.desc}</span></span>
              </p>
              <div className="ob-info__foot">
                <span className="mask"><span data-l className="ob-info__sep" aria-hidden="true"><i /></span></span>
                <span className="mask"><span data-l className="ob-info__price">{formatPrice(b.price)}</span></span>
              </div>
            </article>
          ))}
        </div>

        <div className="ob-hud" ref={ref('hud')} aria-hidden="true">
          <span className="ob-hud__label">Bestseller <b ref={ref('hudNow')}>01</b> / {pad(seq.length)}</span>
          <span className="ob-hud__steps">
            {seq.map((b, i) => (
              <span key={i} className="ob-hud__step" data-step={i}>
                <span className="ob-hud__no">{pad(i + 1)}</span>
                {i < seq.length - 1 && <span className="ob-hud__dash"><i /></span>}
              </span>
            ))}
          </span>
        </div>

        <div className="ob-cue" ref={ref('cue')} aria-hidden="true">
          <span>Scroll to discover</span>
          <svg viewBox="0 0 24 24"><path d="M12 5v14M6 13l6 6 6-6" /></svg>
        </div>
      </div>
    </section>
  )
}
