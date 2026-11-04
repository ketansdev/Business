import * as THREE from "three";

/**
 * Procedural material textures, painted on a 2D canvas at runtime.
 * No external image downloads, tiny memory footprint, and every texture is
 * returned to the caller for explicit disposal.
 */

type Painter = (ctx: CanvasRenderingContext2D, size: number, rand: () => number) => void;

/** Deterministic PRNG so textures look identical on every load. */
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function paint(size: number, seed: number, painter: Painter, opts: { repeat?: [number, number]; color?: boolean } = {}) {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  painter(ctx, size, mulberry32(seed));
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.anisotropy = 4;
  if (opts.repeat) tex.repeat.set(...opts.repeat);
  if (opts.color !== false) tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function speckle(ctx: CanvasRenderingContext2D, size: number, rand: () => number, count: number, color: string, alpha: number, maxR: number) {
  ctx.fillStyle = color;
  for (let i = 0; i < count; i++) {
    ctx.globalAlpha = alpha * rand();
    ctx.beginPath();
    ctx.ellipse(rand() * size, rand() * size, rand() * maxR + 0.4, rand() * maxR * 0.4 + 0.3, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

/** Wide, very pale whitewashed-oak floor boards. */
export const floorTexture = (repeat: [number, number]) =>
  paint(
    1024,
    11,
    (ctx, s, r) => {
      ctx.fillStyle = "#e4dccf";
      ctx.fillRect(0, 0, s, s);
      const boards = 4;
      const bw = s / boards;
      for (let b = 0; b < boards; b++) {
        const tone = 0.92 + r() * 0.12;
        ctx.fillStyle = `rgb(${232 * tone},${224 * tone},${211 * tone})`;
        ctx.fillRect(b * bw, 0, bw, s);
        // grain
        for (let g = 0; g < 70; g++) {
          const x = b * bw + r() * bw;
          ctx.strokeStyle = `rgba(150,130,105,${0.03 + r() * 0.06})`;
          ctx.lineWidth = 0.6 + r() * 1.6;
          ctx.beginPath();
          ctx.moveTo(x, 0);
          for (let y = 0; y <= s; y += 32) ctx.lineTo(x + Math.sin(y * 0.01 + g) * 3 * r(), y);
          ctx.stroke();
        }
        // board seams + staggered butt joints
        ctx.fillStyle = "rgba(120,105,88,0.22)";
        ctx.fillRect(b * bw, 0, 2, s);
        ctx.fillRect(b * bw, (b * 0.37 % 1) * s, bw, 2);
      }
    },
    { repeat },
  );

/** Warm walnut with flowing cathedral grain. */
export const walnutTexture = (repeat: [number, number] = [1, 1]) =>
  paint(
    512,
    23,
    (ctx, s, r) => {
      const grad = ctx.createLinearGradient(0, 0, s, 0);
      grad.addColorStop(0, "#5b4330");
      grad.addColorStop(0.5, "#6b4f38");
      grad.addColorStop(1, "#56402e");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, s, s);
      for (let i = 0; i < 160; i++) {
        const x0 = r() * s;
        ctx.strokeStyle = `rgba(${r() > 0.5 ? "35,24,16" : "120,92,66"},${0.08 + r() * 0.18})`;
        ctx.lineWidth = 0.5 + r() * 2;
        ctx.beginPath();
        for (let y = 0; y <= s; y += 8) {
          const x = x0 + Math.sin(y * 0.02 + i) * 6 + Math.sin(y * 0.005 + i * 2) * 14;
          if (y === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
    },
    { repeat },
  );

/** Pale honed limestone: soft horizontal veining and fine pores. */
export const travertineTexture = (repeat: [number, number] = [1, 1]) =>
  paint(
    1024,
    37,
    (ctx, s, r) => {
      ctx.fillStyle = "#ebe7e0";
      ctx.fillRect(0, 0, s, s);
      for (let i = 0; i < 90; i++) {
        const y0 = r() * s;
        ctx.strokeStyle = `rgba(${r() > 0.5 ? "196,188,176" : "250,248,244"},${0.15 + r() * 0.3})`;
        ctx.lineWidth = 1 + r() * 7;
        ctx.beginPath();
        ctx.moveTo(0, y0);
        for (let x = 0; x <= s; x += 24) ctx.lineTo(x, y0 + Math.sin(x * 0.01 + i) * 4 + (r() - 0.5) * 2);
        ctx.stroke();
      }
      speckle(ctx, s, r, 700, "#b5ada2", 0.4, 5);
    },
    { repeat },
  );

/** Soft lime-wash plaster mottling for walls and ceiling. */
export const plasterTexture = (repeat: [number, number] = [1, 1]) =>
  paint(
    512,
    41,
    (ctx, s, r) => {
      ctx.fillStyle = "#f7f7f5";
      ctx.fillRect(0, 0, s, s);
      for (let i = 0; i < 260; i++) {
        const g = ctx.createRadialGradient(r() * s, r() * s, 0, r() * s, r() * s, 30 + r() * 120);
        const light = r() > 0.5;
        g.addColorStop(0, light ? "rgba(255,255,255,0.12)" : "rgba(196,202,206,0.07)");
        g.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, s, s);
      }
    },
    { repeat },
  );

/** Bouclé / wool micro-texture — used as both colour and bump map. */
export const boucleTexture = (repeat: [number, number] = [6, 6]) =>
  paint(
    256,
    53,
    (ctx, s, r) => {
      ctx.fillStyle = "#eeefee";
      ctx.fillRect(0, 0, s, s);
      for (let i = 0; i < 2400; i++) {
        const v = 212 + r() * 43;
        ctx.fillStyle = `rgba(${v},${v},${v - 3},0.5)`;
        ctx.beginPath();
        ctx.arc(r() * s, r() * s, 0.6 + r() * 2.2, 0, Math.PI * 2);
        ctx.fill();
      }
    },
    { repeat },
  );

/** Bright, softly blue sky and garden horizon visible through the window. */
export const skyTexture = () =>
  paint(
    256,
    61,
    (ctx, s) => {
      const g = ctx.createLinearGradient(0, 0, 0, s);
      g.addColorStop(0, "#cfe0eb");
      g.addColorStop(0.5, "#f4f8fb");
      g.addColorStop(0.72, "#e7efe4");
      g.addColorStop(1, "#a9b9a2");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, s, s);
    },
    { repeat: [1, 1] },
  );

/** Vertical fade used for the volumetric light shafts (alpha map, not colour). */
export const shaftTexture = () =>
  paint(
    128,
    71,
    (ctx, s) => {
      const g = ctx.createLinearGradient(0, 0, 0, s);
      g.addColorStop(0, "#ffffff");
      g.addColorStop(1, "#000000");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, s, s);
      const h = ctx.createLinearGradient(0, 0, s, 0);
      h.addColorStop(0, "rgba(0,0,0,1)");
      h.addColorStop(0.2, "rgba(0,0,0,0)");
      h.addColorStop(0.8, "rgba(0,0,0,0)");
      h.addColorStop(1, "rgba(0,0,0,1)");
      ctx.fillStyle = h;
      ctx.fillRect(0, 0, s, s);
    },
    { color: false },
  );

/** Abstract artwork for the wall — sage and blue washes with a champagne arc. */
export const artworkTexture = () =>
  paint(
    512,
    83,
    (ctx, s, r) => {
      ctx.fillStyle = "#f6f7f7";
      ctx.fillRect(0, 0, s, s);
      for (let i = 0; i < 40; i++) {
        ctx.fillStyle = r() > 0.5 ? "rgba(145,165,139,0.07)" : "rgba(169,197,216,0.08)";
        ctx.beginPath();
        ctx.ellipse(s * 0.5 + (r() - 0.5) * s * 0.6, s * 0.62 + (r() - 0.5) * s * 0.3, s * 0.3 * r() + 40, s * 0.1 * r() + 20, 0, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.strokeStyle = "rgba(197,166,106,0.9)";
      ctx.lineWidth = 10;
      ctx.beginPath();
      ctx.arc(s * 0.5, s * 0.72, s * 0.3, Math.PI * 1.05, Math.PI * 1.95);
      ctx.stroke();
      ctx.fillStyle = "rgba(37,42,48,0.85)";
      ctx.beginPath();
      ctx.arc(s * 0.66, s * 0.36, s * 0.06, 0, Math.PI * 2);
      ctx.fill();
    },
    { repeat: [1, 1] },
  );
