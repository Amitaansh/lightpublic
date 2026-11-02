import type { LightState } from '@/lib/store'
import { insideExplode } from '../baton/dimensions'

/**
 * Baton choreography (docs/04 §4): one keyframe per chapter. The rig blends
 * between keyframes across chapter boundaries and follows them on a damped
 * spring.
 *
 * Stage coordinates: x, y in -1…1 across the viewport. tilt = degrees the end
 * cap leans right of vertical; pitch = degrees the end cap turns toward the
 * camera; spin = degrees about the long axis (0 = buttons facing the camera).
 */
export type RingMode = 'breathe' | 'steady' | 'off'

export type Keyframe = {
  pos: [number, number]
  tilt: number
  pitch: number
  spin: number
  /** Idle spin, degrees per second. */
  spinRate: number
  scale: number
  /** Cane opacity, 0–1. */
  cane: number
  /** How far the cane has slid on, 0–1 (1 = clipped on). */
  caneEnter: number
  explode: number
  xray: number
  /** X-ray of the grip and cap only (end-on haptics view). */
  xrayGrip: number
  ring: RingMode
  /** Dot-field halo strength. */
  dots: number
  /** Sensing cones (chapter 02). */
  cones: number
}

const base: Keyframe = {
  pos: [0, 0],
  tilt: 12,
  pitch: 0,
  spin: 0,
  spinRate: 0,
  scale: 1,
  cane: 0,
  caneEnter: 0,
  explode: 0,
  xray: 0,
  xrayGrip: 0,
  ring: 'steady',
  dots: 0,
  cones: 0,
}

const k = (p: Partial<Keyframe>): Keyframe => ({ ...base, ...p })

export const KEYFRAMES: Record<string, Keyframe> = {
  hero: k({ pos: [0, 0.02], tilt: 12, spinRate: 7, scale: 1, ring: 'breathe', dots: 1 }),
  'what-it-adds': k({ pos: [0.3, 0.02], tilt: -55, spin: 360, scale: 0.82, cones: 1 }),
  cane: k({ pos: [0.42, -0.02], tilt: -55, spin: 360, scale: 0.8, cane: 1, caneEnter: 1, dots: 0.35 }),
  reliability: k({ pos: [-0.46, 0.08], tilt: 55, spin: 385, scale: 0.95, cane: 1, caneEnter: 1, xray: 1 }),
  'guide-notes': k({ pos: [-0.62, -0.42], tilt: 55, spin: 360, scale: 0.5, cane: 1, caneEnter: 1, ring: 'breathe' }),
  'route-memory': k({ pos: [0.5, 0.45], tilt: -60, spin: 375, scale: 0.55, cane: 1, caneEnter: 1, ring: 'breathe' }),
  haptics: k({ pos: [0.46, 0.04], tilt: -14, pitch: 72, spin: 360, scale: 1.2, xray: 1, xrayGrip: 1 }),
  stop: k({ pos: [0.46, 0.04], tilt: -14, pitch: 72, spin: 360, scale: 1.2, xray: 1, xrayGrip: 1 }),
  inside: k({ pos: [0, 0.02], tilt: 90, spin: 380, scale: 0.8, xray: 0.2 }),
  mockups: k({ pos: [-0.56, -0.05], tilt: 16, spin: 360, spinRate: 10, scale: 0.5, ring: 'breathe' }),
  prototype: k({ pos: [0.44, 0.05], tilt: 70, spin: 360, scale: 0.72 }),
  why: k({ pos: [0.8, 0.62], tilt: 15, spin: 360, spinRate: 8, scale: 0.34, ring: 'breathe' }),
  timeline: k({ pos: [0.62, 0.5], tilt: 0, spin: 360, spinRate: 6, scale: 0.42, ring: 'breathe' }),
  'contact-cta': k({ pos: [0, 0.04], tilt: 12, spin: 360, spinRate: 7, scale: 0.95, dots: 1 }),
  about: k({ pos: [0.56, 0.04], tilt: 18, spinRate: 6, scale: 0.78, ring: 'breathe', dots: 0.6 }),
  contact: k({ pos: [0.56, 0], tilt: 18, spinRate: 6, scale: 0.8, ring: 'breathe', dots: 0.6 }),
  other: k({ pos: [0.56, 0], tilt: 18, spinRate: 6, scale: 0.8, ring: 'breathe' }),
}

const clamp01 = (x: number) => Math.min(1, Math.max(0, x))
const smooth = (a: number, b: number, x: number) => {
  const t = clamp01((x - a) / (b - a))
  return t * t * (3 - 2 * t)
}

