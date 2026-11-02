'use client'

import { useEffect, useRef } from 'react'
import { useLight } from '@/lib/store'

type Props = { to: number; decimals?: number; prefix?: string; suffix?: string; text: string }

/**
 * Counts up once when in view (R6). The final value is in the DOM from the
 * start for screen readers; only the animating digits are hidden from them.
 */
export function Counter({ to, decimals = 0, prefix = '', suffix = '', text }: Props) {
  const ref = useRef<HTMLSpanElement>(null)
  const motion = useLight((s) => s.motion)

  useEffect(() => {
    const el = ref.current
    if (!el || motion === 'off') return
    const fmt = (v: number) => `${prefix}${v.toFixed(decimals)}${suffix}`
    el.textContent = fmt(0)
    let raf = 0
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        io.disconnect()
        const start = performance.now()
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / 1400)
          const eased = 1 - Math.pow(1 - t, 4)
          el.textContent = fmt(to * eased)
          if (t < 1) raf = requestAnimationFrame(tick)
          else el.textContent = text
        }
        raf = requestAnimationFrame(tick)
      },
      { threshold: 0.6 },
    )
    io.observe(el)
    return () => {
      io.disconnect()
      cancelAnimationFrame(raf)
      el.textContent = text
    }
  }, [to, decimals, prefix, suffix, text, motion])

  return (
    <>
      <span ref={ref} aria-hidden="true">
        {text}
      </span>
      <span className="visually-hidden">{text}</span>
    </>
  )
}
