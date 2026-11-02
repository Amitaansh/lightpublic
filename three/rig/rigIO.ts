import * as THREE from 'three'

/**
 * Per-frame values shared between the HTML layer and the scene without React
 * re-renders. Written by the hero's drag surface and by the rig; read in
 * useFrame callbacks.
 */
export const rigInput = {
  /** Extra spin, degrees per second; decays on its own. */
  spinVelocity: 0,
  /** Pointer in normalised device coordinates (-1…1), or null when not over the page. */
  pointer: null as null | { x: number; y: number },
}

export const rigOutput = {
  /** Baton centre and sensor-head tip, in world space. */
  center: new THREE.Vector3(),
  head: new THREE.Vector3(),
  scale: 1,
  dots: 0,
  cones: 0,
}
