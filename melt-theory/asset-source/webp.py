import sys, os
from PIL import Image
src_dirs, out = sys.argv[1:-1], sys.argv[-1]
jobs = {'hero_icecream':[1200,640],'layer_1':[1200,640],'layer_2':[1200,640],'layer_3':[1200,640],'layer_4':[1200,640],'layer_5':[1200,640],
        'splash_left':[665,400],'splash_right':[678,400],'splash_center':[909,520]}
for name, widths in jobs.items():
    f = next(os.path.join(d, name+'.png') for d in src_dirs[::-1] if os.path.exists(os.path.join(d, name+'.png')))
    im = Image.open(f).convert('RGBA')
    for w in widths:
        r = im.resize((w, round(im.height*w/im.width)), Image.LANCZOS) if w != im.width else im
        p = f'{out}/{name}-{w}.webp'; r.save(p, 'WEBP', quality=84, method=6, alpha_quality=95)
        print(os.path.basename(p), r.size, os.path.getsize(p)//1024, 'KB', '<-', f)
