import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'
import { buildInternals, type InternalPart, type PoweredMaterial } from './buildInternals'
import { CANE_R, CANE_Z, GRIP_WAIST, R, SHELL, Y, type GroupId } from './dimensions'
import { COLORS, createMaterials, type BatonMaterials } from './materials'

export type PartHandle = { id: string; group: GroupId; object: THREE.Object3D; offset: THREE.Vector3; stagger: number }

export type BatonHandles = {
  root: THREE.Group
  /** Shells and internals, for the exploded view. */
  parts: PartHandle[]
  internals: InternalPart[]
  powered: PoweredMaterial[]
  actuators: { mesh: THREE.Mesh; glow: THREE.MeshStandardMaterial }[]
  materials: BatonMaterials
  clipHinge: THREE.Group
  /** Marker at the sensor-head tip, and at the grip centre. */
  head: THREE.Object3D
  grip: THREE.Object3D
  /** The ring's own light: the only light in the room when the lights are out. */
  ringLight: THREE.PointLight
  /** Meshes that count as "the baton" when clicked. */
  hitTargets: THREE.Object3D[]
  dispose: () => void
}

const EPS = 0.00001

/** Lathe profile with rounded corners: points are [radius, y, fillet]. */
function roundedProfile(points: [number, number, number?][], seg = 6): THREE.Vector2[] {
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

const lathe = (profile: THREE.Vector2[], segments = 96) => new THREE.LatheGeometry(profile, segments)

export function buildBaton(): BatonHandles {
  const root = new THREE.Group()
  root.name = 'baton'
  const materials = createMaterials()
  const geometries: THREE.BufferGeometry[] = []
  const track = <G extends THREE.BufferGeometry>(g: G) => {
    geometries.push(g)
    return g
  }
  const shadowed = <T extends THREE.Object3D>(o: T) => {
    o.traverse((c) => {
      if (c instanceof THREE.Mesh) {
        c.castShadow = true
        c.receiveShadow = true
      }
    })
    return o
  }

  const parts: PartHandle[] = []
  const hitTargets: THREE.Object3D[] = []
  const addPart = (id: string, object: THREE.Object3D, hit = true) => {
    object.name = id
    root.add(shadowed(object))
    const s = SHELL[id]
    parts.push({ id, group: s.group, object, offset: new THREE.Vector3(...s.offset), stagger: s.stagger })
    if (hit) hitTargets.push(object)
    return object
  }

  // ---- Sensor head ---------------------------------------------------------
  const head = new THREE.Group()
  head.add(new THREE.Mesh(track(lathe(roundedProfile([[EPS, Y.tip], [R, Y.tip, 0.0026], [R, Y.headTop], [EPS, Y.headTop]]))), materials.anodised))
  for (let k = 0; k < 4; k++) {
    const theta = (k * Math.PI) / 2
    const w = new THREE.Mesh(track(new THREE.CylinderGeometry(R + 0.0003, R + 0.0003, 0.013, 12, 1, true, theta - 0.25, 0.5)), materials.glass)
    w.position.y = -0.0685
    head.add(w)
  }
  // A thin machined groove near the tip.
  const groove = new THREE.Mesh(track(new THREE.TorusGeometry(R + 0.00005, 0.00035, 8, 96)), materials.elastomer)
  groove.rotation.x = Math.PI / 2
  groove.position.y = -0.0905
  head.add(groove)
  const hb = new THREE.Mesh(track(new THREE.CylinderGeometry(0.0028, 0.0028, 0.0016, 32)), materials.bezel)
  hb.rotation.x = Math.PI / 2
  hb.position.set(0, -0.0505, R + 0.0001)
  head.add(hb)
  addPart('head.shell', head)

  const lens = new THREE.Group()
  const lensDisc = new THREE.Mesh(track(new THREE.CircleGeometry(0.0074, 48)), materials.glass)
  lensDisc.rotation.x = Math.PI / 2
  lensDisc.position.y = Y.tip - 0.0002
  const dome = new THREE.Mesh(track(new THREE.SphereGeometry(0.0074, 40, 12, 0, Math.PI * 2, 0, 0.62)), materials.glass)
  dome.rotation.x = Math.PI
  dome.position.y = Y.tip + 0.0074 * Math.cos(0.62)
  const bezel = new THREE.Mesh(track(new THREE.TorusGeometry(0.0081, 0.0008, 12, 64)), materials.bezel)
  bezel.rotation.x = Math.PI / 2
  bezel.position.y = Y.tip - 0.0002
  lens.add(lensDisc, dome, bezel)
  addPart('head.lens', lens)

  // ---- Light ring ------------------------------------------------------------
  const ringMesh = new THREE.Mesh(
    track(
      lathe([
        new THREE.Vector2(R - 0.004, Y.headTop),
        new THREE.Vector2(R + 0.0005, Y.headTop),
        new THREE.Vector2(R + 0.0005, Y.ringTop),
        new THREE.Vector2(R - 0.004, Y.ringTop),
        new THREE.Vector2(R - 0.004, Y.headTop),
      ]),
    ),
    materials.ring,
  )
  ringMesh.castShadow = false
  addPart('ring', ringMesh)

  // ---- Body ------------------------------------------------------------------
  addPart(
    'body.shell',
    new THREE.Mesh(track(lathe([new THREE.Vector2(EPS, Y.ringTop), new THREE.Vector2(R, Y.ringTop), new THREE.Vector2(R, Y.bodyTop), new THREE.Vector2(EPS, Y.bodyTop)])), materials.anodised),
  )

  const buttons = new THREE.Group()
  const pill = track(new RoundedBoxGeometry(0.012, 0.0075, 0.0034, 4, 0.0016))
  const dotGeo = track(new THREE.SphereGeometry(0.00062, 12, 8))
  const patterns = [
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
    for (const [dx, dy] of patterns[i]) {
      const d = new THREE.Mesh(dotGeo, materials.button)
      d.position.set(dx, y + dy, R + 0.0012)
      buttons.add(d)
    }
  })
  addPart('body.buttons', buttons)

  // ---- Cane clip (TRD-HW-014): a sprung C-jaw under the body -----------------
  const clip = new THREE.Group()
  const mount = new THREE.Mesh(track(new RoundedBoxGeometry(0.0095, 0.026, 0.0062, 3, 0.0012)), materials.anodised)
  mount.position.set(0, -0.021, -(R + 0.0006))
  clip.add(mount)
  const hinge = new THREE.Group()
  hinge.position.set(0, 0, -(R + 0.0035))
  const arcShape = (rIn: number, rOut: number, gapDeg: number) => {
    const a0 = THREE.MathUtils.degToRad(-180 + gapDeg / 2)
    const a1 = THREE.MathUtils.degToRad(180 - gapDeg / 2)
    const s = new THREE.Shape()
    const steps = 40
    for (let i = 0; i <= steps; i++) {
      const a = a0 + ((a1 - a0) * i) / steps
      if (i === 0) s.moveTo(rOut * Math.sin(a), rOut * Math.cos(a))
      else s.lineTo(rOut * Math.sin(a), rOut * Math.cos(a))
    }
    for (let i = steps; i >= 0; i--) {
      const a = a0 + ((a1 - a0) * i) / steps
      s.lineTo(rIn * Math.sin(a), rIn * Math.cos(a))
    }
    s.closePath()
    return s
  }
  const jaw = new THREE.Mesh(
    track(new THREE.ExtrudeGeometry(arcShape(CANE_R + 0.0004, CANE_R + 0.0028, 74), { depth: 0.024, bevelEnabled: true, bevelThickness: 0.0006, bevelSize: 0.0005, bevelSegments: 3, curveSegments: 32 })),
    materials.anodised,
  )
  const insert = new THREE.Mesh(track(new THREE.ExtrudeGeometry(arcShape(CANE_R - 0.0001, CANE_R + 0.0005, 80), { depth: 0.024, bevelEnabled: false })), materials.elastomer)
  const jawZ = CANE_Z + R + 0.0035
  for (const m of [jaw, insert]) {
    m.rotation.x = Math.PI / 2
    m.position.set(0, -0.009, jawZ)
    hinge.add(m)
  }
  clip.add(hinge)
  addPart('clip', clip)

  // ---- Grip: ergonomic hourglass, dimpled soft-touch --------------------------
  const gripProfile: [number, number, number?][] = [[EPS, Y.bodyTop], [R, Y.bodyTop, 0.0014]]
  for (let i = 1; i < 20; i++) {
    const t = i / 20
    gripProfile.push([R - (R - GRIP_WAIST) * Math.sin(Math.PI * t), Y.bodyTop + (Y.gripTop - Y.bodyTop) * t])
  }
  gripProfile.push([R, Y.gripTop, 0.0014], [EPS, Y.gripTop])
  addPart('grip.shell', new THREE.Mesh(track(lathe(roundedProfile(gripProfile))), materials.grip))

  // ---- End cap with status slit ----------------------------------------------
  const cap = new THREE.Group()
  cap.add(new THREE.Mesh(track(lathe(roundedProfile([[EPS, Y.gripTop], [R, Y.gripTop], [R, Y.cap, 0.0034], [EPS, Y.cap]]))), materials.anodised))
  const slit = new THREE.Mesh(track(new THREE.BoxGeometry(0.0085, 0.0005, 0.0013)), materials.slit)
  slit.position.set(0, Y.cap + 0.00005, 0.004)
  cap.add(slit)
  addPart('cap', cap)

  // ---- Internals (shown when exploded) ---------------------------------------
  const internals = buildInternals()
  for (const p of internals.parts) {
    root.add(p.object)
    parts.push({ id: p.id, group: p.group, object: p.object, offset: p.offset, stagger: p.stagger })
  }

  // ---- Markers and the ring's light ---------------------------------------------
  const headMarker = new THREE.Object3D()
  headMarker.position.set(0, Y.tip, 0)
  const gripMarker = new THREE.Object3D()
  gripMarker.position.set(0, 0.053, 0)
  root.add(headMarker, gripMarker)

  const ringLight = new THREE.PointLight(COLORS.cyan.clone(), 0.05, 1.2, 2)
  ringLight.position.set(0, -0.041, 0)
  root.add(ringLight)

  return {
    root,
    parts,
    internals: internals.parts,
    powered: internals.powered,
    actuators: internals.actuators,
    materials,
    clipHinge: hinge,
    head: headMarker,
    grip: gripMarker,
    ringLight,
    hitTargets,
    dispose: () => {
      geometries.forEach((g) => g.dispose())
      Object.values(materials).forEach((m) => {
        const mm = m as THREE.MeshStandardMaterial
        mm.normalMap?.dispose()
        mm.roughnessMap?.dispose()
        mm.dispose()
      })
      internals.dispose()
    },
  }
}
