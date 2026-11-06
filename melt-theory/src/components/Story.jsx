import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { BEGINNING, CRAFT, INGREDIENTS, OBSESSION, REVEAL, SCENES, STORY_VIDEO, STORY_VIDEO_POSTER } from '../data/story'

gsap.registerPlugin(ScrollTrigger)

// Pinned cinematic mode vs. the readable flow mode (phones + reduced motion).
// Keep in sync with the `.story` media queries in styles.css.
const PINNED_MQ = '(min-width: 768px) and (prefers-reduced-motion: no-preference)'
const FLOW_MQ = '(max-width: 767px), (prefers-reduced-motion: reduce)'

// ---- master timeline schedule (timeline seconds; the pin maps them onto scroll)
const T = {
  pour: 0.3, // scene 01: chocolate pours in
  s1Copy: 1.5,
  to2: 3.0, // 01 → 02
  ingIn: 3.4,
  s2Copy: 4.7,
  to3: 7.0, // 02 → 03
  s3Copy: 7.9,
  chapter: (k) => 8.6 + k * 1.5, // craft frames 1..3
  to4: 14.5, // 03 → 04: the craft film drains away (done by 15.8)
  videoIn: 15.9, // chocolate-pour video enters only once the drain has fully settled
  videoSolo: 2.6, // …then owns the screen alone (≈0.65 viewport of scroll at this pacing)
  reveal: 19.2, // = videoIn + 0.7 fade + videoSolo: the final image pours over the video
  lines: 21.2,
  brand: 22.0,
  tagline: 22.7,
  end: 24.2,
}
const SCENE_AT = [3.6, 7.6, 15.6] // scene index switches (for HUD, floats)
const VIDEO_WINDOW = [15.6, 21.0] // the video only plays while it can actually be seen
// Pin length keeps the original pacing of ~0.258 viewport per timeline second
const PIN_VH = (tablet) => (tablet ? 4.4 : 5) * (T.end / 19.4)
const CHAPTER_AT = [1, 2, 3].map((k) => T.chapter(k) + 0.5)

/** Words wrapped in masks, for staggered line/word reveals. */
function Words({ text }) {
  const words = text.split(' ')
  // the space sits between the masks: trailing spaces collapse inside inline-blocks
  return words.map((w, i) => (
    <span key={i}>
      <span className="w"><span className="w__i">{w}</span></span>
      {i < words.length - 1 ? ' ' : ''}
    </span>
  ))
}

/**
 * 05 — THE STORY BEHIND THE MELT. Four scenes, one pinned stage, one master timeline.
 *
 * Transform ownership (one writer per node):
 *   .st-cam / .s2-cam → master timeline (camera push / orbit)
 *   .st-ptr / .s2-ptr → pointer parallax (quickTo)
 *   .ing__depth       → master timeline (enter / settle / fly-through)
 *   .ing__float       → idle float tween, playing only while scene 02 is on screen
 *   .liquid           → `--m` mask position (liquid curtain)
 */
