'use client'

import { useFrame } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { live } from '../film/live'

const CYAN = new THREE.Color('#2ee6ff')
const BEAM_DOTS = 36

function edges(geo: THREE.BufferGeometry) {
  const e = new THREE.EdgesGeometry(geo, 20)
  geo.dispose()
  return e
}

/**
 * The vibration demo's obstacles, drawn as cyan line sketches in the dark:
 * a pole ahead-left, a branch at head height, a person approaching on the
 * right. A beam of dots runs from the sensor head to each one it senses.
 */
export function Obstacles() {
  const group = useRef<THREE.Group>(null)
  const parts = useMemo(() => {
    const mat = () => new THREE.LineBasicMaterial({ color: CYAN, transparent: true, opacity: 0, toneMapped: false })
    const pole = new THREE.LineSegments(edges(new THREE.CylinderGeometry(0.028, 0.028, 0.8, 10, 6)), mat())
    const branchGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0.25, 0.6),
      new THREE.Vector3(0, 0.1, 0.25),
      new THREE.Vector3(0, 0.1, 0.25),
      new THREE.Vector3(0, -0.02, 0),
      new THREE.Vector3(0, -0.02, 0),
      new THREE.Vector3(0.05, -0.08, -0.22),
      new THREE.Vector3(0, 0.1, 0.25),
      new THREE.Vector3(0.06, 0.02, 0.32),
      new THREE.Vector3(0, -0.02, 0),
      new THREE.Vector3(-0.04, -0.1, 0.06),
      new THREE.Vector3(0.05, -0.08, -0.22),
      new THREE.Vector3(0.0, -0.16, -0.3),
    ])
    const branch = new THREE.LineSegments(branchGeo, mat())
    const person = new THREE.LineSegments(edges(new THREE.CapsuleGeometry(0.11, 0.62, 4, 10)), mat())
    const beamGeo = new THREE.BufferGeometry()
    beamGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(BEAM_DOTS * 3 * 3), 3))
    beamGeo.setAttribute('alpha', new THREE.BufferAttribute(new Float32Array(BEAM_DOTS * 3), 1))
    const beamMat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      toneMapped: false,
      uniforms: { uColor: { value: CYAN }, uSize: { value: 5 } },
      vertexShader: /* glsl */ `
        attribute float alpha;
        uniform float uSize;
        varying float vA;
        void main() {
          vA = alpha;
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = alpha < 0.01 ? 0.0 : uSize * (0.6 / -mv.z);
          gl_Position = projectionMatrix * mv;
        }`,
      fragmentShader: /* glsl */ `
        uniform vec3 uColor;
        varying float vA;
        void main() {
          float d = length(gl_PointCoord - 0.5);
          float a = (1.0 - smoothstep(0.3, 0.5, d)) * vA;
          if (a < 0.01) discard;
          gl_FragColor = vec4(uColor, a);
          #include <colorspace_fragment>
        }`,
    })
    const beams = new THREE.Points(beamGeo, beamMat)
    beams.frustumCulled = false
    return { pole, branch, person, beams, beamGeo, beamMat }
  }, [])

  useEffect(
    () => () => {
      for (const o of [parts.pole, parts.branch, parts.person]) {
        o.geometry.dispose()
        ;(o.material as THREE.Material).dispose()
      }
      parts.beamGeo.dispose()
      parts.beamMat.dispose()
    },
    [parts],
  )

  useFrame((_, dt) => {
    const g = group.current
    if (!g) return
    const obs = live.obstacles
    g.visible = obs.length > 0
    if (!g.visible) return
    parts.beamMat.uniforms.uSize.value = 5 * Math.min(2, window.devicePixelRatio || 1)
    const shapes = { pole: parts.pole, branch: parts.branch, person: parts.person }
    const pos = parts.beamGeo.getAttribute('position') as THREE.BufferAttribute
    const alpha = parts.beamGeo.getAttribute('alpha') as THREE.BufferAttribute
    const head = live.headWorld
    obs.forEach((o, i) => {
      const s = shapes[o.id]
      s.position.set(o.pos[0], o.pos[1], o.pos[2])
      ;(s.material as THREE.LineBasicMaterial).opacity = o.vis * 0.85
      for (let d = 0; d < BEAM_DOTS; d++) {
        const tt = d / (BEAM_DOTS - 1)
        const idx = i * BEAM_DOTS + d
        pos.setXYZ(idx, head.x + (o.pos[0] - head.x) * tt, head.y + (o.pos[1] - head.y) * tt, head.z + (o.pos[2] - head.z) * tt)
        // Dots travel from the head toward the obstacle.
        const flow = (live.time * 1.4 - tt * 3) % 1
        alpha.setX(idx, o.strength * (0.25 + 0.75 * Math.max(0, Math.sin(flow * Math.PI))) * (1 - tt * 0.5))
      }
    })
    pos.needsUpdate = true
    alpha.needsUpdate = true
    void dt
  })

  return (
    <group ref={group}>
      <primitive object={parts.pole} />
      <primitive object={parts.branch} />
      <primitive object={parts.person} />
      <primitive object={parts.beams} />
    </group>
  )
}
