"use client";

import { RoundedBox } from "@react-three/drei";
import { useMemo } from "react";
import * as THREE from "three";
import type { SceneMaterials } from "../materials/useSceneMaterials";

type P = { m: SceneMaterials; position?: [number, number, number]; rotation?: number };

/** Low, deep modular sofa in bouclé with a recessed bronze plinth. Faces local +z. */
export function Sofa({ m, position = [0, 0, 0], rotation = 0 }: P) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, 0.045, 0]} material={m.bronze} receiveShadow>
        <boxGeometry args={[2.86, 0.09, 0.9]} />
      </mesh>
      <RoundedBox args={[3.05, 0.32, 1.08]} radius={0.12} smoothness={4} position={[0, 0.25, 0]} material={m.boucle} castShadow receiveShadow />
      {[-0.74, 0.74].map((x) => (
        <RoundedBox key={x} args={[1.44, 0.17, 0.9]} radius={0.075} smoothness={4} position={[x, 0.48, 0.07]} material={m.boucle} castShadow receiveShadow />
      ))}
      <RoundedBox args={[3.05, 0.46, 0.3]} radius={0.14} smoothness={4} position={[0, 0.6, -0.4]} material={m.boucle} castShadow receiveShadow />
      {[-1.0, 0, 1.0].map((x) => (
        <RoundedBox
          key={x}
          args={[0.92, 0.46, 0.2]}
          radius={0.1}
          smoothness={4}
          position={[x, 0.76, -0.22]}
          rotation={[-0.2, 0, 0]}
          material={m.boucle}
          castShadow
          receiveShadow
        />
      ))}
      {[-1.53, 1.53].map((x) => (
        <RoundedBox key={x} args={[0.26, 0.54, 1.08]} radius={0.12} smoothness={4} position={[x, 0.36, 0]} material={m.boucle} castShadow receiveShadow />
      ))}
      {/* accent cushion */}
      <RoundedBox args={[0.46, 0.4, 0.14]} radius={0.07} smoothness={4} position={[1.12, 0.74, -0.06]} rotation={[-0.25, -0.2, 0.08]} material={m.boucleWarm} castShadow />
      {/* folded linen throw over the arm */}
      <mesh position={[-1.25, 0.58, 0.18]} rotation={[0, 0.06, 0]} material={m.linen} castShadow>
        <boxGeometry args={[0.55, 0.035, 0.7]} />
      </mesh>
    </group>
  );
}

/** Sculptural lounge chair on a walnut sled base. Faces local +z. */
export function LoungeChair({ m, position = [0, 0, 0], rotation = 0 }: P) {
  const sled = useMemo(() => {
    const pts = [
      new THREE.Vector3(-0.36, 0.01, 0.38),
      new THREE.Vector3(-0.36, 0.01, -0.3),
      new THREE.Vector3(-0.36, 0.32, -0.36),
    ];
    return {
      left: new THREE.CatmullRomCurve3(pts),
      right: new THREE.CatmullRomCurve3(pts.map((p) => p.clone().setX(0.36))),
    };
  }, []);
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {[sled.left, sled.right].map((curve, i) => (
        <mesh key={i} material={m.walnut} castShadow>
          <tubeGeometry args={[curve, 24, 0.022, 8, false]} />
        </mesh>
      ))}
      <RoundedBox args={[0.84, 0.22, 0.82]} radius={0.1} smoothness={4} position={[0, 0.36, 0.02]} material={m.boucleWarm} castShadow receiveShadow />
      <RoundedBox
        args={[0.84, 0.78, 0.22]}
        radius={0.1}
        smoothness={4}
        position={[0, 0.74, -0.34]}
        rotation={[-0.28, 0, 0]}
        material={m.boucleWarm}
        castShadow
        receiveShadow
      />
      {[-0.4, 0.4].map((x) => (
        <RoundedBox key={x} args={[0.12, 0.3, 0.7]} radius={0.05} smoothness={3} position={[x, 0.55, -0.02]} material={m.walnut} castShadow />
      ))}
    </group>
  );
}

