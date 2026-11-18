import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, Plus, ArrowRight } from '@phosphor-icons/react';
import SectionHeading from '../ui/SectionHeading';
import { Stagger, StaggerItem, ease } from '../ui/Reveal';
import { services } from '../../data/services';

// Desktop: two wide cards, then three. Tablet: pairs, with the last card full width.
const layout = (i, total) =>
  `${i < 2 ? 'lg:col-span-3' : 'lg:col-span-2'} ${i === total - 1 && total % 2 === 1 ? 'md:col-span-2' : ''}`;

function ServiceCard({ service, index, total, onEnquire }) {
  const [open, setOpen] = useState(false);
  const { icon: Icon, title, description, includes, id } = service;
  const panelId = `service-${id}-details`;

  return (
    <StaggerItem
      as="article"
      className={`${layout(index, total)} group flex flex-col rounded-3xl bg-paper-raised p-8 shadow-card transition-[box-shadow,transform] duration-500 ease-base hover:-translate-y-1 hover:shadow-lift sm:p-10`}
    >
      <div className="flex items-start justify-between">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-ink text-paper transition-[background-color,transform] duration-500 ease-base group-hover:-rotate-6 group-hover:bg-accent">
          <Icon size={28} aria-hidden="true" />
        </span>
        <span className="caption-3 text-ink/30">0{index + 1}</span>
      </div>

      <h3 className="heading-5 mt-10">{title}</h3>
      <p className="body-3 mt-3 max-w-md text-ink-muted">{description}</p>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={panelId}
            key="details"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease }}
          >
            <p className="caption-3 mt-6 uppercase tracking-widest text-ink-muted">What&rsquo;s included</p>
            <ul className="mt-3 grid gap-3 sm:grid-cols-2">
              {includes.map((item) => (
                <li key={item} className="body-6 flex items-start gap-2 text-ink-soft">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent-ink">
                    <Check size={12} weight="bold" aria-hidden="true" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <a
              href="#contact"
              onClick={() => onEnquire(title)}
              className="button-sm mt-6 inline-flex items-center gap-2 rounded-lg bg-ink px-3 py-2 text-paper transition-colors duration-300 hover:bg-night-3 active:scale-[0.98]"
            >
              Enquire about this service <ArrowRight size={16} aria-hidden="true" />
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-auto pt-8">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls={panelId}
          className="button-md -ml-2 inline-flex items-center gap-2 rounded-lg px-2 py-1 text-ink transition-colors duration-300 hover:bg-ink/5 active:scale-[0.98]"
        >
          {open ? 'Show less' : 'Learn More'}
          <span className="sr-only"> about {title}</span>
          <Plus
            size={16}
            weight="bold"
            aria-hidden="true"
            className={`transition-transform duration-500 ease-base ${open ? 'rotate-45' : ''}`}
          />
        </button>
      </div>
    </StaggerItem>
  );
}

export default function Services({ onEnquire }) {
  return (
    <section id="services" aria-labelledby="services-title" className="bg-paper-sunken py-20 sm:py-24">
      <div className="container-x">
        <SectionHeading
          id="services-title"
          eyebrow="Services"
          title="What We Do"
          description="Five focused services that work together to give your business a confident, consistent presence online."
        />
        <Stagger stagger={0.1} className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-6">
          {services.map((s, i) => (
            <ServiceCard key={s.id} service={s} index={i} total={services.length} onEnquire={onEnquire} />
          ))}
        </Stagger>
      </div>
    </section>
  );
}
