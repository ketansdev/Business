# MELT THEORY — The Art of Melting Moments

A cinematic, scroll-driven website for **MELT THEORY**, a *fictional* luxury ice cream brand, built as a front-end / creative-coding portfolio piece. The brand, products and ingredient copy are invented for demonstration purposes.

**Stack:** React 19 · Vite 8 · GSAP 3 (ScrollTrigger, ScrollToPlugin). No other runtime dependencies.

```bash
npm install
npm run dev       # http://localhost:5173
npm run build && npm run preview
```

## The journey

`INTRO VIDEO → CHOCOLATE REVEAL → FLOATING PRODUCT → HERO → SCROLL → PRODUCT ROTATION → EXPLODED LAYERS → INGREDIENT STORY`

| Stage | What happens | Where |
|---|---|---|
| Intro | `intro.mp4` plays ~2 s (muted, inline, `object-fit: cover`). It is skipped automatically if autoplay is blocked, the video errors or stalls, or the user prefers reduced motion. A hard cap of 4.2 s applies, and there's a "Skip intro" button. | `Intro.jsx` |
| Reveal | The intro scales away while the splash video is screen-blended in. A crown splash bursts out, two swirls whip outward, the scoop rises with a blur-to-sharp overshoot, the outline wordmark draws itself, and the UI staggers in. | `Experience.jsx` → *intro → reveal* |
| Float | Idle sine float plus pointer parallax (fine pointers only), both driven by one `gsap.ticker` callback whose amplitude is faded by scroll | *idle float + pointer parallax* |
| Hero → About | Scrubbed timeline: the product dips down, tumbles in 3D, then swings back and lands in the anatomy diagram | *1. HERO → ABOUT* |
| Collection | Section 03. Four category tabs (waffles, ice creams, smoothies, cupcakes) with a sliding indicator and a mood glow per category. A swipeable snap carousel holds the cards: hover zoom, 3D tilt, pointer spotlight, and a flavor-note ↔ description reveal. Prev/next arrows step through all 16 products and cross categories. | `Collection.jsx`, `ProductCard.jsx`, `data/collection.js` |
| The Obsession | Section 04. The bestseller of the Collections tab on screen lifts off its card, a single shared element measured live every frame, and flies down into a pinned stage. One scrubbed master timeline then hands over through four bestsellers, each with its own exit/entry path, staggered copy, per-product lighting and a `01 — 04` progress indicator. Fully reversible. The order starts at the carried product and follows the listed order. | `Obsession.jsx`, `data/bestsellers.js` |
| The Story | Section 05. One pinned stage and one master timeline across four scenes: (01) chocolate pours in through a liquid-drip mask, (02) a real 3D ingredient composition (perspective, preserve-3d, Z-depths, slow orbit, mouse parallax), (03) an editorial craft film of four layered frames, and (04) a dark chocolate-pour video beat into the final reveal and brand. Phones and reduced motion get an un-pinned editorial flow instead. | `Story.jsx`, `data/story.js` |
| Find Your Melt | Section 06. Four flavour personalities on one CSS-3D stage, with layers at real Z depths and desktop pointer tilt. Switching runs a GSAP timeline: exit, atmosphere crossfade (lighting and accent colour), a per-flavour entrance, then settle. Rapid clicks never snap. Each flavour pairs with two existing Collections products. The CTA and product rows scroll to Collections and open that exact category and product. Not pinned. | `FindYourMelt.jsx`, `data/flavours.js` |
| Wall of Love | Section 07. A pinned sticky-note film on one master timeline. Each illustrative review gets its own moment: a drop with a spring landing, a slide-in from the right, a 3D paper flip, a diagonal arrival. Text reveals line by line, word by word or through a mask, and SVG doodles draw on. The camera pushes in on each note, pulls back between them and pulls out to the finished collage. "Leave your note" opens a paper form, a clearly labelled frontend demo with no backend that never claims to save anything. Notes are HTML/CSS/SVG, not images. | `WallOfLove.jsx`, `NoteForm.jsx`, `data/reviews.js` |
| Grand Finale | The footer, not pinned. The Wall of Love melts into it through the same liquid-drip mask. "Life is short. / Make it sweeter." reveals behind masks with a drawn caramel underline, and the hero scoop returns under a spotlight with pointer parallax. A full-width SVG "MELT THEORY" signature has a mask reveal, scroll parallax and a light sweep. Every navigation link targets a real section, the collection links reuse the Find Your Melt category hook, and "Leave your note" opens the existing Wall of Love form. Instagram and Contact are "soon" placeholders (set the URLs in `data/footer.js`). The newsletter is an honest frontend demo. | `Footer.jsx`, `data/footer.js` |
| Anatomy | Pinned section. The assembled scoop dissolves into its cream body, then each layer slides out one at a time and its leader line, node and copy draw in | *3. ANATOMY* |

