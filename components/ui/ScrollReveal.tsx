'use client'

import { useEffect, useRef, type ElementType } from 'react'
import { useLight } from '@/lib/store'

/** How many characters glow cyan at the edge of the reveal. */
const GLOW = 8

/**
 * Text that lights up as you scroll (the Dandy reveal): it starts dim, a
 * short run of cyan-lit letters sweeps through it as it moves up the screen,
 * and what's behind the sweep settles to plain white.
 *
 * Screen readers get the sentence once, as normal text; the per-letter spans
 * are hidden from them. With motion off, the text is simply white.
 */
export function ScrollReveal({ as: Tag = 'p', className, children }: { as?: ElementType; className?: string; children: string }) {
  const ref = useRef<HTMLElement>(null)
  const motion = useLight((s) => s.motion)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const chars = [...el.querySelectorAll<HTMLSpanElement>('.reveal__c')]
    const n = chars.length
    const states = new Array<number>(n).fill(-1)
    const paint = (lit: number) => {
      for (let i = 0; i < n; i++) {
        const d = lit - i
        const s = d <= 0 ? 0 : d < GLOW ? 1 : 2
        if (s !== states[i]) {
          states[i] = s
          chars[i].dataset.s = s === 0 ? 'dim' : s === 1 ? 'glow' : 'lit'
        }
      }
    }
    if (motion === 'off') {
      paint(n + GLOW)
      return
    }
    let raf = 0
    const loop = () => {
      const r = el.getBoundingClientRect()
      const vh = window.innerHeight
      // Starts when the text's top reaches 85% of the screen; done when its bottom reaches 45%.
      const start = vh * 0.85
      const end = vh * 0.45
      const p = Math.min(1, Math.max(0, (start - r.top) / Math.max(1, start - end + r.height)))
      paint(p * (n + GLOW))
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [motion, children])

  const words = children.split(' ')
  return (
    <Tag ref={ref} className={`reveal${className ? ` ${className}` : ''}`}>
      <span className="visually-hidden">{children}</span>
      <span aria-hidden="true">
        {words.map((w, wi) => (
          <span key={wi} className="reveal__w">
            {[...w].map((ch, ci) => (
              <span key={ci} className="reveal__c" data-s="dim">
                {ch}
              </span>
            ))}
            {wi < words.length - 1 ? ' ' : ''}
          </span>
        ))}
      </span>
    </Tag>
  )
}
