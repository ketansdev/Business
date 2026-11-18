import { Suspense, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame } from '@react-three/fiber'
import { StudioEnvironment, StudioLights, configureRenderer } from './three/Studio'
import { pointer } from '../lib/pointer'

/**
 * Abstract "armillary" for the About section: polished rings turning on
 * different axes around a frosted core, one lime satellite in orbit —
 * design, technology and creativity held in balance.
 */
function Armillary({ reduced, quality }: { reduced: boolean; quality: 'high' | 'low' }) {
  const root = useRef<THREE.Group>(null)
  const rings = useRef<(THREE.Mesh | null)[]>([])
  const sat = useRef<THREE.Mesh>(null)
  const tilt = useRef({ x: 0, y: 0 })

  const mats = useMemo(
    () => ({
      chrome: new THREE.MeshStandardMaterial({ color: '#e4e8ee', metalness: 1, roughness: 0.12, envMapIntensity: 1.35 }),
      steel: new THREE.MeshStandardMaterial({ color: '#7a808a', metalness: 1, roughness: 0.3, envMapIntensity: 1.1 }),
      lime: new THREE.MeshStandardMaterial({ color: '#c6ff4d', roughness: 0.3, metalness: 0.1, emissive: new THREE.Color('#c6ff4d'), emissiveIntensity: 0.25 }),
      core:
        quality === 'high'
          ? new THREE.MeshPhysicalMaterial({ color: '#ffffff', roughness: 0.22, transmission: 1, thickness: 1.2, ior: 1.45, iridescence: 0.5, clearcoat: 1, envMapIntensity: 1.4 })
          : new THREE.MeshPhysicalMaterial({ color: '#cfd6df', roughness: 0.2, metalness: 0.2, transparent: true, opacity: 0.6, iridescence: 0.5, envMapIntensity: 1.4 }),
    }),
    [quality],
  )

  const RINGS = [
    { r: 1.55, tube: 0.022, mat: mats.chrome, axis: new THREE.Vector3(1, 0.2, 0).normalize(), speed: 0.22, base: [0.3, 0, 0.2] },
    { r: 1.3, tube: 0.03, mat: mats.steel, axis: new THREE.Vector3(0.1, 1, 0.3).normalize(), speed: -0.3, base: [1.2, 0.4, 0] },
    { r: 1.05, tube: 0.018, mat: mats.chrome, axis: new THREE.Vector3(0.3, 0.2, 1).normalize(), speed: 0.4, base: [-0.5, 0.9, 0.4] },
    { r: 0.82, tube: 0.012, mat: mats.lime, axis: new THREE.Vector3(1, 1, 0).normalize(), speed: -0.5, base: [0.9, -0.6, 0.3] },
  ] as const

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05)
    const t = state.clock.elapsedTime
    if (!reduced) {
      rings.current.forEach((m, i) => m?.rotateOnAxis(RINGS[i].axis, RINGS[i].speed * dt))
      if (sat.current) {
        const a = t * 0.55
        sat.current.position.set(Math.cos(a) * 1.55, Math.sin(a * 0.8) * 0.35, Math.sin(a) * 1.55)
      }
    }
    const k = 1 - Math.exp(-2.2 * dt)
    tilt.current.x += ((reduced ? 0 : pointer.y) * 0.25 - tilt.current.x) * k
    tilt.current.y += ((reduced ? 0 : pointer.x) * 0.35 - tilt.current.y) * k
    if (root.current) {
      root.current.rotation.x = 0.25 - tilt.current.x
      root.current.rotation.y = tilt.current.y + (reduced ? 0 : t * 0.06)
    }
  })

  return (
    <group ref={root}>
      <mesh material={mats.core}>
        <icosahedronGeometry args={[0.5, 4]} />
      </mesh>
      {RINGS.map((r, i) => (
        <mesh
          key={i}
          ref={(m) => {
            rings.current[i] = m
          }}
          material={r.mat}
          rotation={r.base as unknown as [number, number, number]}
        >
          <torusGeometry args={[r.r, r.tube, 24, 160]} />
        </mesh>
      ))}
      <mesh ref={sat} material={mats.lime} position={[1.55, 0, 0]}>
        <sphereGeometry args={[0.07, 32, 24]} />
      </mesh>
    </group>
  )
}

export default function About3D({ reduced, running, quality }: { reduced: boolean; running: boolean; quality: 'high' | 'low' }) {
  return (
    <Canvas
      dpr={[1, quality === 'high' ? 1.75 : 1.4]}
      frameloop={running ? (reduced ? 'demand' : 'always') : 'never'}
      camera={{ fov: 32, position: [0, 0, 6.4] }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      onCreated={({ gl }) => configureRenderer(gl)}
      aria-hidden
    >
      <Suspense fallback={null}>
        <StudioEnvironment />
        <StudioLights />
        <Armillary reduced={reduced} quality={quality} />
      </Suspense>
    </Canvas>
  )
}
