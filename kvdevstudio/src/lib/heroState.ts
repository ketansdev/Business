/**
 * Shared, mutable state for the scroll-driven hero. GSAP ScrollTrigger writes
 * `progress`; the WebGL rig reads it every frame (no React renders). The
 * active service is mirrored to React through a tiny subscription.
 */
import { hasWebGL } from './env'
import { navigateToService } from './serviceNav'

/** The pinned story needs motion allowed and a working WebGL context. */
export const canPinHero = (reduced: boolean) => !reduced && hasWebGL()

export const heroState = {
  /** Raw pinned-scroll progress 0..1 (set by ScrollTrigger). */
  progress: 0,
  /** True while the scroll-driven sequence is enabled (desktop/mobile, not reduced motion). */
  scrollDriven: false,
  /** Service index under the pointer / focus / tap, or -1. */
  active: -1,
}

type Listener = (active: number) => void
const listeners = new Set<Listener>()

export function setActiveService(index: number) {
  if (heroState.active === index) return
  heroState.active = index
  listeners.forEach((l) => l(index))
}

export function subscribeActive(listener: Listener) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

/* -------------------------------------------------------------------------
   Scroll windows — the story, as fractions of the pinned runway
   ------------------------------------------------------------------------- */
export const PHASE = {
  /** 0–20%: idle spin, copy on stage. Copy leaves over this window. */
  copyOut: [0.16, 0.34],
  /** 20–40%: umbrella travels to centre and settles its spin. */
  center: [0.2, 0.42],
  /** Intro rib tags hand over to service labels. */
  tagsOut: [0.18, 0.3],
  labelsIn: [0.3, 0.46],
  /** 40–60%: highlights on the frame, lime nodes glow. */
  glow: [0.4, 0.6],
  /** 60–80%: service objects emerge and travel to their places (staggered). */
  emerge: [0.58, 0.78],
  /** 80–100%: composition lifts away as the Services sheet rises. */
  outro: [0.84, 1],
} as const

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v))
export const smooth = (t: number) => t * t * (3 - 2 * t)
/** Eased 0..1 progress of `p` through the window [a, b]. */
export const win = (p: number, [a, b]: readonly [number, number]) => smooth(clamp01((p - a) / (b - a)))

/* -------------------------------------------------------------------------
   Hover/focus/tap intent with a short grace period, so the pointer can travel
   from a node to the detail panel without the panel collapsing.
   ------------------------------------------------------------------------- */
let releaseTimer = 0
export function holdService(index: number) {
  window.clearTimeout(releaseTimer)
  setActiveService(index)
}
export function keepService() {
  window.clearTimeout(releaseTimer)
}
export function releaseService(delay = 450) {
  window.clearTimeout(releaseTimer)
  releaseTimer = window.setTimeout(() => setActiveService(-1), delay)
}

/** Leave the hero's explore state and travel to that service in the Services section. */
export function goToService(index: number, reduced: boolean) {
  window.clearTimeout(releaseTimer)
  setActiveService(-1)
  navigateToService(index, reduced)
}
