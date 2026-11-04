"use client";

import { useRef } from "react";
import { ClipboardList, KeyRound, MessagesSquare, PenTool, Sparkles, type LucideIcon } from "lucide-react";
import { process } from "@/data/content";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { prefersReducedMotion } from "@/hooks/useReducedMotion";
import { Eyebrow, Lines } from "@/components/ui/Lines";
import { pad } from "@/lib/utils";

/** One icon per step, in the client's order: Consultation → Handover. */
const ICONS: LucideIcon[] = [MessagesSquare, ClipboardList, PenTool, Sparkles, KeyRound];

/**
 * Our Process — the five-step customer journey.
 * Desktop: a horizontal timeline; a sage progress line fills left → right as
 * the section scrolls through, and each step's marker lights up as the line
 * reaches it. Mobile/tablet: the same steps as a vertical timeline.
 */
export function Process() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const steps = gsap.utils.toArray<HTMLElement>("[data-process-step]");
      if (prefersReducedMotion()) {
        steps.forEach((s) => s.classList.add("is-on"));
        return;
      }
      const mm = gsap.matchMedia();
      // Horizontal fill on desktop, vertical fill below.
      mm.add("(min-width: 1024px)", () => {
        gsap.fromTo("[data-process-fill]", { scaleX: 0 }, {
          scaleX: 1,
          ease: "none",
          scrollTrigger: { trigger: "[data-process-list]", start: "top 75%", end: "bottom 55%", scrub: 0.6 },
        });
      });
      mm.add("(max-width: 1023px)", () => {
        gsap.fromTo("[data-process-fill]", { scaleY: 0 }, {
          scaleY: 1,
          ease: "none",
          scrollTrigger: { trigger: "[data-process-list]", start: "top 70%", end: "bottom 60%", scrub: 0.6 },
        });
      });
      steps.forEach((step, i) => {
        gsap.fromTo(
          step,
          { autoAlpha: 0, y: 36 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 1,
            delay: i * 0.08,
            ease: "power3.out",
            scrollTrigger: { trigger: "[data-process-list]", start: "top 80%", once: true },
          },
        );
        // Marker lights up once the progress line has (roughly) reached it.
        const t = window.matchMedia("(min-width: 1024px)").matches
          ? { trigger: "[data-process-list]", start: `top+=${i * 4}% 70%` }
          : { trigger: step, start: "top 62%" };
        ScrollTrigger.create({ ...t, onEnter: () => step.classList.add("is-on"), onLeaveBack: () => step.classList.remove("is-on") });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="process" aria-labelledby="process-title" className="section-y scroll-mt-[var(--header-h)] bg-mist">
      <div className="container-x">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <Eyebrow className="mb-10">Our process</Eyebrow>
            <Lines
              id="process-title"
              className="display-lg"
              lines={[
                "From consultation",
                <>
                  to <em className="text-sage-deep">handover.</em>
                </>,
              ]}
            />
          </div>
          <p data-reveal className="lede self-end lg:col-span-4 lg:col-start-9">
            Five clear steps — so you always know what happens next, and why.
          </p>
        </div>

        <ol data-process-list className="relative mt-16 grid gap-12 pl-16 sm:pl-20 lg:mt-24 lg:grid-cols-5 lg:gap-6 lg:pl-0 lg:pt-0">
          {/* The rail: vertical on small screens, horizontal through the markers on desktop. */}
          <span aria-hidden className="absolute bottom-6 left-[1.6rem] top-6 w-[2px] rounded bg-line sm:left-[1.85rem] lg:bottom-auto lg:left-[10%] lg:right-[10%] lg:top-[1.85rem] lg:h-[2px] lg:w-auto" />
          <span
            aria-hidden
            data-process-fill
            className="absolute bottom-6 left-[1.6rem] top-6 w-[2px] origin-top rounded bg-gradient-to-b from-sage to-haze sm:left-[1.85rem] lg:bottom-auto lg:left-[10%] lg:right-[10%] lg:top-[1.85rem] lg:h-[2px] lg:w-auto lg:origin-left lg:bg-gradient-to-r"
          />
          {process.map((step, i) => {
            const Icon = ICONS[i] ?? Sparkles;
            return (
              <li key={step.title} data-process-step className="process-step group relative lg:text-center">
                <span
                  aria-hidden
                  className="process-marker absolute -left-16 top-0 flex h-[3.25rem] w-[3.25rem] items-center justify-center rounded-full border border-line bg-paper text-graphite shadow-[var(--shadow-soft)] ring-8 ring-mist transition-[background-color,color,border-color,transform] duration-700 ease-out-soft group-hover:scale-110 sm:-left-20 sm:h-[3.75rem] sm:w-[3.75rem] lg:relative lg:left-auto lg:mx-auto"
                >
                  <Icon strokeWidth={1.4} className="h-6 w-6" />
                </span>
                <div className="rounded-[var(--radius-card)] border border-transparent p-1 transition-[background-color,border-color,box-shadow,transform] duration-700 ease-out-soft lg:mt-8 lg:px-4 lg:py-7 lg:group-hover:-translate-y-1 lg:group-hover:border-line lg:group-hover:bg-paper lg:group-hover:shadow-[var(--shadow-soft)]">
                  <p className="eyebrow text-sage-deep">{pad(i + 1)}</p>
                  <h3 className="mt-3 font-serif text-[clamp(1.6rem,2.2vw,2rem)] font-medium leading-tight tracking-[-0.015em]">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-graphite lg:mx-auto lg:max-w-[15rem]">{step.body}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
