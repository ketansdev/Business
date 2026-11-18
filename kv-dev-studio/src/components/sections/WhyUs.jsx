import { Palette, DeviceMobile, Wallet, Lifebuoy } from '@phosphor-icons/react';
import { Reveal, Stagger, StaggerItem } from '../ui/Reveal';
import { Eyebrow } from '../ui/SectionHeading';
import Button from '../ui/Button';

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

/**
 * Dark chapter of the page: an inset panel (8 to 16px from the screen edge, radius 32 to 40px) that fills the viewport
 * on desktop, so it reads as its own scene between the light sections.
 */
export default function WhyUs() {
  return (
    <section id="why-us" aria-labelledby="why-title" className="px-2 sm:px-3 lg:px-4">
      <div className="section-y section-screen rounded-4xl bg-night text-paper lg:rounded-5xl">
        <div className="container-x grid gap-12 xl:grid-cols-12 xl:items-center xl:gap-16">
          <Reveal className="max-w-2xl xl:col-span-5">
            <Eyebrow index="03" dark>
              Why us
            </Eyebrow>
            <h2 id="why-title" className="type-h2 mt-6">
              Why Businesses Choose <span className="whitespace-nowrap text-accent">KV DEV STUDIO</span>
            </h2>
            <p className="type-lead mt-6 max-w-md text-paper/70">A small, focused studio that treats your business like its own.</p>
            <Button href="#contact" variant="light" arrow className="mt-10">
              Start your project
            </Button>
          </Reveal>

          {/* outer radius 24, 2px gap: inner cells stay square per the nested radius rule */}
          <Stagger as="ul" className="grid gap-0.5 overflow-hidden rounded-3xl bg-paper/10 ring-1 ring-paper/10 sm:grid-cols-2 xl:col-span-7">
            {benefits.map(({ icon: Icon, title, text }) => (
              <StaggerItem as="li" key={title} className="group bg-night p-8 transition-colors duration-300 hover:bg-night-1 lg:p-10">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-paper/5 text-paper ring-1 ring-paper/10 transition-colors duration-300 group-hover:bg-accent group-hover:ring-accent">
                  <Icon size={24} aria-hidden="true" />
                </span>
                <h3 className="type-h3 mt-8">{title}</h3>
                <p className="type-body mt-3 text-paper/70">{text}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  );
}
