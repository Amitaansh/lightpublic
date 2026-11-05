'use client'

import { useEffect, useRef } from 'react'
import { insideCallouts } from '@/content/film'
import { live } from '@/three/film/live'

const LEVELS = [84, 128, 172]

/**
 * Blueprint labels for the exploded baton (anime.js-style): each label sits
 * above or below the part it names, joined by a leader line with a dot on the
 * part. Positions come from the 3D scene every frame (live.callouts). Labels
 * that would collide move out a level or step aside. Decorative: hidden from
 * screen readers, which get the scene's full description instead.
 */
export function Callouts() {
  const root = useRef<HTMLDivElement>(null)
  const svg = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const el = root.current
    const lines = svg.current
    if (!el || !lines) return
    const labels = [...el.querySelectorAll<HTMLElement>('.callout')]
    const paths = [...lines.querySelectorAll<SVGPathElement>('path')]
    const dots = [...lines.querySelectorAll<SVGCircleElement>('circle')]
    let raf = 0

    const loop = () => {
      const show = live.calloutShow
      el.style.opacity = String(show)
      if (show > 0.001) {
        const vw = window.innerWidth
        const vh = window.innerHeight
        const margin = 12
        // Visible anchors, left to right; alternate above / below.
        const order = live.callouts
          .map((c, i) => ({ c, i }))
          .filter(({ c }) => c?.on)
          .sort((a, b) => a.c.x - b.c.x)
        const placed: { l: number; r: number; t: number; b: number }[] = []
        const shown = new Set<number>()
        order.forEach(({ c, i }, k) => {
          const label = labels[i]
          const w = label.offsetWidth
          const h = label.offsetHeight
          let side = k % 2 === 0 ? -1 : 1
          let done = false
          // Try each level on the preferred side, then on the other side.
          for (let attempt = 0; attempt < 2 && !done; attempt++, side = -side) {
            for (let level = 0; level < LEVELS.length && !done; level++) {
              const lx = Math.min(vw - margin - w, Math.max(margin, c.x - w / 2))
              const ly = side < 0 ? c.y - LEVELS[level] - h : c.y + LEVELS[level]
              // Keep clear of the header and of the caption and progress bar at the bottom.
              if (ly < 76 || ly + h > vh - 170) continue
              const clash = placed.some((p) => lx < p.r + 8 && lx + w > p.l - 8 && ly < p.b + 6 && ly + h > p.t - 6)
              if (clash) continue
              placed.push({ l: lx, r: lx + w, t: ly, b: ly + h })
              label.style.transform = `translate(${lx}px, ${ly}px)`
              // Leader: from the part, straight out, then to the label's edge.
              const ey = side < 0 ? ly + h + 4 : ly - 4
              const ex = Math.min(lx + w - 6, Math.max(lx + 6, c.x))
              paths[i].setAttribute('d', `M${c.x} ${c.y} L${c.x} ${(c.y + ey) / 2} L${ex} ${(c.y + ey) / 2} L${ex} ${ey}`)
              dots[i].setAttribute('cx', String(c.x))
              dots[i].setAttribute('cy', String(c.y))
              done = true
            }
          }
          if (done) shown.add(i)
        })
        labels.forEach((l, i) => {
          const on = shown.has(i)
          l.style.visibility = on ? 'visible' : 'hidden'
          paths[i].style.visibility = on ? 'visible' : 'hidden'
          dots[i].style.visibility = on ? 'visible' : 'hidden'
        })
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div ref={root} className="callouts" aria-hidden="true">
      <svg ref={svg} className="callouts__lines">
        {insideCallouts.map((c) => (
          <g key={c.part}>
            <path />
            <circle r="2.5" />
          </g>
        ))}
      </svg>
      {insideCallouts.map((c) => (
        <span key={c.part} className="callout">
          {c.label}
        </span>
      ))}
    </div>
  )
}
