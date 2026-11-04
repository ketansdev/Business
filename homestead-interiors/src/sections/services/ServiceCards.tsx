import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Service } from "@/data/services";
import { DraftBadge } from "@/components/ui/DraftBadge";
import { blurProps, kindLabel } from "@/lib/media";
import { cn, pad } from "@/lib/utils";

const ACCENTS = ["bg-sage", "bg-haze", "bg-champagne"];
const CHIPS = ["bg-sage-soft text-sage-deep", "bg-haze-soft text-haze-deep", "bg-champagne-soft text-champagne-deep"];

/**
 * Three editorial service cards. Every photo sits in the same 4:5 frame so
 * the cards line up, but nothing is cropped: the whole photo is shown
 * (object-contain) over a softly blurred copy of itself that fills the
 * frame. On hover the whole frame zooms and lifts, the title slides and an
 * accent rule draws in.
 */
export function ServiceCards({ services, headingLevel = "h3" }: { services: Service[]; headingLevel?: "h2" | "h3" }) {
  const H = headingLevel;
  return (
    <ul data-reveal-stagger className="grid gap-x-8 gap-y-16 md:grid-cols-3 md:items-start">
      {services.map((s, i) => {
        const label = kindLabel(s.image.kind);
        return (
          <li key={s.slug} id={s.slug} data-reveal-item className={cn("scroll-mt-32", i === 1 && "md:mt-20")}>
            <article className="group relative">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[var(--radius-frame)] bg-cloud shadow-[var(--shadow-soft)] transition-[transform,box-shadow] duration-700 ease-out-soft group-hover:scale-[1.03] group-hover:shadow-[var(--shadow-lift)] group-focus-within:scale-[1.03]">
                {/* Blurred fill so every card has the same shape without cropping the photo */}
                <Image src={s.image.src} alt="" aria-hidden fill sizes="10vw" className="scale-110 object-cover opacity-70 blur-2xl" />
                <Image
                  src={s.image.src}
                  alt={s.image.alt}
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  {...blurProps(s.image.src)}
                  className="object-contain"
                />
                <span className="absolute left-4 top-4 flex gap-1.5">
                  <span className="eyebrow rounded-full bg-paper/90 px-3 py-1.5 text-ink shadow-[var(--shadow-soft)]">{pad(i + 1)}</span>
                  {label && (
                    <span className="rounded-full bg-paper/90 px-2.5 py-1.5 text-[0.58rem] font-bold uppercase tracking-[0.18em] text-graphite shadow-[var(--shadow-soft)]">
                      {label}
                    </span>
                  )}
                </span>
              </div>
              <div className="relative mt-7 pr-14">
                <span className={cn("eyebrow inline-flex rounded-full px-3 py-1", CHIPS[i % 3])}>Service {pad(i + 1)}</span>
                <H className="mt-4 font-serif text-[clamp(1.7rem,2.4vw,2.3rem)] font-medium leading-[1.05] tracking-[-0.02em] transition-[transform,color] duration-700 ease-out-soft group-hover:translate-x-1.5 group-hover:text-sage-deep">
                  {s.title}
                </H>
                {s.status === "draft" && <DraftBadge className="mt-3">Draft — awaiting confirmation</DraftBadge>}
                <p className="mt-3 text-graphite">{s.summary}</p>
                <span aria-hidden className={cn("mt-6 block h-[2px] w-12 origin-left rounded transition-[width] duration-700 ease-out-soft group-hover:w-24", ACCENTS[i % 3])} />
                <Link
                  href={s.related.href}
                  aria-label={`${s.title} — ${s.related.label}`}
                  className="absolute right-0 top-1 flex h-11 w-11 items-center justify-center rounded-full border border-line text-ink transition-[background-color,border-color,transform] duration-500 ease-out-soft hover:bg-sage group-hover:-rotate-12 group-hover:border-transparent group-hover:bg-sage"
                >
                  <ArrowUpRight strokeWidth={1.5} className="h-5 w-5" />
                </Link>
              </div>
            </article>
          </li>
        );
      })}
    </ul>
  );
}
