import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { DESSERT_OPTIONS } from '../data/reviews'

const EMPTY = { name: '', review: '', dessert: '' }
const MAX = 240

function validate(v) {
  const e = {}
  if (v.name.trim().length < 2) e.name = 'Please add your name (at least 2 characters).'
  else if (v.name.trim().length > 40) e.name = 'Keep your name under 40 characters.'
  if (v.review.trim().length < 10) e.review = 'Tell us a little more — at least 10 characters.'
  else if (v.review.length > MAX) e.review = `Keep it under ${MAX} characters.`
  return e
}

/**
 * "Leave your note" — a paper note that unfolds onto the screen.
 * FRONTEND DEMO ONLY: this project has no backend or submission endpoint, so the
 * note is validated and previewed locally and is never sent or stored anywhere.
 */
export default function NoteForm({ open, onClose, returnFocusRef }) {
  const [mounted, setMounted] = useState(open)
  const [values, setValues] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [done, setDone] = useState(null) // the previewed note after a valid submit
  const overlay = useRef(null)
  const paper = useRef(null)
  const firstField = useRef(null)
  const reduce = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  // mount on open; unmount after the close animation
  if (open && !mounted) setMounted(true)

  useLayoutEffect(() => {
    if (!mounted) return
    const tl = gsap.timeline()
    if (open) {
      tl.fromTo(overlay.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: reduce ? 0.2 : 0.4, ease: 'power1.out' })
      if (!reduce) {
        // slides up, then unfolds from its top fold
        tl.fromTo(paper.current,
          { y: 120, rotation: -9, scaleY: 0.55, transformOrigin: '50% 0%' },
          { y: 0, rotation: -1.5, scaleY: 1, duration: 0.85, ease: 'expo.out' }, 0.05)
          // opacity (not autoAlpha): fields stay focusable while they fade in
          .fromTo(paper.current.querySelectorAll('[data-in]'), { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.05, ease: 'power2.out' }, 0.35)
      }
      tl.call(() => firstField.current?.focus(), null, 0.06) // as soon as the dialog is visible
    } else {
      if (!reduce) tl.to(paper.current, { y: 90, rotation: 6, autoAlpha: 0, duration: 0.4, ease: 'power2.in' })
      tl.to(overlay.current, { autoAlpha: 0, duration: 0.3 }, reduce ? 0 : 0.15)
      tl.call(() => {
        setMounted(false)
        setValues(EMPTY)
        setErrors({})
        setDone(null)
        returnFocusRef?.current?.focus({ preventScroll: true })
      })
    }
    return () => tl.kill()
  }, [open, mounted, reduce, returnFocusRef])

  // Esc closes; wheel/touch over the backdrop doesn't scroll the page underneath
  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'Tab') {
        // keep focus inside the note
        const f = [...paper.current.querySelectorAll('button, input, textarea, select')].filter((x) => !x.disabled)
        if (!f.length) return
        const first = f[0]
        const last = f[f.length - 1]
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
      }
    }
    const stop = (e) => {
      if (!e.target.closest('textarea')) e.preventDefault()
    }
    const ov = overlay.current
    window.addEventListener('keydown', onKey)
    ov?.addEventListener('wheel', stop, { passive: false })
    ov?.addEventListener('touchmove', stop, { passive: false })
    return () => {
      window.removeEventListener('keydown', onKey)
      ov?.removeEventListener('wheel', stop)
      ov?.removeEventListener('touchmove', stop)
    }
  }, [open, onClose, mounted])

  if (!mounted) return null

  const set = (k) => (e) => {
    const v = { ...values, [k]: e.target.value }
    setValues(v)
    if (errors[k]) setErrors(validate(v))
  }
  const submit = (e) => {
    e.preventDefault()
    const errs = validate(values)
    setErrors(errs)
    if (Object.keys(errs).length) {
      const firstBad = paper.current.querySelector('[aria-invalid="true"]')
      firstBad?.focus()
      if (!reduce) gsap.fromTo(paper.current, { x: -6 }, { x: 0, duration: 0.5, ease: 'elastic.out(1.2, 0.3)' })
      return
    }
    setDone({ ...values, name: values.name.trim(), review: values.review.trim() })
    if (!reduce) {
      requestAnimationFrame(() => {
        const n = paper.current?.querySelector('.nf-preview')
        if (n) gsap.fromTo(n, { y: -40, rotation: -14, autoAlpha: 0 }, { y: 0, rotation: -3, autoAlpha: 1, duration: 0.9, ease: 'elastic.out(1, 0.55)' })
      })
    }
  }

  return (
    <div className="nf-overlay" ref={overlay} onMouseDown={(e) => e.target === overlay.current && onClose()}>
      <div className="nf-paper" ref={paper} role="dialog" aria-modal="true" aria-labelledby="nf-title" aria-describedby="nf-demo">
        <span className="wl-grain" aria-hidden="true" />
        <span className="nf-tape" aria-hidden="true" />
        <button type="button" className="nf-close" onClick={onClose} aria-label="Close" data-in>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
        </button>

        {!done ? (
          <form onSubmit={submit} noValidate>
            <p className="nf-kicker" data-in>Leave your note</p>
            <h3 className="nf-title" id="nf-title" data-in>Tell us your sweet story</h3>
            <p className="nf-demo" id="nf-demo" data-in>
              Demo form: this portfolio site has no backend, so your note stays in this browser tab and isn't sent or saved.
            </p>

            <label className="nf-field" data-in>
              <span>Name</span>
              <input
                ref={firstField}
                id="nf-name"
                name="name"
                type="text"
                autoComplete="given-name"
                value={values.name}
                onChange={set('name')}
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? 'nf-name-err' : undefined}
                maxLength={40}
              />
              {errors.name && <em className="nf-err" id="nf-name-err">{errors.name}</em>}
            </label>

            <label className="nf-field" data-in>
              <span>Your review <small>{values.review.length}/{MAX}</small></span>
              <textarea
                id="nf-review"
                name="review"
                rows={4}
                value={values.review}
                onChange={set('review')}
                aria-invalid={!!errors.review}
                aria-describedby={errors.review ? 'nf-review-err' : undefined}
                maxLength={MAX}
              />
              {errors.review && <em className="nf-err" id="nf-review-err">{errors.review}</em>}
            </label>

            <label className="nf-field" data-in>
              <span>Favourite dessert <small>optional</small></span>
              <select id="nf-dessert" name="dessert" value={values.dessert} onChange={set('dessert')}>
                <option value="">Choose one…</option>
                {DESSERT_OPTIONS.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </label>

            <button type="submit" className="nf-stamp" data-in>
              <span>Pin my note</span>
            </button>
          </form>
        ) : (
          <div className="nf-done" aria-live="polite">
            <p className="nf-kicker">Preview</p>
            <h3 className="nf-title" id="nf-title">Thank you, {done.name}!</h3>
            <div className="nf-preview">
              <span className="wl-pin"><i /></span>
              <p className="nf-preview__text">“{done.review}”</p>
              <p className="wl-hand nf-preview__by">— {done.name}{done.dessert ? `, loves ${done.dessert}` : ''}</p>
            </div>
            <p className="nf-demo">
              This is a local preview only. Nothing was sent, saved or published: there's no database behind this demo.
            </p>
            <div className="nf-actions">
              <button type="button" className="nf-link" onClick={() => { setDone(null); setValues(EMPTY) }}>Write another</button>
              <button type="button" className="nf-stamp nf-stamp--small" onClick={onClose}><span>Close</span></button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
