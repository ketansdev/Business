import { useCallback, useRef, type PointerEvent as ReactPointerEvent, type RefObject } from 'react'
import { useMotionValue, useSpring, type MotionValue } from 'framer-motion'
import { isFinePointer, prefersReducedMotion } from '../lib/env'

type Magnetic<T extends HTMLElement> = {
  ref: RefObject<T | null>
  x: MotionValue<number>
  y: MotionValue<number>
  onPointerMove: (e: ReactPointerEvent<T>) => void
  onPointerLeave: () => void
}

/** Subtle magnetic pull toward the cursor (fine pointers only, off under reduced motion). */
export function useMagnetic<T extends HTMLElement>(strength = 0.22): Magnetic<T> {
  const ref = useRef<T>(null)
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const x = useSpring(rawX, { stiffness: 220, damping: 18, mass: 0.6 })
  const y = useSpring(rawY, { stiffness: 220, damping: 18, mass: 0.6 })

  const onPointerMove = useCallback(
    (e: ReactPointerEvent<T>) => {
      const el = ref.current
      if (!el || e.pointerType !== 'mouse' || !isFinePointer() || prefersReducedMotion()) return
      const r = el.getBoundingClientRect()
      rawX.set((e.clientX - (r.left + r.width / 2)) * strength)
      rawY.set((e.clientY - (r.top + r.height / 2)) * strength)
    },
    [rawX, rawY, strength],
  )
  const onPointerLeave = useCallback(() => {
    rawX.set(0)
    rawY.set(0)
  }, [rawX, rawY])

  return { ref, x, y, onPointerMove, onPointerLeave }
}
