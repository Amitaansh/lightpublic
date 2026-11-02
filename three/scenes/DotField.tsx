'use client'

import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useLight } from '@/lib/store'
import { rigInput, rigOutput } from '../rig/rigIO'

/**
 * DotField (brief §6.4): chartreuse dots, read as braille cells and haptic
 * actuators. A halo of dots around the baton; dots swell as the pointer or the
 * baton's sensor head comes near, the way haptics strengthen as an obstacle
 * nears. Decorative.
 */
const PLANE_Z = -0.12
const PITCH_PX = 24

const vertex = /* glsl */ `
uniform vec2 uCenter;
uniform vec2 uRadius;
uniform vec2 uPointer;
uniform vec2 uHead;
uniform float uSize;
uniform float uOpacity;
varying float vAlpha;
void main() {
  vec2 p = position.xy;
  vec2 q = (p - uCenter) / uRadius;
  float halo = 1.0 - smoothstep(0.45, 1.0, length(q));
  float dp = distance(p, uPointer);
  float dh = distance(p, uHead);
  float swell = 1.0 + 1.1 * exp(-dp * dp / 0.0009) + 0.7 * exp(-dh * dh / 0.0012);
  vAlpha = halo * uOpacity;
  gl_PointSize = vAlpha < 0.01 ? 0.0 : uSize * (0.4 + 0.6 * halo) * swell;
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

export function DotField() {
  const { size, camera, gl } = useThree()
  const tier = useLight((s) => s.tier)
  const ref = useRef<THREE.Points>(null)
  const pointerWorld = useRef(new THREE.Vector2(99, 99))

  const persp = camera as THREE.PerspectiveCamera
  const depth = persp.position.z - PLANE_Z
  const planeH = 2 * depth * Math.tan(((persp.fov ?? 30) * Math.PI) / 360)
  const planeW = planeH * (size.width / Math.max(1, size.height))

  const geometry = useMemo(() => {
    const pitch = (PITCH_PX * (tier === 'lite' ? 1.6 : 1) * planeH) / Math.max(1, size.height)
    const cols = Math.ceil(planeW / pitch) + 2
    const rows = Math.ceil(planeH / pitch) + 2
    const pos = new Float32Array(cols * rows * 3)
    let i = 0
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        pos[i++] = (c - cols / 2) * pitch
        pos[i++] = (r - rows / 2) * pitch
        pos[i++] = 0
      }
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    return g
  }, [planeW, planeH, size.height, tier])

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: vertex,
        fragmentShader: fragment,
        transparent: true,
        depthWrite: false,
        toneMapped: false,
        uniforms: {
          uCenter: { value: new THREE.Vector2() },
          uRadius: { value: new THREE.Vector2(0.2, 0.15) },
          uPointer: { value: new THREE.Vector2(99, 99) },
          uHead: { value: new THREE.Vector2(99, 99) },
          uSize: { value: 11 },
          uOpacity: { value: 0 },
          uColor: { value: new THREE.Color('#dbfe1b') },
        },
      }),
    [],
  )

  useEffect(() => () => geometry.dispose(), [geometry])
  useEffect(() => () => material.dispose(), [material])

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return
      rigInput.pointer = { x: (e.clientX / window.innerWidth) * 2 - 1, y: -((e.clientY / window.innerHeight) * 2 - 1) }
    }
    const onLeave = () => {
      rigInput.pointer = null
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    document.documentElement.addEventListener('pointerleave', onLeave)
    return () => {
      window.removeEventListener('pointermove', onMove)
      document.documentElement.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  useFrame((_, dt) => {
    const u = material.uniforms
    const k = depth / persp.position.z
    u.uCenter.value.set(rigOutput.center.x * k, rigOutput.center.y * k)
    u.uHead.value.set(rigOutput.head.x * k, rigOutput.head.y * k)
    const s = Math.max(0.5, rigOutput.scale)
    u.uRadius.value.set(0.135 * s, 0.12 * s)
    const p = rigInput.pointer
    const target = p ? new THREE.Vector2((p.x * planeW) / 2, (p.y * planeH) / 2) : new THREE.Vector2(99, 99)
    pointerWorld.current.lerp(target, 1 - Math.exp(-dt * 10))
    u.uPointer.value.copy(pointerWorld.current)
    u.uSize.value = 11 * gl.getPixelRatio()
    u.uOpacity.value = rigOutput.dots
    if (ref.current) ref.current.visible = rigOutput.dots > 0.01
  })

  return <points ref={ref} geometry={geometry} material={material} position={[0, 0, PLANE_Z]} frustumCulled={false} renderOrder={-1} />
}
