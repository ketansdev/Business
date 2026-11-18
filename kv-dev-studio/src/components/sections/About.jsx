import { Sparkle, TrendUp, SealCheck, ArrowRight } from '@phosphor-icons/react';
import { Reveal, Stagger, StaggerItem } from '../ui/Reveal';

const highlights = [
  {
    icon: Sparkle,
    title: 'Creative & Modern Approach',
    text: 'Fresh, contemporary design that makes your business look as good as it is.',
  },
  {
    icon: TrendUp,
    title: 'Business-Focused Solutions',
    text: 'Every design decision is tied to a goal: more enquiries, more visibility and more trust.',
  },
  {
    icon: SealCheck,
    title: 'Quality-Driven Execution',
    text: 'Careful attention to detail, clean builds and a polished final delivery.',
  },
];

export default function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="py-20 sm:py-24">
      <div className="container-x">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:gap-20">
          <Reveal>
            <p className="eyebrow">About the studio</p>
            <h2 id="about-title" className="heading-3 mt-4 sm:heading-2">
              Creative Thinking.
              <br />
              <span className="text-ink/40">Digital Solutions.</span>
              <br />
              Real <span className="text-accent">Growth.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1} className="lg:pt-12">
            <p className="body-7 text-ink-soft">
              <strong className="font-semibold text-ink">KV DEV STUDIO</strong> is a creative digital studio helping businesses
              establish and grow their online presence. From building professional websites to creating memorable brands, we
              combine creativity, technology and strategy to deliver meaningful digital solutions.
            </p>
            <a href="#services" className="button-md group mt-8 inline-flex items-center gap-2 rounded-lg text-ink">
              See what we do
              <ArrowRight size={18} aria-hidden="true" className="transition-transform duration-500 ease-base group-hover:translate-x-1" />
            </a>
          </Reveal>
        </div>

        <Stagger as="ul" className="mt-16 grid gap-4 md:grid-cols-3">
          {highlights.map(({ icon: Icon, title, text }) => (
            <StaggerItem
              as="li"
              key={title}
              className="group rounded-3xl bg-paper-raised p-8 shadow-card transition-shadow duration-500 ease-base hover:shadow-lift"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-paper-sunken text-ink transition-colors duration-300 group-hover:bg-accent group-hover:text-white">
                <Icon size={24} aria-hidden="true" />
              </span>
              <h3 className="heading-6 mt-8">{title}</h3>
              <p className="body-3 mt-2 text-ink-muted">{text}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
