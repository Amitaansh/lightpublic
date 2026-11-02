'use client'

import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { actuatorIntensities } from '@/lib/haptics'
import { useLight } from '@/lib/store'
import { autoInsideGroup, LADDER_LIT, LADDER_SIGNAL, PART_GROUP, type GroupId } from '../baton/dimensions'
import { buildBaton } from '../baton/buildBaton'
import { COLORS } from '../baton/materials'
import { buildCane } from '../cane/buildCane'
import { KEYFRAMES, mixKeyframes, POSTERS, resolveKeyframe, type Keyframe } from './choreography'
import { rigInput, rigOutput } from './rigIO'

const DEG = Math.PI / 180
const smoothstep = (t: number) => t * t * (3 - 2 * t)
const clamp01 = (x: number) => Math.min(1, Math.max(0, x))
/** Frame-rate independent damping toward a target (settles in about 1/rate s). */
const damp = (current: number, target: number, rate: number, dt: number) =>
  current + (target - current) * (1 - Math.exp(-rate * dt))

const tmpColor = new THREE.Color()
const tmpV = new THREE.Vector3()

/** One-shot light-ring pulses (brief §6.5: the ring is the baton's voice). */
function ringBump(ring: { kind: string; at: number } | null, now: number) {
  if (!ring) return 0
  const e = now - ring.at
  const bump = (start: number, dur: number, amp: number) => {
    const x = (e - start) / dur
    return x < 0 || x > 1 ? 0 : Math.sin(Math.PI * x) * amp
  }
  switch (ring.kind) {
    case 'swell':
      return bump(0, 700, 2.4)
    case 'double':
      return bump(0, 320, 2) + bump(380, 320, 2)
    case 'ignite':
      return bump(0, 1100, 3.2)
    case 'stop':
      return bump(0, 900, 3.6)
    default:
      return 0
  }
}

