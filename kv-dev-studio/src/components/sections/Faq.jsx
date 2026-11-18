import { useId, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus } from '@phosphor-icons/react';
import SectionHeading from '../ui/SectionHeading';
import { Stagger, StaggerItem, ease } from '../ui/Reveal';
import { faqs } from '../../data/faqs';

function Item({ q, a, defaultOpen }) {
  const [open, setOpen] = useState(defaultOpen);
  const id = useId();
  return (
    <StaggerItem as="li" className="rounded-2xl bg-paper-raised shadow-card">
      <h3>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={`${id}-a`}
          id={`${id}-q`}
          onClick={() => setOpen((v) => !v)}
          className="title-2 flex w-full items-center justify-between gap-6 rounded-2xl p-6 text-left transition-colors duration-300 hover:bg-ink/[0.02]"
        >
          {q}
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-paper-sunken">
            <Plus size={16} weight="bold" aria-hidden="true" className={`transition-transform duration-500 ease-base ${open ? 'rotate-45' : ''}`} />
          </span>
        </button>
      </h3>
      {open && (
        <motion.div
          id={`${id}-a`}
          role="region"
          aria-labelledby={`${id}-q`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease }}
          className="body-3 px-6 pb-6 text-ink-muted"
        >
          {a}
        </motion.div>
      )}
    </StaggerItem>
  );
}

export default function Faq() {
  return (
    <section id="faq" aria-labelledby="faq-title" className="py-20 sm:py-24">
      <div className="container-x grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
        <SectionHeading
          id="faq-title"
          eyebrow="FAQ"
          title="Questions, answered"
          description="Still unsure about something? Ask us directly on WhatsApp or through the form below."
        />
        <Stagger as="ul" stagger={0.06} className="flex flex-col gap-3">
          {faqs.map((f, i) => (
            <Item key={f.q} q={f.q} a={f.a} defaultOpen={i === 0} />
          ))}
        </Stagger>
      </div>
    </section>
  );
}
