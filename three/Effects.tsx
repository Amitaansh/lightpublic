'use client'

import { Bloom, DepthOfField, EffectComposer, Noise, ToneMapping, Vignette } from '@react-three/postprocessing'
import { useFrame } from '@react-three/fiber'
import { BlendFunction, ToneMappingMode, type DepthOfFieldEffect } from 'postprocessing'
import { useRef } from 'react'
import * as THREE from 'three'
import type { Tier } from '@/lib/store'
import { live } from './film/live'

const focus = new THREE.Vector3()

/**
 * The cinematic layer: depth of field with focus pulls, bloom on the cyan,
 * a vignette and fine grain, then AgX tone mapping. Lite tier keeps bloom,
 * vignette and tone mapping only.
 */
export function Effects({ tier }: { tier: Tier }) {
  const dof = useRef<DepthOfFieldEffect>(null)

  useFrame(() => {
    const d = dof.current
    if (!d) return
    const f = live.frame
    focus.set(f.focus[0], f.focus[1], f.focus[2])
    if (d.target) d.target.lerp(focus, 0.25)
    else d.target = focus.clone()
    // A blueprint is a technical drawing: everything in focus while it's showing.
    d.bokehScale = (0.6 + f.dof * 4.2) * (1 - f.baton.blueprint)
  })

  if (tier === 'full') {
    return (
      <EffectComposer multisampling={4}>
        <DepthOfField ref={dof} target={[0, 0, 0]} worldFocusRange={0.12} bokehScale={2} />
        <Bloom mipmapBlur intensity={1.05} luminanceThreshold={0.55} luminanceSmoothing={0.3} />
        <Vignette offset={0.24} darkness={0.82} />
        <Noise opacity={0.028} blendFunction={BlendFunction.OVERLAY} />
        <ToneMapping mode={ToneMappingMode.AGX} />
      </EffectComposer>
    )
  }
  return (
    <EffectComposer multisampling={0}>
      <Bloom mipmapBlur intensity={0.9} luminanceThreshold={0.6} luminanceSmoothing={0.3} />
      <Vignette offset={0.24} darkness={0.8} />
      <ToneMapping mode={ToneMappingMode.AGX} />
    </EffectComposer>
  )
}
