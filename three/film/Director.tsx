'use client'

import { useGLTF } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { Suspense, useCallback, useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { film, useLight } from '@/lib/store'
import { FALLBACK_POWERED } from '../baton/buildInternals'
import { buildBaton, type BatonHandles } from '../baton/buildBaton'
import { buildCane } from '../cane/buildCane'
import { createHandRig, type HandRig } from '../hand/handRig'
import { live, pointer } from './live'
import { frameAt } from './shots'
import { motorStrengths, obstaclesAt } from './world'

const DEG = Math.PI / 180
const clamp01 = (x: number) => Math.min(1, Math.max(0, x))
const smooth = (t: number) => t * t * (3 - 2 * t)
const damp = (a: number, b: number, rate: number, dt: number) => a + (b - a) * (1 - Math.exp(-rate * dt))

/**
 * Where the hand sits on the grip, in baton space. The hand model's rest axes
 * map as: hand X → baton -X, hand Y → baton +Z, hand Z → baton +Y, so the palm
 * wraps the grip from the -X side, fingers curl under, the thumb lies on top
 * toward the buttons, index toward the head.
 */
const HAND = {
  basis: new THREE.Matrix4().makeBasis(new THREE.Vector3(-1, 0, 0), new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, 1, 0)),
  /** The grip's centre line in the hand's own rest space (metres). */
  anchor: new THREE.Vector3(-0.002, -0.012, 0.02),
  gripCenter: new THREE.Vector3(0, 0.053, 0),
  /** Where the hand comes in from, in baton space (scaled by `approach`). */
  approach: new THREE.Vector3(-0.15, 0.03, 0.11),
}

function ringBump(ring: { kind: string; at: number } | null, now: number) {
  if (!ring) return 0
  const e = now - ring.at
  const b = (start: number, dur: number, amp: number) => {
    const x = (e - start) / dur
    return x < 0 || x > 1 ? 0 : Math.sin(Math.PI * x) * amp
  }
  switch (ring.kind) {
    case 'swell':
      return b(0, 800, 3)
    case 'double':
      return b(0, 340, 2.6) + b(420, 340, 2.6)
    case 'ignite':
      return b(0, 1400, 4)
    case 'stop':
      return b(0, 1000, 5)
    default:
      return 0
  }
}

function HandModel({ onReady }: { onReady: (rig: HandRig) => void }) {
  const gltf = useGLTF('/models/hand-right.glb')
  const rig = useMemo(() => createHandRig(gltf.scene), [gltf.scene])
  useEffect(() => {
    onReady(rig)
    return () => rig.dispose()
  }, [rig, onReady])
  return <primitive object={rig.root} />
}

