'use client'

import { useEffect, useRef, useState } from 'react'
import { useLight } from '@/lib/store'

const CAP_MS = 3000
const MIN_MS = 900

/**
 * Loader: near-black field, the wordmark, a cyan hairline that fills with
 * real progress (fonts, then the 3D scene and the hand model), then a slow
 * fade as the baton's ring ignites. Visual only; skipped on repeat visits.
 */
export function Loader() {
  const [state, setState] = useState<'loading' | 'done' | 'gone'>('loading')
  const [progress, setProgress] = useState(0.06)
  const doneRef = useRef(false)

  useEffect(() => {
    const html = document.documentElement
    const finish = () => {
      if (doneRef.current) return
      doneRef.current = true
      try {
        sessionStorage.setItem('light-loaded', '1')
      } catch {}
      setProgress(1)
      window.setTimeout(() => {
        setState('done')
        const { set, pulseRing } = useLight.getState()
        set({ loaderDone: true })
        pulseRing('ignite')
        window.setTimeout(() => setState('gone'), 1200)
      }, 350)
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
    const cap = window.setTimeout(finish, CAP_MS)
    const tick = window.setInterval(() => {
      const { sceneReady, tier } = useLight.getState()
      const scene = sceneReady || tier === 'static'
      const elapsed = performance.now() - start
      const p = 0.06 + (fonts ? 0.3 : 0.1 * Math.min(1, elapsed / 800)) + (scene ? 0.6 : 0.4 * Math.min(1, elapsed / CAP_MS))
      setProgress((prev) => Math.max(prev, Math.min(0.96, p)))
      if (fonts && scene && elapsed > MIN_MS) finish()
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
        <span className="wordmark" style={{ fontSize: '2rem' }}>
          L<span className="wordmark__dot">.</span>I<span className="wordmark__dot">.</span>G<span className="wordmark__dot">.</span>H
          <span className="wordmark__dot">.</span>T
        </span>
        <span className="loader__bar">
          <span className="loader__fill" style={{ transform: `scaleX(${progress})` }} />
        </span>
      </div>
    </div>
  )
}
