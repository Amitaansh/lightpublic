import { FILM_LENGTH, scenes, sceneStart, type SceneId } from '@/content/film'

/**
 * The film, as a pure function of scroll position: frame(T) returns where
 * everything is. Each scene's first frame equals the previous scene's last,
 * so the cuts are seamless. World units are metres; the baton is 0.2 m long.
 *
 * Baton orientation: tilt = degrees the end cap leans right of vertical,
 * pitch = degrees the end cap turns toward the camera, spin = degrees about
 * the long axis (0 = buttons toward the camera; -90 = buttons up when the
 * baton is held pointing forward).
 */
export type V3 = [number, number, number]

export type Frame = {
  scene: SceneId
  u: number
  cam: V3
  target: V3
  fov: number
  /** Depth-of-field focus point and strength (0..1). */
  focus: V3
  dof: number
  baton: { pos: V3; tilt: number; pitch: number; spin: number; explode: number; tremble: number; fallback: number; buttons: number; blueprint: number }
  hand: { show: number; approach: number; grip: number; reach: number }
  cane: { show: number; enter: number }
  /** Vibration demo: obstacles visible (their timing lives in world.ts). */
  obstacles: { show: number }
  route: { show: number; travel: number }
  /** STOP: the fast object's crossing (0..1) and the shockwave (0..1). */
  streak: number
  shock: number
  lightsOut: number
  ringBoost: number
  titleOpen: number
  titleClose: number
  dust: number
  shadowFloor: number
}

/* ---------------------------------------------------------------- helpers */

const clamp01 = (x: number) => Math.min(1, Math.max(0, x))
/** Smootherstep: zero velocity and acceleration at both ends. */
const ease = (t: number) => {
  const x = clamp01(t)
  return x * x * x * (x * (x * 6 - 15) + 10)
}
const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const lerpV = (a: V3, b: V3, t: number): V3 => [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)]

/** Piecewise animation through keyed values, eased between keys. */
function k(u: number, keys: [number, number][]): number {
  if (u <= keys[0][0]) return keys[0][1]
  for (let i = 1; i < keys.length; i++) {
    if (u <= keys[i][0]) {
      const [u0, v0] = keys[i - 1]
      const [u1, v1] = keys[i]
      return lerp(v0, v1, ease((u - u0) / (u1 - u0)))
    }
  }
  return keys[keys.length - 1][1]
}
function kv(u: number, keys: [number, V3][]): V3 {
  if (u <= keys[0][0]) return keys[0][1]
  for (let i = 1; i < keys.length; i++) {
    if (u <= keys[i][0]) {
      const [u0, v0] = keys[i - 1]
      const [u1, v1] = keys[i]
      return lerpV(v0, v1, ease((u - u0) / (u1 - u0)))
    }
  }
  return keys[keys.length - 1][1]
}
/** 0 → 1 → 0 bump between a and d, flat between b and c. */
const bump = (u: number, a: number, b: number, c: number, d: number) => (u < b ? ease((u - a) / (b - a)) : 1 - ease((u - c) / (d - c)))

/* ---------------------------------------------------------- shared poses */

const ORIGIN: V3 = [0, 0, 0]
const CAM_WIDE: V3 = [0, 0.012, 0.62]
/** Held, pointing forward (world -X), head down 20°, buttons up. */
const HELD = { tilt: 70, spin: -90 }
/** On the cane: the cane's usual angle, about 35° below horizontal. */
const ON_CANE = { tilt: 55, spin: -90 }

const base = (scene: SceneId, u: number): Frame => ({
  scene,
  u,
  cam: CAM_WIDE,
  target: ORIGIN,
  fov: 30,
  focus: ORIGIN,
  dof: 0.25,
  baton: { pos: ORIGIN, tilt: 12, pitch: 0, spin: 0, explode: 0, tremble: 0, fallback: 0, buttons: 0, blueprint: 0 },
  hand: { show: 0, approach: 1, grip: 0, reach: 0 },
  cane: { show: 0, enter: 0 },
  obstacles: { show: 0 },
  route: { show: 0, travel: 0 },
  streak: 0,
  shock: 0,
  lightsOut: 0,
  ringBoost: 0,
  titleOpen: 0,
  titleClose: 0,
  dust: 0,
  shadowFloor: 1,
})

/* ---------------------------------------------------------------- scenes */

