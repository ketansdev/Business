import { motion } from 'framer-motion';
import { MagnifyingGlass, Compass, PenNib, Rocket } from '@phosphor-icons/react';
import SectionHeading from '../ui/SectionHeading';
import { Stagger, StaggerItem, ease } from '../ui/Reveal';

const steps = [
  { icon: MagnifyingGlass, title: 'Discover', text: 'Understand your business and goals.' },
  { icon: Compass, title: 'Plan', text: 'Create the right strategy and direction.' },
  { icon: PenNib, title: 'Create', text: 'Design, develop and refine.' },
  { icon: Rocket, title: 'Launch', text: 'Deliver and support your digital presence.' },
];

const track = { duration: 1.6, ease, delay: 0.2 };
const trackView = { once: true, margin: '0px 0px -20% 0px' };

export default function Process() {
  return (
    <section id="process" aria-labelledby="process-title" className="bg-paper-sunken py-20 sm:py-24">
      <div className="container-x">
        <SectionHeading
          id="process-title"
          eyebrow="Our process"
          title="From Idea to Digital Reality"
          description="A clear, collaborative process so you always know what is happening and what comes next."
          align="center"
        />

        <div className="relative mt-16">
          {/* Desktop horizontal track (scaleX animates transform only) */}
          <div className="absolute left-[12.5%] right-[12.5%] top-7 hidden h-px bg-line/10 lg:block" aria-hidden="true">
            <motion.div className="h-full origin-left bg-accent" initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={trackView} transition={track} />
          </div>
          {/* Mobile vertical track */}
          <div className="absolute bottom-7 left-7 top-7 w-px bg-line/10 lg:hidden" aria-hidden="true">
            <motion.div className="h-full w-full origin-top bg-accent" initial={{ scaleY: 0 }} whileInView={{ scaleY: 1 }} viewport={trackView} transition={track} />
          </div>

          <Stagger as="ol" stagger={0.15} delay={0.15} className="relative grid gap-10 lg:grid-cols-4 lg:gap-6">
            {steps.map(({ icon: Icon, title, text }, i) => (
              <StaggerItem as="li" key={title} className="group flex gap-6 lg:flex-col lg:items-center lg:gap-0 lg:text-center">
                <span className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-paper-raised text-ink shadow-card ring-4 ring-paper-sunken transition-colors duration-300 group-hover:bg-accent group-hover:text-white">
                  <Icon size={24} aria-hidden="true" />
                </span>
                <div className="pt-2 lg:mt-6 lg:pt-0">
                  <p className="caption-3 text-accent-ink">Step 0{i + 1}</p>
                  <h3 className="heading-5 mt-1">{title}</h3>
                  <p className="body-3 mt-2 max-w-60 text-ink-muted lg:mx-auto">{text}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  );
}
