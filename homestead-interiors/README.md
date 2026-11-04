# Homestead Interiors — Website

*Spaces that inspire. Interiors that feel like home.*

An editorial, immersive website for Homestead Interiors: a real-time 3D living room in the hero, GSAP-driven motion throughout, and a content model that keeps unverified business information clearly marked or hidden.

---

## Visual theme (v2 — bright)

The original beige/brown theme was replaced with a bright contemporary one. Content, pages, routes, images and features are unchanged.

| Token | Hex | Use |
|---|---|---|
| `paper` | #FFFFFF | Primary background |
| `mist` | #F4F5F6 | Secondary background, form fields |
| `cloud` | #ECEFF1 | Card fills, image placeholders |
| `line` | #E1E5E8 | Borders, hairlines |
| `ink` | #252A30 | Primary text, solid buttons, footer panel |
| `graphite` | #68717A | Secondary text |
| `sage` | #91A58B | Main accent: button hover fills, dots, rules, active states |
| `haze` | #A9C5D8 | Muted blue: soft light fields, chips |
| `champagne` | #C5A66A | Highlight: draft/sample badges and notices |

**Contrast rule.** Sage, blue and champagne are too light to read as text on white (1.8–2.6 : 1). They're used as fills, lines and glows, and as text only on the charcoal footer. Accent-coloured *text* on light backgrounds uses the `-deep` shades (`sage-deep` #56704F, `haze-deep` #4E7590, `champagne-deep` #8A6A2E), which keep the hue and pass WCAG AA (~5 : 1). Slate grey fails on #ECEFF1 (4.3 : 1), so `cloud` is kept behind large type and fills only.

**Typography.** Headings: Fraunces (variable, optical sizing) at weight 500, italic 400 for accent words. Body: Manrope 400–700.

**UI.** Pill buttons with a rising sage fill and lift; capsule navigation with a solid active pill; 20px rounded image frames with gentle hover zoom; white hover cards with soft shadows; hero and closing CTA set in rounded "windows" framed by white; charcoal footer as an inset rounded panel. The 3D room was re-lit and re-materialled to match (white plaster, pale oak, white bouclé sofa, sage chair, blue ceramics, champagne lamp, blue-sky window).

All placeholder illustrations have since been replaced by the studio's own photography (see **Photography** below).

---

## ⚠️ Build status — read first

This project was written in an environment **without access to the npm registry**, so `npm install` / `next build` could **not** be run there. What *was* verified:

| Check | Status |
|---|---|
| TypeScript check of all project code (third-party packages stubbed) — imports, props between components, null-safety | ✅ passes |
| Sample imagery rendered and reviewed in headless Chrome | ✅ |
| `next build` with real dependencies | ⏳ run locally (step 1 below) |
| 3D scene visual tuning (lighting / exposure / camera framing) | ⏳ needs a first look in a browser |
| Enquiry form → WhatsApp | ✅ message and link tested in a browser (see *Enquiry form*) |

If the first build reports a type error from a library's real typings, it will be a small signature fix — the project code itself is complete.

---

## Run locally

Requires **Node.js 18.18+** (20 LTS recommended).

```bash
npm install
cp .env.example .env.local     # optional for local dev
npm run dev                    # http://localhost:3000
```

Production check:

```bash
npm run typecheck
npm run build
npm start
```

## Deploy to Vercel

1. Push the folder to a Git repository (GitHub / GitLab / Bitbucket).
2. In Vercel: **Add New → Project →** import the repo. Framework preset: **Next.js** (auto-detected). No build settings to change.
3. Add environment variables (Project → Settings → Environment Variables):
   - `NEXT_PUBLIC_SITE_URL` — the live domain, e.g. `https://www.homesteadinteriors.com`
   - `NEXT_PUBLIC_CONTENT_PREVIEW` — `false` for launch (see below)
4. Deploy. Add the custom domain under Settings → Domains.

Or with the CLI: `npx vercel` then `npx vercel --prod`.

---

## Content & honesty model

Nothing about the business is invented. Every unverified item is either labelled or hidden:

