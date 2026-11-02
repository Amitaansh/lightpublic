import * as THREE from 'three'
import { CANE_R, CANE_Z } from '../baton/dimensions'

export type CaneHandles = {
  root: THREE.Group
  /** Moves along the shaft while the cane slides in. */
  slide: THREE.Group
  materials: THREE.MeshPhysicalMaterial[]
  shaft: THREE.MeshPhysicalMaterial
  dispose: () => void
}

/**
 * A standard white long cane (docs/05 §4.5). It runs under the baton, parallel
 * to it, from the cane's own grip (nested under the baton's grip) toward the
 * tip, past the sensor head and out of frame. The red band is the real cane's
 * colour, not a UI colour.
 */
export function buildCane(): CaneHandles {
  const root = new THREE.Group()
  root.name = 'cane'
  root.position.z = CANE_Z
  const slide = new THREE.Group()
  root.add(slide)

  const shaft = new THREE.MeshPhysicalMaterial({ color: '#f2f2ee', roughness: 0.32, clearcoat: 0.4, clearcoatRoughness: 0.3 })
  const red = new THREE.MeshPhysicalMaterial({ color: '#c8102e', roughness: 0.4, clearcoat: 0.3 })
  const rubber = new THREE.MeshPhysicalMaterial({ color: '#141517', roughness: 0.85 })
  const materials = [shaft, red, rubber]
  const geometries: THREE.BufferGeometry[] = []
  const add = (geo: THREE.BufferGeometry, mat: THREE.Material, y: number) => {
    geometries.push(geo)
    const m = new THREE.Mesh(geo, mat)
    m.position.y = y
    slide.add(m)
    return m
  }

  const top = 0.095
  const gripLen = 0.115
  const shaftLen = 1.1
  add(new THREE.CylinderGeometry(0.0098, 0.0094, gripLen, 28), rubber, top - gripLen / 2)
  add(new THREE.SphereGeometry(0.0098, 20, 10, 0, Math.PI * 2, 0, Math.PI / 2), rubber, top)
  add(new THREE.CylinderGeometry(CANE_R, CANE_R, shaftLen, 28), shaft, top - gripLen - shaftLen / 2)
  const tipY = top - gripLen - shaftLen
  add(new THREE.CylinderGeometry(CANE_R + 0.0002, CANE_R + 0.0002, 0.12, 28), red, tipY + 0.09)
  add(new THREE.SphereGeometry(0.011, 24, 16), rubber, tipY - 0.004)

  return {
    root,
    slide,
    materials,
    shaft,
    dispose: () => {
      for (const g of geometries) g.dispose()
      for (const m of materials) m.dispose()
    },
  }
}
