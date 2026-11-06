import sys, numpy as np
from PIL import Image
from scipy import ndimage as ndi
src, out = sys.argv[1], sys.argv[2]

# ---- 1. split chocolate_splash.png into left / center / right
im = np.array(Image.open(f'{src}/chocolate_splash.png').convert('RGBA'))
a = im[...,3]
lab, n = ndi.label(a > 6, structure=np.ones((3,3)))
sizes = ndi.sum(np.ones_like(a), lab, range(1, n+1))
big = np.argsort(sizes)[::-1][:3] + 1
cx = {b: ndi.center_of_mass(a > 6, lab, b)[1] for b in big}
order = sorted(big, key=lambda b: cx[b])   # left, center, right
names = ['splash_left', 'splash_center', 'splash_right']
coms = ndi.center_of_mass(a > 6, lab, range(1, n+1))
assign = np.zeros(n+1, int)
for i in range(1, n+1):
    x = coms[i-1][1]
    assign[i] = min(range(3), key=lambda k: abs(x - cx[order[k]]))
for k, name in enumerate(names):
    m = (assign[lab] == k) & (lab > 0)
    # keep faint antialiased pixels near the mask
    m = ndi.binary_dilation(m, iterations=2)
    part = im.copy(); part[...,3] = np.where(m, a, 0)
    ys, xs = np.where(part[...,3] > 0)
    crop = part[ys.min():ys.max()+1, xs.min():xs.max()+1]
    Image.fromarray(crop).save(f'{out}/{name}.png')
    print(name, crop.shape[1], 'x', crop.shape[0])

# ---- 2. key out baked checkerboard on layer_4.png
rgb = np.array(Image.open(f'{src}/layer_4.png').convert('RGB')).astype(np.float32)
chroma = rgb.max(-1) - rgb.min(-1)
lum = rgb.mean(-1)
solid = (chroma > 28) | (lum < 170)
solid = ndi.binary_opening(solid, iterations=1)
lab, n = ndi.label(solid)
sizes = ndi.sum(solid, lab, range(1, n+1))
keep = np.isin(lab, np.where(sizes > 400)[0] + 1)
filled = ndi.binary_fill_holes(keep)
holes, nh = ndi.label(filled & ~keep)
hs = ndi.sum(np.ones_like(chroma), holes, range(1, nh+1))
print('hole sizes', sorted(hs.astype(int))[-12:])
big_holes = np.isin(holes, np.where(hs > 2500)[0] + 1)
filled = filled & ~big_holes                         # enclosed background stays transparent
soft = np.clip((chroma - 6) / 22, 0, 1)              # edge ramp
edge = ndi.binary_dilation(filled, iterations=3) & ~filled
alpha = np.where(filled, 1.0, np.where(edge, soft, 0.0))
alpha = ndi.gaussian_filter(alpha, 0.6) * (ndi.binary_dilation(filled, iterations=4))
bg = np.full(3, 245.0)
al = np.clip(alpha, 1e-3, 1)[..., None]
col = np.clip((rgb - (1 - al) * bg) / al, 0, 255)    # un-mix background from edges
outimg = np.dstack([col, alpha * 255]).astype(np.uint8)
Image.fromarray(outimg).save(f'{out}/layer_4.png')
print('layer_4 opaque%', round((alpha > .5).mean() * 100, 1))
