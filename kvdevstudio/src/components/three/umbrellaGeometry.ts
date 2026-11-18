import * as THREE from 'three'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'

/* -------------------------------------------------------------------------
   Procedural umbrella, in model space.
   Shaft axis = +Y, canopy apex at the origin, canopy opens downward.
   A point at angle φ around the shaft is (r cos φ, y, −r sin φ).
   ------------------------------------------------------------------------- */

export const RIB_COUNT = 12
export const RIB_STEP = (Math.PI * 2) / RIB_COUNT
/** The four labelled ribs, 90° apart. */
export const TAG_RIBS = [1, 4, 7, 10]

const ALPHA = 0.8
const SPHERE_R = 1 / Math.sin(ALPHA)
const TIP_CURL = 0.12
const SCALLOP = 0.07 // hem lift between rib tips
const SAG = 0.02 // fabric pulled toward the centre between ribs
const WRINKLE = 0.003 // tension ripples near the hem
const TIP_LEN = 0.058

const RIB_INSET = 0.011
const RIB_RADIUS = 0.0062
const STRETCHER_JOINT = 0.42
const RUNNER_Y = -0.6
const SHAFT_TOP = 0.11
const COLLAR_Y = -1.62
const HANDLE_DROP = 0.34
const HANDLE_BEND = 0.115
const HANDLE_RADIUS = 0.024

/** Visual centre of the canopy (label direction + pivot). */
export const CANOPY_CENTER_Y = -0.3

const smooth01 = (t: number) => {
  const x = Math.min(1, Math.max(0, t))
  return x * x * (3 - 2 * x)
}

export function ribProfile(s: number) {
  const b = ALPHA * s + TIP_CURL * s * s * s
  return { r: SPHERE_R * Math.sin(b), y: SPHERE_R * (Math.cos(b) - 1), b }
}

/** Fabric surface point. s: apex→hem, u: across the panel (0 & 1 are ribs). */
function canopyPoint(s: number, u: number, phi0: number, out: THREE.Vector3) {
  const bulge = Math.sin(Math.PI * u)
  const sEff = s - SCALLOP * bulge * Math.pow(s, 6)
  const { r, y, b } = ribProfile(sEff)
  const local = (u - 0.5) * RIB_STEP
  const chord = Math.cos(RIB_STEP / 2) / Math.cos(local) // taut, planar panel
  const hemZone = smooth01((sEff - 0.74) / 0.26)
  const ripple = WRINKLE * Math.sin(u * Math.PI * 6) * bulge * hemZone
  const sag = SAG * bulge * Math.pow(sEff, 1.25) + ripple
  const rr = r * chord - sag * Math.sin(b)
  const yy = y - sag * Math.cos(b)
  const phi = phi0 + u * RIB_STEP
  return out.set(rr * Math.cos(phi), yy, -rr * Math.sin(phi))
}

/** Canopy: independent panels so normals crease at the seams, like sewn gores. */
function createCanopy(segU: number, segS: number) {
  const cols = segU + 1
  const rows = segS + 1
  const perPanel = cols * rows
  const position = new Float32Array(RIB_COUNT * perPanel * 3)
  const uv = new Float32Array(RIB_COUNT * perPanel * 2)
  const index: number[] = []
  const p = new THREE.Vector3()
  let v = 0

  for (let k = 0; k < RIB_COUNT; k++) {
    const phi0 = k * RIB_STEP
    const base = k * perPanel
    for (let j = 0; j < rows; j++) {
      const t = j / segS
      const s = 0.004 + 0.996 * (1 - Math.pow(1 - t, 1.35))
      const { r, b } = ribProfile(s)
      for (let i = 0; i < cols; i++) {
        const u = i / segU
        canopyPoint(s, u, phi0, p)
        position[v * 3] = p.x
        position[v * 3 + 1] = p.y
        position[v * 3 + 2] = p.z
        uv[v * 2] = (u - 0.5) * 2 * r * Math.sin(RIB_STEP / 2)
        uv[v * 2 + 1] = SPHERE_R * b
        v++
      }
    }
    for (let j = 0; j < segS; j++) {
      for (let i = 0; i < segU; i++) {
        const a = base + j * cols + i
        const b = a + 1
        const c = a + cols
        const d = c + 1
        index.push(a, c, b, b, c, d)
      }
    }
  }

  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.BufferAttribute(position, 3))
  geo.setAttribute('uv', new THREE.BufferAttribute(uv, 2))
  geo.setIndex(index)
  geo.computeVertexNormals()
  return geo
}

