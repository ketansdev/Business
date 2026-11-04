"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { site } from "@/lib/site";
import { pad } from "@/lib/utils";
import { gsap, useGSAP, ease } from "@/lib/gsap";
import { useLenis } from "@/components/layout/SmoothScroll";
import { prefersReducedMotion } from "@/hooks/useReducedMotion";

type Props = { open: boolean; onClose: () => void; isActive: (href: string) => boolean };

/** Full-screen navigation overlay for tablet and mobile. */
export function MobileMenu({ open, onClose, isActive }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const lenis = useLenis();

  useGSAP(
    () => {
      const reduced = prefersReducedMotion();
      tl.current = gsap
        .timeline({ paused: true, defaults: { ease: ease.expo } })
        .fromTo(root.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.01 })
        .fromTo(
          root.current,
          { clipPath: "inset(0% 0% 100% 0%)" },
          { clipPath: "inset(0% 0% 0% 0%)", duration: reduced ? 0.01 : 0.9, ease: ease.inOut },
        )
        .fromTo(
          "[data-menu-item]",
          { yPercent: 110 },
          { yPercent: 0, duration: reduced ? 0.01 : 1, stagger: 0.06 },
          reduced ? 0 : 0.35,
        )
        .fromTo("[data-menu-foot]", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.6 }, reduced ? 0 : 0.7);
    },
    { scope: root },
  );

  useEffect(() => {
    const t = tl.current;
    if (!t) return;
    if (open) {
      t.timeScale(1).play();
      lenis?.stop();
      document.documentElement.style.overflow = "hidden";
      // Move focus into the dialog.
      requestAnimationFrame(() => root.current?.querySelector<HTMLElement>("a")?.focus());
    } else {
      t.timeScale(1.6).reverse();
      lenis?.start();
      document.documentElement.style.overflow = "";
    }
  }, [open, lenis]);

  // Escape to close + simple focus trap.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key !== "Tab" || !root.current) return;
      const focusables = Array.from(root.current.querySelectorAll<HTMLElement>("a, button"));
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <div
      ref={root}
      id="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Site navigation"
      aria-hidden={!open}
      inert={!open}
      className="ambient invisible fixed inset-0 z-40 flex flex-col bg-paper text-ink lg:hidden"
    >
      <nav aria-label="Mobile" className="container-x flex flex-1 flex-col justify-center pt-[var(--header-h)]">
        <ul className="divide-y divide-line border-y border-line">
          {site.nav.map((item, i) => (
            <li key={item.href} className="overflow-hidden">
              <div data-menu-item>
                <Link
                  href={item.href}
                  onClick={onClose}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className="group flex items-center gap-5 py-3 sm:py-4"
                >
                  <span className="eyebrow w-6 text-sage-deep">{pad(i + 1)}</span>
                  <span className="flex-1 font-serif text-[clamp(1.9rem,8vw,3.75rem)] font-medium leading-none tracking-[-0.03em] transition-[transform,color] duration-700 ease-out-soft group-hover:translate-x-2 group-hover:text-sage-deep group-aria-[current=page]:italic group-aria-[current=page]:text-sage-deep">
                    {item.label}
                  </span>
                  <span
                    aria-hidden
                    className="h-2.5 w-2.5 rounded-full bg-sage opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-aria-[current=page]:opacity-100"
                  />
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </nav>
      <div data-menu-foot className="container-x flex flex-col gap-5 py-8 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-serif text-xl italic text-graphite">{site.tagline}</p>
        <Link
          href="/contact"
          onClick={onClose}
          className="eyebrow self-start rounded-full bg-ink px-6 py-3.5 !tracking-[0.18em] text-paper transition-colors duration-500 hover:bg-sage hover:text-ink sm:self-auto"
        >
          Book a consultation
        </Link>
      </div>
    </div>
  );
}
