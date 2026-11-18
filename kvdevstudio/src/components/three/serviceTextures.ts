import * as THREE from 'three'

/* Procedural canvas textures for the hero's service objects (no downloads).
   Abstract UI only: bars, blocks and icons, no fake copy or statistics. */

const LIME = '#c6ff4d'

function canvas(w: number, h: number) {
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  const ctx = c.getContext('2d')!
  return { c, ctx }
}

function rr(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}

function bar(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, color: string) {
  ctx.fillStyle = color
  rr(ctx, x, y, w, h, h / 2)
  ctx.fill()
}

function finish(c: HTMLCanvasElement, anisotropy = 8) {
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = anisotropy
  tex.needsUpdate = true
  return tex
}

/** A tall miniature website; the browser object scrolls it via texture offset. */
export function createSiteTexture() {
  const W = 512
  const H = 1024
  const { c, ctx } = canvas(W, H)
  ctx.fillStyle = '#0c0e12'
  ctx.fillRect(0, 0, W, H)

  // Nav
  ctx.fillStyle = LIME
  rr(ctx, 28, 26, 18, 18, 5)
  ctx.fill()
  ;[300, 344, 388].forEach((x) => bar(ctx, x, 32, 32, 6, 'rgba(255,255,255,0.28)'))
  bar(ctx, 436, 26, 50, 18, 'rgba(198,255,77,0.9)')

  // Hero
  bar(ctx, 28, 84, 360, 24, 'rgba(245,245,245,0.92)')
  bar(ctx, 28, 118, 250, 24, 'rgba(245,245,245,0.92)')
  bar(ctx, 28, 160, 300, 8, 'rgba(255,255,255,0.24)')
  bar(ctx, 28, 174, 220, 8, 'rgba(255,255,255,0.24)')
  bar(ctx, 28, 200, 112, 30, LIME)
  ctx.strokeStyle = 'rgba(255,255,255,0.22)'
  ctx.lineWidth = 2
  rr(ctx, 150, 200, 96, 30, 15)
  ctx.stroke()

  // Image block
  const g = ctx.createLinearGradient(28, 256, 484, 430)
  g.addColorStop(0, '#222934')
  g.addColorStop(1, '#0f1216')
  ctx.fillStyle = g
  rr(ctx, 28, 256, 456, 176, 16)
  ctx.fill()
  const sun = ctx.createRadialGradient(392, 312, 4, 400, 318, 34)
  sun.addColorStop(0, '#effcc8')
  sun.addColorStop(0.45, LIME)
  sun.addColorStop(1, 'rgba(198,255,77,0)')
  ctx.fillStyle = sun
  ctx.beginPath()
  ctx.arc(400, 318, 34, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = '#0b0d10'
  ctx.beginPath()
  ctx.moveTo(28, 432)
  ctx.lineTo(150, 352)
  ctx.lineTo(236, 400)
  ctx.lineTo(330, 340)
  ctx.lineTo(484, 420)
  ctx.lineTo(484, 432)
  ctx.closePath()
  ctx.fill()

  // Cards
  ;[28, 184, 340].forEach((x, i) => {
    ctx.fillStyle = '#14171c'
    rr(ctx, x, 460, 144, 112, 12)
    ctx.fill()
    ctx.strokeStyle = 'rgba(255,255,255,0.07)'
    ctx.stroke()
    ctx.fillStyle = i === 1 ? LIME : 'rgba(255,255,255,0.25)'
    rr(ctx, x + 16, 476, 22, 22, 6)
    ctx.fill()
    bar(ctx, x + 16, 516, 100, 7, 'rgba(255,255,255,0.32)')
    bar(ctx, x + 16, 532, 70, 7, 'rgba(255,255,255,0.18)')
  })

  // Section two
  bar(ctx, 28, 612, 230, 18, 'rgba(245,245,245,0.85)')
  bar(ctx, 28, 642, 300, 7, 'rgba(255,255,255,0.22)')
  const tiles: Array<[number, number, string, string]> = [
    [28, 672, '#2b3240', '#12151a'],
    [262, 672, '#3c4a1c', '#13170c'],
    [28, 810, '#1d2129', '#3a4150'],
    [262, 810, '#262b33', '#101216'],
  ]
  tiles.forEach(([x, y, a, b]) => {
    const tg = ctx.createLinearGradient(x, y, x + 222, y + 124)
    tg.addColorStop(0, a)
    tg.addColorStop(1, b)
    ctx.fillStyle = tg
    rr(ctx, x, y, 222, 124, 14)
    ctx.fill()
  })

  // Footer
  ctx.fillStyle = 'rgba(255,255,255,0.06)'
  ctx.fillRect(28, 956, 456, 1)
  bar(ctx, 28, 976, 90, 10, LIME)
  ;[320, 380, 440].forEach((x) => bar(ctx, x, 978, 44, 6, 'rgba(255,255,255,0.22)'))

  const tex = finish(c)
  tex.wrapS = THREE.ClampToEdgeWrapping
  tex.wrapT = THREE.ClampToEdgeWrapping
  return tex
}

/** Dark street map for the pin's plate (cylinder cap UVs map the circle). */
export function createMapTexture() {
  const S = 512
  const { c, ctx } = canvas(S, S)
  ctx.fillStyle = '#0e1014'
  ctx.fillRect(0, 0, S, S)
  ctx.strokeStyle = 'rgba(255,255,255,0.05)'
  ctx.lineWidth = 1
  for (let i = 0; i <= S; i += 32) {
    ctx.beginPath()
    ctx.moveTo(i, 0)
    ctx.lineTo(i, S)
    ctx.moveTo(0, i)
    ctx.lineTo(S, i)
    ctx.stroke()
  }
  const blocks: Array<[number, number, number, number]> = [
    [70, 60, 120, 80],
    [320, 54, 120, 92],
    [56, 316, 132, 120],
    [330, 312, 120, 130],
    [214, 360, 70, 90],
  ]
  ctx.fillStyle = '#161a21'
  blocks.forEach(([x, y, w, h]) => {
    rr(ctx, x, y, w, h, 10)
    ctx.fill()
  })
  ctx.fillStyle = 'rgba(198,255,77,0.12)'
  rr(ctx, 214, 66, 80, 110, 12)
  ctx.fill()
  ctx.strokeStyle = '#262b34'
  ctx.lineWidth = 22
  ctx.beginPath()
  ctx.moveTo(0, 256)
  ctx.lineTo(S, 256)
  ctx.moveTo(256, 0)
  ctx.lineTo(256, S)
  ctx.stroke()
  ctx.strokeStyle = '#1d2128'
  ctx.lineWidth = 10
  ctx.beginPath()
  ctx.moveTo(0, 176)
  ctx.bezierCurveTo(150, 200, 330, 140, S, 206)
  ctx.stroke()
  ctx.setLineDash([12, 12])
  ctx.strokeStyle = 'rgba(198,255,77,0.75)'
  ctx.lineWidth = 4
  ctx.beginPath()
  ctx.moveTo(256, 256)
  ctx.lineTo(420, 420)
  ctx.stroke()
  ctx.setLineDash([])
  ctx.fillStyle = '#f5f5f5'
  ctx.beginPath()
  ctx.arc(420, 420, 8, 0, Math.PI * 2)
  ctx.fill()
  return finish(c)
}

/** Social post card face (transparent outside the rounded card). */
export function createPostTexture(variant: 0 | 1 | 2) {
  const W = 384
  const H = 512
  const { c, ctx } = canvas(W, H)
  ctx.clearRect(0, 0, W, H)
  ctx.fillStyle = '#111418'
  rr(ctx, 0, 0, W, H, 30)
  ctx.fill()

  // Header: story ring avatar + handle
  ctx.lineWidth = 4
  ctx.strokeStyle = LIME
  ctx.beginPath()
  ctx.arc(40, 40, 16, 0, Math.PI * 2)
  ctx.stroke()
  ctx.fillStyle = '#2a2f37'
  ctx.beginPath()
  ctx.arc(40, 40, 11, 0, Math.PI * 2)
  ctx.fill()
  bar(ctx, 66, 30, 110, 9, 'rgba(255,255,255,0.6)')
  bar(ctx, 66, 46, 70, 7, 'rgba(255,255,255,0.22)')

  // Artwork
  const x = 18
  const y = 72
  const w = W - 36
  const h = W - 36
  ctx.save()
  rr(ctx, x, y, w, h, 20)
  ctx.clip()
  if (variant === 0) {
    const g = ctx.createRadialGradient(x + w * 0.32, y + h * 0.3, 6, x + w * 0.4, y + h * 0.4, w * 0.8)
    g.addColorStop(0, '#effcc8')
    g.addColorStop(0.2, LIME)
    g.addColorStop(0.55, '#4a6413')
    g.addColorStop(1, '#10140a')
    ctx.fillStyle = g
  } else if (variant === 1) {
    const g = ctx.createLinearGradient(x, y, x + w, y + h)
    g.addColorStop(0, '#3a4250')
    g.addColorStop(1, '#13161b')
    ctx.fillStyle = g
  } else {
    const g = ctx.createLinearGradient(x + w, y, x, y + h)
    g.addColorStop(0, '#2b3038')
    g.addColorStop(0.5, '#4b5361')
    g.addColorStop(1, '#16191e')
    ctx.fillStyle = g
  }
  ctx.fillRect(x, y, w, h)
  ctx.fillStyle = 'rgba(255,255,255,0.08)'
  ctx.beginPath()
  ctx.arc(x + w * 0.72, y + h * 0.68, w * 0.26, 0, Math.PI * 2)
  ctx.fill()
  bar(ctx, x + w * 0.18, y + h * 0.8, w * 0.64, 6, 'rgba(255,255,255,0.45)')
  ctx.restore()

  // Actions: heart, comment, send, bookmark
  const iy = y + h + 26
  ctx.lineWidth = 3.5
  ctx.strokeStyle = 'rgba(255,255,255,0.75)'
  ctx.fillStyle = variant === 0 ? LIME : 'transparent'
  heart(ctx, 34, iy, 11, variant === 0)
  ctx.beginPath()
  ctx.arc(80, iy, 10, 0, Math.PI * 2)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(108, iy - 9)
  ctx.lineTo(130, iy)
  ctx.lineTo(108, iy + 9)
  ctx.closePath()
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(W - 42, iy - 11)
  ctx.lineTo(W - 26, iy - 11)
  ctx.lineTo(W - 26, iy + 11)
  ctx.lineTo(W - 34, iy + 5)
  ctx.lineTo(W - 42, iy + 11)
  ctx.closePath()
  ctx.stroke()
  return finish(c, 4)
}

function heart(ctx: CanvasRenderingContext2D, cx: number, cy: number, s: number, fill: boolean) {
  ctx.beginPath()
  ctx.moveTo(cx, cy + s * 0.9)
  ctx.bezierCurveTo(cx - s * 1.6, cy - s * 0.2, cx - s * 0.7, cy - s * 1.3, cx, cy - s * 0.45)
  ctx.bezierCurveTo(cx + s * 0.7, cy - s * 1.3, cx + s * 1.6, cy - s * 0.2, cx, cy + s * 0.9)
  ctx.closePath()
  if (fill) {
    ctx.fillStyle = LIME
    ctx.fill()
  } else ctx.stroke()
}
