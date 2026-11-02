'use client'

import { PerformanceMonitor } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'
import { useLight } from '@/lib/store'
import { Lighting } from './Lighting'
import { BatonRig } from './rig/BatonRig'
import { DotField } from './scenes/DotField'
import { SensingCones } from './scenes/SensingCones'

/** Marks the scene ready after its first frames, so the loader can finish. */
function ReadySignal() {
  const frames = useRef(0)
  useFrame(() => {
    frames.current++
    if (frames.current === 3) useLight.getState().set({ sceneReady: true })
  })
  return null
}

/**
 * The single persistent canvas (docs/05 §4.1). It lives in the root layout, so
 * the baton survives page changes. Decorative: aria-hidden on its wrapper.
 */
export default function SceneCanvas() {
  const tier = useLight((s) => s.tier)
  const dialogOpen = useLight((s) => s.dialogOpen)
  const poster = useLight((s) => s.poster)

  return (
    <Canvas
      dpr={tier === 'lite' ? 1 : [1, 1.75]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance', preserveDrawingBuffer: Boolean(poster) }}
      camera={{ fov: 30, position: [0, 0, 0.62], near: 0.01, far: 10 }}
      frameloop={dialogOpen ? 'never' : 'always'}
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 0)
        gl.toneMapping = THREE.AgXToneMapping
        gl.toneMappingExposure = 1.35
        gl.domElement.addEventListener('webglcontextlost', (e) => {
          e.preventDefault()
          useLight.getState().set({ tier: 'static' })
        })
      }}
    >
      <Lighting />
      <DotField />
      <SensingCones />
      <BatonRig />
      <ReadySignal />
      {tier === 'full' && !poster && (
        <PerformanceMonitor flipflops={2} onDecline={() => useLight.getState().set({ tier: 'lite' })} />
      )}
    </Canvas>
  )
}
