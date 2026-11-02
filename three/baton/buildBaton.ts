import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'
import {
  CANE_R,
  CANE_Z,
  EXPLODE,
  GRIP_WAIST,
  PART_GROUP,
  R,
  STAGGER,
  Y,
  type GroupId,
  type InternalId,
} from './dimensions'
import { COLORS, createInternalMaterials, createMaterials, type BatonMaterials } from './materials'

export type PartHandle = {
  id: string
  group: GroupId
  object: THREE.Object3D
  offset: THREE.Vector3
  stagger: number
}

export type InternalHandle = {
  id: InternalId
  object: THREE.Group
  fill: THREE.MeshBasicMaterial
  edges: THREE.LineBasicMaterial
}

export type ActuatorHandle = {
  mesh: THREE.Mesh
  fill: THREE.MeshBasicMaterial
  edges: THREE.LineBasicMaterial
  intensity: number
}

export type BatonHandles = {
  root: THREE.Group
  parts: PartHandle[]
  internals: InternalHandle[]
  actuators: ActuatorHandle[]
  materials: BatonMaterials
  /** Shell materials per group, so x-ray can be scoped (e.g. grip only). */
  shellMaterials: Record<GroupId, THREE.Material[]>
  clipHinge: THREE.Group
  /** Marker at the sensor-head tip (for sensing cones and the dot field). */
  head: THREE.Object3D
  dispose: () => void
}

const EPS = 0.00001
const UP = new THREE.Vector3(0, 1, 0)

/** Lathe profile with rounded corners: points are [radius, y, fillet]. */
function roundedProfile(points: [number, number, number?][], seg = 5): THREE.Vector2[] {
  const out: THREE.Vector2[] = []
  points.forEach(([r, y, f], i) => {
    const p = new THREE.Vector2(r, y)
    if (!f || i === 0 || i === points.length - 1) {
      out.push(p)
      return
    }
    const a = new THREE.Vector2(points[i - 1][0], points[i - 1][1])
    const b = new THREE.Vector2(points[i + 1][0], points[i + 1][1])
    const t1 = p.clone().add(a.clone().sub(p).normalize().multiplyScalar(f))
    const t2 = p.clone().add(b.clone().sub(p).normalize().multiplyScalar(f))
    for (let s = 0; s <= seg; s++) {
      const t = s / seg
      out.push(
        t1
          .clone()
          .multiplyScalar((1 - t) * (1 - t))
          .add(p.clone().multiplyScalar(2 * (1 - t) * t))
          .add(t2.clone().multiplyScalar(t * t)),
      )
    }
  })
  return out
}

const lathe = (profile: THREE.Vector2[], segments = 72) => new THREE.LatheGeometry(profile, segments)

/** Radial position at angle θ (radians, measured from +Z towards +X) and radius r. */
const radial = (theta: number, r: number, y: number) => new THREE.Vector3(r * Math.sin(theta), y, r * Math.cos(theta))

