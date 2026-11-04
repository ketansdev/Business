"use client";

import { useRef, type FormEvent, type MouseEvent, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronDown } from "lucide-react";
import { contactSchema, projectTypes, type ContactInput } from "@/lib/contact-schema";
import { whatsappEnquiryUrl } from "@/lib/enquiry-message";
import { site } from "@/lib/site";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { cn } from "@/lib/utils";

const field =
  "peer w-full rounded-xl border border-transparent bg-mist px-4 py-3.5 text-base text-ink placeholder:text-graphite/70 transition-[background-color,border-color,box-shadow] duration-300 hover:border-line focus:border-sage focus:bg-paper focus:shadow-[0_0_0_4px_rgb(145_165_139/0.18)] focus:outline-none aria-[invalid=true]:border-red-700/60 aria-[invalid=true]:bg-red-50/60";

function Field({
  id,
  label,
  error,
  optional,
  className,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  optional?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("flex flex-col", className)}>
      <label htmlFor={id} className="eyebrow mb-2.5 text-ink/80">
        {label}
        {optional && <span className="ml-2 font-medium normal-case tracking-normal text-graphite">(optional)</span>}
      </label>
      {children}
      <p id={`${id}-error`} role={error ? "alert" : undefined} className="mt-1.5 min-h-[1.25rem] text-sm text-red-700">
        {error}
      </p>
    </div>
  );
}

/**
 * Consultation enquiry form → WhatsApp.
 *
 * The button is a real link (<a target="_blank">) whose address always carries
 * the current form contents, URL-encoded. Clicking it validates first: if a
 * required field is missing or invalid the link is cancelled and the inline
 * messages appear; otherwise WhatsApp opens (the app on phones) with the
 * message ready, and the visitor presses Send there. A real link — rather
 * than window.open() — is what browsers, pop-up blockers and embedded
 * previews all let through.
 */
export function ContactForm() {
  const link = useRef<HTMLAnchorElement>(null);
  const {
    register,
    getValues,
    trigger,
    setFocus,
    formState: { errors },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    mode: "onBlur",
    defaultValues: { budget: "" },
  });

  /** Keep the link's address in step with what's typed. */
  const refreshLink = () => {
    if (link.current) link.current.href = whatsappEnquiryUrl(getValues());
  };

  const onWhatsAppClick = (e: MouseEvent<HTMLAnchorElement>) => {
    const parsed = contactSchema.safeParse(getValues());
    if (!parsed.success) {
      e.preventDefault(); // don't open WhatsApp with missing details
      void trigger(undefined, { shouldFocus: true });
      const first = Object.keys(parsed.error.flatten().fieldErrors)[0] as keyof ContactInput | undefined;
      if (first) setFocus(first);
      return;
    }
    e.currentTarget.href = whatsappEnquiryUrl(parsed.data); // freshest values, then the browser follows the link
  };

  const aria = (name: keyof ContactInput) => ({
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": `${String(name)}-error`,
  });

  return (
    <form
      noValidate
      onInput={refreshLink}
      onChange={refreshLink}
      onSubmit={(e: FormEvent<HTMLFormElement>) => e.preventDefault()}
      className="relative grid gap-x-6 gap-y-3 sm:grid-cols-2"
    >
      <Field id="name" label="Full name" error={errors.name?.message}>
        <input id="name" autoComplete="name" className={field} {...aria("name")} {...register("name")} />
      </Field>
      <Field id="email" label="Email" error={errors.email?.message}>
        <input id="email" type="email" autoComplete="email" className={field} {...aria("email")} {...register("email")} />
      </Field>
      <Field id="phone" label="Phone number" error={errors.phone?.message}>
        <input id="phone" type="tel" autoComplete="tel" className={field} {...aria("phone")} {...register("phone")} />
      </Field>
      <Field id="projectType" label="Project type" error={errors.projectType?.message}>
        <div className="relative">
          <select id="projectType" defaultValue="" className={cn(field, "cursor-pointer appearance-none")} {...aria("projectType")} {...register("projectType")}>
          <option value="" disabled>
            Select…
          </option>
          {projectTypes.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
          <ChevronDown aria-hidden strokeWidth={1.5} className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-graphite" />
        </div>
      </Field>
      <Field id="location" label="Project location" error={errors.location?.message}>
        <input id="location" autoComplete="address-level2" placeholder="City / area" className={field} {...aria("location")} {...register("location")} />
      </Field>
      <Field id="budget" label="Approximate budget" optional error={errors.budget?.message}>
        <input id="budget" placeholder="A rough range is helpful" className={field} {...aria("budget")} {...register("budget")} />
      </Field>
      <Field id="message" label="Tell us about your project" error={errors.message?.message} className="sm:col-span-2">
        <textarea
          id="message"
          rows={5}
          placeholder="The space, how you use it, what you'd love it to feel like…"
          className={cn(field, "resize-y")}
          {...aria("message")}
          {...register("message")}
        />
      </Field>

      <div className="flex flex-col gap-5 sm:col-span-2">
        <a
          ref={link}
          href={site.whatsapp.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onWhatsAppClick}
          className="group relative isolate inline-flex w-full items-center justify-center gap-3 overflow-hidden rounded-full bg-[#25D366] px-6 py-[1.1rem] text-ink transition-[transform,box-shadow] duration-500 ease-out-soft hover:-translate-y-0.5 hover:shadow-[0_14px_30px_-12px_rgb(37_211_102/0.7)] focus-visible:outline-offset-4 active:scale-[0.98] sm:w-auto sm:min-w-[22rem] sm:self-start"
        >
          <span aria-hidden className="absolute inset-0 -z-10 origin-bottom scale-y-0 rounded-full bg-[#1EBE5A] transition-transform duration-700 ease-out-soft group-hover:scale-y-100" />
          <WhatsAppIcon className="h-5 w-5 shrink-0 transition-transform duration-500 group-hover:scale-110" />
          <span className="eyebrow !tracking-[0.14em]">Send Enquiry on WhatsApp</span>
          <span className="sr-only">(opens WhatsApp in a new tab)</span>
        </a>
        <p className="text-xs leading-relaxed text-graphite">
          Your details are used only to respond to your enquiry. WhatsApp opens with your message ready — just review it
          and press Send.
        </p>
      </div>
    </form>
  );
}
