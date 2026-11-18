import { useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { EnvelopeSimple, Phone, ArrowRight, CheckCircle, CaretDown, WhatsappLogo } from '@phosphor-icons/react';
import Button from '../ui/Button';
import { Reveal, ease } from '../ui/Reveal';
import { site, whatsappLink } from '../../config/site';
import { services } from '../../data/services';

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
      <label htmlFor={id} className="title-4 mb-2 flex items-baseline justify-between text-ink">
        {label}
        {optional && <span className="caption-5 text-ink-muted">Optional</span>}
      </label>
      {children}
      {error && (
        <motion.p
          id={`${id}-error`}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease }}
          className="caption-2 mt-2 text-accent-ink"
        >
          {error}
        </motion.p>
      )}
    </div>
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

  const inputProps = (name) => ({
    id: ids[name],
    name,
    value: values[name],
    onChange,
    'aria-invalid': errors[name] ? true : undefined,
    'aria-describedby': errors[name] ? `${ids[name]}-error` : undefined,
    className: `field ${errors[name] ? '!border-accent ring-4 ring-accent/10' : ''}`,
  });

  return (
    <section id="contact" aria-labelledby="contact-title" className="pb-20 sm:pb-24">
      <div className="container-x">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
          {/* Left: pitch + direct contact */}
          <div className="flex flex-col">
            <Reveal>
              <p className="eyebrow">Contact</p>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 id="contact-title" className="heading-3 mt-4 sm:heading-2">
                Ready to Take Your Business <span className="text-accent">Online?</span>
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="body-7 mt-6 max-w-md text-ink-muted">
                Let&rsquo;s create something meaningful for your business. Tell us about your idea and we&rsquo;ll help bring
                it to life.
              </p>
            </Reveal>

            <Reveal delay={0.15} className="mt-10">
              <Button
                href={whatsappLink()}
                target="_blank"
                rel="noopener noreferrer"
                variant="whatsapp"
                icon={WhatsappLogo}
                className="w-full sm:w-auto"
              >
                Chat with us on WhatsApp
              </Button>
            </Reveal>

            <Reveal delay={0.2} className="mt-8 grid gap-3 sm:grid-cols-2 lg:max-w-md lg:grid-cols-1">
              <a
                href={site.phoneHref}
                className="group flex items-center gap-4 rounded-2xl bg-paper-raised p-4 shadow-card transition-shadow duration-500 ease-base hover:shadow-lift"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-paper-sunken transition-colors duration-300 group-hover:bg-ink group-hover:text-paper">
                  <Phone size={20} aria-hidden="true" />
                </span>
                <span className="min-w-0">
                  <span className="caption-3 block uppercase tracking-widest text-ink-muted">Call us</span>
                  <span className="body-1 block truncate">{site.phoneDisplay}</span>
                </span>
              </a>
              <a
                href={`mailto:${site.email}`}
                className="group flex items-center gap-4 rounded-2xl bg-paper-raised p-4 shadow-card transition-shadow duration-500 ease-base hover:shadow-lift"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-paper-sunken transition-colors duration-300 group-hover:bg-ink group-hover:text-paper">
                  <EnvelopeSimple size={20} aria-hidden="true" />
                </span>
                <span className="min-w-0">
                  <span className="caption-3 block uppercase tracking-widest text-ink-muted">Email us</span>
                  <span className="body-1 block truncate">{site.email}</span>
                </span>
              </a>
            </Reveal>
          </div>

          {/* Right: form */}
          <Reveal delay={0.1}>
            <div className="relative rounded-3xl bg-paper-raised p-6 shadow-card sm:p-10">
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
                    <h3 className="heading-5 mt-6">Your enquiry is ready in WhatsApp</h3>
                    <p className="body-3 mt-3 max-w-md text-ink-muted">
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
                    aria-label="Project enquiry form"
                  >
                    <div className="grid gap-6 sm:grid-cols-2">
                      <Field id={ids.name} label="Name" error={errors.name}>
                        <input type="text" autoComplete="name" placeholder="Your full name" {...inputProps('name')} />
                      </Field>
                      <Field id={ids.email} label="Email" error={errors.email}>
                        <input type="email" autoComplete="email" inputMode="email" placeholder="you@company.com" {...inputProps('email')} />
                      </Field>
                      <Field id={ids.phone} label="Phone Number" error={errors.phone} optional>
                        <input type="tel" autoComplete="tel" inputMode="tel" placeholder="+91 98765 43210" {...inputProps('phone')} />
                      </Field>
                      <Field id={ids.service} label="Service Required" error={errors.service}>
                        <div className="relative">
                          <select {...inputProps('service')} className={`${inputProps('service').className} appearance-none pr-10 ${values.service ? '' : 'text-ink-muted/80'}`}>
                            <option value="" disabled>
                              Select a service
                            </option>
                            {services.map((s) => (
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
                            className={`${inputProps('message').className} resize-y`}
                          />
                        </Field>
                      </div>
                    </div>

                    <div className="mt-8 flex flex-col items-stretch gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <p className="caption-2 text-ink-muted sm:max-w-60">
                        Your enquiry opens in WhatsApp, ready to send to {site.phoneDisplay}.
                      </p>
                      <Button type="submit" variant="accent" icon={WhatsappLogo}>
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
