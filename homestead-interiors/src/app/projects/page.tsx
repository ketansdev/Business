import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { PreviewNotice } from "@/components/ui/DraftBadge";
import { ProjectGrid } from "@/sections/projects/ProjectGrid";
import { FinalCTA } from "@/sections/cta/FinalCTA";
import { getProjects } from "@/data/projects";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Projects",
  description: "Explore interiors by Homestead Interiors — residential, living spaces, bedrooms, kitchens and commercial work.",
  alternates: { canonical: "/projects" },
};

export default function ProjectsPage() {
  const projects = getProjects(site.contentPreview);
  const hasSamples = projects.some((p) => p.isSample);

  return (
    <>
      <PageHeader
        eyebrow="Projects"
        title={["Spaces,", <em key="e" className="text-sage-deep">thoughtfully made.</em>]}
        intro="A selection of residential and commercial interiors, each shaped around the people who live and work in them."
      />
      <section className="pb-[var(--section-y)]">
        <div className="container-x">
          {hasSamples && (
            <div className="mb-14">
              <PreviewNotice>
                Portfolio preview: every project shown is an illustrative sample concept with sample imagery — not a
                completed Homestead Interiors project. Replace with real work in{" "}
                <code className="text-ink">src/data/projects.ts</code>.
              </PreviewNotice>
            </div>
          )}
          {projects.length > 0 ? (
            <ProjectGrid projects={projects} />
          ) : (
            <p className="py-24 font-serif text-3xl italic text-graphite">
              Our portfolio is being photographed. Please check back soon — or get in touch to see recent work.
            </p>
          )}
        </div>
      </section>
      <FinalCTA />
    </>
  );
}
