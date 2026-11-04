"use client";

import { Canvas } from "@react-three/fiber";
import { AdaptiveDpr, PerformanceMonitor } from "@react-three/drei";
import { useState, type RefObject } from "react";
import * as THREE from "three";
import { useSceneMaterials } from "../materials/useSceneMaterials";
import { useCameraRig } from "../hooks/useCameraRig";
import { Architecture } from "../models/Architecture";
import { Sofa, LoungeChair, CoffeeTable, SideTable, StoneBench, Rug, ArcLamp, Artwork } from "../models/Furniture";
import { BranchVase, Bowl, Books, Vessel, StoneStack, OliveTree } from "../models/Decor";
import { Lighting, LightShafts } from "./Lighting";

export type SceneProps = {
  scrollProgress: RefObject<number>;
  /** Pause rendering entirely (e.g. when the hero is scrolled out of view). */
  active: boolean;
  reducedMotion: boolean;
  quality: "high" | "low";
  onReady?: () => void;
};

function Room({ scrollProgress, reducedMotion, quality, onReady }: Omit<SceneProps, "active">) {
  const m = useSceneMaterials();
  useCameraRig({ scrollProgress, reducedMotion, onFirstFrame: onReady });

  return (
    <>
      <color attach="background" args={["#f4f5f6"]} />
      <fog attach="fog" args={["#f1f3f5", 16, 36]} />
      <Lighting quality={quality} />

      <Architecture m={m} />
      <LightShafts m={m} />

      {/* Seating group */}
      <Rug m={m} position={[0.2, 0.0125, -1.7]} />
      <Sofa m={m} position={[2.75, 0, -1.7]} rotation={-Math.PI / 2} />
      <LoungeChair m={m} position={[-2.3, 0, -1.3]} rotation={Math.PI / 2 - 0.35} />
      <CoffeeTable m={m} position={[0.15, 0.025, -1.75]} />
      <SideTable m={m} position={[2.85, 0, 0.35]} />
      <ArcLamp m={m} position={[4.35, 0, 0.55]} rotation={-0.4} lowQuality={quality === "low"} />

      {/* Objects on the coffee table (top surface y ≈ 0.41) */}
      <BranchVase m={m} position={[0.35, 0.41, -1.95]} />
      <Bowl m={m} position={[-0.2, 0.41, -1.45]} />
      <Books m={m} position={[0.3, 0.41, -1.4]} rotation={0.4} />
      <Books m={m} position={[2.85, 0.56, 0.35]} rotation={-0.3} />

      {/* Window wall: stone bench, ceramics, artwork, olive tree */}
      <StoneBench m={m} position={[3.55, 0, -5.62]} />
      <Vessel m={m} position={[2.35, 0.45, -5.6]} tall={0.62} />
      <Vessel m={m} position={[2.75, 0.45, -5.55]} tall={0.38} light />
      <StoneStack m={m} position={[4.6, 0.45, -5.6]} />
      <Books m={m} position={[3.7, 0.45, -5.6]} rotation={0.15} />
      <Artwork m={m} position={[3.6, 2.15, -5.97]} />
      <OliveTree m={m} position={[-5.05, 0, -4.7]} leaves={quality === "high" ? 560 : 300} />
    </>
  );
}

/**
 * The signature hero environment. Loaded with next/dynamic (ssr: false),
 * so three.js never ships in the initial server bundle.
 */
export default function LivingRoomScene({ active, quality, ...rest }: SceneProps) {
  const [dpr, setDpr] = useState<number>(quality === "high" ? 1.75 : 1.25);

  return (
    <Canvas
      shadows={{ type: THREE.PCFSoftShadowMap }}
      dpr={dpr}
      frameloop={active ? (rest.reducedMotion ? "demand" : "always") : "never"}
      camera={{ fov: 38, near: 0.1, far: 60, position: [3.2, 2.6, 11.5] }}
      // R3F defaults: ACES Filmic tone mapping + sRGB output.
      gl={{ antialias: quality === "high", powerPreference: "high-performance" }}
      onCreated={({ gl }) => {
        gl.toneMappingExposure = 1.08; // slightly brighter for the white interior
      }}
      aria-hidden
      style={{ position: "absolute", inset: 0 }}
    >
      <PerformanceMonitor
        onDecline={() => setDpr((d) => Math.max(1, d - 0.5))}
        onIncline={() => setDpr((d) => Math.min(quality === "high" ? 1.75 : 1.25, d + 0.25))}
      >
        <AdaptiveDpr pixelated={false} />
        <Room quality={quality} {...rest} />
      </PerformanceMonitor>
    </Canvas>
  );
}
