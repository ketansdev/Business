"use client";

import { Environment, Lightformer } from "@react-three/drei";
import { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import type { SceneMaterials } from "../materials/useSceneMaterials";
import { WINDOW, ROOM } from "../models/Architecture";

/** Late-morning sun entering through the window — clear and bright. */
export const SUN = {
  position: new THREE.Vector3(-7, 9.5, -17),
  target: new THREE.Vector3(-1, 0, -1),
};

export function Lighting({ quality }: { quality: "high" | "low" }) {
  const sun = useRef<THREE.DirectionalLight>(null);

  useLayoutEffect(() => {
    const light = sun.current;
    if (!light) return;
    light.target.position.copy(SUN.target);
    light.target.updateMatrixWorld();
    const cam = light.shadow.camera;
    cam.left = -9;
    cam.right = 9;
    cam.top = 9;
    cam.bottom = -9;
    cam.near = 4;
    cam.far = 40;
    cam.updateProjectionMatrix();
  }, []);

  const mapSize = quality === "high" ? 2048 : 1024;

  return (
    <>
      <hemisphereLight args={["#f4f8fb", "#e6e8e4", 1.35]} />
      <directionalLight
        ref={sun}
        position={SUN.position.toArray()}
        color="#fff3e0"
        intensity={4.2}
        castShadow
        shadow-mapSize-width={mapSize}
        shadow-mapSize-height={mapSize}
        shadow-bias={-0.0004}
        shadow-normalBias={0.035}
        shadow-radius={quality === "high" ? 6 : 3}
      />
      {/* Soft bounce from the sunlit floor back up into the room */}
      <pointLight position={[-1.2, 0.4, -2.2]} color="#fff8ee" intensity={2.4} distance={7} decay={2} />

      {/* Image-based lighting rendered once from local light-formers — no HDR download. */}
      <Environment resolution={quality === "high" ? 128 : 64} frames={1} environmentIntensity={0.7}>
        <color attach="background" args={["#eef1f3"]} />
        <Lightformer form="rect" intensity={4} color="#ffffff" position={[-1.8, 2, -9]} scale={[8, 4, 1]} />
        <Lightformer form="rect" intensity={0.8} color="#f4f6f8" position={[0, 6, 0]} rotation-x={Math.PI / 2} scale={[12, 12, 1]} />
        <Lightformer form="rect" intensity={0.5} color="#dfe9ef" position={[8, 2, 0]} rotation-y={-Math.PI / 2} scale={[10, 4, 1]} />
      </Environment>
    </>
  );
}

/**
 * Faux volumetric light: a few crossed, additively blended planes laid along
 * the sun direction, fading from the window towards the floor. Very cheap.
 */
export function LightShafts({ m }: { m: SceneMaterials }) {
  const shafts = useMemo(() => {
    const dir = SUN.target.clone().sub(SUN.position).normalize(); // sun → room
    const up = dir.clone().negate();
    const quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), up);
    const length = 7;
    const { x0, x1, y0, y1 } = WINDOW;
    const bays = 4;
    const bw = (x1 - x0) / bays;
    return Array.from({ length: bays }, (_, i) => {
      const start = new THREE.Vector3(x0 + bw * (i + 0.5), (y0 + y1) / 2 + 0.5, ROOM.back);
      const center = start.clone().addScaledVector(dir, length / 2);
      return { center, quat, width: bw * 0.86, length, key: i };
    });
  }, []);

  return (
    <group>
      {shafts.map(({ center, quat, width, length, key }) => (
        <group key={key} position={center} quaternion={quat}>
          <mesh material={m.shaft} renderOrder={10}>
            <planeGeometry args={[width, length]} />
          </mesh>
          <mesh material={m.shaft} rotation={[0, Math.PI / 2, 0]} renderOrder={10}>
            <planeGeometry args={[width * 0.9, length]} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
