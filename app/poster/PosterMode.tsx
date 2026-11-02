'use client'

import { useEffect } from 'react'
import { useLight } from '@/lib/store'

export function PosterMode({ t, lightsOut }: { t: number; lightsOut: boolean }) {
  useEffect(() => {
    const html = document.documentElement
    html.classList.add('poster-mode')
    useLight.getState().set({ poster: t, lightsOut, loaderDone: true })
    let timer: number | undefined
    const ready = () => {
      if (!timer) timer = window.setTimeout(() => (html.dataset.posterReady = '1'), 1600)
    }
    const unsub = useLight.subscribe((s) => s.sceneReady && ready())
    if (useLight.getState().sceneReady) ready()
    return () => {
      unsub()
      window.clearTimeout(timer)
      html.classList.remove('poster-mode')
      delete html.dataset.posterReady
      useLight.getState().set({ poster: null })
    }
  }, [t, lightsOut])
  return <p className="visually-hidden">Poster at film position {t}</p>
}
