import { getFeaturedProjects } from "@/data/projects";
import { site } from "@/lib/site";
import { pad } from "@/lib/utils";
import { Eyebrow, Lines } from "@/components/ui/Lines";
import { ButtonLink } from "@/components/ui/Button";
import { PreviewNotice } from "@/components/ui/DraftBadge";
import { ProjectCard } from "./ProjectCard";

// A side-by-side lead project, then an offset editorial rhythm. Photos keep
// their own proportions, so cards align to the top and heights vary naturally.
const layout = [
  { cls: "md:col-span-12", sizes: "(min-width: 1024px) 58vw, 100vw", variant: "feature" as const },
  { cls: "md:col-span-7", sizes: "(min-width: 768px) 58vw, 100vw" },
  { cls: "md:col-span-5 md:mt-24", sizes: "(min-width: 768px) 42vw, 100vw" },
  { cls: "md:col-span-7 md:col-start-4", sizes: "(min-width: 768px) 58vw, 100vw" },
];

/** Featured projects. */
export function FeaturedProjects() {
  const projects = getFeaturedProjects(site.contentPreview);
  const hasSamples = projects.some((p) => p.isSample);

  return (
    <section id="work" aria-labelledby="work-title" className="section-y scroll-mt-[var(--header-h)] bg-paper">
      <div className="container-x">
        <div className="flex flex-col justify-between gap-10 md:flex-row md:items-end">
          <div>
            <Eyebrow className="mb-10">Selected work</Eyebrow>
            <Lines
              id="work-title"
              className="display-lg"
              lines={[
                "Interiors with",
                <>
                  a <em className="text-sage-deep">quiet</em> presence.
                </>,
              ]}
            />
          </div>
          <div data-reveal className="max-w-sm space-y-8">
            <p className="text-graphite">
              Homes, workplaces, healthcare and education spaces — each shaped around the people who use them.
            </p>
            <ButtonLink href="/projects" variant="outline">
              View all projects
            </ButtonLink>
          </div>
        </div>

        {hasSamples && (
          <div data-reveal className="mt-12">
            <PreviewNotice>
              Portfolio preview: the projects below are illustrative sample concepts, not completed Homestead Interiors
              projects. Replace them with real work in <code className="text-ink">src/data/projects.ts</code>.
            </PreviewNotice>
          </div>
        )}

        {projects.length > 0 ? (
          <div data-reveal-stagger className="mt-16 grid items-start gap-x-10 gap-y-16 md:mt-20 md:grid-cols-12 md:gap-y-20">
            {projects.map((p, i) => (
              <ProjectCard
                key={p.slug}
                project={p}
                index={pad(i + 1)}
                className={layout[i]?.cls}
                sizes={layout[i]?.sizes}
                variant={layout[i]?.variant}
                priority={i === 0}
              />
            ))}
          </div>
        ) : (
          <p className="mt-20 font-serif text-2xl italic text-graphite">New projects are being photographed — please check back soon.</p>
        )}
      </div>
    </section>
  );
}
