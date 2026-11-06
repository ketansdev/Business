# Story section: PNG → WebP at two widths, same base names under public/images/story/
import sys, os, glob
from PIL import Image
src, out = sys.argv[1], sys.argv[2]
total = 0
for f in sorted(glob.glob(f'{src}/*.png')):
    name = os.path.splitext(os.path.basename(f))[0]
    im = Image.open(f)
    widths = (960, 1672) if im.width > im.height else (480, 900)  # scenes vs ingredient cut-outs
    im = im.convert('RGBA' if im.mode == 'RGBA' else 'RGB')
    for w in widths:
        r = im.resize((w, round(im.height * w / im.width)), Image.LANCZOS)
        p = f'{out}/{name}-{w}.webp'
        r.save(p, 'WEBP', quality=82, method=6, **({'alpha_quality': 92} if im.mode == 'RGBA' else {}))
        total += os.path.getsize(p)
print('total', total // 1024, 'KB')
