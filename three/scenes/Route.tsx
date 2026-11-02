'use client'

import { useFrame } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useLight } from '@/lib/store'
import { live } from '../film/live'
import { FLOOR_Y, ROUTE_MARKERS, ROUTE_NOTE, ROUTE_POINTS, ROUTE_TRAVEL } from '../film/world'

const CYAN = new THREE.Color('#2ee6ff')

/**
 * Route Memory: a dark floor, a remembered route drawn ahead in cyan,
 * remembered obstacles as small pillars, and a Guide Note pinned to a spot.
 * The walker stays put; the world slides toward them.
 */
export function Route() {
  const group = useRef<THREE.Group>(null)
  const last = useRef({ travel: 0, cued: new Set<number>(), note: false })
  const parts = useMemo(() => {
    const floorMat = new THREE.MeshStandardMaterial({ color: '#0f0f10', roughness: 0.92, metalness: 0, transparent: true, opacity: 0 })
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(12, 12), floorMat)
    floor.rotation.x = -Math.PI / 2
    floor.receiveShadow = true

    const gridMat = new THREE.LineBasicMaterial({ color: CYAN, transparent: true, opacity: 0, toneMapped: false })
    const gridPts: THREE.Vector3[] = []
    for (let i = -12; i <= 12; i++) {
      gridPts.push(new THREE.Vector3(i * 0.5, 0, -6), new THREE.Vector3(i * 0.5, 0, 6))
      gridPts.push(new THREE.Vector3(-6, 0, i * 0.5), new THREE.Vector3(6, 0, i * 0.5))
    }
    const grid = new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(gridPts), gridMat)
    grid.position.y = 0.001

    const curve = new THREE.CatmullRomCurve3(ROUTE_POINTS.map((p) => new THREE.Vector3(p[0], 0, p[2])))
    const pathGeo = new THREE.TubeGeometry(curve, 200, 0.012, 8, false)
    const pathMat = new THREE.MeshBasicMaterial({ color: CYAN, transparent: true, opacity: 0, toneMapped: false })
    const path = new THREE.Mesh(pathGeo, pathMat)
    path.position.y = 0.012

    const markerGeo = new THREE.CylinderGeometry(0.022, 0.03, 0.16, 20)
    const baseGeo = new THREE.RingGeometry(0.05, 0.065, 40)
    const markers = ROUTE_MARKERS.map((m) => {
      const mat = new THREE.MeshStandardMaterial({ color: '#0a0a0a', emissive: CYAN, emissiveIntensity: 1.2, transparent: true, opacity: 0, toneMapped: false })
      const pillar = new THREE.Mesh(markerGeo, mat)
      pillar.position.set(m.x, 0.08, m.z)
      const baseMat = new THREE.MeshBasicMaterial({ color: CYAN, transparent: true, opacity: 0, toneMapped: false, side: THREE.DoubleSide })
      const base = new THREE.Mesh(baseGeo, baseMat)
      base.rotation.x = -Math.PI / 2
      base.position.set(m.x, 0.004, m.z)
      return { pillar, base, mat, baseMat }
    })

    const note = new THREE.Group()
    note.position.set(ROUTE_NOTE.x, 0, ROUTE_NOTE.z)
    const barMat = new THREE.MeshBasicMaterial({ color: CYAN, transparent: true, opacity: 0, toneMapped: false })
    const bars: THREE.Mesh[] = []
    for (let i = 0; i < 11; i++) {
      const bar = new THREE.Mesh(new THREE.BoxGeometry(0.012, 1, 0.012), barMat)
      bar.position.set((i - 5) * 0.026, 0.3, 0)
      note.add(bar)
      bars.push(bar)
    }
    const pinRingMat = new THREE.MeshBasicMaterial({ color: CYAN, transparent: true, opacity: 0, toneMapped: false, side: THREE.DoubleSide })
    const pinRing = new THREE.Mesh(new THREE.RingGeometry(0.09, 0.1, 48), pinRingMat)
    pinRing.rotation.x = -Math.PI / 2
    pinRing.position.y = 0.004
    note.add(pinRing)

    return { floor, floorMat, grid, gridMat, path, pathMat, markers, note, bars, barMat, pinRing, pinRingMat }
  }, [])

  useEffect(
    () => () => {
      const all: THREE.Object3D[] = [parts.floor, parts.grid, parts.path, parts.note, ...parts.markers.flatMap((m) => [m.pillar, m.base])]
      for (const o of all) {
        o.traverse((c) => {
          const m = c as THREE.Mesh
          m.geometry?.dispose()
          const mat = m.material as THREE.Material | undefined
          mat?.dispose?.()
        })
      }
    },
    [parts],
  )

  useFrame(() => {
    const g = group.current
    if (!g) return
    const f = live.frame
    const show = f.route.show
    g.visible = show > 0.01
    if (!g.visible) {
      last.current.cued.clear()
      return
    }
    g.position.set(f.route.travel * ROUTE_TRAVEL, FLOOR_Y, 0)
    parts.floorMat.opacity = show
    parts.gridMat.opacity = show * 0.07
    parts.pathMat.opacity = show * 0.95
    // The route draws itself out ahead of the walker as the scene begins.
    const drawn = Math.min(1, f.u / 0.3)
    parts.path.geometry.setDrawRange(0, Math.floor((parts.path.geometry.index?.count ?? 0) * drawn))

    const offset = f.route.travel * ROUTE_TRAVEL
    parts.markers.forEach((m, i) => {
      const worldX = ROUTE_MARKERS[i].x + offset
      const appear = Math.min(1, Math.max(0, (drawn * 4.6 - Math.abs(ROUTE_MARKERS[i].x)) * 1.5))
      // Early warning: a double pulse when the walker is about a metre away.
      const near = worldX > -1.05 && worldX < -0.2
      if (near && !last.current.cued.has(i) && f.route.travel > last.current.travel) {
        last.current.cued.add(i)
        useLight.getState().pulseRing('double')
      }
      const glow = near ? 2.6 : 1.2
      m.mat.opacity = show * appear
      m.mat.emissiveIntensity = glow
      m.pillar.scale.y = 0.2 + 0.8 * appear
      m.baseMat.opacity = show * appear * (near ? 0.9 : 0.4)
    })
    const noteX = ROUTE_NOTE.x + offset
    const playing = noteX > -1.2 && noteX < 0.2
    parts.barMat.opacity = show * (playing ? 0.95 : 0.4)
    parts.bars.forEach((b, i) => {
      const h = playing ? 0.05 + 0.18 * Math.abs(Math.sin(live.time * 6 + i * 0.9)) : 0.04 + 0.02 * Math.sin(i)
      b.scale.y = h
      b.position.y = 0.06 + h / 2
    })
    const ring = (live.time * 0.8) % 1
    parts.pinRing.scale.setScalar(1 + ring * (playing ? 2.5 : 0.8))
    parts.pinRingMat.opacity = show * (1 - ring) * (playing ? 0.8 : 0.3)
    last.current.travel = f.route.travel
  })

  return (
    <group ref={group}>
      <primitive object={parts.floor} />
      <primitive object={parts.grid} />
      <primitive object={parts.path} />
      {parts.markers.map((m, i) => (
        <group key={i}>
          <primitive object={m.pillar} />
          <primitive object={m.base} />
        </group>
      ))}
      <primitive object={parts.note} />
    </group>
  )
}
