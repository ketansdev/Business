import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import { ASSETS } from '../lib/assets'
import { computeLayout } from '../lib/layout'
import { INGREDIENTS } from '../data/ingredients'

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)
ScrollTrigger.config({ ignoreMobileResize: true })

const WIDE_MQ = '(min-width: 1024px) and (min-aspect-ratio: 115/100)'
const STEP_START = 0.35 // timeline time at which the first layer starts separating
const STEP_LEN = 1 // timeline time per layer
const LABEL_AT = 0.55 // when, inside a step, its label arrives

/**
 * Hero + About live inside one `.world`. A sticky, full-viewport `.rig-holder`
 * floats above both sections and carries the product, so the very same DOM
 * node travels from the hero into the anatomy diagram — no swaps, no jumps.
 *
 * Transform ownership (one writer per node, so tweens never fight):
 *   .rig            → scroll timelines (pose hero → about)
 *   .rig__parallax  → pointer parallax (ticker)
 *   .rig__float     → idle float (ticker)
 *   .rig__reveal    → intro reveal timeline
 *   img / .layer    → anatomy timeline
 */
export default function Experience({ introDone, introRef, onIntroHidden, reducedMotion, bgRef }) {
  const q = useRef({}).current // element refs bag
  const ref = (k) => (el) => {
    q[k] = el
  }
  const layoutRef = useRef(null)
  const amp = useRef({ reveal: 0, scroll: 1 }).current // motion amplitudes
  const pointer = useRef({ tx: 0, ty: 0, x: 0, y: 0 }).current
  const [layersReady, setLayersReady] = useState(false)
  const loadLayers = useCallback(() => setLayersReady(true), [])

  // ------------------------------------------------------------------ layout
  const applyLayout = useCallback(() => {
    const L = computeLayout()
    layoutRef.current = L
    const w = q.world.style
    w.setProperty('--app-h', `${L.vh}px`)
    w.setProperty('--rig-w', `${L.rigW}px`)
    w.setProperty('--rig-h', `${L.rigH}px`)
    w.setProperty('--hero-y', `${L.heroY}px`)
    w.setProperty('--label-x', `${L.stackX + L.layerHalfW}px`)
    w.setProperty('--line-len', `${L.lineLen}px`)
    w.setProperty('--label-w', `${L.labelW}px`)
    INGREDIENTS.forEach((ing, i) => {
      q[`label${i}`]?.style.setProperty('--y', `${L.stackY + L.slotOffset(ing.slot)}px`)
    })
    return L
  }, [q])

  // ------------------------------------------------------- scroll choreography
  useLayoutEffect(() => {
    applyLayout()
    const L = () => layoutRef.current
    const onRefreshInit = () => applyLayout()
    ScrollTrigger.addEventListener('refreshInit', onRefreshInit)

    const mm = gsap.matchMedia(q.world)
    // matchMedia only fires when ≥1 condition matches, so include an always-true one
    mm.add({ any: 'all', wide: WIDE_MQ, reduce: '(prefers-reduced-motion: reduce)' }, (ctx) => {
      const { wide, reduce } = ctx.conditions
      const layers = INGREDIENTS.map((_, i) => q[`layer${i}`])
      const labels = INGREDIENTS.map((_, i) => q[`label${i}`])
      const labelParts = (el) => ({
        line: el.querySelector('.label__line'),
        dot: el.querySelector('.label__dot'),
        body: el.querySelector('.label__body'),
      })

      // centre the rig on its own box; everything else is x/y offsets
      gsap.set(q.rig, { xPercent: -50, yPercent: -50, force3D: true })

      // ---------- 1. HERO → ABOUT : product travels, tumbles, settles
      const tA = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: q.hero,
          start: 'top top',
          end: 'bottom top',
          scrub: reduce ? true : 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => self.progress > 0.02 && loadLayers(),
        },
      })
      if (reduce) {
        tA.fromTo(q.rig, { x: 0, y: () => L().heroY, scale: 1, autoAlpha: 1 }, { autoAlpha: 0, duration: 0.4 }, 0)
          .set(q.rig, { x: () => L().aboutX, y: () => L().aboutY, scale: () => L().aboutScale }, 0.45)
          .to(q.rig, { autoAlpha: 1, duration: 0.4 }, 0.55)
      } else {
        tA.fromTo(
          q.rig,
          { x: 0, y: () => L().heroY, scale: 1, rotationX: 0, rotationY: 0, rotationZ: 0 },
          {
            // dips downward while turning away in 3D…
            y: () => L().heroY + L().vh * 0.17,
            scale: 0.84,
            rotationY: -34,
            rotationX: 16,
            rotationZ: -8,
            ease: 'sine.in',
            duration: 0.5,
          },
          0,
        ).to(
          q.rig,
          {
            // …then swings back around and lands in the anatomy diagram
            x: () => L().aboutX,
            y: () => L().aboutY,
            scale: () => L().aboutScale,
            rotationY: 0,
            rotationX: 0,
            rotationZ: 0,
            ease: 'power2.out',
            duration: 0.5,
          },
          0.5,
        )
      }
      tA.to(amp, { scroll: 0, duration: 0.45 }, 0)
        .to(q.heroUi, { y: () => -L().vh * 0.06, autoAlpha: 0, duration: 0.3 }, 0)
        .to(q.titleScroll, { y: () => L().vh * 0.3, autoAlpha: 0, scale: 0.94, duration: 0.6 }, 0)
        .to(q.shadowWrap, { autoAlpha: 0, duration: 0.3 }, 0)
      if (!reduce) {
        tA.to(q.splashLeftScroll, { x: () => -L().vw * 0.2, y: () => -L().vh * 0.08, rotation: -24, autoAlpha: 0, duration: 0.55 }, 0)
          .to(q.splashRightScroll, { x: () => L().vw * 0.2, y: () => L().vh * 0.04, rotation: 22, autoAlpha: 0, duration: 0.55 }, 0)
          .to(q.glowWrap, { scale: 0.85, duration: 0.5 }, 0.5)
      } else {
        tA.to([q.splashLeftScroll, q.splashRightScroll], { autoAlpha: 0, duration: 0.3 }, 0)
      }

      // ---------- 2. About headline rises in as the section arrives
      const introBits = q.aboutIntro.querySelectorAll('[data-rise]')
      gsap.fromTo(
        introBits,
        reduce ? { autoAlpha: 0 } : { yPercent: 105, autoAlpha: 0 },
        {
          yPercent: 0,
          autoAlpha: 1,
          stagger: 0.12,
          ease: 'none',
          scrollTrigger: { trigger: q.about, start: 'top 72%', end: 'top 12%', scrub: reduce ? true : 1 },
        },
      )

      // ---------- 3. ANATOMY : pinned, one layer at a time
      const labelTimes = INGREDIENTS.map((_, i) => STEP_START + i * STEP_LEN + LABEL_AT)
      const tB = gsap.timeline({
        defaults: { ease: 'power2.inOut' },
        scrollTrigger: {
          trigger: q.about,
          start: 'top top',
          end: () => `+=${L().vh * 3.6}`,
          pin: q.aboutPin,
          scrub: reduce ? true : 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const t = self.progress * tB.duration()
            const n = labelTimes.filter((lt) => t >= lt).length
            if (q.counter.textContent !== `0${n}`) q.counter.textContent = `0${n}`
            q.aboutPin.dataset.active = String(n)
          },
        },
      })

      // initial states for this media context
      gsap.set(q.heroImg, { autoAlpha: 1, scale: 1 })
      layers.forEach((el, i) => {
        const ing = INGREDIENTS[i]
        gsap.set(el, {
          autoAlpha: 0,
          y: reduce ? () => L().slotOffsetLocal(ing.slot) : 0,
          scale: () => (reduce || i > 0 ? L().layerScale : 1),
        })
      })
      labels.forEach((el) => {
        const p = labelParts(el)
        gsap.set(p.line, { scaleX: reduce ? 1 : 0 })
        gsap.set(p.dot, { scale: reduce ? 1 : 0 })
        gsap.set(p.body, { autoAlpha: 0, x: reduce ? 0 : -12 })
        gsap.set(el, { autoAlpha: reduce ? 0 : 1 })
      })

      tB.to({}, { duration: STEP_START }, 0) // breathing room before the first split
      if (!wide) tB.to(q.aboutDesc, { autoAlpha: 0, y: -10, duration: 0.4 }, STEP_START)

      INGREDIENTS.forEach((ing, i) => {
        const at = STEP_START + i * STEP_LEN
        const el = layers[i]
        const p = labelParts(labels[i])
        if (reduce) {
          if (i === 0) tB.to(q.heroImg, { autoAlpha: 0, duration: 0.3 }, at)
          tB.to(el, { autoAlpha: 1, duration: 0.4 }, at)
          tB.to(labels[i], { autoAlpha: 1, duration: 0.3 }, at + LABEL_AT)
          tB.to(p.body, { autoAlpha: 1, duration: 0.3 }, at + LABEL_AT)
          return
        }
        if (i === 0) {
          // the assembled scoop dissolves into its cream body as it shrinks
          tB.to(q.heroImg, { scale: () => L().layerScale, duration: STEP_LEN }, at)
            .to(q.heroImg, { autoAlpha: 0, duration: STEP_LEN * 0.55, ease: 'power1.in' }, at + 0.2)
            .to(el, { scale: () => L().layerScale, duration: STEP_LEN }, at)
            .to(el, { autoAlpha: 1, duration: STEP_LEN * 0.45, ease: 'power1.out' }, at + 0.1)
        } else {
          // every other layer slides out from behind the core, straight up/down
          tB.to(el, { y: () => L().slotOffsetLocal(ing.slot), duration: STEP_LEN }, at)
            .to(el, { autoAlpha: 1, duration: STEP_LEN * 0.3, ease: 'power1.out' }, at)
        }
        tB.fromTo(el.querySelector('.layer__glow'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4 }, at + 0.3)
          .to(el.querySelector('.layer__glow'), { autoAlpha: 0.45, duration: 0.4 }, at + STEP_LEN)
          .to(q.glowWrap, { scaleY: 1 + i * 0.32, scaleX: 0.85 + i * 0.05, duration: STEP_LEN }, at)
          // label: line draws, node pops, copy slides in
          .to(p.dot, { scale: 1, duration: 0.25, ease: 'back.out(3)' }, at + LABEL_AT - 0.15)
          .to(p.line, { scaleX: 1, duration: 0.35, ease: 'power2.out' }, at + LABEL_AT - 0.1)
          .to(p.body, { autoAlpha: 1, x: 0, duration: 0.35, ease: 'power2.out' }, at + LABEL_AT + 0.1)
      })
      tB.fromTo(q.progressFill, { scaleY: 0 }, { scaleY: 1, ease: 'none', duration: tB.duration() }, 0)
      tB.to({}, { duration: 0.6 }) // hold the finished diagram

      return () => {
        amp.scroll = 1
      }
    })

    return () => {
      ScrollTrigger.removeEventListener('refreshInit', onRefreshInit)
      mm.revert()
    }
  }, [applyLayout, amp, q, loadLayers])

  // Once the lazily-loaded layer images arrive, positions may need a refresh
  useEffect(() => {
    if (layersReady) ScrollTrigger.refresh()
  }, [layersReady])

  // ------------------------------------------- idle float + pointer parallax
  useEffect(() => {
    if (reducedMotion) return
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const onMove = (e) => {
      pointer.tx = (e.clientX / window.innerWidth) * 2 - 1
      pointer.ty = (e.clientY / window.innerHeight) * 2 - 1
    }
    if (fine) window.addEventListener('pointermove', onMove, { passive: true })

    const tick = (time) => {
      pointer.x += (pointer.tx - pointer.x) * 0.055
      pointer.y += (pointer.ty - pointer.y) * 0.055
      const a = amp.reveal * amp.scroll
      if (a < 0.002) {
        q.float.style.transform = ''
        q.parallax.style.transform = ''
        return
      }
      const { x, y } = pointer
      q.float.style.transform =
        `translate3d(0, ${(Math.sin(time * 0.95) * 11 * a).toFixed(2)}px, 0) ` +
        `rotateZ(${(Math.sin(time * 0.6) * 1.3 * a).toFixed(3)}deg) ` +
        `rotateY(${(Math.sin(time * 0.43) * 6 * a).toFixed(3)}deg)`
      q.parallax.style.transform =
        `translate3d(${(x * 16 * a).toFixed(2)}px, ${(y * 10 * a).toFixed(2)}px, 0) ` +
        `rotateY(${(x * 8 * a).toFixed(3)}deg) rotateX(${(-y * 6 * a).toFixed(3)}deg)`
      // background depth planes drift the opposite way
      q.titleDepth.style.transform = `translate3d(${(-x * 12 * a).toFixed(2)}px, ${(-y * 6 * a).toFixed(2)}px, 0)`
      q.splashLeftDepth.style.transform = `translate3d(${(-x * 28 * a).toFixed(2)}px, ${(-y * 16 * a).toFixed(2)}px, 0)`
      q.splashRightDepth.style.transform = `translate3d(${(-x * 22 * a).toFixed(2)}px, ${(-y * 20 * a).toFixed(2)}px, 0)`
    }
    gsap.ticker.add(tick)
    return () => {
      gsap.ticker.remove(tick)
      window.removeEventListener('pointermove', onMove)
    }
  }, [reducedMotion, amp, pointer, q])

  // ------------------------------------------------------- intro → reveal
  useLayoutEffect(() => {
    if (!introDone) return
    const ctx = gsap.context(() => {
      const L = layoutRef.current
      const titleStrokes = q.title.querySelectorAll('text')
      const uiBits = q.world.querySelectorAll('[data-reveal]')
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })

      tl.to(introRef.current, {
        autoAlpha: 0,
        scale: reducedMotion ? 1 : 1.08,
        duration: reducedMotion ? 0.5 : 0.9,
        ease: 'power2.inOut',
        onComplete: onIntroHidden,
      }, 0)

      if (reducedMotion) {
        tl.fromTo(q.reveal, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.8, ease: 'power1.out' }, 0.2)
          .fromTo([q.glow, q.shadow], { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.8 }, 0.2)
          .fromTo([q.splashLeft, q.splashRight], { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.8 }, 0.3)
          .set(titleStrokes, { strokeDashoffset: 0 }, 0)
          .fromTo(q.title, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.8 }, 0.3)
          .fromTo(uiBits, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.6, stagger: 0.04 }, 0.4)
          .fromTo(bgRef.current, { autoAlpha: 0.4 }, { autoAlpha: 1, duration: 1 }, 0)
          .call(loadLayers, null, 1.2)
        return
      }

      // 1. liquid chocolate rushes in (video, screen-blended over the dark stage)
      const v = q.splashVideo
      tl.call(() => {
        try {
          v.currentTime = 0
          const p = v.play()
          if (p?.catch) p.catch(() => gsap.set(v, { autoAlpha: 0 }))
        } catch {
          /* ignore – PNG splashes carry the reveal on their own */
        }
      }, null, 0.05)
        .fromTo(v, { autoAlpha: 0 }, { autoAlpha: 0.9, duration: 0.5, ease: 'power1.out' }, 0.05)
        .to(v, { autoAlpha: 0, duration: 1.1, ease: 'power1.inOut' }, 2.5)

        // 2. studio light blooms behind where the product will land
        .fromTo(bgRef.current, { autoAlpha: 0.25 }, { autoAlpha: 1, duration: 2.2, ease: 'power1.out' }, 0.1)
        .fromTo(q.glow, { autoAlpha: 0, scale: 0.35 }, { autoAlpha: 1, scale: 1, duration: 1.8 }, 0.25)

        // 3. a crown splash bursts out of the centre…
        .fromTo(q.splashCenter,
          { autoAlpha: 0, scale: 0.25, y: L.vh * 0.08 },
          { autoAlpha: 1, scale: 1.12, y: 0, duration: 0.75 }, 0.3)
        .to(q.splashCenter, { autoAlpha: 0, scale: 1.45, y: -L.vh * 0.05, duration: 0.9, ease: 'power2.in' }, 0.95)

        // …and the two swirls whip outward in opposite directions
        .fromTo(q.splashLeft,
          { autoAlpha: 0, x: L.vw * 0.22, y: L.vh * 0.12, rotation: 40, scale: 0.3 },
          { autoAlpha: 1, x: 0, y: 0, rotation: 0, scale: 1, duration: 1.5 }, 0.42)
        .fromTo(q.splashRight,
          { autoAlpha: 0, x: -L.vw * 0.22, y: -L.vh * 0.1, rotation: -40, scale: 0.3 },
          { autoAlpha: 1, x: 0, y: 0, rotation: 0, scale: 1, duration: 1.5 }, 0.48)

        // 4. the scoop rises through the splash, overshoots slightly, then settles
        .fromTo(q.reveal,
          { autoAlpha: 0, scale: 0.55, y: L.vh * 0.12, rotation: -6, filter: L.mobile ? 'none' : 'blur(16px)' },
          { autoAlpha: 1, scale: 1.07, y: 0, rotation: 0, filter: 'blur(0px)', duration: 1.15 }, 0.55)
        .to(q.reveal, { scale: 1, duration: 1.1, ease: 'power3.inOut', clearProps: 'filter' }, 1.6)
        .fromTo(q.shadow, { autoAlpha: 0, scaleX: 0.4 }, { autoAlpha: 1, scaleX: 1, duration: 1.4 }, 1.0)

        // 5. the outline wordmark draws itself behind the product
        .fromTo(q.title, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3, ease: 'none' }, 0.9)
        .fromTo(titleStrokes, { strokeDashoffset: 1700 }, { strokeDashoffset: 0, duration: 2.6, ease: 'power2.inOut' }, 0.9)

        // 6. editorial UI settles in
        .fromTo(uiBits, { autoAlpha: 0, y: 22 }, { autoAlpha: 1, y: 0, duration: 1.1, stagger: 0.07 }, 1.45)

        // 7. hand over to the idle float
        .to(amp, { reveal: 1, duration: 1.6, ease: 'sine.inOut' }, 2.1)
        .call(loadLayers, null, 2.6)
    })
    return () => {
      ctx.revert()
      amp.reveal = 0
    }
  }, [introDone, reducedMotion, introRef, onIntroHidden, bgRef, amp, q, loadLayers])

  // --------------------------------------------------------------------- CTA
  const goToAbout = (e) => {
    e.preventDefault()
    const top = q.about.getBoundingClientRect().top + window.scrollY
    if (reducedMotion) window.scrollTo(0, top)
    else gsap.to(window, { scrollTo: { y: top, autoKill: true }, duration: 2.2, ease: 'power2.inOut' })
  }

  const heroSizes = '(max-width: 700px) 92vw, 72vh'
  return (
    <div className="world" ref={ref('world')}>
      {/* ---------------------------------------------- the travelling product */}
      {/* the track spans exactly Hero + About, so the sticky rig releases
          precisely when the anatomy section ends */}
      <div className="rig-track" aria-hidden="true">
      <div className="rig-holder">
        <div className="rig" ref={ref('rig')}>
          <div className="rig__parallax" ref={ref('parallax')}>
            <div className="rig__float" ref={ref('float')}>
              <div className="rig__reveal" ref={ref('reveal')}>
                <div className="rig__glow-wrap" ref={ref('glowWrap')}>
                  <div className="rig__glow" ref={ref('glow')} />
                </div>
                <div className="rig__shadow-wrap" ref={ref('shadowWrap')}>
                  <div className="rig__shadow" ref={ref('shadow')} />
                </div>
                <img
                  ref={ref('heroImg')}
                  className="rig__hero"
                  src={ASSETS.hero.src}
                  srcSet={ASSETS.hero.srcSet}
                  sizes={heroSizes}
                  width="1199"
                  height="1312"
                  alt=""
                  fetchPriority="high"
                  decoding="async"
                />
                {INGREDIENTS.map((ing, i) => (
                  <div
                    key={ing.no}
                    className="layer"
                    ref={ref(`layer${i}`)}
                    style={{ zIndex: 10 - i }}
                  >
                    <div className="layer__glow" />
                    <img
                      src={layersReady ? ASSETS.layers[ing.layer].src : undefined}
                      srcSet={layersReady ? ASSETS.layers[ing.layer].srcSet : undefined}
                      sizes="(max-width: 700px) 60vw, 48vh"
                      width="1199"
                      height="1312"
                      alt=""
                      decoding="async"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      </div>

      {/* ------------------------------------------------------------ 01 HERO */}
      <section className="hero" ref={ref('hero')} aria-labelledby="hero-title">
        <video
          ref={ref('splashVideo')}
          className="hero__splash-video"
          muted
          playsInline
          preload="auto"
          disablePictureInPicture
          aria-hidden="true"
        >
          {!reducedMotion &&
            ASSETS.splashVideo.map((s, i, all) => (
              <source
                key={s.src}
                src={s.src}
                type={s.type}
                // if the last candidate fails, nothing can play: keep it hidden
                onError={i === all.length - 1 ? (e) => gsap.set(e.currentTarget.parentNode, { autoAlpha: 0 }) : undefined}
              />
            ))}
        </video>

        <div className="splash-depth splash-depth--left" ref={ref('splashLeftDepth')} aria-hidden="true">
          <div ref={ref('splashLeftScroll')}>
            <img ref={ref('splashLeft')} className="splash splash--left" src={ASSETS.splashLeft.src}
              srcSet={ASSETS.splashLeft.srcSet} sizes="34vw" width="665" height="720" alt="" />
          </div>
        </div>
        <div className="splash-depth splash-depth--right" ref={ref('splashRightDepth')} aria-hidden="true">
          <div ref={ref('splashRightScroll')}>
            <img ref={ref('splashRight')} className="splash splash--right" src={ASSETS.splashRight.src}
              srcSet={ASSETS.splashRight.srcSet} sizes="34vw" width="678" height="724" alt="" />
          </div>
        </div>
        <img ref={ref('splashCenter')} className="splash splash--center" src={ASSETS.splashCenter.src}
          srcSet={ASSETS.splashCenter.srcSet} sizes="60vw" width="909" height="626" alt="" aria-hidden="true" />

        <h1 className="hero__title" id="hero-title" ref={ref('titleDepth')}>
          <span className="sr-only">MELT THEORY</span>
          <span className="hero__title-scroll" ref={ref('titleScroll')} aria-hidden="true">
            <span ref={ref('title')} className="hero__title-art">
              <svg className="title-svg title-svg--wide" viewBox="0 0 1000 190" preserveAspectRatio="xMidYMid meet">
                <text x="500" y="168" textAnchor="middle" textLength="990" lengthAdjust="spacingAndGlyphs">MELT THEORY</text>
              </svg>
              <svg className="title-svg title-svg--stack" viewBox="0 0 600 470" preserveAspectRatio="xMidYMid meet">
                <text x="300" y="218" textAnchor="middle" textLength="440" lengthAdjust="spacingAndGlyphs">MELT</text>
                <text x="300" y="452" textAnchor="middle" textLength="590" lengthAdjust="spacingAndGlyphs">THEORY</text>
              </svg>
            </span>
          </span>
        </h1>

        <div className="hero__ui" ref={ref('heroUi')}>
          <header className="topbar">
            <a href="#top" className="wordmark" data-reveal onClick={(e) => e.preventDefault()}>
              <svg viewBox="0 0 64 64" aria-hidden="true">
                <path d="M14 44V20l18 16 18-16v24" /><path d="M32 36v12" /><circle cx="32" cy="53" r="2.6" />
              </svg>
              <span>MELT THEORY</span>
            </a>
            <p className="topbar__meta" data-reveal>
              <span>Small-batch ice cream studio</span>
            </p>
            <p className="topbar__meta topbar__meta--right" data-reveal>
              <span>N°01</span> <span className="dim">Vanilla bean × dark cacao</span>
            </p>
          </header>

          <div className="hero__copy">
            <p className="eyebrow" data-reveal>
              <span className="eyebrow__no">(01)</span> Signature scoop
            </p>
            <p className="hero__tagline" data-reveal>
              The art of <em>melting</em> moments.
            </p>
            <p className="hero__support" data-reveal>Crafted to melt. Designed to be remembered.</p>
          </div>

          <a href="#about" className="cta" onClick={goToAbout} data-reveal>
            <span className="cta__label">Explore the experience</span>
            <span className="cta__ring" aria-hidden="true">
              <svg viewBox="0 0 24 24"><path d="M12 5v14M6 13l6 6 6-6" /></svg>
            </span>
          </a>

          <div className="hero__scrollcue" data-reveal aria-hidden="true">
            <span>Scroll</span>
            <i />
          </div>
          <p className="hero__side" data-reveal aria-hidden="true">Served at −14°C · Melts in 4′</p>
        </div>
      </section>

      {/* ------------------------------------------------------ 02 ANATOMY */}
      <section className="about" id="about" ref={ref('about')} aria-labelledby="about-title">
        <div className="about__pin" ref={ref('aboutPin')} data-active="0">
          <div className="about__intro" ref={ref('aboutIntro')}>
            <p className="eyebrow"><span className="mask"><span data-rise><span className="eyebrow__no">(02)</span> Anatomy of a scoop</span></span></p>
            <h2 className="about__title" id="about-title">
              <span className="mask"><span data-rise>More than just</span></span>
              <span className="mask"><span data-rise className="serif">ice cream.</span></span>
            </h2>
            <p className="about__desc" ref={ref('aboutDesc')}>
              <span className="mask"><span data-rise>
                Every scoop is a carefully crafted combination of texture, flavor, and indulgence.
                Discover the layers behind the MELT THEORY experience.
              </span></span>
            </p>
          </div>

          <ol className="anatomy">
            {INGREDIENTS.map((ing, i) => (
              <li key={ing.no} className="label" ref={ref(`label${i}`)} data-slot={ing.slot}>
                <span className="label__dot" aria-hidden="true" />
                <span className="label__line" aria-hidden="true" />
                <div className="label__body">
                  <span className="label__no">{ing.no}</span>
                  <h3 className="label__title">{ing.title}</h3>
                  <p className="label__text">{ing.text}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="about__progress" aria-hidden="true">
            <span className="about__count"><b ref={ref('counter')}>00</b> / 05</span>
            <span className="about__track"><i ref={ref('progressFill')} /></span>
            <span className="about__layers">Layers</span>
          </div>
          <p className="about__note">Fictional brand &amp; ingredients — a portfolio concept.</p>
        </div>
      </section>
    </div>
  )
}
