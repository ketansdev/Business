import { useEffect, useMemo, useRef, type MutableRefObject } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import aaFontData from './fonts/aa.typeface.json'
import { createMapTexture, createPostTexture, createSiteTexture } from './serviceTextures'

/* ---------------------------------------------------------------------------
   Four service objects for the scroll-driven hero, each ~1 unit wide and
   built from premium materials (graphite clearcoat, chrome, lime satin,
   frosted glass). The rig positions/scales the outer groups; objects run
   only their own small idle loops here.
   --------------------------------------------------------------------------- */

export type Dimmable = { mat: THREE.Material; color?: THREE.Color; env?: number; emissive?: number }
export type ServiceObjectRefs = {
  groups: MutableRefObject<(THREE.Group | null)[]>
  dimmables: MutableRefObject<Dimmable[][]>
}

type ObjProps = { reduced: boolean; register: (mats: THREE.Material[]) => void }

const LIME = '#c6ff4d'

function useMaterials<T extends Record<string, THREE.Material>>(factory: () => T, register: (m: THREE.Material[]) => void) {
  const mats = useMemo(factory, []) // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    register(Object.values(mats))
    return () => Object.values(mats).forEach((m) => m.dispose())
  }, [mats, register])
  return mats
}

const graphite = (color = '#15181d') =>
  new THREE.MeshPhysicalMaterial({ color, metalness: 0.35, roughness: 0.42, clearcoat: 1, clearcoatRoughness: 0.18, envMapIntensity: 1 })
/** Satin white-metal for display type: bright under the studio softboxes. */
const satinMetal = () =>
  new THREE.MeshPhysicalMaterial({ color: '#eef1f4', metalness: 0.55, roughness: 0.26, clearcoat: 1, clearcoatRoughness: 0.12, envMapIntensity: 1.5 })
const chrome = () => new THREE.MeshStandardMaterial({ color: '#e6eaef', metalness: 1, roughness: 0.12, envMapIntensity: 1.35 })
const limeSatin = (emissive = 0.12) =>
  new THREE.MeshPhysicalMaterial({
    color: LIME,
    metalness: 0.05,
    roughness: 0.28,
    clearcoat: 1,
    clearcoatRoughness: 0.12,
    emissive: new THREE.Color(LIME),
    emissiveIntensity: emissive,
    envMapIntensity: 1,
  })

/* --------------------------------- 01 Web -------------------------------- */
function BrowserObject({ reduced, register }: ObjProps) {
  const site = useMemo(() => createSiteTexture(), [])
  const mats = useMaterials(
    () => ({
      frame: graphite('#2a2f37'),
      screen: new THREE.MeshBasicMaterial({ map: site, toneMapped: false }),
      chrome: chrome(),
      dot: new THREE.MeshBasicMaterial({ color: '#3a404a' }),
      card: graphite(),
      lime: limeSatin(0.2),
    }),
    register,
  )
  useEffect(() => () => site.dispose(), [site])

  // Visible window of the tall page; scroll it slowly (ping-pong).
  const ratio = 0.94 / 0.57
  const repeat = 512 / ratio / 1024
  site.repeat.set(1, repeat)
  site.offset.set(0, 1 - repeat)
  const group = useRef<THREE.Group>(null)
  useFrame((state) => {
    if (reduced || !group.current?.parent?.visible) return
    const t = state.clock.elapsedTime
    const s = 0.5 - 0.5 * Math.cos((t * Math.PI * 2) / 14) // 0→1→0 every 14 s
    site.offset.y = 1 - repeat - s * (1 - repeat)
  })

  return (
    <group ref={group} rotation={[0.06, -0.3, 0.02]}>
      <RoundedBox args={[1, 0.68, 0.045]} radius={0.03} smoothness={4} material={mats.frame} />
      {[-0.445, -0.41, -0.375].map((x) => (
        <mesh key={x} position={[x, 0.297, 0.0235]} material={mats.dot}>
          <circleGeometry args={[0.011, 20]} />
        </mesh>
      ))}
      <mesh position={[0.02, 0.297, 0.0235]} material={mats.dot}>
        <planeGeometry args={[0.34, 0.026]} />
      </mesh>
      <mesh position={[0, -0.03, 0.0236]} material={mats.screen}>
        <planeGeometry args={[0.94, 0.57]} />
      </mesh>
      {/* Floating component card in front of the window */}
      <group position={[0.44, -0.27, 0.16]} rotation={[0, 0.2, 0]}>
        <RoundedBox args={[0.3, 0.15, 0.024]} radius={0.02} smoothness={3} material={mats.card} />
        <RoundedBox args={[0.06, 0.06, 0.02]} radius={0.012} smoothness={2} position={[-0.09, 0, 0.016]} material={mats.lime} />
        <mesh position={[0.04, 0.018, 0.0125]} material={mats.chrome}>
          <planeGeometry args={[0.13, 0.016]} />
        </mesh>
        <mesh position={[0.02, -0.018, 0.0125]} material={mats.dot}>
          <planeGeometry args={[0.09, 0.014]} />
        </mesh>
      </group>
    </group>
  )
}

