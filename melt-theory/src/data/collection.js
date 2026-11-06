// MELT THEORY collection — fictional products and illustrative prices for a
// portfolio demo. Presentation lives in components/Collection.jsx.

// Flavor notes: label + swatch colour used by the little flavor indicator
const N = {
  cacao: ['Dark cacao', '#4a2716'],
  fudge: ['Fudge', '#6b3a22'],
  cream: ['Fresh cream', '#f1e3c8'],
  cookie: ['Cookie', '#2e2220'],
  vanilla: ['Vanilla bean', '#f3e2b8'],
  hazelnut: ['Hazelnut', '#a06a3f'],
  strawberry: ['Strawberry', '#d2475a'],
  blueberry: ['Blueberry', '#4b4f9c'],
  pistachio: ['Pistachio', '#9bb26a'],
  caramel: ['Salted caramel', '#c8894a'],
  toffee: ['Toffee', '#b9773b'],
  biscuit: ['Biscuit', '#d9b27c'],
  whiteChoc: ['White chocolate', '#efe4d2'],
  raspberry: ['Raspberry', '#c23a6a'],
  blackberry: ['Blackberry', '#5a2346'],
  mango: ['Mango', '#f0a531'],
  mint: ['Mint', '#7fbf8f'],
  banana: ['Banana', '#efd88a'],
  pineapple: ['Pineapple', '#f3d15b'],
  passion: ['Passion fruit', '#e0703a'],
  redVelvet: ['Red velvet', '#9e1f2c'],
  creamCheese: ['Cream cheese', '#f5ecdc'],
  honeycomb: ['Honeycomb', '#e2a33c'],
}
const notes = (...keys) => keys.map((k) => ({ label: N[k][0], color: N[k][1] }))

export const CATEGORIES = [
  {
    id: 'waffles',
    label: 'Waffles',
    line: 'Golden, crisp, generously loaded.',
    // background mood: two soft glows + accent used for indicators
    mood: { accent: '#d9a46c', glowA: 'rgba(214, 150, 72, 0.30)', glowB: 'rgba(120, 66, 34, 0.38)' },
    products: [
      { id: 'choco-overload', name: 'Choco Overload', price: 249, desc: 'A crisp Belgian waffle buried under dark chocolate gelato, warm fudge and cocoa crumble.', notes: notes('cacao', 'fudge', 'cream') },
      { id: 'belgian-crunch', name: 'Belgian Crunch', price: 279, desc: 'Golden waffle with vanilla bean scoops, cookie crumble and toasted hazelnut praline.', notes: notes('cookie', 'vanilla', 'hazelnut') },
      { id: 'berry-bliss', name: 'Berry Bliss Waffle', price: 259, desc: 'Strawberry gelato, fresh berries and a ruby coulis over a warm, buttery waffle.', notes: notes('strawberry', 'blueberry', 'pistachio') },
      { id: 'nutella-dream', name: 'Nutella Dream', price: 299, desc: 'Hazelnut-chocolate spread, chocolate gelato and roasted hazelnuts on a golden grid.', notes: notes('hazelnut', 'cacao', 'cream') },
    ],
  },
  {
    id: 'ice-creams',
    label: 'Ice Creams',
    line: 'Slow-churned, small batch, served cold.',
    mood: { accent: '#efdcb8', glowA: 'rgba(240, 222, 186, 0.20)', glowB: 'rgba(96, 54, 32, 0.42)' },
    products: [
      { id: 'midnight-chocolate', name: 'Midnight Chocolate', price: 199, desc: 'Triple-cacao scoops with fudge ribbons and dark chocolate curls.', notes: notes('cacao', 'fudge') },
      { id: 'vanilla-cloud', name: 'Vanilla Cloud', price: 179, desc: 'Vanilla bean cream whipped light and finished with a buttery biscuit crumb.', notes: notes('vanilla', 'biscuit', 'cream') },
      { id: 'strawberry-velvet', name: 'Strawberry Velvet', price: 189, desc: 'Fresh strawberry cream folded with a ruby berry swirl and white chocolate.', notes: notes('strawberry', 'whiteChoc') },
      { id: 'caramel-obsession', name: 'Caramel Obsession', price: 219, desc: 'Salted caramel scoops, toffee shards and a slow butterscotch pour.', notes: notes('caramel', 'toffee') },
    ],
  },
  {
    id: 'smoothies',
    label: 'Smoothies',
    line: 'Thick, bright, blended to order.',
    mood: { accent: '#e8a0b4', glowA: 'rgba(176, 58, 106, 0.26)', glowB: 'rgba(233, 162, 59, 0.20)' },
    products: [
      { id: 'berry-rush', name: 'Berry Rush', price: 179, desc: 'Blackberry, raspberry and blueberry blended thick with yogurt under a granola crown.', notes: notes('blackberry', 'raspberry', 'blueberry') },
      { id: 'mango-paradise', name: 'Mango Paradise', price: 169, desc: 'Ripe mango whipped with cream, finished with mango ribbons and fresh mint.', notes: notes('mango', 'cream', 'mint') },
      { id: 'choco-protein', name: 'Choco Protein Shake', price: 199, desc: 'Cacao, banana and protein shaken cold under dark chocolate shavings.', notes: notes('cacao', 'banana') },
      { id: 'tropical-glow', name: 'Tropical Glow', price: 189, desc: 'Mango, pineapple and passion fruit, creamy and bright with a citrus finish.', notes: notes('mango', 'pineapple', 'passion') },
    ],
  },
  {
    id: 'cupcakes',
    label: 'Cupcakes',
    line: 'Baked every morning, frosted by hand.',
    mood: { accent: '#e6a0a0', glowA: 'rgba(210, 71, 90, 0.20)', glowB: 'rgba(107, 58, 38, 0.42)' },
    products: [
      { id: 'chocolate-fudge', name: 'Chocolate Fudge', price: 129, desc: 'Dark cocoa sponge, glossy fudge frosting and a crown of chocolate shards.', notes: notes('cacao', 'fudge') },
      { id: 'red-velvet', name: 'Red Velvet', price: 149, desc: 'Cocoa-kissed red velvet under cream cheese frosting and white chocolate.', notes: notes('redVelvet', 'creamCheese', 'whiteChoc') },
      { id: 'vanilla-dream', name: 'Vanilla Dream', price: 119, desc: 'Vanilla bean sponge with silky buttercream and a scatter of sugar pearls.', notes: notes('vanilla', 'cream') },
      { id: 'caramel-crunch', name: 'Caramel Crunch', price: 139, desc: 'Brown sugar sponge, caramel buttercream, a salted caramel drip and honeycomb.', notes: notes('caramel', 'honeycomb') },
    ],
  },
]

export const formatPrice = (n) => `₹${n}`
