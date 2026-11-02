'use client'

import { useEffect, useRef, useState } from 'react'
import { useLight } from '@/lib/store'

const CAP_MS = 2500
const MIN_MS = 900

/**
 * Loader (brief §6.8): blue field, wordmark, a hairline bar that fills in
 * chartreuse from real progress (fonts, then the 3D scene), then wipes up
 * into the hero and the baton's light ring ignites. At most 2.5 s; skipped on
 * repeat visits in a session and under reduced motion. Visual only.
 */
export function Loader() {
  const [state, setState] = useState<'loading' | 'done' | 'gone'>('loading')
  const [progress, setProgress] = useState(0.08)
  const doneRef = useRef(false)

  useEffect(() => {
    const html = document.documentElement
    const finish = (instant: boolean) => {
      if (doneRef.current) return
      doneRef.current = true
      try {
        sessionStorage.setItem('light-loaded', '1')
      } catch {}
      setProgress(1)
      window.setTimeout(
        () => {
          setState('done')
          const { set, pulseRing } = useLight.getState()
          set({ loaderDone: true })
          pulseRing('ignite')
          window.setTimeout(() => setState('gone'), 800)
        },
        instant ? 0 : 280,
      )
    }

    if (html.classList.contains('skip-loader')) {
      doneRef.current = true
      useLight.getState().set({ loaderDone: true })
      useLight.getState().pulseRing('ignite')
      setState('gone')
      return
    }

    const start = performance.now()
    let fonts = false
    document.fonts?.ready.then(() => {
      fonts = true
    })
    const cap = window.setTimeout(() => finish(false), CAP_MS)
    const tick = window.setInterval(() => {
      const { sceneReady, tier } = useLight.getState()
      const scene = sceneReady || tier === 'static'
      const elapsed = performance.now() - start
      const p = 0.08 + (fonts ? 0.32 : 0.12 * Math.min(1, elapsed / 800)) + (scene ? 0.5 : 0.3 * Math.min(1, elapsed / CAP_MS))
      setProgress((prev) => Math.max(prev, Math.min(0.96, p)))
      if (fonts && scene && elapsed > MIN_MS) finish(false)
    }, 90)
    return () => {
      window.clearTimeout(cap)
      window.clearInterval(tick)
    }
  }, [])

  if (state === 'gone') return null
  return (
    <div className="loader" data-state={state} aria-hidden="true">
      <div className="loader__inner">
        <span className="wordmark" style={{ fontSize: '1.75rem' }}>
          L<span style={{ color: '#dbfe1b' }}>.</span>I<span style={{ color: '#dbfe1b' }}>.</span>G
          <span style={{ color: '#dbfe1b' }}>.</span>H<span style={{ color: '#dbfe1b' }}>.</span>T
        </span>
        <span className="loader__bar">
          <span className="loader__fill" style={{ transform: `scaleX(${progress})` }} />
        </span>
        <span className="t-label" style={{ color: '#d3d8f5' }}>
          finding the light…
        </span>
      </div>
    </div>
  )
}
