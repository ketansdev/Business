import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { ServiceCards } from "@/sections/services/ServiceCards";
import { Process } from "@/sections/process/Process";
import { FinalCTA } from "@/sections/cta/FinalCTA";
import { PreviewNotice } from "@/components/ui/DraftBadge";
import { getServices } from "@/data/services";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Homestead Interiors services — architectural planning, interior designing and villa projects.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  const services = getServices(site.contentPreview);
  const hasDrafts = services.some((s) => s.status === "draft");

  return (
    <>
      <PageHeader
        eyebrow="Services"
        title={["Our", <em key="e" className="text-sage-deep">services.</em>]}
        intro="Architectural planning, interior designing and complete villa projects — each shaped around your vision, requirements and lifestyle."
      />
      <section className="pb-[var(--section-y)]">
        <div className="container-x">
          {hasDrafts && (
            <div className="mb-12">
              <PreviewNotice>
                Services marked “Draft” are awaiting confirmation from the studio and are hidden automatically in
                production. Confirm or edit them in <code className="text-ink">src/data/services.ts</code>.
              </PreviewNotice>
            </div>
          )}
          {services.length > 0 ? (
            <ServiceCards services={services} headingLevel="h2" />
          ) : (
            <p className="font-serif text-2xl italic text-graphite">
              Our service list is being finalised. In the meantime, we&apos;d love to hear about your project.
            </p>
          )}
        </div>
      </section>
      <Process />
      <FinalCTA />
    </>
  );
}
