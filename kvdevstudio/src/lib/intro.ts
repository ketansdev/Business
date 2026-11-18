import { FORCE_REDUCED, SKIP_INTRO } from './env'

const KEY = 'kv-intro-seen'

function shouldShowIntro() {
  try {
    if (SKIP_INTRO || FORCE_REDUCED) return false
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false
    return sessionStorage.getItem(KEY) !== '1'
  } catch {
    return false
  }
}

/** The page-load curtain plays once per session. */
export const SHOW_INTRO = shouldShowIntro()
/** Seconds the hero choreography waits for the curtain to lift. */
export const INTRO_DELAY = SHOW_INTRO ? 1.35 : 0.15

export function markIntroSeen() {
  try {
    sessionStorage.setItem(KEY, '1')
  } catch {
    /* storage unavailable: the intro simply plays again */
  }
}
