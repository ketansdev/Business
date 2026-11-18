# KV DEV Studio — Design System (Master)

Source of truth for every section. Tokens live in `src/styles/index.css` (`@theme`).
Build new UI from these tokens. Don't add one-off colours or easings.

## How this was derived

Generated with **UI/UX Pro Max** (`search.py --design-system`, plus `--domain style | typography | ux | react | landing`),
then reconciled with the brief:

| Skill output | Decision |
|---|---|
| Palette (brutalism pink / liquid-glass stone) | **Rejected:** the brief locks the palette (below). |
| Style: *Dark Mode (OLED)* | **Adopted:** near-black surfaces, high-contrast text, minimal glow, visible focus. |
| Type: *Space Grotesk + Inter + JetBrains Mono* tri-stack | **Adopted:** matches the brief exactly. |
| Pattern: *Scroll-Triggered Storytelling* | **Adopted as rules:** readable without scroll effects, final state under reduced motion, pause work off-screen. |
| UX: Reduced Motion, Motion Sensitivity (High) | No parallax/scroll-jacking under reduced motion; ambient loops rest on the final frame. |
| UX: Focus States (High), Focus Appearance | 2px lime outline, 3px offset on every interactive element. |
| React: Dynamic Imports (Critical) | three.js / R3F load in lazy chunks after first paint. |
| Landing: Portfolio Grid | Visuals first, neutral background, minimal accent. |

MotionSites craft rules applied: one idea per first screen, hand-broken headlines, an opacity-led hierarchy, one material reused, pills for actions, entrance choreography finishing by ~1.5s, and a mandatory screenshot-and-fix loop.

## Colour

| Token | Hex | Use |
|---|---|---|
| `ink` | `#08090B` | Page background |
| `ink-2` | `#101216` | Secondary background, nav glass, panels |
| `card` | `#15181D` | Cards |
| `card-2` | `#1B1F25` | Raised card details |
| `fg` | `#F5F5F5` | Primary text |
| `muted` | `#A1A1AA` | Secondary text (7.6:1 on ink) |
| `dim` | `#8A8A94` | Labels, metadata (5.7:1 on ink) |
| `lime` | `#C6FF4D` | Accent: primary CTA fill, active dots, one highlighted phrase per section, 3D beads |
| `lime-ink` | `#0B0F02` | Text/icons on lime |
| `line` / `line-2` | white 8% / 14% | Hairlines and borders |

Lime is limited to: CTA fills, small dots/hairlines, one highlight phrase ("Stand Out."), and tiny 3D accents. No neon glows.

## Typography

| Role | Font | Size | Leading | Tracking | Weight |
|---|---|---|---|---|---|
| Hero H1 | Space Grotesk | `clamp(3.6rem, 5.25vw, 6.1rem)` (≥1024), `clamp(2.6rem, 10.6vw, 4.6rem)` | 0.94 | −0.048em | 600 |
| Section H2 (`.h2`) | Space Grotesk | `clamp(2.75rem, 7.2vw, 7.25rem)` | 0.92 | −0.048em | 600 |
| Mega (About/Contact/Footer) | Space Grotesk | up to `9.5rem` | 0.86–0.9 | −0.055 to −0.06em | 600 |
| H3 | Space Grotesk | `clamp(1.55rem, 2.3vw, 2.1rem)` | 1.0–1.06 | −0.035 to −0.04em | 500 |
| Body | Inter | 15.5–17.5px | 1.6–1.65 | 0 | 400 |
| Label (`.label`) | JetBrains Mono | 10–11px, uppercase | 1.3 | +0.2em | 400 |

## Surfaces & components

- **Radii:** pills for actions; 28px cards; 22px media insets; 32–48px feature panels.
- **Glass (`.glass`):** `ink-2` at 55% + 18px blur + `line-2` border. Used sparingly (nav, chips, overlays).
- **Buttons:** primary lime pill with an ink arrow disc that rotates 45° on hover; ghost pill with a hairline border. Labels roll up on hover; subtle magnetic pull (fine pointers only).
- **Section header:** `(NN)` lime index + hairline + mono label, masked H2, supporting line on the right.
- **Grain:** fixed SVG fractal noise at 4.5% opacity.

## Motion

- Entrance easing `cubic-bezier(0.16, 1, 0.3, 1)`; durations 0.6–1.15s; stagger 0.08–0.12s.
- Headlines: masked line rise (115% → 0). Blocks: fade + 28px rise, once, ~25% in view.
- Hover ≤ 1.06 scale, 300–500ms. Marquee: linear, 46s.
- 3D: damped pointer parallax (λ≈2.6), slow spin (0.16 rad/s), WebGL paused off-screen.
- Pinned hero: one pinned section only (UI/UX Pro Max: pin ≤ 1–2 sections), sticky stage on a 220svh runway,
  scrub 0.6, raw progress damped (λ≈6) in the rig. Hover on desktop, tap-to-explore then tap-to-go on touch.
  No `overflow:hidden` above the sticky stage (MotionSites scroll rule).
- Services stage: CSS 3D (perspective 1400px desktop / 1100px tablet). Roles: active z0 s1 blur0;
  previous z−180 s.86 o.45 blur3 br.7 (above); upcoming z−350 s.78 o.22 blur6 br.5 (below). Hand-off curves are
  shaped so the incoming card sharpens early. GSAP owns the card shells; Framer owns inner tilt and content reveals.
- Reduced motion: transforms disabled via `MotionConfig`, CSS loops rest on their final frame, 3D renders one static frame.
