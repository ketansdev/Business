import { forwardRef, useEffect, useRef } from 'react'
import { ASSETS } from '../lib/assets'

/**
 * Fixed, page-wide studio environment shared by Hero + About so the two
 * sections read as one continuous space: gradients, a soft top key-light,
 * drifting smoke, warm dust particles and film grain.
 */
const Background = forwardRef(function Background({ reducedMotion }, ref) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d', { alpha: true })
    let w = 0
    let h = 0
    let dpr = 1
    let raf = 0
    let particles = []
    let running = true

    const make = (initial) => {
      const big = Math.random() < 0.12
      return {
        x: Math.random() * w,
        y: initial ? Math.random() * h : h + 20,
        r: big ? 2.2 + Math.random() * 3.5 : 0.5 + Math.random() * 1.3,
        vy: -(0.08 + Math.random() * 0.28),
        vx: (Math.random() - 0.5) * 0.12,
        a: big ? 0.05 + Math.random() * 0.08 : 0.18 + Math.random() * 0.45,
        tw: Math.random() * Math.PI * 2,
        ts: 0.004 + Math.random() * 0.012,
        hue: Math.random() < 0.6 ? '236,196,150' : '250,236,214',
      }
    }

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const count = w < 700 ? 26 : w < 1200 ? 48 : 70
      particles = Array.from({ length: count }, () => make(true))
      if (reducedMotion) draw(false)
    }

    const draw = (step) => {
      ctx.clearRect(0, 0, w, h)
      for (const p of particles) {
        if (step) {
          p.x += p.vx
          p.y += p.vy
          p.tw += p.ts
          if (p.y < -20) Object.assign(p, make(false))
        }
        const alpha = p.a * (0.55 + 0.45 * Math.sin(p.tw))
        ctx.beginPath()
        ctx.fillStyle = `rgba(${p.hue},${alpha.toFixed(3)})`
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    const loop = () => {
      if (running) draw(true)
      raf = requestAnimationFrame(loop)
    }
    const onVis = () => {
      running = !document.hidden
    }

    resize()
    window.addEventListener('resize', resize)
    document.addEventListener('visibilitychange', onVis)
    if (!reducedMotion) raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [reducedMotion])

  return (
    <div className="bg" ref={ref} aria-hidden="true" style={{ '--smoke-img': `url(${ASSETS.smoke})` }}>
      <div className="bg__base" />
      <div className="bg__keylight" />
      <div className="bg__smoke bg__smoke--1" />
      <div className="bg__smoke bg__smoke--2" />
      <div className="bg__smoke bg__smoke--3" />
      <canvas className="bg__particles" ref={canvasRef} />
      <div className="bg__vignette" />
      <div className="bg__grain" />
    </div>
  )
})

export default Background
