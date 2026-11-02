/**
 * Procedural baton spec (docs/05 §4.4). Units: metres. The long axis is local
 * Y, centred on the baton's midpoint: the sensor-head tip is at y = -0.1 and
 * the end cap at y = +0.1 (200 mm × Ø 38 mm, PRD-NF-004). Buttons face +Z;
 * the cane clip is on the underside (-Z).
 *
 * [ASSUMPTION] Proportions read off assets/device/Vertical L.I.G.H.T. Baton and Cane.png.
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
export const GRIP_CENTER_Y = 0.053

/** The cane runs parallel to the baton, under it. */
export const CANE_Z = -0.0278
export const CANE_R = 0.006

export type GroupId = 'head' | 'ring' | 'body' | 'grip' | 'cap'

/** Shell parts: where each goes when the baton is exploded (offset at explode = 1). */
export const SHELL: Record<string, { group: GroupId; offset: [number, number, number]; stagger: number }> = {
  'head.lens': { group: 'head', offset: [0, -0.12, 0], stagger: 0 },
  'head.shell': { group: 'head', offset: [0, -0.095, 0], stagger: 1 },
  ring: { group: 'ring', offset: [0, -0.036, 0], stagger: 4 },
  'body.buttons': { group: 'body', offset: [0, 0, 0.03], stagger: 5 },
  clip: { group: 'body', offset: [0, 0, -0.06], stagger: 5 },
  'body.shell': { group: 'body', offset: [0, 0, 0], stagger: 6 },
  'grip.shell': { group: 'grip', offset: [0, 0.088, 0], stagger: 9 },
  cap: { group: 'cap', offset: [0, 0.135, 0], stagger: 11 },
}
