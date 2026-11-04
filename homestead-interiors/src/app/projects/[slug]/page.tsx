import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { getAdjacentProjects, getProject, getProjects } from "@/data/projects";
import { getProjectGallery } from "@/data/gallery";
import { kindLabel } from "@/lib/media";
import { PhotoCarousel } from "@/components/gallery/PhotoCarousel";
import { VideoFrame } from "@/components/gallery/VideoFrame";
import { site } from "@/lib/site";
import { pad } from "@/lib/utils";
import { ArtImage } from "@/components/ui/ArtImage";
import { Eyebrow, Lines } from "@/components/ui/Lines";
import { DraftBadge } from "@/components/ui/DraftBadge";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getProjects(site.contentPreview).map((p) => ({ slug: p.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug, site.contentPreview);
  if (!project) return {};
  return {
    title: project.title,
    description: project.description,
    alternates: { canonical: `/projects/${project.slug}` },
    // Sample concepts should not be indexed as real work.
    robots: project.isSample ? { index: false, follow: true } : undefined,
    openGraph: { title: project.title, description: project.description, type: "article" },
  };
}

export default async function ProjectPage({ params }: Params) {
  const { slug } = await params;
  const project = getProject(slug, site.contentPreview);
  if (!project) notFound();
  const { next, related } = getAdjacentProjects(project.slug, site.contentPreview);
  // Each photo appears once on this page: cover in the header, the first
  // gallery photo beside the concept, and the rest in the carousel.
  const [lead] = project.gallery;
  const rest = getProjectGallery(project.slug, site.contentPreview).filter(
    (i) => i.src !== project.cover.src && i.src !== lead?.src,
  );
  const coverLabel = kindLabel(project.cover.kind);

  return (
    <article>
      {/* 1 — Header: title first, then the cover photo shown whole */}
      <header className="ambient overflow-hidden bg-paper pb-[calc(var(--section-y)*0.6)] pt-[calc(var(--header-h)+clamp(3rem,7vw,6rem))]">
        <div className="container-x">
          <p data-reveal className="eyebrow mb-8 flex flex-wrap items-center gap-3 text-graphite">
            <Link href="/projects" className="rounded-full border border-line bg-paper px-3.5 py-1.5 text-ink transition-colors hover:border-sage hover:bg-sage-soft">
              Projects
            </Link>
            <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-sage" />
            <span className="text-sage-deep">{project.category}</span>
            {project.isSample && <DraftBadge>Sample concept</DraftBadge>}
          </p>
          <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
            <Lines as="h1" className="display-xl lg:col-span-8" lines={[project.title]} />
            <p data-reveal className="lede lg:col-span-4">
              {project.description}
            </p>
          </div>
          <ArtImage
            src={project.cover.src}
            alt={project.cover.alt}
            kind={project.cover.kind}
            priority
            reveal
            maxHeight="82svh"
            align="center"
            className="mt-12 md:mt-16"
            sizes="(min-width: 1280px) 1200px, 100vw"
          />
          {coverLabel && <p className="mt-3 text-center text-sm text-graphite">{coverLabel} — not a photograph of a finished space.</p>}
        </div>
      </header>

      {project.isSample && (
        <div className="container-x pt-6">
          <p className="rounded-2xl border border-champagne/40 bg-champagne-soft/70 px-5 py-4 text-sm text-ink/80">
            This page is an illustrative sample concept using sample imagery. It is not a completed Homestead Interiors
            project.
          </p>
        </div>
      )}

      {/* 2 — Introduction + details */}
      <section className="section-y">
        <div className="container-x grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Eyebrow className="mb-10">The project</Eyebrow>
            <p data-reveal className="display-sm">
              {project.introduction}
            </p>
          </div>
          <dl data-reveal-stagger className="self-end rounded-[var(--radius-card)] bg-mist p-3 lg:col-span-4 lg:col-start-9">
            {[
              { label: "Category", value: project.category },
              ...(project.location ? [{ label: "Location", value: project.location }] : []),
              ...project.details,
            ].map((d) => (
              <div key={d.label} data-reveal-item className="flex justify-between gap-6 rounded-xl px-4 py-3.5 transition-colors duration-500 hover:bg-paper">
                <dt className="eyebrow pt-1 text-sage-deep">{d.label}</dt>
                <dd className="text-right">{d.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* 3 — Design concept */}
      <section className="ambient section-y bg-mist">
        <div className="container-x grid items-center gap-12 lg:grid-cols-12">
          {lead && (
            <ArtImage
              src={lead.src}
              alt={lead.alt}
              kind={lead.kind}
              reveal
              parallax={0.08}
              maxHeight="80svh"
              className="lg:col-span-6"
              sizes="(min-width: 1024px) 50vw, 100vw"
            />
          )}
          <div className="flex flex-col justify-center lg:col-span-5 lg:col-start-8">
            <Eyebrow className="mb-10">Design concept</Eyebrow>
            <Lines className="display-md" lines={[project.concept.heading]} />
            <p data-reveal className="lede mt-8">
              {project.concept.body}
            </p>
          </div>
        </div>
      </section>

      {/* 4 — Walkthrough video */}
      {project.video && (
        <section aria-label="Walkthrough video" className={rest.length > 0 ? "pt-[var(--section-y)]" : "py-[var(--section-y)]"}>
          <div className="container-x flex justify-center" data-reveal>
            <VideoFrame
              src={project.video.src}
              poster={project.video.poster}
              caption={project.video.caption}
              width={project.video.width}
              height={project.video.height}
              maxHeight="78svh"
            />
          </div>
        </section>
      )}

      {/* 5 — Photography: the project's remaining photos (carousel + lightbox) */}
      {rest.length > 0 && (
        <section aria-labelledby="photos-title" className="overflow-hidden py-[var(--section-y)]">
          <div className="container-x mb-10 flex items-end justify-between gap-6">
            <div>
              <Eyebrow className="mb-6">Photography</Eyebrow>
              <h2 id="photos-title" className="display-md">
                {rest.length === 1 ? "One more view" : `${rest.length} more views`}
              </h2>
            </div>
            <p className="hidden max-w-xs text-sm text-graphite sm:block">Drag or use the arrows. Tap any image to view it full screen.</p>
          </div>
          <div data-reveal>
            <PhotoCarousel items={rest} label={`${project.title} photography`} />
          </div>
        </section>
      )}

      {/* 6 — Materials */}
      <section className="section-y bg-mist">
        <div className="container-x grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Eyebrow className="mb-10">
              Material palette
            </Eyebrow>
            <Lines className="display-md" lines={["Chosen for", <em key="e" className="text-sage-deep">touch and time.</em>]} />
          </div>
          <ul data-reveal-stagger className="space-y-3 lg:col-span-7 lg:col-start-6">
            {project.materials.map((mat, i) => (
              <li key={mat.name} data-reveal-item className="card grid grid-cols-12 items-center gap-4 px-6 py-6">
                <span
                  aria-hidden
                  className={`col-span-2 h-10 w-10 rounded-full ring-4 ring-paper ${["bg-sage", "bg-haze", "bg-champagne", "bg-cloud"][i % 4]}`}
                />
                <span className="col-span-10 font-serif text-2xl font-medium tracking-[-0.015em] sm:col-span-5">{mat.name}</span>
                <span className="col-span-10 col-start-3 text-graphite sm:col-span-5">{mat.note}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 6 — Final imagery */}
      {project.finalImages.map((img) => (
        <section key={img.src} aria-label="Final imagery" className="container-x pt-[var(--section-y)]">
          <ArtImage src={img.src} alt={img.alt} kind={img.kind} reveal maxHeight="85svh" align="center" sizes="100vw" />
        </section>
      ))}

      {/* 7 — Related projects */}
      {related.length > 0 && (
        <section aria-labelledby="related-title" className="section-y">
          <div className="container-x">
            <div className="mb-16 flex items-end justify-between gap-6">
              <h2 id="related-title" className="display-md">
                Related projects
              </h2>
              <Link href="/projects" className="eyebrow hidden rounded-full border border-line px-5 py-3 text-ink transition-colors hover:border-sage hover:bg-sage-soft sm:inline-block">
                All projects
              </Link>
            </div>
            {/* Text-only link cards: each project's photos live on its own page,
                so they aren't repeated here. */}
            <div data-reveal-stagger className="grid gap-4 md:grid-cols-2">
              {related.map((p, i) => (
                <Link
                  key={p.slug}
                  href={`/projects/${p.slug}`}
                  data-reveal-item
                  className="card group flex items-center justify-between gap-6 p-7 sm:p-9"
                >
                  <span>
                    <span className="eyebrow flex items-center gap-2.5 text-graphite">
                      <span className="text-sage-deep">{pad(i + 1)}</span>
                      <span className="rounded-full bg-sage-soft px-3 py-1 !tracking-[0.14em] text-sage-deep">{p.category}</span>
                    </span>
                    <span className="mt-4 block font-serif text-[clamp(1.5rem,2.4vw,2.2rem)] font-medium leading-tight tracking-[-0.02em] transition-[transform,color] duration-700 ease-out-soft group-hover:translate-x-1.5 group-hover:text-sage-deep">
                      {p.title}
                    </span>
                    <span className="mt-2 block max-w-md text-graphite">{p.description}</span>
                  </span>
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-cloud text-ink transition-colors duration-500 group-hover:bg-sage">
                    <ArrowUpRight aria-hidden strokeWidth={1.5} className="h-5 w-5" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 8 — Next project */}
      {next && next.slug !== project.slug && (
        <Link
          href={`/projects/${next.slug}`}
          className="group relative isolate m-2 flex min-h-[56svh] items-center overflow-hidden rounded-[2rem] bg-mist text-ink sm:m-3"
          aria-label={`Next project: ${next.title}`}
        >

          <div aria-hidden className="absolute -right-24 -top-24 h-[28rem] w-[28rem] rounded-full bg-haze/35 blur-3xl transition-transform duration-[1800ms] ease-out-soft group-hover:scale-110" />
          <div aria-hidden className="absolute -bottom-32 -left-16 h-[26rem] w-[26rem] rounded-full bg-sage/25 blur-3xl transition-transform duration-[1800ms] ease-out-soft group-hover:scale-110" />
          <div className="container-x relative z-10 text-center">
            <p className="eyebrow mb-8 text-sage-deep">Next project · {next.category}</p>
            <p className="display-xl transition-transform duration-1000 ease-out-soft group-hover:-translate-y-2">{next.title}</p>
            <span className="eyebrow mt-10 inline-flex items-center gap-3 rounded-full bg-ink px-6 py-3.5 text-paper transition-colors duration-500 group-hover:bg-sage group-hover:text-ink">
              View project <ArrowUpRight aria-hidden strokeWidth={1.25} className="h-4 w-4" />
            </span>
          </div>
        </Link>
      )}
    </article>
  );
}
