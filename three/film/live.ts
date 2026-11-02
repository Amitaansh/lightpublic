import * as THREE from 'three'
import { frameAt, type Frame } from './shots'
import type { Obstacle } from './world'

/**
 * Per-frame values the director computes once and every scene element reads.
 * Plain mutable objects: no React re-renders while scrolling.
 */
export const live = {
  T: 0,
  frame: frameAt(0) as Frame,
  /** Lights-out amount actually shown (film + visitor's toggle), smoothed. */
  lightsOut: 0,
  gripWorld: new THREE.Vector3(),
  headWorld: new THREE.Vector3(),
  batonWorld: new THREE.Vector3(),
  batonQuat: new THREE.Quaternion(),
  obstacles: [] as Obstacle[],
  motors: new Array<number>(8).fill(0),
  /** STOP: every motor at once. */
  stopAll: 0,
  time: 0,
}

/** Pointer in normalised device coordinates, or null when not over the page. */
export const pointer = { x: 0, y: 0, active: false }
