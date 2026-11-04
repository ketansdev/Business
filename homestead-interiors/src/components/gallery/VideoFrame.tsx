"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import { prefersReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

type Props = {
  src: string;
  poster: string;
  caption: string;
  /** Intrinsic video size — the frame takes this exact ratio, so nothing is cropped. */
  width: number;
  height: number;
  /** Tallest the video may be (portrait clips get narrower instead). */
  maxHeight?: string;
  className?: string;
};

/**
 * Muted, looping walkthrough video. Plays only while on screen (saves battery
 * and bandwidth), never autoplays for reduced-motion visitors, and always has
 * a visible play/pause control.
 */
export function VideoFrame({ src, poster, caption, width, height, maxHeight = "80svh", className }: Props) {
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const userPaused = useRef(false);

  useEffect(() => {
    const v = video.current;
    if (!v) return;
    if (prefersReducedMotion()) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !userPaused.current) v.play().catch(() => {});
        else v.pause();
      },
      { threshold: 0.35 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  const toggle = () => {
    const v = video.current;
    if (!v) return;
    if (v.paused) {
      userPaused.current = false;
      v.play().catch(() => {});
    } else {
      userPaused.current = true;
      v.pause();
    }
  };

  return (
    <figure
      style={{ width: `min(100%, calc(${maxHeight} * ${(width / height).toFixed(4)}))` }}
      className={cn("group max-w-full", className)}
    >
      <div
        style={{ aspectRatio: `${width} / ${height}` }}
        className="relative overflow-hidden rounded-[var(--radius-card)] bg-ink shadow-[var(--shadow-soft)] transition-[transform,box-shadow] duration-700 ease-out-soft group-hover:scale-[1.02] group-hover:shadow-[var(--shadow-lift)]"
      >
        <video
          ref={video}
          src={src}
          poster={poster}
          muted
          loop
          playsInline
          preload="metadata"
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          aria-label={caption}
          className="absolute inset-0 h-full w-full object-contain"
        />
        <span className="eyebrow pointer-events-none absolute left-4 top-4 rounded-full bg-paper/90 px-3 py-1.5 text-sage-deep shadow-[var(--shadow-soft)]">
          Walkthrough
        </span>
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? "Pause video" : "Play video"}
          className="absolute right-4 top-4 flex h-12 w-12 items-center justify-center rounded-full bg-paper/90 text-ink shadow-[var(--shadow-soft)] backdrop-blur-md transition-colors hover:bg-sage"
        >
          {playing ? <Pause aria-hidden strokeWidth={1.5} className="h-5 w-5" /> : <Play aria-hidden strokeWidth={1.5} className="ml-0.5 h-5 w-5" />}
        </button>
      </div>
      {/* Caption below, so nothing covers the footage */}
      <figcaption className="mt-3 px-1 text-sm text-graphite">{caption}</figcaption>
    </figure>
  );
}
