'use client'

import { useFrame } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import type { Tier } from '@/lib/store'
import { CYAN, live } from '../film/live'
import { FLOOR_Y, WALK } from '../film/world'

const BEAM_DOTS = 36
/** The pavement pattern repeats every TILE metres, so it can slide forever. */
const TILE = 0.6

/* ------------------------------------------------------------ materials */

/** Paving slabs with fine joints and a little grain: a dark, matte street. */
function pavingTexture() {
  const size = 512
  const c = document.createElement('canvas')
  c.width = c.height = size
  const g = c.getContext('2d')!
  g.fillStyle = '#5a5a5a'
  g.fillRect(0, 0, size, size)
  // Grain.
  const img = g.getImageData(0, 0, size, size)
  let seed = 3
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647)
  for (let i = 0; i < img.data.length; i += 4) {
    const n = (rnd() - 0.5) * 26
    img.data[i] += n
    img.data[i + 1] += n
    img.data[i + 2] += n
  }
  g.putImageData(img, 0, 0)
  // Joints: two slabs per tile each way.
  g.strokeStyle = '#2a2a2a'
  g.lineWidth = 5
  for (const t of [0, size / 2, size]) {
    g.beginPath()
    g.moveTo(t, 0)
    g.lineTo(t, size)
    g.moveTo(0, t)
    g.lineTo(size, t)
    g.stroke()
  }
  const tex = new THREE.CanvasTexture(c)
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 4
  return tex
}