### Architecture notes

- **One product, one DOM node.** A sticky full-viewport `.rig-holder` spans both sections, so the same element travels from the hero into the diagram, with no cross-fades between copies.
- **One writer per transform.** Nested wrappers (`rig` → `parallax` → `float` → `reveal` → images) each have a single owner, so the scroll, pointer, idle and reveal animations never fight.
- **Geometry lives in `src/lib/layout.js`.** GSAP uses function-based values with `invalidateOnRefresh`, and the label positions are written as CSS custom properties on `refreshInit`. The leader lines always land on their layer at any viewport size.
- `gsap.matchMedia` rebuilds the scroll choreography for wide vs. stacked layouts and for `prefers-reduced-motion`. Everything is reverted on unmount (StrictMode-safe).
- **Reduced motion:** no intro film, no float or parallax, and no drifting smoke. The hero → about transition becomes a fade, and the layers appear in their final positions.

## Assets

Original files came from `assets.zip`. Processing scripts are in `asset-source/`, and derived PNGs are in `asset-source/derived/`.

| Required asset | Status | Served as |
|---|---|---|
| `intro.mp4` | ✅ supplied (1920×1080, 3.9 s) | trimmed to 2.6 s, 1280 px, silent → `intro.mp4` (H.264) + `intro.webm` (VP9) |
| `hero_icecream.png` | ✅ supplied | `hero_icecream-{640,1200}.webp` |
| `chocolate_splash.png` | ✅ supplied (a sheet of 3 splashes) | split into left / center / right |
| `splash_left.png` | ⚠️ not supplied, **cropped from `chocolate_splash.png`** (approved) | `splash_left-{400,665}.webp` |
| `splash_right.png` | ⚠️ not supplied, **cropped from `chocolate_splash.png`** (approved) | `splash_right-{400,678}.webp` |
| `layer_1…5.png` | ✅ supplied. `layer_4.png` had a fake checkerboard baked in (no alpha), so its **background was keyed out** (approved) | `layer_N-{640,1200}.webp` |
| `chocolate-splash.mp4` | ➕ extra, used in the reveal (approved) | 1280 px, silent, mp4 + webm |
| `smoke.webp` | generated procedurally (`asset-source/smoke.py`) | atmospheric texture |

### Product images (`products.zip`)

All 16 products were supplied as 1254×1254 transparent PNGs. They're served as `products/<category>/<slug>-{400,800}.webp`, 2.7 MB total, down from 28 MB. The zip's folder names (`wafles`, `Icecreams`) were normalized to `waffles` and `ice-creams`. "Choco Protein Shake" uses `choco-protein.png`. `vanilla-dream.png` had a faint baked-in white haze, which `asset-source/dehaze.py` removes.

### Story assets (`images.zip`)

All 11 images and the optional video were present. The images are served as WebP at your paths, `public/images/story/<name>-{960,1672}.webp` for photos and `-{480,900}.webp` for cut-outs: 2.4 MB, down from 22 MB. The video shipped at `images/videos/`. It's served silent at native 1080p at `public/videos/story-chocolate-pour.{mp4,webm}` (2.3 MB MP4), with a poster frame as a fallback. Only the pinned desktop/tablet version fetches it; phones never do. The liquid mask path is generated by `asset-source/liquid_mask.py`.

### Find Your Melt assets (`find-your-melt.zip`)

All four compositions were present at 1254×1254 with transparency. They're served at `public/images/find-your-melt/<name>-{560,1000}.webp`, 1.4 MB, down from 7.3 MB. `melt-dreamer.png` had a faint baked-in light haze, which `asset-source/fym_webp.py` removes. The product recommendations reuse the existing Collections photography.

## Performance

- Hero image and splashes are preloaded. The five layer images are **lazy-loaded** after the reveal, or as soon as the user starts scrolling.
- Total media is ~4.4 MB (down from 16.6 MB of source files). Responsive `srcset`s are 640 px or 1200 px.
- All animation uses transforms and opacity. The particle canvas is capped at DPR 1.5, reduces its particle count on small screens, and pauses when the tab is hidden.
- There's no layout shift: every animated element is absolutely positioned, and scroll is held during the intro with event listeners rather than `overflow: hidden`.
