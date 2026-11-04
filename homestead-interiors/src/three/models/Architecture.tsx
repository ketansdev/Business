"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import type { SceneMaterials } from "../materials/useSceneMaterials";

/**
 * ROOM SHELL
 * ------------------------------------------------------------------
 * Plan (metres):  x −6 … 6  (left → right),  z −6 … 8 (window wall → camera),
 * floor y = 0, ceiling y = 4.2. A tall steel-framed window opens the back wall,
 * an arched opening leads to an adjoining room on the left, and a walnut
 * slatted wall warms the right.
 */
export const ROOM = { w: 12, h: 4.2, back: -6, front: 8 } as const;
export const WINDOW = { x0: -4.6, x1: 1.0, y0: 0.25, y1: 3.75 } as const;

const T = 0.3; // wall thickness

function BackWall({ m }: { m: SceneMaterials }) {
  const z = ROOM.back - T / 2;
  const { x0, x1, y0, y1 } = WINDOW;
  const winW = x1 - x0;
  const leftW = x0 - (-6 - T);
  const rightW = 6 + T - x1;
  return (
    <group>
      <mesh position={[-6 - T + leftW / 2, ROOM.h / 2, z]} material={m.plaster} castShadow receiveShadow>
        <boxGeometry args={[leftW, ROOM.h, T]} />
      </mesh>
      <mesh position={[x1 + rightW / 2, ROOM.h / 2, z]} material={m.plaster} castShadow receiveShadow>
        <boxGeometry args={[rightW, ROOM.h, T]} />
      </mesh>
      <mesh position={[x0 + winW / 2, (ROOM.h + y1) / 2, z]} material={m.plaster} castShadow receiveShadow>
        <boxGeometry args={[winW, ROOM.h - y1, T]} />
      </mesh>
      <mesh position={[x0 + winW / 2, y0 / 2, z]} material={m.travertine} castShadow receiveShadow>
        <boxGeometry args={[winW, y0, T + 0.12]} />
      </mesh>
      <WindowFrame m={m} />
    </group>
  );
}

/** Slim bronze glazing bars — 4 bays, one transom. */
function WindowFrame({ m }: { m: SceneMaterials }) {
  const { x0, x1, y0, y1 } = WINDOW;
  const z = ROOM.back - 0.08;
  const w = x1 - x0;
  const h = y1 - y0;
  const bars = useMemo(() => [1, 2, 3].map((k) => x0 + (w * k) / 4), [x0, w]);
  return (
    <group>
      {bars.map((x) => (
        <mesh key={x} position={[x, y0 + h / 2, z]} material={m.bronze} castShadow>
          <boxGeometry args={[0.045, h, 0.07]} />
        </mesh>
      ))}
      <mesh position={[x0 + w / 2, y0 + h * 0.8, z]} material={m.bronze} castShadow>
        <boxGeometry args={[w, 0.045, 0.07]} />
      </mesh>
      {/* perimeter frame */}
      {[
        [x0 + w / 2, y0 + 0.03, w, 0.06],
        [x0 + w / 2, y1 - 0.03, w, 0.06],
      ].map(([x, y, bw, bh], i) => (
        <mesh key={`h${i}`} position={[x, y, z]} material={m.bronze}>
          <boxGeometry args={[bw, bh, 0.08]} />
        </mesh>
      ))}
      {[x0 + 0.03, x1 - 0.03].map((x) => (
        <mesh key={`v${x}`} position={[x, y0 + h / 2, z]} material={m.bronze}>
          <boxGeometry args={[0.06, h, 0.08]} />
        </mesh>
      ))}
    </group>
  );
}

/** Left wall with a generous arched opening (extruded shape with a hole). */
function ArchedWall({ m }: { m: SceneMaterials }) {
  const geometry = useMemo(() => {
    const length = ROOM.front - ROOM.back; // 14
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.lineTo(length, 0);
    shape.lineTo(length, ROOM.h);
    shape.lineTo(0, ROOM.h);
    shape.lineTo(0, 0);

    // Arch: u = distance from the front edge; maps to world z = 8 − u.
    const u0 = 5.5;
    const aw = 2.2;
    const ah = 3.15;
    const r = aw / 2;
    const hole = new THREE.Path();
    hole.moveTo(u0, 0);
    hole.lineTo(u0, ah - r);
    hole.absarc(u0 + r, ah - r, r, Math.PI, 0, true);
    hole.lineTo(u0 + aw, 0);
    hole.lineTo(u0, 0);
    shape.holes.push(hole);

    return new THREE.ExtrudeGeometry(shape, { depth: T, bevelEnabled: false, curveSegments: 32 });
  }, []);

  useLayoutEffect(() => () => geometry.dispose(), [geometry]);

  // Rotate so shape-x runs along −z, extrusion along +x.
  return (
    <mesh
      geometry={geometry}
      material={m.plaster}
      rotation={[0, Math.PI / 2, 0]}
      position={[-6 - T, 0, ROOM.front]}
      castShadow
      receiveShadow
    />
  );
}

