import { useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { EnvelopeSimple, Phone, ArrowRight, CheckCircle, CaretDown, WhatsappLogo, WarningCircle } from '@phosphor-icons/react';
import Button from '../ui/Button';
import { Reveal, ease } from '../ui/Reveal';
import { Eyebrow } from '../ui/SectionHeading';
import { site, whatsappLink } from '../../config/site';
import { allServices } from '../../data/services';

const empty = { name: '', email: '', phone: '', service: '', message: '' };

function validate(v) {
  const e = {};
  if (!v.name.trim()) e.name = 'Please enter your name.';
  if (!v.email.trim()) e.email = 'Please enter your email address.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email.trim())) e.email = 'Please enter a valid email address.';
  if (v.phone.trim() && !/^[+()\-\s\d]{7,}$/.test(v.phone.trim())) e.phone = 'Please enter a valid phone number.';
  if (!v.service) e.service = 'Please choose a service.';
  if (v.message.trim().length < 10) e.message = 'Tell us a little about your project, at least 10 characters.';
  return e;
}

/** WhatsApp message built from the form. *text* renders bold in WhatsApp. */
function composeText(v) {
  return [
    `*New enquiry from the KV DEV STUDIO website*`,
    ``,
    `*Name:* ${v.name.trim()}`,
    `*Email:* ${v.email.trim()}`,
    v.phone.trim() ? `*Phone:* ${v.phone.trim()}` : null,
    `*Service:* ${v.service}`,
    ``,
    `*Message:*`,
    v.message.trim(),
  ]
    .filter((l) => l !== null)
    .join('\n');
}

function Field({ id, label, error, optional, children }) {
  return (
    <div>
      <label htmlFor={id} className="type-small mb-2 flex items-baseline justify-between font-medium text-ink">
        {label}
        {optional && <span className="type-small font-normal text-ink-muted">Optional</span>}
      </label>
      {children}
      {error && (
        <motion.p
          id={`${id}-error`}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease }}
          className="type-small mt-2 flex items-center gap-2 text-accent-ink"
        >
          <WarningCircle size={16} weight="bold" aria-hidden="true" className="shrink-0" />
          {error}
        </motion.p>
      )}
    </div>
  );
}

