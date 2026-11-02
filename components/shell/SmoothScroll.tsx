'use client'

import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { useEffect } from 'react'
import { getLenis, setLenis } from '@/lib/scroll'
import { useLight } from '@/lib/store'

gsap.registerPlugin(ScrollTrigger)

/**
 * Lenis smooth scroll, driven by GSAP's ticker so ScrollTrigger stays in step.
 * Off when motion is off (native scroll). Stops while a dialog is open.
 */
export function SmoothScroll() {
  const motion = useLight((s) => s.motion)
  const dialogOpen = useLight((s) => s.dialogOpen)

  useEffect(() => {
    if (motion === 'off') return
    const lenis = new Lenis({ lerp: 0.09, anchors: false, autoRaf: false, syncTouch: false })
    setLenis(lenis)
    lenis.on('scroll', ScrollTrigger.update)
    const tick = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    return () => {
      gsap.ticker.remove(tick)
      lenis.destroy()
      setLenis(null)
    }
  }, [motion])

  useEffect(() => {
    const l = getLenis()
    if (!l) return
    if (dialogOpen) l.stop()
    else l.start()
  }, [dialogOpen])

  return null
}
