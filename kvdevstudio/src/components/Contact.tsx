import { useRef, type ComponentType } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowUpRight, Mail, Phone } from 'lucide-react'
import { Button } from './ui/Button'
import { MaskLines, Reveal } from './ui/Reveal'
import { WhatsAppIcon } from './ui/WhatsAppIcon'
import { CONTACT, gmailCompose, mailto, whatsappWithMessage } from '../lib/site'
import { EASE_OUT } from '../lib/motion'

type Option = {
  key: string
  label: string
  value: string
  href: string
  aria: string
  Icon: ComponentType<{ className?: string }>
  external?: boolean
}

const OPTIONS: Option[] = [
  {
    key: 'email',
    label: 'Email',
    value: CONTACT.email,
    href: gmailCompose(),
    aria: `Email us at ${CONTACT.email} in Gmail (opens in a new tab)`,
    Icon: Mail,
    external: true,
  },
  { key: 'call', label: 'Call', value: CONTACT.phoneDisplay, href: CONTACT.phoneHref, aria: `Call us on ${CONTACT.phoneDisplay}`, Icon: Phone },
  {
    key: 'whatsapp',
    label: 'WhatsApp',
    value: CONTACT.phoneDisplay,
    href: whatsappWithMessage(),
    aria: `Chat with us on WhatsApp at ${CONTACT.phoneDisplay} (opens in a new tab)`,
    Icon: WhatsAppIcon,
    external: true,
  },
]

export default function Contact() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const orbY = useTransform(scrollYProgress, [0, 1], ['18%', '-18%'])

  return (
    <section ref={ref} id="contact" aria-labelledby="contact-title" className="relative px-3 py-24 sm:px-5 sm:py-32">
      <div className="relative mx-auto max-w-[1400px] overflow-hidden rounded-[36px] border border-white/[0.08] bg-ink-2 sm:rounded-[48px]">
        {/* Glowing orb: layered gradients drifting slowly, parallax on scroll */}
        <motion.div aria-hidden style={{ y: orbY }} className="pointer-events-none absolute inset-0">
          <div className="absolute top-1/2 left-1/2 aspect-square w-[min(110vw,880px)] -translate-x-1/2 -translate-y-1/2 animate-[orb-drift_26s_ease-in-out_infinite] rounded-full bg-[conic-gradient(from_90deg,rgba(198,255,77,0.0),rgba(198,255,77,0.22),rgba(120,140,170,0.12),rgba(198,255,77,0.0))] opacity-60 blur-[70px]" />
          <div className="absolute top-1/2 left-1/2 aspect-square w-[min(56vw,420px)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_38%_32%,rgba(240,255,210,0.55),rgba(198,255,77,0.28)_28%,rgba(20,26,12,0.0)_68%)] blur-[18px]" />
          <div className="absolute top-1/2 left-1/2 aspect-square w-[min(44vw,330px)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.07]" />
          <div className="absolute top-1/2 left-1/2 aspect-square w-[min(70vw,560px)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.04]" />
        </motion.div>
        <div aria-hidden className="guide-lines pointer-events-none absolute inset-0 opacity-70 [mask-image:radial-gradient(ellipse_at_center,#000_20%,transparent_75%)]" />

        <div className="relative flex flex-col items-center px-6 py-24 text-center sm:py-32 lg:py-40">
          <Reveal y={14}>
            <p className="label flex items-center gap-3">
              <span className="text-lime">(05)</span>
              <span aria-hidden className="h-px w-8 bg-white/20" />
              Contact
            </p>
          </Reveal>

          <MaskLines
            as="h2"
            className="mt-8 font-display text-[clamp(3rem,9.4vw,9.5rem)] leading-[0.9] font-semibold tracking-[-0.055em]"
            lines={[<span id="contact-title">Have a Vision?</span>, <>Let&rsquo;s Build It.</>]}
            stagger={0.12}
          />

          <Reveal delay={0.2}>
            <p className="mt-8 max-w-[26rem] text-[17.5px] leading-[1.6] text-muted">Your next big digital move starts with a conversation.</p>
          </Reveal>

          <Reveal delay={0.3} className="mt-11 flex flex-col items-center">
            <Button href={mailto('New project enquiry — KV DEV Studio')} size="lg">
              Start Your Project
            </Button>
          </Reveal>

          {/* Direct contact options */}
          <motion.ul
            data-fab-avoid
            aria-label="Contact options"
            className="mt-12 grid w-full max-w-[420px] gap-3 lg:max-w-[1000px] lg:grid-cols-[1.3fr_1fr_1fr]"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.4 }}
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.09, delayChildren: 0.35 } } }}
          >
            {OPTIONS.map(({ key, label, value, href, aria, Icon, external }) => (
              <motion.li
                key={key}
                variants={{ hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE_OUT } } }}
              >
                <a
                  href={href}
                  aria-label={aria}
                  {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  className="group flex min-h-[76px] items-center gap-3 rounded-[22px] border border-white/[0.09] bg-ink/60 py-3.5 pr-5 pl-3.5 text-left backdrop-blur-md transition-[border-color,background-color,box-shadow] duration-300 hover:border-lime/40 hover:bg-ink/80 hover:shadow-[0_18px_40px_-24px_rgba(198,255,77,0.45)] active:scale-[0.985]"
                >
                  <span className="grid size-11 shrink-0 place-items-center rounded-full border border-lime/25 bg-lime/[0.08] text-lime transition-colors duration-300 group-hover:border-lime group-hover:bg-lime group-hover:text-lime-ink">
                    <Icon className="size-[19px]" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="label block text-[10px]">{label}</span>
                    <span className="mt-1 block font-display text-[14px] leading-tight font-medium tracking-[-0.015em] [overflow-wrap:anywhere] text-fg sm:text-[15px] lg:text-[15.5px]">
                      {value}
                    </span>
                  </span>
                  <ArrowUpRight
                    aria-hidden
                    className="size-4 shrink-0 text-dim transition-[color,transform] duration-500 ease-out-expo group-hover:rotate-45 group-hover:text-lime"
                  />
                </a>
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </div>
    </section>
  )
}
