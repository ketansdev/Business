import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { REVIEWS, WALL_LAYOUT } from '../data/reviews'
import NoteForm from './NoteForm'

gsap.registerPlugin(ScrollTrigger)

// Pinned motion piece vs. the static, readable wall (reduced motion).
const MOTION_MQ = '(prefers-reduced-motion: no-preference)'

// ---- master timeline schedule (timeline seconds, mapped onto scroll by the pin)
const T = {
  open: 0,
  review: (i) => 1.3 + i * 2.3, // each review owns a 2.3s segment
  final: 1.3 + 4 * 2.3, // 10.5
  end: 13.4,
}
const ACTIVE_AT = [0, 1, 2, 3].map((i) => T.review(i) + 0.6) // HUD switches as a note lands
const FINAL_AT = T.final + 0.4

/** Geometry for the current viewport (px). Re-read on every ScrollTrigger refresh. */
function computeLayout() {
  const vw = window.innerWidth
  const vh = window.innerHeight
  const tall = vw < 768 || vw < vh * 0.95
  const W = tall ? WALL_LAYOUT.tall : WALL_LAYOUT.wide
  const maxW = vh * (tall ? 0.235 : 0.36)
  const note = (n) => ({ x: (n.x / 100) * vw, y: (n.y / 100) * vh, w: Math.min((n.w / 100) * vw, maxW), rot: n.rot })
  const notes = W.notes.map(note)
  const scrap = note({ ...W.scrap, w: W.scrap.w })
  const tallest = Math.max(...notes.map((n) => n.w * 1.04))
  const s = Math.min(W.focus.scale, (vh * 0.64) / tallest, (vw * (tall ? 0.86 : 0.5)) / Math.max(...notes.map((n) => n.w)))
  return { vw, vh, tall, notes, scrap, focus: { x: (W.focus.x / 100) * vw, y: (W.focus.y / 100) * vh, s } }
}

// ---------------------------------------------------------------- doodles (inline SVG)
const Doodle = ({ type }) => {
  if (type === 'heart')
    return (
      <svg className="wl-doodle wl-doodle--heart" viewBox="0 0 48 44" aria-hidden="true">
        <path pathLength="1" d="M24 40C14 33 4 25 4 15.5 4 9 9 4.5 14.8 4.5c4 0 7 2.4 9.2 6 2.2-3.6 5.2-6 9.2-6C39 4.5 44 9 44 15.5 44 25 34 33 24 40z" />
        <path pathLength="1" d="M27 41.5c-1.2-.6-2.2-1.2-3.2-1.8" />
      </svg>
    )
  if (type === 'star')
    return (
      <svg className="wl-doodle wl-doodle--star" viewBox="0 0 48 48" aria-hidden="true">
        <path pathLength="1" d="M24 4l5.4 13.2 14.2 1-10.9 9.1 3.5 13.8L24 33.6l-12.2 7.5 3.5-13.8L4.4 18.2l14.2-1z" />
      </svg>
    )
  if (type === 'sparkle')
    return (
      <svg className="wl-doodle wl-doodle--sparkle" viewBox="0 0 60 48" aria-hidden="true">
        <path pathLength="1" d="M20 36c-6-4.4-12-9.2-12-15.2C8 16.6 11 14 14.4 14c2.4 0 4.2 1.4 5.6 3.6 1.4-2.2 3.2-3.6 5.6-3.6 3.4 0 6.4 2.6 6.4 6.8C32 26.8 26 31.6 20 36z" />
        <path pathLength="1" d="M44 8v8M40 12h8M50 26l4-4M50 34h6" />
      </svg>
    )
  return null
}

const Underline = () => (
  <svg className="wl-underline" viewBox="0 0 220 16" preserveAspectRatio="none" aria-hidden="true">
    <path pathLength="1" d="M3 10c26-6 54-7 82-3s58 5 82-1c18-4 34-3 50 1" />
    <path pathLength="1" d="M30 14c40-4 90-5 160-1" />
  </svg>
)

const Attachment = ({ type }) => {
  if (type === 'tape') return <span className="wl-attach wl-tape" aria-hidden="true" />
  if (type === 'clip')
    return (
      <svg className="wl-attach wl-clip" viewBox="0 0 24 64" aria-hidden="true">
        <path d="M8 22V10a4 4 0 0 1 8 0v34a7 7 0 0 1-14 0V16" />
      </svg>
    )
  return (
    <span className="wl-attach wl-pin" aria-hidden="true">
      <i />
    </span>
  )
}