export default function Story() {
  const root = useRef(null)

  useLayoutEffect(() => {
    const section = root.current
    const $ = (s) => section.querySelector(s)
    const $$ = (s) => [...section.querySelectorAll(s)]
    const setH = () => section.style.setProperty('--st-h', `${window.innerHeight}px`)
    setH()
    ScrollTrigger.addEventListener('refreshInit', setH)

    // lazy images: start fetching once the section is a couple of screens away
    const warm = ScrollTrigger.create({
      trigger: section,
      start: 'top 250%',
      once: true,
      onEnter: () => $$('img[loading="lazy"]').forEach((im) => (im.loading = 'eager')),
    })

    const mm = gsap.matchMedia(section)

    // =================================================================== PINNED
    mm.add({ pinned: PINNED_MQ, tablet: '(max-width: 1100px)', fine: '(hover: hover) and (pointer: fine)' }, (ctx) => {
      const { pinned, tablet, fine } = ctx.conditions
      if (!pinned) return
      const k = tablet ? 0.7 : 1 // tablet: less layered movement
      const scenes = $$('.st-scene')
      const ings = $$('.ing')
      const frames = $$('.s3-frame')
      const video = $('.s4-video')
      const words = (sel) => $$(`${sel} .w__i`)

      // Initial states are the `from` side of fromTo() tweens below (immediateRender),
      // so ScrollTrigger refreshes (invalidateOnRefresh) can never lose them.
      gsap.set(scenes.slice(1), { autoAlpha: 0 })

      const vw = () => window.innerWidth
      const vh = () => window.innerHeight

      let sync = null // assigned below; ScrollTrigger may update before then
      const tl = gsap.timeline({
        defaults: { ease: 'power2.inOut' },
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${vh() * PIN_VH(tablet)}`,
          pin: $('.st-stage'),
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => sync?.(self.progress * tl.duration()),
          onToggle: (self) => !self.isActive && video.pause?.(),
        },
      })
      // load the pour video before its scene (it is hidden in flow mode, so phones never fetch it)
      ScrollTrigger.create({
        trigger: section,
        start: 'top 200%',
        once: true,
        onEnter: () => {
          if (video.preload !== 'auto') {
            video.preload = 'auto'
            video.load()
          }
        },
      })

      const show = (el, at) => tl.fromTo(el, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.01, ease: 'none' }, at)
      const hide = (el, at) => tl.fromTo(el, { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.01, ease: 'none', immediateRender: false }, at)
      const rise = (els, at, o = {}) =>
        tl.fromTo(els, { yPercent: 115 }, { yPercent: 0, duration: 1, stagger: 0.07, ease: 'power3.out', ...o }, at)
      const fadeUp = (els, at, o = {}) =>
        tl.fromTo(els, { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.8, ease: 'power3.out', ...o }, at)

      // ---------- SCENE 01 — THE BEGINNING
      tl.fromTo($('.s1-cam'), { scale: 1.24, xPercent: 3 }, { scale: 1.04, xPercent: -3, duration: T.to2 + 0.6, ease: 'none' }, 0)
        .fromTo($('.s1-media'), { '--m': 1.3 }, { '--m': 0.5, duration: 1.5 }, T.pour)
        .fromTo($('.s1-title'), { autoAlpha: 1, y: 0, filter: 'blur(0px)' }, { autoAlpha: 0, y: -40, filter: 'blur(6px)', duration: 0.9, ease: 'power2.in' }, 0.9)
      rise(words('.s1-copy h3'), T.s1Copy)
      tl.fromTo(words('.s1-copy h3'), { filter: 'blur(8px)' }, { filter: 'blur(0px)', duration: 0.8, stagger: 0.07, ease: 'none' }, T.s1Copy)
      fadeUp($('.s1-copy .st-p'), T.s1Copy + 0.5)
      tl

      // ---------- 01 → 02 : camera pushes into the chocolate, which drains away
        .to(words('.s1-copy h3'), { yPercent: -115, duration: 0.6, stagger: 0.03, ease: 'power2.in' }, T.to2)
        .to($('.s1-copy .st-p'), { autoAlpha: 0, y: -12, duration: 0.5 }, T.to2)
        .to($('.s1-cam'), { scale: 1.4, duration: 1.3, ease: 'power2.in' }, T.to2)
        .to($('.s1-media'), { '--m': -0.05, duration: 1.2, ease: 'power2.in' }, T.to2 + 0.2)
      show(scenes[1], T.to2)
      hide(scenes[0], T.to2 + 1.45)
      tl

      // ---------- SCENE 02 — THE OBSESSION (3D ingredient composition)
        .fromTo($('.s2-glow'), { autoAlpha: 0, scale: 0.6 }, { autoAlpha: 1, scale: 1, duration: 1.6 }, T.ingIn - 0.2)
        .fromTo($('.s2-cam'), { z: -220 * k, rotationY: 14 * k, rotationX: 4 * k },
          { z: 110 * k, rotationY: -10 * k, rotationX: -2 * k, duration: T.to3 - T.to2 + 0.9, ease: 'none' }, T.to2)

      ings.forEach((el, i) => {
        const d = INGREDIENTS[i]
        tl.fromTo(el.querySelector('.ing__depth'), {
          x: () => d.from[0] * vw() * 0.62 * k,
          y: () => d.from[1] * vh() * 0.62 * k,
          z: d.z - 650,
          rotation: d.rot + d.from[0] * 50,
          rotationY: -d.from[0] * 40 * k,
          autoAlpha: 0,
        }, {
          x: 0, y: 0, z: d.z, rotation: d.rot, rotationY: 0, autoAlpha: 1, duration: 1.7, ease: 'power3.out',
        }, T.ingIn + i * 0.14)
      })

      rise(words('.s2-line1'), T.s2Copy, { stagger: 0.08 })
      rise(words('.s2-line2'), T.s2Copy + 0.35, { stagger: 0.05 })
      fadeUp($('.s2-copy .st-p'), T.s2Copy + 0.75)
      tl

      // ---------- 02 → 03 : ingredients rush past the camera, the craft film pours in
        .to(words('.s2-copy'), { yPercent: -115, duration: 0.6, stagger: 0.02, ease: 'power2.in' }, T.to3)
        .to($('.s2-copy .st-p'), { autoAlpha: 0, duration: 0.4 }, T.to3)
      ings.forEach((el, i) => {
        tl.to(el.querySelector('.ing__depth'), {
          z: INGREDIENTS[i].z + 1000, x: INGREDIENTS[i].x * 6 * k, autoAlpha: 0, duration: 1.1, ease: 'power2.in',
        }, T.to3 + 0.05 * i)
      })
      tl.to($('.s2-glow'), { autoAlpha: 0, duration: 0.8 }, T.to3 + 0.3)
      show(scenes[2], T.to3 + 0.2)
      hide(scenes[1], T.to3 + 1.4)

      // ---------- SCENE 03 — THE CRAFT
      const frameImg = (i) => frames[i].querySelector('.s3-frame__img')
      const caption = (i) => frames[i].querySelectorAll('figcaption > *')
      frames.forEach((f) => tl.fromTo(f, { '--m': 1.3 }, { '--m': 1.3, duration: 0.01 }, 0)) // all frames start hidden
      tl.fromTo($('.s3-panel'), { '--m': 0.5 }, { '--m': 0.5, duration: 0.01 }, 0)
      tl.to(frames[0], { '--m': 0.5, duration: 1.2 }, T.to3 + 0.3)
        .fromTo(frameImg(0), { scale: 1.12 }, { scale: 1, duration: 1.8, ease: 'power2.out' }, T.to3 + 0.3)
      fadeUp($('.s3-eyebrow'), T.s3Copy - 0.2, { duration: 0.6 })
      rise(words('.s3-line1'), T.s3Copy, { duration: 0.9 })
      rise(words('.s3-line2'), T.s3Copy + 0.3, { duration: 0.9, stagger: 0.05 })
      fadeUp($('.s3-copy .st-p'), T.s3Copy + 0.6, { duration: 0.7 })
      fadeUp($('.s3-index'), T.s3Copy + 0.8, { duration: 0.7 })
      frames.forEach((_, i) => tl.fromTo(caption(i), { autoAlpha: 0, y: 16 }, { autoAlpha: 0, y: 16, duration: 0.01 }, 0))
      tl.to(caption(0), { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.08, ease: 'power3.out' }, T.s3Copy + 0.5)

      for (let c = 1; c < frames.length; c++) {
        const at = T.chapter(c)
        tl.to(caption(c - 1), { autoAlpha: 0, y: -12, duration: 0.4, stagger: 0.04, ease: 'power2.in' }, at)
          .to(frameImg(c - 1), { scale: 0.96, xPercent: -2, duration: 1.2 }, at) // previous frame recedes
          .to(frames[c], { '--m': 0.5, duration: 1.0 }, at) // next one pours over it
          .fromTo(frameImg(c), { scale: 1.08, xPercent: 2 }, { scale: 1, xPercent: 0, duration: 1.5, ease: 'power2.out' }, at)
          .to(caption(c), { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.08, ease: 'power3.out' }, at + 0.6)
      }

      // ---------- 03 → 04 : the craft drains away into a dark chocolate pour
      tl.to([...words('.s3-copy h3')], { yPercent: -115, duration: 0.6, stagger: 0.02, ease: 'power2.in' }, T.to4)
        .to([$('.s3-copy .st-p'), $('.s3-index'), $('.s3-eyebrow'), ...caption(3)], { autoAlpha: 0, duration: 0.5 }, T.to4)
        .to($('.s3-panel'), { '--m': -0.05, duration: 1.2, ease: 'power2.in' }, T.to4 + 0.1)
      // the video's scene only appears once the craft panel has fully drained (15.8),
      // so nothing from scene 03 can blend with it
      show(scenes[3], T.videoIn - 0.05)
      hide(scenes[2], T.videoIn)
      // controlled entry: fades up and settles from a slight push, then holds alone
      tl.fromTo(video, { autoAlpha: 0, scale: 1.06 }, { autoAlpha: 1, scale: 1, duration: 1.2, ease: 'power2.out' }, T.videoIn)
        // the top shade belongs to the final frame, not the video
        .fromTo($('.s4-shade'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 1.2, ease: 'none' }, T.reveal)

      // ---------- SCENE 04 — THE REVEAL (pours over the video only after its solo moment)
        .fromTo($('.s4-media'), { '--m': 1.3 }, { '--m': 0.5, duration: 1.5 }, T.reveal)
        .fromTo($('.s4-cam'), { scale: 1.18 }, { scale: 1, duration: 2.8, ease: 'power2.out' }, T.reveal)
        .to(video, { autoAlpha: 0, duration: 0.5, ease: 'none' }, T.reveal + 1.3) // fully covered by then
      rise(words('.s4-line1'), T.lines, { duration: 0.9, stagger: 0.06 })
      rise(words('.s4-line2'), T.lines + 0.35, { duration: 0.9 })
      tl.fromTo($('.s4-brand'), { autoAlpha: 0, letterSpacing: '0.42em', filter: 'blur(10px)' },
        { autoAlpha: 1, letterSpacing: '0.02em', filter: 'blur(0px)', duration: 1.4, ease: 'power3.out' }, T.brand)
      fadeUp($('.s4-tagline'), T.tagline)
      tl
      $$('.acc').forEach((el, i) => {
        tl.fromTo(el, { autoAlpha: 0, y: 140, rotation: REVEAL.accents[i].rot - 24 },
          { autoAlpha: 1, y: 0, rotation: REVEAL.accents[i].rot, duration: 1.4, ease: 'power3.out' }, T.reveal + 0.8 + i * 0.15)
      })
      tl.to({}, { duration: 0.01 }, T.end)
        .fromTo($('.st-hud__bar i'), { scaleX: 0 }, { scaleX: 1, duration: T.end, ease: 'none' }, 0)

      // ---------- idle float (GSAP tweens; only the active scene's ones run)
      const floats = ings.map((el, i) =>
        gsap.to(el.querySelector('.ing__float'), {
          y: i % 2 ? 16 : -16, rotation: i % 2 ? -4 : 4, duration: 3.2 + i * 0.45,
          ease: 'sine.inOut', yoyo: true, repeat: -1, paused: true,
        }),
      )
      const accFloats = $$('.acc__float').map((el, i) =>
        gsap.to(el, { y: i ? 12 : -12, rotation: i ? 3 : -3, duration: 3.6 + i * 0.5, ease: 'sine.inOut', yoyo: true, repeat: -1, paused: true }),
      )

      // ---------- scene/chapter bookkeeping (DOM writes only on change)
      const hudNo = $('.st-hud__no')
      const hudLabel = $('.st-hud__label')
      let scene = -1
      let chapter = -1
      let videoOn = false
      let lastT = 0
      sync = (t) => {
        const s = SCENE_AT.filter((x) => t >= x).length
        if (s !== scene) {
          scene = s
          section.dataset.scene = String(s)
          hudNo.textContent = SCENES[s].no
          hudLabel.textContent = SCENES[s].label
          floats.forEach((f) => (s === 1 ? f.play() : f.pause()))
          accFloats.forEach((f) => (s === 3 ? f.play() : f.pause()))
        }
        // video: plays only inside its visible window; restarts when entered from above
        const inWin = t >= VIDEO_WINDOW[0] && t <= VIDEO_WINDOW[1]
        if (inWin !== videoOn) {
          videoOn = inWin
          if (inWin) {
            // entered from above → the pour starts from the top; from below → resume
            if (lastT < VIDEO_WINDOW[0] && video.readyState >= 1) video.currentTime = 0
            video.play?.()?.catch?.(() => {})
          } else video.pause?.()
        }
        lastT = t
        const c = CHAPTER_AT.filter((x) => t >= x).length
        if (c !== chapter) {
          chapter = c
          section.dataset.chapter = String(c)
        }
      }
      sync(tl.scrollTrigger.progress * tl.duration())

      // ---------- pointer parallax (desktop, fine pointers)
      let onMove = null
      if (fine) {
        const q = (sel, prop, d = 1.1) => gsap.quickTo($(sel), prop, { duration: d, ease: 'power3.out' })
        const p1 = [q('.s1-ptr', 'x'), q('.s1-ptr', 'y')]
        const p2 = [q('.s2-ptr', 'rotationY', 1.4), q('.s2-ptr', 'rotationX', 1.4)]
        const p3 = [q('.s3-ptr', 'x'), q('.s3-ptr', 'y')]
        const p4 = [q('.s4-ptr', 'x'), q('.s4-ptr', 'y')]
        onMove = (e) => {
          const nx = (e.clientX / window.innerWidth) * 2 - 1
          const ny = (e.clientY / window.innerHeight) * 2 - 1
          p1[0](nx * -14); p1[1](ny * -10)
          p2[0](nx * 7 * k); p2[1](-ny * 5 * k)
          p3[0](nx * -10); p3[1](ny * -8)
          p4[0](nx * -12); p4[1](ny * -8)
        }
        window.addEventListener('pointermove', onMove, { passive: true })
      }

      return () => {
        if (onMove) window.removeEventListener('pointermove', onMove)
        floats.concat(accFloats).forEach((f) => f.kill())
        video.pause?.()
        delete section.dataset.scene
        delete section.dataset.chapter
      }
    })

    // ==================================================================== FLOW
    mm.add({ flow: FLOW_MQ, reduce: '(prefers-reduced-motion: reduce)' }, (ctx) => {
      const { flow, reduce } = ctx.conditions
      if (!flow) return
      const once = (el, start = 'top 85%') => ({ trigger: el, start, once: true })
      $$('[data-flow]').forEach((el) => {
        gsap.fromTo(el, reduce ? { autoAlpha: 0 } : { autoAlpha: 0, y: 28 }, {
          autoAlpha: 1, y: 0, duration: reduce ? 0.6 : 0.9, ease: 'power3.out', scrollTrigger: once(el),
        })
      })
      if (!reduce) {
        // liquid pours on the photographs, light depth parallax on the ingredients
        $$('.s1-media, .s3-frame, .s4-media').forEach((el) => {
          gsap.fromTo(el, { '--m': 1.3 }, { '--m': 0.5, duration: 1.3, ease: 'power2.inOut', scrollTrigger: once(el, 'top 80%') })
        })
        $$('.ing[data-flow-ing]').forEach((el, i) => {
          gsap.fromTo(el.querySelector('.ing__depth'), { y: 40 + i * 20 }, {
            y: -40 - i * 20, ease: 'none', scrollTrigger: { trigger: $('.st-s2'), start: 'top bottom', end: 'bottom top', scrub: true },
          })
        })
      }
    })

    return () => {
      ScrollTrigger.removeEventListener('refreshInit', setH)
      warm.kill()
      mm.revert()
    }
  }, [])

  return (
    <section className="story" id="story" ref={root} aria-labelledby="story-title" data-scene="0" data-chapter="0">
      <div className="st-stage">
        {/* ============================================ SCENE 01 — THE BEGINNING */}
        <div className="st-scene st-s1">
          <div className="st-cam s1-cam">
            <div className="st-ptr s1-ptr">
              <div className="s1-media liquid">
                <img src={BEGINNING.image.src} srcSet={BEGINNING.image.srcSet} sizes="100vw" width="1672" height="941" alt="Glossy melted chocolate flowing in a dark studio" loading="lazy" decoding="async" />
              </div>
            </div>
          </div>
          <div className="s1-shade" aria-hidden="true" />
          <div className="s1-title">
            <p className="eyebrow"><span className="eyebrow__no">(05)</span> Chapter five</p>
            <h2 className="s1-title__h" id="story-title">The story behind the melt</h2>
          </div>
          <div className="st-copy s1-copy" data-flow>
            <h3 className="st-h st-h--xl"><span><Words text={BEGINNING.headline} /></span></h3>
            <p className="st-p">{BEGINNING.text}</p>
          </div>
        </div>

        {/* ============================================ SCENE 02 — THE OBSESSION */}
        <div className="st-scene st-s2">
          <div className="s2-glow" aria-hidden="true" />
          <div className="s2-space" aria-hidden="true">
            <div className="s2-cam">
              <div className="s2-ptr">
                {INGREDIENTS.map((d) => (
                  <div
                    key={d.id}
                    className={`ing ing--${d.layer} ing--${d.id}`}
                    data-flow-ing={d.flow || undefined}
                    style={{ '--x': d.x, '--y': d.y, '--size': d.size }}
                  >
                    <div className="ing__depth" style={{ transform: `translateZ(${d.z}px) rotate(${d.rot}deg)` }}>
                      <div className="ing__float">
                        <img src={d.image.src} srcSet={d.image.srcSet} sizes={`${d.size}vw`} width="900" height="900" alt="" loading="lazy" decoding="async" draggable="false" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="st-copy s2-copy" data-flow>
            <h3 className="st-h st-h--center">
              <span className="s2-line1"><Words text={OBSESSION.headline} /></span>
              <span className="s2-line2 st-serif"><Words text={OBSESSION.second} /></span>
            </h3>
            <p className="st-p">{OBSESSION.text}</p>
          </div>
        </div>

        {/* ============================================ SCENE 03 — THE CRAFT */}
        <div className="st-scene st-s3">
          <div className="s3-panel liquid">
            <div className="st-ptr s3-ptr">
              {CRAFT.chapters.map((c, i) => (
                <figure className="s3-frame liquid" key={c.no} data-i={i}>
                  <div className="s3-frame__img">
                    <img src={c.image.src} srcSet={c.image.srcSet} sizes="(max-width: 767px) 100vw, 66vw" width="1672" height="941" alt={c.note} loading="lazy" decoding="async" />
                  </div>
                  <figcaption>
                    <span className="s3-cap__no">{c.no}</span>
                    <span className="s3-cap__title">{c.title}</span>
                    <span className="s3-cap__note">{c.note}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
          <div className="st-copy s3-copy" data-flow>
            <p className="eyebrow s3-eyebrow"><span className="eyebrow__no">03</span> The craft</p>
            <h3 className="st-h st-h--lg">
              <span className="s3-line1"><Words text={CRAFT.headline} /></span>
              <span className="s3-line2 st-serif"><Words text={CRAFT.second} /></span>
            </h3>
            <p className="st-p">{CRAFT.text}</p>
            <ol className="s3-index" aria-label="Craft chapters">
              {CRAFT.chapters.map((c, i) => (
                <li key={c.no} data-i={i}><span>{c.no}</span>{c.title}</li>
              ))}
            </ol>
          </div>
        </div>

        {/* ============================================ SCENE 04 — THE REVEAL */}
        <div className="st-scene st-s4">
          <video className="s4-video" muted playsInline loop preload="none" poster={STORY_VIDEO_POSTER} disablePictureInPicture aria-hidden="true">
            {STORY_VIDEO.map((v) => <source key={v.src} src={v.src} type={v.type} />)}
          </video>
          <div className="st-cam s4-cam">
            <div className="st-ptr s4-ptr">
              <div className="s4-media liquid">
                <img src={REVEAL.image.src} srcSet={REVEAL.image.srcSet} sizes="100vw" width="1672" height="941" alt="The MELT THEORY collection: cupcakes, chocolate ice cream, waffles and berries" loading="lazy" decoding="async" />
              </div>
            </div>
          </div>
          <div className="s4-shade" aria-hidden="true" />
          {REVEAL.accents.map((a) => (
            <div key={a.id} className={`acc acc--${a.id}`} style={{ '--x': a.x, '--y': a.y, '--size': a.size }} aria-hidden="true">
              <div className="acc__float">
                <img src={a.image.src} srcSet={a.image.srcSet} sizes={`${a.size}vw`} width="900" height="900" alt="" loading="lazy" decoding="async" />
              </div>
            </div>
          ))}
          <div className="st-copy s4-copy" data-flow>
            <p className="s4-lines">
              <span className="s4-line1"><Words text={REVEAL.line1} /></span>
              <span className="s4-line2 st-serif"><Words text={REVEAL.line2} /></span>
            </p>
            <p className="s4-brand">{REVEAL.brand}</p>
            <p className="s4-tagline">{REVEAL.tagline}</p>
          </div>
        </div>

        {/* ============================================ HUD */}
        <div className="st-hud" aria-hidden="true">
          <span className="st-hud__title">The story behind the melt</span>
          <span className="st-hud__scene">
            <b className="st-hud__no">01</b> / 04 <i>—</i> <span className="st-hud__label">The beginning</span>
          </span>
          <span className="st-hud__bar"><i /></span>
        </div>
      </div>
    </section>
  )
}