/** A glimpse of the adjoining room through the arch. */
function AdjoiningRoom({ m }: { m: SceneMaterials }) {
  return (
    <group>
      <mesh position={[-8.6, ROOM.h / 2, 1.4]} rotation={[0, Math.PI / 2, 0]} material={m.plasterWarm} receiveShadow>
        <planeGeometry args={[5, ROOM.h]} />
      </mesh>
      <mesh position={[-7.45, ROOM.h, 1.4]} rotation={[Math.PI / 2, 0, 0]} material={m.ceiling}>
        <planeGeometry args={[2.6, 5]} />
      </mesh>
      {[-1.0, 3.8].map((z) => (
        <mesh key={z} position={[-7.45, ROOM.h / 2, z]} material={m.plasterWarm} receiveShadow>
          <boxGeometry args={[2.6, ROOM.h, 0.05]} />
        </mesh>
      ))}
      {/* walnut console with a ceramic vessel */}
      <mesh position={[-8.3, 0.42, 1.4]} material={m.walnut} castShadow receiveShadow>
        <boxGeometry args={[0.45, 0.84, 1.6]} />
      </mesh>
      <mesh position={[-8.3, 1.08, 1.2]} material={m.ceramic} castShadow>
        <sphereGeometry args={[0.2, 24, 16]} />
      </mesh>
    </group>
  );
}

/** Right wall: plaster with a band of instanced walnut slats. */
function SlattedWall({ m }: { m: SceneMaterials }) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const zStart = -5.4;
  const zEnd = 0.6;
  const pitch = 0.11;
  const count = Math.floor((zEnd - zStart) / pitch);

  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    const o = new THREE.Object3D();
    for (let i = 0; i < count; i++) {
      o.position.set(5.95, ROOM.h / 2, zStart + i * pitch);
      o.updateMatrix();
      mesh.setMatrixAt(i, o.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
    mesh.computeBoundingSphere();
  }, [count]);

  return (
    <group>
      <mesh position={[6 + T / 2, ROOM.h / 2, 1]} material={m.plaster} receiveShadow>
        <boxGeometry args={[T, ROOM.h, ROOM.front - ROOM.back]} />
      </mesh>
      <mesh position={[5.99, ROOM.h / 2, (zStart + zEnd) / 2]} rotation={[0, -Math.PI / 2, 0]} material={m.bronze}>
        <planeGeometry args={[zEnd - zStart, ROOM.h]} />
      </mesh>
      <instancedMesh ref={ref} args={[undefined, undefined, count]} material={m.walnutSlat} castShadow receiveShadow>
        <boxGeometry args={[0.06, ROOM.h, 0.065]} />
      </instancedMesh>
    </group>
  );
}

function FloorAndCeiling({ m }: { m: SceneMaterials }) {
  const len = ROOM.front - ROOM.back;
  return (
    <group>
      {/* Floor extends under the arch into the adjoining room. */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-1.5, 0, 1]} material={m.floor} receiveShadow>
        <planeGeometry args={[15, len]} />
      </mesh>
      {/* Exterior terrace beyond the window */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-1.8, -0.02, -11]} material={m.travertine} receiveShadow>
        <planeGeometry args={[18, 10]} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, ROOM.h, 1]} material={m.ceiling}>
        <planeGeometry args={[12.6, len]} />
      </mesh>
      {/* Plaster soffit hiding a warm linear cove light along the window wall */}
      <mesh position={[0, ROOM.h - 0.14, ROOM.back + 0.35]} material={m.ceiling} castShadow>
        <boxGeometry args={[12, 0.28, 0.7]} />
      </mesh>
      <mesh position={[0, ROOM.h - 0.29, ROOM.back + 0.72]} material={m.cove}>
        <boxGeometry args={[11.6, 0.012, 0.03]} />
      </mesh>
    </group>
  );
}

/** Bright, softly graded sky and a horizon line behind the glazing. */
function Exterior({ m }: { m: SceneMaterials }) {
  return (
    <mesh position={[-1.8, 3, -15]} material={m.sky}>
      <planeGeometry args={[34, 16]} />
    </mesh>
  );
}

export function Architecture({ m }: { m: SceneMaterials }) {
  return (
    <group>
      <FloorAndCeiling m={m} />
      <BackWall m={m} />
      <ArchedWall m={m} />
      <AdjoiningRoom m={m} />
      <SlattedWall m={m} />
      <Exterior m={m} />
    </group>
  );
}
