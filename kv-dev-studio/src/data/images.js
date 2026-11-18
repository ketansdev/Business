/**
 * Responsive image registry: the one place that knows which image files exist.
 *
 * - Masters (full size originals) live in /assets at the project root and are not part of the build.
 * - `npm run images` writes resized WebP files to public/assets/<file>-<width>.webp for every width below.
 * - `width` / `height` are the master's pixel size. They give each <img> its aspect ratio, so nothing shifts while loading.
 *
 * Plain JS with no Vite imports: vite.config.js and scripts/optimize-images.mjs read it too.
 */
export const imageWidths = [640, 960, 1280];

export const images = {
  hero: { file: 'kv-hero', width: 1448, height: 1086 },
  meltTheory: { file: 'melt-theory', width: 1586, height: 992 },
  homestead: { file: 'homestead-interiors', width: 1586, height: 992 },
  branding: { file: 'branding-showcase', width: 1586, height: 992 },
  social: { file: 'social-media-showcase', width: 1585, height: 992 },
  localSeo: { file: 'local-seo-showcase', width: 1585, height: 992 },
};

const url = (file, width) => `/assets/${file}-${width}.webp`;

/** Middle size: the fallback `src` for browsers that ignore srcset. */
export const imageSrc = (image) => url(image.file, imageWidths[1]);
export const imageSrcSet = (image) => imageWidths.map((w) => `${url(image.file, w)} ${w}w`).join(', ');

/**
 * Rendered width of each image slot, so the browser downloads the smallest file that stays sharp.
 * Derived from the layout (index.css): container 1408px (1280px content), side padding 24px, 40px from md, 64px from lg.
 * Keep in step with the grids in Hero.jsx and Work.jsx.
 */
export const imageSizes = {
  // Hero: right column of `lg:grid-cols-[1.1fr_1fr]` (1.25fr from xl), gap 48px (64px from xl); stacked and capped at max-w-2xl (672px) below lg.
  hero: '(min-width: 1408px) 540px, (min-width: 1280px) calc((100vw - 192px) / 2.25), (min-width: 1024px) calc((100vw - 176px) / 2.1), (min-width: 768px) 672px, calc(100vw - 48px)',
  // Work grid: two columns with a 24px gap from md, one column below.
  card: '(min-width: 1408px) 628px, (min-width: 1024px) calc((100vw - 152px) / 2), (min-width: 768px) calc((100vw - 104px) / 2), calc(100vw - 48px)',
};
