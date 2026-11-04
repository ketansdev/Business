import { ButtonLink } from "@/components/ui/Button";
import { Lines } from "@/components/ui/Lines";

/**
 * 09 — Closing invitation. A rounded, light panel lit by soft sage and blue
 * light fields. Photo-free on purpose: every photograph has one home elsewhere.
 */
export function FinalCTA({
  title = ["Let's create a space", "that feels like you."],
  body = "Have a vision for your space? Let's bring it to life.",
  cta = { href: "/contact", label: "Start your project" },
  secondary,
}: {
  title?: [string, string];
  body?: string;
  cta?: { href: string; label: string };
  secondary?: { href: string; label: string };
}) {
  return (
    <section aria-labelledby="cta-title" className="bg-paper px-3 pb-3 pt-[var(--section-y)] sm:px-4 sm:pb-4">
      <div className="relative isolate overflow-hidden rounded-[2rem] bg-mist text-ink">

        <div aria-hidden className="absolute -left-20 -top-24 -z-10 h-[26rem] w-[26rem] rounded-full bg-sage/30 blur-3xl" />
        <div aria-hidden className="absolute -bottom-28 -right-16 -z-10 h-[28rem] w-[28rem] rounded-full bg-haze/35 blur-3xl" />

        <div className="container-x flex min-h-[78svh] flex-col items-center justify-center py-28 text-center">
          <p
            data-reveal
            className="eyebrow mb-10 inline-flex items-center gap-2.5 rounded-full border border-line bg-paper/80 px-4 py-2 text-sage-deep shadow-[var(--shadow-soft)]"
          >
            <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-sage" />
            Begin your project
          </p>
          <Lines
            id="cta-title"
            className="display-lg max-w-5xl"
            lines={[
              title[0],
              <>
                <em className="text-sage-deep">{title[1]}</em>
              </>,
            ]}
          />
          <p data-reveal className="lede mt-8 max-w-md !text-ink/70">
            {body}
          </p>
          <div data-reveal data-reveal-delay="0.15" className="mt-11 flex flex-col gap-3 sm:flex-row sm:gap-4">
            <ButtonLink href={cta.href} variant="solid">
              {cta.label}
            </ButtonLink>
            {secondary && (
              <ButtonLink href={secondary.href} variant="outline" arrow={false}>
                {secondary.label}
              </ButtonLink>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
