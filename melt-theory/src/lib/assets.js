// Every path here was verified against /public/assets (see README → Assets).
const BASE = import.meta.env.BASE_URL // '/' in dev, './' in the build
const IMG = `${BASE}assets/img`

const pair = (name, small, large) => ({
  src: `${IMG}/${name}-${large}.webp`,
  srcSet: `${IMG}/${name}-${small}.webp ${small}w, ${IMG}/${name}-${large}.webp ${large}w`,
})

export const ASSETS = {
  // mp4 (H.264) first for Safari/iOS, VP9 webm for browsers without H.264
  introVideo: [
    { src: `${BASE}assets/video/intro.mp4`, type: 'video/mp4' },
    { src: `${BASE}assets/video/intro.webm`, type: 'video/webm' },
  ],
  introPoster: `${IMG}/intro-poster.jpg`,
  splashVideo: [
    { src: `${BASE}assets/video/chocolate-splash.mp4`, type: 'video/mp4' },
    { src: `${BASE}assets/video/chocolate-splash.webm`, type: 'video/webm' },
  ],
  smoke: `${IMG}/smoke.webp`,
  hero: pair('hero_icecream', 640, 1200),
  splashLeft: pair('splash_left', 400, 665),
  splashRight: pair('splash_right', 400, 678),
  splashCenter: pair('splash_center', 520, 909),
  layers: [1, 2, 3, 4, 5].map((n) => pair(`layer_${n}`, 640, 1200)),
}

// Native pixel size of the product canvas shared by hero_icecream + all layers
export const PRODUCT_RATIO = 1199 / 1312

/** Product photography for the collection: square 400/800 px WebP cut-outs. */
export const productImage = (category, slug) => ({
  src: `${IMG}/products/${category}/${slug}-800.webp`,
  srcSet: `${IMG}/products/${category}/${slug}-400.webp 400w, ${IMG}/products/${category}/${slug}-800.webp 800w`,
})
