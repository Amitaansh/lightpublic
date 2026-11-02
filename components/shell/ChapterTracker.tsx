'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { useLight, type PageKey } from '@/lib/store'

const clamp01 = (x: number) => Math.min(1, Math.max(0, x))

/**
 * Watches every [data-chapter] section on the page. Sets the page theme (one
 * theme at a time, so text always sits on its own background), the chapter
 * counter, per-chapter scroll progress, and the keyframe blend for the rig:
 * the last 0.6 viewport of one chapter and the first 0.4 of the next
 * (docs/04 §4).
 */
export function ChapterTracker() {
  const pathname = usePathname()

  useEffect(() => {
    const page: PageKey =
      pathname === '/'
        ? 'home'
        : pathname === '/about'
          ? 'about'
          : pathname === '/contact'
            ? 'contact'
            : pathname.startsWith('/poster')
              ? 'poster'
              : 'other'
    const { set } = useLight.getState()
    set({ page })

    let raf = 0
    const compute = () => {
      raf = 0
      const els = Array.from(document.querySelectorAll<HTMLElement>('main [data-chapter]'))
      const html = document.documentElement
      const override = useLight.getState().themeOverride
      if (!els.length) {
        const key = page === 'other' ? 'other' : page
        html.dataset.theme = override ?? 'white'
        set({ chapterKey: key, blend: { from: key, to: key, t: 0 } })
        return
      }
      const vh = window.innerHeight
      const focus = vh * 0.5
      const progress: Record<string, number> = {}
      const pin: Record<string, number> = {}
      const rects = els.map((el) => el.getBoundingClientRect())
      let current = -1
      els.forEach((el, i) => {
        const r = rects[i]
        const key = el.dataset.chapter!
        progress[key] = clamp01((focus - r.top) / r.height)
        pin[key] = clamp01(-r.top / Math.max(1, r.height - vh))
        if (r.top <= focus && r.bottom > focus) current = i
      })
      if (current === -1) current = rects[0].top > focus ? 0 : els.length - 1
      const keyOf = (i: number) => els[i].dataset.keyframe ?? els[i].dataset.chapter!
      const r = rects[current]
      const toEnd = (r.bottom - focus) / vh
      const fromStart = (focus - r.top) / vh
      let blend = { from: keyOf(current), to: keyOf(current), t: 0 }
      if (toEnd < 0.6 && current < els.length - 1) blend = { from: keyOf(current), to: keyOf(current + 1), t: clamp01(0.6 - toEnd) }
      else if (fromStart < 0.4 && current > 0) blend = { from: keyOf(current - 1), to: keyOf(current), t: clamp01(0.6 + fromStart) }
      if (blend.from === blend.to) blend.t = 0

      const el = els[current]
      html.dataset.theme = override ?? el.dataset.chapterTheme ?? 'white'
      const footer = document.querySelector<HTMLElement>('.site-footer')
      const footerLift = footer ? Math.max(0, vh - footer.getBoundingClientRect().top) / vh : 0
      set({
        footerLift,
        chapterKey: el.dataset.chapter!,
        chapterN: Number(el.dataset.n) || 0,
        blend,
        progress,
        pin,
      })
    }
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(compute)
    }
    // Wait a frame so the new page's sections are in the DOM.
    const first = requestAnimationFrame(compute)
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    const unsub = useLight.subscribe((s, prev) => {
      if (s.themeOverride !== prev.themeOverride) schedule()
    })
    const ro = new ResizeObserver(schedule)
    ro.observe(document.body)
    return () => {
      cancelAnimationFrame(first)
      if (raf) cancelAnimationFrame(raf)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      unsub()
      ro.disconnect()
    }
  }, [pathname])

  return null
}
