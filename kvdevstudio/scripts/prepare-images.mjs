/**
 * One-off asset prep: pulls real project imagery from the sibling project
 * folders and writes responsive WebP covers into src/assets/work/.
 * Run with `node scripts/prepare-images.mjs` (outputs are committed, so the
 * site never depends on the sibling folders at build time).
 */
import sharp from 'sharp'
import { mkdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const root = path.dirname(fileURLToPath(import.meta.url))
const business = path.resolve(root, '..', '..')
const out = path.resolve(root, '..', 'src', 'assets', 'work')

const jobs = [
  {
    name: 'melt-theory',
    src: path.join(business, 'melt-theory', 'public', 'images', 'story', 'story-final-reveal-1672.webp'),
  },
  {
    name: 'homestead-interiors',
    src: path.join(business, 'homestead-interiors', 'public', 'images', 'projects', 'living-dining-residence', 'living-dining.jpg'),
  },
]

await mkdir(out, { recursive: true })

for (const job of jobs) {
  for (const width of [1600, 800]) {
    const file = path.join(out, `${job.name}-${width}.webp`)
    const info = await sharp(job.src)
      .resize({ width, height: Math.round(width * 0.625), fit: 'cover', position: 'attention' })
      .webp({ quality: width > 1000 ? 78 : 74, effort: 6 })
      .toFile(file)
    console.log(`${path.basename(file)}  ${info.width}x${info.height}  ${(info.size / 1024).toFixed(0)} kB`)
  }
}
