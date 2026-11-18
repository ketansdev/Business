/**
 * One shared, mutable pointer state for the WebGL scenes (read inside
 * useFrame — never triggers React renders). Normalised to −1..1.
 */
export const pointer = { x: 0, y: 0, active: false }

let bound = false
export function bindPointer() {
  if (bound || typeof window === 'undefined') return
  bound = true
  window.addEventListener(
    'pointermove',
    (e) => {
      if (e.pointerType !== 'mouse' && e.pointerType !== 'pen') return
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1
      pointer.y = -((e.clientY / window.innerHeight) * 2 - 1)
      pointer.active = true
    },
    { passive: true },
  )
}