export function Director() {
  const baton = useMemo<BatonHandles>(buildBaton, [])
  const cane = useMemo(buildCane, [])
  const outer = useRef<THREE.Group>(null)
  const pitchG = useRef<THREE.Group>(null)
  const spinG = useRef<THREE.Group>(null)
  const handAnchor = useRef<THREE.Group>(null)
  const hand = useRef<HandRig | null>(null)
  const { camera, size } = useThree()
  const persp = camera as THREE.PerspectiveCamera
  const raycaster = useMemo(() => new THREE.Raycaster(), [])
  const state = useRef({ prevEnter: 0, prevLevel: 0, prevShock: 0, lights: 0, hoverCheck: 0, powered: new Map<THREE.Material, number>() })

  useEffect(
    () => () => {
      baton.dispose()
      cane.dispose()
    },
    [baton, cane],
  )
  const onHandReady = useCallback((r: HandRig) => {
    hand.current = r
  }, [])

  // Static hand placement: rest pose → grip pose on the baton.
  const gripPose = useMemo(() => {
    const q = new THREE.Quaternion().setFromRotationMatrix(HAND.basis)
    const p = HAND.gripCenter.clone().sub(HAND.anchor.clone().applyQuaternion(q))
    return { q, p }
  }, [])

  // Click (or tap) the baton to switch the room lights; hover shows a pointer.
  useEffect(() => {
    const ndc = (e: PointerEvent | MouseEvent) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1
      pointer.y = -(e.clientY / window.innerHeight) * 2 + 1
    }
    const hit = () => {
      raycaster.setFromCamera(new THREE.Vector2(pointer.x, pointer.y), camera)
      return raycaster.intersectObjects(baton.hitTargets, true).length > 0
    }
    const onMove = (e: PointerEvent) => {
      ndc(e)
      pointer.active = e.pointerType === 'mouse'
    }
    const onClick = (e: MouseEvent) => {
      const t = e.target as Element | null
      if (t?.closest('a,button,input,textarea,select,label,dialog,[role="dialog"]')) return
      ndc(e)
      if (hit()) useLight.getState().toggleLights()
    }
    const onLeave = () => {
      pointer.active = false
      document.body.dataset.overBaton = 'false'
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('click', onClick)
    document.documentElement.addEventListener('pointerleave', onLeave)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('click', onClick)
      document.documentElement.removeEventListener('pointerleave', onLeave)
      document.body.dataset.overBaton = 'false'
    }
  }, [baton, camera, raycaster])

  useFrame((r3f, rawDt) => {
    const dt = Math.min(rawDt, 1 / 20)
    const s = useLight.getState()
    const now = performance.now()
    const S = state.current
    const poster = s.poster !== null
    live.time = r3f.clock.elapsedTime

    // ---- 1. Film position (smoothed on top of Lenis) ----------------------
    const targetT = poster ? (s.poster as number) : film.target
    if (film.snap || poster) {
      live.T = targetT
      film.snap = false
    } else {
      live.T = damp(live.T, targetT, 6, dt)
    }
    const f = frameAt(live.T)
    live.frame = f

    // ---- 2. Camera --------------------------------------------------------
    camera.position.set(f.cam[0], f.cam[1], f.cam[2])
    camera.lookAt(f.target[0], f.target[1], f.target[2])
    const fov = size.width < 700 ? f.fov * 1.3 : f.fov
    if (Math.abs(persp.fov - fov) > 0.01) {
      persp.fov = fov
      persp.updateProjectionMatrix()
    }

    const o = outer.current
    const pg = pitchG.current
    const sg = spinG.current
    if (!o || !pg || !sg) return

    // ---- 3. Baton pose, with a little life ------------------------------------
    const t = r3f.clock.elapsedTime
    const alive = poster ? 0 : 1
    const floating = f.scene === 'title' || f.scene === 'finale' || f.scene === 'macro'
    const bob = alive * (floating ? 0.0035 : 0.0015) * Math.sin(t * 0.9)
    const sway = alive * (floating ? 5 : 0) * Math.sin(t * 0.35)
    const tremble = f.baton.tremble + Math.max(...live.motors) * 0.25
    const jit = alive * tremble * 0.0011
    o.position.set(f.baton.pos[0] + jit * Math.sin(t * 91), f.baton.pos[1] + bob + jit * Math.sin(t * 77 + 1), f.baton.pos[2] + jit * Math.sin(t * 83 + 2))
    o.rotation.z = -f.baton.tilt * DEG
    pg.rotation.x = f.baton.pitch * DEG
    sg.rotation.y = (f.baton.spin + sway) * DEG

    // ---- 4. Explode ----------------------------------------------------------
    const e = f.baton.explode
    for (const p of baton.parts) {
      const ei = smooth(clamp01(e * 1.4 - p.stagger * 0.034))
      p.object.position.copy(p.offset).multiplyScalar(ei)
    }
    for (const p of baton.internals) p.object.visible = e > 0.01

    // ---- 5. Fallback ladder: systems power down; the safety core stays lit -----
    const level = Math.round(f.baton.fallback)
    if (level > S.prevLevel && !poster) s.pulseRing('swell')
    S.prevLevel = level
    const on = FALLBACK_POWERED[Math.min(4, Math.max(0, level))]
    for (const pm of baton.powered) {
      const want = on.includes(pm.system) ? 1 : 0
      pm.on = poster ? want : damp(pm.on, want, 7, dt)
      const base = pm.mat.userData.base ?? (pm.mat.userData.base = pm.mat.emissiveIntensity)
      pm.mat.emissiveIntensity = base * pm.on
    }

    // ---- 6. Lights out: the film's own, or the visitor's toggle ---------------
    const wantLights = Math.max(f.lightsOut, s.lightsOut ? 1 : 0)
    S.lights = poster ? wantLights : damp(S.lights, wantLights, 2.4, dt)
    live.lightsOut = S.lights
    const L = S.lights

    // ---- 7. Light ring, buttons -----------------------------------------------------
    const bumpRing = ringBump(s.ring, now)
    const breathe = floating ? 0.25 * Math.sin(t * 1.6) : 0
    const ringI = 2.2 + breathe + f.ringBoost * 2.5 + bumpRing + L * 4 + live.stopAll * 4
    baton.materials.ring.emissiveIntensity = level >= 4 && e > 0.5 ? 0.15 : ringI
    baton.materials.slit.emissiveIntensity = 1 + L * 2
    baton.ringLight.intensity = 0.015 + L * 0.42 + (bumpRing + f.ringBoost) * 0.06
    baton.ringLight.distance = 0.5 + L * 1.2
    baton.materials.button.emissiveIntensity = f.baton.buttons * 0.9

    // ---- 8. Cane and clip ------------------------------------------------------------
    cane.root.visible = f.cane.show > 0.01
    cane.slide.position.set(0, -0.6 * (1 - f.cane.enter), -0.07 * (1 - f.cane.enter))
    for (const m of cane.materials) {
      const tr = f.cane.show < 0.995
      if (m.transparent !== tr) {
        m.transparent = tr
        m.needsUpdate = true
      }
      m.opacity = f.cane.show
      m.depthWrite = f.cane.show > 0.5
    }
    const jawOpen = f.cane.show > 0.05 ? 1 - smooth(clamp01((f.cane.enter - 0.85) / 0.13)) : 0
    baton.clipHinge.rotation.y = jawOpen * 0.55
    if (!poster && S.prevEnter < 0.98 && f.cane.enter >= 0.98 && f.scene === 'clip') s.pulseRing('swell')
    S.prevEnter = f.cane.enter

    // ---- 9. Hand -----------------------------------------------------------------------
    const ha = handAnchor.current
    if (ha) {
      const a = smooth(clamp01(f.hand.approach))
      ha.position.copy(gripPose.p).addScaledVector(HAND.approach, a)
      ha.quaternion.copy(gripPose.q)
      // A slight roll as it arrives, so the approach doesn't look mechanical.
      ha.rotateZ(a * 0.35)
      ha.visible = f.hand.show > 0.01
    }
    if (hand.current) {
      hand.current.setPose({ grip: f.hand.grip, reach: f.hand.reach })
      hand.current.setOpacity(f.hand.show)
    }

    // ---- 10. World outputs for the other scene elements ---------------------------------
    o.updateMatrixWorld(true)
    baton.grip.getWorldPosition(live.gripWorld)
    baton.head.getWorldPosition(live.headWorld)
    sg.getWorldQuaternion(live.batonQuat)
    o.getWorldPosition(live.batonWorld)
    live.obstacles = obstaclesAt(f)
    motorStrengths(live.obstacles, live.gripWorld, live.batonQuat, live.motors)
    const shockOn = f.shock > 0 && f.shock < 0.5 ? 1 - f.shock * 2 : 0
    live.stopAll = Math.max(shockOn, f.baton.tremble > 0.5 ? 1 : 0)
    if (!poster && S.prevShock <= 0.001 && f.shock > 0.001) s.pulseRing('stop')
    S.prevShock = f.shock
    baton.actuators.forEach((act, k) => {
      act.glow.emissiveIntensity = (Math.max(live.motors[k], live.stopAll) * 6) as number
    })

    // ---- 11. Hover: show a pointer over the baton -----------------------------------------
    S.hoverCheck += dt
    if (pointer.active && S.hoverCheck > 0.1) {
      S.hoverCheck = 0
      raycaster.setFromCamera(new THREE.Vector2(pointer.x, pointer.y), camera)
      const over = raycaster.intersectObjects(baton.hitTargets, true).length > 0
      document.body.dataset.overBaton = over ? 'true' : 'false'
    }
  })

  return (
    <group ref={outer}>
      <group ref={pitchG}>
        <group ref={spinG}>
          <primitive object={baton.root} />
          <primitive object={cane.root} />
          <group ref={handAnchor}>
            <Suspense fallback={null}>
              <HandModel onReady={onHandReady} />
            </Suspense>
          </group>
        </group>
      </group>
    </group>
  )
}

useGLTF.preload('/models/hand-right.glb')
