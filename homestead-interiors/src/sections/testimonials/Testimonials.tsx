"use client";

import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { getRatingSummary, getTestimonials, type Testimonial } from "@/data/testimonials";
import { philosophy } from "@/data/content";
import { ButtonLink } from "@/components/ui/Button";
import { getProjects } from "@/data/projects";
import { site } from "@/lib/site";
import { prefersReducedMotion } from "@/hooks/useReducedMotion";
import { Eyebrow, Lines } from "@/components/ui/Lines";
import { cn } from "@/lib/utils";

/**
 * Kind words — genuine client testimonials (src/data/testimonials.ts).
 * 3 cards on desktop, 2 on tablet, 1 on phones; swipe, arrows, dots and ← →.
 * With no genuine reviews on file it shows "Our Commitment to Every Space"
 * instead — the studio's own brand statements, never invented feedback.
 */
export function Testimonials() {
  const items = getTestimonials();
  if (items.length === 0) return <Commitment />;
  const summary = getRatingSummary(items);

  return (
    <section id="testimonials" aria-labelledby="testimonials-title" className="section-y ambient scroll-mt-[var(--header-h)] overflow-hidden bg-mist">
      <div className="container-x">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <Eyebrow className="mb-10">Kind words</Eyebrow>
            <Lines
              id="testimonials-title"
              className="display-lg"
              lines={[
                "What our",
                <>
                  clients <em className="text-sage-deep">say.</em>
                </>,
              ]}
            />
          </div>
          <div data-reveal className="flex flex-col gap-6 lg:col-span-4 lg:col-start-9">
            <p className="lede">
              Every space tells a story. Here&apos;s what our clients have to say about their experience with Homestead
              Interiors.
            </p>
            {summary && (
              <div className="flex items-center gap-4">
                <span className="font-serif text-[2.6rem] font-medium leading-none tracking-[-0.02em]">
                  {summary.average.toFixed(1)}
                  <span className="text-xl text-graphite"> / 5</span>
                </span>
                <span className="flex flex-col gap-1.5">
                  <Stars rating={summary.average} size="md" />
                  <span className="text-sm text-graphite">
                    Average of {summary.count} {summary.count === 1 ? "rating" : "ratings"}
                  </span>
                </span>
              </div>
            )}
          </div>
        </div>
        <Carousel items={items} />
      </div>
    </section>
  );
}

