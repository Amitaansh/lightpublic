import * as THREE from 'three'
import { COLORS } from './materials'
import type { GroupId } from './dimensions'

/**
 * Detailed internals for the exploded view (illustrative concept layout,
 * TRD-HW-001…018). Boards carry a procedural circuit texture whose traces
 * glow cyan while "powered", so the fallback ladder can be shown without
 * words: systems power down group by group while the safety core stays lit.
 */

export type System = 'sensing' | 'vision' | 'compute' | 'safety' | 'haptics' | 'power'

export type InternalPart = {
  id: string
  group: GroupId
  object: THREE.Object3D
  /** Offset at explode = 1, in baton-local metres. */
  offset: THREE.Vector3
  stagger: number
}

export type PoweredMaterial = { mat: THREE.MeshStandardMaterial | THREE.MeshPhysicalMaterial; system: System; on: number }

const UP = new THREE.Vector3(0, 1, 0)

function circuitTextures(seed: number) {
  const size = 512
  const base = document.createElement('canvas')
  base.width = base.height = size
  const glow = document.createElement('canvas')
  glow.width = glow.height = size
  const b = base.getContext('2d')!
  const g = glow.getContext('2d')!
  b.fillStyle = '#0c1210'
  b.fillRect(0, 0, size, size)
  g.fillStyle = '#000'
  g.fillRect(0, 0, size, size)
  let s = seed
  const rnd = () => {
    s = (s * 16807) % 2147483647
    return s / 2147483647
  }
  // Traces: orthogonal runs with 45° jogs.
  for (let i = 0; i < 70; i++) {
    let x = Math.floor(rnd() * 32) * 16 + 8
    let y = Math.floor(rnd() * 32) * 16 + 8
    const w = rnd() < 0.2 ? 4 : 2
    b.strokeStyle = '#6f5a2a'
    g.strokeStyle = '#ffffff'
    b.lineWidth = g.lineWidth = w
    b.beginPath()
    g.beginPath()
    b.moveTo(x, y)
    g.moveTo(x, y)
    for (let k = 0; k < 4; k++) {
      const len = 16 * (1 + Math.floor(rnd() * 6))
      const dir = Math.floor(rnd() * 4)
      if (dir === 0) x += len
      else if (dir === 1) x -= len
      else if (dir === 2) y += len
      else y -= len
      b.lineTo(x, y)
      g.lineTo(x, y)
    }
    b.stroke()
    g.stroke()
    b.fillStyle = '#b8964a'
    b.beginPath()
    b.arc(x, y, w + 2, 0, Math.PI * 2)
    b.fill()
  }
  // Pads
  for (let i = 0; i < 120; i++) {
    const x = Math.floor(rnd() * 64) * 8
    const y = Math.floor(rnd() * 64) * 8
    b.fillStyle = '#c9a85a'
    b.fillRect(x, y, 4, 6)
  }
  const map = new THREE.CanvasTexture(base)
  map.colorSpace = THREE.SRGBColorSpace
  map.anisotropy = 8
  const emissiveMap = new THREE.CanvasTexture(glow)
  emissiveMap.anisotropy = 8
  return { map, emissiveMap }
}

