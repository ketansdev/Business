import { useRef, type PointerEvent as ReactPointerEvent, type ReactNode } from 'react'
import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { isFinePointer, prefersReducedMotion } from '../../lib/env'
import { cn } from '../../lib/cn'

/**
 * Card with a subtle 3D tilt toward the cursor, a soft lime glare that follows
 * it, and --px/--py (−1..1) exposed for parallax layers inside.
 */
export function TiltCard({ children, className, max = 6 }: { children: ReactNode; className?: string; max?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const px = useMotionValue(0)
  const py = useMotionValue(0)
  const sx = useSpring(px, { stiffness: 160, damping: 20, mass: 0.6 })
  const sy = useSpring(py, { stiffness: 160, damping: 20, mass: 0.6 })
  const rotateY = useTransform(sx, (v) => v * max)
  const rotateX = useTransform(sy, (v) => -v * max)
  const glareX = useTransform(sx, (v) => `${50 + v * 50}%`)
  const glareY = useTransform(sy, (v) => `${50 + v * 50}%`)
  const glare = useMotionTemplate`radial-gradient(420px circle at ${glareX} ${glareY}, rgba(198,255,77,0.09), transparent 60%)`

  const onMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse' || !isFinePointer() || prefersReducedMotion()) return
    const r = ref.current!.getBoundingClientRect()
    px.set(((e.clientX - r.left) / r.width) * 2 - 1)
    py.set(((e.clientY - r.top) / r.height) * 2 - 1)
  }
  const onLeave = () => {
    px.set(0)
    py.set(0)
  }

  return (
    <motion.div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={{ rotateX, rotateY, transformPerspective: 1400, '--px': sx, '--py': sy } as never}
      className={cn('relative will-change-transform', className)}
    >
      {children}
      <motion.div aria-hidden className="pointer-events-none absolute inset-0 rounded-[inherit]" style={{ background: glare }} />
    </motion.div>
  )
}
