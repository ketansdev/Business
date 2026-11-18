import { motion } from 'framer-motion';
import { WhatsappLogo } from '@phosphor-icons/react';
import Button from '../ui/Button';
import HeroVisual from './HeroVisual';
import { ease } from '../ui/Reveal';
import { site, whatsappLink } from '../../config/site';
import { services } from '../../data/services';

const up = (delay) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease, delay },
});

// From xl the lines break where the thought breaks (the column fits the longest line from 1280px); below that the words flow and balance.
const LINES = [['Building', 'Digital'], ['Experiences', 'That'], [{ w: 'Grow', accent: true }, 'Your', 'Business.']];

/** Each word rises inside its own clip, 50ms apart. Reduced motion: words simply appear. */
function Headline() {
  let n = 0;
  return (
    <h1 id="hero-title" className="type-display mt-6 text-ink">
      {LINES.map((line, li) => (
        <span key={li}>
          {line.map((item) => {
            const { w, accent } = typeof item === 'string' ? { w: item } : item;
            const i = n++;
            return (
              <span key={w}>
                <span className="word-mask">
                  <motion.span
                    className={`inline-block ${accent ? 'text-accent' : ''}`}
                    initial={{ y: '105%' }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.9, ease, delay: 0.15 + i * 0.05 }}
                  >
                    {w}
                  </motion.span>
                </span>{' '}
              </span>
            );
          })}
          {li < LINES.length - 1 && <br className="hidden xl:inline" />}
        </span>
      ))}
    </h1>
  );
}

export default function Hero() {
  return (
    <section id="home" aria-labelledby="hero-title" className="relative flex min-h-svh flex-col pt-28">
      <div className="container-x grid flex-1 items-center gap-12 pb-16 lg:grid-cols-[1.1fr_1fr] xl:grid-cols-[1.25fr_1fr] xl:gap-16">
        <div>
          <motion.p {...up(0)} className="type-small inline-flex items-center gap-2 rounded-full bg-paper-raised px-3 py-1 text-ink-soft ring-1 ring-line/10">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
            Creative digital studio
          </motion.p>

          <Headline />

          <motion.p {...up(0.45)} className="type-lead mt-6 max-w-xl text-ink-muted">
            We help businesses build a strong digital presence through modern websites, strategic branding, local SEO and
            creative social media solutions.
          </motion.p>

          <motion.div {...up(0.55)} className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Button href="#contact" arrow>
              Let&rsquo;s Work Together
            </Button>
            <Button href="#services" variant="secondary">
              Explore Our Services
            </Button>
          </motion.div>

          {/* Proof signal: a verifiable fact, not an invented stat */}
          <motion.a
            {...up(0.65)}
            href={whatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="type-small group mt-8 inline-flex items-center gap-3 rounded-lg text-ink-muted"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#1FAF54]/10 text-[#178F44]">
              <WhatsappLogo size={18} weight="fill" aria-hidden="true" />
            </span>
            <span>
              Talk directly to the team on WhatsApp:{' '}
              <span className="whitespace-nowrap font-semibold text-ink underline decoration-ink/20 underline-offset-4 transition-colors duration-300 group-hover:decoration-ink">
                {site.phoneDisplay}
              </span>
            </span>
          </motion.a>
        </div>

        <HeroVisual />
      </div>

      {/* Quiet strip pinned to the bottom of the first screen: what the studio does, at a glance */}
      <motion.div {...up(0.8)} className="container-x">
        <ul aria-label="Our services" className="grid grid-cols-2 border-t border-line/10 lg:grid-cols-4">
          {services.map(({ id, icon: Icon, title }, i) => (
            <li
              key={id}
              className={`flex items-center gap-3 py-4 lg:py-6 ${i % 2 === 1 ? 'pl-4' : 'pr-4'} ${i > 0 ? 'lg:border-l lg:border-line/10 lg:pl-6' : ''}`}
            >
              <Icon size={20} aria-hidden="true" className="shrink-0 text-accent-ink" />
              <span className="type-small font-medium text-ink-soft">{title}</span>
            </li>
          ))}
        </ul>
      </motion.div>
    </section>
  );
}