const SHOTS: Record<SceneId, (u: number) => Frame> = {
  // Floating in the dark; the wordmark title card; a slow push in.
  title: (u) => {
    const f = base('title', u)
    f.cam = kv(u, [
      [0, [0, 0.012, 0.66]],
      [1, [0, 0.01, 0.5]],
    ])
    f.baton.tilt = k(u, [
      [0, 12],
      [1, 4],
    ])
    f.baton.spin = k(u, [
      [0, 0],
      [1, -10],
    ])
    f.titleOpen = k(u, [
      [0, 1],
      [0.45, 1],
      [0.8, 0],
    ])
    f.dust = 1
    f.focus = [0, 0, 0.012]
    return f
  },

  // Macro passes: the dimpled grip, the buttons and ring, the sensor head.
  macro: (u) => {
    const f = base('macro', u)
    f.baton.tilt = k(u, [
      [0, 4],
      [0.15, 0],
    ])
    f.baton.spin = k(u, [
      [0, -10],
      [0.3, 28],
      [0.6, 36],
      [1, 0],
    ])
    f.cam = kv(u, [
      [0, [0, 0.01, 0.5]],
      [0.22, [0.06, 0.085, 0.105]],
      [0.42, [0.055, -0.004, 0.092]],
      [0.55, [0.075, -0.03, 0.088]],
      [0.78, [0.05, -0.14, 0.07]],
      [1, [0.03, 0.04, 0.56]],
    ])
    f.target = kv(u, [
      [0, [0, 0, 0]],
      [0.22, [0, 0.06, 0]],
      [0.42, [0, -0.014, 0]],
      [0.55, [0, -0.034, 0]],
      [0.78, [0, -0.085, 0]],
      [1, [0, 0, 0]],
    ])
    f.fov = k(u, [
      [0, 30],
      [0.22, 24],
      [0.78, 24],
      [1, 30],
    ])
    f.focus = kv(u, [
      [0, [0, 0, 0.012]],
      [0.22, [0.008, 0.07, 0.016]],
      [0.42, [0.008, -0.013, 0.017]],
      [0.55, [0.01, -0.038, 0.016]],
      [0.78, [0.006, -0.09, 0.016]],
      [1, [0, 0, 0]],
    ])
    f.dof = k(u, [
      [0, 0.25],
      [0.15, 1],
      [0.85, 1],
      [1, 0.3],
    ])
    f.dust = k(u, [
      [0, 1],
      [0.2, 0.3],
    ])
    return f
  },

  // The baton turns to point forward; a hand reaches in and closes around the grip.
  hand: (u) => {
    const f = base('hand', u)
    f.cam = kv(u, [
      [0, [0.03, 0.04, 0.56]],
      [0.6, [0.02, 0.06, 0.5]],
      [1, [0.06, 0.07, 0.42]],
    ])
    f.target = kv(u, [
      [0, [0, 0, 0]],
      [1, [0.01, 0, 0]],
    ])
    f.baton.tilt = k(u, [
      [0, 0],
      [0.35, HELD.tilt],
    ])
    f.baton.spin = k(u, [
      [0, 0],
      [0.35, HELD.spin],
    ])
    f.hand.show = k(u, [
      [0.15, 0],
      [0.35, 1],
    ])
    f.hand.approach = k(u, [
      [0.15, 1],
      [0.62, 0],
    ])
    f.hand.reach = k(u, [
      [0.15, 1],
      [0.55, 1],
      [0.75, 0],
    ])
    f.hand.grip = k(u, [
      [0.55, 0],
      [0.85, 1],
    ])
    f.baton.pos = kv(u, [
      [0.75, [0, 0, 0]],
      [1, [0, 0.012, 0]],
    ])
    f.focus = [0.03, 0.01, 0.02]
    f.dof = 0.45
    return f
  },

  // How to hold it: the camera circles the hand; the buttons glow under the thumb.
  hold: (u) => {
    const f = base('hold', u)
    f.baton.tilt = HELD.tilt
    f.baton.spin = HELD.spin
    f.baton.pos = [0, 0.012 + Math.sin(u * Math.PI * 2) * 0.004, 0]
    f.hand = { show: 1, approach: 0, grip: 1, reach: 0 }
    f.cam = kv(u, [
      [0, [0.06, 0.07, 0.42]],
      [0.35, [-0.07, 0.17, 0.2]],
      [0.7, [0.02, -0.13, 0.27]],
      [1, [0.12, 0.08, 0.5]],
    ])
    f.target = kv(u, [
      [0, [0.01, 0, 0]],
      [0.35, [-0.02, 0.02, 0]],
      [0.7, [0.01, 0, 0]],
      [1, [0, 0, 0]],
    ])
    f.baton.buttons = bump(u, 0.2, 0.35, 0.55, 0.7)
    f.focus = kv(u, [
      [0, [0.02, 0.02, 0.02]],
      [0.35, [-0.02, 0.03, 0.0]],
      [1, [0.01, 0.01, 0.0]],
    ])
    f.dof = 0.55
    return f
  },

  // A cane slides in under the baton; the clip snaps shut; the ring confirms.
  clip: (u) => {
    const f = base('clip', u)
    f.baton.tilt = k(u, [
      [0, HELD.tilt],
      [0.7, ON_CANE.tilt],
    ])
    f.baton.spin = HELD.spin
    f.baton.pos = [0, 0.012, 0]
    f.hand = {
      show: 1,
      approach: 0,
      grip: k(u, [
        [0, 1],
        [0.15, 0.78],
        [0.62, 0.78],
        [0.75, 1],
      ]),
      reach: 0,
    }
    f.cane.show = k(u, [
      [0.05, 0],
      [0.2, 1],
    ])
    f.cane.enter = k(u, [
      [0.1, 0],
      [0.6, 1],
    ])
    f.ringBoost = bump(u, 0.58, 0.62, 0.66, 0.78)
    f.cam = kv(u, [
      [0, [0.12, 0.08, 0.5]],
      [0.55, [0.1, 0.02, 0.62]],
      [1, [0.28, 0.12, 1.35]],
    ])
    f.target = kv(u, [
      [0, [0, 0, 0]],
      [0.55, [-0.05, -0.02, 0]],
      [1, [-0.28, -0.18, 0]],
    ])
    f.focus = kv(u, [
      [0, [0, 0, 0]],
      [1, [-0.05, -0.02, 0]],
    ])
    f.dof = k(u, [
      [0, 0.5],
      [1, 0.2],
    ])
    return f
  },

  // Over the shoulder: obstacles approach and the grip answers, side by side.
  vibration: (u) => {
    const f = base('vibration', u)
    f.baton.tilt = ON_CANE.tilt
    f.baton.spin = ON_CANE.spin
    f.baton.pos = [0, 0.012, 0]
    f.hand = { show: 1, approach: 0, grip: 1, reach: 0 }
    f.cane = { show: 1, enter: 1 }
    // Up and behind the walker, so the sensed street fills the frame around the grip.
    f.cam = kv(u, [
      [0, [0.28, 0.12, 1.35]],
      [0.14, [1.25, 0.42, -0.2]],
      [0.9, [1.15, 0.4, -0.2]],
      [1, [0.64, 0.4, 0.3]],
    ])
    f.target = kv(u, [
      [0, [-0.28, -0.18, 0]],
      [0.14, [-1.6, 0.0, 0.0]],
      [0.9, [-1.6, -0.02, 0.0]],
      [1, [-1.1, -0.3, 0]],
    ])
    f.fov = k(u, [
      [0, 30],
      [0.14, 38],
    ])
    f.obstacles.show = k(u, [
      [0.1, 0],
      [0.18, 1],
      [0.92, 1],
      [1, 0],
    ])
    f.focus = [-0.05, -0.02, 0]
    f.dof = 0.3
    f.shadowFloor = 0
    return f
  },

  // A remembered route draws itself ahead; markers give early double pulses.
  route: (u) => {
    const f = base('route', u)
    f.baton.tilt = ON_CANE.tilt
    f.baton.spin = ON_CANE.spin
    f.baton.pos = [0, 0.012, 0]
    f.hand = { show: 1, approach: 0, grip: 1, reach: 0 }
    f.cane = { show: 1, enter: 1 }
    f.route.show = k(u, [
      [0, 0],
      [0.15, 1],
      [0.88, 1],
      [1, 0],
    ])
    f.route.travel = u
    f.cam = kv(u, [
      [0, [0.62, 0.4, 0.3]],
      [0.2, [0.9, 0.62, 0.55]],
      [0.85, [0.75, 0.5, 0.42]],
      [1, [0.45, 0.16, 0.62]],
    ])
    f.target = kv(u, [
      [0, [-1.1, -0.3, 0]],
      [0.2, [-1.3, -0.55, 0]],
      [0.85, [-1.2, -0.5, 0]],
      [1, [-0.35, -0.08, -0.05]],
    ])
    f.fov = k(u, [
      [0, 38],
      [1, 34],
    ])
    f.focus = [-0.3, -0.25, 0]
    f.dof = 0.2
    f.shadowFloor = 0
    return f
  },

  // Something fast: everything goes quiet, one strong pulse, a shockwave.
  stop: (u) => {
    const f = base('stop', u)
    f.baton.tilt = ON_CANE.tilt
    f.baton.spin = ON_CANE.spin
    f.baton.pos = [0, 0.012, 0]
    f.hand = { show: 1, approach: 0, grip: 1, reach: 0 }
    f.cane = { show: 1, enter: 1 }
    f.cam = kv(u, [
      [0, [0.45, 0.16, 0.62]],
      [1, [0.38, 0.12, 0.5]],
    ])
    f.target = [-0.35, -0.08, -0.05]
    f.fov = 34
    f.streak = k(u, [
      [0.2, 0],
      [0.6, 1],
    ])
    f.shock = k(u, [
      [0.42, 0],
      [0.85, 1],
    ])
    f.baton.tremble = bump(u, 0.42, 0.46, 0.55, 0.7)
    f.ringBoost = bump(u, 0.42, 0.46, 0.55, 0.75) * 2
    f.focus = [0, 0, 0]
    f.dof = 0.35
    f.shadowFloor = 0
    return f
  },

  // Released; turned side on; separated into its parts; systems power down; back together.
  inside: (u) => {
    const f = base('inside', u)
    f.hand = {
      show: k(u, [
        [0, 1],
        [0.12, 0],
      ]),
      approach: k(u, [
        [0.02, 0],
        [0.14, 1],
      ]),
      grip: k(u, [
        [0, 1],
        [0.08, 0],
      ]),
      reach: 0.5,
    }
    f.cane = {
      show: k(u, [
        [0.04, 1],
        [0.14, 0],
      ]),
      enter: k(u, [
        [0.02, 1],
        [0.14, 0.6],
      ]),
    }
    f.baton.tilt = k(u, [
      [0, ON_CANE.tilt],
      [0.16, 90],
      [0.88, 90],
      [1, 6],
    ])
    f.baton.spin = k(u, [
      [0, ON_CANE.spin],
      [0.16, -20],
      [0.6, 15],
      [0.88, 0],
      [1, -15],
    ])
    f.baton.pitch = k(u, [
      [0.16, 0],
      [0.3, 8],
      [0.85, 8],
      [0.95, 0],
    ])
    f.baton.pos = kv(u, [
      [0, [0, 0.012, 0]],
      [0.16, [0, 0, 0]],
    ])
    f.baton.explode = k(u, [
      [0.16, 0],
      [0.34, 1],
      [0.84, 1],
      [0.95, 0],
    ])
    // Blueprint: once it's apart, the parts turn into a labelled x-ray drawing,
    // then back to solid for the fallback ladder.
    f.baton.blueprint = k(u, [
      [0.27, 0],
      [0.36, 1],
      [0.63, 1],
      [0.69, 0],
    ])
    f.baton.fallback = k(u, [
      [0.68, 0],
      [0.82, 4],
      [0.86, 4],
      [0.92, 0],
    ])
    f.cam = kv(u, [
      [0, [0.38, 0.12, 0.5]],
      [0.16, [0, 0.03, 0.72]],
      [0.34, [0, 0.05, 1.0]],
      [0.42, [-0.26, 0.05, 0.36]],
      [0.62, [0.26, 0.05, 0.36]],
      [0.7, [0, 0.04, 0.98]],
      [0.95, [0, 0.03, 0.7]],
      [1, [0, 0.012, 0.62]],
    ])
    f.target = kv(u, [
      [0, [-0.35, -0.08, -0.05]],
      [0.16, [0, 0, 0]],
      [0.34, [0, 0, 0]],
      [0.42, [-0.2, 0, 0]],
      [0.62, [0.22, 0, 0]],
      [0.7, [0, 0, 0]],
    ])
    f.focus = kv(u, [
      [0.34, [0, 0, 0]],
      [0.42, [-0.2, 0, 0.01]],
      [0.62, [0.22, 0, 0.01]],
      [0.7, [0, 0, 0]],
    ])
    f.dof = k(u, [
      [0.3, 0.3],
      [0.4, 1],
      [0.64, 1],
      [0.7, 0.35],
    ])
    return f
  },

  // Lights out: the ring is the only light. Be your light.
  finale: (u) => {
    const f = base('finale', u)
    f.baton.tilt = k(u, [
      [0, 6],
      [1, 10],
    ])
    f.baton.spin = k(u, [
      [0, -15],
      [1, 30],
    ])
    f.baton.pos = kv(u, [
      [0, [0, 0, 0]],
      [1, [0, 0.025, 0]],
    ])
    f.cam = kv(u, [
      [0, [0, 0.012, 0.62]],
      [1, [0, 0.02, 0.54]],
    ])
    f.lightsOut = k(u, [
      [0.05, 0],
      [0.35, 1],
    ])
    f.titleClose = k(u, [
      [0.35, 0],
      [0.6, 1],
    ])
    f.dust = k(u, [
      [0.1, 0],
      [0.4, 1],
    ])
    f.focus = [0, 0.01, 0.012]
    return f
  },
}

/** Frame at film position T (0 … FILM_LENGTH). */
export function frameAt(T: number): Frame {
  const t = Math.min(Math.max(T, 0), FILM_LENGTH - 0.001)
  for (const s of scenes) {
    const start = sceneStart[s.id]
    if (t < start + s.len) return SHOTS[s.id]((t - start) / s.len)
  }
  return SHOTS.finale(1)
}
