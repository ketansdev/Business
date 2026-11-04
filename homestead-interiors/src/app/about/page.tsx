import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { ArtImage } from "@/components/ui/ArtImage";
import { Eyebrow, Lines } from "@/components/ui/Lines";
import { ButtonLink } from "@/components/ui/Button";
import { DraftBadge } from "@/components/ui/DraftBadge";
import { philosophy } from "@/data/content";
import { site } from "@/lib/site";
import { placed, placements } from "@/data/placements";
import { pad } from "@/lib/utils";
import { FinalCTA } from "@/sections/cta/FinalCTA";

export const metadata: Metadata = {
  title: "About",
  description:
    "Homestead Interiors designs contemporary, timeless interiors — thoughtfully planned around the way you live. Learn about our philosophy and approach.",
  alternates: { canonical: "/about" },
};

/**
 * EDITABLE STUDIO DETAILS — fill these in with verified facts only.
 * Each `null` section stays hidden on the live site.
 */
const studio = {
  story: null as string | null, // Founding story, in the studio's own words
  founder: null as { name: string; role: string; bio: string; image?: string } | null,
  team: [] as { name: string; role: string }[],
  credentials: [] as string[], // e.g. professional memberships, publications — verified only
};

const values = [
  { title: "Listen first", body: "We begin with conversation — how you live, what you love, and what a space needs to do." },
  { title: "Edit with care", body: "Fewer, better decisions. Every element earns its place in the room." },
  { title: "Honour materials", body: "Natural textures chosen for how they look, how they feel, and how they age." },
  { title: "Design for life", body: "Beauty that works every day, not just on the day a room is finished." },
];