export function buildInternals() {
  const parts: InternalPart[] = []
  const powered: PoweredMaterial[] = []
  const geometries: THREE.BufferGeometry[] = []
  const materials: THREE.Material[] = []
  const textures: THREE.Texture[] = []
  const actuators: { mesh: THREE.Mesh; glow: THREE.MeshStandardMaterial }[] = []

  const geo = <G extends THREE.BufferGeometry>(g: G) => {
    geometries.push(g)
    return g
  }
  const mat = <M extends THREE.Material>(m: M) => {
    materials.push(m)
    return m
  }
  const mesh = (g: THREE.BufferGeometry, m: THREE.Material, pos?: [number, number, number], dir?: THREE.Vector3) => {
    const o = new THREE.Mesh(g, m)
    if (pos) o.position.set(...pos)
    if (dir) o.quaternion.setFromUnitVectors(UP, dir.clone().normalize())
    o.castShadow = true
    o.receiveShadow = true
    return o
  }

  const chip = mat(new THREE.MeshStandardMaterial({ color: '#0d0d0f', roughness: 0.32, metalness: 0.2 }))
  const steel = mat(new THREE.MeshStandardMaterial({ color: '#c3c7cf', roughness: 0.22, metalness: 1 }))
  const copper = mat(new THREE.MeshStandardMaterial({ color: '#b6713c', roughness: 0.3, metalness: 1 }))
  const black = mat(new THREE.MeshStandardMaterial({ color: '#141518', roughness: 0.5, metalness: 0.3 }))
  const flex = mat(new THREE.MeshPhysicalMaterial({ color: '#2e2410', roughness: 0.35, metalness: 0.2, clearcoat: 0.8 }))
  const glass = mat(new THREE.MeshPhysicalMaterial({ color: '#05070a', roughness: 0.03, metalness: 0.1, clearcoat: 1 }))
  const wrap = mat(new THREE.MeshPhysicalMaterial({ color: '#283443', roughness: 0.38, metalness: 0.1, clearcoat: 0.7 }))
  const ferrite = mat(new THREE.MeshStandardMaterial({ color: '#2a2a2c', roughness: 0.8 }))

  const board = (system: System, seed: number) => {
    const t = circuitTextures(seed)
    textures.push(t.map, t.emissiveMap)
    const m = mat(
      new THREE.MeshStandardMaterial({
        map: t.map,
        emissiveMap: t.emissiveMap,
        emissive: COLORS.cyan.clone(),
        emissiveIntensity: 0.9,
        roughness: 0.55,
        metalness: 0.25,
      }),
    )
    powered.push({ mat: m, system, on: 1 })
    return m
  }
  const led = (system: System, color = COLORS.cyan) => {
    const m = mat(new THREE.MeshStandardMaterial({ color: '#111', emissive: color.clone(), emissiveIntensity: 3, toneMapped: false }))
    powered.push({ mat: m, system, on: 1 })
    return m
  }

  const add = (id: string, group: GroupId, object: THREE.Object3D, offset: [number, number, number], stagger: number) => {
    object.name = id
    parts.push({ id, group, object, offset: new THREE.Vector3(...offset), stagger })
  }

  // ---- Sensor head -------------------------------------------------------
  {
    const cam = new THREE.Group()
    // Lens stack (three barrels) and the image-sensor board behind it.
    cam.add(mesh(geo(new THREE.CylinderGeometry(0.0058, 0.0058, 0.0035, 32)), black, [0, -0.0955, 0]))
    cam.add(mesh(geo(new THREE.CylinderGeometry(0.0048, 0.0052, 0.003, 32)), steel, [0, -0.0925, 0]))
    cam.add(mesh(geo(new THREE.CylinderGeometry(0.0062, 0.0062, 0.0025, 32)), black, [0, -0.0898, 0]))
    cam.add(mesh(geo(new THREE.CircleGeometry(0.0046, 32)), glass, [0, -0.0974, 0], new THREE.Vector3(0, -1, 0).cross(new THREE.Vector3(1, 0, 0)).normalize()))
    cam.children[cam.children.length - 1].rotation.set(Math.PI / 2, 0, 0)
    cam.add(mesh(geo(new THREE.BoxGeometry(0.014, 0.0015, 0.014)), board('vision', 11), [0, -0.0868, 0]))
    cam.add(mesh(geo(new THREE.BoxGeometry(0.0042, 0.001, 0.0042)), led('vision'), [0.0045, -0.0858, 0.0045]))
    add('camera', 'head', cam, [0, -0.075, 0], 1)
  }
  {
    const tof = new THREE.Group()
    for (let k = 0; k < 4; k++) {
      const a = (k * Math.PI) / 2
      const dir = new THREE.Vector3(Math.sin(a), 0, Math.cos(a))
      const m = new THREE.Group()
      m.add(mesh(geo(new THREE.BoxGeometry(0.0072, 0.0046, 0.0034)), chip))
      const l1 = mesh(geo(new THREE.CylinderGeometry(0.0011, 0.0011, 0.0006, 16)), glass, [-0.0016, 0, 0.0019])
      const l2 = mesh(geo(new THREE.CylinderGeometry(0.0011, 0.0011, 0.0006, 16)), led('sensing'), [0.0016, 0, 0.0019])
      l1.rotation.x = l2.rotation.x = Math.PI / 2
      m.add(l1, l2)
      m.position.copy(dir.clone().multiplyScalar(0.0118)).setY(-0.0685)
      m.lookAt(m.position.clone().add(dir))
      tof.add(m)
    }
    add('tof', 'head', tof, [0, -0.052, 0], 2)
  }
  {
    const us = new THREE.Group()
    for (const s of [-1, 1]) {
      const c = new THREE.Group()
      c.add(mesh(geo(new THREE.CylinderGeometry(0.0038, 0.0038, 0.0055, 28)), steel))
      c.add(mesh(geo(new THREE.CylinderGeometry(0.0031, 0.0031, 0.0007, 28)), black, [0, -0.0028, 0]))
      c.add(mesh(geo(new THREE.TorusGeometry(0.0022, 0.00025, 8, 24)), led('safety'), [0, -0.0032, 0]))
      c.children[c.children.length - 1].rotation.x = Math.PI / 2
      c.position.set(s * 0.0108, -0.089, -0.0045)
      us.add(c)
    }
    add('ultrasonic', 'head', us, [0, -0.062, -0.006], 2)
  }
  {
    const mics = new THREE.Group()
    for (const k of [1, 3, 5, 7]) {
      const a = (k * Math.PI) / 4
      const dir = new THREE.Vector3(Math.sin(a), 0, Math.cos(a))
      const m = mesh(geo(new THREE.CylinderGeometry(0.0016, 0.0016, 0.0012, 20)), steel, undefined, dir)
      m.position.copy(dir.clone().multiplyScalar(0.0154)).setY(-0.051)
      mics.add(m)
    }
    add('mics', 'head', mics, [0, -0.046, 0], 3)
  }

  // ---- Body: main computer, safety core, IMU/GNSS, flex -------------------
  {
    const main = new THREE.Group()
    main.add(mesh(geo(new THREE.BoxGeometry(0.024, 0.05, 0.0014)), board('compute', 23), [0, -0.0125, 0]))
    main.add(mesh(geo(new THREE.BoxGeometry(0.0115, 0.0115, 0.0016)), steel, [0, -0.008, 0.0015]))
    main.add(mesh(geo(new THREE.BoxGeometry(0.0085, 0.006, 0.0012)), chip, [0, -0.023, 0.0013]))
    main.add(mesh(geo(new THREE.BoxGeometry(0.006, 0.0045, 0.0011)), chip, [-0.0065, -0.0305, 0.0012]))
    for (let i = 0; i < 14; i++) {
      main.add(mesh(geo(new THREE.BoxGeometry(0.0012, 0.0007, 0.0006)), i % 3 ? chip : steel, [-0.009 + (i % 7) * 0.003, 0.004 + Math.floor(i / 7) * 0.003, 0.001]))
    }
    main.add(mesh(geo(new THREE.BoxGeometry(0.0016, 0.001, 0.0008)), led('compute'), [0.0085, 0.0085, 0.0011]))
    main.add(mesh(geo(new THREE.BoxGeometry(0.0078, 0.0078, 0.0024)), steel, [0, 0.0085, 0.0017]))
    main.position.z = 0.0072
    add('mainBoard', 'body', main, [0, 0, 0.05], 6)
  }
  {
    const safety = new THREE.Group()
    safety.add(mesh(geo(new THREE.BoxGeometry(0.02, 0.022, 0.0014)), board('safety', 41), [0, 0, 0]))
    safety.add(mesh(geo(new THREE.BoxGeometry(0.0072, 0.0072, 0.0012)), chip, [0, 0.002, -0.0013]))
    const core = mat(new THREE.MeshStandardMaterial({ color: '#111', emissive: COLORS.cyan.clone(), emissiveIntensity: 4, toneMapped: false }))
    powered.push({ mat: core, system: 'safety', on: 1 })
    safety.add(mesh(geo(new THREE.BoxGeometry(0.0022, 0.0022, 0.0004)), core, [0, 0.002, -0.002]))
    safety.position.set(0, -0.0165, -0.0085)
    add('safetyCore', 'body', safety, [0, 0, -0.052], 6)
  }
  {
    const flexes = new THREE.Group()
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.006, -0.086, 0.004),
      new THREE.Vector3(0.009, -0.065, 0.008),
      new THREE.Vector3(0.007, -0.042, 0.0075),
      new THREE.Vector3(0.004, -0.036, 0.0072),
    ])
    const ribbon = mesh(geo(new THREE.TubeGeometry(curve, 40, 0.0011, 6, false)), flex)
    ribbon.scale.set(1, 1, 0.45)
    flexes.add(ribbon)
    const curve2 = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.006, 0.012, 0.007),
      new THREE.Vector3(-0.011, 0.024, 0.004),
      new THREE.Vector3(-0.012, 0.04, 0.0),
    ])
    flexes.add(mesh(geo(new THREE.TubeGeometry(curve2, 30, 0.001, 6, false)), flex))
    add('flex', 'body', flexes, [-0.03, 0, 0.02], 5)
  }

  // ---- Grip: battery, haptic ring, storage --------------------------------
  {
    const bat = new THREE.Group()
    for (const [y, reserve] of [
      [0.04, false],
      [0.0625, true],
    ] as const) {
      bat.add(mesh(geo(new THREE.CylinderGeometry(0.0086, 0.0086, 0.021, 36)), wrap, [0, y, 0]))
      bat.add(mesh(geo(new THREE.CylinderGeometry(0.0082, 0.0082, 0.0008, 36)), steel, [0, y + 0.0108, 0]))
      bat.add(mesh(geo(new THREE.CylinderGeometry(0.0082, 0.0082, 0.0008, 36)), steel, [0, y - 0.0108, 0]))
      if (reserve) {
        const band = mat(new THREE.MeshStandardMaterial({ color: '#111', emissive: COLORS.cyan.clone(), emissiveIntensity: 1.6, toneMapped: false }))
        powered.push({ mat: band, system: 'safety', on: 1 })
        bat.add(mesh(geo(new THREE.CylinderGeometry(0.0088, 0.0088, 0.0018, 36)), band, [0, y, 0]))
      }
    }
    add('battery', 'grip', bat, [0, 0.05, 0], 8)
  }
  {
    const ring = new THREE.Group()
    const can = geo(new THREE.CylinderGeometry(0.0037, 0.0037, 0.0026, 28))
    const top = geo(new THREE.CylinderGeometry(0.0034, 0.0034, 0.0004, 28))
    for (let k = 0; k < 8; k++) {
      const a = (k * Math.PI) / 4
      const dir = new THREE.Vector3(Math.sin(a), 0, -Math.cos(a))
      const glowMat = mat(new THREE.MeshStandardMaterial({ color: '#0c0c0c', emissive: COLORS.cyan.clone(), emissiveIntensity: 0, toneMapped: false, roughness: 0.3 }))
      const m = new THREE.Mesh(can, black)
      const t = new THREE.Mesh(top, glowMat)
      t.position.y = 0.0014
      m.add(t)
      m.position.copy(dir.clone().multiplyScalar(0.0143)).setY(0.053)
      m.quaternion.setFromUnitVectors(UP, dir)
      m.castShadow = true
      ring.add(m)
      actuators.push({ mesh: m, glow: glowMat })
    }
    const bus = mesh(geo(new THREE.TorusGeometry(0.0128, 0.00045, 8, 64)), copper, [0, 0.053, 0])
    bus.rotation.x = Math.PI / 2
    ring.add(bus)
    add('actuators', 'grip', ring, [0, 0.03, 0], 7)
  }
  {
    const st = new THREE.Group()
    st.add(mesh(geo(new THREE.BoxGeometry(0.012, 0.009, 0.0012)), board('compute', 57), [0, 0.0235, 0.0062]))
    st.add(mesh(geo(new THREE.BoxGeometry(0.0065, 0.0045, 0.001)), chip, [0, 0.0235, 0.0074]))
    add('storage', 'grip', st, [0.03, 0.018, 0.025], 7)
  }

  // ---- End cap: wireless charging coil ------------------------------------
  {
    const cap = new THREE.Group()
    const coil = mesh(geo(new THREE.TorusGeometry(0.0115, 0.0011, 10, 64)), copper, [0, 0.0936, 0])
    coil.rotation.x = Math.PI / 2
    const coil2 = mesh(geo(new THREE.TorusGeometry(0.0092, 0.001, 10, 64)), copper, [0, 0.0936, 0])
    coil2.rotation.x = Math.PI / 2
    cap.add(coil, coil2, mesh(geo(new THREE.CylinderGeometry(0.0125, 0.0125, 0.0008, 48)), ferrite, [0, 0.0918, 0]))
    add('coil', 'cap', cap, [0, 0.105, 0], 10)
  }

  // ---- Clip spring -----------------------------------------------------------
  {
    const pts: THREE.Vector3[] = []
    for (let i = 0; i <= 120; i++) {
      const a = (i / 120) * Math.PI * 2 * 6
      pts.push(new THREE.Vector3(Math.cos(a) * 0.0018, -0.032 + (i / 120) * 0.02, -0.0215 + Math.sin(a) * 0.0018))
    }
    const spring = mesh(geo(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 240, 0.00028, 6, false)), steel)
    add('spring', 'body', spring, [0, 0, -0.045], 5)
  }

  for (const p of parts) p.object.visible = false

  return {
    parts,
    powered,
    actuators,
    dispose: () => {
      geometries.forEach((g) => g.dispose())
      materials.forEach((m) => m.dispose())
      textures.forEach((t) => t.dispose())
    },
  }
}

/** Fallback ladder (PRD §6.2): which systems stay powered at each level. */
export const FALLBACK_POWERED: System[][] = [
  ['sensing', 'vision', 'compute', 'safety', 'haptics', 'power'],
  ['sensing', 'compute', 'safety', 'haptics', 'power'],
  ['sensing', 'safety', 'haptics', 'power'],
  ['safety', 'haptics'],
  [],
]
