import Link from "next/link";
import { site } from "@/lib/site";
import { ArrowUpRight } from "lucide-react";

const socialLabels: Record<keyof typeof site.social, string> = {
  instagram: "Instagram",
  pinterest: "Pinterest",
  linkedin: "LinkedIn",
  houzz: "Houzz",
};

/**
 * Footer: a deep-charcoal panel with rounded corners, inset on a light-grey band so
 * the page stays bright to the very end. Only verified contact details are rendered.
 */
export function Footer() {
  const { email, phone, address, hours } = site.contact;
  const socials = (Object.keys(site.social) as (keyof typeof site.social)[])
    .map((key) => ({ key, href: site.social[key] }))
    .filter((s): s is { key: keyof typeof site.social; href: string } => Boolean(s.href));
  const hasContact = Boolean(email || phone || address || hours);

  return (
    <footer className="bg-paper p-3 sm:p-4" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Site footer
      </h2>
      <div className="relative overflow-hidden rounded-[2rem] bg-ink text-paper/80">
      <div aria-hidden className="pointer-events-none absolute -right-40 -top-40 h-[34rem] w-[34rem] rounded-full bg-haze/20 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -bottom-48 -left-32 h-[30rem] w-[30rem] rounded-full bg-sage/15 blur-3xl" />
      <div className="container-x relative pb-10 pt-20 md:pt-28">
        <div data-reveal className="grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <p className="font-serif text-[clamp(2.2rem,4.4vw,4rem)] font-medium leading-[1.04] tracking-[-0.03em] text-paper">
              Spaces that inspire.
              <br />
              <em className="font-normal text-sage">Interiors that feel like home.</em>
            </p>
            <Link
              href="/contact"
              className="group mt-10 inline-flex items-center gap-3 rounded-full bg-sage py-3 pl-6 pr-3 eyebrow !tracking-[0.18em] text-ink transition-[background-color,transform] duration-500 ease-out-soft hover:-translate-y-0.5 hover:bg-paper"
            >
              <span>Start your project</span>
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-ink/10">
                <ArrowUpRight aria-hidden strokeWidth={1.5} className="h-4 w-4 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </span>
            </Link>
          </div>

          <nav aria-label="Footer" className="lg:col-span-2 lg:col-start-8">
            <p className="eyebrow mb-6 text-sage">Explore</p>
            <ul className="space-y-3">
              {site.nav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="link-underline text-paper/80 transition-colors hover:text-paper">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-3">
            <p className="eyebrow mb-6 text-sage">Studio</p>
            {hasContact ? (
              <address className="space-y-3 not-italic text-paper/80">
                {address && <p>{address}</p>}
                {email && (
                  <p>
                    <a href={`mailto:${email}`} className="link-underline hover:text-paper">
                      {email}
                    </a>
                  </p>
                )}
                {phone && (
                  <p>
                    <a href={`tel:${phone.replace(/\s/g, "")}`} className="link-underline hover:text-paper">
                      {phone}
                    </a>
                  </p>
                )}
                {hours && <p className="text-paper/60">{hours}</p>}
              </address>
            ) : (
              <p className="text-paper/70">
                Enquiries are welcome through our{" "}
                <Link href="/contact" className="link-underline text-paper">
                  consultation form
                </Link>
                .
              </p>
            )}
            {socials.length > 0 && (
              <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
                {socials.map((s) => (
                  <li key={s.key}>
                    <a href={s.href} target="_blank" rel="noopener noreferrer" className="eyebrow link-underline text-paper/75 hover:text-paper">
                      {socialLabels[s.key]}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Oversized wordmark */}
        <p
          aria-hidden
          data-reveal
          className="mt-24 select-none whitespace-nowrap text-center font-serif text-[clamp(2.8rem,12.5vw,14rem)] font-medium leading-none tracking-[0.04em] text-paper/[0.06]"
        >
          HOMESTEAD
        </p>

        <div className="mt-6 flex flex-col gap-3 border-t border-paper/10 pt-8 text-xs text-paper/55 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
          <p>Thoughtfully designed spaces, crafted around the way you live.</p>
        </div>
      </div>
      </div>
    </footer>
  );
}
