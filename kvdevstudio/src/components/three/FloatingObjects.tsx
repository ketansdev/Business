import { useEffect, useMemo, useRef, type ReactNode } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import { pointer } from '../../lib/pointer'

type Mats = ReturnType<typeof createMaterials>

function createMaterials(quality: 'high' | 'low') {
  const hi = quality === 'high'
  return {
    chrome: new THREE.MeshStandardMaterial({ color: '#dfe3e8', metalness: 1, roughness: 0.14, envMapIntensity: 1.3 }),
    steel: new THREE.MeshStandardMaterial({ color: '#4a5059', metalness: 0.95, roughness: 0.3, envMapIntensity: 1.1 }),
    graphite: new THREE.MeshPhysicalMaterial({ color: '#16191e', metalness: 0.3, roughness: 0.45, clearcoat: 1, clearcoatRoughness: 0.2 }),
    lime: new THREE.MeshStandardMaterial({ color: '#c6ff4d', metalness: 0.1, roughness: 0.32, emissive: new THREE.Color('#c6ff4d'), emissiveIntensity: 0.08 }),
    crystal: hi
      ? new THREE.MeshPhysicalMaterial({
          color: '#ffffff',
          metalness: 0,
          roughness: 0.04,
          transmission: 1,
          thickness: 0.9,
          ior: 1.55,
          iridescence: 0.8,
          iridescenceIOR: 1.35,
          clearcoat: 1,
          envMapIntensity: 1.6,
          flatShading: true,
        })
      : new THREE.MeshPhysicalMaterial({
          color: '#dfe7f0',
          metalness: 0.2,
          roughness: 0.08,
          transparent: true,
          opacity: 0.55,
          iridescence: 0.8,
          envMapIntensity: 1.6,
          flatShading: true,
        }),
  }
}

type ItemProps = {
  position: [number, number, number]
  depth: number
  phase: number
  delay: number
  reduced: boolean
  intro: { current: number }
  exit: { current: number }
  spin?: [number, number, number]
  scale?: number
  children: ReactNode
}

/** One floating object: idle bob + drift, cursor parallax by depth, staggered entrance. */
function Item({ position, depth, phase, delay, reduced, intro, exit, spin = [0.1, 0.25, 0], scale = 1, children }: ItemProps) {
  const ref = useRef<THREE.Group>(null)
  const offset = useRef({ x: 0, y: 0 })

  useFrame((state, delta) => {
    const g = ref.current
    if (!g) return
    const dt = Math.min(delta, 0.05)
    const t = state.clock.elapsedTime
    const o = offset.current
    const k = 1 - Math.exp(-2.4 * dt)
    o.x += ((reduced ? 0 : pointer.x) * depth - o.x) * k
    o.y += ((reduced ? 0 : pointer.y) * depth - o.y) * k

    const appear = THREE.MathUtils.smoothstep(intro.current, delay, delay + 0.45)
    const bob = reduced ? 0 : Math.sin(t * 0.9 + phase) * 0.06
    // As the hero scrolls on, the decorative objects drift outward and dissolve
    const out = 1 + exit.current * 0.9
    const leave = 1 - THREE.MathUtils.smoothstep(exit.current, 0, 1)
    g.position.set(position[0] * out + o.x, position[1] * out + o.y + bob + (1 - appear) * -0.25, position[2])
    g.scale.setScalar(Math.max(0.0001, appear * scale * leave))
    g.visible = leave > 0.002
    if (!reduced) {
      g.rotation.x += spin[0] * dt
      g.rotation.y += spin[1] * dt
      g.rotation.z += spin[2] * dt
    }
  })

  return (
    <group ref={ref} position={position} rotation={[phase, phase * 0.7, 0]}>
      {children}
    </group>
  )
}

/** Growth: three rising bars on a graphite plinth. */
function GrowthBars({ mats }: { mats: Mats }) {
  return (
    <group rotation={[0.25, -0.5, 0]}>
      <RoundedBox args={[0.58, 0.06, 0.26]} radius={0.025} smoothness={3} position={[0, -0.03, 0]} material={mats.graphite} />
      <RoundedBox args={[0.13, 0.2, 0.13]} radius={0.03} smoothness={3} position={[-0.18, 0.1, 0]} material={mats.chrome} />
      <RoundedBox args={[0.13, 0.32, 0.13]} radius={0.03} smoothness={3} position={[0, 0.16, 0]} material={mats.chrome} />
      <RoundedBox args={[0.13, 0.46, 0.13]} radius={0.03} smoothness={3} position={[0.18, 0.23, 0]} material={mats.lime} />
    </group>
  )
}

