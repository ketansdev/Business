import { Palette, DeviceMobile, Wallet, Lifebuoy } from '@phosphor-icons/react';
import { Reveal, Stagger, StaggerItem } from '../ui/Reveal';

const benefits = [
  {
    icon: Palette,
    title: 'Modern & Creative Designs',
    text: 'Distinctive, current visuals made for your brand, never a recycled template.',
  },
  {
    icon: DeviceMobile,
    title: 'Mobile-First Approach',
    text: 'Most customers find you on their phone, so we design for small screens first.',
  },
  {
    icon: Wallet,
    title: 'Affordable Digital Solutions',
    text: 'Clear, practical pricing built around what your business actually needs.',
  },
  {
    icon: Lifebuoy,
    title: 'Dedicated Support',
    text: 'A direct line to the people building your project, before, during and after launch.',
  },
];

export default function WhyUs() {
  return (
    <section id="why-us" aria-labelledby="why-title" className="pb-20 sm:pb-24">
      <div className="container-x">
        <div className="rounded-3xl bg-night px-6 py-16 text-paper sm:px-12 sm:py-20 lg:px-16">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.5fr] lg:gap-16">
            <Reveal>
              <p className="eyebrow !text-paper/60">Why us</p>
              <h2 id="why-title" className="heading-3 mt-4 sm:heading-2">
                Why Businesses Choose <span className="whitespace-nowrap text-accent">KV DEV STUDIO</span>
              </h2>
              <p className="body-3 mt-4 max-w-sm text-paper/60">A small, focused studio that treats your business like its own.</p>
            </Reveal>

            {/* outer radius 24, 2px gap: inner cells stay square per the nested radius rule */}
            <Stagger as="ul" className="grid gap-0.5 overflow-hidden rounded-3xl bg-paper/10 sm:grid-cols-2">
              {benefits.map(({ icon: Icon, title, text }) => (
                <StaggerItem as="li" key={title} className="group bg-night p-8 transition-colors duration-300 hover:bg-night-1">
                  <Icon size={32} weight="light" aria-hidden="true" className="text-paper/80 transition-colors duration-300 group-hover:text-accent" />
                  <h3 className="title-2 mt-6">{title}</h3>
                  <p className="body-6 mt-2 text-paper/60">{text}</p>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </div>
      </div>
    </section>
  );
}
