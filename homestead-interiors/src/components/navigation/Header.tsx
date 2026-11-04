"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";
import { Wordmark } from "./Wordmark";
import { MobileMenu } from "./MobileMenu";
import { ButtonLink } from "@/components/ui/Button";

/**
 * Transparent over full-bleed heroes, then settles into a bright white bar with
 * a soft shadow. Primary links sit in a frosted capsule; the current page is a
 * solid pill. Hides while reading downwards, returns when scrolling up.
 */
export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const lastY = useRef(0);

  const isProjectDetail = /^\/projects\/[^/]+/.test(pathname);
  const lightTone = isProjectDetail && !scrolled && !menuOpen;

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      setHidden(y > 320 && y > lastY.current + 4);
      if (y < lastY.current - 4 || y < 320) setHidden(false);
      lastY.current = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  useEffect(() => setMenuOpen(false), [pathname]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <>
      <a
        href="#main"
        className="sr-only z-[100] rounded-full bg-ink px-4 py-2 text-paper focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[transform,background-color,color,box-shadow] duration-700 ease-out-soft",
          scrolled && !menuOpen ? "bg-paper/90 shadow-[0_1px_0_var(--color-line),0_12px_32px_-24px_rgb(37_42_48/0.25)] backdrop-blur-xl" : "bg-transparent",
          hidden && !menuOpen ? "-translate-y-full" : "translate-y-0",
          lightTone ? "text-paper" : "text-ink",
        )}
      >
        <div className="container-x flex h-[var(--header-h)] items-center justify-between">
          <Wordmark className="relative z-[60]" onClick={() => setMenuOpen(false)} />

          <nav aria-label="Primary" className="hidden lg:block">
            <ul
              className={cn(
                "flex items-center gap-1 rounded-full border p-1.5 backdrop-blur-md transition-colors duration-700",
                lightTone ? "border-paper/25 bg-paper/10" : "border-line bg-paper/75 shadow-[var(--shadow-soft)]",
              )}
            >
              {site.nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className={cn(
                      "eyebrow block whitespace-nowrap rounded-full px-3 py-2.5 !tracking-[0.12em] xl:px-4 2xl:px-5 2xl:!tracking-[0.16em] transition-[background-color,color] duration-500 ease-out-soft",
                      isActive(item.href)
                        ? lightTone
                          ? "bg-paper text-ink"
                          : "bg-ink text-paper"
                        : lightTone
                          ? "hover:bg-paper/15"
                          : "text-ink/75 hover:bg-sage-soft hover:text-ink",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-4">
            <ButtonLink
              href="/contact"
              variant={lightTone ? "light" : "solid"}
              className="hidden !py-3.5 !pl-6 !pr-4 xl:inline-flex"
            >
              Book a consultation
            </ButtonLink>
            <button
              type="button"
              className={cn(
                "relative z-[60] flex h-12 w-12 items-center justify-center rounded-full border transition-colors duration-500 lg:hidden",
                lightTone ? "border-paper/30 bg-paper/10 backdrop-blur-md" : "border-line bg-paper shadow-[var(--shadow-soft)]",
              )}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              onClick={() => setMenuOpen((v) => !v)}
            >
              <span className="relative block h-3 w-6">
                <span
                  className={cn(
                    "absolute left-0 top-0 h-[1.5px] w-full rounded bg-current transition-transform duration-500 ease-out-soft",
                    menuOpen && "translate-y-1.5 rotate-45",
                  )}
                />
                <span
                  className={cn(
                    "absolute bottom-0 right-0 h-[1.5px] rounded bg-current transition-all duration-500 ease-out-soft",
                    menuOpen ? "w-full -translate-y-1.5 -rotate-45" : "w-4",
                  )}
                />
              </span>
            </button>
          </div>
        </div>
      </header>
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} isActive={isActive} />
    </>
  );
}
