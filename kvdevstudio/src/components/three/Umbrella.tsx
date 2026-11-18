import { useEffect, useMemo } from 'react'
import * as THREE from 'three'
import { buildUmbrella, disposeUmbrella } from './umbrellaGeometry'
import { createFabricNormalMap } from './fabricTexture'

/**
 * Transparent umbrella: a clear, slightly iridescent canopy over a polished
 * steel frame, with a lacquered black handle and four lime beads marking the
 * labelled ribs. The canopy is alpha-blended (crisper and cheaper than
 * physical transmission here), back faces drawn before front faces so the
 * dome sorts correctly. Quality only changes geometry density.
 */
export type UmbrellaMaterials = {
  hem: THREE.MeshPhysicalMaterial
  metal: THREE.MeshStandardMaterial
  bead: THREE.MeshStandardMaterial
  canopyFront: THREE.MeshPhysicalMaterial
}

export default function Umbrella({ quality, onMaterials }: { quality: 'high' | 'low'; onMaterials?: (m: UmbrellaMaterials) => void }) {
  const parts = useMemo(() => buildUmbrella(quality), [quality])
  const weave = useMemo(() => createFabricNormalMap(quality === 'high' ? 256 : 128), [quality])

  const mats = useMemo(() => {
    const hi = quality === 'high'
    const fabricBase: THREE.MeshPhysicalMaterialParameters = {
      color: '#f3f6f9',
      metalness: 0,
      roughness: 0.2,
      clearcoat: 0.6,
      clearcoatRoughness: 0.22,
      sheen: 0.28,
      sheenRoughness: 0.5,
      sheenColor: new THREE.Color('#d9e0e8'),
      iridescence: 0.4,
      iridescenceIOR: 1.22,
      iridescenceThicknessRange: [180, 520],
      normalMap: weave,
      normalScale: new THREE.Vector2(0.14, 0.14),
      envMapIntensity: 1.25,
    }
    const canopyFront = new THREE.MeshPhysicalMaterial({
      ...fabricBase,
      transparent: true,
      opacity: hi ? 0.26 : 0.24,
      depthWrite: false,
      side: THREE.FrontSide,
    })
    const canopyBack = new THREE.MeshPhysicalMaterial({ ...fabricBase, transparent: true, opacity: 0.13, depthWrite: false, side: THREE.BackSide })

    const hem = new THREE.MeshPhysicalMaterial({
      color: '#f4f6f8',
      roughness: 0.4,
      sheen: 1,
      sheenColor: new THREE.Color('#ffffff'),
      emissive: new THREE.Color('#c6ff4d'),
      emissiveIntensity: 0,
      envMapIntensity: 1,
    })
    const metal = new THREE.MeshStandardMaterial({ color: '#c9ced6', metalness: 1, roughness: 0.24, envMapIntensity: 1.2 })
    const chrome = new THREE.MeshStandardMaterial({ color: '#eef1f5', metalness: 1, roughness: 0.1, envMapIntensity: 1.4 })
    const handle = new THREE.MeshPhysicalMaterial({
      color: '#0e1013',
      roughness: 0.35,
      metalness: 0,
      clearcoat: 1,
      clearcoatRoughness: 0.1,
      envMapIntensity: 1,
    })
    const bead = new THREE.MeshStandardMaterial({
      color: '#c6ff4d',
      emissive: new THREE.Color('#c6ff4d'),
      emissiveIntensity: 0.35,
      roughness: 0.3,
      metalness: 0.1,
    })
    return { canopyFront, canopyBack, hem, metal, chrome, handle, bead }
  }, [quality, weave])

  useEffect(() => {
    onMaterials?.({ hem: mats.hem, metal: mats.metal, bead: mats.bead, canopyFront: mats.canopyFront })
  }, [mats, onMaterials])

  useEffect(
    () => () => {
      disposeUmbrella(parts)
      weave.dispose()
      Object.values(mats).forEach((m) => m.dispose())
    },
    [parts, weave, mats],
  )

  return (
    <group>
      <mesh geometry={parts.metal} material={mats.metal} />
      <mesh geometry={parts.chrome} material={mats.chrome} />
      <mesh geometry={parts.handle} material={mats.handle} />
      <mesh geometry={parts.beads} material={mats.bead} />
      <mesh geometry={parts.hem} material={mats.hem} />
      <mesh geometry={parts.canopy} material={mats.canopyBack} renderOrder={1} />
      <mesh geometry={parts.canopy} material={mats.canopyFront} renderOrder={2} />
    </group>
  )
}