/* ------------------------------ 02 Local SEO ----------------------------- */
function pinGeometry() {
  // Teardrop lathe: sharp tip at y = −1, spherical head (r .55) centred at y = .35
  const R = 0.55
  const cy = 0.35
  const a0 = -Math.PI / 2 + Math.acos(R / (cy + 1))
  const pts = [new THREE.Vector2(0.0001, -1)]
  for (let i = 0; i <= 40; i++) {
    const a = a0 + ((Math.PI / 2 - a0) * i) / 40
    pts.push(new THREE.Vector2(Math.max(0.0001, R * Math.cos(a)), cy + R * Math.sin(a)))
  }
  return new THREE.LatheGeometry(pts, 64)
}

function PinObject({ reduced, register }: ObjProps) {
  const map = useMemo(() => createMapTexture(), [])
  const pin = useMemo(() => pinGeometry(), [])
  const mats = useMaterials(
    () => ({
      pin: limeSatin(0.1),
      hole: new THREE.MeshPhysicalMaterial({ color: '#0b0f02', roughness: 0.4, clearcoat: 1 }),
      plateTop: new THREE.MeshStandardMaterial({ map, roughness: 0.65, metalness: 0.1, envMapIntensity: 0.4 }),
      plateSide: new THREE.MeshStandardMaterial({ color: '#2a2f37', metalness: 0.9, roughness: 0.3, envMapIntensity: 1.1 }),
      ring: new THREE.MeshBasicMaterial({ color: LIME, transparent: true, opacity: 0.6, depthWrite: false }),
      shadow: new THREE.MeshBasicMaterial({ color: '#000000', transparent: true, opacity: 0.45, depthWrite: false }),
    }),
    register,
  )
  useEffect(
    () => () => {
      map.dispose()
      pin.dispose()
    },
    [map, pin],
  )

  const head = useRef<THREE.Group>(null)
  const ring = useRef<THREE.Mesh>(null)
  useFrame((state) => {
    if (reduced || !head.current?.parent?.parent?.visible) return
    const t = state.clock.elapsedTime
    head.current.position.y = 0.04 + Math.sin(t * 1.6) * 0.035
    if (ring.current) {
      const k = (t * 0.45) % 1
      ring.current.scale.setScalar(0.6 + k * 2.4)
      ;(ring.current.material as THREE.MeshBasicMaterial).opacity = 0.6 * (1 - k)
    }
  })

  return (
    <group rotation={[0.42, 0, 0]}>
      <mesh position={[0, -0.43, 0]} material={[mats.plateSide, mats.plateTop, mats.plateSide]}>
        <cylinderGeometry args={[0.56, 0.56, 0.035, 72]} />
      </mesh>
      <mesh ref={ring} position={[0, -0.41, 0]} rotation-x={-Math.PI / 2} material={mats.ring}>
        <ringGeometry args={[0.1, 0.112, 48]} />
      </mesh>
      <mesh position={[0, -0.409, 0]} rotation-x={-Math.PI / 2} scale={[1, 0.6, 1]} material={mats.shadow}>
        <circleGeometry args={[0.1, 32]} />
      </mesh>
      <group ref={head} position={[0, 0.04, 0]}>
        <mesh geometry={pin} material={mats.pin} scale={0.4} position={[0, -0.04, 0]} />
        <mesh position={[0, 0.1, 0.205]} rotation-x={Math.PI / 2} material={mats.hole}>
          <cylinderGeometry args={[0.085, 0.085, 0.04, 40]} />
        </mesh>
      </group>
    </group>
  )
}