/** Shown until genuine reviews are added: the studio's own words, no invented feedback. */
function Commitment() {
  return (
    <section id="testimonials" aria-labelledby="commitment-title" className="section-y ambient scroll-mt-[var(--header-h)] overflow-hidden bg-mist">
      <div className="container-x">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-6">
            <Eyebrow className="mb-10">Our promise</Eyebrow>
            <Lines
              id="commitment-title"
              className="display-lg"
              lines={[
                "Our commitment",
                <>
                  to <em className="text-sage-deep">every space.</em>
                </>,
              ]}
            />
          </div>
          <figure data-reveal className="relative rounded-[var(--radius-card)] border border-line bg-paper p-8 shadow-[var(--shadow-soft)] sm:p-10 lg:col-span-6">
            <span aria-hidden className="pointer-events-none absolute -top-7 right-4 select-none font-serif text-[9rem] leading-none text-champagne-soft">
              &rdquo;
            </span>
            <blockquote className="relative font-serif text-[clamp(1.6rem,2.6vw,2.3rem)] font-medium leading-[1.15] tracking-[-0.015em]">
              {site.tagline}
            </blockquote>
            <figcaption className="relative mt-5 text-graphite">{site.message}</figcaption>
          </figure>
        </div>
        <ul data-reveal-stagger className="mt-14 grid gap-4 sm:grid-cols-2 lg:mt-16 lg:grid-cols-5">
          {philosophy.map((p, i) => (
            <li key={p.title} data-reveal-item>
              <div className="group h-full rounded-[var(--radius-card)] border border-line bg-paper p-6 transition-[transform,box-shadow,border-color] duration-700 ease-out-soft hover:-translate-y-1 hover:border-transparent hover:shadow-[var(--shadow-lift)]">
                <span
                  className={cn(
                    "block h-[3px] w-8 rounded-full transition-[width] duration-700 ease-out-soft group-hover:w-14",
                    ["bg-sage", "bg-haze", "bg-champagne"][i % 3],
                  )}
                />
                <h3 className="mt-5 font-serif text-[1.3rem] font-medium leading-tight tracking-[-0.01em]">{p.title}</h3>
                <p className="mt-2 text-sm text-graphite">{p.body}</p>
              </div>
            </li>
          ))}
        </ul>
        <div data-reveal className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-4">
          <ButtonLink href="/contact">Start your project</ButtonLink>
          <ButtonLink href="/projects" variant="outline">
            See our work
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}

const STAR = "M12 2.5l2.94 6.1 6.72.86-4.93 4.65 1.25 6.66L12 17.6l-5.98 3.17 1.25-6.66L2.34 9.46l6.72-.86z";

/** Gold stars with partial fill for decimal ratings (e.g. 4.7 → 4 full + 70% of the 5th). */
function Stars({ rating, size = "sm" }: { rating: number; size?: "sm" | "md" }) {
  const r = Math.max(0, Math.min(5, rating));
  const dim = size === "md" ? "h-5 w-5" : "h-4 w-4";
  return (
    <span className="flex items-center gap-1" role="img" aria-label={`Rated ${Number.isInteger(r) ? r.toFixed(1) : r} out of 5`}>
      {Array.from({ length: 5 }, (_, i) => {
        const fill = Math.max(0, Math.min(1, r - i));
        return (
          <span key={i} aria-hidden className={cn("relative block shrink-0", dim)}>
            <svg viewBox="0 0 24 24" className={cn("absolute inset-0 text-line", dim)} fill="currentColor">
              <path d={STAR} />
            </svg>
            {fill > 0 && (
              <span className="absolute inset-y-0 left-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
                <svg viewBox="0 0 24 24" className={cn("text-champagne", dim)} fill="currentColor">
                  <path d={STAR} />
                </svg>
              </span>
            )}
          </span>
        );
      })}
    </span>
  );
}

const initials = (name: string) =>
  name
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

function Card({ t, i }: { t: Testimonial; i: number }) {
  const project = t.projectSlug ? getProjects(site.contentPreview).find((p) => p.slug === t.projectSlug) : undefined;
  return (
    <figure className="group relative flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] border border-line bg-paper p-8 shadow-[var(--shadow-soft)] transition-[transform,box-shadow,border-color] duration-700 ease-out-soft hover:-translate-y-1 hover:border-transparent hover:shadow-[var(--shadow-lift)] sm:p-9">
      {/* Decorative quotation mark */}
      <span
        aria-hidden
        className="pointer-events-none absolute -right-1 -top-6 select-none font-serif text-[9rem] leading-none text-champagne-soft transition-colors duration-700 group-hover:text-sage-soft"
      >
        &rdquo;
      </span>
      {typeof t.rating === "number" && (
        <div className="relative mb-7 flex items-center gap-3">
          <Stars rating={t.rating} />
          <span className="text-sm font-semibold tabular-nums text-champagne-deep">{t.rating.toFixed(1)}</span>
        </div>
      )}
      <blockquote className="relative flex-1 text-[1.02rem] leading-relaxed text-ink/85">
        <p>&ldquo;{t.quote}&rdquo;</p>
      </blockquote>
      <figcaption className="relative mt-9 flex items-center gap-4 border-t border-line pt-6">
        <span
          aria-hidden
          className={cn(
            "flex h-12 w-12 shrink-0 items-center justify-center rounded-full font-serif text-lg transition-colors duration-500 group-hover:bg-sage group-hover:text-ink",
            ["bg-sage-soft text-sage-deep", "bg-haze-soft text-haze-deep", "bg-champagne-soft text-champagne-deep"][i % 3],
          )}
        >
          {t.name ? initials(t.name) : <span className="text-2xl leading-none">&ldquo;</span>}
        </span>
        <span className="min-w-0">
          <span className="block font-serif text-[1.35rem] font-medium leading-tight tracking-[-0.01em]">
            {t.name || "Homestead Interiors client"}
          </span>
          {t.location && <span className="mt-1 block text-sm text-graphite">{t.location}</span>}
          {project && (
            <Link href={`/projects/${project.slug}`} className="link-underline mt-1 inline-block text-sm text-sage-deep">
              {project.title}
            </Link>
          )}
        </span>
      </figcaption>
    </figure>
  );
}

function Carousel({ items }: { items: Testimonial[] }) {
  const track = useRef<HTMLUListElement>(null);
  const [page, setPage] = useState(0);
  const [pages, setPages] = useState(1);

  /** Distance between card starts (card width + gap). */
  const step = useCallback(() => {
    const el = track.current;
    const first = el?.children[0] as HTMLElement | undefined;
    const second = el?.children[1] as HTMLElement | undefined;
    if (!el || !first) return 1;
    return second ? second.offsetLeft - first.offsetLeft : first.offsetWidth;
  }, []);

  const measure = useCallback(() => {
    const el = track.current;
    if (!el) return;
    const s = step();
    const max = el.scrollWidth - el.clientWidth;
    setPages(Math.max(1, Math.round(max / s) + 1));
    setPage(Math.min(Math.round(el.scrollLeft / s), Math.round(max / s)));
  }, [step]);

  useEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    if (track.current) ro.observe(track.current);
    return () => ro.disconnect();
  }, [measure]);

  const go = (p: number) => {
    const el = track.current;
    if (!el) return;
    const target = Math.max(0, Math.min(pages - 1, p));
    el.scrollTo({ left: target * step(), behavior: prefersReducedMotion() ? "auto" : "smooth" });
  };

  const onKey = (e: KeyboardEvent<HTMLUListElement>) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      go(page + 1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      go(page - 1);
    }
  };

  const arrow =
    "flex h-12 w-12 items-center justify-center rounded-full border border-line bg-paper text-ink shadow-[var(--shadow-soft)] transition-[background-color,border-color,transform,opacity] duration-500 ease-out-soft hover:-translate-y-0.5 hover:border-transparent hover:bg-sage disabled:pointer-events-none disabled:opacity-35";

  return (
    <div className="mt-16 lg:mt-20">
      <ul
        ref={track}
        onScroll={measure}
        onKeyDown={onKey}
        tabIndex={0}
        role="region"
        aria-roledescription="carousel"
        aria-label="Client testimonials"
        data-lenis-prevent
        data-reveal-stagger
        className="-mx-4 flex snap-x snap-mandatory scroll-px-4 gap-6 overflow-x-auto scroll-smooth px-4 py-4 [scrollbar-width:none] focus-visible:outline-offset-4 [&::-webkit-scrollbar]:hidden"
      >
        {items.map((t, i) => (
          <li
            key={i}
            data-reveal-item
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${items.length}${t.name ? `: ${t.name}` : ""}`}
            className="w-[86%] shrink-0 snap-start sm:w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-3rem)/3)]"
          >
            <Card t={t} i={i} />
          </li>
        ))}
      </ul>

      {pages > 1 && (
        <div className="mt-8 flex items-center justify-between gap-6">
          <div className="flex items-center gap-2" role="group" aria-label="Choose testimonials">
            {Array.from({ length: pages }, (_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => go(i)}
                aria-label={`Show testimonials ${i + 1}`}
                aria-current={i === page}
                className="group flex h-8 items-center px-1"
              >
                <span
                  className={cn(
                    "block h-2 rounded-full transition-[width,background-color] duration-500 ease-out-soft",
                    i === page ? "w-8 bg-sage-deep" : "w-2 bg-graphite/30 group-hover:bg-graphite/60",
                  )}
                />
              </button>
            ))}
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={() => go(page - 1)} disabled={page === 0} aria-label="Previous testimonials" className={arrow}>
              <ArrowLeft aria-hidden strokeWidth={1.5} className="h-5 w-5" />
            </button>
            <button type="button" onClick={() => go(page + 1)} disabled={page >= pages - 1} aria-label="Next testimonials" className={arrow}>
              <ArrowRight aria-hidden strokeWidth={1.5} className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
