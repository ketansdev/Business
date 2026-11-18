import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Phone, EnvelopeSimple, WhatsappLogo } from '@phosphor-icons/react';
import Logo from '../ui/Logo';
import Button from '../ui/Button';
import useActiveSection from '../../hooks/useActiveSection';
import useInView from '../../hooks/useInView';
import { navLinks, site, whatsappLink } from '../../config/site';
import { ease } from '../ui/Reveal';

const sectionIds = navLinks.map((l) => l.href.slice(1));
// Link entrance: 60ms step, whole sequence capped at 400ms
const stepFor = (n) => Math.min(0.06, 0.4 / n);

/** Two lines that rotate into an X. */
function MenuIcon({ open }) {
  const t = { duration: 0.5, ease };
  return (
    <span className="relative block h-4 w-4" aria-hidden="true">
      <motion.span
        className="absolute left-0 top-1 block h-0.5 w-4 rounded-full bg-current"
        animate={open ? { y: 4, rotate: 45 } : { y: 0, rotate: 0 }}
        transition={t}
      />
      <motion.span
        className="absolute bottom-1 left-0 block h-0.5 w-4 rounded-full bg-current"
        animate={open ? { y: -4, rotate: -45 } : { y: 0, rotate: 0 }}
        transition={t}
      />
    </span>
  );
}

/**
 * Fixed header aligned to the content container: logo left, links centred, CTA right.
 * At the top of the page it is transparent and 80px tall; once the page scrolls it becomes a frosted
 * 64px bar with a hairline edge. The hero reserves enough top padding that it never sits under the bar.
 */
export default function Header() {
  const [open, setOpen] = useState(false);
  const atTop = useInView('top-sentinel');
  const active = useActiveSection(sectionIds);
  const toggleRef = useRef(null);
  const panelRef = useRef(null);
  const solid = !atTop || open;

  // Mobile menu: lock scroll, close on Escape or desktop resize, keep focus inside.
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpen(false);
        toggleRef.current?.focus();
      }
      if (e.key === 'Tab' && panelRef.current) {
        const f = [toggleRef.current, ...panelRef.current.querySelectorAll('a,button')].filter(Boolean);
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    const mq = window.matchMedia('(min-width: 1024px)');
    const onMq = () => mq.matches && setOpen(false);
    window.addEventListener('keydown', onKey);
    mq.addEventListener('change', onMq);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
      mq.removeEventListener('change', onMq);
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      {/* Bar background on its own layer: a backdrop-filter on <header> would trap the fixed mobile panel inside the bar */}
      <div
        aria-hidden="true"
        className={`absolute inset-x-0 top-0 h-full border-b transition-[background-color,border-color,box-shadow] duration-500 ease-base ${
          solid ? 'border-line/10 bg-paper/85 shadow-soft backdrop-blur-xl backdrop-saturate-150' : 'border-transparent bg-transparent'
        }`}
      />
      <a
        href="#main"
        className="button-sm sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-ink focus:px-3 focus:py-2 focus:text-paper"
      >
        Skip to content
      </a>

      <nav
        aria-label="Primary"
        className={`container-x relative z-10 grid grid-cols-[1fr_auto] items-center gap-6 transition-[height] duration-500 ease-base lg:grid-cols-[1fr_auto_1fr] ${
          atTop ? 'h-16 lg:h-20' : 'h-16'
        }`}
      >
        <a href="#home" aria-label="KV DEV STUDIO, back to top" onClick={close} className="justify-self-start rounded-lg">
          <Logo />
        </a>

        <ul className="hidden items-center gap-1 lg:flex">
          {navLinks.map((l) => {
            const isActive = active === l.href.slice(1);
            return (
              <li key={l.href} className="relative">
                {isActive && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-full bg-ink/5"
                    transition={{ duration: 0.5, ease }}
                  />
                )}
                <a
                  href={l.href}
                  aria-current={isActive ? 'location' : undefined}
                  className={`type-ui relative block rounded-full px-4 py-2 transition-colors duration-300 ${
                    isActive ? 'text-ink' : 'text-ink-muted hover:text-ink'
                  }`}
                >
                  {l.label}
                </a>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-2 justify-self-end">
          <Button href="#contact" size="sm" arrow className="hidden sm:inline-flex">
            Let&rsquo;s Talk
          </Button>
          <button
            ref={toggleRef}
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-ink ring-1 ring-inset ring-line/10 transition-colors duration-300 hover:bg-ink/5 active:scale-[0.98] lg:hidden"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            <MenuIcon open={open} />
          </button>
        </div>
      </nav>

      {/* Full height mobile panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            ref={panelRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease }}
            className="fixed inset-0 h-svh overflow-y-auto bg-paper/95 backdrop-blur-2xl lg:hidden"
          >
            <div className="container-x flex min-h-full flex-col pb-8 pt-24">
              <ul className="flex flex-col border-t border-line/10">
                {navLinks.map((l, i) => {
                  const isActive = active === l.href.slice(1);
                  return (
                    <motion.li
                      key={l.href}
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, ease, delay: i * stepFor(navLinks.length) }}
                      className="border-b border-line/10"
                    >
                      <a
                        href={l.href}
                        onClick={close}
                        aria-current={isActive ? 'location' : undefined}
                        className="type-h2 flex items-center justify-between py-4"
                      >
                        <span className={isActive ? 'text-ink' : 'text-ink/55'}>{l.label}</span>
                        {isActive && <span className="h-2 w-2 rounded-full bg-accent" aria-hidden="true" />}
                      </a>
                    </motion.li>
                  );
                })}
              </ul>
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease, delay: 0.3 }}
                className="mt-auto flex flex-col gap-3 pt-10"
              >
                <Button href="#contact" onClick={close} arrow>
                  Let&rsquo;s Work Together
                </Button>
                <Button href={whatsappLink()} target="_blank" rel="noopener noreferrer" variant="whatsapp" icon={WhatsappLogo}>
                  Chat on WhatsApp
                </Button>
                <div className="type-small mt-2 flex flex-wrap justify-center gap-x-6 gap-y-2 text-ink-muted">
                  <a href={site.phoneHref} className="inline-flex items-center gap-2 hover:text-ink"><Phone size={16} aria-hidden="true" />{site.phoneDisplay}</a>
                  <a href={`mailto:${site.email}`} className="inline-flex items-center gap-2 hover:text-ink"><EnvelopeSimple size={16} aria-hidden="true" />{site.email}</a>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
