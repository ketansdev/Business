import sys, os, glob
from PIL import Image
src, out = sys.argv[1], sys.argv[2]
folders = {'wafles': 'waffles', 'Icecreams': 'ice-creams', 'smoothies': 'smoothies', 'cupcakes': 'cupcakes'}
total = 0
for f in sorted(glob.glob(f'{src}/*/*.png')):
    cat = folders[os.path.basename(os.path.dirname(f))]
    slug = os.path.splitext(os.path.basename(f))[0]
    os.makedirs(f'{out}/{cat}', exist_ok=True)
    im = Image.open(f).convert('RGBA')
    for w in (400, 800):
        p = f'{out}/{cat}/{slug}-{w}.webp'
        im.resize((w, w), Image.LANCZOS).save(p, 'WEBP', quality=82, alpha_quality=92, method=6)
        total += os.path.getsize(p)
print('total', total // 1024, 'KB')
