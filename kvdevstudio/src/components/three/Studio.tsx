import type { WebGLRenderer } from 'three'
import { Environment, Lightformer } from '@react-three/drei'

/**
 * Shared renderer setup. Shader-log checks are off unless ?debug3d=1: they
 * force a GPU sync per program and, on Windows/ANGLE, surface harmless
 * D3D compiler notes (X4122/X4008) as console warnings.
 */
export function configureRenderer(gl: WebGLRenderer) {
  gl.setClearColor(0x000000, 0)
  gl.toneMappingExposure = 1.05
  gl.debug.checkShaderErrors = new URLSearchParams(window.location.search).get('debug3d') === '1'
}

/**
 * Procedural studio lighting shared by every scene: softbox lightformers baked
 * once into an environment map (no HDR download), plus a small light rig.
 */
export function StudioEnvironment() {
  return (
    <Environment resolution={256} frames={1}>
      <color attach="background" args={['#050607']} />
      {/* Overhead softbox */}
      <Lightformer form="rect" intensity={2.4} color="#ffffff" position={[0, 6, 1]} rotation-x={Math.PI / 2} scale={[10, 4, 1]} />
      {/* Tall strips left + right: long clean highlights on metal and fabric */}
      <Lightformer form="rect" intensity={1.6} color="#f2f4f7" position={[-6, 1.5, 3]} rotation-y={Math.PI / 2.4} scale={[1.2, 9, 1]} />
      <Lightformer form="rect" intensity={1.1} color="#e8eef8" position={[6, 1, -2]} rotation-y={-Math.PI / 2.2} scale={[1, 9, 1]} />
      {/* Faint lime rim from behind — the brand tint in the reflections */}
      <Lightformer form="rect" intensity={0.9} color="#c6ff4d" position={[-3, 0.5, -6]} scale={[4, 6, 1]} />
      {/* Low kicker */}
      <Lightformer form="rect" intensity={0.35} color="#ffffff" position={[0, -5, 2]} rotation-x={-Math.PI / 2} scale={[10, 2, 1]} />
    </Environment>
  )
}

export function StudioLights() {
  return (
    <>
      <ambientLight intensity={0.14} />
      <directionalLight position={[-4, 6, 6]} intensity={1.5} color="#f6f6f2" />
      <directionalLight position={[5, 2.5, -6]} intensity={1.6} color="#e3ebff" />
      <directionalLight position={[-6, -1, -4]} intensity={0.55} color="#c6ff4d" />
    </>
  )
}