/** Thin rolled hem following the scalloped edge. */
function createHem(samplesPerPanel: number, radial: number) {
  const pts: THREE.Vector3[] = []
  const p = new THREE.Vector3()
  for (let k = 0; k < RIB_COUNT; k++) {
    for (let i = 0; i < samplesPerPanel; i++) pts.push(canopyPoint(1, i / samplesPerPanel, k * RIB_STEP, p).clone())
  }
  const curve = new THREE.CatmullRomCurve3(pts, true, 'centripetal')
  return new THREE.TubeGeometry(curve, RIB_COUNT * samplesPerPanel, 0.0048, radial, true)
}

function ribPoint(s: number, inset = RIB_INSET) {
  const { r, y, b } = ribProfile(s)
  return new THREE.Vector3(r - inset * Math.sin(b), y - inset * Math.cos(b), 0)
}

function ribTangent(s: number) {
  const { b } = ribProfile(s)
  return new THREE.Vector3(Math.cos(b), -Math.sin(b), 0).normalize()
}

function strut(a: THREE.Vector3, b: THREE.Vector3, radius: number, radial: number) {
  const dir = new THREE.Vector3().subVectors(b, a)
  const len = dir.length()
  const geo = new THREE.CylinderGeometry(radius, radius, len, radial, 1, true)
  geo.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize()))
  geo.translate((a.x + b.x) / 2, (a.y + b.y) / 2, (a.z + b.z) / 2)
  return geo
}

const nonIndexed = (g: THREE.BufferGeometry) => (g.index ? g.toNonIndexed() : g)

function rotatedCopies(geo: THREE.BufferGeometry, skip: number[] = []) {
  const out: THREE.BufferGeometry[] = []
  for (let k = 0; k < RIB_COUNT; k++) {
    if (skip.includes(k)) continue
    out.push(geo.clone().rotateY(k * RIB_STEP))
  }
  return out
}

/** Rib-tip ferrule at angle 0: tapered sleeve, domed cap, collar. */
function createTip(radial: number) {
  const base = ribPoint(1)
  const tan = ribTangent(1)
  const toTan = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), tan)
  const sleeve = new THREE.CylinderGeometry(0.0072, 0.0098, TIP_LEN, radial, 1)
  sleeve.applyQuaternion(toTan)
  const mid = base.clone().addScaledVector(tan, TIP_LEN * 0.42)
  sleeve.translate(mid.x, mid.y, mid.z)
  const dome = new THREE.SphereGeometry(0.0074, radial, Math.max(4, radial / 2))
  const end = base.clone().addScaledVector(tan, TIP_LEN * 0.92)
  dome.translate(end.x, end.y, end.z)
  const collar = new THREE.TorusGeometry(0.0102, 0.0018, 6, radial * 2)
  collar.applyQuaternion(toTan.clone().multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI / 2)))
  const cpos = base.clone().addScaledVector(tan, -TIP_LEN * 0.05)
  collar.translate(cpos.x, cpos.y, cpos.z)
  return mergeGeometries([sleeve, dome, collar].map(nonIndexed))!
}

/** Small accent bead hanging under a labelled tip. */
function createTagBead() {
  const base = ribPoint(1)
  const tan = ribTangent(1)
  const end = base.clone().addScaledVector(tan, TIP_LEN * 0.92)
  const bead = new THREE.SphereGeometry(0.014, 16, 12)
  bead.translate(end.x, end.y - 0.004, end.z)
  return bead
}

/** Where a label attaches (the tip's domed cap), angle 0. */
function tagAnchorPoint() {
  const base = ribPoint(1)
  const tan = ribTangent(1)
  return base.clone().addScaledVector(tan, TIP_LEN * 0.92)
}

