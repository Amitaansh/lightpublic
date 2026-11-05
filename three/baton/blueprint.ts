import * as THREE from 'three'
import { COLORS } from './materials'

type Saved = { transparent: boolean; opacity: number; depthWrite: boolean }

/**
 * Blueprint mode for the exploded view (the anime.js-style "line drawing"
 * pass): every part of the baton crossfades from its solid material to a
 * cyan x-ray, glowing at its silhouette, with its hard edges drawn as lines.
 *
 * `set(0)` is the normal baton; `set(1)` is the full blueprint.
 */
export function attachBlueprint(root: THREE.Object3D) {
  const lineMat = new THREE.LineBasicMaterial({ color: COLORS.cyan.clone(), transparent: true, opacity: 0, depthWrite: false, toneMapped: false })
  const xrayMat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
    toneMapped: false,
    uniforms: { uColor: { value: COLORS.cyan.clone() }, uOpacity: { value: 0 } },
    vertexShader: /* glsl */ `
      varying vec3 vN;
      varying vec3 vV;
      void main() {
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        vN = normalize(normalMatrix * normal);
        vV = normalize(-mv.xyz);
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: /* glsl */ `
      uniform vec3 uColor;
      uniform float uOpacity;
      varying vec3 vN;
      varying vec3 vV;
      void main() {
        float rim = pow(1.0 - abs(dot(normalize(vN), normalize(vV))), 2.2);
        float a = (0.035 + 0.75 * rim) * uOpacity;
        gl_FragColor = vec4(uColor, a);
        #include <colorspace_fragment>
      }`,
  })

  const overlays: THREE.Object3D[] = []
  const edgeGeos: THREE.BufferGeometry[] = []
  const materials = new Map<THREE.Material, Saved>()

  const meshes: THREE.Mesh[] = []
  root.traverse((o) => {
    const m = o as THREE.Mesh
    if (m.isMesh && !(m as unknown as THREE.Points).isPoints) meshes.push(m)
  })
  for (const mesh of meshes) {
    const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
    for (const mt of mats) if (!materials.has(mt)) materials.set(mt, { transparent: mt.transparent, opacity: mt.opacity, depthWrite: mt.depthWrite })

    const xray = new THREE.Mesh(mesh.geometry, xrayMat)
    xray.visible = false
    xray.raycast = () => {}
    const eg = new THREE.EdgesGeometry(mesh.geometry, 28)
    edgeGeos.push(eg)
    const edges = new THREE.LineSegments(eg, lineMat)
    edges.visible = false
    edges.raycast = () => {}
    mesh.add(xray, edges)
    overlays.push(xray, edges)
  }

  let current = -1
  const set = (b: number) => {
    const v = Math.min(1, Math.max(0, b))
    if (Math.abs(v - current) < 0.001) return
    current = v
    const on = v > 0.001
    for (const o of overlays) o.visible = on
    lineMat.opacity = 0.85 * v
    xrayMat.uniforms.uOpacity.value = v
    for (const [mt, saved] of materials) {
      const wasTransparent = mt.transparent
      if (!on) {
        mt.transparent = saved.transparent
        mt.opacity = saved.opacity
        mt.depthWrite = saved.depthWrite
        mt.visible = true
      } else {
        mt.transparent = true
        mt.opacity = saved.opacity * (1 - v)
        mt.depthWrite = v < 0.5 && saved.depthWrite
        mt.visible = v < 0.98
      }
      // Only recompile when the blend mode actually changes.
      if (wasTransparent !== mt.transparent) mt.needsUpdate = true
    }
  }

  return {
    set,
    dispose: () => {
      edgeGeos.forEach((g) => g.dispose())
      lineMat.dispose()
      xrayMat.dispose()
    },
  }
}
