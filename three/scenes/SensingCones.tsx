'use client'

import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useLight } from '@/lib/store'
import { rigOutput } from '../rig/rigIO'

/**
 * Chapter 02: four fields of dots open from the sensor head, one per item:
 * ahead, overhead, coming fast, and what it is. Angles are in screen space,
 * counter-clockwise from screen-right (the way the baton points on a cane).
 */
const CONES = [
  { center: 0, spread: 18, from: 0, to: 10 },
  { center: 58, spread: 13, from: 0, to: 10 },
  { center: -6, spread: 52, from: 6, to: 11 },
  { center: 2, spread: 3.2, from: 0, to: 13 },
]

const vertex = /* glsl */ `
attribute float aCone;
attribute float aRing;
uniform float uActive;
uniform float uOpacity;
uniform float uSize;
uniform float uTime;
varying float vAlpha;
void main() {
  float isOn = 1.0 - step(0.5, abs(aCone - uActive));
  float a = mix(0.16, 1.0, isOn);
  // "Coming fast": the arcs travel toward the baton.
  if (aCone > 1.5 && aCone < 2.5) a *= 0.45 + 0.55 * (0.5 + 0.5 * sin(aRing * 1.3 + uTime * 5.0));
  vAlpha = a * uOpacity;
  gl_PointSize = vAlpha < 0.01 ? 0.0 : uSize * mix(0.8, 1.15, isOn);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

const fragment = /* glsl */ `
uniform vec3 uColor;
varying float vAlpha;
void main() {
  float d = length(gl_PointCoord - 0.5);
  float a = (1.0 - smoothstep(0.4, 0.5, d)) * vAlpha;
  if (a < 0.01) discard;
  gl_FragColor = vec4(uColor, a);
  #include <colorspace_fragment>
}
`

export function SensingCones() {
  const ref = useRef<THREE.Points>(null)
  const { gl } = useThree()

  const geometry = useMemo(() => {
    const pos: number[] = []
    const cone: number[] = []
    const ring: number[] = []
    CONES.forEach((c, ci) => {
      for (let j = c.from; j <= c.to; j++) {
        const r = 0.016 + j * 0.0125
        const arc = (c.spread * 2 * Math.PI) / 180
        const n = Math.max(1, Math.round((arc * r) / 0.0072))
        for (let i = 0; i <= n; i++) {
          const a = ((c.center - c.spread + (2 * c.spread * i) / Math.max(1, n)) * Math.PI) / 180
          pos.push(Math.cos(a) * r, Math.sin(a) * r, 0)
          cone.push(ci)
          ring.push(c.to - j)
        }
      }
    })
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
    g.setAttribute('aCone', new THREE.Float32BufferAttribute(cone, 1))
    g.setAttribute('aRing', new THREE.Float32BufferAttribute(ring, 1))
    return g
  }, [])

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: vertex,
        fragmentShader: fragment,
        transparent: true,
        depthWrite: false,
        toneMapped: false,
        uniforms: {
          uActive: { value: 0 },
          uOpacity: { value: 0 },
          uSize: { value: 7 },
          uTime: { value: 0 },
          uColor: { value: new THREE.Color('#dbfe1b') },
        },
      }),
    [],
  )

  useEffect(() => () => geometry.dispose(), [geometry])
  useEffect(() => () => material.dispose(), [material])

  useFrame((state) => {
    const p = ref.current
    if (!p) return
    p.visible = rigOutput.cones > 0.01
    if (!p.visible) return
    const s = Math.max(0.6, rigOutput.scale) * 1.6
    p.position.set(rigOutput.head.x, rigOutput.head.y, rigOutput.head.z - 0.01)
    p.scale.setScalar(s)
    const u = material.uniforms
    u.uActive.value = useLight.getState().activeCone
    u.uOpacity.value = rigOutput.cones
    u.uSize.value = 7 * gl.getPixelRatio()
    u.uTime.value = state.clock.elapsedTime
  })

  return <points ref={ref} geometry={geometry} material={material} frustumCulled={false} />
}
