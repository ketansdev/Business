// 08 — THE GRAND FINALE (footer). Every internal target below exists in the page.
// `go` is resolved in Footer.jsx: { top } | { section: '#id' } | { category } | { note }

export const FOOTER_NAV = [
  {
    title: 'Explore',
    links: [
      { label: 'Home', go: { top: true }, href: '#top' },
      { label: 'Our Story', go: { section: '#story' }, href: '#story' },
      { label: 'Collections', go: { section: '#collection' }, href: '#collection' },
      { label: 'Bestsellers', go: { section: '#obsession' }, href: '#obsession' },
      { label: 'Find Your Melt', go: { section: '#find-your-melt' }, href: '#find-your-melt' },
    ],
  },
  {
    title: 'The collection',
    links: [
      { label: 'Waffles', go: { category: 'waffles' }, href: '#collection' },
      { label: 'Ice Creams', go: { category: 'ice-creams' }, href: '#collection' },
      { label: 'Smoothies', go: { category: 'smoothies' }, href: '#collection' },
      { label: 'Cupcakes', go: { category: 'cupcakes' }, href: '#collection' },
    ],
  },
  {
    title: 'Connect',
    links: [
      // No real social account or contact details exist for this fictional brand.
      // Set a URL here and the item becomes a live external link automatically.
      { label: 'Instagram', external: SOCIAL_URL('instagram') },
      { label: 'Contact', external: SOCIAL_URL('contact') },
      { label: 'Leave Your Note', go: { note: true }, href: '#wall-of-love' },
    ],
  },
]

/** Placeholder registry for external links — null means "not set up yet". */
function SOCIAL_URL(key) {
  const SOCIAL = {
    instagram: null, // e.g. 'https://www.instagram.com/<handle>/'
    contact: null, // e.g. 'mailto:hello@<domain>'
  }
  return SOCIAL[key]
}

export const DESSERT = {
  scoop: {
    src: `${import.meta.env.BASE_URL}assets/img/hero_icecream-1200.webp`,
    srcSet: `${import.meta.env.BASE_URL}assets/img/hero_icecream-640.webp 640w, ${import.meta.env.BASE_URL}assets/img/hero_icecream-1200.webp 1200w`,
  },
  ribbon: {
    src: `${import.meta.env.BASE_URL}images/story/story-caramel-ribbon-900.webp`,
    srcSet: `${import.meta.env.BASE_URL}images/story/story-caramel-ribbon-480.webp 480w, ${import.meta.env.BASE_URL}images/story/story-caramel-ribbon-900.webp 900w`,
  },
}
