import { getProjects, projectImages, type ImageKind, type ProjectCategory } from "./projects";

/** One photograph, with the project it belongs to. */
export type GalleryItem = {
  src: string;
  alt: string;
  caption?: string;
  kind: ImageKind;
  project: { slug: string; title: string; category: ProjectCategory };
};

/** Every image across the portfolio, project by project. */
export function getGalleryItems(preview: boolean): GalleryItem[] {
  return getProjects(preview).flatMap((p) =>
    projectImages(p).map((img) => ({
      ...img,
      project: { slug: p.slug, title: p.title, category: p.category },
    })),
  );
}

/** Look up one image (with its project) by path. */
export function getImage(src: string, preview: boolean): GalleryItem | undefined {
  return getGalleryItems(preview).find((i) => i.src === src);
}

/** Resolve a list of paths, silently skipping any that are hidden or missing. */
export function getImages(srcs: readonly string[], preview: boolean): GalleryItem[] {
  return srcs.map((s) => getImage(s, preview)).filter((i): i is GalleryItem => Boolean(i));
}

/** A project's own images as gallery items (for its detail page and lightbox). */
export function getProjectGallery(slug: string, preview: boolean): GalleryItem[] {
  return getGalleryItems(preview).filter((i) => i.project.slug === slug);
}
