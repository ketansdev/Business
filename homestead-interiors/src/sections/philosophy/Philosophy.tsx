"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { philosophy } from "@/data/content";
import { Eyebrow, Lines } from "@/components/ui/Lines";
import { ArtImage } from "@/components/ui/ArtImage";
import { cn, pad } from "@/lib/utils";
import { aspectOf, blurProps, kindLabel } from "@/lib/media";
import { placed, placements } from "@/data/placements";
import { site } from "@/lib/site";

/**
 * 03 — Design philosophy. An editorial index of five principles; the image
 * frame on the right follows whichever principle is in focus (scroll or hover).
 */
export function Philosophy() {
  const photos = placed(placements.home.philosophy, site.contentPreview);
  const [active, setActive] = useState(0);
  const rows = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.index));
        });
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    rows.current.forEach((r) => r && io.observe(r));
    return () => io.disconnect();
  }, []);

  return (
    <section id="approach" aria-labelledby="approach-title" className="section-y bg-mist">
      <div className="container-x">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Eyebrow className="mb-10">Our philosophy</Eyebrow>
          </div>
          <Lines
            id="approach-title"
            className="display-lg lg:col-span-7"
            lines={[
              "Designed with intention.",
              <>
                Created to be <em className="text-sage-deep">lived in.</em>
              </>,
            ]}
          />
        </div>

        <div className="mt-20 grid gap-12 lg:mt-28 lg:grid-cols-12">
          {/* Sticky image frame */}
          <div className="relative hidden lg:col-span-5 lg:block">
            {/* A soft "mat" holds each photo whole — landscape or portrait, nothing is cropped. */}
            <div className="sticky top-[calc(var(--header-h)+3rem)] aspect-[4/5] rounded-[var(--radius-card)] bg-paper shadow-[var(--shadow-soft)]">
              {photos.map((ph, i) => (
                <div
                  key={ph.src}
                  className={cn(
                    "absolute inset-x-6 bottom-20 top-6 flex items-center justify-center transition-[opacity,transform] duration-[1000ms] ease-out-soft [container-type:size]",
                    i === active ? "scale-100 opacity-100" : "pointer-events-none scale-[0.97] opacity-0",
                  )}
                >
                  <div
                    // Fit inside the mat both ways: as wide as possible without exceeding its height.
                    style={{ aspectRatio: `${aspectOf(ph.src)}`, width: `min(100cqw, calc(100cqh * ${aspectOf(ph.src).toFixed(4)}))` }}
                    className="relative overflow-hidden rounded-[var(--radius-frame)] bg-cloud transition-transform duration-700 ease-out-soft hover:scale-[1.03]"
                  >
                    <Image
                      src={ph.src}
                      alt={i === active ? ph.alt : ""}
                      fill
                      sizes="40vw"
                      {...blurProps(ph.src)}
                      className="object-cover"
                    />
                    {kindLabel(ph.kind) && (
                      <span className="absolute left-3 top-3 rounded-full bg-paper/90 px-2.5 py-1 text-[0.58rem] font-bold uppercase tracking-[0.18em] text-graphite shadow-[var(--shadow-soft)]">
                        {kindLabel(ph.kind)}
                      </span>
                    )}
                  </div>
                </div>
              ))}
              <span className="absolute bottom-5 right-5 flex items-center gap-3 rounded-full bg-mist py-2 pl-4 pr-2">
                <span className="eyebrow text-graphite">{philosophy[active].title}</span>
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-sage font-serif text-sm font-medium text-ink">
                  {pad(active + 1)}
                </span>
              </span>
            </div>
          </div>

          <ol className="space-y-3 lg:col-span-6 lg:col-start-7">
            {philosophy.map((p, i) => (
              <li
                key={p.title}
                ref={(el) => {
                  rows.current[i] = el;
                }}
                data-index={i}
                onMouseEnter={() => setActive(i)}
                className={cn(
                  "group rounded-[var(--radius-card)] border px-6 py-8 transition-[background-color,border-color,box-shadow] duration-700 ease-out-soft sm:px-10 sm:py-10",
                  i === active ? "border-transparent bg-paper shadow-[var(--shadow-soft)]" : "border-line/80 bg-transparent",
                )}
              >
                <div className="flex items-start gap-5 sm:gap-8">
                  <span
                    className={cn(
                      "eyebrow flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors duration-700",
                      i === active ? "bg-sage text-ink" : "bg-cloud text-graphite",
                    )}
                  >
                    {pad(i + 1)}
                  </span>
                  <div className="flex-1">
                    <h3
                      className={cn(
                        "display-sm transition-[color,transform] duration-700 ease-out-soft",
                        i === active ? "translate-x-1 text-ink" : "text-ink/55",
                      )}
                    >
                      {p.title}
                    </h3>
                    <p className="mt-3 max-w-md text-graphite">{p.body}</p>
                    {photos[i] && (
                      <ArtImage
                        src={photos[i].src}
                        alt={photos[i].alt}
                        kind={photos[i].kind}
                        maxHeight="60svh"
                        className="mt-6 lg:hidden"
                        sizes="100vw"
                      />
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
