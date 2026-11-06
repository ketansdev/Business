import sys, numpy as np
from PIL import Image
from scipy import ndimage as ndi
rng = np.random.default_rng(7); N = 768
def fbm(n, octaves=6):
    acc = np.zeros((n, n)); amp = 1; tot = 0
    for o in range(octaves):
        s = 4 * 2**o
        g = rng.random((s, s))
        up = ndi.zoom(g, n / s, order=3, mode='grid-wrap')[:n, :n]
        acc += up * amp; tot += amp; amp *= 0.55
    return acc / tot
base = fbm(N)
# domain warp for wispy smoke
wx, wy = fbm(N), fbm(N)
yy, xx = np.mgrid[0:N, 0:N].astype(float)
warped = ndi.map_coordinates(base, [yy + (wy - .5) * 180, xx + (wx - .5) * 180], order=1, mode='wrap')
v = np.clip((warped - 0.42) / 0.3, 0, 1) ** 1.6
r = np.hypot(xx - N/2, yy - N/2) / (N/2)
v *= np.clip(1 - r, 0, 1) ** 1.3                    # soft round falloff
a = (ndi.gaussian_filter(v, 2.5) * 255).astype(np.uint8)
img = np.dstack([np.full_like(a, 236), np.full_like(a, 214), np.full_like(a, 186), a])
Image.fromarray(img, 'RGBA').save(sys.argv[1], 'WEBP', quality=80, alpha_quality=100, method=6)
