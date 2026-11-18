import { useReducedMotion as useFramerReducedMotion } from 'framer-motion'
import { FORCE_REDUCED } from '../lib/env'

/** OS preference or the ?reducedMotion=1 QA flag. */
export function usePrefersReducedMotion(): boolean {
  const os = useFramerReducedMotion()
  return FORCE_REDUCED || !!os
}
