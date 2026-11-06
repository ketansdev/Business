// THE OBSESSION — signature bestsellers (fictional products, illustrative prices).
// `category` + `id` point at the existing Collections photography (no new assets).
// `mood` drives the section's atmospheric lighting while that product is featured.
export const BESTSELLERS = [
  {
    id: 'berry-rush',
    category: 'smoothies',
    categoryLabel: 'Smoothies',
    name: 'Berry Rush',
    desc: 'A refreshing blend of juicy berries with a rich, smooth finish.',
    price: 179,
    mood: { base: 'rgba(92, 22, 66, 0.55)', high: 'rgba(214, 64, 150, 0.22)', beam: 'rgba(240, 150, 200, 0.10)' },
  },
  {
    id: 'choco-overload',
    category: 'waffles',
    categoryLabel: 'Waffles',
    name: 'Choco Overload',
    desc: 'Golden Belgian waffles loaded with decadent chocolate.',
    price: 249,
    mood: { base: 'rgba(92, 50, 26, 0.58)', high: 'rgba(226, 168, 80, 0.20)', beam: 'rgba(250, 210, 150, 0.10)' },
  },
  {
    id: 'midnight-chocolate',
    category: 'ice-creams',
    categoryLabel: 'Ice Creams',
    name: 'Midnight Chocolate',
    desc: 'Rich chocolate ice cream with an irresistible chocolate core.',
    price: 199,
    mood: { base: 'rgba(70, 36, 20, 0.62)', high: 'rgba(240, 218, 186, 0.13)', beam: 'rgba(170, 100, 60, 0.20)' },
  },
  {
    id: 'chocolate-fudge',
    category: 'cupcakes',
    categoryLabel: 'Cupcakes',
    name: 'Chocolate Fudge',
    desc: 'Soft chocolate sponge finished with luxurious chocolate frosting.',
    price: 129,
    mood: { base: 'rgba(104, 56, 28, 0.55)', high: 'rgba(232, 150, 64, 0.20)', beam: 'rgba(250, 190, 120, 0.12)' },
  },
]

/** Start the sequence with the bestseller of the category the visitor was viewing. */
export function sequenceFor(categoryId) {
  const start = Math.max(0, BESTSELLERS.findIndex((b) => b.category === categoryId))
  return BESTSELLERS.map((_, i) => BESTSELLERS[(start + i) % BESTSELLERS.length])
}
