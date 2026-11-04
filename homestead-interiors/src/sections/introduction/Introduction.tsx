import { Eyebrow, Lines } from "@/components/ui/Lines";
import { ArtImage } from "@/components/ui/ArtImage";
import { ButtonLink } from "@/components/ui/Button";
import { placed, placements } from "@/data/placements";
import { site } from "@/lib/site";

/** 02 — Brand introduction: editorial headline with an asymmetric image pair. */
export function Introduction() {
  const [large, small] = placed(placements.home.introduction, site.contentPreview);
  return (
    <section id="introduction" aria-labelledby="intro-title" className="section-y relative bg-paper">
      <div className="container-x grid gap-y-16 lg:grid-cols-12 lg:gap-x-8">
        <div className="lg:col-span-7">
          <Eyebrow className="mb-10">The studio</Eyebrow>
          <Lines
            id="intro-title"
            className="display-lg"
            lines={[
              "More than spaces.",
              <>
                A feeling of <em className="text-sage-deep">belonging.</em>
              </>,
            ]}
          />
        </div>

        <div className="flex flex-col justify-end lg:col-span-4 lg:col-start-9">
          <p data-reveal className="lede">
            At Homestead Interiors, we believe thoughtfully designed spaces have the power to shape the way we live,
            connect and feel.
          </p>
          <div data-reveal data-reveal-delay="0.15" className="mt-10">
            <ButtonLink href="/about" variant="text">
              Our story
            </ButtonLink>
          </div>
        </div>

        {/* Asymmetric composition — two photos side by side, never overlapping,
            each shown whole at its own proportions. */}
        <div className="mt-4 grid grid-cols-12 items-start gap-x-6 gap-y-8 lg:col-span-12 lg:mt-16 lg:gap-x-10">
          {large && (
            <ArtImage
              src={large.src}
              alt={large.alt}
              kind={large.kind}
              reveal
              parallax={0.08}
              className="col-span-12 md:col-span-7"
              sizes="(min-width: 768px) 58vw, 100vw"
            />
          )}
          <div className="col-span-12 flex flex-col gap-8 md:col-span-4 md:col-start-9 md:mt-32">
            {small && (
              <ArtImage
                src={small.src}
                alt={small.alt}
                kind={small.kind}
                reveal
                parallax={0.14}
                maxHeight="34rem"
                className="max-md:ml-auto max-md:w-[62%]"
                sizes="(min-width: 768px) 33vw, 62vw"
              />
            )}
            <p data-reveal className="max-w-[16rem] font-serif text-xl italic leading-snug text-graphite">
              Light, texture and proportion — the quiet materials of a home.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
