import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { productImage } from '../lib/assets'
import { formatPrice } from '../data/collection'

const SIZES = '(max-width: 599px) 78vw, (max-width: 899px) 46vw, (max-width: 1199px) 31vw, 24vw'

/**
 * One menu item. Transform ownership:
 *   .pcard-slot  → section scroll-reveal (Collection)
 *   .pcard       → category switch in/out (Collection)
 *   .pcard__tilt → pointer tilt (here)
 *   .pcard__media→ switch-in pop (Collection);  img → CSS hover zoom
 */
export default function ProductCard({ product, category, index, active, interactive, onActivate }) {
  const tiltRef = useRef(null)
  const img = productImage(category.id, product.id)

  useEffect(() => {
    const el = tiltRef.current
    if (!interactive || !el) return
    gsap.set(el, { transformPerspective: 900 })
    const rx = gsap.quickTo(el, 'rotationX', { duration: 0.6, ease: 'power3.out' })
    const ry = gsap.quickTo(el, 'rotationY', { duration: 0.6, ease: 'power3.out' })
    const move = (e) => {
      const r = el.getBoundingClientRect()
      const px = (e.clientX - r.left) / r.width
      const py = (e.clientY - r.top) / r.height
      ry((px - 0.5) * 9)
      rx((0.5 - py) * 7)
      el.style.setProperty('--mx', `${(px * 100).toFixed(1)}%`)
      el.style.setProperty('--my', `${(py * 100).toFixed(1)}%`)
    }
    const leave = () => {
      rx(0)
      ry(0)
    }
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerleave', leave)
    return () => {
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerleave', leave)
      gsap.killTweensOf(el)
      gsap.set(el, { clearProps: 'transform' })
    }
  }, [interactive])

  return (
    <div className="pcard" data-active={active || undefined}>
      <article
        className="pcard__tilt"
        ref={tiltRef}
        tabIndex={0}
        aria-label={`${product.name}, ${formatPrice(product.price)}`}
        onFocus={onActivate}
        onClick={onActivate}
      >
        <span className="pcard__spot" aria-hidden="true" />
        <header className="pcard__meta">
          <span>{category.label}</span>
          <span className="pcard__no">N°{String(index + 1).padStart(2, '0')}</span>
        </header>

        <div className="pcard__media">
          <span className="pcard__glow" aria-hidden="true" />
          <span className="pcard__floor" aria-hidden="true" />
          <img
            src={img.src}
            srcSet={img.srcSet}
            sizes={SIZES}
            width="800"
            height="800"
            alt={product.name}
            loading="lazy"
            decoding="async"
            draggable="false"
          />
        </div>

        <div className="pcard__body">
          <div className="pcard__row">
            <h3 className="pcard__name">{product.name}</h3>
            <p className="pcard__price">{formatPrice(product.price)}</p>
          </div>
          <div className="pcard__reveal">
            <p className="pcard__notes">
              {product.notes.map((n) => (
                <span key={n.label} className="note">
                  <i style={{ background: n.color }} aria-hidden="true" />
                  {n.label}
                </span>
              ))}
            </p>
            <p className="pcard__desc">{product.desc}</p>
          </div>
        </div>
      </article>
    </div>
  )
}
