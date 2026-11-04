"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { Expand } from "lucide-react";
import type { GalleryItem } from "@/data/gallery";
import { projectCategories, type ProjectCategory } from "@/data/projects";
import { blurProps, getMedia, kindLabel } from "@/lib/media";
import { cn } from "@/lib/utils";
import { Lightbox } from "./Lightbox";

type Filter = "All" | ProjectCategory;

/**
 * Masonry photo gallery. Every photo is shown whole at its natural
 * proportions; tiles zoom gently on hover/focus, project details sit beneath
 * each photo, and a click opens a lightbox over the currently filtered set.
 */
export function MasonryGallery({ items, filterable = true }: { items: GalleryItem[]; filterable?: boolean }) {
  const [filter, setFilter] = useState<Filter>("All");
  const [open, setOpen] = useState<number | null>(null);

  const categories = useMemo(
    () => projectCategories.filter((c) => items.some((i) => i.project.category === c)),
    [items],
  );
  const shown = filter === "All" ? items : items.filter((i) => i.project.category === filter);

  return (
    <div>
      {filterable && categories.length > 1 && (
        <div role="group" aria-label="Filter photographs by category" className="mb-10 flex flex-wrap gap-2">
          {(["All", ...categories] as Filter[]).map((c) => {
            const count = c === "All" ? items.length : items.filter((i) => i.project.category === c).length;
            return (
              <button
                key={c}
                type="button"
                aria-pressed={filter === c}
                onClick={() => {
                  setFilter(c);
                  setOpen(null);
                }}
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
      )}

      <p className="sr-only" aria-live="polite">
        Showing {shown.length} photographs
      </p>

      <ul key={filter} className="columns-1 gap-6 sm:columns-2 lg:columns-3 lg:gap-8">
        {shown.map((item, i) => {
          const m = getMedia(item.src);
          const label = kindLabel(item.kind);
          return (
            <li
              key={item.src}
              className="mb-8 break-inside-avoid motion-safe:animate-[gallery-in_0.8s_var(--ease-out-soft)_both] lg:mb-10"
              style={{ animationDelay: `${Math.min(i, 12) * 60}ms` }}
            >
              <button
                type="button"
                onClick={() => setOpen(i)}
                aria-label={`Open ${item.project.title}${item.caption ? ` — ${item.caption}` : ""} in the image viewer`}
                className="group block w-full cursor-zoom-in text-left"
              >
                {/* The whole tile zooms — the photo itself is always shown complete */}
                <span className="relative block overflow-hidden rounded-[var(--radius-frame)] bg-cloud shadow-[var(--shadow-soft)] transition-[transform,box-shadow] duration-700 ease-out-soft group-hover:relative group-hover:z-10 group-hover:scale-[1.03] group-hover:shadow-[var(--shadow-lift)] group-focus-visible:scale-[1.03]">
                  <Image
                    src={item.src}
                    alt={item.alt}
                    width={m?.width ?? 1200}
                    height={m?.height ?? 900}
                    sizes="(min-width: 1024px) 31vw, (min-width: 640px) 48vw, 100vw"
                    {...blurProps(item.src)}
                    className="block h-auto w-full"
                  />
                  {label && (
                    <span className="absolute left-3 top-3 rounded-full bg-paper/90 px-2.5 py-1 text-[0.58rem] font-bold uppercase tracking-[0.18em] text-graphite shadow-[var(--shadow-soft)]">
                      {label}
                    </span>
                  )}
                  <span className="absolute right-3 top-3 flex h-10 w-10 scale-90 items-center justify-center rounded-full bg-paper/90 text-ink opacity-0 shadow-[var(--shadow-soft)] transition-all duration-500 group-hover:scale-100 group-hover:opacity-100 group-focus-visible:scale-100 group-focus-visible:opacity-100">
                    <Expand aria-hidden strokeWidth={1.5} className="h-4 w-4" />
                  </span>
                </span>
                {/* Project details below the photo */}
                <span className="mt-3 block px-1">
                  <span className="eyebrow block text-sage-deep">{item.project.category}</span>
                  <span className="mt-1 block font-serif text-lg font-medium leading-tight tracking-[-0.01em] transition-colors duration-500 group-hover:text-sage-deep">
                    {item.project.title}
                  </span>
                  {item.caption && <span className="mt-0.5 block text-sm text-graphite">{item.caption}</span>}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <Lightbox items={shown} index={open} onIndexChange={setOpen} onClose={() => setOpen(null)} />
    </div>
  );
}
