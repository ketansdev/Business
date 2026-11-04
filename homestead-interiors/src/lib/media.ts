import type { CSSProperties } from "react";
import { media, type MediaInfo } from "@/data/media.generated";
import type { ImageKind } from "@/data/projects";
import { imageKindLabel } from "@/data/projects";

/** Intrinsic size + blur placeholder for a local image (undefined for unknown paths). */
export function getMedia(src: string): MediaInfo | undefined {
  return media[src];
}

/** Props that give next/image a blurred preview while the photo loads. */
export function blurProps(src: string) {
  const m = media[src];
  return m ? ({ placeholder: "blur", blurDataURL: m.blurDataURL } as const) : ({} as const);
}

/** Aspect ratio (w / h) of a local image, or a sensible default. */
export function aspectOf(src: string, fallback = 4 / 3) {
  const m = media[src];
  return m ? m.width / m.height : fallback;
}

/**
 * Size a frame to the photo's OWN proportions, so the photo is never cropped.
 *
 * - The frame always has the image's exact aspect ratio (object-fit has
 *   nothing to trim).
 * - It fills the available width, but never grows past the photo's natural
 *   pixel width (no blurry upscaling) or past `maxHeight` (tall portraits
 *   shrink in width instead of being cut).
 */
export function frameStyle(src: string, maxHeight?: string): CSSProperties {
  const m = media[src];
  if (!m) return { aspectRatio: "4 / 3", width: "100%" };
  const ratio = m.width / m.height;
  const limits = [`100%`, `${m.width}px`];
  if (maxHeight) limits.push(`calc(${maxHeight} * ${ratio.toFixed(4)})`);
  return { aspectRatio: `${m.width} / ${m.height}`, width: `min(${limits.join(", ")})` };
}

export function kindLabel(kind?: ImageKind) {
  return kind ? imageKindLabel[kind] : null;
}
