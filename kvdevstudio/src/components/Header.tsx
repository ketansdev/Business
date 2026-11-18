import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { Logo } from './Logo'
import { Button } from './ui/Button'
import { NAV, CONTACT, mailto, type SectionId } from '../lib/site'
import { useActiveSection } from '../hooks/useActiveSection'
import { useLockBody } from '../hooks/useLockBody'
import { EASE_OUT } from '../lib/motion'
import { INTRO_DELAY } from '../lib/intro'
import { cn } from '../lib/cn'

const IDS = NAV.map((n) => n.id) as SectionId[]

export default function Header() {
  const active = useActiveSection(IDS)
  const { scrollY } = useScroll()
  const [compact, setCompact] = useState(false)
  const [open, setOpen] = useState(false)
  const toggleRef = useRef<HTMLButtonElement>(null)

  useMotionValueEvent(scrollY, 'change', (v) => setCompact(v > 48))
  useLockBody(open)

  // Close on Escape and when the viewport grows past the mobile breakpoint.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        toggleRef.current?.focus()
      }
    }
    const mql = window.matchMedia('(min-width: 1024px)')
    const onMql = () => mql.matches && setOpen(false)
    window.addEventListener('keydown', onKey)
    mql.addEventListener('change', onMql)
    return () => {
      window.removeEventListener('keydown', onKey)
      mql.removeEventListener('change', onMql)
    }
  }, [open])

  return (
    <motion.header
      initial={{ y: -28, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1, ease: EASE_OUT, delay: INTRO_DELAY }}
      className={cn(
        'fixed inset-x-0 top-0 z-50 flex justify-center px-3 transition-[padding] duration-500 ease-out-quint sm:px-5',
        compact ? 'pt-2.5' : 'pt-4 sm:pt-5',
      )}
    >
      <nav
        aria-label="Primary"
        className={cn(
          'relative flex w-full max-w-[1160px] items-center justify-between rounded-full border transition-all duration-500 ease-out-quint',
          'backdrop-blur-xl backdrop-saturate-150',
          compact
            ? 'border-white/[0.11] bg-[rgba(16,18,22,0.78)] py-1.5 pr-1.5 pl-3.5 shadow-[0_18px_50px_-18px_rgba(0,0,0,0.8)]'
            : 'border-white/[0.09] bg-[rgba(16,18,22,0.38)] py-2 pr-2 pl-4 sm:py-2.5 sm:pl-5',
        )}
      >
        <a href="#home" aria-label="KV DEV Studio — back to top" className="rounded-full" onClick={() => setOpen(false)}>
          <Logo />
        </a>

        <ul className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-0.5 lg:flex">
          {NAV.map((item) => {
            const isActive = active === item.id
            return (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  aria-current={isActive ? 'location' : undefined}
                  className={cn(
                    'relative block rounded-full px-4 py-2 text-[13.5px] font-medium tracking-[-0.005em] transition-colors duration-300',
                    isActive ? 'text-fg' : 'text-muted hover:text-fg',
                  )}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 rounded-full border border-white/10 bg-white/[0.07]"
                      transition={{ type: 'spring', stiffness: 420, damping: 36 }}
                    />
                  )}
                  <span className="relative">{item.label}</span>
                  {isActive && (
                    <motion.span
                      layoutId="nav-dot"
                      className="absolute -bottom-[3px] left-1/2 size-1 -translate-x-1/2 rounded-full bg-lime"
                      transition={{ type: 'spring', stiffness: 420, damping: 36 }}
                    />
                  )}
                </a>
              </li>
            )
          })}
        </ul>

        <div className="flex items-center gap-2">
          <span className="hidden sm:block">
            <Button href={CONTACT.whatsapp} external size="sm" ariaLabel="Let's talk on WhatsApp (opens in a new tab)">
              Let&rsquo;s Talk
            </Button>
          </span>
          <button
            ref={toggleRef}
            type="button"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
            className="relative grid size-10 place-items-center rounded-full border border-white/10 bg-white/[0.04] transition-colors hover:bg-white/[0.08] lg:hidden"
          >
            <span className="sr-only">Menu</span>
            <motion.span
              aria-hidden
              className="absolute h-[1.5px] w-[18px] rounded-full bg-fg"
              animate={open ? { rotate: 45, y: 0 } : { rotate: 0, y: -4 }}
              transition={{ duration: 0.45, ease: EASE_OUT }}
            />
            <motion.span
              aria-hidden
              className="absolute h-[1.5px] w-[18px] rounded-full bg-fg"
              animate={open ? { rotate: -45, y: 0, width: 18 } : { rotate: 0, y: 4, width: 12 }}
              transition={{ duration: 0.45, ease: EASE_OUT }}
              style={{ originX: 0.5 }}
            />
          </button>
        </div>
      </nav>

      <MobileMenu open={open} active={active} onClose={() => setOpen(false)} />
    </motion.header>
  )
}

