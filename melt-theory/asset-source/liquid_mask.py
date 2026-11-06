# Generates the "liquid curtain" mask path used by .liquid (styles.css).
# viewBox 0 0 100 300, stretched: [0,~95] empty · solid body · drips below y=200 · empty.
import math
drips = [(96, 1.6, 18), (88, 2.4, 34), (81, 1.2, 10), (73, 2.8, 46), (64, 1.5, 16), (57, 2.2, 28),
         (49, 1.3, 12), (41, 3.0, 52), (33, 1.6, 20), (26, 2.1, 30), (17, 1.4, 14), (10, 2.6, 40), (3, 1.5, 18)]
def bottom(x):
    y = 200 + 1.6 * math.sin(x * 0.21) + 1.0 * math.sin(x * 0.53 + 1.3)  # undulating rim
    for c, w, L in drips:
        u = (x - c) / w
        if abs(u) < 1:
            y += L * (1 - u * u) ** 0.3          # steep sides, rounded tip
        y += 2.2 * math.exp(-(u / 2.2) ** 2)     # soft fillet into the rim
    return y
def top(x):  # trailing surface while draining: gentle swell, kept within 94..99
    return 96.5 + 1.6 * math.sin(x * 0.17 + 0.4) + 0.8 * math.sin(x * 0.61)
xs = [i / 4 for i in range(0, 401)]
pts = [f'{x:.2f} {top(x):.2f}' for x in xs] + [f'{x:.2f} {bottom(x):.2f}' for x in reversed(xs)]
print('M' + ' L'.join(pts) + 'Z')
