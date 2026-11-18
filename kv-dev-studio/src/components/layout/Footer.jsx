import {
  ArrowUp,
  EnvelopeSimple,
  Phone,
  WhatsappLogo,
  InstagramLogo,
  LinkedinLogo,
  FacebookLogo,
  XLogo,
  BehanceLogo,
  DribbbleLogo,
  YoutubeLogo,
  Globe,
} from '@phosphor-icons/react';
import Logo from '../ui/Logo';
import Button from '../ui/Button';
import { Reveal } from '../ui/Reveal';
import { navLinks, site, socialLinks, whatsappLink } from '../../config/site';
import { services, addOns } from '../../data/services';

const linkCls = 'type-small rounded text-paper/65 transition-colors duration-300 hover:text-paper';
const headCls = 'type-label text-paper/40';

// Icon per social network; anything else falls back to a globe
const socialIcons = { instagram: InstagramLogo, linkedin: LinkedinLogo, facebook: FacebookLogo, x: XLogo, twitter: XLogo, behance: BehanceLogo, dribbble: DribbbleLogo, youtube: YoutubeLogo };

/** Round icon links: the studio's real channels first, then any profiles listed in site.js → socialLinks. */
function SocialRow() {
  const items = [
    { label: 'WhatsApp', href: whatsappLink(), icon: WhatsappLogo, external: true },
    { label: 'Email', href: `mailto:${site.email}`, icon: EnvelopeSimple },
    { label: 'Call', href: site.phoneHref, icon: Phone },
    ...socialLinks.map((s) => ({ ...s, icon: socialIcons[s.label.toLowerCase()] ?? Globe, external: true })),
  ];
  return (
    <ul className="mt-8 flex flex-wrap gap-2" aria-label="Contact and social links">
      {items.map(({ label, href, icon: Icon, external }) => (
        <li key={label}>
          <a
            href={href}
            aria-label={label}
            {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            className="flex h-10 w-10 items-center justify-center rounded-full text-paper/70 ring-1 ring-inset ring-paper/15 transition-colors duration-300 hover:bg-paper hover:text-ink hover:ring-paper"
          >
            <Icon size={18} aria-hidden="true" />
          </a>
        </li>
      ))}
    </ul>
  );
}

export default function Footer() {
  return (
    <footer className="bg-night text-paper" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">Footer</h2>
      <div className="container-x pt-20 lg:pt-24">
        {/* Final CTA, identical to the hero's primary action */}
        <Reveal className="flex flex-col items-start justify-between gap-8 pb-16 md:flex-row md:items-end lg:pb-20">
          <p className="type-h2 max-w-2xl">
            Have a project in mind? <span className="text-accent">Let&rsquo;s talk.</span>
          </p>
          <Button href="#contact" variant="light" arrow className="shrink-0">
            Let&rsquo;s Work Together
          </Button>
        </Reveal>

        <div className="grid gap-12 border-t border-paper/10 py-16 sm:grid-cols-2 xl:grid-cols-12 xl:gap-8">
          <div className="xl:col-span-4">
            <a href="#home" aria-label="KV DEV STUDIO, back to top" className="inline-block rounded-lg">
              <Logo inverted />
            </a>
            <p className="type-small mt-6 max-w-xs text-paper/65">{site.description}</p>
            <SocialRow />
          </div>

          <nav aria-label="Footer" className="xl:col-span-2">
            <h3 className={headCls}>Quick links</h3>
            <ul className="mt-6 space-y-3">
              {navLinks.map((l) => (
                <li key={l.href}><a href={l.href} className={linkCls}>{l.label}</a></li>
              ))}
            </ul>
          </nav>

          <div className="xl:col-span-3">
            <h3 className={headCls}>Services</h3>
            <ul className="mt-6 space-y-3">
              {services.map((s) => (
                <li key={s.id}><a href="#services" className={linkCls}>{s.title}</a></li>
              ))}
              {addOns.map((s) => (
                <li key={s.id}>
                  <a href="#services" className={linkCls}>
                    {s.title} <span className="text-paper/40">(add-on)</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="xl:col-span-3">
            <h3 className={headCls}>Get in touch</h3>
            <ul className="mt-6 space-y-3">
              <li>
                <a href={`mailto:${site.email}`} className={`${linkCls} inline-flex items-center gap-3 [overflow-wrap:anywhere]`}>
                  <EnvelopeSimple size={16} aria-hidden="true" className="shrink-0" /> {site.email}
                </a>
              </li>
              <li>
                <a href={site.phoneHref} className={`${linkCls} inline-flex items-center gap-3`}>
                  <Phone size={16} aria-hidden="true" className="shrink-0" /> {site.phoneDisplay}
                </a>
              </li>
              <li>
                <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className={`${linkCls} inline-flex items-center gap-3`}>
                  <WhatsappLogo size={16} aria-hidden="true" className="shrink-0" /> WhatsApp us
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="type-small flex flex-col-reverse items-start justify-between gap-4 border-t border-paper/10 py-8 text-paper/50 sm:flex-row sm:items-center">
          <p>© {site.year} KV DEV STUDIO. All Rights Reserved.</p>
          <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <li><a href="privacy.html" className="rounded transition-colors duration-300 hover:text-paper">Privacy policy</a></li>
            <li><a href="terms.html" className="rounded transition-colors duration-300 hover:text-paper">Terms of use</a></li>
            <li>
              <a href="#home" className="inline-flex items-center gap-2 rounded transition-colors duration-300 hover:text-paper">
                Back to top <ArrowUp size={14} aria-hidden="true" />
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
