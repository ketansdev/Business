"use client";

import { useRef, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { gsap, ScrollTrigger, useGSAP, ease } from "@/lib/gsap";
import { prefersReducedMotion } from "@/hooks/useReducedMotion";

/**
 * GLOBAL SCROLL ANIMATION SYSTEM
 * ------------------------------------------------------------------
 * Pages stay as server components and opt into motion with data attributes.
 * This one client wrapper wires them up — one ScrollTrigger per element,
 * created and reverted together, so there are no duplicates or leaks.
 *
 *   data-reveal              fade + rise when it enters the viewport
 *   data-reveal-stagger      children with [data-reveal-item] stagger in
 *   data-lines               every .line-inner inside slides up (use <Lines>)
 *   data-mask                soft focus-in for a photo frame (never clips it)
 *   data-parallax="0.12"     the element drifts gently on scroll
 *   data-draw                hairline that draws from left to right
 *
 * Reduced motion: every element is simply shown in its final state.
 */
export function ScrollAnimations({ children }: { children: ReactNode }) {
  const scope = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;
      const q = <T extends Element = HTMLElement>(sel: string) => Array.from(root.querySelectorAll<T & Element>(sel)) as T[];

      if (prefersReducedMotion()) {
        gsap.set(q("[data-reveal], [data-reveal-item], .line-inner, [data-mask], [data-draw]"), {
          clearProps: "all",
          opacity: 1,
        });
        return;
      }

      const start = "top 86%";

      q("[data-lines]").forEach((el) => {
        const lines = el.querySelectorAll(".line-inner");
        gsap.fromTo(
          lines,
          { yPercent: 115 },
          {
            yPercent: 0,
            duration: 1.25,
            ease: ease.expo,
            stagger: 0.09,
            scrollTrigger: { trigger: el, start, once: true },
          },
        );
      });

      q("[data-reveal]").forEach((el) => {
        gsap.fromTo(
          el,
          { autoAlpha: 0, y: 28 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 1.2,
            delay: Number(el.dataset.revealDelay ?? 0),
            scrollTrigger: { trigger: el, start, once: true },
          },
        );
      });

      q("[data-reveal-stagger]").forEach((group) => {
        const items = group.querySelectorAll("[data-reveal-item]");
        gsap.fromTo(
          items,
          { autoAlpha: 0, y: 32 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 1.1,
            stagger: 0.12,
            scrollTrigger: { trigger: group, start, once: true },
          },
        );
      });

      // Photo reveal: a soft focus-in. Opacity + blur only — the photo is never
      // clipped or scaled, so it is always shown whole.
      q("[data-mask]").forEach((el) => {
        gsap.fromTo(
          el,
          { autoAlpha: 0, filter: "blur(14px)" },
          {
            autoAlpha: 1,
            filter: "blur(0px)",
            duration: 1.3,
            ease: ease.out,
            clearProps: "filter,opacity,visibility",
            scrollTrigger: { trigger: el, start: "top 90%", once: true },
          },
        );
      });

      // Parallax drifts the whole frame a few pixels — nothing inside it moves,
      // so no part of the photo is pushed out of view.
      q("[data-parallax]").forEach((el) => {
        const px = Number(el.dataset.parallax || 0.12) * 260;
        gsap.fromTo(
          el,
          { y: px / 2 },
          {
            y: -px / 2,
            ease: "none",
            scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
          },
        );
      });

      q("[data-draw]").forEach((el) => {
        gsap.fromTo(
          el,
          { scaleX: 0, transformOrigin: "left center" },
          { scaleX: 1, duration: 1.6, ease: ease.inOut, scrollTrigger: { trigger: el, start, once: true } },
        );
      });

      // Recalculate once web fonts and images settle.
      document.fonts?.ready.then(() => ScrollTrigger.refresh());
    },
    { scope, dependencies: [pathname], revertOnUpdate: true },
  );

  return <div ref={scope}>{children}</div>;
}