/* ------------------------------- 03 Social ------------------------------- */
function heartGeometry() {
  const s = new THREE.Shape()
  s.moveTo(0, -0.9)
  s.bezierCurveTo(-1.6, 0.2, -0.7, 1.3, 0, 0.45)
  s.bezierCurveTo(0.7, 1.3, 1.6, 0.2, 0, -0.9)
  const g = new THREE.ExtrudeGeometry(s, { depth: 0.35, bevelEnabled: true, bevelThickness: 0.14, bevelSize: 0.12, bevelSegments: 5, curveSegments: 24 })
  g.center()
  return g
}

function SocialObject({ reduced, register }: ObjProps) {
  const faces = useMemo(() => [createPostTexture(1), createPostTexture(2), createPostTexture(0)], [])
  const heart = useMemo(() => heartGeometry(), [])
  const mats = useMemo(
    () => ({
      card: graphite(),
      face0: new THREE.MeshStandardMaterial({ map: faces[0], transparent: true, roughness: 0.55, envMapIntensity: 0.35 }),
      face1: new THREE.MeshStandardMaterial({ map: faces[1], transparent: true, roughness: 0.55, envMapIntensity: 0.35 }),
      face2: new THREE.MeshStandardMaterial({ map: faces[2], transparent: true, roughness: 0.55, envMapIntensity: 0.35 }),
      heart: limeSatin(0.18),
    }),
    [faces],
  )
  useEffect(() => {
    register(Object.values(mats))
    return () => {
      Object.values(mats).forEach((m) => m.dispose())
      faces.forEach((f) => f.dispose())
      heart.dispose()
    }
  }, [mats, faces, heart, register])

  const heartRef = useRef<THREE.Mesh>(null)
  useFrame((state) => {
    if (reduced || !heartRef.current) return
    const t = state.clock.elapsedTime
    heartRef.current.position.y = 0.36 + Math.sin(t * 1.4) * 0.04
    heartRef.current.rotation.y = Math.sin(t * 0.8) * 0.35
  })

  const cards: Array<{ pos: [number, number, number]; rot: [number, number, number]; face: THREE.Material }> = [
    { pos: [-0.27, 0.03, -0.14], rot: [0, 0.38, 0.14], face: mats.face0 },
    { pos: [0.27, 0.03, -0.14], rot: [0, -0.38, -0.14], face: mats.face1 },
    { pos: [0, -0.02, 0.06], rot: [0, 0, 0], face: mats.face2 },
  ]
  return (
    <group>
      {cards.map((c, i) => (
        <group key={i} position={c.pos} rotation={c.rot}>
          <RoundedBox args={[0.5, 0.666, 0.02]} radius={0.035} smoothness={4} material={mats.card} />
          <mesh position={[0, 0, 0.0115]} material={c.face}>
            <planeGeometry args={[0.47, 0.627]} />
          </mesh>
        </group>
      ))}
      <mesh ref={heartRef} geometry={heart} material={mats.heart} position={[0.32, 0.36, 0.2]} scale={0.085} rotation-z={Math.PI} />
    </group>
  )
}

/* ------------------------------- 04 Brand -------------------------------- */
const svgToLocal = (x: number, y: number, size: number) => new THREE.Vector3(((x - 16) / 32) * size, ((16 - y) / 32) * size, 0)

function strokeGeometry(points: [number, number][][], size: number, radius: number) {
  const parts: THREE.BufferGeometry[] = []
  for (const line of points) {
    for (let i = 0; i < line.length - 1; i++) {
      const a = svgToLocal(line[i][0], line[i][1], size)
      const b = svgToLocal(line[i + 1][0], line[i + 1][1], size)
      const dir = new THREE.Vector3().subVectors(b, a)
      const g = new THREE.CapsuleGeometry(radius, dir.length(), 4, 10)
      g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize()))
      g.translate((a.x + b.x) / 2, (a.y + b.y) / 2, 0)
      parts.push(g)
    }
  }
  return parts
}

