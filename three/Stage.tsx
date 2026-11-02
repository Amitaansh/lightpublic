'use client'

import { ContactShadows, Environment, Lightformer } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import type { Tier } from '@/lib/store'
import { live } from './film/live'

const BG_ON = new THREE.Color('#151515')
const BG_OUT = new THREE.Color('#050505')

/**
 * Studio: a soft key spotlight that casts real shadows, a cool rim from
 * behind, a faint under-fill, studio reflections from light panels, a soft
 * contact shadow under the floating baton, and fog so far things fall into
 * the dark. "Lights out" fades all of it, leaving the baton's ring.
 */
export function Stage({ tier }: { tier: Tier }) {
  const key = useRef<THREE.SpotLight>(null)
  const rim = useRef<THREE.SpotLight>(null)
  const under = useRef<THREE.SpotLight>(null)
  const ambient = useRef<THREE.AmbientLight>(null)
  const shadows = useRef<THREE.Group>(null)
  const { scene } = useThree()

  useEffect(() => {
    scene.background = BG_ON.clone()
    scene.fog = new THREE.FogExp2(BG_ON.clone(), 0.32)
    return () => {
      scene.background = null
      scene.fog = null
    }
  }, [scene])

  useFrame(() => {
    const L = live.lightsOut
    const f = live.frame
    const on = 1 - L
    if (key.current) key.current.intensity = 9 * on
    if (rim.current) rim.current.intensity = 14 * on
    if (under.current) under.current.intensity = 1.2 * on
    if (ambient.current) ambient.current.intensity = 0.05 * on + 0.005
    scene.environmentIntensity = 0.55 * on + 0.02
    ;(scene.background as THREE.Color).lerpColors(BG_ON, BG_OUT, L)
    ;(scene.fog as THREE.FogExp2).color.copy(scene.background as THREE.Color)
    if (shadows.current) {
      shadows.current.visible = f.shadowFloor > 0.01
      shadows.current.position.y = live.batonWorld.y - 0.26
      shadows.current.position.x = live.batonWorld.x
      shadows.current.traverse((o) => {
        const m = (o as THREE.Mesh).material as THREE.MeshBasicMaterial | undefined
        if (m && 'opacity' in m) m.opacity = 0.55 * f.shadowFloor * (1 - 0.7 * L)
      })
    }
  })

  return (
    <>
      <Environment resolution={256} frames={1}>
        <Lightformer form="rect" intensity={1.1} position={[0, 3, 1.2]} scale={[5, 2.2, 1]} />
        <Lightformer form="rect" intensity={1.6} position={[-3, 0.6, 0.6]} scale={[0.3, 4, 1]} />
        <Lightformer form="rect" intensity={1.4} position={[3, 0.2, -0.4]} scale={[0.3, 4, 1]} />
        <Lightformer form="rect" intensity={0.15} position={[0, -3, 0.6]} scale={[5, 2, 1]} />
        <Lightformer form="ring" intensity={0.35} color="#bfeeff" position={[0, 0, 3.5]} scale={2} />
      </Environment>
      <ambientLight ref={ambient} intensity={0.05} />
      <spotLight
        ref={key}
        position={[0.9, 1.3, 1.15]}
        angle={0.42}
        penumbra={1}
        decay={2}
        intensity={26}
        castShadow={tier === 'full'}
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0004}
        shadow-normalBias={0.002}
        shadow-radius={6}
        shadow-camera-near={0.6}
        shadow-camera-far={4}
      />
      <spotLight ref={rim} position={[-1.3, 0.7, -1.0]} angle={0.5} penumbra={1} decay={2} intensity={34} color="#d4ecff" />
      <spotLight ref={under} position={[0.4, -1.2, 0.8]} angle={0.6} penumbra={1} decay={2} intensity={3} color="#9fdcff" />
      {tier === 'full' && (
        <group ref={shadows}>
          <ContactShadows scale={1.2} blur={2.8} far={0.5} opacity={0.55} resolution={512} frames={Infinity} color="#000000" />
        </group>
      )}
    </>
  )
}