/** A cyan glow at the silhouette, added on top of a sensed obstacle. */
function rimMaterial() {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    toneMapped: false,
    uniforms: { uColor: { value: CYAN.clone() }, uOpacity: { value: 0 } },
    vertexShader: /* glsl */ `
      varying vec3 vN;
      varying vec3 vV;
      void main() {
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        vN = normalize(normalMatrix * normal);
        vV = normalize(-mv.xyz);
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: /* glsl */ `
      uniform vec3 uColor;
      uniform float uOpacity;
      varying vec3 vN;
      varying vec3 vV;
      void main() {
        float rim = pow(1.0 - abs(dot(normalize(vN), normalize(vV))), 3.0);
        gl_FragColor = vec4(uColor, rim * uOpacity);
        #include <colorspace_fragment>
      }`,
  })
}

/* ------------------------------------------------------------ obstacles */

type Built = { root: THREE.Group; mats: THREE.Material[]; rim: THREE.ShaderMaterial; geos: THREE.BufferGeometry[] }

/**
 * One obstacle, floor-anchored (origin on the floor under its sensed point).
 * Every mesh gets a rim overlay that glows when the baton senses it.
 */
function buildObstacle(id: 'pole' | 'branch' | 'person', hSense: number): Built {
  const root = new THREE.Group()
  const geos: THREE.BufferGeometry[] = []
  const mats: THREE.Material[] = []
  const rim = rimMaterial()
  const mat = (m: THREE.MeshStandardMaterial | THREE.MeshPhysicalMaterial) => {
    mats.push(m)
    return m
  }
  const add = (geo: THREE.BufferGeometry, m: THREE.Material, p: [number, number, number], r?: [number, number, number]) => {
    geos.push(geo)
    const mesh = new THREE.Mesh(geo, m)
    mesh.position.set(...p)
    if (r) mesh.rotation.set(...r)
    mesh.castShadow = true
    mesh.receiveShadow = true
    const glow = new THREE.Mesh(geo, rim)
    glow.scale.setScalar(1.002)
    mesh.add(glow)
    root.add(mesh)
    return mesh
  }

  if (id === 'pole') {
    // A street pole with a sign at the top.
    const metal = mat(new THREE.MeshStandardMaterial({ color: '#3a3d42', metalness: 0.7, roughness: 0.42 }))
    const sign = mat(new THREE.MeshStandardMaterial({ color: '#2b2e33', metalness: 0.4, roughness: 0.5 }))
    add(new THREE.CylinderGeometry(0.035, 0.04, 2.3, 24), metal, [0, 1.15, 0])
    add(new THREE.BoxGeometry(0.02, 0.4, 0.5), sign, [0.04, 1.95, 0])
    add(new THREE.CylinderGeometry(0.07, 0.08, 0.04, 24), metal, [0, 0.02, 0])
  } else if (id === 'branch') {
    // A tree on the left; one branch reaches over the path at head height.
    const bark = mat(new THREE.MeshStandardMaterial({ color: '#2a2622', roughness: 0.95 }))
    const leaf = mat(new THREE.MeshStandardMaterial({ color: '#232b25', roughness: 0.9 }))
    const trunkZ = 0.9
    add(new THREE.CylinderGeometry(0.07, 0.1, 1.6, 16), bark, [0, 0.8, trunkZ])
    const canopy = new THREE.IcosahedronGeometry(0.62, 3)
    add(canopy, leaf, [0, 2.05, trunkZ], [0.3, 0.6, 0])
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 1.25, trunkZ),
      new THREE.Vector3(0.02, hSense + 0.12, 0.45),
      new THREE.Vector3(0, hSense + 0.02, 0.05),
      new THREE.Vector3(-0.02, hSense - 0.05, -0.32),
    ])
    add(new THREE.TubeGeometry(curve, 48, 0.032, 12, false), bark, [0, 0, 0])
    // A few thin twigs off the branch.
    for (let k = 0; k < 4; k++) {
      const p = curve.getPoint(0.35 + k * 0.17)
      const twig = new THREE.CatmullRomCurve3([p, p.clone().add(new THREE.Vector3(0.04 * (k % 2 ? 1 : -1), 0.1 + 0.03 * k, -0.12))])
      add(new THREE.TubeGeometry(twig, 8, 0.009, 6, false), bark, [0, 0, 0])
    }
  } else {
    // A person walking toward you: the same matte clay as the hand.
    const clay = mat(
      new THREE.MeshPhysicalMaterial({ color: new THREE.Color('#8f877e'), roughness: 0.7, sheen: 0.3, sheenRoughness: 0.6, sheenColor: new THREE.Color('#fff2e6') }),
    )
    for (const z of [-0.1, 0.1]) add(new THREE.CapsuleGeometry(0.068, 0.72, 6, 16), clay, [0, 0.45, z])
    add(new THREE.CapsuleGeometry(0.17, 0.4, 8, 20), clay, [0, 1.18, 0], [0, 0, 0])
    for (const z of [-0.26, 0.26]) add(new THREE.CapsuleGeometry(0.048, 0.5, 6, 12), clay, [0.02, 1.08, z])
    add(new THREE.SphereGeometry(0.105, 24, 18), clay, [0, 1.6, 0])
    root.children[2].scale.set(0.7, 1, 1.15)
  }
  return { root, mats, rim, geos }
}

/** Fade a solid material in or out; only switches blending when it has to. */
function fade(mt: THREE.Material, o: number) {
  const t = o < 0.999
  if (mt.transparent !== t) {
    mt.transparent = t
    mt.needsUpdate = true
  }
  mt.opacity = o
  mt.depthWrite = o > 0.5
}

/* ------------------------------------------------------------ component */

/**
 * The vibration demo as a walk down a dark street, shot like the rest of the
 * film: matte paving with a tactile guidance strip, a kerb and the road,
 * fading into the fog. A pole, a branch at head height and a person come
 * past at walking speed. When the baton senses one, it takes a thin cyan
 * rim, a beam of dots runs to it from the sensor head, and the grip vibrates
 * on that side (HapticHalo).
 */
export function Obstacles({ tier }: { tier: Tier }) {
  const group = useRef<THREE.Group>(null)
  const street = useRef<THREE.Group>(null)
  const light = useRef<THREE.SpotLight>(null)

  const parts = useMemo(() => {
    const geos: THREE.BufferGeometry[] = []
    const mats: THREE.Material[] = []
    const g = <T extends THREE.BufferGeometry>(x: T) => (geos.push(x), x)
    const m = <T extends THREE.Material>(x: T) => (mats.push(x), x)

    // ---- The street (slides by one tile at a time, so it repeats seamlessly).
    const tex = pavingTexture()
    tex.repeat.set(12 / TILE, 2.9 / TILE)
    const pave = m(new THREE.MeshStandardMaterial({ color: '#2a2b2d', map: tex, roughness: 0.92, metalness: 0 }))
    const road = m(new THREE.MeshStandardMaterial({ color: '#141516', roughness: 0.85 }))
    const kerbM = m(new THREE.MeshStandardMaterial({ color: '#3b3c3f', roughness: 0.8 }))
    const tactile = m(new THREE.MeshStandardMaterial({ color: '#4a4b4e', roughness: 0.7 }))
    const lane = m(new THREE.MeshStandardMaterial({ color: '#8d8f93', roughness: 0.7 }))

    const st = new THREE.Group()
    const mesh = (geo: THREE.BufferGeometry, mat: THREE.Material, p: [number, number, number], rx = 0) => {
      const o = new THREE.Mesh(g(geo), mat)
      o.position.set(...p)
      o.rotation.x = rx
      o.receiveShadow = true
      st.add(o)
      return o
    }
    // Pavement from the wall line (+Z) to the kerb (-Z), 12 m long.
    mesh(new THREE.PlaneGeometry(12, 2.9), pave, [-3.5, 0, 0.15], -Math.PI / 2)
    // Kerb, then the road a step down.
    mesh(new THREE.BoxGeometry(12, 0.15, 0.14), kerbM, [-3.5, -0.075, -1.36])
    mesh(new THREE.PlaneGeometry(12, 4), road, [-3.5, -0.15, -3.43], -Math.PI / 2)
    // Tactile guidance strip: raised bars along the walking line, left of centre.
    const bar = g(new THREE.BoxGeometry(TILE / 4 - 0.03, 0.006, 0.3))
    const bars = Math.round(12 / (TILE / 4))
    const strip = new THREE.InstancedMesh(bar, tactile, bars)
    const tmp = new THREE.Object3D()
    for (let i = 0; i < bars; i++) {
      tmp.position.set(-9.5 + i * (TILE / 4), 0.003, 0.44)
      tmp.updateMatrix()
      strip.setMatrixAt(i, tmp.matrix)
    }
    strip.receiveShadow = true
    st.add(strip)
    // Dashed lane marking.
    for (let i = 0; i < 12 / TILE; i++) mesh(new THREE.PlaneGeometry(TILE / 2, 0.08), lane, [-9.5 + i * TILE, -0.149, -2.55], -Math.PI / 2)

    // ---- Obstacles. Sensed heights above the floor come from world.ts.
    const obs = {
      pole: buildObstacle('pole', -0.28 - FLOOR_Y),
      branch: buildObstacle('branch', 0.35 - FLOOR_Y),
      person: buildObstacle('person', -0.2 - FLOOR_Y),
    }

    // ---- Beam of dots from the sensor head to each sensed obstacle.
    const beamGeo = g(new THREE.BufferGeometry())
    beamGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(BEAM_DOTS * 3 * 3), 3))
    beamGeo.setAttribute('alpha', new THREE.BufferAttribute(new Float32Array(BEAM_DOTS * 3), 1))
    const beamMat = m(
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        toneMapped: false,
        uniforms: { uColor: { value: CYAN.clone() }, uSize: { value: 5 } },
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
      }),
    )
    const beams = new THREE.Points(beamGeo, beamMat)
    beams.frustumCulled = false
    const stMats = [pave, road, kerbM, tactile, lane]
    return { st, stMats, tex, obs, beams, beamGeo, beamMat, geos, mats }
  }, [])

  useEffect(
    () => () => {
      parts.geos.forEach((x) => x.dispose())
      parts.mats.forEach((x) => x.dispose())
      parts.tex.dispose()
      for (const o of Object.values(parts.obs)) {
        o.geos.forEach((x) => x.dispose())
        o.mats.forEach((x) => x.dispose())
        o.rim.dispose()
      }
    },
    [parts],
  )

  useFrame(() => {
    const g = group.current
    if (!g) return
    const f = live.frame
    const show = f.scene === 'vibration' ? f.obstacles.show : 0
    g.visible = show > 0.001
    const sl = light.current
    if (sl) {
      sl.intensity = 10 * show * (1 - live.lightsOut)
      sl.target.position.set(-1.6, FLOOR_Y, 0)
      sl.target.updateMatrixWorld()
    }
    if (!g.visible) return

    // The street slides toward you as you walk; it repeats every tile.
    if (street.current) street.current.position.set((f.u * WALK) % TILE, FLOOR_Y, 0)
    for (const mt of parts.stMats) fade(mt, show)

    parts.beamMat.uniforms.uSize.value = 5 * Math.min(2, window.devicePixelRatio || 1)
    const pos = parts.beamGeo.getAttribute('position') as THREE.BufferAttribute
    const alpha = parts.beamGeo.getAttribute('alpha') as THREE.BufferAttribute
    const head = live.headWorld
    const byId = new Map(live.obstacles.map((o) => [o.id, o]))
    ;(['pole', 'branch', 'person'] as const).forEach((id, i) => {
      const b = parts.obs[id]
      const o = byId.get(id)
      b.root.visible = !!o && o.vis > 0.01
      if (!o) return
      b.root.position.set(o.pos[0], FLOOR_Y, o.pos[2])
      for (const mt of b.mats) fade(mt, o.vis)
      // The rim and the beam show how strongly it's sensed.
      b.rim.uniforms.uOpacity.value = 1.4 * o.strength * o.vis
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
  })

  return (
    <>
      {/* A soft street light overhead, ahead of the walker; only in this scene. */}
      <spotLight
        ref={light}
        position={[-1.4, 2.4, 0.5]}
        angle={0.95}
        penumbra={1}
        decay={2}
        intensity={0}
        color="#dfe8f2"
        castShadow={tier === 'full'}
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0005}
      />
      <group ref={group}>
        <group ref={street}>
          <primitive object={parts.st} />
        </group>
        {Object.entries(parts.obs).map(([id, o]) => (
          <primitive key={id} object={o.root} />
        ))}
        <primitive object={parts.beams} />
      </group>
    </>
  )
}
