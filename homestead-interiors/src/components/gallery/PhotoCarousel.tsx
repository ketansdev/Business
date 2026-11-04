"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { ArrowLeft, ArrowRight, Expand } from "lucide-react";
import type { GalleryItem } from "@/data/gallery";
import { aspectOf, blurProps, kindLabel } from "@/lib/media";
import { cn, pad } from "@/lib/utils";
import { Lightbox } from "./Lightbox";

type Props = {
  items: GalleryItem[];
  /** Accessible name for the carousel region. */
  label: string;
  /** Open images in the lightbox on click (default true). */
  expandable?: boolean;
  className?: string;
};

/**
 * Horizontal photo carousel.
 * - Native scroll-snap (smooth on touch, trackpad and wheel)
 * - Mouse drag-to-scroll on desktop; swipe on touch
 * - Previous / next arrows, clickable pagination, ← → keys
 * - Landscape and portrait photos keep their natural shape at an equal height —
 *   never cropped; captions sit below the photo, not over it
 */
export function PhotoCarousel({ items, label, expandable = true, className }: Props) {
  const track = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; left: number; moved: boolean } | null>(null);
  const [active, setActive] = useState(0);
  const [edges, setEdges] = useState({ start: true, end: false });
  const [open, setOpen] = useState<number | null>(null);
  const [tail, setTail] = useState(1);

  const slides = () => Array.from(track.current?.querySelectorAll<HTMLElement>("[data-slide]") ?? []);
  /** Scroll offset at which a slide sits flush with the track's start padding. */
  const slideTarget = (el: HTMLElement, s: HTMLElement) =>
    s.getBoundingClientRect().left - el.getBoundingClientRect().left + el.scrollLeft - parseFloat(getComputedStyle(el).scrollPaddingLeft || "0");

  const sync = useCallback(() => {
    const el = track.current;
    if (!el) return;
    const left = el.scrollLeft;
    let best = 0;
    let bestDist = Infinity;
    slides().forEach((s, i) => {
      const d = Math.abs(slideTarget(el, s) - left);
      if (d < bestDist) {
        bestDist = d;
        best = i;
      }
    });
    const atEnd = left + el.clientWidth >= el.scrollWidth - 4;
    setActive(atEnd ? items.length - 1 : best);
    setEdges({ start: left <= 4, end: atEnd });
  }, [items.length]);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    // Trailing space so the last slide can still snap flush to the start edge,
    // giving every slide (and every pagination dot) its own resting position.
    const size = () => {
      const last = slides()[items.length - 1];
      if (!last) return;
      const cs = getComputedStyle(el);
      setTail(Math.max(1, el.clientWidth - last.offsetWidth - parseFloat(cs.paddingLeft || "0") - parseFloat(cs.columnGap || "0") * 2));
    };
    const onResize = () => {
      size();
      sync();
    };
    size();
    sync();
    el.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      el.removeEventListener("scroll", sync);
      window.removeEventListener("resize", onResize);
    };
  }, [sync, items.length]);

  const scrollToSlide = (i: number) => {
    const el = track.current;
    const s = slides()[Math.max(0, Math.min(items.length - 1, i))];
    if (!el || !s) return;
    el.scrollTo({ left: slideTarget(el, s), behavior: "smooth" });
  };

  const step = (dir: 1 | -1) => scrollToSlide(active + dir);

  // Mouse drag-to-scroll (touch uses native swipe).
  const onPointerDown = (e: PointerEvent) => {
    if (e.pointerType !== "mouse" || !track.current) return;
    drag.current = { x: e.clientX, left: track.current.scrollLeft, moved: false };
    track.current.style.scrollSnapType = "none";
    track.current.style.cursor = "grabbing";
  };
  const onPointerMove = (e: PointerEvent) => {
    const d = drag.current;
    if (!d || !track.current) return;
    const dx = e.clientX - d.x;
    if (Math.abs(dx) > 4) d.moved = true;
    track.current.scrollLeft = d.left - dx;
  };
  const endDrag = () => {
    const el = track.current;
    if (!drag.current || !el) return;
    const moved = drag.current.moved;
    el.style.cursor = "";
    // Re-enable snapping, then settle on the nearest slide.
    requestAnimationFrame(() => {
      el.style.scrollSnapType = "";
      if (moved) scrollToSlide(active);
    });
    // Let the click handler see whether this was a drag.
    setTimeout(() => (drag.current = null), 0);
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      step(1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      step(-1);
    }
  };

  return (
    <div className={className}>
      <div
        ref={track}
        role="region"
        aria-roledescription="carousel"
        aria-label={label}
        tabIndex={0}
        data-lenis-prevent
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
        // Vertical padding leaves room for the hover zoom, so scaled slides are never clipped.
        className="flex cursor-grab snap-x snap-mandatory items-start gap-5 overflow-x-auto overscroll-x-contain px-[var(--gutter)] py-5 [--slide-h:clamp(18rem,52vh,32rem)] [scroll-padding-inline:var(--gutter)] [scrollbar-width:none] focus-visible:outline-offset-[-2px] sm:gap-7 [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item, i) => {
          const ratio = aspectOf(item.src);
          const label = kindLabel(item.kind);
          return (
            <div
              key={item.src}
              data-slide
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${items.length}: ${item.project.title}`}
              // Every slide shares one height and takes its photo's own width,
              // so landscape and portrait photos are both shown whole.
              style={{ width: `min(86vw, calc(var(--slide-h) * ${ratio.toFixed(4)}))` }}
              className="group relative shrink-0 snap-start select-none"
            >
              <button
                type="button"
                disabled={!expandable}
                onClick={() => !drag.current?.moved && expandable && setOpen(i)}
                aria-label={expandable ? `Open ${item.project.title}${item.caption ? ` — ${item.caption}` : ""} in the image viewer` : undefined}
                style={{ aspectRatio: `${ratio}` }}
                className={cn(
                  "relative block w-full overflow-hidden rounded-[var(--radius-frame)] bg-cloud shadow-[var(--shadow-soft)] transition-[transform,box-shadow] duration-700 ease-out-soft group-hover:scale-[1.03] group-hover:shadow-[var(--shadow-lift)] group-focus-within:scale-[1.03]",
                  expandable ? "cursor-zoom-in" : "cursor-default",
                )}
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  draggable={false}
                  sizes="(min-width: 1024px) 45vw, 86vw"
                  {...blurProps(item.src)}
                  className="object-cover"
                />
                {label && (
                  <span className="absolute left-3 top-3 rounded-full bg-paper/90 px-2.5 py-1 text-[0.58rem] font-bold uppercase tracking-[0.18em] text-graphite shadow-[var(--shadow-soft)]">
                    {label}
                  </span>
                )}
                {expandable && (
                  <span className="absolute right-3 top-3 flex h-10 w-10 scale-90 items-center justify-center rounded-full bg-paper/90 text-ink opacity-0 shadow-[var(--shadow-soft)] transition-all duration-500 group-hover:scale-100 group-hover:opacity-100">
                    <Expand aria-hidden strokeWidth={1.5} className="h-4 w-4" />
                  </span>
                )}
              </button>
              {/* Caption sits below, so it never covers the photo */}
              <p className="mt-4 px-1">
                <span className="eyebrow block text-sage-deep">{item.project.category}</span>
                <span className="mt-1 block font-serif text-lg font-medium leading-tight tracking-[-0.01em] transition-colors duration-500 group-hover:text-sage-deep">
                  {item.project.title}
                </span>
                {item.caption && <span className="mt-0.5 block text-sm text-graphite">{item.caption}</span>}
              </p>
            </div>
          );
        })}
        {/* Trailing spacer so the last slide can snap to the start edge */}
        <span aria-hidden className="shrink-0" style={{ width: tail }} />
      </div>

      {/* Controls */}
      <div className="container-x mt-6 flex items-center justify-between gap-6">
        <div className="flex items-center gap-1.5" role="group" aria-label="Choose slide">
          {items.map((item, i) => (
            <button
              key={item.src}
              type="button"
              onClick={() => scrollToSlide(i)}
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === active}
              className="group flex h-6 items-center"
            >
              <span
                className={cn(
                  "block h-1.5 rounded-full transition-all duration-500 ease-out-soft",
                  i === active ? "w-8 bg-sage" : "w-1.5 bg-line group-hover:bg-graphite/50",
                )}
              />
            </button>
          ))}
          <span className="eyebrow ml-3 tabular-nums text-graphite">
            {pad(active + 1)} / {pad(items.length)}
          </span>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => step(-1)}
            disabled={edges.start}
            aria-label="Previous slide"
            className="flex h-12 w-12 items-center justify-center rounded-full border border-line bg-paper text-ink shadow-[var(--shadow-soft)] transition-[background-color,opacity,transform] duration-500 hover:-translate-y-0.5 hover:bg-sage disabled:pointer-events-none disabled:opacity-35"
          >
            <ArrowLeft aria-hidden strokeWidth={1.5} className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => step(1)}
            disabled={edges.end}
            aria-label="Next slide"
            className="flex h-12 w-12 items-center justify-center rounded-full border border-line bg-paper text-ink shadow-[var(--shadow-soft)] transition-[background-color,opacity,transform] duration-500 hover:-translate-y-0.5 hover:bg-sage disabled:pointer-events-none disabled:opacity-35"
          >
            <ArrowRight aria-hidden strokeWidth={1.5} className="h-5 w-5" />
          </button>
        </div>
      </div>

      {expandable && <Lightbox items={items} index={open} onIndexChange={setOpen} onClose={() => setOpen(null)} />}
    </div>
  );
}
