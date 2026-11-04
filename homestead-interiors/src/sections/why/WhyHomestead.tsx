import { Gem, Handshake, Lightbulb, Route, SlidersHorizontal, UsersRound, type LucideIcon } from "lucide-react";
import { whyChooseUs } from "@/data/content";
import { ArtImage } from "@/components/ui/ArtImage";
import { Eyebrow, Lines } from "@/components/ui/Lines";
import { cn, pad } from "@/lib/utils";
import { placed, placements } from "@/data/placements";
import { site } from "@/lib/site";

const ICONS: Record<(typeof whyChooseUs)[number]["icon"], LucideIcon> = {
  creative: Lightbulb,
  materials: Gem,
  team: UsersRound,
  custom: SlidersHorizontal,
  endToEnd: Route,
  relationships: Handshake,
};

/** Soft accent per card, cycling sage → blue → champagne. */
const TINTS = [
  { chip: "bg-sage-soft text-sage-deep", bar: "bg-sage" },
  { chip: "bg-haze-soft text-haze-deep", bar: "bg-haze" },
  { chip: "bg-champagne-soft text-champagne-deep", bar: "bg-champagne" },
];

/**
 * Why Choose Us — the client's six reasons as feature cards.
 * A short editorial header with one photograph, then a 3-column grid
 * (2 on tablet, 1 on phones). Cards lift on hover, the icon chip fills
 * with sage and an accent rule draws along the bottom edge.
 */
export function WhyHomestead() {
  const [photo] = placed(placements.home.why, site.contentPreview);

  return (
    <section id="why" aria-labelledby="why-title" className="section-y scroll-mt-[var(--header-h)] bg-paper">
      <div className="container-x">
        <div className="grid items-end gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-6">
            <Eyebrow className="mb-10">Why choose us</Eyebrow>
            <Lines
              id="why-title"
              className="display-lg"
              lines={[
                "Designed with care,",
                <>
                  built on <em className="text-sage-deep">trust.</em>
                </>,
              ]}
            />
            <p data-reveal className="lede mt-10 max-w-md">
              Six reasons clients choose Homestead Interiors — from the first idea to long after handover.
            </p>
          </div>
          {photo && (
            <ArtImage
              src={photo.src}
              alt={photo.alt}
              kind={photo.kind}
              reveal
              parallax={0.05}
              maxHeight="26rem"
              align="end"
              className="lg:col-span-5 lg:col-start-8"
              sizes="(min-width: 1024px) 40vw, 100vw"
            />
          )}
        </div>

        <ul data-reveal-stagger className="mt-20 grid gap-5 sm:grid-cols-2 lg:mt-24 lg:grid-cols-3 lg:gap-6">
          {whyChooseUs.map((item, i) => {
            const Icon = ICONS[item.icon];
            const tint = TINTS[i % TINTS.length];
            return (
              <li key={item.title} data-reveal-item className={cn(i % 3 === 1 && "lg:mt-10")}>
                <article className="card group relative flex h-full flex-col overflow-hidden p-8 sm:p-9">
                  <span
                    aria-hidden
                    className="pointer-events-none absolute -right-2 -top-5 select-none font-serif text-[6.5rem] font-medium leading-none text-cloud transition-colors duration-700 group-hover:text-sage-soft"
                  >
                    {pad(i + 1)}
                  </span>
                  <span
                    className={cn(
                      "relative flex h-14 w-14 items-center justify-center rounded-2xl transition-[background-color,color,transform] duration-500 ease-out-soft group-hover:-rotate-6 group-hover:bg-sage group-hover:text-ink",
                      tint.chip,
                    )}
                  >
                    <Icon aria-hidden strokeWidth={1.4} className="h-6 w-6" />
                  </span>
                  <h3 className="relative mt-10 font-serif text-[1.6rem] font-medium leading-tight tracking-[-0.015em] transition-colors duration-500 group-hover:text-sage-deep">
                    {item.title}
                  </h3>
                  <p className="relative mt-3 text-graphite">{item.body}</p>
                  <span
                    aria-hidden
                    className={cn(
                      "absolute inset-x-0 bottom-0 h-[3px] origin-left scale-x-0 transition-transform duration-700 ease-out-soft group-hover:scale-x-100",
                      tint.bar,
                    )}
                  />
                </article>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
