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
}

export type HandRig = {
  root: THREE.Object3D
  mesh: THREE.SkinnedMesh
  material: THREE.MeshPhysicalMaterial
  setPose: (pose: HandPose) => void
  setOpacity: (o: number) => void
  dispose: () => void
}

export function createHandRig(scene: THREE.Object3D): HandRig {
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

  /** Rotate the chain from each pivot onwards; pivots[i] rotates by angles[i] about axes[i] (rest frame). */
  const solve = (chain: Rest[], pivots: number[], rotations: { axis: THREE.Vector3; angle: number }[][]) => {
    let R = new THREE.Quaternion()
    let p = chain[0].p.clone()
    for (let k = 0; k < chain.length; k++) {
      const pi = pivots.indexOf(k)
      if (pi >= 0) {
        for (const r of rotations[pi]) {
          const ax = r.axis.clone().applyQuaternion(R)
          R = new THREE.Quaternion().setFromAxisAngle(ax, r.angle).multiply(R)
        }
      }
      const j = chain[k]
      j.bone.position.copy(p)
      j.bone.quaternion.copy(R).multiply(j.q)
      if (k + 1 < chain.length) p = p.clone().add(chain[k + 1].p.clone().sub(j.p).applyQuaternion(R))
    }
  }

  // Per finger: a little more curl toward the pinky, as in a real grip.
  const fingerBias = [0, 4, 8, 12]

  const setPose = ({ grip, reach }: HandPose) => {
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
      ])
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
    ])
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
