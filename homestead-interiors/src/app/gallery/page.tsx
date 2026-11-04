import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { MasonryGallery } from "@/components/gallery/MasonryGallery";
import { VideoFrame } from "@/components/gallery/VideoFrame";
import { Eyebrow } from "@/components/ui/Lines";
import { FinalCTA } from "@/sections/cta/FinalCTA";
import { getGalleryLeftovers } from "@/data/placements";
import { getProjects } from "@/data/projects";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "More photography from Homestead Interiors projects — homes, workplaces, healthcare and dining spaces, plus walkthrough videos.",
  alternates: { canonical: "/gallery" },
};

/**
 * The Gallery holds the photographs that are NOT used anywhere else on the
 * site (computed in src/data/placements.ts), plus the walkthrough videos —
 * so nothing here repeats a photo you've already seen on another page.
 */
export default function GalleryPage() {
  const items = getGalleryLeftovers(site.contentPreview);
  const videos = getProjects(site.contentPreview).flatMap((p) => (p.video ? [{ ...p.video, title: p.title }] : []));

  return (
    <>
      <PageHeader
        eyebrow="Gallery"
        title={["More to", <em key="e" className="text-sage-deep">explore.</em>]}
        intro="Further photographs, 3D visualisations and walkthroughs from our projects. Select any image to view it full screen."
      />

      {videos.length > 0 && (
        <section aria-labelledby="walkthroughs-title" className="pb-[calc(var(--section-y)*0.6)]">
          <div className="container-x">
            <Eyebrow className="mb-8">
              <span id="walkthroughs-title">Walkthroughs</span>
            </Eyebrow>
            <div className="flex flex-wrap items-start gap-8 lg:flex-nowrap">
              {videos.map((v) => (
                <VideoFrame
                  key={v.src}
                  src={v.src}
                  poster={v.poster}
                  width={v.width}
                  height={v.height}
                  caption={`${v.title} — ${v.caption.charAt(0).toLowerCase()}${v.caption.slice(1)}`}
                  maxHeight="34rem"
                />
              ))}
            </div>
          </div>
        </section>
      )}

      <section aria-label="Photo gallery" className="pb-[var(--section-y)]">
        <div className="container-x">
          {items.length > 0 ? (
            <MasonryGallery items={items} />
          ) : (
            <p className="py-24 font-serif text-2xl italic text-graphite">More project photography is on its way.</p>
          )}
        </div>
      </section>
      <FinalCTA />
    </>
  );
}
