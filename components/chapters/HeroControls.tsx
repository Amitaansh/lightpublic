'use client'

import { useRef } from 'react'
import { useLight } from '@/lib/store'
import { rigInput } from '@/three/rig/rigIO'

/**
 * I1: drag sideways to spin the baton, with inertia. The rotate buttons are
 * the single-pointer and keyboard alternative (WCAG 2.5.7). Hidden when there
 * is no 3D (static tier).
 */
export function HeroDragSurface() {
  const tier = useLight((s) => s.tier)
  const last = useRef<{ x: number; t: number } | null>(null)
  if (!tier || tier === 'static') return null
  return (
    <div
      className="drag-surface"
      aria-hidden="true"
      data-cursor="drag"
      onPointerDown={(e) => {
        if (e.pointerType === 'touch') return
        e.currentTarget.setPointerCapture(e.pointerId)
        last.current = { x: e.clientX, t: performance.now() }
      }}
      onPointerMove={(e) => {
        const l = last.current
        if (!l) return
        const now = performance.now()
        const dx = e.clientX - l.x
        const dt = Math.max(8, now - l.t) / 1000
        rigInput.spinVelocity = Math.max(-900, Math.min(900, (dx / dt) * 0.9))
        last.current = { x: e.clientX, t: now }
      }}
      onPointerUp={() => {
        last.current = null
      }}
      onPointerCancel={() => {
        last.current = null
      }}
    />
  )
}

export function RotateButtons() {
  const tier = useLight((s) => s.tier)
  if (!tier || tier === 'static') return null
  const spin = (dir: number) => {
    rigInput.spinVelocity += dir * 260
  }
  return (
    <div className="hero-tools" role="group" aria-label="Rotate the 3D baton">
      <button type="button" className="icon-button" onClick={() => spin(-1)} aria-label="Rotate left" data-cursor="spin">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
          <path d="M11 4L6 9L11 14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <button type="button" className="icon-button" onClick={() => spin(1)} aria-label="Rotate right" data-cursor="spin">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
          <path d="M7 4L12 9L7 14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  )
}
