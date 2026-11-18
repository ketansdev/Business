import { images } from './images';

/**
 * Portfolio entries, shown in this order. With an odd count, the last card is centred.
 *
 * - `image`: an entry from src/data/images.js (responsive WebP), or a plain URL to a file in /public.
 *   Shown with object-cover in a 16:10 frame, so 16:10 artwork is never cropped.
 * - `alt`: what the image shows, for screen readers and search.
 *
 * REAL CLIENT PROJECTS
 * - `link`: the live website (opens in a new tab) and a "Live" badge.
 * - Without an image, a branded cover with the site address (`domain`, `cover`) is shown instead.
 *
 * CONCEPTS
 * - `concept: true` shows a "Concept" badge. Without an image, `preview` picks a built-in illustration.
 */
export const projects = [
  {
    id: 'melt-theory',
    title: 'Melt Theory',
    category: 'Website Design & Development',
    link: 'https://ketansdev.github.io/Business/melt-theory/',
    domain: 'ketansdev.github.io/Business/melt-theory',
    cover: 'dark',
    image: images.meltTheory,
    alt: 'Melt Theory website homepage with the headline Scoop the Extraordinary beside a bowl of chocolate and vanilla ice cream, above a row of signature flavour cards',
  },
  {
    id: 'homestead-interiors',
    title: 'Homestead Interiors',
    category: 'Website Design & Development',
    link: 'https://homesteadinteriors.netlify.app/',
    domain: 'homesteadinteriors.netlify.app',
    cover: 'light',
    image: images.homestead,
    alt: 'Homestead Interiors website homepage with the headline Crafting Timeless Spaces over a warm living room, above project cards for living, dining and bedroom interiors',
  },
  {
    id: 'brand-identity',
    title: 'Branding & Logo Design',
    category: 'Brand Identity',
    preview: 'brand',
    concept: true,
    image: images.branding,
    alt: 'Brand identity case study for Elaro, a modern lifestyle brand: logo system, colour palette, typography, business cards, letterhead, packaging, brand guidelines and social media application',
  },
  {
    id: 'social-creatives',
    title: 'Social Media Creatives',
    category: 'Social Media Design',
    preview: 'social',
    concept: true,
    image: images.social,
    alt: 'Social media portfolio for an ice cream brand: an Instagram profile on a phone, a grid of branded feed posts, story designs and seasonal campaign creatives',
  },
  {
    id: 'local-seo',
    title: 'Local SEO & Business Visibility',
    category: 'Google Business Profile & Local SEO',
    concept: true,
    image: images.localSeo,
    alt: 'Local SEO dashboard on a laptop and phone showing a Google Business Profile listing with search performance, customer actions, review management and a map pin',
  },
];
