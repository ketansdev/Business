# vanilla-dream.png ships with a faint baked-in white glow (alpha 1–40 over ~25% of
# the canvas). Remap alpha so that haze becomes fully transparent.
import sys
from PIL import Image
src, out = sys.argv[1], sys.argv[2]
im = Image.open(src).convert('RGBA')
r, g, b, a = im.split()
a = a.point(lambda v: 0 if v <= 40 else min(255, round((v - 40) * 255 / 215)))
im = Image.merge('RGBA', (r, g, b, a))
for w in (400, 800):
    im.resize((w, w), Image.LANCZOS).save(f'{out}-{w}.webp', 'WEBP', quality=82, alpha_quality=92, method=6)
im.resize((300, 300)).save(sys.argv[3])
