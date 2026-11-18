import { Suspense, useCallback, useMemo, useRef, useState, type RefObject } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { PerformanceMonitor } from '@react-three/drei'
import Umbrella, { type UmbrellaMaterials } from './three/Umbrella'
import FloatingObjects from './three/FloatingObjects'
import ServiceObjects, { type Dimmable } from './three/ServiceObjects'
import { StudioEnvironment, StudioLights, configureRenderer } from './three/Studio'
import { CANOPY_CENTER_Y, tagAnchors } from './three/umbrellaGeometry'
import { pointer } from '../lib/pointer'
import { PHASE, heroState, win } from '../lib/heroState'

/* ---------------------------------------------------------------------------
   Tunables
   --------------------------------------------------------------------------- */
const POSE = { x: 0.2, z: -0.2 } // intro: top tipped toward camera, leaning right
const CENTER_POSE = { x: 0.5, z: 0 } // centre stage: upright, rim opened toward the viewer
const SPIN_SPEED = 0.16 // rad/s
/** Spin that puts the four labelled ribs on the rim's diagonals (TR, TL, BL, BR). */
const SETTLE = Math.PI / 12
const MODEL_LIFT = 0.78
const ENTRANCE = 2.4
const TAU = Math.PI * 2

/** Rib-tip anchor feeding each service (anchors are TR, TL, BL, BR; services are web, local, social, brand). */
const ANCHOR_OF_SERVICE = [1, 0, 2, 3]
/** Final object positions as fractions of the viewport, around the centred umbrella. */
const TARGETS = {
  desktop: [
    [-0.29, 0.19, 0.2],
    [0.29, 0.19, 0.2],
    [-0.29, -0.21, 0.35],
    [0.29, -0.21, 0.35],
  ],
  mobile: [
    [-0.24, 0.27, 0.2],
    [0.24, 0.27, 0.2],
    [-0.24, -0.215, 0.3],
    [0.24, -0.215, 0.3],
  ],
} as const

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v))
const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4)
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
const damp = (a: number, b: number, lambda: number, dt: number) => a + (b - a) * (1 - Math.exp(-lambda * dt))

type Layout = { x: number; y: number; scale: number }

/** Intro framing (world units at z = 0). */
function introLayout(px: number, vw: number, vh: number, pinned: boolean): Layout {
  if (px >= 1024) return { x: vw * 0.225, y: vh * 0.03, scale: Math.min(vh * 0.29, vw * 0.155) }
  // Pinned phones/tablets: the umbrella waits low in the frame, under the copy
  if (pinned) return { x: 0, y: -vh * 0.36, scale: Math.min(vw * 0.24, vh * 0.15) }
  // Stacked layout (reduced motion): its own block under the copy
  return { x: 0, y: vh * 0.02, scale: Math.min(vw * 0.27, vh * 0.3) }
}

/** Centre-stage framing once the scroll story takes over. */
function centerLayout(px: number, vw: number, vh: number): Layout {
  if (px >= 1024) return { x: 0, y: -vh * 0.02, scale: Math.min(vh * 0.255, vw * 0.15) }
  return { x: 0, y: vh * 0.015, scale: Math.min(vw * 0.29, vh * 0.17) }
}

export type StageRefs = {
  tags: RefObject<(HTMLElement | null)[]>
  nodes: RefObject<(HTMLElement | null)[]>
  dots: RefObject<(HTMLElement | null)[]>
  threads: RefObject<(SVGLineElement | null)[]>
  avoidX: RefObject<number>
}

export type SceneProps = {
  quality: 'high' | 'low'
  reduced: boolean
  running: boolean
  refs: StageRefs
  onReady: () => void
}

