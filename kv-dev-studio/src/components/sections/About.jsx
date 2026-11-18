import { Sparkle, TrendUp, SealCheck, ArrowRight } from '@phosphor-icons/react';
import { Reveal, Stagger, StaggerItem } from '../ui/Reveal';
import { Eyebrow } from '../ui/SectionHeading';

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
    <section id="about" aria-labelledby="about-title" className="section-y section-screen">
      <div className="container-x">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end lg:gap-16">
          <Reveal className="lg:col-span-7">
            <Eyebrow index="01">About the studio</Eyebrow>
            <h2 id="about-title" className="type-h2 mt-6">
              Creative Thinking.
              <br />
              <span className="font-medium text-ink/35">Digital Solutions.</span>
              <br />
              Real <span className="text-accent">Growth.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1} className="lg:col-span-5">
            <p className="type-lead max-w-xl text-ink-soft">
              <strong className="font-semibold text-ink">KV DEV STUDIO</strong> is a creative digital studio helping businesses
              establish and grow their online presence. From building professional websites to creating memorable brands, we
              combine creativity, technology and strategy to deliver meaningful digital solutions.
            </p>
            <a href="#services" className="type-ui group mt-8 inline-flex items-center gap-2 rounded-full font-semibold text-ink">
              See what we do
              <ArrowRight size={18} aria-hidden="true" className="transition-transform duration-500 ease-base group-hover:translate-x-1" />
            </a>
          </Reveal>
        </div>

        <Stagger as="ul" className="mt-16 grid gap-4 md:gap-6 lg:mt-20 lg:grid-cols-3">
          {highlights.map(({ icon: Icon, title, text }, i) => (
            <StaggerItem
              as="li"
              key={title}
              className="card group flex flex-col p-8 transition-[box-shadow,transform] duration-500 ease-base hover:-translate-y-1 hover:shadow-card-hover lg:p-10"
            >
              <div className="flex items-start justify-between">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-paper-sunken text-ink transition-colors duration-300 group-hover:bg-accent group-hover:text-white">
                  <Icon size={24} aria-hidden="true" />
                </span>
                <span className="type-label text-ink/30" aria-hidden="true">0{i + 1}</span>
              </div>
              <h3 className="type-h3 mt-10">{title}</h3>
              <p className="type-body mt-3 text-ink-muted">{text}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
