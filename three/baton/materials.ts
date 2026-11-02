import * as THREE from 'three'

export const COLORS = {
  blue: new THREE.Color('#233ccd'),
  blue80: new THREE.Color('#4f63d7'),
  white: new THREE.Color('#ffffff'),
  chartreuse: new THREE.Color('#dbfe1b'),
  graphite: new THREE.Color('#4a4d56'),
  ring: new THREE.Color('#f4f6ff'),
}

/**
 * Dimpled soft-touch grip: a normal map generated at runtime, so there is no
 * texture download (docs/05 §4.4). Hex-packed spherical dimples.
 */
function dimpleNormalMap(size = 256, cols = 8, rows = 8): THREE.DataTexture {
  const data = new Uint8Array(size * size * 4)
  const px = size / cols
  const py = size / rows
  const radius = px * 0.36
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let best = Infinity
      let bx = 0
      let by = 0
      const row = Math.floor(y / py)
      for (let r = row - 1; r <= row + 1; r++) {
        const off = (((r % rows) + rows) % rows) % 2 ? px / 2 : 0
        const cy = (r + 0.5) * py
        const col = Math.floor((x - off) / px)
        for (let c = col - 1; c <= col + 1; c++) {
          const cx = (c + 0.5) * px + off
          const d = (x - cx) ** 2 + (y - cy) ** 2
          if (d < best) {
            best = d
            bx = x - cx
            by = y - cy
          }
        }
      }
      const d = Math.sqrt(best)
      let nx = 0
      let ny = 0
      if (d < radius) {
        const k = 0.9 * Math.sin((d / radius) * Math.PI * 0.5)
        nx = (-bx / (d || 1)) * k
        ny = (-by / (d || 1)) * k
      }
      const nz = Math.sqrt(Math.max(0, 1 - nx * nx - ny * ny))
      const i = (y * size + x) * 4
      data[i] = (nx * 0.5 + 0.5) * 255
      data[i + 1] = (ny * 0.5 + 0.5) * 255
      data[i + 2] = (nz * 0.5 + 0.5) * 255
      data[i + 3] = 255
    }
  }
  const tex = new THREE.DataTexture(data, size, size, THREE.RGBAFormat)
  tex.wrapS = THREE.RepeatWrapping
  tex.wrapT = THREE.RepeatWrapping
  tex.repeat.set(6, 4)
  tex.colorSpace = THREE.NoColorSpace
  tex.needsUpdate = true
  return tex
}

export type BatonMaterials = ReturnType<typeof createMaterials>

export function createMaterials() {
  const anodised = new THREE.MeshPhysicalMaterial({
    color: COLORS.graphite,
    metalness: 0.7,
    roughness: 0.4,
    clearcoat: 0.12,
    clearcoatRoughness: 0.4,
  })
  const grip = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#3b3e45'),
    metalness: 0.05,
    roughness: 0.74,
    normalMap: dimpleNormalMap(),
    normalScale: new THREE.Vector2(0.7, 0.7),
  })
  const glass = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color('#0b0c10'),
    metalness: 0.2,
    roughness: 0.06,
    clearcoat: 1,
    clearcoatRoughness: 0.03,
  })
  const button = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color('#5a5e68'),
    metalness: 0.7,
    roughness: 0.5,
  })
  const elastomer = new THREE.MeshStandardMaterial({ color: new THREE.Color('#121316'), roughness: 0.9, metalness: 0 })
  const bezel = new THREE.MeshPhysicalMaterial({ color: new THREE.Color('#5a5d66'), metalness: 1, roughness: 0.25 })
  const ring = new THREE.MeshStandardMaterial({
    color: COLORS.ring,
    emissive: COLORS.ring,
    emissiveIntensity: 1,
    roughness: 0.3,
    toneMapped: false,
  })
  const slit = ring.clone()

  // Shells fade to see-through in x-ray mode.
  const shells = [anodised, grip, glass, button, elastomer, bezel]
  for (const m of shells) m.userData.baseOpacity = 1

  return { anodised, grip, glass, button, elastomer, bezel, ring, slit, shells }
}

/** Diagram-style material for internals: flat fill plus edge lines. */
export function createInternalMaterials() {
  const fill = new THREE.MeshBasicMaterial({
    color: COLORS.blue80.clone(),
    transparent: true,
    opacity: 0,
    depthWrite: false,
  })
  const edges = new THREE.LineBasicMaterial({ color: COLORS.white.clone(), transparent: true, opacity: 0 })
  return { fill, edges }
}
