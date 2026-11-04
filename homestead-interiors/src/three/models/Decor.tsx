"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import type { SceneMaterials } from "../materials/useSceneMaterials";

type P = { m: SceneMaterials; position?: [number, number, number] };

function rng(seed: number) {
  return () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
}

const lathe = (profile: [number, number][]) => profile.map(([x, y]) => new THREE.Vector2(x, y));

/** Hand-thrown vase silhouette with a few dried branches. */
export function BranchVase({ m, position = [0, 0, 0], scale = 1 }: P & { scale?: number }) {
  const profile = useMemo(
    () =>
      lathe([
        [0, 0],
        [0.06, 0],
        [0.1, 0.04],
        [0.125, 0.13],
        [0.11, 0.22],
        [0.06, 0.29],
        [0.045, 0.33],
        [0.055, 0.345],
        [0.04, 0.345],
        [0.03, 0.3],
        [0, 0.29],
      ]),
    [],
  );
  const branches = useMemo(() => {
    const r = rng(7);
    return Array.from({ length: 7 }, (_, i) => {
      const a = (i / 7) * Math.PI * 2 + r();
      const spread = 0.12 + r() * 0.28;
      const height = 0.55 + r() * 0.45;
      return new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 0.3, 0),
        new THREE.Vector3(Math.cos(a) * spread * 0.3, 0.3 + height * 0.45, Math.sin(a) * spread * 0.3),
        new THREE.Vector3(Math.cos(a) * spread, 0.3 + height, Math.sin(a) * spread),
      ]);
    });
  }, []);
  return (
    <group position={position} scale={scale}>
      <mesh material={m.ceramicDark} castShadow receiveShadow>
        <latheGeometry args={[profile, 48]} />
      </mesh>
      {branches.map((c, i) => (
        <mesh key={i} material={m.branch} castShadow>
          <tubeGeometry args={[c, 16, 0.006, 4, false]} />
        </mesh>
      ))}
    </group>
  );
}

/** Shallow pale ceramic bowl. */
export function Bowl({ m, position = [0, 0, 0] }: P) {
  const profile = useMemo(
    () => lathe([[0, 0], [0.07, 0], [0.16, 0.05], [0.2, 0.09], [0.19, 0.095], [0.15, 0.06], [0.06, 0.02], [0, 0.02]]),
    [],
  );
  return (
    <mesh position={position} material={m.ceramicPale} castShadow receiveShadow>
      <latheGeometry args={[profile, 48]} />
    </mesh>
  );
}

/** Tall amphora-like vessel. */
export function Vessel({ m, position = [0, 0, 0], tall = 0.5, light = false }: P & { tall?: number; light?: boolean }) {
  const profile = useMemo(
    () =>
      lathe([
        [0, 0],
        [0.09, 0],
        [0.15, tall * 0.25],
        [0.14, tall * 0.55],
        [0.07, tall * 0.85],
        [0.075, tall],
        [0.06, tall],
        [0, tall * 0.95],
      ]),
    [tall],
  );
  return (
    <mesh position={position} material={light ? m.ceramicPale : m.ceramic} castShadow receiveShadow>
      <latheGeometry args={[profile, 48]} />
    </mesh>
  );
}

/** A small stack of books. */
export function Books({ m, position = [0, 0, 0], rotation = 0 }: P & { rotation?: number }) {
  const mats = [m.bookA, m.paper, m.bookB];
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {mats.map((mat, i) => (
        <mesh key={i} position={[0, 0.02 + i * 0.042, 0]} rotation={[0, i * 0.12, 0]} material={mat} castShadow receiveShadow>
          <boxGeometry args={[0.34 - i * 0.03, 0.04, 0.25 - i * 0.02]} />
        </mesh>
      ))}
    </group>
  );
}

