# Find Your Melt compositions: PNG → WebP (560 / 1000 px), same base names.
# melt-dreamer.png ships with a faint baked-in light haze (alpha 1–40 over ~26% of
# the canvas): remap alpha so it becomes fully transparent on the dark studio.
import sys, os, glob
from PIL import Image
src, out = sys.argv[1], sys.argv[2]
total = 0
for f in sorted(glob.glob(f'{src}/*.png')):
    name = os.path.splitext(os.path.basename(f))[0]
    im = Image.open(f).convert('RGBA')
    if name == 'melt-dreamer':
        r, g, b, a = im.split()
        a = a.point(lambda v: 0 if v <= 40 else min(255, round((v - 40) * 255 / 215)))
        im = Image.merge('RGBA', (r, g, b, a))
    for w in (560, 1000):
        p = f'{out}/{name}-{w}.webp'
        im.resize((w, w), Image.LANCZOS).save(p, 'WEBP', quality=84, alpha_quality=92, method=6)
        total += os.path.getsize(p)
print('total', total // 1024, 'KB')