| Content | Where to edit | Until confirmed |
|---|---|---|
| Contact details, socials | `src/lib/site.ts` | `null` → not rendered anywhere |
| Projects | `src/data/projects.ts` | 7 projects built from the studio's supplied photos/renders/video. Copy describes only what is visible; **titles are working titles** (except Sanjivani Hospital) and location/year/scope are left blank until confirmed |
| Services | `src/data/services.ts` | All `status: "draft"`, labelled “Draft — awaiting confirmation” |
| Testimonials | `src/data/testimonials.ts` | **Genuine, client-approved reviews only.** The list is empty, so the section shows “Our Commitment to Every Space” (the studio's tagline and its five design principles) and no review cards |
| Studio story / founder / team / credentials | `studio` object in `src/app/about/page.tsx` | Hidden (placeholder in preview) |
| Philosophy, process, values | `src/data/content.ts` | Brand copy from the brief — edit freely |

**Preview mode** (`NEXT_PUBLIC_CONTENT_PREVIEW`, default `true`) shows drafts and samples with labels so the full design can be reviewed. Set it to **`false`** for launch: only confirmed services, non-sample projects and real testimonials are published.

### Adding a project or photo
1. Put photos in `public/images/projects/<slug>/` (JPG, ideally 2400px+ on the long edge — Next.js serves AVIF/WebP at the right size automatically).
2. Run `python3 scripts/build-media-manifest.py` (needs Pillow). It records each image's dimensions and a tiny blur preview in `src/data/media.generated.ts`.
3. Add or edit the entry in `src/data/projects.ts`. Give every image a `kind` — `"photo"`, `"render"` or `"site"` — so it's labelled honestly.

---

## Photography

### Sources and how they were prepared
56 photographs (54 in projects + 2 service images) and 3 walkthrough videos, all from files the studio supplied (three batches of WhatsApp images + videos). Edits were limited to:
- **Waiting-area photo flipped horizontally** — the original was mirrored (signs read backwards).
- **Hospital frontage cropped** — removed a decorative border baked into the image.
- **TV screens darkened** where they showed film footage (in the video stills and in three photos of the second batch), so they look switched off.
- **Near-duplicates dropped** — shots that were almost identical to another (e.g. a second corner view of the Travertine render, overlapping living-room stills) were removed so no space looks repeated.
- **Walkthroughs trimmed and re-encoded** (H.264, faststart, **audio removed**) — cut to avoid TV footage and people.
- **Third batch (Nov 2026):** 33 photos + 11 videos inspected. Kept 27 photos (7 completed-site photos of the Grey Marble Residence; 20 3D visualisations). Left out: 5 near-duplicates (a second pooja-door angle, a second staircase shot, a tighter crop of the U-kitchen, a second grey-bathroom view, a second open-kitchen view) and 1 construction-site photo showing a worker. Of the 11 videos, the pooja-room walkthrough is used; the others show guests at a housewarming (people on camera) or repeat the photos, so they're not on the site.
- Phone photos were rotated upright from their EXIF data and capped at 2400px.

### Honest labelling
Every image declares `kind`. 3D visualisations show a “3D visualisation” label and construction photos show “On site” — on cards, in the carousel, in the gallery and in the lightbox.

### No photo repeats — `src/data/placements.ts`
Every image slot on the site is listed in **one file**. Rule: **outside the Projects pages, each photograph appears exactly once on the whole website.**
- Home, About and Contact use the photos listed in `placements`; Home “Selected work” uses each featured project's cover.
- **`/gallery` is computed**: it shows only the photos not used anywhere else, plus the walkthrough videos.
- The **Projects pages** (listing + each project page) show that project's own photos — the only intended place a photo is seen again. On a project page each photo appears once (cover → concept → carousel); “related” and “next project” links are text-only.
- Services, the closing call-to-action and the hero fallback use no photographs.
- `checkPlacements()` runs in development and **throws** if a photo is placed twice or a path doesn't exist.

### Official business content (client-supplied, verbatim)
- **Why Choose Us** (`whyChooseUs` in `src/data/content.ts`, `src/sections/why/WhyHomestead.tsx`) — six feature cards in a 3-column grid (2 on tablet, 1 on phones) with icons, soft accent tints, a staggered reveal and hover lift / icon fill / accent rule.
- **Our Services** (`src/data/services.ts`, `src/sections/services/ServiceCards.tsx`) — Architectural Planning, Interior Designing, Villa Projects. Three photo cards in a consistent 4:5 frame: the whole photo is shown (object-contain) over a blurred copy of itself, so cards line up without cropping. Used on the home page and `/services`. The old draft service list was replaced.
- **Our Process** (`process` in `src/data/content.ts`, `src/sections/process/Process.tsx`) — Consultation → Planning → Design → Finishing → Handover. Horizontal timeline with icons on desktop (the rail fills as you scroll and each marker lights up); vertical timeline on tablet/phone.
- **Home order:** Hero → Introduction (About) → Philosophy → Why Choose Us → Our Services → Featured Projects → Our Process → Inspiration gallery (carousel) → Testimonials → Final CTA.
- **Navigation:** Home · About · Why Us (`/#why`) · Services · Projects · Process (`/#process`) · Gallery · Contact. Section links glide smoothly with Lenis and leave room for the fixed header, from any page (`src/components/layout/SmoothScroll.tsx`).
- Contact form project types now include Architectural planning, Interior designing and Villa project.

### Floating WhatsApp button
`src/components/ui/WhatsAppButton.tsx`, mounted once in `src/app/layout.tsx`, so it appears on every page. It's a green circle with the official WhatsApp logo, fixed 24px from the bottom-right corner (it respects the iPhone safe area). It links to `https://wa.me/919923083668` in a new tab; on phones that opens the WhatsApp app. On hover-capable screens a white "WhatsApp Us" label slides in to its left and the icon scales up; on touch screens one tap opens WhatsApp. It's keyboard-focusable, with a visible focus ring and an accessible label. It sits at z-index 30: above page content, below the header, mobile menu, lightbox and page transition. The number lives in `site.whatsapp` (`src/lib/site.ts`).

### Photos are never cropped
Every frame takes the photo's own aspect ratio (`frameStyle()` in `src/lib/media.ts`), so landscape and portrait images are shown whole. Tall images get narrower rather than cut, and nothing is upscaled past its real pixel width. The **hover zoom scales the whole frame** (with a soft lift shadow) instead of zooming inside it, so no edge is ever lost.

### Gallery components (reusable, `src/components/gallery/`)
- **`PhotoCarousel`** — scroll-snap track; arrows; mouse drag; touch swipe; ← → keys; pagination dots + counter; natural landscape/portrait shapes at equal height; trailing space so every slide snaps flush; opens the lightbox.
- **`MasonryGallery`** — CSS-column masonry that keeps each photo's real proportions (no awkward crops), category filter, hover/focus overlays with project details, staggered entrance.
- **`Lightbox`** — portal dialog; ← → / Esc; swipe; focus moved in and restored; Tab trapped; scroll locked; crossfade between images; neighbours preloaded; “View project” link.
- **`VideoFrame`** — muted looping walkthrough that plays only while on screen, never autoplays for reduced-motion visitors, with a visible play/pause control.

### Image quality notes
Most supplied images are messaging-app exports (≈1000–1600px). They look good at card and gallery sizes but are soft when shown very large; original camera files would be noticeably sharper. See *Still needed*.

---

## Enquiry form

`/contact` sends enquiries by **WhatsApp** (the email option was removed at the client's request).

- **Required fields:** name, a valid email, a valid phone number (7–15 digits), project type, location and a project description. Budget is optional. The rules are in `src/lib/contact-schema.ts`, and errors show inline under each field.
- **"Send Enquiry on WhatsApp"** is a real link (`<a target="_blank">`) to `https://wa.me/919923083668?text=…`. Its address updates as the visitor types and carries the full formatted message, URL-encoded with line breaks kept (`whatsappMessage()` in `src/lib/enquiry-message.ts`).
  - **Clicking with missing or invalid details:** the link is cancelled and the field messages appear.
  - **Clicking with everything valid:** WhatsApp opens with the message ready. On a computer that's WhatsApp Web in a new tab; on a phone it's the WhatsApp app. The visitor reviews it and presses Send. The site doesn't claim anything was sent.
- **Why a link, not `window.open()`:** a link is what pop-up blockers, in-app browsers and embedded pages reliably let through.
- The number is set in `site.whatsapp` (`src/lib/site.ts`). No server, API keys or environment variables are needed.

---

## What's implemented

### Pages
Home · About · Services · Projects (filterable) · Project detail ×14 (static) · Gallery (masonry + lightbox) · Contact · 404

### Home sections
1. **3D hero** — loader, scene reveal, brand + headline entrance, CTAs, scroll cue
2. **Introduction** (About) — “More than spaces. A feeling of belonging.” with two uncropped photos
3. **Philosophy** (`#approach`) — five principles; sticky photo follows the principle in focus
4. **Why Choose Us** (`#why`) — the client's six reasons as icon feature cards
5. **Our Services** (`#services`) — three photo cards: Architectural Planning, Interior Designing, Villa Projects
6. **Featured projects** (`#work`) — side-by-side lead project + offset grid; whole-frame hover zoom
7. **Our Process** (`#process`) — five-step timeline, horizontal on desktop, vertical on mobile
8. **Inspiration gallery** (`#inspiration`) — draggable carousel that opens the lightbox
9. **Testimonials** (`#testimonials`): with genuine reviews it's “What our clients say”, a swipeable carousel (3 cards on desktop, 2 on tablet, 1 on phones) with arrows, dots and ← → keys. Star ratings support decimals (5.0, 4.7, 4.5…) with partly filled stars, and the overall average is calculated only from ratings the clients actually gave. Name, location and rating show only when supplied. With no reviews it shows “Our Commitment to Every Space” instead
10. **Final CTA**

### 3D experience (`src/three/`)
A contemporary living room built entirely from code — no external models or HDRIs to download or break:
- **Architecture:** 12 × 14 m room, steel-framed four-bay window with exterior terrace and sky, extruded wall with a full arched opening into an adjoining room, instanced walnut slatted wall, plaster soffit with a warm linear cove light.
- **Furniture & objects:** bouclé modular sofa, sled-base lounge chair, lathe-turned travertine coffee table, walnut drum side table, travertine bench, arc floor lamp with a glowing shade, framed artwork, branch vase, bowl, vessels, books, stone sculpture, potted olive tree (≈560 instanced leaves in one draw call).
- **Materials:** procedural canvas textures — oak boards, walnut grain, travertine with pores, lime-wash plaster, bouclé (colour + bump) — deterministic and disposed on unmount.
- **Lighting:** low warm sun with soft shadows through the window, hemisphere sky/ground fill, floor bounce, local Lightformer environment for reflections, additive faux-volumetric light shafts, gentle fog for depth.
- **Camera:** 3.4 s intro flight from the doorway, idle breathing drift, pointer parallax, scroll-driven dolly into the room; separate portrait framing for phones.
- **Performance:** loaded via `next/dynamic` (`ssr: false`) after first paint; renders only while the hero is on screen (`frameloop="never"` off-screen); `PerformanceMonitor` + `AdaptiveDpr`; low-quality tier on phones/tablets/≤4-core devices (1024 shadow map, fewer leaves, no MSAA, lower DPR).
- **Fallbacks:** no WebGL → still illustration with a slow CSS drift; reduced motion → static camera, on-demand rendering, no intro; no JavaScript → content visible, loader hidden.

### Motion system (`src/animations/`)
One client wrapper (`ScrollAnimations`) wires declarative data attributes — `data-lines`, `data-reveal`, `data-reveal-stagger`, `data-mask`, `data-parallax`, `data-draw` — so pages stay server components and every ScrollTrigger is created and reverted together (no duplicates on navigation). Plus: hero intro timeline, walnut-curtain page transitions (client navigations only), mobile-menu timeline, process thread scrub, philosophy/service image crossfades, button fill hovers, Lenis smooth scrolling synced to GSAP's ticker. Everything respects `prefers-reduced-motion`.

### Responsive
Breakpoint-specific layouts, not scaled-down desktop: hero copy moves to the bottom on phones with a vertical legibility wash; asymmetric grids collapse into single-column rhythms; philosophy images move inline on mobile; cursor-follow images only on hover-capable desktops; full-screen menu below `lg`; type scales fluidly with `clamp()`; 3D camera re-frames for portrait.

### Accessibility
Skip link, semantic landmarks, one `h1` per page, accessible names on icon buttons, `aria-current` navigation, focus-trapped mobile menu with Escape, visible brass focus rings, labelled form fields with `aria-invalid` / `aria-describedby` and `role="alert"` errors, live regions for loader/filters/form status, decorative 3D canvas `aria-hidden`.

### SEO
Per-page titles/descriptions/canonicals, Open Graph + Twitter cards, generated OG image, `InteriorDesigner` JSON-LD (contact fields added only when verified), `sitemap.xml` (real projects only), `robots.txt`, web manifest, SVG favicon, sample projects `noindex`.

---

## Project structure

```
src/
  app/                 routes, layout, template (page transitions), API, SEO files
  components/          navigation/ footer/ layout/ ui/
  sections/            hero/ introduction/ philosophy/ projects/ services/
                       process/ why/ testimonials/ cta/ contact/
  three/               scenes/ models/ materials/ hooks/
  animations/          hero/ scroll/ transitions/
  data/                projects.ts services.ts testimonials.ts content.ts
  hooks/  lib/
public/
  images/projects/<slug>/  project photography (+ walkthrough.mp4)
  models/ textures/ fonts/
scripts/
  build-media-manifest.py  image sizes + blur placeholders → src/data/media.generated.ts
```

## Packages

next 15 · react 19 · typescript · tailwindcss 4 · three · @react-three/fiber 9 · @react-three/drei 10 · gsap 3 + @gsap/react · lenis · react-hook-form · zod · @hookform/resolvers · lucide-react

`@react-three/postprocessing` was intentionally left out: the look is achieved with lighting, fog and tone mapping, avoiding a full-screen post pass on mobile GPUs.

---

## Still needed from the business

- **Confirm the new project names** (all working titles): Grey Marble Residence, Two-Finish Modular Kitchen, Wardrobe & Utility, Mint Kitchen & Terrazzo Bath, Open Kitchen & Dining, Boardroom — and whether the kitchen/bath visualisations belong to the same homes
- Confirm the villa visualisations used for the Architectural Planning and Villa Projects services (and whether the construction-site photo in the third batch is the same villa)

- Verified contact details: email, phone, studio address, hours (`src/lib/site.ts`)
- Social profile URLs
- **Confirm each project:** final name, location, year, and the studio's exact scope (design, interiors, construction?) — especially for the school and hospital
- Confirm the **“Curtained Dining Room”** (name, which client/building it belongs to) and that the **director's cabin** photos belong to the Corporate Office project
- **Photographs still missing:** a **bedroom** and a **kitchen** (services carry no photos, so nothing is faked)
- **Higher-resolution originals** of the supplied images, and ideally the walkthrough videos' original files
- Completed photographs of the Travertine Frame and Jaali Façade residences, if built (currently visualisations / site photos)
- Which services are actually offered (confirm/edit in `src/data/services.ts`)
- **Genuine client testimonials** (with permission). Add them to `src/data/testimonials.ts` in the format shown at the top of that file: `quote`, plus `name`, `location` and `rating` (0–5, decimals OK) only if the client provided and approved them. The carousel and the average rating appear automatically
- Studio story, founder/team details, any verified credentials
- The real process, if it differs from Discover → Deliver
- Production domain (`NEXT_PUBLIC_SITE_URL`)
- Optional: a logo file, if one exists, to replace the typographic wordmark; a professionally modelled GLB for the hero, if preferred (drop into `public/models/` and load with drei's `useGLTF`)

## Performance & accessibility notes

No Lighthouse numbers are claimed — measure after the first deploy (Vercel Speed Insights or PageSpeed Insights). Things to watch:
- The hero is the heaviest element; if mobile LCP or INP suffers, set `detectQuality()` in `Hero.tsx` to always return `"low"` on touch devices, or serve `HeroFallback` on phones.
- Real photography should be ~2400px, WebP/JPG, under ~500 KB each.
