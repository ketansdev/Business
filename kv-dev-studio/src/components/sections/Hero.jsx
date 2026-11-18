import { motion } from 'framer-motion';
import { WhatsappLogo } from '@phosphor-icons/react';
import Button from '../ui/Button';
import HeroVisual from './HeroVisual';
import { ease } from '../ui/Reveal';
import { site, whatsappLink } from '../../config/site';

const up = (delay) => ({
  initial: { opacity: 0, y: 32 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, ease, delay },
});

export default function Hero() {
  return (
    <section id="home" aria-labelledby="hero-title" className="relative pb-16 pt-24 lg:pb-24">
      <div className="container-x grid items-center gap-12 sm:pt-8 lg:grid-cols-[1.25fr_1fr] lg:pt-12">
        <div>
          <motion.p {...up(0)} className="eyebrow">
            Creative digital studio
          </motion.p>

          {/* Heading 1 with the light theme text gradient; line break where the thought breaks */}
          <motion.h1
            {...up(0.08)}
            id="hero-title"
            className="heading-3 mt-6 max-w-hero bg-[linear-gradient(90deg,#000000,#666666)] bg-clip-text pb-1 text-transparent md:heading-2 lg:heading-3 xl:heading-2"
          >
            {/* Two lines, broken where the thought breaks. Sizes step so each line fits the 680px cap. */}
            <span className="sm:block">Building Digital Experiences</span>{' '}
            <span className="sm:block">That Grow Your Business.</span>
          </motion.h1>

          <motion.p {...up(0.16)} className="body-7 mt-6 max-w-hero text-ink-muted">
            We help businesses build a strong digital presence through modern websites, strategic branding, local SEO and
            creative social media solutions.
          </motion.p>

          <motion.div {...up(0.24)} className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button href="#contact" arrow>
              Let&rsquo;s Work Together
            </Button>
            <Button href="#services" variant="secondary">
              Explore Our Services
            </Button>
          </motion.div>

          {/* Proof signal: a verifiable fact, not an invented stat */}
          <motion.a
            {...up(0.32)}
            href={whatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="caption-2 group mt-8 inline-flex items-center gap-3 rounded-lg text-ink-muted"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1FAF54]/10 text-[#178F44]">
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
    </section>
  );
}