/** Direct contact card: icon tile, label, value, arrow. */
function ContactCard({ href, icon: Icon, label, value, tone = 'default', external }) {
  const tile = tone === 'whatsapp' ? 'bg-[#1FAF54]/10 text-[#178F44] group-hover:bg-[#1FAF54] group-hover:text-white' : 'bg-paper-sunken text-ink group-hover:bg-ink group-hover:text-paper';
  return (
    <a
      href={href}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className="card group flex items-center gap-4 p-4 transition-[box-shadow,transform] duration-500 ease-base hover:-translate-y-0.5 hover:shadow-card-hover sm:p-5"
    >
      <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition-colors duration-300 ${tile}`}>
        <Icon size={22} aria-hidden="true" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="type-label block text-ink-muted">{label}</span>
        <span className="type-ui mt-1 block truncate font-semibold text-ink">{value}</span>
      </span>
      <ArrowRight size={18} aria-hidden="true" className="shrink-0 -rotate-45 text-ink-muted transition-transform duration-500 ease-base group-hover:rotate-0 group-hover:text-ink" />
    </a>
  );
}

export default function Contact({ selectedService }) {
  const uid = useId();
  const formRef = useRef(null);
  const [values, setValues] = useState(empty);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | sent
  const [sentText, setSentText] = useState('');

  useEffect(() => {
    if (selectedService) {
      setValues((v) => ({ ...v, service: selectedService }));
      setErrors((e) => ({ ...e, service: undefined }));
    }
  }, [selectedService]);

  const ids = Object.fromEntries(Object.keys(empty).map((k) => [k, `${uid}-${k}`]));

  const onChange = (e) => {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: value }));
    if (errors[name]) setErrors((er) => ({ ...er, [name]: undefined }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);
    const firstInvalid = Object.keys(empty).find((k) => found[k]);
    if (firstInvalid) {
      formRef.current?.querySelector(`[name="${firstInvalid}"]`)?.focus();
      return;
    }

    // Hand the enquiry to WhatsApp, pre-filled and addressed to the studio's number.
    // Opened synchronously inside the click so pop-up blockers allow it.
    const text = composeText(values);
    const url = whatsappLink(text);
    setSentText(text);
    const win = window.open(url, '_blank');
    if (win) win.opener = null;
    else window.location.href = url; // pop-up blocked: open in this tab instead
    setStatus('sent');
    setValues(empty);
  };

  const inputProps = (name, extra = '') => ({
    id: ids[name],
    name,
    value: values[name],
    onChange,
    'aria-invalid': errors[name] ? true : undefined,
    'aria-describedby': errors[name] ? `${ids[name]}-error` : undefined,
    className: `field ${extra} ${errors[name] ? '!border-accent-ink ring-4 ring-accent/10' : ''}`,
  });

  return (
    <section id="contact" aria-labelledby="contact-title" className="section-y section-screen">
      <div className="container-x">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Left: pitch + direct contact */}
          <div className="flex flex-col lg:col-span-5">
            <Reveal>
              <Eyebrow index="07">Contact</Eyebrow>
              <h2 id="contact-title" className="type-h2 mt-6">
                Ready to Take Your Business <span className="text-accent">Online?</span>
              </h2>
              <p className="type-lead mt-6 max-w-md text-ink-muted">
                Let&rsquo;s create something meaningful for your business. Tell us about your idea and we&rsquo;ll help bring
                it to life.
              </p>
            </Reveal>

            <Reveal delay={0.1} className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <div className="sm:col-span-2 lg:col-span-1">
                <ContactCard href={whatsappLink()} external icon={WhatsappLogo} tone="whatsapp" label="Chat on WhatsApp" value={site.phoneDisplay} />
              </div>
              <ContactCard href={site.phoneHref} icon={Phone} label="Call us" value={site.phoneDisplay} />
              <ContactCard href={`mailto:${site.email}`} icon={EnvelopeSimple} label="Email us" value={site.email} />
            </Reveal>
          </div>

          {/* Right: form */}
          <Reveal delay={0.1} className="lg:col-span-7">
            <div className="card relative p-6 sm:p-8 lg:p-10">
              <AnimatePresence mode="wait" initial={false}>
                {status === 'sent' ? (
                  <motion.div
                    key="sent"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -16 }}
                    transition={{ duration: 0.5, ease }}
                    className="flex min-h-96 flex-col items-start justify-center"
                    role="status"
                    aria-live="polite"
                  >
                    <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-soft text-accent">
                      <CheckCircle size={28} aria-hidden="true" />
                    </span>
                    <h3 className="type-h3 mt-6">Your enquiry is ready in WhatsApp</h3>
                    <p className="type-body mt-3 max-w-md text-ink-muted">
                      WhatsApp opened with your details filled in. Press send in WhatsApp to reach us. If it did not open, use
                      the button below.
                    </p>
                    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                      <Button
                        href={whatsappLink(sentText)}
                        target="_blank"
                        rel="noopener noreferrer"
                        variant="whatsapp"
                        icon={WhatsappLogo}
                      >
                        Open WhatsApp again
                      </Button>
                      <Button variant="secondary" onClick={() => setStatus('idle')}>
                        Send another enquiry
                      </Button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    ref={formRef}
                    onSubmit={onSubmit}
                    noValidate
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -16 }}
                    transition={{ duration: 0.5, ease }}
                    aria-labelledby={`${uid}-form-title`}
                  >
                    <div className="mb-8 border-b border-line/10 pb-6">
                      <h3 id={`${uid}-form-title`} className="type-h3">Tell us about your project</h3>
                      <p className="type-small mt-1 text-ink-muted">A few details help us reply with the right advice.</p>
                    </div>
                    <div className="grid gap-x-4 gap-y-6 sm:grid-cols-2">
                      <Field id={ids.name} label="Name" error={errors.name}>
                        <input type="text" autoComplete="name" placeholder="Your full name" {...inputProps('name', 'h-12')} />
                      </Field>
                      <Field id={ids.email} label="Email" error={errors.email}>
                        <input type="email" autoComplete="email" inputMode="email" placeholder="you@company.com" {...inputProps('email', 'h-12')} />
                      </Field>
                      <Field id={ids.phone} label="Phone Number" error={errors.phone} optional>
                        <input type="tel" autoComplete="tel" inputMode="tel" placeholder="+91 98765 43210" {...inputProps('phone', 'h-12')} />
                      </Field>
                      <Field id={ids.service} label="Service Required" error={errors.service}>
                        <div className="relative">
                          <select {...inputProps('service', 'h-12')} className={`${inputProps('service', 'h-12').className} appearance-none pr-10 ${values.service ? '' : 'text-ink-muted/80'}`}>
                            <option value="" disabled>
                              Select a service
                            </option>
                            {allServices.map((s) => (
                              <option key={s.id} value={s.title}>
                                {s.title}
                              </option>
                            ))}
                            <option value="Multiple services / Not sure yet">Multiple services / Not sure yet</option>
                          </select>
                          <CaretDown size={16} aria-hidden="true" className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-ink-muted" />
                        </div>
                      </Field>
                      <div className="sm:col-span-2">
                        <Field id={ids.message} label="Message" error={errors.message}>
                          <textarea
                            rows={5}
                            placeholder="Tell us about your business and what you'd like to achieve…"
                            {...inputProps('message')}
                            className={`${inputProps('message', 'py-3').className} min-h-32 resize-y`}
                          />
                        </Field>
                      </div>
                    </div>

                    <div className="mt-8 flex flex-col items-stretch gap-4 border-t border-line/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
                      <p className="type-small text-ink-muted sm:max-w-64">
                        Your enquiry opens in WhatsApp, ready to send to {site.phoneDisplay}.
                      </p>
                      <Button type="submit" variant="accent" icon={WhatsappLogo} className="w-full sm:w-auto">
                        Send enquiry
                      </Button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