/** Stacked stone sculpture. */
export function StoneStack({ m, position = [0, 0, 0] }: P) {
  const stones: [number, number, number, number][] = [
    [0, 0.06, 0.16, 0.42],
    [0.01, 0.17, 0.12, 0.45],
    [-0.01, 0.26, 0.085, 0.5],
  ];
  return (
    <group position={position}>
      {stones.map(([x, y, r, sy], i) => (
        <mesh key={i} position={[x, y, 0]} scale={[1, sy, 1]} material={i === 1 ? m.ceramicDark : m.travertine} castShadow receiveShadow>
          <sphereGeometry args={[r, 32, 16]} />
        </mesh>
      ))}
    </group>
  );
}

/**
 * Potted olive tree — tubular trunk + one instanced draw call for every leaf.
 * Silhouetted against the window, its shadow brings the floor to life.
 */
export function OliveTree({ m, position = [0, 0, 0], leaves = 520 }: P & { leaves?: number }) {
  const leafRef = useRef<THREE.InstancedMesh>(null);

  const { trunk, limbs, tips } = useMemo(() => {
    const trunk = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0.5, 0),
      new THREE.Vector3(0.05, 1.2, 0.02),
      new THREE.Vector3(-0.04, 1.75, 0),
      new THREE.Vector3(0.02, 2.1, 0.03),
    ]);
    const ends: [number, number, number][] = [
      [0.55, 2.55, 0.15],
      [-0.5, 2.7, -0.1],
      [0.1, 2.95, 0.35],
      [-0.2, 2.35, 0.45],
      [0.4, 2.3, -0.4],
    ];
    const limbs = ends.map(
      (e, i) =>
        new THREE.CatmullRomCurve3([
          new THREE.Vector3(0.02, 1.7 + (i % 3) * 0.15, 0),
          new THREE.Vector3(e[0] * 0.5, (1.9 + e[1]) / 2, e[2] * 0.5),
          new THREE.Vector3(...e),
        ]),
    );
    return { trunk, limbs, tips: ends };
  }, []);

  useLayoutEffect(() => {
    const mesh = leafRef.current;
    if (!mesh) return;
    const r = rng(42);
    const o = new THREE.Object3D();
    for (let i = 0; i < leaves; i++) {
      const tip = tips[i % tips.length];
      const radius = 0.42 * Math.cbrt(r());
      const theta = r() * Math.PI * 2;
      const phi = Math.acos(2 * r() - 1);
      o.position.set(
        tip[0] + radius * Math.sin(phi) * Math.cos(theta),
        tip[1] + radius * Math.cos(phi) * 0.7 - 0.05,
        tip[2] + radius * Math.sin(phi) * Math.sin(theta),
      );
      o.rotation.set(r() * Math.PI, r() * Math.PI, r() * Math.PI);
      const s = 0.8 + r() * 0.5;
      o.scale.set(s, s, s);
      o.updateMatrix();
      mesh.setMatrixAt(i, o.matrix);
      // Subtle per-leaf tonal variation (silver-green olive)
      const c = new THREE.Color().setHSL(0.18 + r() * 0.04, 0.12 + r() * 0.1, 0.38 + r() * 0.16);
      mesh.setColorAt(i, c);
    }
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    mesh.computeBoundingSphere();
  }, [leaves, tips]);

  return (
    <group position={position}>
      {/* planter */}
      <mesh position={[0, 0.27, 0]} material={m.ceramicDark} castShadow receiveShadow>
        <cylinderGeometry args={[0.36, 0.3, 0.54, 40]} />
      </mesh>
      <mesh position={[0, 0.53, 0]} rotation={[-Math.PI / 2, 0, 0]} material={m.branch}>
        <circleGeometry args={[0.33, 32]} />
      </mesh>
      <mesh material={m.branch} castShadow>
        <tubeGeometry args={[trunk, 32, 0.035, 8, false]} />
      </mesh>
      {limbs.map((c, i) => (
        <mesh key={i} material={m.branch} castShadow>
          <tubeGeometry args={[c, 16, 0.016, 6, false]} />
        </mesh>
      ))}
      <instancedMesh ref={leafRef} args={[undefined, undefined, leaves]} material={m.leaf} castShadow>
        <planeGeometry args={[0.11, 0.028]} />
      </instancedMesh>
    </group>
  );
}
