import { useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import { DESSERT, FOOTER_NAV } from '../data/footer'

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)

const EMAIL_RE = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/
const PARTICLES = [
  { x: 8, y: 30, s: 3, d: 14 }, { x: 22, y: 62, s: 2, d: 18 }, { x: 41, y: 18, s: 2.5, d: 16 },
  { x: 63, y: 44, s: 2, d: 20 }, { x: 78, y: 22, s: 3, d: 15 }, { x: 91, y: 58, s: 2, d: 19 },
]

const Words = ({ text, className }) =>
  text.split(' ').map((w, i, a) => (
    <span key={i}>
      <span className="w"><span className={`w__i${className ? ` ${className}` : ''}`}>{w}</span></span>
      {i < a.length - 1 ? ' ' : ''}
    </span>
  ))

/**
 * 08 — THE GRAND FINALE. Not pinned: every part reveals with a short,
 * reversible ScrollTrigger and all links are usable as soon as they're visible.
 */
export default function Footer({ reducedMotion, onExplore }) {
  const root = useRef(null)
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [sent, setSent] = useState(null) // demo confirmation (email string)
  const inputRef = useRef(null)

  // ------------------------------------------------------------ scroll choreography
  useLayoutEffect(() => {
    const el = root.current
    const mm = gsap.matchMedia(el)
    mm.add({ motion: '(prefers-reduced-motion: no-preference)', fine: '(hover: hover) and (pointer: fine) and (min-width: 1024px)', small: '(max-width: 767px)' }, (ctx) => {
      const { motion, fine, small } = ctx.conditions
      const reveal = (trigger, start = 'top 85%') => ({ trigger, start, toggleActions: 'play none none reverse' })

      if (!motion) {
        // reduced motion: content simply fades in once; the drip edge stays still
        gsap.fromTo('.fin-outro, .fin-brand, .fin-grid, .fin-sign', { autoAlpha: 0 }, {
          autoAlpha: 1, duration: 0.6, stagger: 0.1, scrollTrigger: { trigger: el, start: 'top 80%', once: true },
        })
        return
      }

      // 1. the previous section melts in: drips lengthen as the footer arrives
      gsap.fromTo('.fin-drip', { '--m': 0.96 }, {
        '--m': 0.66, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'top 25%', scrub: true },
      })
      gsap.fromTo('.fin-glow', { autoAlpha: 0, scale: 0.8 }, {
        autoAlpha: 1, scale: 1, ease: 'none', scrollTrigger: { trigger: el, start: 'top 90%', end: 'top 20%', scrub: true },
      })

      // 2. LIFE IS SHORT. / MAKE IT SWEETER.
      const outro = gsap.timeline({ defaults: { ease: 'power3.out' }, scrollTrigger: reveal('.fin-outro', 'top 78%') })
      outro
        .fromTo('.fin-eyebrow', { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.6 }, 0)
        .fromTo('.fin-line1 .w__i', { yPercent: 115 }, { yPercent: 0, duration: 1.0, stagger: 0.07 }, 0.1)
        .fromTo('.fin-line2 .w__i', { yPercent: 115 }, { yPercent: 0, duration: 1.0, stagger: 0.07 }, 0.35)
        .fromTo('.fin-underline path', { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.9, ease: 'power2.inOut' }, 0.9)
        .fromTo('.fin-copy', { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.8 }, 0.8)
        .fromTo('.fin-dessert', { autoAlpha: 0, y: 70, scale: 0.9 }, { autoAlpha: 1, y: 0, scale: 1, duration: 1.4 }, 0.2)

      // 3. the giant signature: horizontal mask reveal + scroll parallax + light sweep
      gsap.fromTo('.fin-brand__clip', { clipPath: 'inset(0% 100% 0% 0%)' }, {
        clipPath: 'inset(0% 0% 0% 0%)', duration: 1.6, ease: 'power3.inOut', scrollTrigger: reveal('.fin-brand', 'top 88%'),
      })
      gsap.fromTo('.fin-brand__drift', { xPercent: small ? 1.5 : 3 }, {
        xPercent: small ? -1.5 : -3, ease: 'none', scrollTrigger: { trigger: '.fin-brand', start: 'top bottom', end: 'bottom top', scrub: true },
      })
      const sweep = gsap.fromTo('.fin-sheen', { attr: { x: -420 } }, {
        attr: { x: 1420 }, duration: 2.6, ease: 'power1.inOut', repeat: -1, repeatDelay: 4.5, paused: true,
      })
      const float = gsap.to('.fin-brand__float', { y: small ? -3 : -6, duration: 3.4, ease: 'sine.inOut', yoyo: true, repeat: -1, paused: true })
      const dessertFloat = gsap.to('.fin-dessert__float', {
        y: small ? -8 : -16, rotation: small ? 1 : 2.5, duration: 3.8, ease: 'sine.inOut', yoyo: true, repeat: -1, paused: true,
      })
      // loops only run while the footer is on screen
      ScrollTrigger.create({
        trigger: el,
        start: 'top bottom',
        end: 'bottom top',
        onToggle: (self) => [sweep, float, dessertFloat].forEach((t) => (self.isActive ? t.play() : t.pause())),
      })

      // 4. navigation, newsletter and sign-off settle in quickly (never blocks clicks)
      gsap.fromTo('.fin-col', { autoAlpha: 0, y: 24 }, {
        autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.08, ease: 'power3.out', scrollTrigger: reveal('.fin-grid', 'top 92%'),
      })
      gsap.fromTo('.fin-sign > *', { autoAlpha: 0 }, {
        autoAlpha: 1, duration: 0.6, stagger: 0.08, scrollTrigger: reveal('.fin-sign', 'top 98%'),
      })

      // 5. pointer parallax on the dessert (desktop, fine pointers only)
      let onMove = null
      let onLeave = null
      if (fine) {
        const area = el.querySelector('.fin-hero')
        const rig = el.querySelector('.fin-dessert__rig')
        const rx = gsap.quickTo(rig, 'rotationX', { duration: 1.1, ease: 'power3.out' })
        const ry = gsap.quickTo(rig, 'rotationY', { duration: 1.1, ease: 'power3.out' })
        const tx = gsap.quickTo(rig, 'x', { duration: 1.1, ease: 'power3.out' })
        const ty = gsap.quickTo(rig, 'y', { duration: 1.1, ease: 'power3.out' })
        onMove = (e) => {
          const r = area.getBoundingClientRect()
          const nx = (e.clientX - r.left) / r.width - 0.5
          const ny = (e.clientY - r.top) / r.height - 0.5
          ry(nx * 14); rx(-ny * 10); tx(nx * 22); ty(ny * 14)
        }
        onLeave = () => { ry(0); rx(0); tx(0); ty(0) }
        area.addEventListener('pointermove', onMove)
        area.addEventListener('pointerleave', onLeave)
        return () => {
          area.removeEventListener('pointermove', onMove)
          area.removeEventListener('pointerleave', onLeave)
        }
      }
    })
    return () => mm.revert()
  }, [])

  // ------------------------------------------------------------ navigation
  const scrollToY = (y) => {
    const d = Math.abs(window.scrollY - y)
    if (reducedMotion) window.scrollTo(0, y)
    else gsap.to(window, { scrollTo: { y, autoKill: true }, duration: Math.min(2.4, 0.8 + d / 9000), ease: 'power3.inOut' })
  }
  const go = (e, link) => {
    const g = link.go
    if (!g) return
    e.preventDefault()
    if (g.top) return scrollToY(0)
    if (g.category) return onExplore?.({ category: g.category })
    if (g.note) {
      // opens the existing Wall of Love note form (no duplicate form)
      window.dispatchEvent(new CustomEvent('melt:open-note', { detail: { opener: e.currentTarget } }))
      return
    }
    const target = document.querySelector(g.section)
    if (target) scrollToY(target.getBoundingClientRect().top + window.scrollY)
  }

  // ------------------------------------------------------------ newsletter (frontend demo)
  const submit = (e) => {
    e.preventDefault()
    const v = email.trim()
    if (!EMAIL_RE.test(v)) {
      setError('Please enter a valid email address, like name@example.com.')
      inputRef.current?.focus()
      if (!reducedMotion) gsap.fromTo('.fin-field', { x: -6 }, { x: 0, duration: 0.5, ease: 'elastic.out(1.2, 0.3)' })
      return
    }
    setError('')
    setSent(v)
    if (!reducedMotion) {
      requestAnimationFrame(() =>
        gsap.fromTo('.fin-thanks > *', { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.08, ease: 'power3.out' }),
      )
    }
  }

  return (
    <footer className="fin" id="finale" ref={root} aria-labelledby="fin-title">
      {/* the previous scene melting into the footer */}
      <div className="fin-drip liquid" aria-hidden="true" />
      <div className="fin-atmo" aria-hidden="true">
        <span className="fin-glow" />
        {PARTICLES.map((p, i) => (
          <i key={i} className="fin-particle" style={{ '--px': `${p.x}%`, '--py': `${p.y}%`, '--ps': `${p.s}px`, '--pd': `${p.d}s` }} />
        ))}
      </div>

      <div className="fin-inner">
        {/* ------------------------------------------------ outro */}
        <div className="fin-hero">
          <div className="fin-outro">
            <p className="eyebrow fin-eyebrow"><span className="eyebrow__no">(08)</span> The grand finale</p>
            <h2 className="fin-title" id="fin-title">
              <span className="fin-line1"><Words text="Life is short." /></span>
              <span className="fin-line2">
                <Words text="Make it" className="fin-serif" />{' '}
                <span className="fin-hl">
                  <Words text="sweeter." className="fin-serif" />
                  <svg className="fin-underline" viewBox="0 0 300 20" preserveAspectRatio="none" aria-hidden="true">
                    <path pathLength="1" d="M4 13c40-7 92-9 146-5s96 6 146-2" />
                    <path pathLength="1" d="M40 18c60-4 140-5 220-1" />
                  </svg>
                </span>
              </span>
            </h2>
            <p className="fin-copy">A little chocolate, a little happiness, and moments worth remembering.</p>
          </div>

          <div className="fin-dessert" aria-hidden="true">
            <span className="fin-dessert__spot" />
            <div className="fin-dessert__rig">
              <div className="fin-dessert__float">
                <img className="fin-dessert__ribbon" src={DESSERT.ribbon.src} srcSet={DESSERT.ribbon.srcSet} sizes="22vw" width="900" height="900" alt="" loading="lazy" decoding="async" />
                <img className="fin-dessert__scoop" src={DESSERT.scoop.src} srcSet={DESSERT.scoop.srcSet} sizes="(max-width: 767px) 62vw, 30vw" width="1199" height="1312" alt="" loading="lazy" decoding="async" />
              </div>
              <span className="fin-dessert__floor" />
            </div>
          </div>
        </div>

        {/* ------------------------------------------------ the signature */}
        <div className="fin-brand" aria-hidden="true">
          <div className="fin-brand__drift">
            <div className="fin-brand__float">
              <div className="fin-brand__clip">
                <svg viewBox="0 0 1000 176" preserveAspectRatio="xMidYMid meet">
                  <defs>
                    <linearGradient id="fin-sheen-grad" x1="0" x2="1" y1="0" y2="0">
                      <stop offset="0" stopColor="#fff" stopOpacity="0" />
                      <stop offset="0.5" stopColor="#fff6e6" stopOpacity="0.55" />
                      <stop offset="1" stopColor="#fff" stopOpacity="0" />
                    </linearGradient>
                    <clipPath id="fin-text-clip">
                      <text x="500" y="158" textAnchor="middle" textLength="992" lengthAdjust="spacingAndGlyphs" className="fin-brand__text">MELT THEORY</text>
                    </clipPath>
                  </defs>
                  <text x="500" y="158" textAnchor="middle" textLength="992" lengthAdjust="spacingAndGlyphs" className="fin-brand__text fin-brand__fill">MELT THEORY</text>
                  <g clipPath="url(#fin-text-clip)">
                    <rect className="fin-sheen" x="-420" y="0" width="300" height="176" fill="url(#fin-sheen-grad)" transform="skewX(-18)" />
                  </g>
                  <text x="500" y="158" textAnchor="middle" textLength="992" lengthAdjust="spacingAndGlyphs" className="fin-brand__text fin-brand__stroke">MELT THEORY</text>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* ------------------------------------------------ navigation + newsletter */}
        <div className="fin-grid">
          {FOOTER_NAV.map((col) => (
            <nav className="fin-col" key={col.title} aria-label={col.title}>
              <h3 className="fin-col__title">{col.title}</h3>
              <ul>
                {col.links.map((l) => (
                  <li key={l.label}>
                    {l.go ? (
                      <a className="fin-link" href={l.href} onClick={(e) => go(e, l)}>
                        <span>{l.label}</span>
                        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                      </a>
                    ) : l.external ? (
                      <a className="fin-link" href={l.external} target="_blank" rel="noopener noreferrer">
                        <span>{l.label}</span>
                        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17L17 7M9 7h8v8" /></svg>
                      </a>
                    ) : (
                      <span className="fin-link is-soon" aria-label={`${l.label}: not set up yet`}>
                        <span>{l.label}</span>
                        <em>soon</em>
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div className="fin-col fin-news">
            <p className="fin-col__title">A little something sweet</p>
            <h3 className="fin-news__title">Stay in the loop.</h3>
            <p className="fin-news__text">
              Be the first to discover new flavours, sweet surprises and everything happening at MELT THEORY.
            </p>
            {!sent ? (
              <form className="fin-form" onSubmit={submit} noValidate>
                <label className="sr-only" htmlFor="fin-email">Email address</label>
                <div className="fin-field" data-invalid={!!error || undefined}>
                  <input
                    ref={inputRef}
                    id="fin-email"
                    name="email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      if (error) setError('')
                    }}
                    aria-invalid={!!error}
                    aria-describedby={`fin-email-note${error ? ' fin-email-err' : ''}`}
                  />
                  <button type="submit" className="fin-submit">
                    <span>Subscribe</span>
                    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                  </button>
                </div>
                {error && <p className="fin-error" id="fin-email-err" role="alert">{error}</p>}
                <p className="fin-demo" id="fin-email-note">Demo only: this site has no mailing list, so no email is collected.</p>
              </form>
            ) : (
              <div className="fin-thanks" role="status">
                <p className="fin-thanks__title">Sweet. That looks like a valid address.</p>
                <p className="fin-thanks__text">
                  This is a demo, so <b>{sent}</b> wasn’t added to any mailing list and nothing was sent anywhere.
                </p>
                <button type="button" className="fin-again" onClick={() => { setSent(null); setEmail('') }}>Try another address</button>
              </div>
            )}
          </div>
        </div>

        {/* ------------------------------------------------ sign-off */}
        <div className="fin-sign">
          <p>© 2026 MELT THEORY. All rights reserved.</p>
          <p className="fin-sign__tag">The art of melting moments.</p>
          <p>Made with a little extra love.</p>
        </div>
      </div>
    </footer>
  )
}
