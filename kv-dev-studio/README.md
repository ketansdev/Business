# KV DEV STUDIO — Website

React + Vite + Tailwind CSS + Framer Motion + Phosphor icons. Typefaces: Manrope (headings) and Inter (body), both self hosted.

```bash
npm install
npm run dev      # local development
npm run build    # production build → dist/
npm run preview  # serve the production build
```

## Where to edit things

| What | File |
| --- | --- |
| Phone, WhatsApp number, email | `src/config/site.js` |
| Social profile links (footer shows WhatsApp, email and phone icons, plus any profiles listed here, e.g. `{ label: 'Instagram', href: 'https://instagram.com/…' }`) | `src/config/site.js` → `socialLinks` |
| Brand colours | `src/index.css` → `:root` CSS variables |
| Logo | `public/brand/` (KV mark and full logo, dark and light versions) used by `src/components/ui/Logo.jsx`; favicon `public/favicon.png` |
| Services, the hosting add-on & "what's included" lists | `src/data/services.js` (`services` = the four primary, `addOns` = optional extras) |
| Portfolio projects | `src/data/projects.js` |
| Hero and portfolio images | masters in `assets/`, registry in `src/data/images.js`, optimised files in `public/assets/` |
| FAQ (also emitted as FAQPage schema at build) | `src/data/faqs.js` |
| Privacy policy and terms text | `src/pages/content.jsx` |
| Social share image | `public/og-image.png` (1200×630) |

### Portfolio projects
Edit `src/data/projects.js`. Live client sites (Melt Theory, Homestead Interiors) have a `link` and show a
"Live" badge. Entries marked `concept: true` are studio demonstration designs and show a "Concept" badge.
Each entry takes an `image` (shown with object-cover in a 16:10 frame) and an `alt` describing it. An entry
without an image falls back to a branded cover (live sites) or a built-in illustration (concepts). With an odd
number of entries, the last card is centred.

### Images
The hero and portfolio images are served as responsive WebP (640, 960 and 1280px wide) with lazy loading below
the fold. The hero image is preloaded from `index.html` at build time.
1. Put the full size master in `assets/` (any format, e.g. `assets/new-project.png`). Masters are not part of the build.
2. Register it in `src/data/images.js` with its pixel `width` and `height`.
3. Run `npm run images` (needs sharp once: `npm i -D sharp`). It writes `public/assets/<name>-<width>.webp`.
4. Use it: `image: images.newProject` in `src/data/projects.js`.

### Contact form
Pressing "Send enquiry" validates the form, then opens WhatsApp with the enquiry pre-filled and addressed to
the number in `site.whatsappNumber` (`src/config/site.js`). The visitor presses send in WhatsApp. Nothing is
emailed or stored by the website. The message layout lives in `composeText` in `src/components/sections/Contact.jsx`.

## Design system rules
The site follows a strict design system. Keep to it when editing:
- **Text**: use the fluid text styles in `src/index.css`: `type-display` (hero, 40→72px), `type-h2` (section headings, 32→50px), `type-statement`, `type-h3` (cards, 18→22px), `type-lead`, `type-body` (15→17px), `type-small`, `type-ui` and `type-label`. They scale with `clamp()` between a 360px and a 1440px screen. Never use raw sizes like `text-[19px]`. The fixed `heading-*`, `body-*` and `caption-*` styles remain for the illustrated previews and legal pages. Highlight at most a word or two of a heading in orange (`text-accent`), or set a phrase in a lighter weight and tone (`font-medium text-ink/40`).
- **Spacing**: padding, margin and gap only accept 0, 2, 4, 8, 12, 16, 24, 32, 40, 48, 64, 80, 96, 112, 128px (`tailwind.config.js` enforces this; other values simply do not exist).
- **Layout**: wrap content in `container-x` (1280px content, side padding 24 / 40 / 64px). Give sections `section-y` (80 / 96 / 128px vertical padding). Add `section-screen` to a section that should fill the screen on desktop (at least 100svh, content centred). Content-heavy sections (Services, Work) and every section below 1024px simply grow with their content.
- **Components**: cards use the `card` class (white, hairline edge, soft shadow, 24px radius). Buttons are pills in two sizes (48px and 40px tall) from `Button`. Section labels use `Eyebrow` with the next index number (01 About … 07 Contact).
- **Colour**: flat backgrounds only; dark surfaces use `night` (#181818) shades. Orange is for highlights, the primary accent button and small markers.
- **Motion**: base curve `cubic-bezier(0.22,1,0.36,1)` (`ease-base`), transform and opacity only (the FAQ answer height is the one exception). Every animation respects reduced motion.
- **Copy**: no hyphens or exclamation marks in new copy, no invented stats or testimonials.

## Pages
`index.html` (main site), `privacy.html`, `terms.html` and `404.html` (configure your host to serve it for missing URLs).

## Structure
```
src/
  config/site.js          contact details, nav, socials
  data/                   services, projects, FAQ content + image registry (images.js)
  hooks/                  useActiveSection (nav highlighting)
  components/
    layout/               Header, Footer, FloatingWhatsApp
    sections/             Hero, About, Services, WhyUs, Work, Process, Contact
    mockups/              CSS device frames + illustrated portfolio previews
    ui/                   Button, Logo, Reveal (scroll animations), ResponsiveImage, SectionHeading
```
