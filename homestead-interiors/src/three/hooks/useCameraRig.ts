"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, type RefObject } from "react";
import * as THREE from "three";

type RigOptions = {
  /** 0 → 1 as the visitor scrolls through the hero. */
  scrollProgress: RefObject<number>;
  /** Disable intro flight, parallax and drift. */
  reducedMotion: boolean;
  /** Fires once the intro flight has started (first rendered frame). */
  onFirstFrame?: () => void;
};

const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/**
 * Cinematic camera:
 *  1. Intro — glides in from the doorway to the resting composition.
 *  2. Idle — a barely-there breathing drift.
 *  3. Pointer — subtle parallax that follows the mouse.
 *  4. Scroll — a slow dolly deeper into the room as the hero scrolls away.
 * Framing adapts to portrait / landscape viewports.
 */
export function useCameraRig({ scrollProgress, reducedMotion, onFirstFrame }: RigOptions) {
  const { camera, size } = useThree();
  const pointer = useRef({ x: 0, y: 0 });
  const started = useRef<number | null>(null);
  const lookAt = useRef(new THREE.Vector3());
  const fired = useRef(false);

  const portrait = size.width / size.height < 0.85;

  const frame = useMemo(
    () =>
      portrait
        ? {
            fov: 60,
            rest: new THREE.Vector3(0.6, 1.5, 7.4),
            look: new THREE.Vector3(-0.9, 1.25, -3),
            from: new THREE.Vector3(1.8, 2.3, 10),
          }
        : {
            fov: 38,
            rest: new THREE.Vector3(1.3, 1.55, 7.6),
            look: new THREE.Vector3(-0.55, 1.2, -3),
            from: new THREE.Vector3(3.2, 2.6, 11.5),
          },
    [portrait],
  );

  useEffect(() => {
    const cam = camera as THREE.PerspectiveCamera;
    cam.fov = frame.fov;
    cam.updateProjectionMatrix();
    if (reducedMotion || started.current === null) {
      cam.position.copy(reducedMotion ? frame.rest : frame.from);
      lookAt.current.copy(frame.look);
      cam.lookAt(lookAt.current);
    }
  }, [camera, frame, reducedMotion]);

  useEffect(() => {
    if (reducedMotion) return;
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reducedMotion]);

  const target = useMemo(() => new THREE.Vector3(), []);
  const lookTarget = useMemo(() => new THREE.Vector3(), []);

  useFrame((state, delta) => {
    if (!fired.current) {
      fired.current = true;
      onFirstFrame?.();
    }
    if (reducedMotion) return;

    const t = state.clock.elapsedTime;
    const t0 = started.current ?? (started.current = t);
    const intro = easeInOutCubic(Math.min(1, (t - t0) / 3.4));
    const s = scrollProgress.current ?? 0;

    // Base: intro flight from the doorway to the resting position.
    target.lerpVectors(frame.from, frame.rest, intro);
    // Scroll: dolly forward and slightly down, as if stepping into the room.
    target.z -= s * 2.6;
    target.y -= s * 0.25;
    target.x -= s * 0.5;
    // Pointer parallax + idle breathing.
    target.x += pointer.current.x * 0.32 + Math.sin(t * 0.18) * 0.06;
    target.y += -pointer.current.y * 0.14 + Math.sin(t * 0.23) * 0.03;

    lookTarget.copy(frame.look);
    lookTarget.x += pointer.current.x * 0.12;
    lookTarget.y += s * 0.15;

    const k = 1 - Math.exp(-delta * 2.6);
    camera.position.lerp(target, k);
    lookAt.current.lerp(lookTarget, k);
    camera.lookAt(lookAt.current);
  });
}
