"use client";

import Image from "next/image";
import Link from "next/link";
import { createPortal } from "react-dom";
import { useCallback, useEffect, useRef, useState, type PointerEvent } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight, X } from "lucide-react";
import type { GalleryItem } from "@/data/gallery";
import { blurProps, kindLabel } from "@/lib/media";
import { useLenis } from "@/components/layout/SmoothScroll";
import { cn, pad } from "@/lib/utils";

type Props = {
  items: GalleryItem[];
  /** Index of the open image, or null when closed. */
  index: number | null;
  onIndexChange: (i: number) => void;
  onClose: () => void;
};

const EXIT_MS = 320;

/**
 * Full-screen photo viewer.
 * Keyboard: ← → to browse, Esc to close. Touch: swipe left/right.
 * Focus moves into the dialog on open and returns to the trigger on close.
 */
export function Lightbox({ items, index, onIndexChange, onClose }: Props) {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [shown, setShown] = useState<number | null>(index);
  const dialog = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const swipe = useRef<{ x: number; y: number } | null>(null);
  const lenis = useLenis();

  useEffect(() => setMounted(true), []);

  // Open / close with an exit transition before unmounting.
  useEffect(() => {
    if (index !== null) {
      // Remember the trigger only when opening — not on every next/previous.
      if (!dialog.current) returnFocus.current = (document.activeElement as HTMLElement) ?? null;
      setShown(index);
      requestAnimationFrame(() => setVisible(true));
      return;
    }
    setVisible(false);
    const t = window.setTimeout(() => setShown(null), EXIT_MS);
    return () => window.clearTimeout(t);
  }, [index]);

  const open = shown !== null;

  // Scroll lock + focus management.
  useEffect(() => {
    if (!open) return;
    lenis?.stop();
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    requestAnimationFrame(() => closeBtn.current?.focus());
    return () => {
      lenis?.start();
      document.documentElement.style.overflow = prev;
      returnFocus.current?.focus?.();
    };
  }, [open, lenis]);

  const go = useCallback(
    (dir: 1 | -1) => {
      if (index === null || items.length < 2) return;
      onIndexChange((index + dir + items.length) % items.length);
    },
    [index, items.length, onIndexChange],
  );

  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
      else if (e.key === "Tab" && dialog.current) {
        const f = Array.from(dialog.current.querySelectorAll<HTMLElement>("button, a[href]"));
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, go, onClose]);

  const onPointerDown = (e: PointerEvent) => {
    swipe.current = { x: e.clientX, y: e.clientY };
  };
  const onPointerUp = (e: PointerEvent) => {
    const s = swipe.current;
    swipe.current = null;
    if (!s) return;
    const dx = e.clientX - s.x;
    const dy = e.clientY - s.y;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) go(dx < 0 ? 1 : -1);
  };

  if (!mounted || shown === null) return null;
  const current = index ?? shown;
  const item = items[current];
  if (!item) return null;
  const label = kindLabel(item.kind);
  const prev = items[(current - 1 + items.length) % items.length];
  const next = items[(current + 1) % items.length];

  return createPortal(
    <div
      ref={dialog}
      role="dialog"
      aria-modal="true"
      aria-label={`Image viewer: ${item.project.title}`}
      className={cn(
        "fixed inset-0 z-[90] flex flex-col bg-ink/92 text-paper backdrop-blur-xl transition-opacity duration-300 ease-out-soft",
        visible ? "opacity-100" : "opacity-0",
      )}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between gap-4 px-4 pb-2 pt-[max(1rem,env(safe-area-inset-top))] sm:px-6">
        <p className="eyebrow tabular-nums text-paper/70" aria-live="polite">
          {pad(current + 1)} <span className="text-paper/35">/ {pad(items.length)}</span>
        </p>
        <button
          ref={closeBtn}
          type="button"
          onClick={onClose}
          aria-label="Close image viewer"
          className="flex h-11 w-11 items-center justify-center rounded-full bg-paper/10 transition-colors hover:bg-paper hover:text-ink"
        >
          <X aria-hidden strokeWidth={1.5} className="h-5 w-5" />
        </button>
      </div>

      {/* Stage */}
      <div
        className="relative flex flex-1 touch-pan-y items-center justify-center px-2 sm:px-20"
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <div
          key={item.src}
          className={cn(
            "relative h-full max-h-[78svh] w-full max-w-6xl transition-transform duration-300 ease-out-soft motion-safe:animate-[lb-in_0.5s_var(--ease-out-soft)]",
            visible ? "scale-100" : "scale-[0.97]",
          )}
        >
          <Image
            src={item.src}
            alt={item.alt}
            fill
            sizes="(min-width: 1280px) 1152px, 100vw"
            priority
            {...blurProps(item.src)}
            className="object-contain"
          />
        </div>

        {items.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-paper/10 transition-colors hover:bg-paper hover:text-ink sm:flex"
            >
              <ArrowLeft aria-hidden strokeWidth={1.5} className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next image"
              className="absolute right-3 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-paper/10 transition-colors hover:bg-paper hover:text-ink sm:flex"
            >
              <ArrowRight aria-hidden strokeWidth={1.5} className="h-5 w-5" />
            </button>
          </>
        )}
      </div>

      {/* Caption */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-3 sm:px-6">
        <div className="min-w-0">
          <p className="eyebrow flex flex-wrap items-center gap-2 text-sage">
            {item.project.category}
            {label && <span className="rounded-full bg-paper/10 px-2 py-0.5 text-paper/80">{label}</span>}
          </p>
          <p className="mt-1 font-serif text-xl font-medium tracking-[-0.01em] sm:text-2xl">
            {item.project.title}
            {item.caption && <span className="text-paper/55"> — {item.caption}</span>}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {items.length > 1 && (
            <span className="flex gap-2 sm:hidden">
              <button type="button" onClick={() => go(-1)} aria-label="Previous image" className="flex h-11 w-11 items-center justify-center rounded-full bg-paper/10">
                <ArrowLeft aria-hidden strokeWidth={1.5} className="h-5 w-5" />
              </button>
              <button type="button" onClick={() => go(1)} aria-label="Next image" className="flex h-11 w-11 items-center justify-center rounded-full bg-paper/10">
                <ArrowRight aria-hidden strokeWidth={1.5} className="h-5 w-5" />
              </button>
            </span>
          )}
          <Link
            href={`/projects/${item.project.slug}`}
            onClick={onClose}
            className="eyebrow inline-flex items-center gap-2 rounded-full bg-sage px-4 py-3 !tracking-[0.16em] text-ink transition-colors hover:bg-paper"
          >
            View project <ArrowUpRight aria-hidden strokeWidth={1.5} className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Preload neighbours so browsing feels instant */}
      <div aria-hidden className="pointer-events-none absolute h-px w-px overflow-hidden opacity-0">
        {[prev, next].map((n) =>
          n && n.src !== item.src ? <Image key={n.src} src={n.src} alt="" width={64} height={64} sizes="(min-width: 1280px) 1152px, 100vw" /> : null,
        )}
      </div>
    </div>,
    document.body,
  );
}
