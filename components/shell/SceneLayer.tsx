'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import { useLight, type Tier } from '@/lib/store'

const SceneCanvas = dynamic(() => import('@/three/SceneCanvas'), { ssr: false })

function detectTier(motion: 'on' | 'off', poster: boolean): Tier {
  if (poster) return 'full'
  if (motion === 'off') return 'static'
  try {
    const c = document.createElement('canvas')
    if (!c.getContext('webgl2')) return 'static'
  } catch {
    return 'static'
  }
  const nav = navigator as Navigator & { deviceMemory?: number }
  const lowSpec = (nav.hardwareConcurrency ?? 8) <= 4 || (nav.deviceMemory ?? 8) <= 4
  if (window.innerWidth < 900 || lowSpec) return 'lite'
  return 'full'
}

/**
 * Chooses the quality tier (brief §10.2) and mounts the 3D canvas after the
 * first paint, so the text never waits for WebGL.
 */
export function SceneLayer() {
  const motion = useLight((s) => s.motion)
  const tier = useLight((s) => s.tier)
  const poster = useLight((s) => s.poster)
  const [idle, setIdle] = useState(false)

  useEffect(() => {
    const current = useLight.getState().tier
    const forced = new URLSearchParams(window.location.search).get('tier') as Tier | null
    const next = forced ?? detectTier(motion, poster !== null)
    // Never step back up within a session once performance has dropped a tier.
    if (current === 'lite' && next === 'full') return
    useLight.getState().set({ tier: next })
  }, [motion, poster])

  useEffect(() => {
    const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number }
    if (w.requestIdleCallback) w.requestIdleCallback(() => setIdle(true), { timeout: 600 })
    else setTimeout(() => setIdle(true), 200)
  }, [])

  if (!idle || !tier || tier === 'static') return null
  return (
    <div className="scene-layer" aria-hidden="true">
      <SceneCanvas />
    </div>
  )
}
