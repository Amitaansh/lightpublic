import * as THREE from 'three'
import type { Frame, V3 } from './shots'

const clamp01 = (x: number) => Math.min(1, Math.max(0, x))
const ease = (t: number) => {
  const x = clamp01(t)
  return x * x * (3 - 2 * x)
}
const bump = (u: number, a: number, b: number, c: number, d: number) => (u < b ? ease((u - a) / (b - a)) : 1 - ease((u - c) / (d - c)))
const lerp = (a: number, b: number, t: number) => a + (b - a) * t

export type Obstacle = { id: 'pole' | 'branch' | 'person'; pos: V3; vis: number; strength: number }

/**
 * Vibration demo, in world space. The user faces -X; their left is +Z, their
 * right is -Z. Each obstacle walks in from the dark, gets close, then fades,
 * and its strength rises as it nears (PRD-F-001: closer = stronger).
 */
export function obstaclesAt(f: Frame): Obstacle[] {
  if (f.scene !== 'vibration') return []
  const u = f.u
  const item = (id: Obstacle['id'], a: number, b: number, c: number, d: number, far: V3, near: V3): Obstacle => {
    const prog = ease((u - a) / (c - a))
    const vis = bump(u, a, b, c, d) * f.obstacles.show
    return { id, pos: [lerp(far[0], near[0], prog), lerp(far[1], near[1], prog), lerp(far[2], near[2], prog)], vis, strength: vis * (0.2 + 0.8 * prog) }
  }
  return [
    item('pole', 0.16, 0.22, 0.48, 0.55, [-2.4, -0.28, 0.55], [-0.8, -0.28, 0.42]),
    item('branch', 0.42, 0.48, 0.68, 0.74, [-2.2, 0.38, 0.02], [-0.58, 0.32, 0.02]),
    item('person', 0.62, 0.68, 0.93, 0.99, [-2.2, -0.2, -1.4], [-1.05, -0.2, -0.62]),
  ]
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
