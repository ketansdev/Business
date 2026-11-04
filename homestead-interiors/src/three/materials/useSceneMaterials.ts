"use client";

import { useEffect, useMemo } from "react";
import * as THREE from "three";
import {
  artworkTexture,
  boucleTexture,
  floorTexture,
  plasterTexture,
  shaftTexture,
  skyTexture,
  travertineTexture,
  walnutTexture,
} from "./textures";

/**
 * Every material in the scene, created once and disposed (with its textures)
 * when the hero unmounts. Shared instances keep draw-state changes minimal.
 */
export function useSceneMaterials() {
  const set = useMemo(() => {
    const tex = {
      floor: floorTexture([2.5, 3.5]),
      walnut: walnutTexture([1, 1]),
      walnutSlat: walnutTexture([0.15, 2]),
      travertine: travertineTexture([1, 1]),
      plaster: plasterTexture([3, 2]),
      boucle: boucleTexture([5, 5]),
      sky: skyTexture(),
      shaft: shaftTexture(),
      art: artworkTexture(),
    };

    const mat = {
      floor: new THREE.MeshStandardMaterial({ map: tex.floor, roughness: 0.62, metalness: 0, color: "#ffffff" }),
      plaster: new THREE.MeshStandardMaterial({ map: tex.plaster, roughness: 0.95, color: "#ffffff" }),
      plasterWarm: new THREE.MeshStandardMaterial({ map: tex.plaster, roughness: 0.95, color: "#d5ddd1" }),
      ceiling: new THREE.MeshStandardMaterial({ map: tex.plaster, roughness: 1, color: "#ffffff" }),
      walnut: new THREE.MeshStandardMaterial({ map: tex.walnut, roughness: 0.48, color: "#f3e3cc" }),
      walnutSlat: new THREE.MeshStandardMaterial({ map: tex.walnutSlat, roughness: 0.52, color: "#f0dfc6" }),
      travertine: new THREE.MeshStandardMaterial({ map: tex.travertine, roughness: 0.58, color: "#ffffff" }),
      boucle: new THREE.MeshStandardMaterial({
        map: tex.boucle,
        bumpMap: tex.boucle,
        bumpScale: 1.4,
        roughness: 1,
        color: "#ffffff",
      }),
      boucleWarm: new THREE.MeshStandardMaterial({
        map: tex.boucle,
        bumpMap: tex.boucle,
        bumpScale: 1.4,
        roughness: 1,
        color: "#b9c8b4",
      }),
      linen: new THREE.MeshStandardMaterial({ map: tex.boucle, roughness: 0.95, color: "#c9dbe7" }),
      rug: new THREE.MeshStandardMaterial({ map: tex.boucle, bumpMap: tex.boucle, bumpScale: 0.8, roughness: 1, color: "#e9ecee" }),
      brass: new THREE.MeshStandardMaterial({ color: "#c5a66a", metalness: 0.85, roughness: 0.32 }),
      bronze: new THREE.MeshStandardMaterial({ color: "#2f353c", metalness: 0.6, roughness: 0.45 }),
      ceramic: new THREE.MeshStandardMaterial({ color: "#a9c5d8", roughness: 0.7 }),
      ceramicDark: new THREE.MeshStandardMaterial({ color: "#3a4048", roughness: 0.55 }),
      ceramicPale: new THREE.MeshStandardMaterial({ color: "#efe9df", roughness: 0.45 }),
      branch: new THREE.MeshStandardMaterial({ color: "#6b5f52", roughness: 0.9 }),
      // Leaf colour comes from per-instance colours, so the base stays white.
      leaf: new THREE.MeshStandardMaterial({ color: "#ffffff", roughness: 0.85, side: THREE.DoubleSide }),
      paper: new THREE.MeshStandardMaterial({ color: "#f2f3f4", roughness: 0.9 }),
      bookA: new THREE.MeshStandardMaterial({ color: "#91a58b", roughness: 0.8 }),
      bookB: new THREE.MeshStandardMaterial({ color: "#6f8ba0", roughness: 0.8 }),
      art: new THREE.MeshStandardMaterial({ map: tex.art, roughness: 0.95 }),
      shade: new THREE.MeshStandardMaterial({
        color: "#ffffff",
        emissive: "#fff1dc",
        emissiveIntensity: 1.6,
        roughness: 0.9,
        side: THREE.DoubleSide,
      }),
      cove: new THREE.MeshBasicMaterial({ color: "#fff6ea", toneMapped: false }),
      sky: new THREE.MeshBasicMaterial({ map: tex.sky, toneMapped: false, fog: false }),
      shaft: new THREE.MeshBasicMaterial({
        color: "#fffaf0",
        alphaMap: tex.shaft,
        transparent: true,
        opacity: 0.12,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.DoubleSide,
        fog: false,
      }),
    };

    return { tex, mat };
  }, []);

  useEffect(
    () => () => {
      Object.values(set.mat).forEach((m) => m.dispose());
      Object.values(set.tex).forEach((t) => t.dispose());
    },
    [set],
  );

  return set.mat;
}

export type SceneMaterials = ReturnType<typeof useSceneMaterials>;