/** Chapter-specific motion that depends on scroll progress or interaction. */
export function resolveKeyframe(key: string, s: LightState, mobile: boolean): Keyframe {
  const kf = { ...(KEYFRAMES[key] ?? KEYFRAMES.other) }
  kf.pos = [...kf.pos] as [number, number]

  if (key === 'cane') {
    const p = s.pin.cane ?? 0
    kf.caneEnter = smooth(0.08, 0.6, p)
    const out = smooth(0.62, 0.95, p)
    kf.pos = [0.2 + 0.06 * out, -0.02 + 0.1 * out]
    kf.scale = 0.9 - 0.16 * out
  }
  if (key === 'inside') {
    kf.explode = insideExplode(s.pin.inside ?? 0)
  }
  if (key === 'timeline') {
    kf.pos = [0.62, 0.5 - 1.05 * clamp01(s.progress.timeline ?? 0)]
  }
  if (key === 'reliability' && s.ladderLevel === 4) {
    kf.ring = 'off'
  }

  if (mobile) {
    if (key === 'inside') {
      kf.pos = [0, 0.5]
      kf.scale *= 0.42
    } else if (key === 'mockups') {
      // docked to the gallery card instead
    } else {
      kf.pos = [0, 0.5]
      kf.scale *= 0.55
    }
  }
  return kf
}

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t

export function mixKeyframes(a: Keyframe, b: Keyframe, t: number): Keyframe {
  if (t <= 0) return a
  if (t >= 1) return b
  return {
    pos: [lerp(a.pos[0], b.pos[0], t), lerp(a.pos[1], b.pos[1], t)],
    tilt: lerp(a.tilt, b.tilt, t),
    pitch: lerp(a.pitch, b.pitch, t),
    spin: lerp(a.spin, b.spin, t),
    spinRate: lerp(a.spinRate, b.spinRate, t),
    scale: lerp(a.scale, b.scale, t),
    cane: lerp(a.cane, b.cane, t),
    caneEnter: lerp(a.caneEnter, b.caneEnter, t),
    explode: lerp(a.explode, b.explode, t),
    xray: lerp(a.xray, b.xray, t),
    xrayGrip: lerp(a.xrayGrip, b.xrayGrip, t),
    ring: t < 0.5 ? a.ring : b.ring,
    dots: lerp(a.dots, b.dots, t),
    cones: lerp(a.cones, b.cones, t),
  }
}

/**
 * Poster states for the static tier and the gallery renders
 * (scripts/render-posters.mjs). Each is a keyframe centred in a square frame.
 */
export const POSTERS: Record<string, { key: string; patch?: Partial<Keyframe>; state?: Partial<LightState> }> = {
  hero: { key: 'hero', patch: { pos: [0, 0], scale: 1.25, dots: 0 } },
  'what-it-adds': { key: 'what-it-adds', patch: { pos: [-0.35, 0.05], scale: 1.0 } },
  cane: { key: 'cane', patch: { pos: [0, 0.15], scale: 1.05, caneEnter: 1, dots: 0 } },
  'reliability-0': { key: 'reliability', patch: { pos: [0, 0.12], scale: 1.15 }, state: { ladderLevel: 0 } },
  'reliability-1': { key: 'reliability', patch: { pos: [0, 0.12], scale: 1.15 }, state: { ladderLevel: 1 } },
  'reliability-2': { key: 'reliability', patch: { pos: [0, 0.12], scale: 1.15 }, state: { ladderLevel: 2 } },
  'reliability-3': { key: 'reliability', patch: { pos: [0, 0.12], scale: 1.15 }, state: { ladderLevel: 3 } },
  'reliability-4': { key: 'reliability', patch: { pos: [0, 0.12], scale: 1.15, ring: 'off' }, state: { ladderLevel: 4 } },
  'guide-notes': { key: 'guide-notes', patch: { pos: [0, 0.15], scale: 1.05 } },
  'route-memory': { key: 'route-memory', patch: { pos: [0, 0.15], scale: 1.05 } },
  haptics: { key: 'haptics', patch: { pos: [0, 0], scale: 1.9 }, state: { obstacles: [{ angle: 315, distance: 0.2, label: 'Pole' }] } },
  stop: { key: 'stop', patch: { pos: [0, 0], scale: 1.9 }, state: { stopActive: true } },
  inside: { key: 'inside', patch: { pos: [0, 0], scale: 0.72, explode: 1, xray: 0.2 } },
  mockups: { key: 'mockups', patch: { pos: [0, 0], scale: 1.25, spinRate: 0, spin: 380 } },
  prototype: { key: 'prototype', patch: { pos: [0, 0], scale: 1.0 } },
  why: { key: 'why', patch: { pos: [0, 0], scale: 1.25, spinRate: 0, dots: 0 } },
  timeline: { key: 'timeline', patch: { pos: [0, 0], scale: 1.25, spinRate: 0 } },
  'contact-cta': { key: 'contact-cta', patch: { pos: [0, 0], scale: 1.25, spinRate: 0, dots: 0 } },
  about: { key: 'about', patch: { pos: [0, 0], scale: 1.25, spinRate: 0, dots: 0 } },
  // Gallery renders (portrait 4:5).
  'gallery-exploded': { key: 'inside', patch: { pos: [0, 0], tilt: 32, spin: 24, scale: 0.86, explode: 1, xray: 0.25, ring: 'steady' } },
  'gallery-grip': {
    key: 'haptics',
    patch: { pos: [0, 0], scale: 2.1, xrayGrip: 1 },
    state: { obstacles: [{ angle: 315, distance: 0.2, label: 'Pole' }, { angle: 90, distance: 0.5, label: 'Person' }] },
  },
}
