// 06 — FIND YOUR MELT. Flavour personalities (fictional copy for the portfolio demo).
// Product names/prices are looked up from the Collections data, never duplicated.
import { CATEGORIES } from './collection'
import { productImage } from '../lib/assets'

const BASE = import.meta.env.BASE_URL
const composition = (name) => ({
  src: `${BASE}images/find-your-melt/${name}-1000.webp`,
  srcSet: `${BASE}images/find-your-melt/${name}-560.webp 560w, ${BASE}images/find-your-melt/${name}-1000.webp 1000w`,
})

const product = (category, id) => {
  const cat = CATEGORIES.find((c) => c.id === category)
  const p = cat?.products.find((x) => x.id === id)
  return p ? { category, categoryLabel: cat.label, id, name: p.name, price: p.price, image: productImage(category, id) } : null
}

/**
 * entrance: where the composition comes from (GSAP from-vars, art-directed per personality)
 * mood:     ambient lighting layers (kept dark; only the glow colour changes)
 * explore:  Collections category + product the CTA opens
 */
export const FLAVOURS = [
  {
    id: 'chocoholic',
    no: '01',
    name: 'The Chocoholic',
    line: 'For the ones who believe there is no such thing as too much chocolate.',
    desc: 'Bold, rich and unapologetically indulgent. Some cravings are simply made of chocolate.',
    image: composition('melt-chocoholic'),
    alt: 'Dark chocolate chunks and curls suspended in a splash of melted chocolate',
    accent: '#d9a46c',
    mood: { glow: 'rgba(118, 60, 28, 0.62)', high: 'rgba(222, 150, 78, 0.20)', low: 'rgba(60, 28, 14, 0.55)' },
    entrance: { x: -70, y: 34, scale: 0.86, rotationY: -18, rotationX: 8, rotation: -3, duration: 1.3, ease: 'power3.out' },
    products: [product('ice-creams', 'midnight-chocolate'), product('waffles', 'choco-overload')],
    explore: { category: 'ice-creams', product: 'midnight-chocolate' },
  },
  {
    id: 'dreamer',
    no: '02',
    name: 'The Dreamer',
    line: 'For the ones who find magic in every little sweet moment.',
    desc: 'Soft, creamy and beautifully sweet. A little indulgence, a little romance and a whole lot of happiness.',
    image: composition('melt-dreamer'),
    alt: 'A swirl of vanilla cream ribboning around fresh strawberries',
    accent: '#ead6bd',
    mood: { glow: 'rgba(150, 122, 98, 0.40)', high: 'rgba(176, 98, 108, 0.18)', low: 'rgba(70, 48, 40, 0.5)' },
    entrance: { x: 0, y: 110, scale: 0.9, rotationY: 0, rotationX: -12, rotation: 0, duration: 1.6, ease: 'power2.out' },
    products: [product('ice-creams', 'vanilla-cloud'), product('ice-creams', 'strawberry-velvet')],
    explore: { category: 'ice-creams', product: 'vanilla-cloud' },
  },
  {
    id: 'refresher',
    no: '03',
    name: 'The Refresher',
    line: 'For the ones who love a little freshness in every moment.',
    desc: 'Bright, fruity and refreshing. A burst of flavour for those who like to keep things fresh.',
    image: composition('melt-refresher'),
    alt: 'Diced mango, berries and a golden mango splash with fresh mint leaves',
    accent: '#dcb560',
    mood: { glow: 'rgba(64, 86, 50, 0.42)', high: 'rgba(222, 160, 48, 0.20)', low: 'rgba(96, 30, 58, 0.30)' },
    entrance: { x: -150, y: 10, scale: 0.92, rotationY: 24, rotationX: 0, rotation: -4, duration: 1.15, ease: 'expo.out' },
    products: [product('smoothies', 'mango-paradise'), product('smoothies', 'berry-rush')],
    explore: { category: 'smoothies', product: 'mango-paradise' },
  },
  {
    id: 'adventurer',
    no: '04',
    name: 'The Adventurer',
    line: 'For the ones who love to explore every crunch and every layer.',
    desc: 'Golden, crunchy and full of surprises. For those who believe the best flavours are discovered.',
    image: composition('melt-adventurer'),
    alt: 'Golden waffles, toasted hazelnuts and ribbons of caramel in mid-air',
    accent: '#e2a85c',
    mood: { glow: 'rgba(142, 86, 30, 0.52)', high: 'rgba(206, 146, 72, 0.24)', low: 'rgba(74, 40, 20, 0.5)' },
    entrance: { x: 190, y: -10, scale: 0.88, rotationY: -28, rotationX: 4, rotation: 10, duration: 1.25, ease: 'power4.out' },
    products: [product('waffles', 'belgian-crunch'), product('waffles', 'nutella-dream')],
    explore: { category: 'waffles', product: 'belgian-crunch' },
  },
]
