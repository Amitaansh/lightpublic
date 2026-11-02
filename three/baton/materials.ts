import * as THREE from 'three'

export const COLORS = {
  cyan: new THREE.Color('#2ee6ff'),
  white: new THREE.Color('#f2f2ef'),
  graphite: new THREE.Color('#45484f'),
  dim: new THREE.Color('#1c1f24'),
}

/* ------------------------------------------------------------------ */
/* Procedural textures (no downloads)                                  */
/* ------------------------------------------------------------------ */

function hash(x: number, y: number) {
  const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453
  return s - Math.floor(s)
}

function valueNoise(x: number, y: number, period: number) {
  const xi = Math.floor(x)
  const yi = Math.floor(y)
  const xf = x - xi
  const yf = y - yi
  const w = (i: number) => ((i % period) + period) % period
  const a = hash(w(xi), w(yi))
  const b = hash(w(xi + 1), w(yi))
  const c = hash(w(xi), w(yi + 1))
  const d = hash(w(xi + 1), w(yi + 1))
  const u = xf * xf * (3 - 2 * xf)
  const v = yf * yf * (3 - 2 * yf)
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v
}

/** Tileable fractal noise height field, 0..1. */
function heightField(size: number, base: number, octaves: number) {
  const h = new Float32Array(size * size)
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let amp = 1
      let freq = base
      let v = 0
      let norm = 0
      for (let o = 0; o < octaves; o++) {
        v += valueNoise((x / size) * freq, (y / size) * freq, freq) * amp
        norm += amp
        amp *= 0.5
        freq *= 2
      }
      h[y * size + x] = v / norm
    }
  }
  return h
}

function normalFromHeight(h: Float32Array, size: number, strength: number) {
  const data = new Uint8Array(size * size * 4)
  const at = (x: number, y: number) => h[((y + size) % size) * size + ((x + size) % size)]
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const dx = (at(x + 1, y) - at(x - 1, y)) * strength
      const dy = (at(x, y + 1) - at(x, y - 1)) * strength
      const n = new THREE.Vector3(-dx, -dy, 1).normalize()
      const i = (y * size + x) * 4
      data[i] = (n.x * 0.5 + 0.5) * 255
      data[i + 1] = (n.y * 0.5 + 0.5) * 255
      data[i + 2] = (n.z * 0.5 + 0.5) * 255
      data[i + 3] = 255
    }
  }
  return data
}

function dataTexture(data: Uint8Array, size: number, repeat: [number, number], color = false) {
  const tex = new THREE.DataTexture(data, size, size, THREE.RGBAFormat)
  tex.wrapS = THREE.RepeatWrapping
  tex.wrapT = THREE.RepeatWrapping
  tex.repeat.set(repeat[0], repeat[1])
  tex.colorSpace = color ? THREE.SRGBColorSpace : THREE.NoColorSpace
  tex.magFilter = THREE.LinearFilter
  tex.minFilter = THREE.LinearMipmapLinearFilter
  tex.generateMipmaps = true
  tex.anisotropy = 8
  tex.needsUpdate = true
  return tex
}

/** Bead-blasted anodising: fine grain normals + soft roughness variation. */
function beadBlast() {
  const size = 256
  const fine = heightField(size, 64, 3)
  const normal = dataTexture(normalFromHeight(fine, size, 2.2), size, [3, 3])
  const coarse = heightField(size, 6, 4)
  const rough = new Uint8Array(size * size * 4)
  for (let i = 0; i < size * size; i++) {
    const v = 150 + (coarse[i] - 0.5) * 60 + (fine[i] - 0.5) * 30
    rough[i * 4] = rough[i * 4 + 1] = rough[i * 4 + 2] = Math.max(0, Math.min(255, v))
    rough[i * 4 + 3] = 255
  }
  return { normal, roughness: dataTexture(rough, size, [2, 2]) }
}

/** Dimpled soft-touch grip: hex-packed spherical dimples with a slight grain. */
function dimples() {
  const size = 256
  const cols = 8
  const rows = 8
  const px = size / cols
  const py = size / rows
  const radius = px * 0.38
  const data = new Uint8Array(size * size * 4)
  const grain = heightField(size, 48, 2)
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
        const k = 0.95 * Math.sin((d / radius) * Math.PI * 0.5)
        nx = (-bx / (d || 1)) * k
        ny = (-by / (d || 1)) * k
      } else if (d < radius * 1.18) {
        // a soft raised lip around each dimple
        const k = 0.35 * Math.sin(((d - radius) / (radius * 0.18)) * Math.PI)
        nx = (bx / d) * k
        ny = (by / d) * k
      }
      const g = (grain[y * size + x] - 0.5) * 0.18
      nx += g
      ny += g
      const nz = Math.sqrt(Math.max(0, 1 - nx * nx - ny * ny))
      const i = (y * size + x) * 4
      data[i] = (nx * 0.5 + 0.5) * 255
      data[i + 1] = (ny * 0.5 + 0.5) * 255
      data[i + 2] = (nz * 0.5 + 0.5) * 255
      data[i + 3] = 255
    }
  }
  return dataTexture(data, size, [6.2, 5.6])
}

/* ------------------------------------------------------------------ */
/* Materials                                                            */
/* ------------------------------------------------------------------ */

export type BatonMaterials = ReturnType<typeof createMaterials>

export function createMaterials() {
  const bb = beadBlast()
  const anodised = new THREE.MeshPhysicalMaterial({
    color: COLORS.graphite,
    metalness: 0.8,
    roughness: 0.5,
    roughnessMap: bb.roughness,
    normalMap: bb.normal,
    normalScale: new THREE.Vector2(0.22, 0.22),
    clearcoat: 0.15,
    clearcoatRoughness: 0.35,
    anisotropy: 0.35,
  })
  const grip = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color('#2c2e33'),
    metalness: 0.0,
    roughness: 0.82,
    normalMap: dimples(),
    normalScale: new THREE.Vector2(0.75, 0.75),
    sheen: 0.3,
    sheenRoughness: 0.75,
    sheenColor: new THREE.Color('#8a909c'),
  })
  const glass = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color('#06070a'),
    metalness: 0.1,
    roughness: 0.04,
    clearcoat: 1,
    clearcoatRoughness: 0.02,
    reflectivity: 0.9,
  })
  const button = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color('#5b5f69'),
    metalness: 0.75,
    roughness: 0.36,
    roughnessMap: bb.roughness,
    clearcoat: 0.3,
    emissive: COLORS.cyan.clone(),
    emissiveIntensity: 0,
  })
  const elastomer = new THREE.MeshPhysicalMaterial({ color: new THREE.Color('#111214'), roughness: 0.92, sheen: 0.2, sheenColor: new THREE.Color('#444') })
  const bezel = new THREE.MeshPhysicalMaterial({ color: new THREE.Color('#8a8e98'), metalness: 1, roughness: 0.18 })
  const ring = new THREE.MeshStandardMaterial({
    color: COLORS.cyan.clone(),
    emissive: COLORS.cyan.clone(),
    emissiveIntensity: 2,
    roughness: 0.25,
    toneMapped: false,
  })
  const slit = ring.clone()

  return { anodised, grip, glass, button, elastomer, bezel, ring, slit }
}