export default function AboutPage() {
  const [intro] = placed(placements.about.introduction, site.contentPreview);
  const approach = placed(placements.about.approach, site.contentPreview);
  const showPlaceholders = site.contentPreview;
  return (
    <>
      <PageHeader
        eyebrow="About the studio"
        title={["Interiors that", <em key="e" className="text-sage-deep">feel like home.</em>]}
        intro={site.message}
      />

      {/* Brand introduction */}
      <section className="pb-[var(--section-y)]">
        <div className="container-x grid gap-12 lg:grid-cols-12">
          {intro && (
            <ArtImage
              src={intro.src}
              alt={intro.alt}
              kind={intro.kind}
              reveal
              parallax={0.08}
              priority
              className="lg:col-span-7"
              sizes="(min-width: 1024px) 58vw, 100vw"
            />
          )}
          <div className="flex flex-col justify-end lg:col-span-4 lg:col-start-9">
            <p data-reveal className="display-sm">
              Homestead Interiors is an interior design studio for people who want their spaces to feel calm, personal and
              quietly beautiful.
            </p>
            <p data-reveal className="mt-8 text-graphite">
              We create contemporary interiors with a timeless sensibility — balancing elegance with everyday comfort, and
              shaping every room around the people who use it.
            </p>
          </div>
        </div>
      </section>

      {/* Story — editable, hidden until provided */}
      {(studio.story || showPlaceholders) && (
        <section className="section-y bg-mist">
          <div className="container-x grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <Eyebrow>Our story</Eyebrow>
            </div>
            <div className="lg:col-span-7 lg:col-start-6">
              {studio.story ? (
                <p data-reveal className="display-sm">
                  {studio.story}
                </p>
              ) : (
                <div data-reveal className="rounded-[var(--radius-card)] border-2 border-dashed border-champagne/50 bg-paper p-8">
                  <DraftBadge>To be provided</DraftBadge>
                  <p className="mt-5 text-graphite">
                    The studio&apos;s founding story, founder profile, team and any verified credentials will appear here.
                    Add them to the <code className="text-ink">studio</code> object in{" "}
                    <code className="text-ink">src/app/about/page.tsx</code>. This block is hidden in production
                    until filled in.
                  </p>
                </div>
              )}
              {studio.founder && (
                <div className="mt-12">
                  <p className="eyebrow text-sage-deep">{studio.founder.role}</p>
                  <p className="mt-2 font-serif text-3xl">{studio.founder.name}</p>
                  <p className="mt-4 text-graphite">{studio.founder.bio}</p>
                </div>
              )}
              {studio.team.length > 0 && (
                <ul className="mt-12 grid gap-6 sm:grid-cols-2">
                  {studio.team.map((p) => (
                    <li key={p.name} className="card p-6">
                      <p className="font-serif text-2xl">{p.name}</p>
                      <p className="text-graphite">{p.role}</p>
                    </li>
                  ))}
                </ul>
              )}
              {studio.credentials.length > 0 && (
                <ul className="mt-12 space-y-2 text-graphite">
                  {studio.credentials.map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Philosophy */}
      <section className="section-y">
        <div className="container-x">
          <Eyebrow className="mb-10">Design philosophy</Eyebrow>
          <Lines className="display-lg max-w-4xl" lines={["Designed with intention.", <>Created to be <em className="text-sage-deep">lived in.</em></>]} />
          <ol data-reveal-stagger className="mt-16 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {philosophy.map((p, i) => (
              <li key={p.title} data-reveal-item className="card group p-7 lg:min-h-[18rem]">
                <p className="eyebrow flex h-10 w-10 items-center justify-center rounded-full bg-sage-soft text-sage-deep transition-colors duration-500 group-hover:bg-sage group-hover:text-ink">
                  {pad(i + 1)}
                </p>
                <h3 className="mt-10 font-serif text-[1.4rem] font-medium leading-tight tracking-[-0.015em]">{p.title}</h3>
                <p className="mt-4 text-sm text-graphite">{p.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Approach */}
      <section className="ambient section-y bg-mist">
        <div className="container-x grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Eyebrow className="mb-10">
              Our approach
            </Eyebrow>
            <Lines className="display-md" lines={["Calm rooms", <>begin with <em className="text-sage-deep">clear thinking.</em></>]} />
            <p data-reveal className="mt-10 max-w-md text-graphite">
              Every project moves through the same considered sequence — discover, conceptualise, design, refine and
              deliver — so decisions are made together and with confidence.
            </p>
            <div data-reveal className="mt-10">
              <ButtonLink href="/services" variant="solid">
                How we work
              </ButtonLink>
            </div>
          </div>
          <div className="grid grid-cols-2 items-start gap-5 lg:col-span-6 lg:col-start-7">
            {approach.map((ph, i) => (
              <ArtImage
                key={ph.src}
                src={ph.src}
                alt={ph.alt}
                kind={ph.kind}
                reveal
                className={i === 1 ? "mt-20" : undefined}
                sizes="(min-width: 1024px) 25vw, 50vw"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-y">
        <div className="container-x grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Eyebrow className="mb-10">Creative values</Eyebrow>
            <Lines className="display-md" lines={["What guides", <em key="e" className="text-sage-deep">every decision.</em>]} />
          </div>
          <dl data-reveal-stagger className="grid gap-4 sm:grid-cols-2 lg:col-span-7 lg:col-start-6">
            {values.map((v, i) => (
              <div key={v.title} data-reveal-item className="card p-8">
                <dt className="flex flex-col gap-5">
                  <span
                    className={`eyebrow flex h-10 w-10 items-center justify-center rounded-full ${
                      ["bg-sage-soft text-sage-deep", "bg-haze-soft text-haze-deep", "bg-champagne-soft text-champagne-deep", "bg-cloud text-ink"][i % 4]
                    }`}
                  >
                    {pad(i + 1)}
                  </span>
                  <span className="font-serif text-[1.7rem] font-medium tracking-[-0.02em]">{v.title}</span>
                </dt>
                <dd className="mt-4 text-graphite">{v.body}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <FinalCTA
        title={["See how we bring", "spaces to life."]}
        body="Explore a selection of interiors, or tell us about yours."
        cta={{ href: "/projects", label: "Explore our projects" }}
        secondary={{ href: "/contact", label: "Start your project" }}
      />
    </>
  );
}
