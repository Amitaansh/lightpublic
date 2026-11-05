'use client'

import { useFrame } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { ALERT_RED, CYAN, live } from '../film/live'


/**
 * STOP: a fast red streak crosses ahead from the right; one red shockwave
 * ring spreads from the grip. One swell, not a flash.
 */
export function StopFx() {
  const streak = useRef<THREE.Group>(null)
  const shock = useRef<THREE.Mesh>(null)
  const parts = useMemo(() => {
    const coreMat = new THREE.MeshBasicMaterial({ color: ALERT_RED, transparent: true, opacity: 0, toneMapped: false })
    const trailMat = new THREE.MeshBasicMaterial({ color: ALERT_RED, transparent: true, opacity: 0, toneMapped: false, blending: THREE.AdditiveBlending, depthWrite: false })
    const core = new THREE.Mesh(new THREE.CapsuleGeometry(0.03, 0.12, 6, 16), coreMat)
    core.rotation.x = Math.PI / 2
    const trail = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.03, 0.9, 16, 1, true), trailMat)
    trail.rotation.x = Math.PI / 2
    trail.position.z = -0.5
    const shockMat = new THREE.MeshBasicMaterial({ color: ALERT_RED, transparent: true, opacity: 0, toneMapped: false, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false })
    const shockGeo = new THREE.RingGeometry(0.96, 1, 96)
    return { core, trail, coreMat, trailMat, shockMat, shockGeo }
  }, [])

  useEffect(
    () => () => {
      parts.core.geometry.dispose()
      parts.trail.geometry.dispose()
      parts.shockGeo.dispose()
      parts.coreMat.dispose()
      parts.trailMat.dispose()
      parts.shockMat.dispose()
    },
    [parts],
  )

  useFrame(() => {
    const f = live.frame
    const s = streak.current
    const k = shock.current
    if (!s || !k) return
    const p = f.streak
    const active = f.scene === 'stop' && p > 0 && p < 1
    s.visible = active
    if (active) {
      s.position.set(-0.78, -0.1, -1.7 + p * 3.4)
      const fade = Math.sin(Math.PI * p)
      parts.coreMat.opacity = fade
      parts.trailMat.opacity = 0.5 * fade
    }
    const q = f.shock
    k.visible = f.scene === 'stop' && q > 0 && q < 1
    if (k.visible) {
      k.position.copy(live.gripWorld)
      k.quaternion.copy(live.batonQuat)
      k.rotateX(-Math.PI / 2)
      k.scale.setScalar(0.06 + q * 0.9)
      parts.shockMat.opacity = (1 - q) * 0.9
    }
  })

  return (
    <>
      <group ref={streak}>
        <primitive object={parts.core} />
        <primitive object={parts.trail} />
      </group>
      <mesh ref={shock} geometry={parts.shockGeo} material={parts.shockMat} />
    </>
  )
}
