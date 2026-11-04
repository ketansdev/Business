import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { getProjects } from "@/data/projects";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const pages = ["", "/about", "/services", "/projects", "/gallery", "/contact"].map((path) => ({
    url: `${site.url}${path}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: path === "" ? 1 : 0.7,
  }));
  // Only real (non-sample) projects belong in the sitemap.
  const projects = getProjects(false).map((p) => ({
    url: `${site.url}/projects/${p.slug}`,
    lastModified: now,
    changeFrequency: "yearly" as const,
    priority: 0.6,
  }));
  return [...pages, ...projects];
}
