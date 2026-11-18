import { ArrowUp, EnvelopeSimple, Phone, WhatsappLogo } from '@phosphor-icons/react';
import Logo from '../ui/Logo';
import Button from '../ui/Button';
import { navLinks, site, socialLinks, whatsappLink } from '../../config/site';
import { services } from '../../data/services';

const linkCls = 'body-6 rounded text-paper/60 transition-colors duration-300 hover:text-paper';
const headCls = 'caption-3 uppercase tracking-widest text-paper/40';

export default function Footer() {
  return (
    <footer className="bg-night text-paper" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">Footer</h2>
      <div className="container-x pt-20">
        {/* Final CTA, identical to the hero's primary action */}
        <div className="flex flex-col items-start justify-between gap-8 pb-16 md:flex-row md:items-end">
          <p className="heading-3 max-w-2xl sm:heading-2">
            Have a project in mind? <span className="text-accent">Let&rsquo;s talk.</span>
          </p>
          <Button href="#contact" variant="light" arrow className="shrink-0">
            Let&rsquo;s Work Together
          </Button>
        </div>

        <div className="grid gap-12 border-t border-paper/10 py-16 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1.3fr_1.3fr]">
          <div>
            <a href="#home" aria-label="KV DEV STUDIO, back to top" className="inline-block rounded-lg">
              <Logo inverted />
            </a>
            <p className="body-6 mt-6 max-w-xs text-paper/60">{site.description}</p>
            {socialLinks.length > 0 && (
              <ul className="mt-6 flex flex-wrap gap-2">
                {socialLinks.map((s) => (
                  <li key={s.href}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="caption-1 inline-flex rounded-lg px-3 py-2 text-paper/70 ring-1 ring-paper/15 transition-colors duration-300 hover:text-paper hover:ring-paper/40"
                    >
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <nav aria-label="Footer">
            <h3 className={headCls}>Quick links</h3>
            <ul className="mt-6 space-y-3">
              {navLinks.map((l) => (
                <li key={l.href}><a href={l.href} className={linkCls}>{l.label}</a></li>
              ))}
            </ul>
          </nav>

          <div>
            <h3 className={headCls}>Services</h3>
            <ul className="mt-6 space-y-3">
              {services.map((s) => (
                <li key={s.id}><a href="#services" className={linkCls}>{s.title}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className={headCls}>Get in touch</h3>
            <ul className="mt-6 space-y-3">
              <li>
                <a href={`mailto:${site.email}`} className={`${linkCls} inline-flex items-center gap-2 break-all`}>
                  <EnvelopeSimple size={16} aria-hidden="true" className="shrink-0" /> {site.email}
                </a>
              </li>
              <li>
                <a href={site.phoneHref} className={`${linkCls} inline-flex items-center gap-2`}>
                  <Phone size={16} aria-hidden="true" className="shrink-0" /> {site.phoneDisplay}
                </a>
              </li>
              <li>
                <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className={`${linkCls} inline-flex items-center gap-2`}>
                  <WhatsappLogo size={16} aria-hidden="true" className="shrink-0" /> WhatsApp us
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="caption-2 flex flex-col-reverse items-start justify-between gap-4 border-t border-paper/10 py-8 text-paper/50 sm:flex-row sm:items-center">
          <p>© {site.year} KV DEV STUDIO. All Rights Reserved.</p>
          <ul className="flex flex-wrap items-center gap-6">
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
