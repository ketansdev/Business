/**
 * IMAGE PLACEMENTS — the single source of truth for which photo goes where.
 * ------------------------------------------------------------------
 * Rule: outside the Projects pages, every photograph appears exactly ONCE on
 * the whole website. Home, About, Contact and the Gallery never share a photo.
 *
 *   - Home "Selected work" cards use each featured project's cover.
 *   - The Gallery page shows only the photos that are not placed anywhere
 *     else (it is computed below, never hand-listed).
 *   - The Projects pages (listing + each project's own page) show that
 *     project's photos — the one intended place a photo can appear again.
 *   - Each service card has its own photo (set in src/data/services.ts).
 *   - The closing call-to-action, the hero fallback and the "next project"
 *     link deliberately use no photographs.
 *
 * `checkPlacements()` runs in development and throws if a photo is placed
 * twice or a path doesn't exist, so a repeat can never slip in unnoticed.
 */
import { media } from "./media.generated";
import { getFeaturedProjects } from "./projects";
import { getServices } from "./services";
import { getGalleryItems, getImages, type GalleryItem } from "./gallery";

const P = (slug: string, file: string) => `/images/projects/${slug}/${file}.jpg`;

export const placements = {
  home: {
    introduction: [P("living-dining-residence", "media-wall-curtains"), P("corporate-office", "corridor-stairs")],
    /** One per principle, in the order of src/data/content.ts → philosophy. */
    philosophy: [
      P("living-dining-residence", "media-wall-dining"),
      P("travertine-frame-residence", "elevation-side"),
      P("corporate-office", "director-cabin-meeting"),
      P("executive-cabin", "lounge"),
      P("living-dining-residence", "display-unit"),
    ],
    /** "Inspiration gallery" carousel — a mix of finished spaces, visualisations and site photos. */
    carousel: [
      P("two-finish-kitchen", "sage-u-kitchen"),
      P("school-campus", "facade-glazing-progress"),
      P("wardrobe-utility", "walk-in-wardrobe"),
      P("mint-kitchen-terrazzo-bath", "bath-shower"),
      P("jaali-facade-residence", "on-site"),
      P("mint-kitchen-terrazzo-bath", "galley-kitchen"),
      P("school-campus", "curtain-wall-detail"),
      P("sanjivani-hospital", "exterior"),
    ],
    why: [P("living-dining-residence", "chandelier-living")],
  },
  about: {
    introduction: [P("corporate-office", "director-cabin-window")],
    approach: [P("corporate-office", "meeting-room"), P("sanjivani-hospital", "operation-theatre")],
  },
  contact: [P("sanjivani-hospital", "reception")],
} as const;

/** Every photo placed outside the Projects pages (excluding the computed gallery). */
function placedSources(preview: boolean): string[] {
  const { home, about, contact } = placements;
  return [
    ...home.introduction,
    ...home.philosophy,
    ...home.carousel,
    ...home.why,
    ...getFeaturedProjects(preview).map((p) => p.cover.src),
    ...getServices(preview).map((s) => s.image.src),
    ...about.introduction,
    ...about.approach,
    ...contact,
  ];
}

/** Gallery = every portfolio photo that isn't used anywhere else. */
export function getGalleryLeftovers(preview: boolean): GalleryItem[] {
  const used = new Set(placedSources(preview));
  return getGalleryItems(preview).filter((i) => !used.has(i.src));
}

export const placed = (srcs: readonly string[], preview: boolean) => getImages(srcs, preview);

/** Throws (in development) if any photo is placed twice or doesn't exist. */
export function checkPlacements(preview: boolean) {
  const list = placedSources(preview);
  const seen = new Set<string>();
  const problems: string[] = [];
  for (const src of list) {
    if (seen.has(src)) problems.push(`placed more than once: ${src}`);
    seen.add(src);
    if (!media[src]) problems.push(`missing file / not in media manifest: ${src}`);
  }
  if (problems.length) {
    throw new Error(`Image placement check failed:\n  - ${problems.join("\n  - ")}`);
  }
}

if (process.env.NODE_ENV !== "production") {
  checkPlacements(true);
}
