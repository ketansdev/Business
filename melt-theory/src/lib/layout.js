import { PRODUCT_RATIO } from './assets'

/**
 * Single source of truth for geometry. Both the GSAP timelines (function-based
 * values, re-read on every ScrollTrigger refresh) and the anatomy labels read
 * from this, so the leader lines always land on their layer.
 *
 * All values are viewport pixels unless noted.
 */
export function computeLayout() {
  const vw = window.innerWidth
  const vh = window.innerHeight
  const wide = vw >= 1024 && vw > vh * 1.15 // side-by-side anatomy layout
  const mobile = vw < 700

  // ---- Hero: product rig size (the rig is the product's native box)
  const tallPhone = mobile && vh / vw > 1.9 // e.g. 375×812, 430×932
  const rigH = mobile
    ? Math.min(vh * 0.5, (vw * (tallPhone ? 0.9 : 0.8)) / PRODUCT_RATIO)
    : Math.min(vh * 0.78, (vw * 0.6) / PRODUCT_RATIO)
  const rigW = rigH * PRODUCT_RATIO
  const heroY = mobile ? -vh * (tallPhone ? 0.04 : 0.075) : vh * 0.025

  // ---- About: exploded stack
  let stackX, stackY, layerH, lineLen, labelRight
  if (wide) {
    layerH = Math.min(vh * 0.212, vw * 0.14)
    stackX = vw * 0.5
    stackY = vh * 0.5
    lineLen = Math.max(56, vw * 0.07)
    labelRight = vw * 0.05
  } else {
    // headline sits on top; stack + labels share the lower ~66% of the screen
    const top = vh * (mobile ? 0.3 : 0.32)
    const avail = vh * 0.95 - top
    layerH = Math.min(avail / 3.9, vw * (mobile ? 0.3 : 0.24))
    stackX = vw * (mobile ? 0.27 : 0.3)
    stackY = top + avail / 2
    lineLen = mobile ? 14 : Math.max(36, vw * 0.05)
    labelRight = mobile ? 16 : vw * 0.06
  }
  const spacing = layerH * (wide ? 0.8 : 0.72)
  const assembledH = layerH * (mobile ? 1.55 : 1.95) // product size right before it separates
  const aboutScale = assembledH / rigH
  const layerScale = layerH / assembledH // relative to the assembled product
  const layerHalfW = layerH * PRODUCT_RATIO * 0.47 // visible half-width of a layer
  const labelX = stackX + layerHalfW + lineLen

  return {
    vw, vh, wide, mobile,
    rigW, rigH, heroY,
    stackX, stackY, layerH, spacing, aboutScale, layerScale,
    layerHalfW, lineLen, labelX,
    labelW: Math.max(140, vw - labelX - labelRight),
    // rig transform targets (rig is centred in the viewport by default)
    aboutX: stackX - vw / 2,
    aboutY: stackY - vh / 2,
    /** viewport-space y offset of a slot (0..4) from the stack centre */
    slotOffset: (slot) => (slot - 2) * spacing,
    /** same offset expressed in the rig's local (pre-scale) space */
    slotOffsetLocal: (slot) => ((slot - 2) * spacing) / aboutScale,
  }
}
