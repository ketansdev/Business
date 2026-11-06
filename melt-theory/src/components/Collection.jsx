import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { CATEGORIES } from '../data/collection'
import { productImage } from '../lib/assets'
import ProductCard from './ProductCard'

gsap.registerPlugin(ScrollTrigger)

const TOTAL = CATEGORIES.reduce((n, c) => n + c.products.length, 0)
const pad = (n) => String(n).padStart(2, '0')

/**
 * 03 — The MELT THEORY collection. A self-contained section after the
 * Hero/Anatomy world: its ScrollTriggers only reveal (play once) or apply
 * light parallax, and never pin, so the earlier choreography is untouched.
 */
export default function Collection({ reducedMotion, onCategoryChange, request }) {
  const sectionRef = useRef(null)
  const trackRef = useRef(null)
  const tablistRef = useRef(null)
  const indicatorRef = useRef(null)
  const tabRefs = useRef([])
  const outTl = useRef(null)
  const pendingActive = useRef(0)
  const firstShow = useRef(true)
  const syncLockUntil = useRef(0) // pause swipe-sync while a button-driven scroll runs

  const [cat, setCat] = useState(0) // selected category (tabs, mood: instant)
  const [shownCat, setShownCat] = useState(0) // category whose cards are rendered
  const [active, setActive] = useState(0) // active product within shownCat
  const [interactive, setInteractive] = useState(false)

  const category = CATEGORIES[shownCat]
  const selected = CATEGORIES[cat]
  const count = category.products.length

  // tell the page which category is on screen (the Obsession section carries its bestseller)
  useEffect(() => {
    onCategoryChange?.(CATEGORIES[shownCat].id)
  }, [shownCat, onCategoryChange])

  // fine pointer + motion allowed → tilt / spotlight
  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)')
    const update = () => setInteractive(mq.matches && !reducedMotion)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [reducedMotion])

  // ------------------------------------------------ scroll-in reveal + parallax
  useLayoutEffect(() => {
    const root = sectionRef.current
    const ctx = gsap.context(() => {
      const once = (trigger, start = 'top 82%') => ({ trigger, start, once: true })
      const lines = root.querySelectorAll('[data-line]')
      const fades = root.querySelectorAll('[data-fade]')
      const slots = root.querySelectorAll('.pcard-slot')
      const nav = root.querySelector('.cnav')

      if (reducedMotion) {
        gsap.fromTo([...lines, ...fades, nav, ...slots], { autoAlpha: 0 }, {
          autoAlpha: 1, duration: 0.6, stagger: 0.03, scrollTrigger: once(root, 'top 75%'),
        })
      } else {
        gsap.fromTo(lines, { yPercent: 112, rotate: 2 }, {
          yPercent: 0, rotate: 0, duration: 1.2, ease: 'expo.out', stagger: 0.11,
          scrollTrigger: once(root.querySelector('.collection__intro')),
        })
        gsap.fromTo(fades, { autoAlpha: 0, y: 24 }, {
          autoAlpha: 1, y: 0, duration: 1, ease: 'power3.out', stagger: 0.1, delay: 0.25,
          scrollTrigger: once(root.querySelector('.collection__intro')),
        })
        gsap.fromTo(nav, { autoAlpha: 0, y: 28 }, {
          autoAlpha: 1, y: 0, duration: 1, ease: 'power3.out', scrollTrigger: once(nav, 'top 90%'),
        })
        gsap.fromTo(slots, { autoAlpha: 0, y: 70 }, {
          autoAlpha: 1, y: 0, duration: 1.15, ease: 'expo.out', stagger: 0.09,
          scrollTrigger: once(trackRef.current, 'top 88%'),
        })
        // light parallax: heading drifts slower than the page, ghost word slides
        gsap.fromTo(root.querySelector('.collection__intro'), { y: 50 }, {
          y: -50, ease: 'none',
          scrollTrigger: { trigger: root, start: 'top bottom', end: 'bottom top', scrub: true },
        })
        gsap.fromTo(root.querySelector('.collection__ghost'), { xPercent: 4 }, {
          xPercent: -6, ease: 'none',
          scrollTrigger: { trigger: root, start: 'top bottom', end: 'bottom top', scrub: true },
        })
      }

      // warm the cache for every category once the section approaches,
      // so switching tabs never waits on the network
      ScrollTrigger.create({
        trigger: root,
        start: 'top 160%',
        once: true,
        onEnter: () => {
          CATEGORIES.forEach((c) =>
            c.products.forEach((p) => {
              const { src, srcSet } = productImage(c.id, p.id)
              const im = new Image()
              im.sizes = '(max-width: 599px) 78vw, (max-width: 899px) 46vw, (max-width: 1199px) 31vw, 24vw'
              im.srcset = srcSet
              im.src = src
            }),
          )
        },
      })
    }, root)
    return () => ctx.revert()
  }, [reducedMotion])

  // ------------------------------------------------------- carousel helpers
  const cards = () => [...(trackRef.current?.querySelectorAll('.pcard-slot') ?? [])]

  const ensureVisible = useCallback(
    (i) => {
      const track = trackRef.current
      const card = cards()[i]
      if (!track || !card) return
      const padL = parseFloat(getComputedStyle(track).paddingLeft) || 0
      const left = card.offsetLeft - padL
      const right = card.offsetLeft + card.offsetWidth - track.clientWidth + padL
      let to = null
      if (track.scrollLeft > left + 1) to = left
      else if (track.scrollLeft < right - 1) to = right
      if (to !== null) {
        syncLockUntil.current = performance.now() + 900
        track.scrollTo({ left: to, behavior: reducedMotion ? 'auto' : 'smooth' })
      }
    },
    [reducedMotion],
  )

  // a swipe/drag on the track moves the active card along with it
  useEffect(() => {
    const track = trackRef.current
    let raf = 0
    const sync = () => {
      raf = 0
      if (performance.now() < syncLockUntil.current) return
      if (track.scrollWidth <= track.clientWidth + 2) return
      const vis = track.getBoundingClientRect()
      const list = cards()
      const fully = (el) => {
        const r = el.getBoundingClientRect()
        return r.left >= vis.left - 2 && r.right <= vis.right + 2
      }
      setActive((a) => {
        if (list[a] && fully(list[a])) return a
        const first = list.findIndex(fully)
        return first === -1 ? a : first
      })
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(sync)
    }
    track.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      track.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  // ------------------------------------------------------- category switching
  const selectCategory = useCallback((i, startAt = 0) => {
    pendingActive.current = startAt
    setCat(i)
  }, [])

  useEffect(() => {
    if (cat === shownCat) return
    outTl.current?.kill()
    const list = trackRef.current.querySelectorAll('.pcard')
    const done = () => {
      trackRef.current.scrollLeft = 0
      setActive(pendingActive.current)
      setShownCat(cat)
    }
    outTl.current = reducedMotion
      ? gsap.to(list, { autoAlpha: 0, duration: 0.15, onComplete: done })
      : gsap.to(list, {
          autoAlpha: 0, y: 26, scale: 0.97, duration: 0.26, ease: 'power2.in', stagger: 0.035, onComplete: done,
        })
    return () => outTl.current?.kill()
  }, [cat, shownCat, reducedMotion])

  // new cards animate in (skipped on first render: the scroll reveal owns that)
  useLayoutEffect(() => {
    if (firstShow.current) {
      firstShow.current = false
      return
    }
    const list = trackRef.current.querySelectorAll('.pcard')
    const media = trackRef.current.querySelectorAll('.pcard__media')
    const ctx = gsap.context(() => {
      if (reducedMotion) {
        gsap.fromTo(list, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 })
      } else {
        gsap.fromTo(list, { autoAlpha: 0, y: 44, scale: 1 }, {
          autoAlpha: 1, y: 0, duration: 0.75, ease: 'expo.out', stagger: 0.07,
        })
        gsap.fromTo(media, { scale: 0.84, rotation: -4, yPercent: 6 }, {
          scale: 1, rotation: 0, yPercent: 0, duration: 0.95, ease: 'expo.out', stagger: 0.07,
        })
      }
    })
    if (pendingActive.current) ensureVisible(pendingActive.current)
    return () => ctx.revert()
  }, [shownCat, reducedMotion, ensureVisible])

  // ------------------------------------------------------- tab indicator
  useLayoutEffect(() => {
    const place = () => {
      const tab = tabRefs.current[cat]
      const list = tablistRef.current
      if (!tab || !list) return
      indicatorRef.current.style.width = `${tab.offsetWidth}px`
      indicatorRef.current.style.transform = `translateX(${tab.offsetLeft}px)`
      // keep the active tab in view on narrow screens (horizontal only — never scrolls the page)
      if (list.scrollWidth > list.clientWidth) {
        const target = tab.offsetLeft - (list.clientWidth - tab.offsetWidth) / 2
        list.scrollTo({ left: Math.max(0, target), behavior: reducedMotion ? 'auto' : 'smooth' })
      }
    }
    place()
    window.addEventListener('resize', place)
    document.fonts?.ready.then(place)
    return () => window.removeEventListener('resize', place)
  }, [cat, reducedMotion])

  // external "show me this product" requests (Find Your Melt CTA)
  useEffect(() => {
    if (!request) return
    const ci = CATEGORIES.findIndex((c) => c.id === request.category)
    if (ci < 0) return
    const pi = Math.max(0, CATEGORIES[ci].products.findIndex((p) => p.id === request.product))
    if (ci === cat && ci === shownCat) {
      setActive(pi)
      ensureVisible(pi)
    } else {
      selectCategory(ci, pi)
    }
    // only react to a new request
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [request?.nonce])

  // ------------------------------------------------------- controls
  const step = (dir) => {
    if (cat !== shownCat) return // ignore while a switch is mid-flight
    const next = active + dir
    if (next >= 0 && next < count) {
      setActive(next)
      ensureVisible(next)
    } else {
      const ci = (shownCat + dir + CATEGORIES.length) % CATEGORIES.length
      selectCategory(ci, dir > 0 ? 0 : CATEGORIES[ci].products.length - 1)
    }
  }

  const onTabKey = (e) => {
    const keys = { ArrowRight: 1, ArrowLeft: -1 }
    let i = null
    if (e.key in keys) i = (cat + keys[e.key] + CATEGORIES.length) % CATEGORIES.length
    if (e.key === 'Home') i = 0
    if (e.key === 'End') i = CATEGORIES.length - 1
    if (i === null) return
    e.preventDefault()
    selectCategory(i)
    tabRefs.current[i]?.focus()
  }

  // position across the whole menu (for the progress caption)
  const menuIndex = CATEGORIES.slice(0, shownCat).reduce((n, c) => n + c.products.length, 0) + active + 1

  return (
    <section
      className="collection"
      id="collection"
      ref={sectionRef}
      aria-labelledby="collection-title"
      style={{ '--cat-accent': selected.mood.accent }}
    >
      {/* category mood: four stacked glows, only the selected one is lit */}
      <div className="collection__mood" aria-hidden="true">
        {CATEGORIES.map((c, i) => (
          <span
            key={c.id}
            className="mood"
            data-on={i === cat || undefined}
            style={{ '--glow-a': c.mood.glowA, '--glow-b': c.mood.glowB }}
          />
        ))}
      </div>

      <div className="collection__inner">
        <header className="collection__intro">
          <div className="collection__heading">
            <p className="eyebrow">
              <span className="mask"><span data-line><span className="eyebrow__no">(03)</span> The MELT THEORY Collection</span></span>
            </p>
            <h2 className="collection__title" id="collection-title">
              <span className="mask"><span data-line>A world of</span></span>
              <span className="mask"><span data-line className="serif">indulgence.</span></span>
            </h2>
          </div>
          <div className="collection__aside">
            <p className="collection__desc" data-fade>
              From golden waffles to handcrafted ice cream, refreshing smoothies and irresistible cupcakes.
              Discover your next obsession.
            </p>
            <p className="collection__stats" data-fade>
              <span><b>{pad(TOTAL)}</b> creations</span>
              <span><b>{pad(CATEGORIES.length)}</b> collections</span>
            </p>
          </div>
        </header>

        <nav className="cnav" aria-label="Menu categories">
          <div className="cnav__tabs" ref={tablistRef} role="tablist" aria-label="Categories" onKeyDown={onTabKey}>
            {CATEGORIES.map((c, i) => (
              <button
                key={c.id}
                ref={(el) => (tabRefs.current[i] = el)}
                type="button"
                role="tab"
                id={`ctab-${c.id}`}
                aria-selected={i === cat}
                aria-controls="collection-panel"
                tabIndex={i === cat ? 0 : -1}
                className="ctab"
                onClick={() => selectCategory(i)}
              >
                <span className="ctab__no">{pad(i + 1)}</span>
                <span className="ctab__label">{c.label}</span>
                <sup className="ctab__count">{pad(c.products.length)}</sup>
              </button>
            ))}
            <span className="cnav__indicator" ref={indicatorRef} aria-hidden="true" />
          </div>
        </nav>

        <div className="collection__stage">
          <div className="collection__ghost" aria-hidden="true">
            {CATEGORIES.map((c, i) => (
              <span key={c.id} data-on={i === cat || undefined}>{c.label}</span>
            ))}
          </div>

          <div
            className="ctrack"
            id="collection-panel"
            role="tabpanel"
            aria-labelledby={`ctab-${category.id}`}
            ref={trackRef}
          >
            {category.products.map((p, i) => (
              <div className="pcard-slot" key={p.id} data-product={p.id}>
                <ProductCard
                  product={p}
                  category={category}
                  index={i}
                  active={i === active}
                  interactive={interactive}
                  onActivate={() => setActive(i)}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="ccontrols">
          <p className="ccontrols__caption" aria-live="polite">
            <span className="ccontrols__cat">{category.label}</span>
            <span className="ccontrols__line">{category.line}</span>
          </p>
          <div className="ccontrols__progress" aria-hidden="true">
            <span className="ccontrols__count">
              <b>{pad(active + 1)}</b> / {pad(count)}
            </span>
            <span className="ccontrols__bars">
              {category.products.map((p, i) => (
                <i key={p.id} data-on={i <= active || undefined} data-current={i === active || undefined} />
              ))}
            </span>
            <span className="ccontrols__menu">{pad(menuIndex)} of {pad(TOTAL)}</span>
          </div>
          <div className="ccontrols__arrows">
            <button type="button" className="carrow" onClick={() => step(-1)} aria-label="Previous product">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12H5M11 6l-6 6 6 6" /></svg>
            </button>
            <button type="button" className="carrow" onClick={() => step(1)} aria-label="Next product">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
            </button>
          </div>
        </div>

        <p className="collection__note">Fictional products · illustrative prices · a portfolio concept.</p>
      </div>
    </section>
  )
}
