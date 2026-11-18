import { Check, ArrowRight } from '@phosphor-icons/react';
import SectionHeading from '../ui/SectionHeading';
import { Reveal, Stagger, StaggerItem } from '../ui/Reveal';
import { services, addOns } from '../../data/services';

/** "Enquire" link with an arrow chip; pre-selects the service in the contact form. */
function EnquireLink({ title, onEnquire, className = '' }) {
  return (
    <a
      href="#contact"
      onClick={() => onEnquire(title)}
      className={`type-ui group/link inline-flex items-center gap-3 rounded-full font-semibold text-ink ${className}`}
    >
      Enquire about this service
      <span className="sr-only">: {title}</span>
      <span
        aria-hidden="true"
        className="flex h-10 w-10 items-center justify-center rounded-full ring-1 ring-inset ring-line/15 transition-colors duration-300 group-hover/link:bg-ink group-hover/link:text-paper group-hover/link:ring-ink"
      >
        <ArrowRight size={16} weight="bold" className="-rotate-45 transition-transform duration-500 ease-base group-hover/link:rotate-0" />
      </span>
    </a>
  );
}

function ServiceCard({ service, index, onEnquire }) {
  const { icon: Icon, title, description, includes } = service;
  return (
    <StaggerItem
      as="article"
      className="card group flex h-full flex-col p-6 transition-[box-shadow,transform] duration-500 ease-base hover:-translate-y-1 hover:shadow-card-hover sm:p-8 lg:p-10"
    >
      <div className="flex items-start justify-between">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-ink text-paper transition-colors duration-500 ease-base group-hover:bg-accent">
          <Icon size={28} aria-hidden="true" />
        </span>
        <span className="type-label text-ink/30" aria-hidden="true">0{index + 1}</span>
      </div>

      <h3 className="type-h3 mt-8 lg:mt-10">{title}</h3>
      <p className="type-body mt-3 max-w-lg text-ink-muted">{description}</p>

      <ul className="mt-6 grid gap-x-6 gap-y-3 sm:grid-cols-2 md:grid-cols-1 xl:grid-cols-2" aria-label={`Included in ${title}`}>
        {includes.map((item) => (
          <li key={item} className="type-small flex items-start gap-2 text-ink-soft">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent-ink">
              <Check size={12} weight="bold" aria-hidden="true" />
            </span>
            {item}
          </li>
        ))}
      </ul>

      <div className="mt-auto pt-8">
        <div className="border-t border-line/10 pt-6">
          <EnquireLink title={title} onEnquire={onEnquire} />
        </div>
      </div>
    </StaggerItem>
  );
}

function AddOn({ addOn, onEnquire }) {
  const { icon: Icon, title, description, includes } = addOn;
  return (
    <article className="flex flex-col gap-6 rounded-3xl border border-dashed border-line/20 p-6 sm:p-8 lg:px-10 xl:flex-row xl:items-center xl:gap-10">
      <div className="flex items-start gap-4 xl:w-5/12 xl:shrink-0">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-paper-raised text-ink ring-1 ring-line/10">
          <Icon size={24} aria-hidden="true" />
        </span>
        <div>
          <p className="type-label text-accent-ink">Optional add-on</p>
          <h3 className="type-h3 mt-2">{title}</h3>
          <p className="type-small mt-2 text-ink-muted">{description}</p>
        </div>
      </div>
      <ul className="flex flex-1 flex-wrap gap-2" aria-label={`Included in ${title}`}>
        {includes.map((item) => (
          <li key={item} className="type-small rounded-full bg-paper-raised px-3 py-1 text-ink-soft ring-1 ring-line/10 sm:whitespace-nowrap">
            {item}
          </li>
        ))}
      </ul>
      <EnquireLink title={title} onEnquire={onEnquire} className="shrink-0" />
    </article>
  );
}

export default function Services({ onEnquire }) {
  return (
    <section id="services" aria-labelledby="services-title" className="section-y bg-paper-sunken">
      <div className="container-x">
        <SectionHeading
          id="services-title"
          index="02"
          eyebrow="Services"
          title={
            <>
              What We <span className="text-accent">Do</span>
            </>
          }
          description="Four focused services that work together to give your business a confident, consistent presence online."
        />
        <Stagger stagger={0.1} className="mt-12 grid gap-4 md:auto-rows-fr md:grid-cols-2 md:gap-6 lg:mt-16">
          {services.map((s, i) => (
            <ServiceCard key={s.id} service={s} index={i} onEnquire={onEnquire} />
          ))}
        </Stagger>
        {addOns.map((a) => (
          <Reveal key={a.id} className="mt-4 md:mt-6">
            <AddOn addOn={a} onEnquire={onEnquire} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
