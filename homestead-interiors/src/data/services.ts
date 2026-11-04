/**
 * SERVICES — the official list supplied by the client.
 * ------------------------------------------------------------------
 * Copy is the client's own wording. Each service has one photograph;
 * service photos are counted in src/data/placements.ts, so none of them
 * repeats anywhere else on the site.
 *
 * `status: "draft"` would hide a service in production — all three are
 * confirmed.
 */
import type { ImageKind } from "./projects";

export type Service = {
  slug: string;
  title: string;
  summary: string;
  image: { src: string; alt: string; kind: ImageKind };
  /** Where "View related work" points. */
  related: { label: string; href: string };
  status: "draft" | "confirmed";
};

const allServices: Service[] = [
  {
    slug: "architectural-planning",
    title: "Architectural Planning",
    summary: "Intelligent and functional planning designed around your vision and project requirements.",
    image: {
      src: "/images/services/architectural-planning.jpg",
      alt: "3D visualisation of a two-storey home with a blue tiled roof, glass carport and landscaped driveway at dusk",
      kind: "render",
    },
    related: { label: "Residential projects", href: "/projects" },
    status: "confirmed",
  },
  {
    slug: "interior-designing",
    title: "Interior Designing",
    summary: "Beautifully crafted interiors that seamlessly blend aesthetics, comfort, and functionality.",
    image: {
      src: "/images/projects/grey-marble-residence/kitchen-arches.jpg",
      alt: "Completed kitchen with arched backlit niches, teal-backed shelving and a coffered ceiling over grey marble floors",
      kind: "photo",
    },
    related: { label: "All projects", href: "/projects" },
    status: "confirmed",
  },
  {
    slug: "villa-projects",
    title: "Villa Projects",
    summary: "Comprehensive villa design and execution solutions, crafted with attention to detail and distinction.",
    image: {
      src: "/images/services/villa-projects.jpg",
      alt: "3D visualisation of a villa front with arched glazing, a balcony, glass carport and warm facade lighting at sunset",
      kind: "render",
    },
    related: { label: "Start a villa project", href: "/contact" },
    status: "confirmed",
  },
];

export function getServices(preview: boolean): Service[] {
  return allServices.filter((s) => preview || s.status === "confirmed");
}
