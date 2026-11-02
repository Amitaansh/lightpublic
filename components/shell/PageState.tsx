'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { useLight, type PageKey } from '@/lib/store'

/** Tracks which page is showing, and mirrors the room-lights state onto <html>. */
export function PageState() {
  const pathname = usePathname()
  const lightsOut = useLight((s) => s.lightsOut)

  useEffect(() => {
    const page: PageKey =
      pathname === '/' ? 'home' : pathname === '/about' ? 'about' : pathname === '/contact' ? 'contact' : pathname.startsWith('/poster') ? 'poster' : 'other'
    useLight.getState().set({ page })
  }, [pathname])

  useEffect(() => {
    document.documentElement.dataset.lights = lightsOut ? 'out' : 'on'
  }, [lightsOut])

  return null
}
