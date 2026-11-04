"use client";

import { useMemo, useRef, useState } from "react";
import type { Project, ProjectCategory } from "@/data/projects";
import { projectCategories } from "@/data/projects";
import { gsap, useGSAP } from "@/lib/gsap";
import { prefersReducedMotion } from "@/hooks/useReducedMotion";
import { cn, pad } from "@/lib/utils";
import { ProjectCard } from "./ProjectCard";

type Filter = "All" | ProjectCategory;

/** Filterable portfolio grid with an editorial, alternating rhythm. */
export function ProjectGrid({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState<Filter>("All");
  const grid = useRef<HTMLDivElement>(null);

  const available = useMemo(
    () => projectCategories.filter((c) => projects.some((p) => p.category === c)),
    [projects],
  );
  const shown = filter === "All" ? projects : projects.filter((p) => p.category === filter);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.fromTo(
        "[data-grid-item]",
        { autoAlpha: 0, y: 30 },
        { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.08, ease: "power3.out" },
      );
    },
    { scope: grid, dependencies: [filter], revertOnUpdate: true },
  );

  return (
    <div>
      <div role="group" aria-label="Filter projects by category" className="flex flex-wrap gap-2">
        {(["All", ...available] as Filter[]).map((c) => {
          const count = c === "All" ? projects.length : projects.filter((p) => p.category === c).length;
          return (
            <button
              key={c}
              type="button"
              aria-pressed={filter === c}
              onClick={() => setFilter(c)}
              className={cn(
                "eyebrow inline-flex items-center gap-2 rounded-full border px-4 py-2.5 !tracking-[0.14em] transition-[background-color,color,border-color] duration-500 ease-out-soft",
                filter === c
                  ? "border-ink bg-ink text-paper"
                  : "border-line bg-paper text-ink/75 hover:border-sage hover:bg-sage-soft hover:text-ink",
              )}
            >
              {c}
              <span
                className={cn(
                  "flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[0.6rem] tracking-normal",
                  filter === c ? "bg-sage text-ink" : "bg-cloud text-graphite",
                )}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      <p className="sr-only" aria-live="polite">
        Showing {shown.length} {shown.length === 1 ? "project" : "projects"}
      </p>

      {shown.length === 0 ? (
        <p className="py-24 font-serif text-2xl italic text-graphite">No projects in this category yet.</p>
      ) : (
        <div ref={grid} className="mt-12 grid items-start gap-x-10 gap-y-16 md:grid-cols-2 md:gap-y-20">
          {shown.map((p, i) => {
            // The first project leads side by side; the rest alternate in an
            // offset two-column rhythm. Every cover keeps its own proportions.
            const lead = i === 0;
            return (
              <div key={p.slug} data-grid-item className={cn(lead ? "md:col-span-2" : i % 2 === 0 && "md:mt-28")}>
                <ProjectCard
                  project={p}
                  index={pad(i + 1)}
                  variant={lead ? "feature" : "default"}
                  priority={lead}
                  sizes={lead ? "(min-width: 1024px) 58vw, 100vw" : "(min-width: 768px) 50vw, 100vw"}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
