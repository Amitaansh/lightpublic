'use client'

import { useRef, type PointerEvent } from 'react'
import { actuatorIntensities, DIRECTIONS, DISTANCES } from '@/lib/haptics'
import type { Obstacle } from '@/lib/store'

const C = 150
/** Radar radius per distance step. */
const radiusFor = (d: number) => 30 + d * 105

const pos = (angle: number, r: number) => {
  const a = (angle * Math.PI) / 180
  return { x: C + Math.sin(a) * r, y: C - Math.cos(a) * r }
}

type Props = {
  obstacles: Obstacle[]
  /** Overrides computed intensities (e.g. STOP: all on). */
  intensities?: number[]
  cyclist?: { x: number; y: number; visible: boolean }
  onPlace?: (angle: number, distance: number) => void
  title: string
}

/**
 * Top-down radar: the walker at the centre heading up, obstacles around, and
 * the grip's ring of 8 motors drawn small at the centre. Works without WebGL,
 * so it is also the static-tier version of the haptics demo.
 */
export function RadarSvg({ obstacles, intensities, cyclist, onPlace, title }: Props) {
  const ref = useRef<SVGSVGElement>(null)
  const dragging = useRef(false)
  const values = intensities ?? actuatorIntensities(obstacles)

  const place = (e: PointerEvent<SVGSVGElement>) => {
    const svg = ref.current
    if (!svg || !onPlace) return
    const r = svg.getBoundingClientRect()
    const x = ((e.clientX - r.left) / r.width) * 300 - C
    const y = ((e.clientY - r.top) / r.height) * 300 - C
    const dist = Math.hypot(x, y)
    if (dist < 24) return
    let angle = (Math.atan2(x, -y) * 180) / Math.PI
    angle = (Math.round(angle / 45) * 45 + 360) % 360
    const raw = (dist - 30) / 105
    const d = DISTANCES.reduce((best, s) => (Math.abs(s.value - raw) < Math.abs(best.value - raw) ? s : best), DISTANCES[0])
    onPlace(angle, d.value)
  }

  return (
    <svg
      ref={ref}
      className="diagram"
      viewBox="0 0 300 300"
      role="img"
      aria-label={title}
      style={{ maxWidth: 340, touchAction: onPlace ? 'none' : undefined, cursor: onPlace ? 'pointer' : undefined }}
      data-cursor={onPlace ? 'drag' : undefined}
      onPointerDown={(e) => {
        if (!onPlace) return
        dragging.current = true
        e.currentTarget.setPointerCapture(e.pointerId)
        place(e)
      }}
      onPointerMove={(e) => dragging.current && place(e)}
      onPointerUp={() => {
        dragging.current = false
      }}
    >
      <g fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.45">
        {DISTANCES.map((d) => (
          <circle key={d.value} cx={C} cy={C} r={radiusFor(d.value)} strokeDasharray="3 6" />
        ))}
        {DIRECTIONS.map((d) => {
          const p = pos(d.angle, 140)
          return <line key={d.angle} x1={C} y1={C} x2={p.x} y2={p.y} strokeDasharray="2 8" />
        })}
      </g>
      {/* The grip's ring of motors, small, at the centre */}
      {values.map((v, i) => {
        const p = pos(i * 45, 20)
        return (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={3.5 + v * 5}
            fill={v > 0.05 ? 'var(--signal)' : 'transparent'}
            stroke="var(--signal-edge)"
            strokeWidth={v > 0.05 ? 2 : 1.5}
            style={{ transition: 'r 300ms ease, fill 300ms ease' }}
            opacity={v > 0.05 ? 0.5 + v * 0.5 : 0.6}
          />
        )
      })}
      {/* Walker heading up */}
      <path d={`M${C} ${C - 9} L${C + 6} ${C + 6} L${C} ${C + 2} L${C - 6} ${C + 6} Z`} fill="currentColor" />
      {obstacles.map((o, i) => {
        const p = pos(o.angle, radiusFor(o.distance))
        return (
          <g key={`${o.label}-${i}`} style={{ transition: 'transform 300ms ease' }}>
            <rect x={p.x - 9} y={p.y - 9} width="18" height="18" rx="4" fill="currentColor" />
            <text x={p.x} y={p.y - 15} textAnchor="middle" fontSize="12" fontWeight="600" fill="currentColor">
              {o.label}
            </text>
          </g>
        )
      })}
      {cyclist && (
        <g style={{ opacity: cyclist.visible ? 1 : 0, transition: 'opacity 200ms' }}>
          <circle cx={cyclist.x} cy={cyclist.y} r="10" fill="currentColor" />
          <path d={`M${cyclist.x + 16} ${cyclist.y} h 26 M${cyclist.x + 18} ${cyclist.y - 7} h 18 M${cyclist.x + 18} ${cyclist.y + 7} h 18`} stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        </g>
      )}
    </svg>
  )
}
