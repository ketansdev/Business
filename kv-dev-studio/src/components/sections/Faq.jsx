import { useId, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { WhatsappLogo } from '@phosphor-icons/react';
import SectionHeading from '../ui/SectionHeading';
import Button from '../ui/Button';
import { Reveal, Stagger, StaggerItem, ease } from '../ui/Reveal';
import { faqs } from '../../data/faqs';
import { whatsappLink } from '../../config/site';

/** Plus that becomes a minus: the vertical bar turns flat. */
function PlusMinus({ open }) {
  return (
    <span
      aria-hidden="true"
      className={`relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full ring-1 ring-inset transition-colors duration-300 ${
        open ? 'bg-ink text-paper ring-ink' : 'text-ink ring-line/15 group-hover:ring-line/30'
      }`}
    >
      <span className="absolute h-0.5 w-3.5 rounded-full bg-current" />
      <span className={`absolute h-3.5 w-0.5 rounded-full bg-current transition-transform duration-500 ease-base ${open ? 'rotate-90 scale-y-0' : ''}`} />
    </span>
  );
}

function Item({ q, a, open, onToggle }) {
  const id = useId();
  const reduce = useReducedMotion();
  return (
    <StaggerItem as="li" className="border-b border-line/10">
      <h3>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={`${id}-a`}
          id={`${id}-q`}
          onClick={onToggle}
          className="type-h3 group flex w-full items-center justify-between gap-6 rounded-lg py-6 text-left transition-colors duration-300 hover:text-accent-ink"
        >
          {q}
          <PlusMinus open={open} />
        </button>
      </h3>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="answer"
            id={`${id}-a`}
            role="region"
            aria-labelledby={`${id}-q`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.45, ease }}
            className="overflow-hidden"
          >
            <p className="type-body max-w-2xl pb-6 pr-16 text-ink-muted">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </StaggerItem>
  );
}

/** Accordion: one answer open at a time (the first by default); opening another closes it. */
export default function Faq() {
  const [openIndex, setOpenIndex] = useState(0);
  return (
    <section id="faq" aria-labelledby="faq-title" className="section-y section-screen">
      <div className="container-x grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-28">
            <SectionHeading
              id="faq-title"
              index="06"
              eyebrow="FAQ"
              title={
                <>
                  Questions, <span className="font-medium text-ink/40">answered</span>
                </>
              }
              description="Still unsure about something? Ask us directly on WhatsApp or through the form below."
            />
            <Reveal delay={0.1} className="mt-10">
              <Button href={whatsappLink()} target="_blank" rel="noopener noreferrer" variant="secondary" icon={WhatsappLogo}>
                Ask on WhatsApp
              </Button>
            </Reveal>
          </div>
        </div>
        <Stagger as="ul" stagger={0.06} className="border-t border-line/10 lg:col-span-7">
          {faqs.map((f, i) => (
            <Item key={f.q} q={f.q} a={f.a} open={openIndex === i} onToggle={() => setOpenIndex((cur) => (cur === i ? -1 : i))} />
          ))}
        </Stagger>
      </div>
    </section>
  );
}
