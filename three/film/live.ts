import * as THREE from 'three'
import { frameAt, type Frame } from './shots'
import type { Obstacle } from './world'

/**
 * Per-frame values the director computes once and every scene element reads.
 * Plain mutable objects: no React re-renders while scrolling.
 */
/** The site's accent and the STOP alert colour. */
export const CYAN = new THREE.Color('#2ee6ff')
export const ALERT_RED = new THREE.Color('#ff3b3b')

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
  /** Blueprint labels: each part's anchor on screen (CSS px) and whether it's in view. */
  callouts: [] as { x: number; y: number; on: boolean }[],
  /** How visible the blueprint labels are, 0..1. */
  calloutShow: 0,
  /** STOP alert colour: 0 = the usual cyan, 1 = alert red. */
  alert: 0,
  time: 0,
}

/** Pointer in normalised device coordinates, or null when not over the page. */
export const pointer = { x: 0, y: 0, cx: 0, cy: 0, active: false }
