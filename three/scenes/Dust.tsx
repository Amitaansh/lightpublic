'use client'

import { useFrame } from '@react-three/fiber'
import { useEffect, useMemo } from 'react'
import * as THREE from 'three'
import type { Tier } from '@/lib/store'
import { live } from '../film/live'

/**
 * Dust motes drifting through the light: barely there with the studio
 * lights on, catching the ring's cyan when the lights are out.
 */
export function Dust({ tier }: { tier: Tier }) {
  const count = tier === 'full' ? 520 : 200
  const { points, geo, mat } = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const seed = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 1.4
      pos[i * 3 + 1] = (Math.random() - 0.5) * 0.9
      pos[i * 3 + 2] = (Math.random() - 0.5) * 1.0 - 0.1
      seed[i] = Math.random()
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    geo.setAttribute('seed', new THREE.BufferAttribute(seed, 1))
    const mat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      toneMapped: false,
      uniforms: {
        uTime: { value: 0 },
        uAmount: { value: 0 },
        uLights: { value: 0 },
        uRing: { value: new THREE.Vector3() },
        uPx: { value: 1 },
      },
      vertexShader: /* glsl */ `
        attribute float seed;
        uniform float uTime;
        uniform float uPx;
        uniform vec3 uRing;
        uniform float uLights;
        varying float vGlow;
        varying float vSeed;
        void main() {
          vec3 p = position;
          p.y += mod(uTime * 0.012 * (0.4 + seed) + seed * 0.9, 0.9) - 0.45;
          p.x += sin(uTime * 0.2 + seed * 31.0) * 0.03;
          p.z += cos(uTime * 0.17 + seed * 17.0) * 0.03;
          vec4 mv = modelViewMatrix * vec4(p, 1.0);
          float d = distance(p, uRing);
          vGlow = mix(0.35, 1.0, uLights) * (0.25 + 0.75 * exp(-d * d / mix(0.25, 0.05, uLights)));
          vSeed = seed;
          gl_PointSize = uPx * (0.5 + seed * 1.1) * (0.35 / -mv.z);
          gl_Position = projectionMatrix * mv;
        }`,
      fragmentShader: /* glsl */ `
        uniform float uAmount;
        uniform float uLights;
        varying float vGlow;
        varying float vSeed;
        void main() {
          float d = length(gl_PointCoord - 0.5);
          float a = (1.0 - smoothstep(0.15, 0.5, d)) * vGlow * uAmount * 0.32;
          if (a < 0.004) discard;
          vec3 c = mix(vec3(0.85, 0.86, 0.88), vec3(0.18, 0.9, 1.0), uLights * 0.85);
          gl_FragColor = vec4(c, a);
          #include <colorspace_fragment>
        }`,
    })
    const points = new THREE.Points(geo, mat)
    points.frustumCulled = false
    return { points, geo, mat }
  }, [count])

  useEffect(
    () => () => {
      geo.dispose()
      mat.dispose()
    },
    [geo, mat],
  )

  useFrame((state) => {
    const f = live.frame
    mat.uniforms.uTime.value = state.clock.elapsedTime
    mat.uniforms.uAmount.value = Math.max(f.dust, live.lightsOut * 0.8)
    mat.uniforms.uLights.value = live.lightsOut
    mat.uniforms.uRing.value.copy(live.batonWorld)
    mat.uniforms.uPx.value = 10 * Math.min(2, state.gl.getPixelRatio())
    points.visible = mat.uniforms.uAmount.value > 0.01
  })

  return <primitive object={points} />
}
