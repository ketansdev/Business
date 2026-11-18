import { useEffect } from 'react'

/** Locks page scroll while an overlay is open (keeps the scrollbar gutter stable). */
export function useLockBody(locked: boolean) {
  useEffect(() => {
    if (!locked) return
    const html = document.documentElement
    const gap = window.innerWidth - html.clientWidth
    const prev = { overflow: html.style.overflow, paddingRight: document.body.style.paddingRight }
    html.style.overflow = 'hidden'
    if (gap > 0) document.body.style.paddingRight = `${gap}px`
    return () => {
      html.style.overflow = prev.overflow
      document.body.style.paddingRight = prev.paddingRight
    }
  }, [locked])
}
