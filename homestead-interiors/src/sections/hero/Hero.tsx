"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type MouseEvent } from "react";
import { ArrowDown } from "lucide-react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { site } from "@/lib/site";
import { useWebGLSupport } from "@/hooks/useWebGLSupport";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useLenis } from "@/components/layout/SmoothScroll";
import { ButtonLink } from "@/components/ui/Button";
import { playHeroIntro } from "@/animations/hero/heroIntro";
import { HeroFallback } from "./HeroFallback";

// three.js + R3F are only downloaded on the client, after first paint.
const LivingRoomScene = dynamic(() => import("@/three/scenes/LivingRoomScene"), {
  ssr: false,
  loading: () => null,
});

const BRAND = "HOMESTEAD INTERIORS";

function detectQuality(): "high" | "low" {
  if (typeof window === "undefined") return "high";
  const small = window.matchMedia("(max-width: 820px)").matches;
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const cores = navigator.hardwareConcurrency ?? 8;
  return small || coarse || cores <= 4 ? "low" : "high";
}

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const scrollProgress = useRef(0);
  const webgl = useWebGLSupport();
  const reduced = useReducedMotion();
  const lenis = useLenis();
  const [quality, setQuality] = useState<"high" | "low">("high");
  const [inView, setInView] = useState(true);
  const [ready, setReady] = useState(false);
  const played = useRef(false);

  useEffect(() => setQuality(detectQuality()), []);

  // Fallback path is "ready" immediately; also guard against a stalled GPU.
  useEffect(() => {
    if (webgl === "unsupported") setReady(true);
    const t = window.setTimeout(() => setReady(true), 7000);
    return () => window.clearTimeout(t);
  }, [webgl]);

  const onSceneReady = useCallback(() => setReady(true), []);

  // Play the intro once, after a short minimum so the loader never flickers.
  useGSAP(
    () => {
      if (!ready || played.current || !root.current) return;
      played.current = true;
      const delay = reduced ? 0 : 0.5;
      gsap.delayedCall(delay, () => root.current && playHeroIntro(root.current, { reduced }));
    },
    { scope: root, dependencies: [ready, reduced] },
  );

  // Scroll: feed the camera dolly + lift the copy away as the hero exits.
  useGSAP(
    () => {
      if (!root.current) return;
      const st = ScrollTrigger.create({
        trigger: root.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
        onUpdate: (self) => (scrollProgress.current = self.progress),
      });
      if (!reduced) {
        gsap.to("[data-hero-copy]", {
          yPercent: -18,
          autoAlpha: 0,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: "60% top", scrub: true },
        });
        gsap.to("[data-hero-veil]", {
          autoAlpha: 1,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "35% top", end: "bottom top", scrub: true },
        });
      }
      return () => st.kill();
    },
    { scope: root, dependencies: [reduced] },
  );

  // Stop rendering the 3D scene entirely when it's off screen.
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { rootMargin: "100px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const toApproach = (e: MouseEvent) => {
    const target = document.getElementById("approach");
    if (!target) return;
    e.preventDefault();
    if (lenis) lenis.scrollTo(target, { offset: -40 });
    else target.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
  };

  return (
    <section
      ref={root}
      aria-labelledby="hero-title"
      className="relative h-[100svh] min-h-[620px] w-full overflow-hidden bg-paper p-2 text-ink sm:p-3"
    >
      {/* The room sits in a rounded "window" framed by white — bright and gallery-like. */}
      <div className="relative h-full w-full overflow-hidden rounded-[1.5rem] bg-mist sm:rounded-[2rem]">
      {/* Stage: 3D room, or the still fallback */}
      <div data-hero-stage className="absolute inset-0">
        {webgl === "unsupported" && <HeroFallback />}
        {webgl === "supported" && (
          <LivingRoomScene
            scrollProgress={scrollProgress}
            active={inView}
            reducedMotion={reduced}
            quality={quality}
            onReady={onSceneReady}
          />
        )}
      </div>

      {/* Legibility washes */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.95)_0%,rgba(255,255,255,0.78)_30%,rgba(255,255,255,0.18)_56%,rgba(255,255,255,0)_70%)] max-md:bg-[linear-gradient(0deg,rgba(255,255,255,0.98)_0%,rgba(255,255,255,0.86)_46%,rgba(255,255,255,0)_74%)]"
      />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-paper/70 to-transparent" />
      {/* Soft sage + blue light fields for a fresher, airier hero */}
      <div aria-hidden className="pointer-events-none absolute -left-24 top-1/4 h-[28rem] w-[28rem] rounded-full bg-sage/20 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -top-32 right-[18%] h-[26rem] w-[26rem] rounded-full bg-haze/25 blur-3xl" />
      <div data-hero-veil aria-hidden className="pointer-events-none invisible absolute inset-0 bg-paper opacity-0" />

      {/* Copy */}
      <div data-hero-copy className="container-x relative z-10 flex h-full flex-col justify-end pb-[clamp(5.5rem,11vh,9rem)] md:justify-center md:pb-0 md:pt-[var(--header-h)]">
        <div className="max-w-[46rem]">
          <p data-hero-brand aria-hidden className="mb-7 flex w-fit items-center overflow-hidden rounded-full border border-line bg-paper/80 px-4 py-2 font-sans text-[0.62rem] font-bold tracking-[0.34em] text-sage-deep shadow-[var(--shadow-soft)] backdrop-blur-md sm:text-[0.7rem]">
            <span className="mr-3 inline-block h-1.5 w-1.5 rounded-full bg-sage" />
            {BRAND.split("").map((ch, i) => (
              <span key={i} className="inline-block whitespace-pre">
                {ch}
              </span>
            ))}
          </p>
          <h1 id="hero-title" className="display-xl">
            <span className="sr-only">{site.name} — </span>
            <span className="line-mask">
              <span className="line-inner">Spaces that inspire.</span>
            </span>
            <span className="line-mask">
              <span className="line-inner">
                <em className="text-sage-deep">Interiors</em> that feel
              </span>
            </span>
            <span className="line-mask">
              <span className="line-inner">like home.</span>
            </span>
          </h1>
          <p data-hero-fade className="lede mt-8 max-w-md !text-ink/75">
            {site.message}
          </p>
          <div data-hero-fade className="mt-10 flex flex-col gap-3 sm:flex-row sm:gap-4">
            <ButtonLink href="/projects">Explore our work</ButtonLink>
            <ButtonLink href="/#approach" variant="outline" arrow={false} onClick={toApproach}>
              Discover our approach
            </ButtonLink>
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <Link
        href="#introduction"
        data-hero-fade
        className="absolute bottom-6 right-[var(--gutter)] z-10 hidden items-center gap-3 rounded-full border border-line bg-paper/80 py-2.5 pl-5 pr-3 eyebrow !tracking-[0.18em] text-ink/80 shadow-[var(--shadow-soft)] backdrop-blur-md transition-colors duration-500 hover:text-ink md:flex"
        onClick={(e) => {
          const t = document.getElementById("introduction");
          if (!t) return;
          e.preventDefault();
          if (lenis) lenis.scrollTo(t);
          else t.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
        }}
      >
        Scroll to enter
        <span className="relative flex h-7 w-px overflow-hidden rounded bg-line">
          <span className="absolute inset-x-0 top-0 h-1/2 bg-sage motion-safe:animate-[cue_2.2s_ease-in-out_infinite]" />
        </span>
        <ArrowDown aria-hidden className="sr-only" />
        <style>{`@keyframes cue{0%{transform:translateY(-100%)}60%,100%{transform:translateY(200%)}}`}</style>
      </Link>

      </div>

      {/* Without JavaScript there is no intro — never leave the loader covering the page. */}
      <noscript>
        <style>{`[data-hero-loader]{display:none!important}`}</style>
      </noscript>

      {/* Loader */}
      <div
        data-hero-loader
        role="status"
        aria-live="polite"
        className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-paper"
      >
        <p className="font-serif text-3xl font-medium tracking-[0.22em] sm:text-4xl">HOMESTEAD</p>
        <p className="eyebrow mt-3 !tracking-[0.46em] text-sage-deep">Interiors</p>
        <span className="mt-10 block h-[3px] w-40 overflow-hidden rounded-full bg-cloud">
          <span
            data-hero-loader-line
            className="block h-full w-full origin-left scale-x-[0.35] rounded-full bg-gradient-to-r from-sage to-haze motion-safe:animate-pulse"
          />
        </span>
        <span className="sr-only">{ready ? "Loaded" : "Preparing the space…"}</span>
      </div>
    </section>
  );
}