/** Round travertine coffee table — a lathe-turned pedestal and softened top. */
export function CoffeeTable({ m, position = [0, 0, 0] }: P) {
  const points = useMemo(
    () =>
      [
        [0, 0],
        [0.48, 0],
        [0.49, 0.01],
        [0.49, 0.3],
        [0.74, 0.3],
        [0.79, 0.315],
        [0.8, 0.345],
        [0.79, 0.372],
        [0.75, 0.385],
        [0, 0.385],
      ].map(([x, y]) => new THREE.Vector2(x, y)),
    [],
  );
  return (
    <mesh position={position} material={m.travertine} castShadow receiveShadow>
      <latheGeometry args={[points, 64]} />
    </mesh>
  );
}

/** Walnut drum side table. */
export function SideTable({ m, position = [0, 0, 0] }: P) {
  return (
    <group position={position}>
      <mesh position={[0, 0.27, 0]} material={m.walnut} castShadow receiveShadow>
        <cylinderGeometry args={[0.26, 0.26, 0.54, 40]} />
      </mesh>
      <mesh position={[0, 0.545, 0]} material={m.travertine} castShadow receiveShadow>
        <cylinderGeometry args={[0.28, 0.28, 0.03, 40]} />
      </mesh>
    </group>
  );
}

/** Low travertine bench along the window wall. */
export function StoneBench({ m, position = [0, 0, 0] }: P) {
  return (
    <group position={position}>
      <mesh position={[0, 0.03, 0.02]} material={m.bronze} receiveShadow>
        <boxGeometry args={[3.5, 0.06, 0.46]} />
      </mesh>
      <mesh position={[0, 0.25, 0]} material={m.travertine} castShadow receiveShadow>
        <boxGeometry args={[3.7, 0.4, 0.56]} />
      </mesh>
    </group>
  );
}

/** Woven wool rug. */
export function Rug({ m, position = [0, 0, 0] }: P) {
  return (
    <RoundedBox args={[4.9, 0.025, 3.7]} radius={0.012} smoothness={2} position={position} material={m.rug} receiveShadow />
  );
}

/** Arc floor lamp with a glowing linen shade (no shadow cost). */
export function ArcLamp({ m, position = [0, 0, 0], rotation = 0, lowQuality }: P & { lowQuality?: boolean }) {
  const curve = useMemo(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 0.06, 0),
        new THREE.Vector3(0, 1.4, 0),
        new THREE.Vector3(-0.15, 2.1, 0),
        new THREE.Vector3(-0.8, 2.42, 0),
        new THREE.Vector3(-1.45, 2.28, 0),
        new THREE.Vector3(-1.62, 2.08, 0),
      ]),
    [],
  );
  const tip = useMemo(() => curve.getPoint(1), [curve]);
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, 0.03, 0]} material={m.travertine} castShadow receiveShadow>
        <cylinderGeometry args={[0.2, 0.22, 0.06, 40]} />
      </mesh>
      <mesh material={m.brass} castShadow>
        <tubeGeometry args={[curve, 64, 0.014, 8, false]} />
      </mesh>
      <mesh position={[tip.x, tip.y - 0.04, tip.z]} material={m.shade}>
        <sphereGeometry args={[0.24, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
      </mesh>
      <pointLight
        position={[tip.x, tip.y - 0.16, tip.z]}
        color="#ffe6c4"
        intensity={lowQuality ? 4 : 6}
        distance={5}
        decay={2}
      />
    </group>
  );
}

/** Framed abstract artwork. */
export function Artwork({ m, position = [0, 0, 0] }: P) {
  return (
    <group position={position}>
      <mesh material={m.walnut} castShadow>
        <boxGeometry args={[1.32, 1.66, 0.05]} />
      </mesh>
      <mesh position={[0, 0, 0.027]} material={m.art}>
        <planeGeometry args={[1.22, 1.56]} />
      </mesh>
    </group>
  );
}
