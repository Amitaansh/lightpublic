'use client'

import { useEffect, useRef, useState } from 'react'
import { useLight } from '@/lib/store'

/**
 * Cursor follower (brief §6.9): a ring that follows the system cursor, which
 * stays visible. Grows and shows a verb over [data-cursor] targets. Off on
 * touch, under reduced motion, in forced-colors mode and when Motion is off.
 */
export function CursorFollower() {
  const motion = useLight((s) => s.motion)
  const [enabled, setEnabled] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const forced = window.matchMedia('(forced-colors: active)').matches
    setEnabled(fine && !forced && motion === 'on')
  }, [motion])

  useEffect(() => {
    if (!enabled) return
    const el = ref.current
    if (!el) return
    let x = -100
    let y = -100
    let tx = -100
    let ty = -100
    let raf = 0
    const loop = () => {
      x += (tx - x) * 0.22
      y += (ty - y) * 0.22
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`
      raf = requestAnimationFrame(loop)
    }
    const label = el.querySelector<HTMLSpanElement>('.cursor__label')
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      tx = e.clientX
      ty = e.clientY
      el.dataset.visible = 'true'
      const target = (e.target as Element | null)?.closest?.('[data-cursor]') as HTMLElement | null
      const verb = target?.dataset.cursor ?? ''
      if (el.dataset.label !== verb) {
        el.dataset.label = verb
        if (label) label.textContent = verb
      }
    }
    const onLeave = () => {
      el.dataset.visible = 'false'
    }
    raf = requestAnimationFrame(loop)
    window.addEventListener('pointermove', onMove, { passive: true })
    document.documentElement.addEventListener('pointerleave', onLeave)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
      document.documentElement.removeEventListener('pointerleave', onLeave)
    }
  }, [enabled])

  if (!enabled) return null
  return (
    <div ref={ref} className="cursor" aria-hidden="true" data-visible="false" data-label="">
      <span className="cursor__label" />
    </div>
  )
}
