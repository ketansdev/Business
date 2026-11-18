# KV DEV STUDIO — Website

React + Vite + Tailwind CSS + Framer Motion + Phosphor icons. Typeface: Geist (self hosted).

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
| Social profile links (footer shows them only when filled) | `src/config/site.js` → `socialLinks` |
| Brand colours | `src/index.css` → `:root` CSS variables |
| Logo | `public/brand/` (KV mark and full logo, dark and light versions) used by `src/components/ui/Logo.jsx`; favicon `public/favicon.png` |
| Services & "what's included" lists | `src/data/services.js` |
| Portfolio projects | `src/data/projects.js` |
| FAQ (also emitted as FAQPage schema at build) | `src/data/faqs.js` |
| Privacy policy and terms text | `src/pages/content.jsx` |
| Social share image | `public/og-image.png` (1200×630) |

### Portfolio projects
Edit `src/data/projects.js`. Live client sites (Melt Theory, Homestead Interiors) have a `link` and show a
"Live" badge. Until a screenshot is added they show a branded cover with the site address. To add a screenshot,
save it as WebP (~1600px wide, 16:10) in `public/work/` and set `image: '/work/your-file.webp'` on the entry.
Entries marked `concept: true` are studio demonstration designs and show a "Concept" badge.

### Contact form
Pressing "Send enquiry" validates the form, then opens WhatsApp with the enquiry pre-filled and addressed to
the number in `site.whatsappNumber` (`src/config/site.js`). The visitor presses send in WhatsApp. Nothing is
emailed or stored by the website. The message layout lives in `composeText` in `src/components/sections/Contact.jsx`.

## Design system rules
The site follows a strict design system. Keep to it when editing:
- **Text**: use the named text styles in `src/index.css` (`heading-1`…`heading-6`, `title-*`, `body-*`, `button-*`, `caption-*`), never raw sizes like `text-[19px]`.
- **Spacing**: padding, margin and gap only accept 0, 2, 4, 8, 12, 16, 24, 32, 40, 48, 64, 80, 96px (`tailwind.config.js` enforces this; other values simply do not exist).
- **Colour**: flat backgrounds only; dark surfaces use `night` (#181818) shades. The hero heading is the only gradient, on text.
- **Motion**: base curve `cubic-bezier(0.22,1,0.36,1)` (`ease-base`), transform and opacity only.
- **Copy**: no hyphens or exclamation marks in new copy, no invented stats or testimonials.

## Pages
`index.html` (main site), `privacy.html`, `terms.html` and `404.html` (configure your host to serve it for missing URLs).

## Structure
```
src/
  config/site.js          contact details, nav, socials
  data/                   services + projects content
  hooks/                  useActiveSection (nav highlighting)
  components/
    layout/               Header, Footer, FloatingWhatsApp
    sections/             Hero, About, Services, WhyUs, Work, Process, Contact
    mockups/              CSS device frames + illustrated portfolio previews
    ui/                   Button, Logo, Reveal (scroll animations), SectionHeading
```
