import * as THREE from 'three'
import type { Frame, V3 } from './shots'

const clamp01 = (x: number) => Math.min(1, Math.max(0, x))
const ease = (t: number) => {
  const x = clamp01(t)
  return x * x * (3 - 2 * x)
}

export type Obstacle = {
  id: 'pole' | 'branch' | 'person'
  /** The point the sensors lock on to (world space). */
  pos: V3
  /** How present the obstacle is on screen, 0..1 (fades out once it has passed). */
  vis: number
  /** How strongly the grip answers it, 0..1: closer = stronger (PRD-F-001); 0 once behind. */
  strength: number
}

/** Metres the walker covers per unit of scene progress in the vibration demo. */
export const WALK = 5

/**
 * Vibration demo, in world space. The user walks toward -X; their left is +Z,
 * their right is -Z. Everything in the street slides past at walking speed
 * (the person walks toward you, so a little faster). Each obstacle is felt
 * once it is within sensing range ahead, more strongly the closer it gets,
 * and fades out of view once it has passed.
 */
const OBSTACLES: { id: Obstacle['id']; x0: number; speed: number; y: number; z: number }[] = [
  { id: 'pole', x0: -3.2, speed: WALK, y: -0.28, z: 0.72 },
  { id: 'branch', x0: -3.98, speed: WALK, y: 0.35, z: 0.02 },
  { id: 'person', x0: -6.8, speed: WALK + 1.2, y: -0.2, z: -1.0 },
]

export function obstaclesAt(f: Frame): Obstacle[] {
  if (f.scene !== 'vibration') return []
  const show = f.obstacles.show
  return OBSTACLES.map((o) => {
    const x = o.x0 + f.u * o.speed
    // Fade out as it passes the walker, before it reaches the camera.
    const vis = show * (1 - ease((x + 0.15) / 0.35))
    const ahead = -x
    const strength = ahead > 0.05 ? show * ease((2.4 - ahead) / 1.9) * (1 - ease((0.25 - ahead) / 0.2)) : 0
    return { id: o.id, pos: [x, o.y, o.z] as V3, vis, strength }
  })
}

const v = new THREE.Vector3()
const qInv = new THREE.Quaternion()

/**
 * Strength of each of the 8 grip motors (actuator k points along
 * (sin a, 0, -cos a) in baton space). Direction is measured in the baton's
 * frame, so the side of the grip facing an obstacle lights up.
 */
export function motorStrengths(obstacles: Obstacle[], gripWorld: THREE.Vector3, batonQuat: THREE.Quaternion, out: number[]) {
  out.fill(0)
  qInv.copy(batonQuat).invert()
  for (const o of obstacles) {
    if (o.strength <= 0.001) continue
    v.set(o.pos[0], o.pos[1], o.pos[2]).sub(gripWorld).applyQuaternion(qInv)
    const a = Math.atan2(v.x, -v.z)
    for (let k = 0; k < 8; k++) {
      const ak = (k * Math.PI) / 4
      let d = Math.abs(a - ak) % (Math.PI * 2)
      if (d > Math.PI) d = Math.PI * 2 - d
      const w = Math.max(0, Math.cos(d)) ** 6
      out[k] = Math.max(out[k], w * o.strength)
    }
  }
  return out
}

/* ------------------------------------------------------------------ route */

/** Floor height: where the cane tip touches, with the baton held at the cane's angle. */
export const FLOOR_Y = -0.66

/** A remembered route ahead (world -X), drawn on the floor. */
export const ROUTE_POINTS: V3[] = [
  [0.1, FLOOR_Y, 0],
  [-0.8, FLOOR_Y, 0.02],
  [-1.6, FLOOR_Y, 0.18],
  [-2.3, FLOOR_Y, 0.55],
  [-2.9, FLOOR_Y, 0.62],
  [-3.8, FLOOR_Y, 0.4],
  [-4.6, FLOOR_Y, 0.38],
]

/** Remembered fixed obstacles along the route (distance along the walk, side offset). */
export const ROUTE_MARKERS = [
  { x: -1.1, z: 0.22, kind: 'bollard' as const },
  { x: -2.0, z: 0.5, kind: 'step' as const },
  { x: -3.1, z: 0.42, kind: 'branch' as const },
]
/** A Guide Note pinned to a spot on the route. */
export const ROUTE_NOTE = { x: -2.6, z: 0.82 }
/** How far the walker travels over the scene (metres). */
export const ROUTE_TRAVEL = 3.0
