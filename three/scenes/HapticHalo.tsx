'use client'

import { useFrame } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { live } from '../film/live'

const CYAN = new THREE.Color('#2ee6ff')
const SEG = 8
const R_IN = 0.056
const R_OUT = 0.061
const RIPPLES = 2

/**
 * The haptic ring, shown as a halo around the grip (the real motors are
 * hidden under the hand). Segment k points the same way as motor k; it
 * brightens with that motor and sends ripples outward. Slow swells, never
 * flashes (WCAG 2.3.1).
 */
export function HapticHalo() {
  const group = useRef<THREE.Group>(null)
  const { segments, ripples, geos, mats } = useMemo(() => {
    const geos: THREE.BufferGeometry[] = []
    const mats: THREE.Material[] = []
    const arc = (Math.PI * 2) / SEG
    const segments: THREE.Mesh[] = []
    const ripples: THREE.Mesh[] = []
    for (let k = 0; k < SEG; k++) {
      // Motor k points along (sin a, 0, -cos a); RingGeometry angle φ maps to (cos φ, 0, -sin φ) after the rotation below.
      const a = (k * Math.PI * 2) / SEG
      const phi = Math.PI / 2 - a
      const g = new THREE.RingGeometry(R_IN, R_OUT, 24, 1, phi - arc * 0.42, arc * 0.84)
      geos.push(g)
      const m = new THREE.MeshBasicMaterial({ color: CYAN, transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, toneMapped: false })
      mats.push(m)
      const mesh = new THREE.Mesh(g, m)
      mesh.rotation.x = -Math.PI / 2
      segments.push(mesh)
      for (let r = 0; r < RIPPLES; r++) {
        const rg = new THREE.RingGeometry(0.98, 1.0, 24, 1, phi - arc * 0.4, arc * 0.8)
        geos.push(rg)
        const rm = new THREE.MeshBasicMaterial({ color: CYAN, transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, toneMapped: false })
        mats.push(rm)
        const rmesh = new THREE.Mesh(rg, rm)
        rmesh.rotation.x = -Math.PI / 2
        rmesh.userData = { k, phase: r / RIPPLES }
        ripples.push(rmesh)
      }
    }
    return { segments, ripples, geos, mats }
  }, [])

  useEffect(
    () => () => {
      geos.forEach((g) => g.dispose())
      mats.forEach((m) => m.dispose())
    },
    [geos, mats],
  )

  useFrame(() => {
    const g = group.current
    if (!g) return
    const f = live.frame
    const scenes = f.scene === 'vibration' || f.scene === 'route' || f.scene === 'stop'
    const present = scenes ? 1 : 0
    g.visible = present > 0
    if (!g.visible) return
    g.position.copy(live.gripWorld)
    g.quaternion.copy(live.batonQuat)
    const show = f.scene === 'vibration' ? Math.min(1, f.u / 0.14) : f.scene === 'route' ? 1 - Math.max(0, (f.u - 0.9) / 0.1) : 1
    segments.forEach((s, k) => {
      const v = Math.max(live.motors[k], live.stopAll)
      ;(s.material as THREE.MeshBasicMaterial).opacity = show * (0.1 + 0.9 * v)
      s.scale.setScalar(1 + 0.12 * v)
    })
    ripples.forEach((r) => {
      const { k, phase } = r.userData as { k: number; phase: number }
      const v = Math.max(live.motors[k], live.stopAll)
      const p = (live.time * (0.9 + v * 0.8) + phase) % 1
      const radius = R_OUT + p * (0.05 + 0.08 * v)
      r.scale.setScalar(radius)
      ;(r.material as THREE.MeshBasicMaterial).opacity = show * v * (1 - p) * 0.8
    })
  })

  return (
    <group ref={group} dispose={null}>
      {segments.map((s, i) => (
        <primitive key={`s${i}`} object={s} />
      ))}
      {ripples.map((r, i) => (
        <primitive key={`r${i}`} object={r} />
      ))}
    </group>
  )
}
