// 07 — THE WALL OF LOVE.
// Illustrative sample reviews for a fictional portfolio brand — not real customer
// testimonials, so attributions stay generic.

export const REVIEWS = [
  {
    id: 'drop',
    no: '01',
    motion: 'The drop',
    lines: ['That chocolate', 'dessert was', 'pure happiness!'],
    by: 'a dessert lover',
    paper: 'caramel',
    attach: 'pin',
    doodle: 'heart',
    reveal: 'lines',
  },
  {
    id: 'slide',
    no: '02',
    motion: 'The slide',
    lines: ['The waffle was', 'dangerously', 'delicious.'],
    underline: [1, 2], // underline drawn under these lines (“dangerously delicious”)
    by: 'a sweet tooth',
    paper: 'butter',
    attach: 'tape',
    doodle: 'underline',
    reveal: 'words',
  },
  {
    id: 'flip',
    no: '03',
    motion: 'The flip',
    lines: ['Vanilla dreams', 'are actually', 'real.'],
    by: 'a dessert enthusiast',
    paper: 'vanilla',
    attach: 'clip',
    doodle: 'star',
    reveal: 'lines',
  },
  {
    id: 'arrival',
    no: '04',
    motion: 'The final arrival',
    lines: ['Every bite', 'deserves another', 'bite.'],
    by: 'a happy customer',
    paper: 'pink',
    attach: 'pin',
    doodle: 'sparkle',
    reveal: 'mask',
  },
]

/**
 * Final collage positions (note centres, % of the stage) + size and resting angle.
 * `wide` = landscape stage (message on the left, wall on the right);
 * `tall` = portrait stage (message above, CTA below, wall in between).
 */
export const WALL_LAYOUT = {
  wide: {
    notes: [
      { x: 57, y: 33, w: 21, rot: -6 },
      { x: 81.5, y: 30, w: 19.5, rot: 5 },
      { x: 63, y: 71, w: 20.5, rot: 3 },
      { x: 85.5, y: 69, w: 18.5, rot: -4.5 },
    ],
    scrap: { x: 72, y: 50, w: 7.5, rot: 11 },
    focus: { x: 52, y: 53, scale: 1.55 },
  },
  tall: {
    notes: [
      { x: 28, y: 37, w: 43, rot: -5 },
      { x: 73, y: 35.5, w: 40, rot: 5 },
      { x: 30, y: 63, w: 42, rot: 3 },
      { x: 73, y: 64, w: 39, rot: -4 },
    ],
    scrap: { x: 52, y: 51, w: 15, rot: 10 },
    focus: { x: 50, y: 50, scale: 1.75 },
  },
}

export const DESSERT_OPTIONS = [
  'Choco Overload', 'Belgian Crunch', 'Berry Bliss Waffle', 'Nutella Dream',
  'Midnight Chocolate', 'Vanilla Cloud', 'Strawberry Velvet', 'Caramel Obsession',
  'Berry Rush', 'Mango Paradise', 'Choco Protein Shake', 'Tropical Glow',
  'Chocolate Fudge', 'Red Velvet', 'Vanilla Dream', 'Caramel Crunch',
]
