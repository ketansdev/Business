import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { LogoMark } from './Logo'
import { SHOW_INTRO, markIntroSeen } from '../lib/intro'
import { EASE_OUT } from '../lib/motion'

/** Page-load intro: mark + progress hairline, then the curtain lifts (once per session). */
export default function IntroCurtain() {
  const [visible, setVisible] = useState(SHOW_INTRO)

  useEffect(() => {
    if (!SHOW_INTRO) return
    markIntroSeen()
    const id = window.setTimeout(() => setVisible(false), 1050)
    return () => window.clearTimeout(id)
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="intro"
          aria-hidden
          className="fixed inset-0 z-[120] flex items-center justify-center bg-ink"
          initial={{ clipPath: 'inset(0% 0% 0% 0%)' }}
          exit={{ clipPath: 'inset(0% 0% 100% 0%)' }}
          transition={{ duration: 0.85, ease: [0.76, 0, 0.24, 1] }}
        >
          <motion.div
            className="flex flex-col items-center gap-6"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }}
            transition={{ duration: 0.6, ease: EASE_OUT }}
          >
            <div className="flex items-center gap-3">
              <LogoMark className="size-10" />
              <span className="font-display text-xl font-semibold tracking-[-0.03em]">
                KV DEV<span className="ml-1.5 font-normal text-muted">Studio</span>
              </span>
            </div>
            <div className="h-px w-40 overflow-hidden bg-white/10">
              <motion.div
                className="h-full origin-left bg-lime"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.9, ease: [0.65, 0, 0.35, 1] }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
