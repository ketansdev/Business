// 05 — THE STORY BEHIND THE MELT. Copy, assets and the ingredient composition.
// Every path below exists under /public (verified; see README → Assets).
const BASE = import.meta.env.BASE_URL
const img = (name, small, large) => ({
  src: `${BASE}images/story/${name}-${large}.webp`,
  srcSet: `${BASE}images/story/${name}-${small}.webp ${small}w, ${BASE}images/story/${name}-${large}.webp ${large}w`,
})
const scene = (name) => img(name, 960, 1672) // 1672×941 photographs
const cutout = (name) => img(name, 480, 900) // 1254×1254 transparent PNG cut-outs

export const STORY_VIDEO = [
  { src: `${BASE}videos/story-chocolate-pour.mp4`, type: 'video/mp4' },
  { src: `${BASE}videos/story-chocolate-pour.webm`, type: 'video/webm' },
]

// still frame shown if the video is slow or fails to load
export const STORY_VIDEO_POSTER = `${BASE}videos/story-chocolate-pour-poster.jpg`

export const SCENES = [
  { no: '01', label: 'The beginning' },
  { no: '02', label: 'The obsession' },
  { no: '03', label: 'The craft' },
  { no: '04', label: 'The reveal' },
]

export const BEGINNING = {
  image: scene('story-chocolate-flow'),
  headline: 'It started with a craving.',
  text: 'A simple love for indulgence became an obsession with creating something extraordinary.',
}

export const OBSESSION = {
  headline: 'Not just dessert.',
  second: 'An expression of creativity.',
  text: 'Every ingredient has a purpose. Every combination tells a story. Every creation begins with imagination.',
}

/**
 * Art-directed 3D composition around the centred headline.
 * x/y: offset from centre (vw / vh) · z: depth in px (+ = towards camera)
 * size: width in vw · from: entry direction (unit vector) · layer: fg | mid | bg
 * `flow` marks the three that remain in the simplified mobile composition.
 */
export const INGREDIENTS = [
  { id: 'chunks', name: 'Dark chocolate', image: cutout('story-chocolate-chunks'), x: -36, y: -20, z: 40, size: 19, rot: -10, from: [-1, -0.6], layer: 'mid', flow: true },
  { id: 'caramel', name: 'Caramel ribbon', image: cutout('story-caramel-ribbon'), x: 37, y: -12, z: 90, size: 21, rot: 8, from: [1, -0.2], layer: 'mid', flow: true },
  { id: 'vanilla', name: 'Vanilla cream', image: cutout('story-vanilla-cream'), x: 12, y: -34, z: -420, size: 16, rot: 4, from: [0.4, -1], layer: 'bg' },
  { id: 'strawberries', name: 'Strawberries', image: cutout('story-strawberries'), x: -25, y: 31, z: 300, size: 18, rot: 12, from: [-0.8, 1], layer: 'fg', flow: true },
  { id: 'berries', name: 'Mixed berries', image: cutout('story-mixed-berries'), x: 27, y: 33, z: 250, size: 17, rot: -9, from: [0.9, 1], layer: 'fg' },
]

export const CRAFT = {
  headline: 'Crafted with passion.',
  second: 'Made to break the ordinary.',
  text: 'From the first drizzle to the final finishing touch, every detail is part of the experience.',
  chapters: [
    { no: '01', title: 'The perfect pour', note: 'Chocolate drizzle', image: scene('story-craft-chocolate') },
    { no: '02', title: 'Golden perfection', note: 'Waffle preparation', image: scene('story-craft-waffle') },
    { no: '03', title: 'The perfect scoop', note: 'Ice cream', image: scene('story-craft-icecream') },
    { no: '04', title: 'The final touch', note: 'Cupcake frosting', image: scene('story-craft-cupcake') },
  ],
}

export const REVEAL = {
  image: scene('story-final-reveal'),
  line1: "We don't just make desserts.",
  line2: 'We create cravings.',
  brand: 'MELT THEORY',
  tagline: 'The art of melting moments.',
  // ingredients from scene 02 return as soft foreground accents in the finale
  accents: [
    { id: 'acc-chunks', image: cutout('story-chocolate-chunks'), x: -42, y: -30, size: 11, rot: -18 },
    { id: 'acc-caramel', image: cutout('story-caramel-ribbon'), x: 41, y: -26, size: 12, rot: 14 },
  ],
}
