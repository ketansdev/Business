"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP, ease } from "@/lib/gsap";
import { prefersReducedMotion } from "@/hooks/useReducedMotion";

// The very first page load has its own entrance (hero loader / SSR content),
// so the curtain only plays on client-side navigations.
let firstLoad = true;

/**
 * Page entrance: a soft sage-to-grey curtain lifts away and the page settles in.
 * Mounted from app/template.tsx so it re-runs on every route change.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const curtain = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (firstLoad) {
      // Deferred so React Strict Mode's double-invoke in dev also skips.
      setTimeout(() => (firstLoad = false), 0);
      return;
    }
    if (prefersReducedMotion()) return;
    gsap
      .timeline()
      .set(curtain.current, { display: "block" })
      .fromTo(
        curtain.current,
        { scaleY: 1, transformOrigin: "top center" },
        { scaleY: 0, duration: 1, ease: ease.inOut },
      )
      .fromTo(
        content.current,
        { y: 40, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 1.1, ease: ease.out, clearProps: "transform,opacity,visibility" },
        0.2,
      )
      .set(curtain.current, { display: "none" });
  });

  return (
    <>
      <div ref={curtain} aria-hidden className="pointer-events-none fixed inset-0 z-[70] hidden bg-gradient-to-b from-sage-soft to-mist" />
      <div ref={content}>{children}</div>
    </>
  );
}
