import Image from "next/image";
import type { ImageKind } from "@/data/projects";
import { blurProps, frameStyle, kindLabel } from "@/lib/media";
import { cn } from "@/lib/utils";

type Props = {
  src: string;
  alt: string;
  /** Classes for the outer wrapper (column width, margins). */
  className?: string;
  sizes?: string;
  priority?: boolean;
  /** Soft fade-in on scroll (never clips the photo). */
  reveal?: boolean;
  /** Gentle parallax drift of the whole frame (0.08 – 0.2). */
  parallax?: number;
  /** What the image is. Renders and site photos get an honest label. */
  kind?: ImageKind;
  /** Hide the kind label (e.g. when the surrounding UI already states it). */
  hideLabel?: boolean;
  /** Cap the displayed height (CSS length) — tall photos get narrower, never cut. */
  maxHeight?: string;
  /** Horizontal alignment when the photo is narrower than its column. */
  align?: "start" | "center" | "end";
  /** Hover zoom on the whole frame (default on). */
  zoom?: boolean;
};

/**
 * Photo frame that shows the WHOLE image at its own proportions.
 * The hover zoom scales the frame itself, so nothing is ever cropped.
 */
export function ArtImage({
  src,
  alt,
  className,
  sizes = "(min-width: 1024px) 50vw, 100vw",
  priority,
  reveal,
  parallax,
  kind,
  hideLabel,
  maxHeight,
  align = "start",
  zoom = true,
}: Props) {
  const label = hideLabel ? null : kindLabel(kind);

  return (
    <div
      className={cn("relative flex", align === "center" && "justify-center", align === "end" && "justify-end", className)}
      data-parallax={parallax ? String(parallax) : undefined}
    >
      <div
        data-mask={reveal ? "" : undefined}
        style={frameStyle(src, maxHeight)}
        className={cn(
          "relative max-w-full overflow-hidden rounded-[var(--radius-frame)] bg-cloud",
          zoom &&
            "transition-[transform,box-shadow] duration-700 ease-out-soft hover:z-10 hover:scale-[1.03] hover:shadow-[var(--shadow-lift)]",
        )}
      >
        <Image src={src} alt={alt} fill sizes={sizes} priority={priority} {...blurProps(src)} className="object-cover" />
        {label && (
          <span className="pointer-events-none absolute left-3 top-3 z-10 rounded-full bg-paper/90 px-2.5 py-1 text-[0.58rem] font-bold uppercase tracking-[0.18em] text-graphite shadow-[var(--shadow-soft)] backdrop-blur-sm">
            {label}
          </span>
        )}
      </div>
    </div>
  );
}
