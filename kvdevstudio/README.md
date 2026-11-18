# KV DEV Studio — Website

Premium, immersive landing page for KV DEV Studio, a digital creative studio.

React 19 · Vite 7 · TypeScript · Tailwind CSS 4 · Framer Motion · GSAP ScrollTrigger · React Three Fiber / three.js / Drei · Lucide

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # typecheck + production build → dist/
npm run preview    # serve dist/
```

## Contact details

Email, phone and WhatsApp live in `src/lib/site.ts` → `CONTACT` (contact@kvdevstudio.com, +91 89763 23043,
wa.me/918976323043). The header "Let's Talk" CTA and the floating button open WhatsApp; the floating button steps
aside whenever an element marked `data-fab-avoid` passes under it.

## Before launch: replace these

| What | Where |
|---|---|
| Instagram profile URL (shows as "Soon" until set) | `src/lib/site.ts` → `CONTACT.instagram` |
| Taj Icecream cover (currently a designed brand board) and year | `src/lib/site.ts` → `PROJECTS` (add `image`) |
| Live project URLs (adds a "Visit site" button to the project panel) | `src/lib/site.ts` → `PROJECTS[].url` |

Portfolio covers for Melt Theory and Homestead Interiors come from those projects' own folders.
Regenerate them with `node scripts/prepare-images.mjs`.

## Scroll-driven hero

The hero is a pinned story: a 320svh runway (300svh on phones) behind a sticky 3D stage. GSAP ScrollTrigger
(lazy-loaded) scrubs the DOM timeline and feeds raw progress to the WebGL rig, which damps it every frame.

| Progress | What happens |
|---|---|
| 0–20% | Umbrella idles and rotates, objects float, copy entrance |
| 16–42% | Copy blurs away; umbrella travels to centre and settles its spin; intro tags hand over |
| 30–60% | Four service labels appear on the rib tips with glowing lime nodes; the frame picks up lime highlights |
| 58–83% | Four service objects (browser, map pin, social cards, type and mark) emerge from the tips on lime threads |
| 72–90% | Explore panel: hover/focus/tap a service to scale it, dim the rest and preview it; click to jump to its card |
| 84–100% | Composition lifts and dims as the Services section rises over it as a rounded sheet |

Windows live in `src/lib/heroState.ts` (`PHASE`); the choreography is in `src/components/Scene3D.tsx`.
Reduced motion (or no WebGL) skips the pin entirely and keeps the static hero.

## Cinematic services stage

Four service cards on one sticky 3D stage (CSS 3D, no WebGL): a 400svh runway, one GSAP ScrollTrigger (scrub 0.8)
driving a single focus value `t` (−2 → 3). Each card derives its role from `d = index − t`: active (sharp, centred),
upcoming (below, deeper, blurred), previous (above, receded, dimmed). Holds keep each card readable; the progress
rail and the 01–04 list navigate to each card's exact scroll position (`labelToScroll`). Hero service nodes use the
same navigator (`src/lib/serviceNav.ts`).

- Tablet (768–1023px): stacked card layout, shallower depth, numeric indicator.
- Phones, short screens (< 540px tall) and reduced motion: a plain stacked card list, no sticky sequence.
- Tune roles in `ROLES` and the rhythm in `ENTRANCE / TRANSITION / HOLD` (`src/components/services/ServiceStage.tsx`).

## Structure

```
src/
  App.tsx, main.tsx
  components/
    Header.tsx            floating pill nav, animated active indicator, mobile sheet
    Hero.tsx              copy + choreography; HeroStage.tsx mounts the 3D lazily
    Scene3D.tsx           R3F canvas: scroll-driven rig, cursor spotlight, label/node/thread projection
    three/                umbrellaGeometry.ts (procedural umbrella), Umbrella.tsx, FloatingObjects.tsx,
                          ServiceObjects.tsx + serviceTextures.ts (the four service objects),
                          Studio.tsx (lightformer env), fabricTexture.ts, fonts/ (2-glyph typeface subset)
    HeroFallback.tsx      SVG version when WebGL is unavailable (or the 3D errors)
    Services.tsx          intro + cinematic stage (services/ServiceStage.tsx) or stacked list (services/ServiceListCard.tsx)
    Marquee.tsx, Portfolio.tsx (+ portfolio/),
    About.tsx (+ About3D.tsx), Process.tsx, Contact.tsx, Footer.tsx, IntroCurtain.tsx
    ui/                   Button (magnetic), Reveal/MaskLines, SectionHeader
  hooks/  useActiveSection, useMagnetic, useInViewport, useLockBody, useMediaQuery, useReducedMotion
  lib/    site.ts (all content), heroState.ts (scroll story + service intent), serviceNav.ts, gsap.ts, env.ts, intro.ts, motion.ts, pointer.ts
design-system/kvdevstudio/MASTER.md   tokens and rules (UI/UX Pro Max + MotionSites)
```

## Performance and accessibility

- three.js, R3F and Drei ship in a lazy chunk fetched after first paint. The hero canvas mounts after the intro, pauses off-screen, and drops DPR on slow frames.
- The About canvas only mounts near the viewport.
- `prefers-reduced-motion`: no parallax, spin or loops; content renders in its final state.
- Keyboard: skip link, visible lime focus rings, Esc closes the menu and project panel, and focus is restored.

## QA flags

- `?intro=0` skips the once-per-session intro curtain
- `?reducedMotion=1` forces the reduced-motion experience
- `?webgl=0` forces the SVG fallback
- `?debug3d=1` re-enables three.js shader logs (off by default; on Windows they print harmless D3D compiler notes)
