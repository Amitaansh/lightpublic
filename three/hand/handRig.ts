import * as THREE from 'three'

/**
 * Rig for the WebXR generic hand (MIT, @webxr-input-profiles/assets; see
 * public/models/LICENSE-hand.md). Its 25 joints all sit directly under the
 * armature, so curling is done here with forward kinematics: each knuckle
 * rotates the rest of its finger about an axis derived from the rest pose.
 *
 * Rest pose (armature space): fingers point -Y, the thumb is on the -Z side,
 * the palm faces -X.
 */

const FINGERS = ['index-finger', 'middle-finger', 'ring-finger', 'pinky-finger'] as const
const FINGER_JOINTS = ['metacarpal', 'phalanx-proximal', 'phalanx-intermediate', 'phalanx-distal', 'tip']
const THUMB_JOINTS = ['thumb-metacarpal', 'thumb-phalanx-proximal', 'thumb-phalanx-distal', 'thumb-tip']
const PALM_N = new THREE.Vector3(-1, 0, 0)
const DEG = Math.PI / 180

type Rest = { bone: THREE.Bone; p: THREE.Vector3; q: THREE.Quaternion }

export type HandPose = {
  /** 0 = relaxed open hand, 1 = closed around the 38 mm grip. */
  grip: number
  /** Extra spread of the fingers when reaching, 0..1. */
  reach: number
  /** How far the cane's grip is nested under the baton, 0..1 (fingers wrap it too). */
  cane?: number
}

/**
 * What the fingers close around, in the hand's rest (armature) space. Each
 * joint is kept at least `radius(along) + joint thickness` from every line,
 * so the fingers stop on the surface instead of passing through it.
 */
export type GripContact = {
  lines: {
    /** A point on the centre line, and its unit direction. */
    origin: THREE.Vector3
    dir: THREE.Vector3
    /** Surface radius at signed distance `s` from `origin` along `dir`; 0 = nothing there. */
    radius: (s: number, pose: HandPose) => number
  }[]
}

// Approximate joint radii of an adult hand (m): proximal, intermediate, distal, tip.
const FINGER_THICK = [0.0098, 0.0088, 0.0078, 0.0066]
const THUMB_THICK = [0.0115, 0.0098, 0.0086, 0.0072]

export type HandRig = {
  root: THREE.Object3D
  mesh: THREE.SkinnedMesh
  material: THREE.MeshPhysicalMaterial
  setPose: (pose: HandPose) => void
  setOpacity: (o: number) => void
  dispose: () => void
}