// ---------------------------------------------------------------- one sticky note
function StickyNote({ review, index }) {
  const words = review.reveal === 'words'
  return (
    <article className={`wl-note wl-note--${review.paper}`} data-i={index} aria-label={`Review ${review.no}`}>
      <div className="wl-note__focus">
        <div className="wl-note__wobble">
          <span className="wl-shadow" aria-hidden="true" />
          <div className="wl-note__body">
            <div className="wl-face wl-face--back" aria-hidden="true" />
            <div className="wl-face wl-face--front">
              <span className="wl-grain" aria-hidden="true" />
              <span className="wl-curl" aria-hidden="true" />
              <header className="wl-note__top">
                <span className="wl-hand wl-note__no">Nº {review.no}</span>
                <span className="wl-note__motion">{review.motion}</span>
              </header>
              <blockquote className={`wl-quote wl-quote--${review.reveal}`}>
                {review.lines.map((line, li) => (
                  <span className="wl-line" key={li}>
                    {words
                      ? line.split(' ').map((w, wi, arr) => (
                          <span key={wi}>
                            <span className="wl-w"><span>{w}</span></span>
                            {wi < arr.length - 1 ? ' ' : ''}
                          </span>
                        ))
                      : <span>{line}</span>}
                    {review.underline?.includes(li) && <Underline />}
                  </span>
                ))}
              </blockquote>
              <p className="wl-hand wl-by">— {review.by}</p>
              <Doodle type={review.doodle} />
              <span className="wl-sheen" aria-hidden="true" />
            </div>
            <span className="wl-shade" aria-hidden="true" />
          </div>
          <Attachment type={review.attach} />
        </div>
      </div>
    </article>
  )
}

/**
 * 07 — THE WALL OF LOVE. One pinned stage, one master timeline.
 *
 * Transform ownership (one writer per node):
 *   .wl-cam          → camera (push-in / pull-back / final pull-out)
 *   .wl-note         → resting position on the wall (CSS custom props from computeLayout)
 *   .wl-note__focus  → active / background emphasis (scale; shade opacity)
 *   .wl-note__wobble → idle paper wobble (only the active note, only while pinned)
 *   .wl-note__body   → entrance physics (fall / slide / flip / diagonal arrival)
 */
