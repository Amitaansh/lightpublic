'use client'

import { useEffect } from 'react'
import { useLight } from '@/lib/store'

/** Posters shown on blue chapters get white diagram edges. */
const BLUE = ['what-it-adds', 'reliability', 'route-memory', 'stop', 'mockups', 'why', 'contact-cta', 'about', 'gallery']

export function PosterMode({ name }: { name: string }) {
  useEffect(() => {
    const html = document.documentElement
    html.classList.add('poster-mode')
    const blue = BLUE.some((b) => name.startsWith(b))
    useLight.getState().set({ poster: name, loaderDone: true, themeOverride: blue ? 'blue' : 'white' })
    let t: number | undefined
    const unsub = useLight.subscribe((s) => {
      if (s.sceneReady && !t) t = window.setTimeout(() => (html.dataset.posterReady = '1'), 900)
    })
    if (useLight.getState().sceneReady) t = window.setTimeout(() => (html.dataset.posterReady = '1'), 900)
    return () => {
      unsub()
      window.clearTimeout(t)
      html.classList.remove('poster-mode')
      delete html.dataset.posterReady
    }
  }, [name])
  return <p className="visually-hidden">Poster: {name}</p>
}
