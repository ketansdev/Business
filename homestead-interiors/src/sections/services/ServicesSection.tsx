import { getServices } from "@/data/services";
import { site } from "@/lib/site";
import { Eyebrow, Lines } from "@/components/ui/Lines";
import { ButtonLink } from "@/components/ui/Button";
import { ServiceCards } from "./ServiceCards";

/** Our Services — the client's three services as photo cards, on light grey. */
export function ServicesSection() {
  const services = getServices(site.contentPreview);
  if (services.length === 0) return null;

  return (
    <section id="services" aria-labelledby="services-title" className="ambient section-y scroll-mt-[var(--header-h)] bg-mist">
      <div className="container-x">
        <div className="mb-16 grid gap-10 lg:mb-24 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <Eyebrow className="mb-10">Our services</Eyebrow>
            <Lines
              id="services-title"
              className="display-lg"
              lines={[
                "From plan",
                <>
                  to <em className="text-sage-deep">finished space.</em>
                </>,
              ]}
            />
          </div>
          <div data-reveal className="flex flex-col justify-end gap-8 lg:col-span-4 lg:col-start-9">
            <p className="text-graphite">
              Architecture, interiors and complete villas — planned, designed and delivered by one team.
            </p>
            <ButtonLink href="/services" variant="outline">
              Explore services
            </ButtonLink>
          </div>
        </div>
        <ServiceCards services={services} />
      </div>
    </section>
  );
}
