/**
 * Portfolio entries, shown in this order.
 *
 * REAL CLIENT PROJECTS
 * - `link`: the live website (opens in a new tab).
 * - `image`: optional screenshot, e.g. '/work/melt-theory.webp' (put the file in /public/work/,
 *   WebP ~1600px wide, 16:10). Without an image, a branded cover with the site address is shown.
 *
 * CONCEPTS
 * - `concept: true` shows a "Concept" badge; `preview` picks a built-in illustration.
 */
export const projects = [
  {
    id: 'melt-theory',
    title: 'Melt Theory',
    category: 'Website Design & Development',
    link: 'https://ketansdev.github.io/Business/melt-theory/',
    domain: 'ketansdev.github.io/Business/melt-theory',
    cover: 'dark',
  },
  {
    id: 'homestead-interiors',
    title: 'Homestead Interiors',
    category: 'Website Design & Development',
    link: 'https://homesteadinteriors.netlify.app/',
    domain: 'homesteadinteriors.netlify.app',
    cover: 'light',
  },
  {
    id: 'brand-identity',
    title: 'Branding & Logo Design',
    category: 'Brand Identity',
    preview: 'brand',
    concept: true,
  },
  {
    id: 'social-creatives',
    title: 'Social Media Creatives',
    category: 'Social Media Design',
    preview: 'social',
    concept: true,
  },
];
