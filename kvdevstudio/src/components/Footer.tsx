import type { ComponentType, ReactNode } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'
import { ArrowUp, Instagram, Mail, MessageCircle, Phone } from 'lucide-react'
import { Logo } from './Logo'
import { Button } from './ui/Button'
import { MaskLines, Reveal } from './ui/Reveal'
import { CONTACT, NAV, SERVICES, mailto } from '../lib/site'

type Connect = { label: string; href: string; aria: string; Icon: ComponentType<{ className?: string }>; external?: boolean }

const CONNECT: Connect[] = [
  { label: 'Instagram', href: CONTACT.instagram, aria: 'KV DEV Studio on Instagram (opens in a new tab)', Icon: Instagram, external: true },
  { label: 'Email', href: mailto(), aria: `Email us at ${CONTACT.email}`, Icon: Mail },
  { label: 'Call Us', href: CONTACT.phoneHref, aria: `Call us on ${CONTACT.phoneDisplay}`, Icon: Phone },
  {
    label: 'WhatsApp',
    href: CONTACT.whatsapp,
    aria: `Chat with us on WhatsApp at ${CONTACT.phoneDisplay} (opens in a new tab)`,
    Icon: MessageCircle,
    external: true,
  },
]

export default function Footer() {
  const { scrollYProgress } = useScroll()
  const ring = useSpring(scrollYProgress, { stiffness: 120, damping: 28 })

  const toTop = () => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches || document.documentElement.hasAttribute('data-reduced')
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' })
  }

  return (
    <footer className="relative overflow-hidden border-t border-white/[0.07] bg-ink pt-24 sm:pt-32">
      <div aria-hidden className="guide-lines pointer-events-none absolute inset-0 opacity-60 [mask-image:linear-gradient(to_bottom,#000,transparent_85%)]" />

      <div className="container-x relative">
        <div className="flex flex-col gap-10 sm:gap-12">
          <MaskLines
            as="p"
            className="font-display text-[clamp(2.6rem,8.6vw,9.25rem)] leading-[0.88] font-semibold tracking-[-0.06em] uppercase"
            lineClassName="md:whitespace-nowrap"
            lines={[
              <>Let&rsquo;s Make</>,
              <>
                Something <span className="text-outline">Great.</span>
              </>,
            ]}
            stagger={0.12}
          />
          <Reveal delay={0.2} className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
            <Button href={mailto('Starting a conversation')} size="lg">
              Start a Conversation
            </Button>
            <p className="max-w-[26rem] text-[15px] leading-relaxed text-balance text-muted sm:text-right">
              Websites, local visibility, social and brand, under one roof.
            </p>
          </Reveal>
        </div>

        <div className="mt-20 grid gap-12 border-t border-white/[0.08] pt-14 sm:grid-cols-2 lg:mt-28 lg:grid-cols-12 lg:gap-8">
          <Reveal className="lg:col-span-4">
            <a href="#home" aria-label="KV DEV Studio — back to top" className="inline-block rounded-full">
              <Logo />
            </a>
            <p className="mt-6 font-display text-[19px] font-medium tracking-[-0.02em] text-fg">Creative Digital Studio.</p>
            <p className="mt-1.5 text-[15px] text-muted">Building meaningful digital experiences.</p>
          </Reveal>

          <FooterColumn title="Navigation" className="lg:col-span-2 lg:col-start-6" delay={0.06}>
            {NAV.map((n) => (
              <li key={n.id}>
                <a href={`#${n.id}`} className="link-underline text-[15px] text-muted transition-colors hover:text-fg">
                  {n.label}
                </a>
              </li>
            ))}
          </FooterColumn>

          <FooterColumn title="Services" className="lg:col-span-3" delay={0.12}>
            {SERVICES.map((s) => (
              <li key={s.index}>
                <a href="#services" className="link-underline text-[15px] text-muted transition-colors hover:text-fg">
                  {s.short}
                </a>
              </li>
            ))}
          </FooterColumn>

          <FooterColumn title="Connect" className="lg:col-span-2" delay={0.18}>
            {CONNECT.map(({ label, href, aria, Icon, external }) => (
              <li key={label}>
                {href ? (
                  <a
                    href={href}
                    aria-label={aria}
                    {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    className="group -my-1 flex min-h-11 items-center gap-3 text-[15px] text-muted transition-colors duration-300 hover:text-fg"
                  >
                    <span className="grid size-8 shrink-0 place-items-center rounded-full border border-white/10 text-lime/80 transition-[background-color,border-color,color,transform] duration-300 group-hover:-translate-y-0.5 group-hover:border-lime group-hover:bg-lime group-hover:text-lime-ink">
                      <Icon aria-hidden className="size-[15px]" />
                    </span>
                    <span className="link-underline">{label}</span>
                  </a>
                ) : (
                  <span className="-my-1 flex min-h-11 items-center gap-3 text-[15px] text-dim" title="Link coming soon">
                    <span className="grid size-8 shrink-0 place-items-center rounded-full border border-white/[0.07] text-dim">
                      <Icon aria-hidden className="size-[15px]" />
                    </span>
                    {label}
                    <span className="rounded-full border border-white/10 px-1.5 py-0.5 font-mono text-[9px] tracking-[0.15em] uppercase">Soon</span>
                  </span>
                )}
              </li>
            ))}
          </FooterColumn>
        </div>

        <div data-fab-avoid className="mt-20 flex flex-col-reverse gap-6 border-t border-white/[0.08] py-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[13.5px] text-dim">© 2026 KV DEV Studio. All rights reserved.</p>
          <div className="flex items-center justify-between gap-8 sm:justify-end">
            <p className="text-[13.5px] text-dim">Designed with creativity. Built with purpose.</p>
            <button
              type="button"
              onClick={toTop}
              aria-label="Back to top"
              className="group relative grid size-12 shrink-0 place-items-center rounded-full border border-white/10 text-fg transition-colors hover:border-lime/50"
            >
              <svg viewBox="0 0 48 48" className="absolute inset-0 -rotate-90" aria-hidden>
                <motion.circle cx="24" cy="24" r="23" fill="none" stroke="#c6ff4d" strokeWidth="1.5" style={{ pathLength: ring }} />
              </svg>
              <ArrowUp aria-hidden className="size-4 transition-transform duration-500 ease-out-expo group-hover:-translate-y-0.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}

function FooterColumn({ title, children, className, delay = 0 }: { title: string; children: ReactNode; className?: string; delay?: number }) {
  return (
    <Reveal className={className} delay={delay}>
      <h3 className="label text-[10.5px]">{title}</h3>
      <ul className="mt-6 space-y-3.5">{children}</ul>
    </Reveal>
  )
}
