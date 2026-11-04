"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

// Register once, client side only.
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
  gsap.defaults({ ease: "power3.out", duration: 1.1 });
}

/** Shared easing language — slow, architectural, never bouncy. */
export const ease = {
  out: "power3.out",
  inOut: "power2.inOut",
  expo: "expo.out",
  soft: "sine.inOut",
} as const;

export { gsap, ScrollTrigger, useGSAP };