function createHandle(radial: number, tubular: number) {
  const pts: THREE.Vector3[] = []
  const top = COLLAR_Y - 0.01
  const bottom = COLLAR_Y - HANDLE_DROP
  for (let i = 0; i <= 10; i++) pts.push(new THREE.Vector3(0, top + (bottom - top) * (i / 10), 0))
  for (let i = 1; i <= 24; i++) {
    const a = Math.PI + (Math.PI * i) / 24
    pts.push(new THREE.Vector3(HANDLE_BEND + HANDLE_BEND * Math.cos(a), bottom + HANDLE_BEND * Math.sin(a), 0))
  }
  pts.push(new THREE.Vector3(HANDLE_BEND * 2, bottom + 0.035, 0))
  const curve = new THREE.CatmullRomCurve3(pts, false, 'centripetal')
  const tube = new THREE.TubeGeometry(curve, tubular, HANDLE_RADIUS, radial, false)
  const end = new THREE.SphereGeometry(HANDLE_RADIUS, radial, Math.max(6, radial / 2))
  const last = pts[pts.length - 1]
  end.translate(last.x, last.y, last.z)
  return mergeGeometries([nonIndexed(tube), nonIndexed(end)])!
}

export type UmbrellaParts = {
  canopy: THREE.BufferGeometry
  hem: THREE.BufferGeometry
  metal: THREE.BufferGeometry
  chrome: THREE.BufferGeometry
  handle: THREE.BufferGeometry
  beads: THREE.BufferGeometry
}

export function buildUmbrella(quality: 'high' | 'low'): UmbrellaParts {
  const hi = quality === 'high'
  const radial = hi ? 10 : 6

  const canopy = createCanopy(hi ? 18 : 10, hi ? 56 : 28)
  const hem = createHem(hi ? 20 : 10, hi ? 6 : 4)

  // Frame: ribs, stretchers, joints, notch, runner, shaft, tips
  const ribPts: THREE.Vector3[] = []
  for (let i = 0; i <= 28; i++) ribPts.push(ribPoint(0.035 + (0.965 * i) / 28))
  const rib = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(ribPts), hi ? 40 : 20, RIB_RADIUS, hi ? 6 : 4, false)

  const joint = ribPoint(STRETCHER_JOINT, RIB_INSET + RIB_RADIUS)
  const runnerAnchor = new THREE.Vector3(0.03, RUNNER_Y + 0.035, 0)
  const stretcher = strut(runnerAnchor, joint, 0.0046, hi ? 6 : 4)
  const knuckle = new THREE.SphereGeometry(0.0095, 8, 6)
  knuckle.translate(joint.x, joint.y, joint.z)

  const notch = new THREE.CylinderGeometry(0.03, 0.036, 0.06, 20)
  notch.translate(0, -0.035, 0)
  const runner = new THREE.CylinderGeometry(0.029, 0.029, 0.11, 20)
  runner.translate(0, RUNNER_Y, 0)
  const shaftLen = SHAFT_TOP - COLLAR_Y
  const shaft = new THREE.CylinderGeometry(0.0125, 0.0125, shaftLen, 16)
  shaft.translate(0, (SHAFT_TOP + COLLAR_Y) / 2, 0)
  const tip = createTip(radial)

  const metal = mergeGeometries(
    [...rotatedCopies(rib), ...rotatedCopies(stretcher), ...rotatedCopies(knuckle), ...rotatedCopies(tip), notch, runner, shaft].map(nonIndexed),
  )!

  // Bright metal: finial + collar
  const cap = new THREE.CylinderGeometry(0.026, 0.038, 0.024, 24)
  cap.translate(0, 0.01, 0)
  const finial = new THREE.CylinderGeometry(0.0075, 0.011, 0.09, 12)
  finial.translate(0, 0.066, 0)
  const finialTip = new THREE.SphereGeometry(0.0095, 12, 8)
  finialTip.translate(0, 0.112, 0)
  const collar = new THREE.CylinderGeometry(0.03, 0.03, 0.026, 24)
  collar.translate(0, COLLAR_Y, 0)
  const chrome = mergeGeometries([cap, finial, finialTip, collar].map(nonIndexed))!

  const handle = createHandle(hi ? 16 : 10, hi ? 96 : 48)

  const bead = createTagBead()
  const beads = mergeGeometries(TAG_RIBS.map((k) => nonIndexed(bead.clone().rotateY(k * RIB_STEP))))!

  return { canopy, hem, metal, chrome, handle, beads }
}

/** Label anchor points in model space, in TAG_RIBS order. */
export function tagAnchors(): THREE.Vector3[] {
  const anchor = tagAnchorPoint()
  return TAG_RIBS.map((k) => anchor.clone().applyAxisAngle(new THREE.Vector3(0, 1, 0), k * RIB_STEP))
}

export function disposeUmbrella(parts: UmbrellaParts) {
  Object.values(parts).forEach((g) => g.dispose())
}
