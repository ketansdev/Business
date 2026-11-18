/** Runtime environment checks + QA flags (?reducedMotion=1, ?webgl=0, ?intro=0). */
const params = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '')

export const FORCE_REDUCED = params.get('reducedMotion') === '1'
export const FORCE_NO_WEBGL = params.get('webgl') === '0'
export const SKIP_INTRO = params.get('intro') === '0'

const mq = (q: string) => typeof window !== 'undefined' && window.matchMedia(q).matches

export const prefersReducedMotion = () => FORCE_REDUCED || mq('(prefers-reduced-motion: reduce)')
export const isFinePointer = () => mq('(hover: hover) and (pointer: fine)')

let webglCache: boolean | null = null
/** One-time WebGL probe; the probe context is released immediately. */
export function hasWebGL(): boolean {
  if (FORCE_NO_WEBGL) return false
  if (webglCache !== null) return webglCache
  try {
    const canvas = document.createElement('canvas')
    const gl = (canvas.getContext('webgl2') || canvas.getContext('webgl')) as WebGLRenderingContext | null
    webglCache = !!gl
    gl?.getExtension('WEBGL_lose_context')?.loseContext()
  } catch {
    webglCache = false
  }
  return webglCache
}

/** Coarse device tier for 3D quality decisions. */
export function deviceTier(): 'high' | 'low' {
  if (typeof window === 'undefined') return 'low'
  const cores = navigator.hardwareConcurrency ?? 4
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8
  return window.innerWidth >= 1024 && cores >= 4 && memory >= 4 ? 'high' : 'low'
}