function BrandObject({ reduced, register }: ObjProps) {
  const geo = useMemo(() => {
    const font = new FontLoader().parse(aaFontData as never)
    const text = new TextGeometry('Aa', {
      font,
      size: 0.4,
      depth: 0.11,
      curveSegments: 10,
      bevelEnabled: true,
      bevelThickness: 0.014,
      bevelSize: 0.009,
      bevelSegments: 4,
    })
    text.center()
    const badgeShape = new THREE.Shape()
    const w = 0.32
    const r = 0.07
    badgeShape.moveTo(-w / 2 + r, -w / 2)
    badgeShape.lineTo(w / 2 - r, -w / 2)
    badgeShape.quadraticCurveTo(w / 2, -w / 2, w / 2, -w / 2 + r)
    badgeShape.lineTo(w / 2, w / 2 - r)
    badgeShape.quadraticCurveTo(w / 2, w / 2, w / 2 - r, w / 2)
    badgeShape.lineTo(-w / 2 + r, w / 2)
    badgeShape.quadraticCurveTo(-w / 2, w / 2, -w / 2, w / 2 - r)
    badgeShape.lineTo(-w / 2, -w / 2 + r)
    badgeShape.quadraticCurveTo(-w / 2, -w / 2, -w / 2 + r, -w / 2)
    const badge = new THREE.ExtrudeGeometry(badgeShape, { depth: 0.05, bevelEnabled: true, bevelThickness: 0.012, bevelSize: 0.01, bevelSegments: 4, curveSegments: 12 })
    badge.translate(0, 0, -0.025)
    const strokes = strokeGeometry(
      [
        [
          [8.5, 8.5],
          [8.5, 23.5],
        ],
        [
          [8.5, 16.5],
          [14.5, 8.5],
        ],
        [
          [10.6, 13.9],
          [15, 23.5],
        ],
        [
          [17.5, 8.5],
          [21.5, 23.5],
          [25.5, 8.5],
        ],
      ],
      w,
      0.013,
    )
    return { text, badge, strokes }
  }, [])

  const mats = useMaterials(
    () => ({
      type: satinMetal(),
      lime: limeSatin(0.14),
      ink: new THREE.MeshPhysicalMaterial({ color: '#08090b', roughness: 0.35, clearcoat: 1 }),
      frost: new THREE.MeshPhysicalMaterial({ color: '#dfe6ee', roughness: 0.25, metalness: 0.1, transparent: true, opacity: 0.55, clearcoat: 1, iridescence: 0.6, envMapIntensity: 1.4 }),
    }),
    register,
  )
  useEffect(
    () => () => {
      geo.text.dispose()
      geo.badge.dispose()
      geo.strokes.forEach((g) => g.dispose())
    },
    [geo],
  )

  const cube = useRef<THREE.Mesh>(null)
  useFrame((_, delta) => {
    if (reduced || !cube.current) return
    cube.current.rotation.x += delta * 0.4
    cube.current.rotation.y += delta * 0.55
  })

  return (
    <group>
      <mesh geometry={geo.text} material={mats.type} position={[-0.1, 0.02, 0]} rotation={[0.05, 0.18, 0]} />
      <group position={[0.36, 0.26, -0.12]} rotation={[0.1, -0.35, 0.08]}>
        <mesh geometry={geo.badge} material={mats.lime} />
        {geo.strokes.map((g, i) => (
          <mesh key={i} geometry={g} material={mats.ink} position={[0, 0, 0.042]} />
        ))}
      </group>
      <mesh ref={cube} material={mats.frost} position={[0.36, -0.25, 0.1]} rotation={[0.6, 0.6, 0]}>
        <boxGeometry args={[0.15, 0.15, 0.15]} />
      </mesh>
      <mesh material={mats.lime} position={[-0.42, -0.28, 0.12]}>
        <sphereGeometry args={[0.045, 32, 24]} />
      </mesh>
    </group>
  )
}

const OBJECTS = [BrowserObject, PinObject, SocialObject, BrandObject]

/** Renders the four service objects; the rig drives `groups` and dims via `dimmables`. */
export default function ServiceObjects({ reduced, refs }: { reduced: boolean; refs: ServiceObjectRefs }) {
  const registers = useMemo(
    () =>
      OBJECTS.map((_, i) => (mats: THREE.Material[]) => {
        refs.dimmables.current[i] = mats.map((mat) => {
          const m = mat as THREE.MeshStandardMaterial
          return {
            mat,
            color: m.color ? m.color.clone() : undefined,
            env: typeof m.envMapIntensity === 'number' ? m.envMapIntensity : undefined,
            emissive: typeof m.emissiveIntensity === 'number' ? m.emissiveIntensity : undefined,
          }
        })
      }),
    [refs],
  )

  return (
    <>
      {OBJECTS.map((Obj, i) => (
        <group
          key={i}
          visible={false}
          ref={(g) => {
            refs.groups.current[i] = g
          }}
        >
          <Obj reduced={reduced} register={registers[i]} />
        </group>
      ))}
    </>
  )
}