function MobileMenu({ open, active, onClose }: { open: boolean; active: SectionId; onClose: () => void }) {
  const firstLink = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    if (open) {
      const id = window.setTimeout(() => firstLink.current?.focus(), 120)
      return () => window.clearTimeout(id)
    }
  }, [open])

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="scrim"
            aria-hidden
            className="fixed inset-0 -z-10 bg-ink/60 backdrop-blur-sm lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            onClick={onClose}
          />
          <motion.div
            key="panel"
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            className="fixed inset-x-3 top-[76px] overflow-hidden rounded-[28px] border border-white/10 bg-[rgba(16,18,22,0.96)] shadow-[0_40px_80px_-30px_rgba(0,0,0,0.9)] backdrop-blur-2xl sm:inset-x-5 lg:hidden"
            initial={{ clipPath: 'inset(0% 0% 100% 0% round 28px)', opacity: 0.6 }}
            animate={{ clipPath: 'inset(0% 0% 0% 0% round 28px)', opacity: 1 }}
            exit={{ clipPath: 'inset(0% 0% 100% 0% round 28px)', opacity: 0.6 }}
            transition={{ duration: 0.65, ease: EASE_OUT }}
          >
            <div aria-hidden className="grid-dots pointer-events-none absolute inset-0 opacity-40" />
            <ul className="relative px-6 pt-6 pb-2">
              {NAV.map((item, i) => (
                <motion.li
                  key={item.id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.6, ease: EASE_OUT, delay: 0.12 + i * 0.05 }}
                  className="border-b border-white/[0.07] last:border-0"
                >
                  <a
                    ref={i === 0 ? firstLink : undefined}
                    href={`#${item.id}`}
                    onClick={onClose}
                    aria-current={active === item.id ? 'location' : undefined}
                    className="group flex items-center justify-between py-4"
                  >
                    <span className="flex items-baseline gap-4">
                      <span className="font-mono text-[11px] tracking-[0.2em] text-dim">0{i + 1}</span>
                      <span
                        className={cn(
                          'font-display text-[clamp(1.9rem,8vw,2.6rem)] leading-none font-medium tracking-[-0.04em] transition-colors',
                          active === item.id ? 'text-lime' : 'text-fg group-hover:text-lime',
                        )}
                      >
                        {item.label}
                      </span>
                    </span>
                    <ArrowUpRight aria-hidden className="size-5 text-dim transition-transform duration-500 ease-out-expo group-hover:rotate-45" />
                  </a>
                </motion.li>
              ))}
            </ul>
            <motion.div
              className="relative flex flex-wrap items-center justify-between gap-4 border-t border-white/[0.07] px-6 py-5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <a href={mailto('New project enquiry')} className="link-underline text-sm text-muted">
                {CONTACT.email}
              </a>
              <Button href={CONTACT.whatsapp} external size="sm" onClick={onClose} ariaLabel="Let's talk on WhatsApp (opens in a new tab)">
                Let&rsquo;s Talk
              </Button>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
