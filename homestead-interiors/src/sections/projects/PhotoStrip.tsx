import { placed, placements } from "@/data/placements";
import { site } from "@/lib/site";
import { Eyebrow, Lines } from "@/components/ui/Lines";
import { ButtonLink } from "@/components/ui/Button";
import { PhotoCarousel } from "@/components/gallery/PhotoCarousel";

/** Homepage "Inspiration gallery" carousel — finished spaces, visualisations and site photos, opening into the lightbox. */
export function PhotoStrip() {
  const items = placed(placements.home.carousel, site.contentPreview);
  if (items.length < 2) return null;

  return (
    <section id="inspiration" aria-labelledby="strip-title" className="scroll-mt-[var(--header-h)] overflow-hidden bg-paper pb-[var(--section-y)] pt-[calc(var(--section-y)*0.8)]">
      <div className="container-x mb-12 flex flex-col justify-between gap-8 md:flex-row md:items-end">
        <div>
          <Eyebrow className="mb-8">Inspiration gallery</Eyebrow>
          <Lines
            id="strip-title"
            className="display-md"
            lines={[
              "Spaces taking",
              <>
                <em className="text-sage-deep">shape.</em>
              </>,
            ]}
          />
        </div>
        <div data-reveal className="flex max-w-sm flex-col gap-6">
          <p className="text-graphite">Finished spaces, design visualisations and projects on site. Drag, swipe or use the arrows — tap any photo to enlarge it.</p>
          <ButtonLink href="/gallery" variant="outline">
            Open the full gallery
          </ButtonLink>
        </div>
      </div>
      <div data-reveal>
        <PhotoCarousel items={items} label="Inspiration gallery" />
      </div>
    </section>
  );
}
