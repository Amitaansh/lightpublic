'use client'

import { create } from 'zustand'

export type Tier = 'full' | 'lite' | 'static'
export type PageKey = 'home' | 'about' | 'contact' | 'other' | 'poster'
export type RingKind = 'swell' | 'double' | 'ignite' | 'stop'

/** Shared state between the HTML layer and the 3D scene. */
export interface LightState {
  motion: 'on' | 'off'
  tier: Tier | null
  sceneReady: boolean
  loaderDone: boolean
  page: PageKey
  /** Current scene on the home page (for the progress bar and static posters). */
  sceneId: string
  /** Room lights switched off by the visitor (click the baton or the Lights button). */
  lightsOut: boolean
  ring: { kind: RingKind; at: number } | null
  dialogOpen: boolean
  /** Poster rendering: film position to freeze at (scripts/render-posters.mjs). */
  poster: number | null
  set: (partial: Partial<LightState>) => void
  pulseRing: (kind: RingKind) => void
  toggleLights: () => void
}

export const useLight = create<LightState>((set) => ({
  motion: 'on',
  tier: null,
  sceneReady: false,
  loaderDone: false,
  page: 'home',
  sceneId: 'title',
  lightsOut: false,
  ring: null,
  dialogOpen: false,
  poster: null,
  set: (partial) => set(partial),
  pulseRing: (kind) => set({ ring: { kind, at: performance.now() } }),
  toggleLights: () => set((s) => ({ lightsOut: !s.lightsOut, ring: { kind: 'swell', at: performance.now() } })),
}))

/**
 * Film position, written on scroll and read every frame by the 3D director.
 * Kept outside React so scrolling never re-renders components.
 */
export const film = {
  /** Target position in film units (see content/film.ts). */
  target: 0,
  /** Set when the position should be applied without smoothing (jumps, posters). */
  snap: true,
}