export function createHandRig(scene: THREE.Object3D, contact?: GripContact): HandRig {
  let mesh: THREE.SkinnedMesh | null = null
  scene.traverse((o) => {
    if ((o as THREE.SkinnedMesh).isSkinnedMesh) mesh = o as THREE.SkinnedMesh
  })
  if (!mesh) throw new Error('hand model has no skinned mesh')
  const skinned = mesh as THREE.SkinnedMesh

  // Smooth shading on the low-poly hand; a sculpted, matte clay finish.
  skinned.geometry.computeVertexNormals()
  const material = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color('#a9a198'),
    roughness: 0.66,
    metalness: 0,
    sheen: 0.35,
    sheenRoughness: 0.6,
    sheenColor: new THREE.Color('#fff2e6'),
    clearcoat: 0.08,
    clearcoatRoughness: 0.6,
  })
  skinned.material = material
  skinned.castShadow = true
  skinned.receiveShadow = true
  skinned.frustumCulled = false

  const bones = new Map<string, Rest>()
  for (const b of skinned.skeleton.bones) bones.set(b.name, { bone: b, p: b.position.clone(), q: b.quaternion.clone() })
  const get = (n: string) => {
    const r = bones.get(n)
    if (!r) throw new Error(`hand joint ${n} missing`)
    return r
  }

  const fingerChains = FINGERS.map((f) => FINGER_JOINTS.map((j) => get(`${f}-${j}`)))
  const thumbChain = THUMB_JOINTS.map(get)

  const flexAxis = (chain: Rest[], from: number) => {
    const dir = chain[chain.length - 1].p.clone().sub(chain[from].p).normalize()
    return dir.cross(PALM_N).normalize()
  }
  const fingerAxes = fingerChains.map((c) => flexAxis(c, 1))
  const thumbFlex = flexAxis(thumbChain, 0)

  type Rot = { axis: THREE.Vector3; angle: number }

  /** Forward kinematics: joint positions and rotations for the given pivot rotations (rest frame). */
  const fk = (chain: Rest[], pivots: number[], rotations: Rot[][], scales: number[]) => {
    const ps: THREE.Vector3[] = []
    const qs: THREE.Quaternion[] = []
    let R = new THREE.Quaternion()
    let p = chain[0].p.clone()
    for (let k = 0; k < chain.length; k++) {
      const pi = pivots.indexOf(k)
      if (pi >= 0) {
        for (const r of rotations[pi]) {
          const ax = r.axis.clone().applyQuaternion(R)
          R = new THREE.Quaternion().setFromAxisAngle(ax, r.angle * scales[pi]).multiply(R)
        }
      }
      ps.push(p)
      qs.push(R.clone())
      if (k + 1 < chain.length) p = p.clone().add(chain[k + 1].p.clone().sub(chain[k].p).applyQuaternion(R))
    }
    return { ps, qs }
  }

  const tmp = new THREE.Vector3()
  /** How far the point sits inside any contact surface (m); <= 0 means clear. */
  const depth = (p: THREE.Vector3, thick: number, pose: HandPose) => {
    if (!contact) return -1
    let worst = -Infinity
    for (const l of contact.lines) {
      tmp.copy(p).sub(l.origin)
      const s = tmp.dot(l.dir)
      const r = l.radius(s, pose)
      if (r <= 0) continue
      const d = tmp.addScaledVector(l.dir, -s).length()
      worst = Math.max(worst, r + thick - d)
    }
    return worst
  }

  /** Deepest penetration of the chain from joint `from` onwards (joints and segment midpoints). */
  const chainDepth = (ps: THREE.Vector3[], from: number, thick: number[], pose: HandPose) => {
    let worst = -Infinity
    const off = ps.length - thick.length // the first joints (metacarpal) sit in the palm
    for (let k = Math.max(from, off); k < ps.length; k++) {
      const t = thick[k - off]
      worst = Math.max(worst, depth(ps[k], t, pose))
      if (k + 1 < ps.length) {
        const mid = ps[k].clone().lerp(ps[k + 1], 0.5)
        worst = Math.max(worst, depth(mid, (t + thick[Math.min(k + 1 - off, thick.length - 1)]) / 2, pose))
      }
    }
    return worst
  }

  /**
   * Curl the chain pivot by pivot, from the knuckle out. Each pivot turns as far
   * as the pose asks, unless that would push the finger into the grip: then it
   * stops where the finger meets the surface (bisection), and the next joint
   * carries on curling around it.
   */
  const solve = (chain: Rest[], pivots: number[], rotations: Rot[][], thick: number[], pose: HandPose, allowed: number) => {
    const scales = pivots.map(() => 1)
    if (contact) {
      // Rotations that already start inside the surface (the rest pose) are left alone.
      const start = chainDepth(fk(chain, pivots, rotations, pivots.map(() => 0)).ps, 0, thick, pose)
      const limit = Math.max(allowed, start)
      for (let i = 0; i < pivots.length; i++) {
        const test = (s: number) => {
          scales[i] = s
          for (let j = i + 1; j < pivots.length; j++) scales[j] = 0
          return chainDepth(fk(chain, pivots, rotations, scales).ps, pivots[i] + 1, thick, pose) <= limit
        }
        if (!test(1)) {
          let lo = 0
          let hi = 1
          if (!test(0)) hi = 0
          for (let it = 0; it < 12 && hi > 0; it++) {
            const m = (lo + hi) / 2
            if (test(m)) lo = m
            else hi = m
          }
          scales[i] = lo
        } else scales[i] = 1
      }
    }
    const { ps, qs } = fk(chain, pivots, rotations, scales)
    chain.forEach((j, k) => {
      j.bone.position.copy(ps[k])
      j.bone.quaternion.copy(qs[k]).multiply(j.q)
    })
  }

  // Per finger: a little more curl toward the pinky, as in a real grip.
  const fingerBias = [0, 4, 8, 12]

  const setPose = (pose: HandPose) => {
    const { grip, reach } = pose
    // The skin may press a little into the soft-touch grip, never further.
    const allowed = 0.0012
    const g = THREE.MathUtils.clamp(grip, 0, 1)
    const open = (1 - g) * reach
    fingerChains.forEach((chain, i) => {
      const ax = fingerAxes[i]
      const spread = (i - 1.5) * 4 * open * DEG
      const base = 8 - 10 * open
      solve(chain, [1, 2, 3], [
        [
          { axis: PALM_N, angle: spread },
          { axis: ax, angle: (base + (64 + fingerBias[i]) * g) * DEG },
        ],
        [{ axis: ax, angle: (8 + (78 + fingerBias[i]) * g) * DEG }],
        [{ axis: ax, angle: (5 + 46 * g) * DEG }],
      ], FINGER_THICK, pose, allowed)
    })
    // Thumb: swings across the palm and lies along the top of the grip.
    solve(thumbChain, [0, 1, 2], [
      [
        // Lift the thumb from along the fingers to along the top of the grip.
        { axis: PALM_N, angle: (-6 - 50 * g) * DEG },
        { axis: thumbFlex, angle: (4 + 10 * g) * DEG },
      ],
      [{ axis: thumbFlex, angle: (6 + 12 * g) * DEG }],
      [{ axis: thumbFlex, angle: (6 + 22 * g) * DEG }],
    ], THUMB_THICK, pose, allowed)
    skinned.skeleton.update()
  }

  const setOpacity = (o: number) => {
    const t = o < 0.995
    if (material.transparent !== t) {
      material.transparent = t
      material.needsUpdate = true
    }
    material.opacity = o
    material.depthWrite = !t || o > 0.5
    scene.visible = o > 0.01
  }

  setPose({ grip: 0, reach: 0 })
  return {
    root: scene,
    mesh: skinned,
    material,
    setPose,
    setOpacity,
    dispose: () => material.dispose(),
  }
}
