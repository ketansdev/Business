"use client";

import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { prefersReducedMotion } from "@/hooks/useReducedMotion";

const LenisContext = createContext<Lenis | null>(null);

/** Access the shared Lenis instance (null when smooth scroll is disabled). */
export function useLenis() {
  return useContext(LenisContext);
}

/**
 * Smooth scrolling, synchronised with GSAP's ticker so ScrollTrigger
 * and Lenis never fight. Disabled entirely for reduced-motion visitors.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const pathname = usePathname();
  const first = useRef(true);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const instance = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    instance.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => instance.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    setLenis(instance);

    return () => {
      gsap.ticker.remove(tick);
      instance.destroy();
      setLenis(null);
    };
  }, []);

  // Start every new page at the top — unless the URL points at a section
  // (e.g. "/#process" from another page), in which case glide to it.
  useEffect(() => {
    if (first.current) {
      first.current = false;
      if (window.location.hash) setTimeout(() => scrollToHash(window.location.hash, lenis, true), 400);
      return;
    }
    if (window.location.hash) {
      lenis?.scrollTo(0, { immediate: true, force: true });
      setTimeout(() => scrollToHash(window.location.hash, lenis), 350);
      return;
    }
    lenis?.scrollTo(0, { immediate: true, force: true });
  }, [pathname, lenis]);

  // Same-page section links ("/#why", "#contact"…) scroll smoothly instead of jumping.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a[href*='#']") as HTMLAnchorElement | null;
      if (!a || a.target === "_blank") return;
      const url = new URL(a.href, window.location.href);
      if (url.origin !== window.location.origin || url.pathname !== window.location.pathname || !url.hash || url.hash === "#main") return;
      if (!document.getElementById(decodeURIComponent(url.hash.slice(1)))) return;
      e.preventDefault();
      window.history.pushState(null, "", url.hash);
      // Let a closing mobile menu release the scroll lock first.
      setTimeout(() => scrollToHash(url.hash, lenis), 60);
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [lenis]);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}

/** Scroll to the element named by a "#hash", leaving room for the fixed header. */
function scrollToHash(hash: string, lenis: Lenis | null, immediate = false) {
  const el = document.getElementById(decodeURIComponent(hash.slice(1)));
  if (!el) return;
  const offset = -(document.querySelector("header")?.getBoundingClientRect().height ?? 80);
  if (lenis) lenis.scrollTo(el, { offset, force: true, immediate });
  else window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY + offset, behavior: immediate ? "auto" : "smooth" });
}