export default function Scene3D({ quality, reduced, running, refs, onReady }: SceneProps) {
  const maxDpr = quality === 'high' ? 1.75 : 1.5
  const [dpr, setDpr] = useState(() => Math.min(window.devicePixelRatio || 1, maxDpr))

  return (
    <Canvas
      dpr={dpr}
      frameloop={running ? (reduced ? 'demand' : 'always') : 'never'}
      camera={{ fov: 30, position: [0, 0.2, 9], near: 0.1, far: 40 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      onCreated={({ gl }) => configureRenderer(gl)}
      aria-hidden
    >
      <PerformanceMonitor onDecline={() => setDpr(1)} />
      <Suspense fallback={null}>
        <StudioEnvironment />
        <StudioLights />
        <Rig quality={quality} reduced={reduced} refs={refs} onReady={onReady} />
      </Suspense>
    </Canvas>
  )
}

type Pt = { x: number; y: number }

function Rig({ quality, reduced, refs, onReady }: Omit<SceneProps, 'running'>) {
  const size = useThree((s) => s.size)
  const viewport = useThree((s) => s.viewport)
  const camera = useThree((s) => s.camera)
  const desktop = size.width >= 1024
  const scrollStory = heroState.scrollDriven && !reduced

  const layouts = useMemo(
    () => ({
      intro: introLayout(size.width, viewport.width, viewport.height, scrollStory),
      center: centerLayout(size.width, viewport.width, viewport.height),
    }),
    [size.width, viewport.width, viewport.height, scrollStory],
  )

  const layoutRef = useRef<THREE.Group>(null)
  const poseRef = useRef<THREE.Group>(null)
  const spinRef = useRef<THREE.Group>(null)
  const modelRef = useRef<THREE.Group>(null)
  const spotRef = useRef<THREE.SpotLight>(null)
  const glowRef = useRef<THREE.PointLight>(null)
  const spotTarget = useMemo(() => new THREE.Object3D(), [])
  const anchors = useMemo(() => tagAnchors(), [])
  const intro = useRef(reduced ? 99 : 0)
  const exit = useRef(0)
  const umbMats = useRef<UmbrellaMaterials | null>(null)
  const objGroups = useRef<(THREE.Group | null)[]>([])
  const dimmables = useRef<Dimmable[][]>([])
  const objRefs = useMemo(() => ({ groups: objGroups, dimmables }), [])
  const onUmbrellaMaterials = useCallback((m: UmbrellaMaterials) => {
    umbMats.current = m
  }, [])

  const st = useRef({
    t0: -1,
    free: 2.2,
    settle: null as number | null,
    p: 0,
    px: 0,
    py: 0,
    ready: false,
    hover: [1, 1, 1, 1],
    dim: [1, 1, 1, 1],
    applied: [1, 1, 1, 1],
    live: [false, false, false, false],
  })
  const tmp = useMemo(
    () => ({
      v: new THREE.Vector3(),
      c: new THREE.Vector3(),
      tips: [0, 1, 2, 3].map(() => new THREE.Vector3()),
      obj: new THREE.Vector3(),
      edge: new THREE.Vector3(),
      sc: { x: 0, y: 0 } as Pt,
      tipS: [0, 1, 2, 3].map(() => ({ x: 0, y: 0 }) as Pt),
      objS: { x: 0, y: 0 } as Pt,
      edgeS: { x: 0, y: 0 } as Pt,
    }),
    [],
  )

  useFrame((state, delta) => {
    const L = layoutRef.current
    const P = poseRef.current
    const S = spinRef.current
    const M = modelRef.current
    if (!L || !P || !S || !M) return
    const s = st.current
    const dt = Math.min(delta, 0.05)
    const t = state.clock.elapsedTime
    if (s.t0 < 0) s.t0 = t
    intro.current = reduced ? 99 : t - s.t0
    const e = reduced ? 1 : easeOutQuart(clamp((intro.current - 0.1) / ENTRANCE, 0, 1))

    const toScreen = (v: THREE.Vector3, out: Pt) => {
      tmp.v.copy(v).project(camera)
      out.x = (tmp.v.x * 0.5 + 0.5) * size.width
      out.y = (-tmp.v.y * 0.5 + 0.5) * size.height
      return out
    }

    // ---- Scroll progress (raw from ScrollTrigger, damped here for the 3D) ----
    const target = scrollStory ? heroState.progress : 0
    s.p = Math.abs(target - s.p) < 1e-4 ? target : damp(s.p, target, 6, dt)
    const p = s.p
    const pc = easeInOut(win(p, PHASE.center))
    const pTagsOut = win(p, PHASE.tagsOut)
    const pLabels = win(p, PHASE.labelsIn)
    const pGlow = win(p, PHASE.glow)
    const pOut = win(p, PHASE.outro)
    exit.current = win(p, [0.16, 0.4])

    // ---- Cursor (damped) ----
    s.px = damp(s.px, reduced ? 0 : pointer.x, 2.6, dt)
    s.py = damp(s.py, reduced ? 0 : pointer.y, 2.6, dt)

    // ---- Umbrella: intro framing → centre stage → lift away ----
    const A = layouts.intro
    const B = layouts.center
    const vh = viewport.height
    const lift = pOut * vh * 0.12
    const lx = lerp(A.x, B.x, pc)
    const ly = lerp(A.y, B.y, pc) + lift
    const ls = lerp(A.scale, B.scale, pc) * (1 - 0.14 * pOut)
    L.position.set(lx + s.px * 0.1, ly + s.py * 0.06 - (1 - e) * 0.45, 0)
    L.scale.setScalar(ls * (0.84 + 0.16 * e))

    const float = reduced ? 0 : Math.sin(t * 0.7) * 0.05
    P.position.y = float * (1 - 0.5 * pc)
    P.rotation.set(
      lerp(POSE.x, CENTER_POSE.x, pc) - s.py * 0.12 + (reduced ? 0 : Math.sin(t * 0.43) * 0.025),
      s.px * (0.3 + 0.25 * pc),
      lerp(POSE.z, CENTER_POSE.z, pc) - s.px * 0.05 + (reduced ? 0 : Math.sin(t * 0.31 + 1) * 0.02),
    )

    // Spin: free idle rotation, settling onto the service diagonals as it centres
    if (!reduced) s.free += dt * SPIN_SPEED
    if (pc <= 0.0005) s.settle = null
    else if (s.settle === null) s.settle = SETTLE + TAU * Math.round((s.free - SETTLE) / TAU)
    const settled = (s.settle ?? s.free) + (reduced ? 0 : Math.sin(t * 0.35) * 0.06)
    S.rotation.y = lerp(s.free, settled, pc) + (1 - e) * 1.8

    // ---- Lights: cursor spotlight + lime highlight on the frame ----
    const spot = spotRef.current
    if (spot) {
      spot.position.set(lx + s.px * 3.2, 2.8 + s.py * 2, 6.5)
      spotTarget.position.set(lx + s.px * 0.6, ly + 0.4 + s.py * 0.4, 0)
      spotTarget.updateMatrixWorld()
      spot.intensity = (22 + 18 * pGlow) * e
    }
    const glowK = pGlow * (1 - pOut)
    if (glowRef.current) {
      glowRef.current.position.set(lx, ly + ls * 0.55, 1.4)
      glowRef.current.intensity = 5 * glowK
    }
    const um = umbMats.current
    if (um) {
      um.bead.emissiveIntensity = 0.35 + 2.2 * glowK
      um.metal.envMapIntensity = 1.2 + 0.7 * glowK
      um.hem.emissiveIntensity = 0.18 * glowK
    }

    // ---- Screen-space anchors ----
    M.updateWorldMatrix(true, false)
    tmp.c.set(0, CANOPY_CENTER_Y, 0)
    M.localToWorld(tmp.c)
    const cz = tmp.c.z
    toScreen(tmp.c, tmp.sc)
    for (let i = 0; i < 4; i++) {
      tmp.tips[i].copy(anchors[i])
      M.localToWorld(tmp.tips[i])
      toScreen(tmp.tips[i], tmp.tipS[i])
    }

    // ---- Intro rib tags (Design / Development / Branding / Growth) ----
    const tags = refs.tags.current
    if (tags) {
      const reach = desktop ? 64 : 46
      const fade = clamp((intro.current - 1.2) / 0.8, 0, 1) * (1 - pTagsOut)
      for (let i = 0; i < 4; i++) {
        const el = tags[i]
        if (!el) continue
        const front = THREE.MathUtils.smoothstep((tmp.tips[i].z - cz) / Math.max(ls, 0.001), -0.35, 0.35)
        let x = tmp.tipS[i].x
        const y = tmp.tipS[i].y
        let dx = x - tmp.sc.x
        let dy = y - tmp.sc.y
        const len = Math.hypot(dx, dy) || 1
        dx /= len
        dy /= len
        const edge = desktop ? 84 : 70
        x = clamp(x, edge - dx * reach, size.width - edge - dx * reach)
        let alpha = (0.3 + 0.7 * front) * fade
        const pillX = x + dx * reach
        if (desktop && refs.avoidX.current && pc < 0.5) alpha *= THREE.MathUtils.smoothstep(pillX - 56, refs.avoidX.current, refs.avoidX.current + 48)
        el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`
        el.style.opacity = alpha.toFixed(3)
        el.style.visibility = alpha < 0.005 ? 'hidden' : 'visible'
        el.style.zIndex = front > 0.5 ? '2' : '1'
        el.style.setProperty('--dx', dx.toFixed(3))
        el.style.setProperty('--dy', dy.toFixed(3))
        el.style.setProperty('--angle', `${Math.atan2(dy, dx).toFixed(3)}rad`)
        el.style.setProperty('--reach', `${reach}px`)
        el.style.setProperty('--reach-y', `${reach * 0.62}px`)
      }
    }

    // ---- Service objects, lime nodes, threads and labels ----
    if (!scrollStory) {
      if (!s.ready) {
        s.ready = true
        onReady()
      }
      return
    }
    const groups = objGroups.current
    const nodes = refs.nodes.current
    const dots = refs.dots.current
    const threads = refs.threads.current
    const T = desktop ? TARGETS.desktop : TARGETS.mobile
    const objSize = desktop ? Math.min(viewport.width * 0.085, vh * 0.15) : Math.min(viewport.width * 0.2, vh * 0.09)
    const active = heroState.active

    for (let svc = 0; svc < 4; svc++) {
      const a = ANCHOR_OF_SERVICE[svc]
      const tip = tmp.tips[a]
      const tipS = tmp.tipS[a]
      const start = PHASE.emerge[0] + svc * 0.035
      const em = win(p, [start, start + 0.14])
      const emE = easeInOut(em)

      // Hover feedback (damped)
      const hoverT = active === svc ? 1.14 : active >= 0 ? 0.94 : 1
      const dimT = active >= 0 && active !== svc ? 0.38 : 1
      s.hover[svc] = damp(s.hover[svc], hoverT, 9, dt)
      s.dim[svc] = damp(s.dim[svc], dimT, 9, dt)

      const g = groups[svc]
      let objR = 0
      if (g) {
        g.visible = em > 0.001
        if (g.visible) {
          const tx = B.x + T[svc][0] * viewport.width + s.px * 0.12
          const ty = B.y + T[svc][1] * vh + lift + s.py * 0.08
          const tz = T[svc][2]
          tmp.obj.set(lerp(tip.x, tx, emE), lerp(tip.y, ty, emE), lerp(tip.z, tz, emE) + Math.sin(Math.PI * em) * 0.6)
          tmp.obj.y += reduced ? 0 : Math.sin(t * 0.9 + svc * 1.7) * 0.04 * emE
          g.position.copy(tmp.obj)
          const k = objSize * (0.06 + 0.94 * easeOutQuart(em)) * s.hover[svc] * (1 - 0.12 * pOut)
          g.scale.setScalar(k)
          g.rotation.set(
            -s.py * 0.18 * emE,
            (1 - emE) * Math.PI * 1.25 + s.px * 0.32 * emE + (reduced ? 0 : Math.sin(t * 0.5 + svc) * 0.08),
            0,
          )
          // Projected radius (hit area + label offset)
          toScreen(tmp.obj, tmp.objS)
          tmp.edge.copy(tmp.obj)
          tmp.edge.x += k * 0.55
          toScreen(tmp.edge, tmp.edgeS)
          objR = Math.abs(tmp.edgeS.x - tmp.objS.x)
        }
        if (Math.abs(s.dim[svc] - s.applied[svc]) > 0.002) {
          s.applied[svc] = s.dim[svc]
          const f = s.dim[svc]
          for (const d of dimmables.current[svc] ?? []) {
            const m = d.mat as THREE.MeshStandardMaterial
            if (d.color && m.color) m.color.copy(d.color).multiplyScalar(f)
            if (d.env !== undefined) m.envMapIntensity = d.env * f
            if (d.emissive !== undefined) m.emissiveIntensity = d.emissive * f
          }
        }
      }

      // Label anchor: outward from the rib tip, then riding the object
      let dx = tipS.x - tmp.sc.x
      let dy = tipS.y - tmp.sc.y
      const len = Math.hypot(dx, dy) || 1
      dx /= len
      dy /= len
      // Push labels clear of the canopy, mostly sideways
      const reach = desktop ? 96 : 48
      const labelX = tipS.x + dx * reach + Math.sign(dx) * (desktop ? 36 : 6)
      const labelY = tipS.y + dy * reach * 0.45
      const nx = em > 0 ? lerp(labelX, tmp.objS.x, emE) : labelX
      const ny = em > 0 ? lerp(labelY, tmp.objS.y, emE) : labelY
      const vis = pLabels * (1 - pOut)

      const node = nodes?.[svc]
      if (node) {
        node.style.transform = `translate3d(${nx.toFixed(1)}px, ${ny.toFixed(1)}px, 0)`
        node.style.opacity = vis.toFixed(3)
        node.style.visibility = vis < 0.005 ? 'hidden' : 'visible'
        node.style.setProperty('--lift', `${(emE * (objR * 1.12 + (desktop ? 20 : 14))).toFixed(1)}px`)
        node.style.setProperty('--hit', `${Math.max(64, objR * 2.1).toFixed(0)}px`)
        node.style.setProperty('--dim', (0.45 + 0.55 * s.dim[svc]).toFixed(3))
        const live = em > 0.92 && pOut < 0.55
        if (live !== s.live[svc]) {
          s.live[svc] = live
          node.dataset.live = String(live)
          const btn = node.querySelector('button')
          if (btn) btn.tabIndex = live ? 0 : -1
        }
      }
      const dot = dots?.[svc]
      if (dot) {
        dot.style.transform = `translate3d(${tipS.x.toFixed(1)}px, ${tipS.y.toFixed(1)}px, 0)`
        dot.style.opacity = vis.toFixed(3)
        dot.style.setProperty('--glow', pGlow.toFixed(3))
      }
      const line = threads?.[svc]
      if (line) {
        line.setAttribute('x1', tipS.x.toFixed(1))
        line.setAttribute('y1', tipS.y.toFixed(1))
        // Thread ends at the object's edge (or at the label before it emerges)
        let ex = nx - tipS.x
        let ey = ny - tipS.y
        const el = Math.hypot(ex, ey) || 1
        ex /= el
        ey /= el
        const trim = Math.min(el * 0.9, emE * objR * 0.85 + (1 - emE) * 4)
        line.setAttribute('x2', (nx - ex * trim).toFixed(1))
        line.setAttribute('y2', (ny - ey * trim).toFixed(1))
        line.style.opacity = (vis * (0.45 + 0.35 * pGlow) * (0.6 + 0.4 * s.dim[svc])).toFixed(3)
      }
    }

    if (!s.ready) {
      s.ready = true
      onReady()
    }
  })

  return (
    <>
      <primitive object={spotTarget} />
      <spotLight ref={spotRef} target={spotTarget} angle={0.42} penumbra={1} decay={2} distance={0} intensity={0} color="#ffffff" />
      <pointLight ref={glowRef} color="#c6ff4d" intensity={0} distance={6} decay={2} />
      <group ref={layoutRef}>
        <group ref={poseRef}>
          <group ref={spinRef}>
            <group ref={modelRef} position={[0, MODEL_LIFT, 0]}>
              <Umbrella quality={quality} onMaterials={onUmbrellaMaterials} />
            </group>
          </group>
        </group>
        <FloatingObjects quality={quality} reduced={reduced} intro={intro} exit={exit} />
      </group>
      {scrollStory && <ServiceObjects reduced={reduced} refs={objRefs} />}
    </>
  )
}
