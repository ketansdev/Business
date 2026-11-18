import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { WhatsAppIcon } from './ui/WhatsAppIcon'
import { CONTACT } from '../lib/site'
import { INTRO_DELAY } from '../lib/intro'

/** Bottom-right band the button occupies (px), used to avoid covering key UI. */
const ZONE = 104

/**
 * Floating WhatsApp shortcut. It steps aside whenever an element marked
 * `data-fab-avoid` (hero explore panel, contact options, footer bar with its
 * back-to-top button) passes under its corner, so it never covers them.
 */
export default function FloatingWhatsApp() {
  const [ready, setReady] = useState(false)
  const [blocked, setBlocked] = useState(false)

  useEffect(() => {
    const id = window.setTimeout(() => setReady(true), (INTRO_DELAY + 1.2) * 1000)
    return () => window.clearTimeout(id)
  }, [])

  useEffect(() => {
    let raf = 0
    const check = () => {
      raf = 0
      const vw = window.innerWidth
      const vh = window.innerHeight
      let hit = false
      for (const el of document.querySelectorAll<HTMLElement>('[data-fab-avoid]')) {
        const cs = getComputedStyle(el)
        if (cs.visibility === 'hidden' || parseFloat(cs.opacity) < 0.05) continue
        const r = el.getBoundingClientRect()
        if (r.bottom > vh - ZONE && r.top < vh - 8 && r.right > vw - ZONE && r.left < vw - 8) {
          hit = true
          break
        }
      }
      setBlocked(hit)
    }
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(check)
    }
    check()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <AnimatePresence>
      {ready && !blocked && (
        <motion.a
          key="whatsapp-fab"
          href={CONTACT.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat with us on WhatsApp (opens in a new tab)"
          className="group fixed right-[max(16px,env(safe-area-inset-right))] bottom-[max(18px,calc(env(safe-area-inset-bottom)+12px))] z-40 grid size-14 place-items-center rounded-full bg-lime text-lime-ink shadow-[0_14px_36px_-10px_rgba(198,255,77,0.6),0_0_0_1px_rgba(198,255,77,0.35)] transition-shadow duration-300 hover:shadow-[0_18px_44px_-8px_rgba(198,255,77,0.75),0_0_0_1px_rgba(198,255,77,0.6)] sm:right-7 sm:bottom-7"
          initial={{ opacity: 0, scale: 0.6, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.7, y: 10 }}
          whileHover={{ scale: 1.07 }}
          whileTap={{ scale: 0.94 }}
          transition={{ type: 'spring', stiffness: 380, damping: 26 }}
        >
          {/* soft lime glow */}
          <span aria-hidden className="absolute -inset-2 -z-10 rounded-full bg-lime/30 opacity-70 blur-xl" />
          <WhatsAppIcon className="size-[26px]" />
          <span
            aria-hidden
            className="glass pointer-events-none absolute top-1/2 right-full mr-3 -translate-y-1/2 translate-x-1 rounded-full px-3.5 py-2 text-[13px] font-medium whitespace-nowrap text-fg opacity-0 shadow-[0_12px_30px_-14px_rgba(0,0,0,0.9)] transition-[opacity,translate] duration-300 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100"
          >
            Chat with us
          </span>
        </motion.a>
      )}
    </AnimatePresence>
  )
}
