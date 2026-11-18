/**
 * Writes the responsive WebP files for every entry in src/data/images.js.
 *
 *   masters  assets/<file>.*                      full size originals (any format sharp reads)
 *   output   public/assets/<file>-<width>.webp    served as /assets/<file>-<width>.webp
 *
 * Run after adding or replacing a master: `npm run images`.
 * Needs sharp, which is not a project dependency. Install it once with `npm i -D sharp`.
 * Outputs are committed, so building the site never needs sharp.
 */
import { mkdir, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { images, imageWidths } from '../src/data/images.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const mastersDir = path.join(root, 'assets');
const outDir = path.join(root, 'public', 'assets');

// Quality 80 keeps the small type inside the artwork crisp. smartSubsample stops orange on dark from smearing.
const webp = { quality: 80, effort: 6, smartSubsample: true };

export async function optimizeImages(sharp) {
  await mkdir(outDir, { recursive: true });
  const masters = await readdir(mastersDir);

  for (const { file, width, height } of Object.values(images)) {
    const master = masters.find((name) => path.parse(name).name === file);
    if (!master) throw new Error(`No master named "${file}.*" in assets/`);
    const input = path.join(mastersDir, master);

    const meta = await sharp(input).metadata();
    if (meta.width !== width || meta.height !== height) {
      console.warn(`! ${file}: master is ${meta.width}x${meta.height}, src/data/images.js says ${width}x${height}. Update the registry.`);
    }

    for (const w of imageWidths) {
      const out = path.join(outDir, `${file}-${w}.webp`);
      const info = await sharp(input).resize({ width: w, withoutEnlargement: true }).webp(webp).toFile(out);
      console.log(`${path.basename(out).padEnd(36)} ${`${info.width}x${info.height}`.padEnd(10)} ${(info.size / 1024).toFixed(0).padStart(4)} kB`);
    }
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  let sharp;
  try {
    ({ default: sharp } = await import('sharp'));
  } catch {
    console.error('This script needs sharp. Install it once with: npm i -D sharp');
    process.exit(1);
  }
  await optimizeImages(sharp);
}
