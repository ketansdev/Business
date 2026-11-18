import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';
import { faqs } from './src/data/faqs.js';
import { images, imageSizes, imageSrc, imageSrcSet } from './src/data/images.js';

/** Emits FAQPage JSON-LD into index.html from the same data the FAQ section renders. */
const faqSchema = () => ({
  name: 'faq-schema',
  transformIndexHtml(html, ctx) {
    if (!ctx.filename.endsWith('index.html')) return html;
    const data = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
    };
    return html.replace('</head>', `  <script type="application/ld+json">${JSON.stringify(data)}</script>\n  </head>`);
  },
});

/**
 * Preloads the hero image from the same data the <img> uses. The page renders client side, so without this
 * the browser only finds the image after the JS has run. srcset and sizes must match the <img> exactly,
 * or the browser downloads it twice.
 */
const heroPreload = () => ({
  name: 'hero-preload',
  transformIndexHtml(html, ctx) {
    if (!ctx.filename.endsWith('index.html')) return;
    const { hero } = images;
    return [
      {
        tag: 'link',
        injectTo: 'head',
        attrs: {
          rel: 'preload',
          as: 'image',
          type: 'image/webp',
          href: imageSrc(hero),
          imagesrcset: imageSrcSet(hero),
          imagesizes: imageSizes.hero,
          fetchpriority: 'high',
        },
      },
    ];
  },
});

export default defineConfig({
  plugins: [react(), faqSchema(), heroPreload()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        privacy: resolve(__dirname, 'privacy.html'),
        terms: resolve(__dirname, 'terms.html'),
        notfound: resolve(__dirname, '404.html'),
      },
      output: {
        manualChunks: { react: ['react', 'react-dom'], motion: ['framer-motion'] },
      },
    },
  },
});
