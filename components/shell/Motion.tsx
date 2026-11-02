'use client'

import { useEffect } from 'react'
import { useLight } from '@/lib/store'

const KEY = 'light-motion'

/** Reads the motion preference that the inline head script put on <html>. */
export function MotionInit() {
  useEffect(() => {
    const html = document.documentElement
    useLight.getState().set({ motion: html.dataset.motion === 'off' ? 'off' : 'on' })
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = () => {
      let stored: string | null = null
      try {
        stored = localStorage.getItem(KEY)
      } catch {}
      if (stored) return
      const m = mq.matches ? 'off' : 'on'
      html.dataset.motion = m
      useLight.getState().set({ motion: m })
    }
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])
  return null
}

/** Global motion switch (WCAG 2.2.2): off = still frames instead of the film. */
export function MotionToggle() {
  const motion = useLight((s) => s.motion)
  const toggle = () => {
    const next = motion === 'on' ? 'off' : 'on'
    document.documentElement.dataset.motion = next
    try {
      localStorage.setItem(KEY, next)
    } catch {}
    useLight.getState().set({ motion: next })
  }
  return (
    <button type="button" className="pill" aria-pressed={motion === 'on'} onClick={toggle}>
      <span className="pill__dot" aria-hidden="true" />
      <span className="pill__text">Motion</span>
    </button>
  )
}
