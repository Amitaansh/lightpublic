/**
 * Procedural baton spec (docs/05 §4.4). Units: metres. The long axis is local
 * Y, centred on the baton's midpoint: the sensor-head tip is at y = -0.1 and the
 * end cap at y = +0.1 (200 mm × Ø 38 mm, PRD-NF-004). Buttons face +Z; the
 * cane clip is on the underside (-Z).
 *
 * [ASSUMPTION] Proportions were read off
 * assets/device/Vertical L.I.G.H.T. Baton and Cane.png; tune them against it.
 */
export const R = 0.019
export const LENGTH = 0.2

export const Y = {
  tip: -0.1,
  headTop: -0.0425,
  ringTop: -0.0395,
  bodyTop: 0.018,
  gripTop: 0.088,
  cap: 0.1,
} as const

export const GRIP_WAIST = 0.0172

/** The cane runs parallel to the baton, under it. */
export const CANE_Z = -0.0278
export const CANE_R = 0.006

export type GroupId = 'head' | 'ring' | 'body' | 'grip' | 'cap'

export type InternalId =
  | 'tof'
  | 'ultrasonic'
  | 'camera'
  | 'nir'
  | 'mics'
  | 'mainBoard'
  | 'safetyCore'
  | 'imuGnss'
  | 'actuators'
  | 'battery'
  | 'batteryReserve'
  | 'storage'
  | 'coil'

/** Where each part goes when the baton is exploded (offset at explode = 1). */
export const EXPLODE: Record<string, [number, number, number]> = {
  'head.shell': [0, -0.085, 0],
  'head.lens': [0, -0.115, 0],
  ring: [0, -0.035, 0],
  'body.shell': [0, 0, 0],
  'body.buttons': [0, 0, 0.026],
  clip: [0, 0, -0.035],
  'grip.shell': [0, 0.085, 0],
  cap: [0, 0.13, 0],
  // internals
  tof: [0, -0.05, 0],
  ultrasonic: [0, -0.062, 0],
  camera: [0, -0.07, 0],
  nir: [0, -0.07, 0],
  mics: [0, -0.052, 0],
  mainBoard: [0, 0, 0.05],
  safetyCore: [0, 0, -0.05],
  imuGnss: [0.03, 0.004, 0.03],
  actuators: [0, 0.042, 0],
  battery: [0, 0.042, 0],
  batteryReserve: [0, 0.052, 0],
  storage: [-0.03, 0.02, 0.02],
  coil: [0, 0.112, 0],
}

/** Explode order, from the head outwards; each step starts a little later. */
export const STAGGER: Record<string, number> = {
  'head.lens': 0,
  'head.shell': 1,
  camera: 2,
  nir: 2,
  ultrasonic: 2,
  tof: 3,
  mics: 3,
  ring: 4,
  'body.buttons': 5,
  clip: 5,
  mainBoard: 6,
  safetyCore: 6,
  imuGnss: 6,
  'body.shell': 6,
  storage: 7,
  actuators: 7,
  battery: 8,
  batteryReserve: 8,
  'grip.shell': 9,
  coil: 10,
  cap: 10,
}

export const PART_GROUP: Record<string, GroupId> = {
  'head.shell': 'head',
  'head.lens': 'head',
  tof: 'head',
  ultrasonic: 'head',
  camera: 'head',
  nir: 'head',
  mics: 'head',
  ring: 'ring',
  'body.shell': 'body',
  'body.buttons': 'body',
  clip: 'body',
  mainBoard: 'body',
  safetyCore: 'body',
  imuGnss: 'body',
  'grip.shell': 'grip',
  actuators: 'grip',
  battery: 'grip',
  batteryReserve: 'grip',
  storage: 'grip',
  cap: 'cap',
  coil: 'cap',
}

/**
 * Fallback-ladder levels (PRD §6.2): which internals stay lit. Index = level.
 * `null` = everything lit.
 */
export const LADDER_LIT: (InternalId[] | null)[] = [
  null,
  ['tof', 'ultrasonic', 'mics', 'mainBoard', 'safetyCore', 'actuators', 'battery', 'batteryReserve', 'storage', 'coil'],
  ['tof', 'ultrasonic', 'mainBoard', 'safetyCore', 'imuGnss', 'actuators', 'battery', 'batteryReserve', 'storage', 'coil'],
  ['ultrasonic', 'safetyCore', 'actuators', 'batteryReserve'],
  [],
]

/** Parts drawn in the signal colour at each ladder level. */
export const LADDER_SIGNAL: InternalId[][] = [[], [], [], ['safetyCore'], []]

/** Inside chapter: which group is shown while scrolling, if the visitor hasn't picked one. */
export function autoInsideGroup(p: number): GroupId | null {
  if (p < 0.34 || p > 0.8) return null
  if (p < 0.44) return 'head'
  if (p < 0.51) return 'ring'
  if (p < 0.61) return 'body'
  if (p < 0.71) return 'grip'
  return 'cap'
}

export function insideExplode(p: number): number {
  const s = (a: number, b: number, x: number) => {
    const t = Math.min(1, Math.max(0, (x - a) / (b - a)))
    return t * t * (3 - 2 * t)
  }
  return s(0.06, 0.3, p) * (1 - s(0.82, 0.96, p))
}