export default function WallOfLove() {
  const root = useRef(null)
  const ctaRef = useRef(null)
  const openerRef = useRef(null) // whoever opened the form gets focus back
  const [formOpen, setFormOpen] = useState(false)

  // the footer's "Leave your note" link opens this same form (no duplicate form)
  useEffect(() => {
    const open = (e) => {
      openerRef.current = e.detail?.opener ?? null
      setFormOpen(true)
    }
    window.addEventListener('melt:open-note', open)
    return () => window.removeEventListener('melt:open-note', open)
  }, [])

  const applyLayout = useCallback(() => {
    const L = computeLayout()
    const el = root.current
    el.style.setProperty('--wl-h', `${L.vh}px`)
    el.querySelectorAll('.wl-note').forEach((n, i) => {
      const p = L.notes[i]
      n.style.setProperty('--x', `${p.x}px`)
      n.style.setProperty('--y', `${p.y}px`)
      n.style.setProperty('--w', `${p.w}px`)
      n.style.setProperty('--rot', `${p.rot}deg`)
    })
    const s = el.querySelector('.wl-scrap')
    s.style.setProperty('--x', `${L.scrap.x}px`)
    s.style.setProperty('--y', `${L.scrap.y}px`)
    s.style.setProperty('--w', `${L.scrap.w}px`)
    s.style.setProperty('--rot', `${L.scrap.rot}deg`)
    el.dataset.layout = L.tall ? 'tall' : 'wide'
    return L
  }, [])

  useLayoutEffect(() => {
    const section = root.current
    let L = applyLayout()
    const onRefreshInit = () => (L = applyLayout())
    ScrollTrigger.addEventListener('refreshInit', onRefreshInit)

    const $ = (s) => section.querySelector(s)
    const $$ = (s) => [...section.querySelectorAll(s)]
    const mm = gsap.matchMedia(section)

    // ========================================================== MOTION (pinned film)
    mm.add({ motion: MOTION_MQ, small: '(max-width: 767px)', fine: '(hover: hover) and (pointer: fine)' }, (ctx) => {
      const { motion, small } = ctx.conditions
      if (!motion) return
      const k = small ? 0.6 : 1 // phones: smaller rotations / travel, no blur
      const blur = (px) => (small ? 'blur(0px)' : `blur(${px}px)`)
      const notes = $$('.wl-note')
      const part = (i, s) => notes[i].querySelector(s)
      const cam = $('.wl-cam')
      const spot = $('.wl-spot')
      gsap.set(cam, { transformOrigin: '0 0' })

      const focusOf = (i, scaleK = 1) => () => {
        const n = L.notes[i]
        const s = L.focus.s * scaleK
        return { x: L.focus.x - s * n.x, y: L.focus.y - s * n.y, scale: s }
      }
      const camTo = (i, scaleK) => ({
        x: () => focusOf(i, scaleK)().x,
        y: () => focusOf(i, scaleK)().y,
        scale: () => focusOf(i, scaleK)().scale,
      })
      const centred = (s) => ({ x: () => (L.vw / 2) * (1 - s), y: () => (L.vh / 2) * (1 - s), scale: s })

      let sync = null
      const tl = gsap.timeline({
        defaults: { ease: 'power2.inOut' },
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${window.innerHeight * (small ? 3.6 : 5)}`,
          pin: $('.wl-stage'),
          scrub: small ? 0.6 : 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => sync?.(self.progress * tl.duration()),
          onToggle: (self) => sync?.(self.isActive ? self.progress * tl.duration() : -1),
        },
      })

      // ------------------------------------------------------ OPENING
      tl.fromTo('.wl-wall', { autoAlpha: 0, scale: 1.06 }, { autoAlpha: 1, scale: 1, duration: 1.1, ease: 'sine.out' }, 0)
        .fromTo('.wl-vignette', { autoAlpha: 0 }, { autoAlpha: 1, duration: 1 }, 0)
        .fromTo(cam, { x: 0, y: 0, scale: 1 }, { ...centred(1.06), duration: 1.3, ease: 'sine.inOut' }, 0)
        .fromTo('.wl-head .w > span', { yPercent: 115 }, { yPercent: 0, duration: 0.9, stagger: 0.05, ease: 'power3.out' }, 0.15)
        .fromTo('.wl-head .eyebrow', { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power3.out' }, 0.1)
        .fromTo(spot, { autoAlpha: 0, x: () => L.vw / 2, y: () => L.vh / 2, scale: 0.6 }, { autoAlpha: 0.6, scale: 0.9, duration: 1.2 }, 0.2)
        .fromTo('.wl-hud', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.6 }, T.review(0))
        // the heading steps back so the first note owns the frame
        .to('.wl-head', { autoAlpha: 0, y: -50, scale: 0.94, duration: 0.7, ease: 'power2.in' }, T.review(0) - 0.1)

      // ------------------------------------------------------ helpers shared by all notes
      const settleShadow = (i, at) =>
        tl.to(part(i, '.wl-shadow'), { x: 6, y: 14, scale: 1, autoAlpha: 0.55, duration: 0.35, ease: 'power2.out' }, at)
      const background = (i, at) =>
        tl.to(part(i, '.wl-note__focus'), { scale: 0.94, duration: 0.8 }, at)
          .to(part(i, '.wl-shade'), { autoAlpha: 0.42, duration: 0.8 }, at)
      const spotTo = (i, at) =>
        tl.to(spot, { x: () => L.notes[i].x, y: () => L.notes[i].y, scale: 1, autoAlpha: 1, duration: 1.1 }, at)
      const sheen = (i, at) =>
        tl.fromTo(part(i, '.wl-sheen'), { xPercent: -130 }, { xPercent: 130, duration: 0.9, ease: 'power1.inOut' }, at)
      const draw = (els, at, d = 0.7) =>
        tl.fromTo(els, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: d, stagger: 0.15, ease: 'power1.inOut' }, at)
      const writeBy = (i, at) =>
        tl.fromTo(part(i, '.wl-by'), { clipPath: 'inset(0% 100% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.6, ease: 'none' }, at)

      // every note starts off the wall; the shadow starts far away and soft
      notes.forEach((n, i) => {
        tl.fromTo(part(i, '.wl-note__body'), { autoAlpha: 0 }, { autoAlpha: 0, duration: 0.01 }, 0)
        tl.fromTo(part(i, '.wl-shadow'), { x: 40, y: 70, scale: 1.25, autoAlpha: 0 }, { x: 40, y: 70, scale: 1.25, autoAlpha: 0, duration: 0.01 }, 0)
        tl.fromTo(part(i, '.wl-attach'), { autoAlpha: 0 }, { autoAlpha: 0, duration: 0.01 }, 0)
        tl.fromTo(part(i, '.wl-shade'), { autoAlpha: 0 }, { autoAlpha: 0, duration: 0.01 }, 0)
        tl.fromTo(part(i, '.wl-note__focus'), { scale: 1 }, { scale: 1, duration: 0.01 }, 0)
      })

      // ------------------------------------------------------ 01 — THE DROP
      {
        const i = 0
        const at = T.review(i)
        const body = part(i, '.wl-note__body')
        tl.fromTo(body, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.04, ease: 'none', immediateRender: false }, at + 0.05)
        tl.to(cam, { ...camTo(i), duration: 1.4 }, at)
        spotTo(i, at + 0.1)
        tl.fromTo(body,
          { y: () => -L.vh * 1.1, rotationX: 64 * k, rotationY: -18 * k, rotation: -28 * k, scale: 1.08, filter: blur(7) },
          { y: 14, rotationX: -6 * k, rotationY: 4 * k, rotation: 5 * k, scale: 1, filter: 'blur(0px)', duration: 0.7, ease: 'power2.in', immediateRender: false }, at + 0.05)
          .set(body, { filter: 'none' }, at + 0.76)
          // spring landing: overshoot → wobble → rest
          .to(body, { y: 0, rotationX: 0, rotationY: 0, rotation: 0, duration: 0.65, ease: 'elastic.out(1.1, 0.45)' }, at + 0.75)
          .fromTo(part(i, '.wl-shadow'), { x: 40, y: 70, scale: 1.25, autoAlpha: 0 }, { x: 18, y: 30, scale: 1.1, autoAlpha: 0.3, duration: 0.7, ease: 'power2.in', immediateRender: false }, at + 0.05)
        settleShadow(i, at + 0.75)
        tl.fromTo(part(i, '.wl-attach'), { autoAlpha: 0, scale: 0, y: -14 }, { autoAlpha: 1, scale: 1, y: 0, duration: 0.35, ease: 'back.out(3)', immediateRender: false }, at + 0.85)
          .fromTo(part(i, '.wl-line > span'), { yPercent: 110 }, { yPercent: 0, duration: 0.6, stagger: 0.12, ease: 'power3.out' }, at + 1.0)
        writeBy(i, at + 1.45)
        draw(part(i, '.wl-doodle').querySelectorAll('path'), at + 1.55)
        sheen(i, at + 1.1)
      }

      // ------------------------------------------------------ 02 — THE SLIDE
      {
        const i = 1
        const at = T.review(i)
        const body = part(i, '.wl-note__body')
        tl.fromTo(body, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.04, ease: 'none', immediateRender: false }, at + 0.15)
        background(0, at)
        tl.to(cam, { ...camTo(i, 0.8), duration: 0.7, ease: 'power2.in' }, at) // pull back…
          .to(cam, { ...camTo(i), duration: 0.8, ease: 'power2.out' }, at + 0.7) // …push in
        spotTo(i, at + 0.2)
        tl.fromTo(body,
          { x: () => L.vw * 0.95, rotationY: -55 * k, rotation: 22 * k, filter: blur(6) },
          { x: -22, rotationY: 6 * k, rotation: -3 * k, filter: 'blur(0px)', duration: 0.75, ease: 'power3.in', immediateRender: false }, at + 0.15)
          .set(body, { filter: 'none' }, at + 0.91)
          .to(body, { x: 0, rotationY: 0, rotation: 0, duration: 0.6, ease: 'elastic.out(1, 0.5)' }, at + 0.9)
          .fromTo(part(i, '.wl-shadow'), { x: 90, y: 40, scale: 1.2, autoAlpha: 0 }, { x: 20, y: 24, scale: 1.08, autoAlpha: 0.3, duration: 0.75, immediateRender: false }, at + 0.15)
        settleShadow(i, at + 0.9)
        // masking tape smooths on from the left
        tl.fromTo(part(i, '.wl-attach'), { autoAlpha: 0, scaleX: 0 }, { autoAlpha: 1, scaleX: 1, duration: 0.4, ease: 'power2.out', immediateRender: false }, at + 0.95)
          .fromTo(part(i, '.wl-w > span'), { yPercent: 110 }, { yPercent: 0, duration: 0.45, stagger: 0.06, ease: 'power3.out' }, at + 1.05)
        writeBy(i, at + 1.5)
        draw(part(i, '.wl-underline').querySelectorAll('path'), at + 1.45, 0.6)
        sheen(i, at + 1.15)
      }

      // ------------------------------------------------------ 03 — THE FLIP
      {
        const i = 2
        const at = T.review(i)
        const body = part(i, '.wl-note__body')
        tl.fromTo(body, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.04, ease: 'none', immediateRender: false }, at + 0.15)
        background(1, at)
        tl.to(cam, { ...camTo(i, 0.8), duration: 0.7, ease: 'power2.in' }, at)
          .to(cam, { ...camTo(i), duration: 0.8, ease: 'power2.out' }, at + 0.7)
        spotTo(i, at + 0.2)
        // lifted off the wall, back side showing, then flips face-forward and presses on
        tl.fromTo(body,
          { y: () => -L.vh * 0.32, x: -40 * k, z: 0, rotationY: 180, rotationX: 14 * k, rotation: -12 * k, scale: 1.18 },
          { y: -10, x: 0, rotationY: 0, rotationX: 0, rotation: 2 * k, scale: 1.04, duration: 1.0, ease: 'power2.inOut', immediateRender: false }, at + 0.15)
          .to(body, { y: 0, rotation: 0, scale: 1, duration: 0.5, ease: 'back.out(2.2)' }, at + 1.15)
          .fromTo(part(i, '.wl-shadow'), { x: 50, y: 90, scale: 1.4, autoAlpha: 0 }, { x: 24, y: 34, scale: 1.12, autoAlpha: 0.28, duration: 1.0, immediateRender: false }, at + 0.15)
        settleShadow(i, at + 1.15)
        tl.fromTo(part(i, '.wl-attach'), { autoAlpha: 0, y: -22, rotation: -20 }, { autoAlpha: 1, y: 0, rotation: 0, duration: 0.4, ease: 'back.out(2.5)', immediateRender: false }, at + 1.2)
          .fromTo(part(i, '.wl-line > span'), { yPercent: 110 }, { yPercent: 0, duration: 0.5, stagger: 0.1, ease: 'power3.out' }, at + 1.2)
        writeBy(i, at + 1.5)
        draw(part(i, '.wl-doodle').querySelectorAll('path'), at + 1.55)
        sheen(i, at + 1.35)
      }

      // ------------------------------------------------------ 04 — THE FINAL ARRIVAL
      {
        const i = 3
        const at = T.review(i)
        const body = part(i, '.wl-note__body')
        tl.fromTo(body, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.04, ease: 'none', immediateRender: false }, at + 0.15)
        background(2, at)
        tl.to(cam, { ...camTo(i, 0.8), duration: 0.7, ease: 'power2.in' }, at)
          .to(cam, { ...camTo(i), duration: 0.8, ease: 'power2.out' }, at + 0.7)
        spotTo(i, at + 0.2)
        // diagonal sweep in from the lower left with a corkscrew twist
        tl.fromTo(body,
          { x: () => -L.vw * 0.75, y: () => L.vh * 0.8, rotation: -38 * k, rotationX: 28 * k, rotationY: 20 * k, filter: blur(6) },
          { x: 12, y: -10, rotation: 4 * k, rotationX: -4 * k, rotationY: -3 * k, filter: 'blur(0px)', duration: 0.8, ease: 'power3.out', immediateRender: false }, at + 0.15)
          .set(body, { filter: 'none' }, at + 0.96)
          .to(body, { x: 0, y: 0, rotation: 0, rotationX: 0, rotationY: 0, duration: 0.6, ease: 'elastic.out(1, 0.55)' }, at + 0.95)
          .fromTo(part(i, '.wl-shadow'), { x: -40, y: 80, scale: 1.3, autoAlpha: 0 }, { x: 14, y: 26, scale: 1.08, autoAlpha: 0.3, duration: 0.8, immediateRender: false }, at + 0.15)
        settleShadow(i, at + 0.95)
        tl.fromTo(part(i, '.wl-attach'), { autoAlpha: 0, scale: 0, y: -14 }, { autoAlpha: 1, scale: 1, y: 0, duration: 0.35, ease: 'back.out(3)', immediateRender: false }, at + 1.05)
          // mask reveal: the whole quote wipes on top-down
          .fromTo(part(i, '.wl-quote'), { clipPath: 'inset(0% 0% 100% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.7, ease: 'power2.inOut' }, at + 1.1)
          .fromTo(part(i, '.wl-line > span'), { yPercent: 30 }, { yPercent: 0, duration: 0.7, ease: 'power2.out' }, at + 1.1)
        writeBy(i, at + 1.6)
        draw(part(i, '.wl-doodle').querySelectorAll('path'), at + 1.65)
        sheen(i, at + 1.2)
      }

      // ------------------------------------------------------ FINAL — camera pull-back
      {
        const at = T.final
        tl.to(cam, { x: 0, y: 0, scale: 1, duration: 1.4, ease: 'power2.inOut' }, at)
          .to(notes.map((n) => n.querySelector('.wl-note__focus')), { scale: 1, duration: 1.0 }, at + 0.2)
          .to(notes.map((n) => n.querySelector('.wl-shade')), { autoAlpha: 0, duration: 1.0 }, at + 0.2)
          .to(spot, { x: () => L.notes.reduce((a, n) => a + n.x, 0) / 4, y: () => L.vh / 2, scale: 1.9, autoAlpha: 0.75, duration: 1.4 }, at)
          .fromTo('.wl-scrap', { autoAlpha: 0, scale: 0.4, rotation: -30 }, { autoAlpha: 1, scale: 1, rotation: 0, duration: 0.7, ease: 'back.out(2)' }, at + 0.9)
        draw($$('.wl-scrap path, .wl-loose path'), at + 1.2, 0.8)
        tl.fromTo('.wl-final .w > span', { yPercent: 115 }, { yPercent: 0, duration: 0.8, stagger: 0.04, ease: 'power3.out' }, at + 1.2)
          .fromTo('.wl-final [data-fade]', { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.1, ease: 'power3.out' }, at + 1.6)
          .to('.wl-hud', { autoAlpha: 0, duration: 0.5 }, at + 0.2)
          .to({}, { duration: 0.01 }, T.end)
      }

      // ------------------------------------------------------ idle paper wobble (active note only)
      const wobbles = notes.map((n, i) =>
        gsap.to(n.querySelector('.wl-note__wobble'), {
          rotation: i % 2 ? -0.6 : 0.6, y: -2, duration: 2.6 + i * 0.3, ease: 'sine.inOut', yoyo: true, repeat: -1, paused: true,
        }),
      )

      // ------------------------------------------------------ HUD + bookkeeping (writes only on change)
      const hudNo = $('.wl-hud__no')
      const hudName = $('.wl-hud__name')
      let state = -2
      sync = (t) => {
        const s = t < 0 ? -1 : t >= FINAL_AT ? 4 : ACTIVE_AT.filter((x) => t >= x).length - 1
        if (s === state) return
        state = s
        section.dataset.active = String(s)
        if (s >= 0 && s < 4) {
          hudNo.textContent = REVIEWS[s].no
          hudName.textContent = REVIEWS[s].motion
        }
        wobbles.forEach((w, i) => (i === s ? w.play() : w.pause()))
      }

      return () => {
        wobbles.forEach((w) => w.kill())
        delete section.dataset.active
      }
    })

    // ========================================================== REDUCED MOTION: static wall
    mm.add('(prefers-reduced-motion: reduce)', () => {
      // everything is already in its final, readable state via CSS; only gentle fades
      gsap.fromTo($$('.wl-note, .wl-final, .wl-head'), { autoAlpha: 0 }, {
        autoAlpha: 1, duration: 0.6, stagger: 0.08, scrollTrigger: { trigger: section, start: 'top 75%', once: true },
      })
    })

    return () => {
      ScrollTrigger.removeEventListener('refreshInit', onRefreshInit)
      mm.revert()
    }
  }, [applyLayout])

  const heading = 'Words that melt our hearts.'.split(' ')
  const finalHeading = 'Your words make every scoop sweeter.'.split(' ')
  return (
    <section className="wall" id="wall-of-love" ref={root} aria-labelledby="wl-title" data-active="-1">
      <div className="wl-stage">
        {/* camera: everything that lives on the wall */}
        <div className="wl-cam">
          <div className="wl-wall" aria-hidden="true" />
          <span className="wl-spot" aria-hidden="true" />
          <div className="wl-board">
            {/* a little lavender scrap + loose doodles join the wall at the end */}
            <div className="wl-scrap" aria-hidden="true">
              <span className="wl-shadow" />
              <div className="wl-scrap__paper">
                <span className="wl-grain" />
                <span className="wl-hand">more love<br />soon</span>
                <svg viewBox="0 0 48 44"><path pathLength="1" d="M24 40C14 33 4 25 4 15.5 4 9 9 4.5 14.8 4.5c4 0 7 2.4 9.2 6 2.2-3.6 5.2-6 9.2-6C39 4.5 44 9 44 15.5 44 25 34 33 24 40z" /></svg>
              </div>
              <span className="wl-attach wl-pin wl-pin--brass"><i /></span>
            </div>
            <svg className="wl-loose wl-loose--1" viewBox="0 0 48 44" aria-hidden="true"><path pathLength="1" d="M24 40C14 33 4 25 4 15.5 4 9 9 4.5 14.8 4.5c4 0 7 2.4 9.2 6 2.2-3.6 5.2-6 9.2-6C39 4.5 44 9 44 15.5 44 25 34 33 24 40z" /></svg>
            <svg className="wl-loose wl-loose--2" viewBox="0 0 48 48" aria-hidden="true"><path pathLength="1" d="M24 4l5.4 13.2 14.2 1-10.9 9.1 3.5 13.8L24 33.6l-12.2 7.5 3.5-13.8L4.4 18.2l14.2-1z" /></svg>
            {REVIEWS.map((r, i) => <StickyNote key={r.id} review={r} index={i} />)}
          </div>
        </div>
        <div className="wl-vignette" aria-hidden="true" />

        {/* opening title */}
        <header className="wl-head">
          <p className="eyebrow"><span className="eyebrow__no">(07)</span> A little love from our sweet community</p>
          <h2 className="wl-title" id="wl-title">
            {heading.map((w, i) => (
              <span key={i}>
                <span className="w"><span className={`w__i${i >= 3 ? ' wl-title__serif' : ''}`}>{w}</span></span>
                {i < heading.length - 1 ? ' ' : ''}
              </span>
            ))}
          </h2>
        </header>

        {/* progress (which review has the spotlight) */}
        <div className="wl-hud" aria-hidden="true">
          <span className="wl-hud__label">The wall of love</span>
          <span className="wl-hud__review">Review <b className="wl-hud__no">01</b> / 04 <i>—</i> <span className="wl-hud__name">The drop</span></span>
          <span className="wl-hud__dots">{REVIEWS.map((r, i) => <i key={r.id} data-i={i} />)}</span>
        </div>

        {/* final message */}
        <div className="wl-final">
          <div className="wl-final__top">
          <h3 className="wl-final__title">
            {finalHeading.map((w, i) => (
              <span key={i}>
                <span className="w"><span className={`w__i${i >= 4 ? ' wl-title__serif' : ''}`}>{w}</span></span>
                {i < finalHeading.length - 1 ? ' ' : ''}
              </span>
            ))}
          </h3>
          <p className="wl-final__text" data-fade>Every little note makes our world a little sweeter.</p>
          </div>
          <div className="wl-final__bottom">
          <div className="wl-final__cta" data-fade>
            <span className="wl-final__ask">Have a sweet story to share?</span>
            <button type="button" ref={ctaRef} className="wl-cta" onClick={() => { openerRef.current = ctaRef.current; setFormOpen(true) }} aria-haspopup="dialog">
              <span>Leave your note</span>
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20l4-1 11-11-3-3L5 16l-1 4zM14 6l3 3" /></svg>
            </button>
          </div>
          <p className="wl-final__note" data-fade>Illustrative sample reviews for a fictional brand.</p>
          </div>
        </div>
      </div>

      <NoteForm open={formOpen} onClose={() => setFormOpen(false)} returnFocusRef={openerRef} />
    </section>
  )
}
