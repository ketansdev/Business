import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/data/projects";
import { blurProps, frameStyle, kindLabel } from "@/lib/media";
import { cn } from "@/lib/utils";

type Props = {
  project: Project;
  index?: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  /** Tallest the photo may be; taller photos get narrower, never cropped. */
  maxHeight?: string;
  /** "feature" = large side-by-side showcase with the description. */
  variant?: "default" | "feature";
};

/**
 * Project card. The cover photo is shown whole, at its own proportions; on
 * hover the entire frame zooms and lifts, the title slides and a sage
 * "view" button appears. Project name and category sit right under it.
 */
export function ProjectCard({ project, index, className, sizes, priority, maxHeight = "min(78svh, 46rem)", variant = "default" }: Props) {
  const feature = variant === "feature";
  const label = kindLabel(project.cover.kind);
  const imageCount = 1 + project.gallery.length + project.finalImages.length;

  const frame = (
    <div className={cn("flex", feature && "lg:col-span-7")} data-mask>
      <div
        style={frameStyle(project.cover.src, maxHeight)}
        className="relative max-w-full overflow-hidden rounded-[var(--radius-frame)] bg-cloud shadow-[var(--shadow-soft)] transition-[transform,box-shadow] duration-700 ease-out-soft group-hover:scale-[1.03] group-hover:shadow-[var(--shadow-lift)] group-focus-visible:scale-[1.03]"
      >
        <Image
          src={project.cover.src}
          alt={project.cover.alt}
          fill
          priority={priority}
          sizes={sizes ?? "(min-width: 1024px) 50vw, 100vw"}
          {...blurProps(project.cover.src)}
          className="object-cover"
        />
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          {label && (
            <span className="rounded-full bg-paper/90 px-2.5 py-1 text-[0.58rem] font-bold uppercase tracking-[0.18em] text-graphite shadow-[var(--shadow-soft)]">
              {label}
            </span>
          )}
          {project.video && (
            <span className="rounded-full bg-paper/90 px-2.5 py-1 text-[0.58rem] font-bold uppercase tracking-[0.18em] text-graphite shadow-[var(--shadow-soft)]">
              Video
            </span>
          )}
        </div>
        <span
          aria-hidden
          className="absolute bottom-3 right-3 flex h-11 w-11 translate-y-2 items-center justify-center rounded-full bg-sage text-ink opacity-0 shadow-[var(--shadow-soft)] transition-all duration-700 ease-out-soft group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100"
        >
          <ArrowUpRight strokeWidth={1.5} className="h-5 w-5" />
        </span>
      </div>
    </div>
  );

  const meta = (
    <p className="eyebrow flex flex-wrap items-center gap-2.5 text-graphite">
      {index && <span className="text-sage-deep">{index}</span>}
      <span className="rounded-full bg-sage-soft px-3 py-1 !tracking-[0.14em] text-sage-deep">{project.category}</span>
      {project.location && <span>{project.location}</span>}
      <span className="text-graphite/80">
        · {imageCount} {imageCount === 1 ? "image" : "images"}
      </span>
    </p>
  );

  return (
    <article className={cn("group", className)} data-reveal-item>
      <Link
        href={`/projects/${project.slug}`}
        className={cn("block rounded-[var(--radius-frame)] focus-visible:outline-offset-8", feature && "lg:grid lg:grid-cols-12 lg:items-center lg:gap-12")}
        aria-label={`${project.title} — ${project.category}. View project`}
      >
        {frame}
        <div className={cn(feature ? "mt-6 lg:col-span-5 lg:mt-0" : "mt-5 px-1")}>
          {meta}
          <h3
            className={cn(
              "mt-3 font-serif font-medium leading-[1.05] tracking-[-0.02em] transition-[transform,color] duration-700 ease-out-soft group-hover:translate-x-1.5 group-hover:text-sage-deep",
              feature ? "text-[clamp(2rem,3.8vw,3.5rem)]" : "text-[clamp(1.5rem,2.2vw,2.05rem)]",
            )}
          >
            {project.title}
          </h3>
          <p className={cn("mt-3 max-w-xl text-graphite", feature && "sm:text-lg")}>{project.description}</p>
          {feature && (
            <span className="eyebrow mt-8 inline-flex items-center gap-3 rounded-full bg-ink py-3 pl-6 pr-3 !tracking-[0.18em] text-paper transition-colors duration-500 group-hover:bg-sage group-hover:text-ink">
              View project
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-paper/10">
                <ArrowUpRight aria-hidden strokeWidth={1.5} className="h-4 w-4" />
              </span>
            </span>
          )}
        </div>
      </Link>
    </article>
  );
}
