'use client'

import { create } from 'zustand'

export type Tier = 'full' | 'lite' | 'static'
export type Theme = 'white' | 'blue' | 'signal'
export type PageKey = 'home' | 'about' | 'contact' | 'other' | 'poster'
export type Obstacle = { angle: number; distance: number; label: string }
export type RingKind = 'swell' | 'double' | 'ignite' | 'stop'
export type Rect = { x: number; y: number; w: number; h: number }

/** Shared state between the HTML chapters and the 3D scene (docs/05 §8). */
export interface LightState {
  motion: 'on' | 'off'
  tier: Tier | null
  sceneReady: boolean
  loaderDone: boolean
  page: PageKey
  /** Chapter under the viewport's focus line, and the keyframe blend the rig should show. */
  chapterKey: string
  chapterN: number
  blend: { from: string; to: string; t: number }
  /** Scroll progress (0–1) through each chapter, and through the pinned part of pinned chapters. */
  progress: Record<string, number>
  pin: Record<string, number>
  themeOverride: Theme | null
  /** How far the footer has scrolled into view (viewport heights); the baton lifts with it. */
  footerLift: number
  /** Hero: spin velocity added by drag or the rotate buttons (deg/s). */
  spinVelocity: number
  activeCone: number
  ladderLevel: number
  notePlaying: boolean
  obstacles: Obstacle[]
  stopActive: boolean
  focusGroup: string | null
  dockRect: Rect | null
  ring: { kind: RingKind; at: number } | null
  dialogOpen: boolean
  poster: string | null
  set: (partial: Partial<LightState>) => void
  pulseRing: (kind: RingKind) => void
  addSpin: (degPerSecond: number) => void
}

export const useLight = create<LightState>((set) => ({
  motion: 'on',
  tier: null,
  sceneReady: false,
  loaderDone: false,
  page: 'home',
  chapterKey: 'hero',
  chapterN: 1,
  blend: { from: 'hero', to: 'hero', t: 0 },
  progress: {},
  pin: {},
  themeOverride: null,
  footerLift: 0,
  spinVelocity: 0,
  activeCone: 0,
  ladderLevel: 0,
  notePlaying: false,
  obstacles: [{ angle: 315, distance: 0.2, label: 'Pole' }],
  stopActive: false,
  focusGroup: null,
  dockRect: null,
  ring: null,
  dialogOpen: false,
  poster: null,
  set: (partial) => set(partial),
  pulseRing: (kind) => set({ ring: { kind, at: performance.now() } }),
  addSpin: (v) => set((s) => ({ spinVelocity: s.spinVelocity + v })),
}))
