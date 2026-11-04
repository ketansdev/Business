import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { ArtImage } from "@/components/ui/ArtImage";
import { ContactForm } from "@/sections/contact/ContactForm";
import { site } from "@/lib/site";
import { placed, placements } from "@/data/placements";

export const metadata: Metadata = {
  title: "Contact",
  description: "Start your project with Homestead Interiors. Share a few details about your space and we'll be in touch.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  const [photo] = placed(placements.contact, site.contentPreview);
  const { email, phone, address, hours } = site.contact;
  const hasDetails = Boolean(email || phone || address || hours);

  return (
    <>
      <PageHeader
        eyebrow="Consultation enquiry"
        title={["Let's create a space", <em key="e" className="text-sage-deep">that feels like you.</em>]}
        intro="Have a vision for your space? Tell us a little about it — we'll be in touch to arrange a conversation."
      />
      <section className="pb-[var(--section-y)]">
        <div className="container-x grid gap-16 lg:grid-cols-12">
          <div data-reveal className="rounded-[2rem] border border-line bg-paper p-6 shadow-[var(--shadow-soft)] sm:p-10 lg:col-span-7">
            <ContactForm />
          </div>

          <aside className="lg:col-span-4 lg:col-start-9" aria-label="Studio details">
            {photo && (
              <ArtImage
                src={photo.src}
                alt={photo.alt}
                kind={photo.kind}
                reveal
                maxHeight="70svh"
                sizes="(min-width: 1024px) 33vw, 100vw"
              />
            )}
            <div data-reveal className="mt-6 space-y-6 rounded-[var(--radius-card)] bg-mist p-7">
              <div>
                <p className="eyebrow mb-3 text-sage-deep">What happens next</p>
                <p className="text-graphite">
                  We review every enquiry personally and reply to arrange an initial conversation about your space, needs
                  and timeline.
                </p>
              </div>
              {hasDetails && (
                <address className="space-y-2 not-italic">
                  <p className="eyebrow mb-3 text-sage-deep">Studio</p>
                  {address && <p>{address}</p>}
                  {email && (
                    <p>
                      <a href={`mailto:${email}`} className="link-underline">
                        {email}
                      </a>
                    </p>
                  )}
                  {phone && (
                    <p>
                      <a href={`tel:${phone.replace(/\s/g, "")}`} className="link-underline">
                        {phone}
                      </a>
                    </p>
                  )}
                  {hours && <p className="text-graphite">{hours}</p>}
                </address>
              )}
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
