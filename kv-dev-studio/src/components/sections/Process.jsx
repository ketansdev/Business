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

/**
 * Timeline. Desktop: four columns, numbered 56px indicators on one horizontal line, a card under each.
 * Below lg: a vertical line through 48px indicators on the left, cards to the right.
 * The line draws itself once (scale transform only).
 */
export default function Process() {
  return (
    <section id="process" aria-labelledby="process-title" className="section-y section-screen bg-paper-sunken">
      <div className="container-x">
        <SectionHeading
          id="process-title"
          index="05"
          eyebrow="Our process"
          title={
            <>
              From Idea to <span className="font-medium text-ink/40">Digital Reality</span>
            </>
          }
          description="A clear, collaborative process so you always know what is happening and what comes next."
          align="center"
        />

        <div className="relative mt-16 lg:mt-20">
          {/* Desktop horizontal track, through the indicator centres (column centres at 12.5% and 87.5%) */}
          <div className="absolute left-[12.5%] right-[12.5%] top-7 hidden h-px bg-line/15 lg:block" aria-hidden="true">
            <motion.div className="h-full origin-left bg-accent" initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={trackView} transition={track} />
          </div>
          {/* Mobile vertical track, through the 48px indicators */}
          <div className="absolute bottom-6 left-6 top-6 w-px bg-line/15 lg:hidden" aria-hidden="true">
            <motion.div className="h-full w-full origin-top bg-accent" initial={{ scaleY: 0 }} whileInView={{ scaleY: 1 }} viewport={trackView} transition={track} />
          </div>

          <Stagger as="ol" stagger={0.15} delay={0.15} className="relative grid gap-6 lg:grid-cols-4">
            {steps.map(({ icon: Icon, title, text }, i) => (
              <StaggerItem as="li" key={title} className="group flex gap-4 sm:gap-6 lg:flex-col lg:items-center lg:gap-8">
                <span className="font-display relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-paper-raised text-sm font-bold text-accent-ink shadow-card ring-4 ring-paper-sunken transition-colors duration-300 group-hover:bg-accent group-hover:text-white lg:h-14 lg:w-14 lg:text-base">
                  0{i + 1}
                </span>
                <div className="card flex-1 p-6 transition-[box-shadow,transform] duration-500 ease-base group-hover:-translate-y-1 group-hover:shadow-card-hover lg:w-full lg:p-8 lg:text-center">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-paper-sunken text-ink lg:mx-auto">
                    <Icon size={24} aria-hidden="true" />
                  </span>
                  <h3 className="type-h3 mt-6">{title}</h3>
                  <p className="type-body mt-2 text-ink-muted">{text}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  );
}
