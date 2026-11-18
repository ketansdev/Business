import * as THREE from 'three'

/**
 * Procedural ripstop-weave normal map (no image download): plain weave with
 * slight per-thread irregularity, reinforced every 16 threads.
 */
export function createFabricNormalMap(size = 256) {
  const threads = 64
  const cell = size / threads
  const height = new Float32Array(size * size)

  let seed = 1337
  const rand = () => (seed = (seed * 16807) % 2147483647) / 2147483647
  const jitter = Array.from({ length: threads }, () => 0.82 + 0.36 * rand())

  for (let y = 0; y < size; y++) {
    const ty = Math.floor(y / cell)
    const weft = Math.sin((((y % cell) + 0.5) / cell) * Math.PI)
    for (let x = 0; x < size; x++) {
      const tx = Math.floor(x / cell)
      const warp = Math.sin((((x % cell) + 0.5) / cell) * Math.PI)
      let h = (tx + ty) % 2 === 0 ? 0.5 + 0.5 * warp * jitter[tx] : 0.5 + 0.5 * weft * jitter[ty]
      if (tx % 16 === 0) h += 0.22 * warp
      if (ty % 16 === 0) h += 0.22 * weft
      height[y * size + x] = h
    }
  }

  const data = new Uint8Array(size * size * 4)
  const strength = 1.6
  const at = (x: number, y: number) => height[((y + size) % size) * size + ((x + size) % size)]
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let nx = (at(x - 1, y) - at(x + 1, y)) * strength
      let ny = (at(x, y - 1) - at(x, y + 1)) * strength
      let nz = 1
      const len = Math.hypot(nx, ny, nz)
      nx /= len
      ny /= len
      nz /= len
      const i = (y * size + x) * 4
      data[i] = (nx * 0.5 + 0.5) * 255
      data[i + 1] = (ny * 0.5 + 0.5) * 255
      data[i + 2] = (nz * 0.5 + 0.5) * 255
      data[i + 3] = 255
    }
  }

  const tex = new THREE.DataTexture(data, size, size, THREE.RGBAFormat)
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping
  tex.magFilter = THREE.LinearFilter
  tex.minFilter = THREE.LinearMipmapLinearFilter
  tex.generateMipmaps = true
  tex.anisotropy = 8
  tex.repeat.set(2.6, 2.6)
  tex.needsUpdate = true
  return tex
}