export function buildBaton(): BatonHandles {
  const root = new THREE.Group()
  root.name = 'baton'
  const materials = createMaterials()
  const geometries: THREE.BufferGeometry[] = []
  const extraMaterials: THREE.Material[] = []
  const track = <G extends THREE.BufferGeometry>(g: G) => {
    geometries.push(g)
    return g
  }

  // One anodised material per group, so x-ray can fade groups independently.
  const anodised = {
    head: materials.anodised,
    body: materials.anodised.clone(),
    cap: materials.anodised.clone(),
  }
  const glassHead = materials.glass
  const bezelHead = materials.bezel
  extraMaterials.push(anodised.body, anodised.cap)

  const shellMaterials: Record<GroupId, THREE.Material[]> = {
    head: [anodised.head, glassHead, bezelHead],
    ring: [],
    body: [anodised.body, materials.button, materials.elastomer],
    grip: [materials.grip],
    cap: [anodised.cap],
  }

  const parts: PartHandle[] = []
  const addPart = (id: string, object: THREE.Object3D) => {
    object.name = id
    root.add(object)
    const o = EXPLODE[id] ?? [0, 0, 0]
    parts.push({
      id,
      group: PART_GROUP[id],
      object,
      offset: new THREE.Vector3(o[0], o[1], o[2]),
      stagger: STAGGER[id] ?? 0,
    })
    return object
  }

  // ---- Sensor head -------------------------------------------------------
  const head = new THREE.Group()
  head.add(
    new THREE.Mesh(
      track(lathe(roundedProfile([[EPS, Y.tip], [R, Y.tip, 0.0024], [R, Y.headTop], [EPS, Y.headTop]]))),
      anodised.head,
    ),
  )
  // Ring of four dark-glass sensor windows.
  for (let k = 0; k < 4; k++) {
    const theta = (k * Math.PI) / 2
    const w = new THREE.Mesh(
      track(new THREE.CylinderGeometry(R + 0.0003, R + 0.0003, 0.013, 10, 1, true, theta - 0.25, 0.5)),
      glassHead,
    )
    w.position.y = -0.0685
    head.add(w)
  }
  // Small round button above the top window.
  const hb = new THREE.Mesh(track(new THREE.CylinderGeometry(0.0028, 0.0028, 0.0016, 28)), bezelHead)
  hb.rotation.x = Math.PI / 2
  hb.position.set(0, -0.0505, R + 0.0001)
  head.add(hb)
  addPart('head.shell', head)

  const lens = new THREE.Group()
  const lensDisc = new THREE.Mesh(track(new THREE.CircleGeometry(0.0074, 40)), glassHead)
  lensDisc.rotation.x = Math.PI / 2
  lensDisc.position.y = Y.tip - 0.0002
  const dome = new THREE.Mesh(track(new THREE.SphereGeometry(0.0074, 32, 10, 0, Math.PI * 2, 0, 0.62)), glassHead)
  dome.rotation.x = Math.PI
  dome.position.y = Y.tip + 0.0074 * Math.cos(0.62)
  const bezel = new THREE.Mesh(track(new THREE.TorusGeometry(0.0081, 0.0008, 12, 56)), bezelHead)
  bezel.rotation.x = Math.PI / 2
  bezel.position.y = Y.tip - 0.0002
  lens.add(lensDisc, dome, bezel)
  addPart('head.lens', lens)

  // ---- Light ring --------------------------------------------------------
  const ringMesh = new THREE.Mesh(
    track(
      lathe([
        new THREE.Vector2(R - 0.004, Y.headTop),
        new THREE.Vector2(R + 0.00045, Y.headTop),
        new THREE.Vector2(R + 0.00045, Y.ringTop),
        new THREE.Vector2(R - 0.004, Y.ringTop),
        new THREE.Vector2(R - 0.004, Y.headTop),
      ]),
    ),
    materials.ring,
  )
  addPart('ring', ringMesh)

  // ---- Body --------------------------------------------------------------
  addPart(
    'body.shell',
    new THREE.Mesh(track(lathe([new THREE.Vector2(EPS, Y.ringTop), new THREE.Vector2(R, Y.ringTop), new THREE.Vector2(R, Y.bodyTop), new THREE.Vector2(EPS, Y.bodyTop)])), anodised.body),
  )

  const buttons = new THREE.Group()
  const pill = track(new RoundedBoxGeometry(0.012, 0.0075, 0.0034, 3, 0.0016))
  const dotGeo = track(new THREE.SphereGeometry(0.00062, 10, 8))
  const dotPatterns = [
    [
      [-0.0022, 0.0012],
      [-0.0022, -0.0012],
      [0.0022, 0.0012],
    ],
    [
      [-0.0022, 0.0012],
      [0.0022, -0.0012],
      [0.0022, 0.0012],
      [-0.0022, -0.0012],
    ],
  ]
  ;[-0.0215, -0.0045].forEach((y, i) => {
    const b = new THREE.Mesh(pill, materials.button)
    b.position.set(0, y, R - 0.0005)
    buttons.add(b)
    for (const [dx, dy] of dotPatterns[i]) {
      const d = new THREE.Mesh(dotGeo, materials.button)
      d.position.set(dx, y + dy, R + 0.0012)
      buttons.add(d)
    }
  })
  addPart('body.buttons', buttons)

  // ---- Cane clip (TRD-HW-014): a sprung C-jaw under the body ----------------
  const clip = new THREE.Group()
  const mount = new THREE.Mesh(track(new RoundedBoxGeometry(0.0095, 0.026, 0.0062, 2, 0.0012)), anodised.body)
  mount.position.set(0, -0.021, -(R + 0.0006))
  clip.add(mount)
  const hinge = new THREE.Group()
  hinge.position.set(0, 0, -(R + 0.0035))
  const arcShape = (rIn: number, rOut: number, gapDeg: number) => {
    const a0 = THREE.MathUtils.degToRad(-180 + gapDeg / 2)
    const a1 = THREE.MathUtils.degToRad(180 - gapDeg / 2)
    const s = new THREE.Shape()
    const steps = 32
    for (let i = 0; i <= steps; i++) {
      const a = a0 + ((a1 - a0) * i) / steps
      const u = rOut * Math.sin(a)
      const v = rOut * Math.cos(a)
      if (i === 0) s.moveTo(u, v)
      else s.lineTo(u, v)
    }
    for (let i = steps; i >= 0; i--) {
      const a = a0 + ((a1 - a0) * i) / steps
      s.lineTo(rIn * Math.sin(a), rIn * Math.cos(a))
    }
    s.closePath()
    return s
  }
  const jawGeo = track(
    new THREE.ExtrudeGeometry(arcShape(CANE_R + 0.0004, CANE_R + 0.0028, 74), {
      depth: 0.024,
      bevelEnabled: true,
      bevelThickness: 0.0006,
      bevelSize: 0.0005,
      bevelSegments: 2,
      curveSegments: 24,
    }),
  )
  const insertGeo = track(
    new THREE.ExtrudeGeometry(arcShape(CANE_R - 0.0001, CANE_R + 0.0005, 80), { depth: 0.024, bevelEnabled: false }),
  )
  const jawZ = CANE_Z + R + 0.0035
  const jaw = new THREE.Mesh(jawGeo, anodised.body)
  const insert = new THREE.Mesh(insertGeo, materials.elastomer)
  for (const m of [jaw, insert]) {
    m.rotation.x = Math.PI / 2
    m.position.set(0, -0.009, jawZ)
    hinge.add(m)
  }
  clip.add(hinge)
  addPart('clip', clip)

  // ---- Grip: ergonomic hourglass, dimpled soft-touch ----------------------
  const gripProfile: [number, number, number?][] = [[EPS, Y.bodyTop], [R, Y.bodyTop, 0.0012]]
  for (let i = 1; i < 14; i++) {
    const t = i / 14
    const y = Y.bodyTop + (Y.gripTop - Y.bodyTop) * t
    gripProfile.push([R - (R - GRIP_WAIST) * Math.sin(Math.PI * t), y])
  }
  gripProfile.push([R, Y.gripTop, 0.0012], [EPS, Y.gripTop])
  addPart('grip.shell', new THREE.Mesh(track(lathe(roundedProfile(gripProfile))), materials.grip))

  // ---- End cap with status slit ------------------------------------------
  const cap = new THREE.Group()
  cap.add(new THREE.Mesh(track(lathe(roundedProfile([[EPS, Y.gripTop], [R, Y.gripTop], [R, Y.cap, 0.0032], [EPS, Y.cap]]))), anodised.cap))
  const slit = new THREE.Mesh(track(new THREE.BoxGeometry(0.0085, 0.0005, 0.0013)), materials.slit)
  slit.position.set(0, Y.cap + 0.00005, 0.004)
  cap.add(slit)
  addPart('cap', cap)

  // ---- Internals: diagram style (illustrative, docs/05 §4.4) --------------
  const internals: InternalHandle[] = []
  const addInternal = (id: InternalId, meshes: { geo: THREE.BufferGeometry; pos: THREE.Vector3; dir?: THREE.Vector3; rotX?: number }[]) => {
    const { fill, edges } = createInternalMaterials()
    extraMaterials.push(fill, edges)
    const g = new THREE.Group()
    for (const m of meshes) {
      track(m.geo)
      const mesh = new THREE.Mesh(m.geo, fill)
      mesh.renderOrder = 2
      const lines = new THREE.LineSegments(track(new THREE.EdgesGeometry(m.geo, 25)), edges)
      lines.renderOrder = 3
      mesh.add(lines)
      mesh.position.copy(m.pos)
      if (m.dir) mesh.quaternion.setFromUnitVectors(UP, m.dir.clone().normalize())
      if (m.rotX) mesh.rotation.x = m.rotX
      g.add(mesh)
    }
    g.visible = false
    internals.push({ id, object: g, fill, edges })
    addPart(id, g)
  }

  addInternal(
    'tof',
    [0, 1, 2, 3].map((k) => ({ geo: new THREE.BoxGeometry(0.0062, 0.0062, 0.0062), pos: radial((k * Math.PI) / 2, 0.0115, -0.0685) })),
  )
  addInternal(
    'ultrasonic',
    [-1, 1].map((s) => ({ geo: new THREE.CylinderGeometry(0.0036, 0.0036, 0.0065, 20), pos: new THREE.Vector3(s * 0.0105, -0.0905, -0.004) })),
  )
  addInternal('camera', [{ geo: new THREE.BoxGeometry(0.0105, 0.0065, 0.0105), pos: new THREE.Vector3(0, -0.0925, 0.0005) }])
  addInternal('nir', [{ geo: new THREE.CylinderGeometry(0.0022, 0.0022, 0.004, 16), pos: new THREE.Vector3(0, -0.0955, 0.0125) }])
  addInternal(
    'mics',
    [1, 3, 5, 7].map((k) => ({ geo: new THREE.SphereGeometry(0.0017, 12, 8), pos: radial((k * Math.PI) / 4, 0.0155, -0.051) })),
  )
  addInternal('mainBoard', [{ geo: new THREE.BoxGeometry(0.024, 0.05, 0.0016), pos: new THREE.Vector3(0, -0.0125, 0.0075) }])
  addInternal('safetyCore', [{ geo: new THREE.BoxGeometry(0.02, 0.022, 0.0016), pos: new THREE.Vector3(0, -0.0165, -0.0085) }])
  addInternal('imuGnss', [{ geo: new THREE.BoxGeometry(0.0085, 0.0085, 0.0032), pos: new THREE.Vector3(0, 0.0095, 0.0085) }])
  addInternal('battery', [{ geo: new THREE.CylinderGeometry(0.0088, 0.0088, 0.046, 28), pos: new THREE.Vector3(0, 0.05, 0) }])
  addInternal('batteryReserve', [{ geo: new THREE.CylinderGeometry(0.0091, 0.0091, 0.008, 28), pos: new THREE.Vector3(0, 0.0785, 0) }])
  addInternal('storage', [{ geo: new THREE.BoxGeometry(0.0065, 0.0045, 0.0022), pos: new THREE.Vector3(0, 0.022, 0.006) }])
  addInternal('coil', [{ geo: new THREE.TorusGeometry(0.0118, 0.0012, 10, 48), pos: new THREE.Vector3(0, 0.0935, 0), rotX: Math.PI / 2 }])

  // ---- Haptic ring: 8 actuators (TRD-HW-005). Actuator 0 = ahead. ---------
  // Seen end-on from the cap, ahead is screen-up (local -Z) and right is +X.
  const actuators: ActuatorHandle[] = []
  const actGroup = new THREE.Group()
  const actGeo = track(new THREE.CylinderGeometry(0.0036, 0.0036, 0.0028, 22))
  const actEdges = track(new THREE.EdgesGeometry(actGeo, 25))
  for (let k = 0; k < 8; k++) {
    const theta = (k * Math.PI) / 4
    const { fill, edges } = createInternalMaterials()
    extraMaterials.push(fill, edges)
    const mesh = new THREE.Mesh(actGeo, fill)
    mesh.renderOrder = 4
    mesh.add(Object.assign(new THREE.LineSegments(actEdges, edges), { renderOrder: 5 }))
    const dir = new THREE.Vector3(Math.sin(theta), 0, -Math.cos(theta))
    mesh.position.copy(dir.clone().multiplyScalar(0.0143)).setY(0.053)
    mesh.quaternion.setFromUnitVectors(UP, dir)
    actGroup.add(mesh)
    actuators.push({ mesh, fill, edges, intensity: 0 })
  }
  actGroup.visible = false
  addPart('actuators', actGroup)
  internals.push({ id: 'actuators', object: actGroup, fill: actuators[0].fill, edges: actuators[0].edges })

  // Marker at the sensor-head tip.
  const headMarker = new THREE.Object3D()
  headMarker.position.set(0, Y.tip, 0)
  root.add(headMarker)

  const dispose = () => {
    for (const g of geometries) g.dispose()
    for (const m of [...Object.values(materials).flat(), ...extraMaterials]) {
      if (m instanceof THREE.Material) m.dispose()
    }
    materials.grip.normalMap?.dispose()
  }

  // Shells cast and receive nothing; keep the scene light.
  root.traverse((o) => {
    if (o instanceof THREE.Mesh) o.frustumCulled = true
  })

  return {
    root,
    parts,
    internals,
    actuators,
    materials,
    shellMaterials,
    clipHinge: hinge,
    head: headMarker,
    dispose,
  }
}

export const signalColor = COLORS.chartreuse