/** Technology: a machined chip with a lime die. */
function Chip({ mats }: { mats: Mats }) {
  return (
    <group rotation={[0.6, 0.4, 0.15]}>
      <RoundedBox args={[0.44, 0.44, 0.08]} radius={0.035} smoothness={3} material={mats.steel} />
      <RoundedBox args={[0.22, 0.22, 0.04]} radius={0.02} smoothness={2} position={[0, 0, 0.05]} material={mats.lime} />
      {[-0.13, -0.045, 0.045, 0.13].map((x) => (
        <mesh key={x} position={[x, -0.25, 0]} material={mats.chrome}>
          <boxGeometry args={[0.035, 0.07, 0.025]} />
        </mesh>
      ))}
      {[-0.13, -0.045, 0.045, 0.13].map((x) => (
        <mesh key={`t${x}`} position={[x, 0.25, 0]} material={mats.chrome}>
          <boxGeometry args={[0.035, 0.07, 0.025]} />
        </mesh>
      ))}
    </group>
  )
}

/** Branding: a polished seal ring around a graphite core. */
function Seal({ mats }: { mats: Mats }) {
  return (
    <group rotation={[0.9, 0.2, 0]}>
      <mesh material={mats.chrome}>
        <torusGeometry args={[0.24, 0.045, 24, 64]} />
      </mesh>
      <mesh material={mats.graphite}>
        <cylinderGeometry args={[0.17, 0.17, 0.05, 48]} />
      </mesh>
      <mesh position={[0, 0.03, 0]} material={mats.lime}>
        <cylinderGeometry args={[0.05, 0.05, 0.02, 32]} />
      </mesh>
    </group>
  )
}

export default function FloatingObjects({
  quality,
  reduced,
  intro,
  exit,
}: {
  quality: 'high' | 'low'
  reduced: boolean
  intro: { current: number }
  exit: { current: number }
}) {
  const mats = useMemo(() => createMaterials(quality), [quality])
  useEffect(() => () => Object.values(mats).forEach((m) => m.dispose()), [mats])

  const common = { reduced, intro, exit }
  return (
    <group>
      {/* Creativity — faceted crystal */}
      <Item position={[-1.22, 0.98, 0.15]} scale={0.62} depth={0.22} phase={0.4} delay={0.35} spin={[0.12, 0.3, 0]} {...common}>
        <mesh material={mats.crystal} scale={0.2}>
          <icosahedronGeometry args={[1, 0]} />
        </mesh>
      </Item>
      {/* Technology — chip */}
      <Item position={[1.42, 0.86, -0.3]} scale={0.6} depth={0.14} phase={1.7} delay={0.45} spin={[0.05, 0.18, 0.04]} {...common}>
        <Chip mats={mats} />
      </Item>
      {/* Branding — seal */}
      <Item position={[1.22, -0.92, 0.3]} scale={0.6} depth={0.26} phase={2.6} delay={0.55} spin={[0.1, 0.22, 0]} {...common}>
        <Seal mats={mats} />
      </Item>
      {/* Growth — rising bars */}
      <Item position={[-0.98, -1.12, 0.3]} scale={0.56} depth={0.24} phase={3.4} delay={0.65} spin={[0, 0.16, 0]} {...common}>
        <GrowthBars mats={mats} />
      </Item>
      {/* Pearls for depth */}
      <Item position={[0.55, 1.38, -0.7]} scale={0.8} depth={0.08} phase={0.9} delay={0.75} spin={[0, 0, 0]} {...common}>
        <mesh material={mats.chrome}>
          <sphereGeometry args={[0.06, 32, 24]} />
        </mesh>
      </Item>
      <Item position={[-0.3, -1.55, 0.5]} scale={0.8} depth={0.3} phase={2.1} delay={0.8} spin={[0, 0, 0]} {...common}>
        <mesh material={mats.lime}>
          <sphereGeometry args={[0.045, 32, 24]} />
        </mesh>
      </Item>
      <Item position={[1.78, -0.1, 0.4]} scale={0.8} depth={0.3} phase={4.2} delay={0.85} spin={[0, 0, 0]} {...common}>
        <mesh material={mats.chrome}>
          <sphereGeometry args={[0.035, 24, 16]} />
        </mesh>
      </Item>
    </group>
  )
}
