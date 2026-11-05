'use client'

import { PerformanceMonitor } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { Suspense, useRef } from 'react'
import * as THREE from 'three'
import { useLight } from '@/lib/store'
import { Effects } from './Effects'
import { Director } from './film/Director'
import { Stage } from './Stage'
import { Dust } from './scenes/Dust'
import { HapticHalo } from './scenes/HapticHalo'
import { Obstacles } from './scenes/Obstacles'
import { Route } from './scenes/Route'
import { StopFx } from './scenes/StopFx'

/** Marks the scene ready after its first frames (hand model loaded), so the loader can finish. */
function ReadySignal() {
  const frames = useRef(0)
  useFrame(() => {
    frames.current++
    if (frames.current === 4) useLight.getState().set({ sceneReady: true })
  })
  return null
}

/**
 * The single persistent canvas. Opaque (it paints the charcoal room itself),
 * fixed behind the page, decorative: aria-hidden on its wrapper.
 */
export default function SceneCanvas() {
  const tier = useLight((s) => s.tier) ?? 'lite'
  const dialogOpen = useLight((s) => s.dialogOpen)
  const poster = useLight((s) => s.poster)

  return (
    <Canvas
      shadows={tier === 'full' ? 'soft' : false}
      dpr={tier === 'lite' ? [1, 1.25] : [1, 1.6]}
      gl={{ antialias: false, alpha: false, powerPreference: 'high-performance', preserveDrawingBuffer: poster !== null }}
      camera={{ fov: 30, near: 0.01, far: 20, position: [0, 0.012, 0.66] }}
      frameloop={dialogOpen ? 'never' : 'always'}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.NoToneMapping
        gl.domElement.addEventListener('webglcontextlost', (e) => {
          e.preventDefault()
          useLight.getState().set({ tier: 'static' })
        })
      }}
    >
      <Suspense fallback={null}>
        <Stage tier={tier} />
        <Director />
        <HapticHalo />
        <Obstacles tier={tier} />
        <Route />
        <StopFx />
        <Dust tier={tier} />
        <Effects tier={tier} />
        <ReadySignal />
      </Suspense>
      {tier === 'full' && poster === null && <PerformanceMonitor flipflops={2} onDecline={() => useLight.getState().set({ tier: 'lite' })} />}
    </Canvas>
  )
}
