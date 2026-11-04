import { gsap, ease } from "@/lib/gsap";

/**
 * Hero entrance, played once the 3D room (or its fallback) is ready:
 *   loader exits → room fades up → brand line → headline lines → copy → CTAs → scroll cue
 */
export function playHeroIntro(root: HTMLElement, { reduced }: { reduced: boolean }) {
  const q = gsap.utils.selector(root);

  if (reduced) {
    gsap.set(q("[data-hero-loader]"), { autoAlpha: 0, display: "none" });
    gsap.set(q("[data-hero-stage], [data-hero-fade], [data-hero-brand] span, .line-inner"), { clearProps: "all" });
    return gsap.timeline();
  }

  return gsap
    .timeline({ defaults: { ease: ease.expo } })
    .to(q("[data-hero-loader-line]"), { scaleX: 1, duration: 0.6, ease: ease.inOut })
    .to(q("[data-hero-loader]"), { yPercent: -100, duration: 1.2, ease: ease.inOut }, "+=0.1")
    .set(q("[data-hero-loader]"), { display: "none" })
    .fromTo(q("[data-hero-stage]"), { autoAlpha: 0, scale: 1.06 }, { autoAlpha: 1, scale: 1, duration: 2.4, ease: ease.out }, "-=0.9")
    .fromTo(q("[data-hero-brand] span"), { yPercent: 120 }, { yPercent: 0, duration: 1.2, stagger: 0.035 }, "-=1.8")
    .fromTo(q("h1 .line-inner"), { yPercent: 115 }, { yPercent: 0, duration: 1.5, stagger: 0.12 }, "-=1.0")
    .fromTo(q("[data-hero-fade]"), { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 1.2, stagger: 0.1, ease: ease.out }, "-=1.0");
}