export function BatonRig() {
  const baton = useMemo(buildBaton, [])
  const cane = useMemo(buildCane, [])
  const outer = useRef<THREE.Group>(null)
  const pitchG = useRef<THREE.Group>(null)
  const spinG = useRef<THREE.Group>(null)
  const { viewport, size } = useThree()

  const live = useRef<Keyframe & { idle: number; init: boolean; prevEnter: number; stopUntil: number }>({
    ...KEYFRAMES.hero,
    pos: [0, 0],
    idle: 0,
    init: false,
    prevEnter: 0,
    stopUntil: 0,
  })

  useEffect(
    () => () => {
      baton.dispose()
      cane.dispose()
    },
    [baton, cane],
  )

  // Keep the head position at sensible defaults before the first frame.
  useEffect(() => {
    rigOutput.scale = 1
  }, [])

  useFrame((state, rawDt) => {
    const dt = Math.min(rawDt, 1 / 20)
    const s = useLight.getState()
    const now = performance.now()
    const L = live.current
    const mobile = size.width < 900
    const theme = document.documentElement.dataset.theme ?? 'white'

    // ---- 1. Target keyframe --------------------------------------------
    let target: Keyframe
    let posterMode = false
    let ladder = s.ladderLevel
    let obstacles = s.obstacles
    let stopActive = s.stopActive
    if (s.poster && POSTERS[s.poster]) {
      posterMode = true
      const p = POSTERS[s.poster]
      const merged = { ...s, ...(p.state ?? {}) }
      ladder = merged.ladderLevel
      obstacles = merged.obstacles
      stopActive = merged.stopActive
      target = { ...resolveKeyframe(p.key, merged, false), ...(p.patch ?? {}) }
    } else {
      const a = resolveKeyframe(s.blend.from, s, mobile)
      const b = resolveKeyframe(s.blend.to, s, mobile)
      target = mixKeyframes(a, b, smoothstep(clamp01(s.blend.t)))
      // Gallery: dock into the live card.
      const inMockups = s.blend.from === 'mockups' || s.blend.to === 'mockups'
      if (inMockups && s.dockRect) {
        const r = s.dockRect
        const dock: Keyframe = {
          ...resolveKeyframe('mockups', s, mobile),
          pos: [((r.x + r.w / 2) / size.width) * 2 - 1, -(((r.y + r.h / 2) / size.height) * 2 - 1)],
          scale: Math.min(1, (r.h / size.height) * 1.05),
        }
        const t = s.blend.from === 'mockups' ? 1 - smoothstep(clamp01(s.blend.t)) : smoothstep(clamp01(s.blend.t))
        target = mixKeyframes(target, dock, s.blend.from === s.blend.to ? 1 : t)
      }
    }
    if (!posterMode && s.footerLift > 0) target = { ...target, pos: [target.pos[0], target.pos[1] + s.footerLift * 2] }
    const inStopOrHaptics = ['haptics', 'stop'].includes(s.blend.from) || ['haptics', 'stop'].includes(s.blend.to)
    const inReliability = s.blend.from === 'reliability' || s.blend.to === 'reliability' || s.poster?.startsWith('reliability')
    const inInside = s.blend.from === 'inside' || s.blend.to === 'inside'

    // ---- 2. Idle spin (and hero drag) -----------------------------------
    const vel = rigInput.spinVelocity
    rigInput.spinVelocity *= Math.exp(-dt * 2.2)
    if (Math.abs(rigInput.spinVelocity) < 0.5) rigInput.spinVelocity = 0
    if (!posterMode) {
      L.idle += (target.spinRate + vel) * dt
      if (target.spinRate < 0.5 && Math.abs(vel) < 0.5) {
        L.idle = damp(L.idle, Math.round(L.idle / 360) * 360, 2.5, dt)
      }
    } else {
      L.idle = 0
    }

    // ---- 3. Follow the target on a damped spring ------------------------
    const snap = !L.init || posterMode
    const r = snap ? 1e6 : 5.5
    L.pos = [damp(L.pos[0], target.pos[0], r, dt), damp(L.pos[1], target.pos[1], r, dt)]
    L.tilt = damp(L.tilt, target.tilt, r, dt)
    L.pitch = damp(L.pitch, target.pitch, r, dt)
    L.spin = damp(L.spin, target.spin, r, dt)
    L.scale = damp(L.scale, target.scale, r, dt)
    L.cane = damp(L.cane, target.cane, snap ? r : 7, dt)
    L.caneEnter = damp(L.caneEnter, target.caneEnter, snap ? r : 9, dt)
    L.explode = damp(L.explode, target.explode, snap ? r : 7, dt)
    L.xray = damp(L.xray, target.xray, snap ? r : 6, dt)
    L.xrayGrip = damp(L.xrayGrip, target.xrayGrip, snap ? r : 6, dt)
    L.dots = damp(L.dots, target.dots, snap ? r : 4, dt)
    L.cones = damp(L.cones, target.cones, snap ? r : 4, dt)
    L.ring = target.ring
    L.init = true

    const o = outer.current
    const pg = pitchG.current
    const sg = spinG.current
    if (!o || !pg || !sg) return

    o.position.set((L.pos[0] * viewport.width) / 2, (L.pos[1] * viewport.height) / 2, 0)
    // Scale 1 = the baton is about 60% of the viewport height.
    const unit = (viewport.height * 0.6) / 0.2
    o.scale.setScalar(L.scale * unit)
    o.rotation.z = -L.tilt * DEG
    pg.rotation.x = L.pitch * DEG
    sg.rotation.y = (L.spin + L.idle) * DEG

    // ---- 4. Explode ------------------------------------------------------
    const e = L.explode
    for (const p of baton.parts) {
      const ei = smoothstep(clamp01(e * 1.35 - p.stagger * 0.035))
      p.object.position.copy(p.offset).multiplyScalar(ei)
    }

    // ---- 5. X-ray shells -------------------------------------------------
    const shellOpacity = (g: GroupId) => {
      const all = 1 - 0.86 * L.xray
      const grip = g === 'grip' || g === 'cap' ? 1 - 0.88 * L.xrayGrip : 1
      return Math.min(all, grip)
    }
    for (const [g, mats] of Object.entries(baton.shellMaterials) as [GroupId, THREE.Material[]][]) {
      const op = shellOpacity(g)
      for (const m of mats) {
        const transparent = op < 0.995
        if (m.transparent !== transparent) {
          m.transparent = transparent
          m.needsUpdate = true
        }
        m.opacity = op
        m.depthWrite = !transparent
      }
    }

    // ---- 6. Internals (diagram style) -------------------------------------
    // In the haptics view only the motor ring matters; other internals stay faint.
    const internalVis = Math.max(L.xray, e * 0.95) * (inStopOrHaptics ? 0.18 : 1)
    const lit = inReliability ? LADDER_LIT[ladder] : null
    const signal = inReliability ? LADDER_SIGNAL[ladder] : []
    const insideFocus = inInside && !posterMode ? (s.focusGroup ?? autoInsideGroup(s.pin.inside ?? 0)) : null
    const edgeColor = theme === 'blue' ? COLORS.white : COLORS.blue
    for (const it of baton.internals) {
      if (it.id === 'actuators') continue
      const vis = internalVis
      it.object.visible = vis > 0.01
      if (!it.object.visible) continue
      const isLit = !lit || lit.includes(it.id)
      const isSignal = signal.includes(it.id) || (insideFocus !== null && PART_GROUP[it.id] === insideFocus)
      it.fill.color.copy(isSignal ? COLORS.chartreuse : COLORS.blue80)
      it.fill.opacity = vis * (isLit ? 0.92 : 0.1)
      it.edges.color.copy(isSignal && theme === 'blue' ? COLORS.chartreuse : edgeColor)
      it.edges.opacity = vis * (isLit ? 1 : 0.22)
    }

    // ---- 7. Haptic actuators ------------------------------------------------
    const actVis = Math.max(L.xrayGrip, Math.max(L.xray, e * 0.95))
    const actGroup = baton.actuators[0].mesh.parent
    if (actGroup) actGroup.visible = actVis > 0.01
    if (s.ring?.kind === 'stop') L.stopUntil = s.ring.at + 900
    const stopping = now < L.stopUntil || (posterMode && stopActive)
    const want = inStopOrHaptics || posterMode ? actuatorIntensities(stopping ? [] : obstacles) : new Array(8).fill(0)
    const actLit = !lit || lit.includes('actuators')
    baton.actuators.forEach((a, i) => {
      let w = want[i]
      if (stopping) w = posterMode ? 1 : Math.sin(Math.PI * clamp01(1 - (L.stopUntil - now) / 900))
      if (inReliability && !actLit) w = 0
      // Swells take at least ~300 ms (brief §6.6): damp, never jump.
      a.intensity = posterMode ? w : damp(a.intensity, w, 7, dt)
      const v = a.intensity
      tmpColor.copy(COLORS.blue80).lerp(COLORS.chartreuse, clamp01(v * 1.4))
      a.fill.color.copy(tmpColor)
      a.fill.opacity = actVis * (actLit ? 0.95 : 0.12)
      a.edges.color.copy(theme === 'blue' && v > 0.3 ? COLORS.chartreuse : edgeColor)
      a.edges.opacity = actVis * (actLit ? 1 : 0.22)
      const sc = 1 + 0.75 * v
      a.mesh.scale.set(sc, 1 + 0.4 * v, sc)
    })

    // ---- 8. Clip and cane -------------------------------------------------------
    const enter = L.caneEnter
    cane.root.visible = L.cane > 0.01
    cane.slide.position.set(0, -0.55 * (1 - enter), -0.06 * (1 - enter))
    const caneOpacity = clamp01(L.cane)
    const caneLit = inReliability && ladder === 4
    for (const m of cane.materials) {
      const transparent = caneOpacity < 0.995
      if (m.transparent !== transparent) {
        m.transparent = transparent
        m.needsUpdate = true
      }
      m.opacity = caneOpacity
      m.depthWrite = !transparent
    }
    const rubber = cane.materials[2]
    const rubberOp = caneOpacity * (1 - 0.7 * L.xray)
    rubber.transparent = rubberOp < 0.995
    rubber.opacity = rubberOp
    rubber.depthWrite = !rubber.transparent
    cane.shaft.emissive.set(caneLit ? '#ffffff' : '#000000')
    cane.shaft.emissiveIntensity = caneLit ? 0.35 : 0
    // Jaw opens as the cane approaches, then snaps shut.
    const jawOpen = L.cane > 0.05 ? 1 - smoothstep(clamp01((enter - 0.82) / 0.16)) : 0
    baton.clipHinge.rotation.y = jawOpen * 0.55
    if (!posterMode && L.prevEnter < 0.97 && enter >= 0.97 && (s.blend.from === 'cane' || s.blend.to === 'cane')) {
      s.pulseRing('swell')
    }
    L.prevEnter = enter

    // ---- 9. Light ring -----------------------------------------------------------
    const t = state.clock.elapsedTime
    let base = 1.4
    if (L.ring === 'breathe') base = 0.9 + 0.7 * (0.5 + 0.5 * Math.sin((t * Math.PI * 2) / 4))
    if (L.ring === 'off') base = 0.12
    if (inReliability && ladder === 4) base = 0.08
    if (s.notePlaying) base = 1.2 + 1.1 * (0.5 + 0.5 * Math.sin(t * 9))
    const bump = ringBump(s.ring, now)
    const intensity = base + bump
    baton.materials.ring.emissiveIntensity = intensity
    baton.materials.slit.emissiveIntensity = Math.max(0.4, intensity * 0.8)

    // ---- 10. Outputs for the dot field and sensing cones -------------------------------
    o.updateMatrixWorld()
    rigOutput.center.setFromMatrixPosition(o.matrixWorld)
    baton.head.getWorldPosition(tmpV)
    rigOutput.head.copy(tmpV)
    rigOutput.scale = L.scale
    rigOutput.dots = L.dots
    rigOutput.cones = L.cones
  })

  return (
    <group ref={outer}>
      <group ref={pitchG}>
        <group ref={spinG}>
          <primitive object={baton.root} />
          <primitive object={cane.root} />
        </group>
      </group>
    </group>
  )
}
