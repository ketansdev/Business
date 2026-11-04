import type { ReactNode } from "react";
import { Eyebrow, Lines } from "@/components/ui/Lines";

/** Shared page opener for inner pages: bright, with soft sage and blue light fields. */
export function PageHeader({
  eyebrow,
  title,
  intro,
  aside,
}: {
  eyebrow: string;
  title: ReactNode[];
  intro?: string;
  aside?: ReactNode;
}) {
  return (
    <header className="ambient overflow-hidden bg-paper pb-14 pt-[calc(var(--header-h)+clamp(3.5rem,9vw,8rem))] md:pb-20">
      <div className="container-x grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <Eyebrow className="mb-10">{eyebrow}</Eyebrow>
          <Lines as="h1" className="display-xl" lines={title} />
        </div>
        {(intro || aside) && (
          <div data-reveal className="flex flex-col justify-end gap-8 lg:col-span-3 lg:col-start-10">
            {intro && <p className="lede">{intro}</p>}
            {aside}
          </div>
        )}
      </div>
      <div className="container-x mt-14 md:mt-20">
        <div data-draw className="h-[2px] rounded bg-gradient-to-r from-sage via-haze to-transparent" />
      </div>
    </header>
  );
}
