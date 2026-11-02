'use client'

import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { createElement, useEffect, useRef, type ReactNode } from 'react'
import { useLight } from '@/lib/store'

gsap.registerPlugin(ScrollTrigger, SplitText)

type Props = {
  as?: 'h1' | 'h2' | 'h3' | 'p'
  id?: string
  className?: string
  children: ReactNode
  /** Reveal immediately instead of on scroll (hero). */
  immediate?: boolean
}

/**
 * Line-mask reveal (R6): each line rises from behind a mask. SplitText keeps
 * the heading's text available to screen readers (aria: 'auto'). Plain text
 * when motion is off.
 */
export function LineReveal({ as = 'h2', id, className, children, immediate }: Props) {
  const ref = useRef<HTMLElement>(null)
  const motion = useLight((s) => s.motion)
  const loaderDone = useLight((s) => s.loaderDone)

  useEffect(() => {
    const el = ref.current
    if (!el || motion === 'off') return
    if (immediate && !loaderDone) {
      el.style.visibility = 'hidden'
      return
    }
    el.style.visibility = ''
    let anim: gsap.core.Tween | undefined
    const split = SplitText.create(el, {
      type: 'lines',
      mask: 'lines',
      linesClass: 'line',
      aria: 'auto',
      autoSplit: true,
      onSplit(self) {
        anim?.kill()
        anim = gsap.from(self.lines, {
          yPercent: 105,
          duration: 0.9,
          ease: 'expo.out',
          stagger: 0.08,
          scrollTrigger: immediate ? undefined : { trigger: el, start: 'top 88%', once: true },
        })
        return anim
      },
    })
    return () => {
      anim?.scrollTrigger?.kill()
      anim?.kill()
      split.revert()
    }
  }, [motion, immediate, loaderDone])

  return createElement(as, { ref, id, className: `line-reveal ${className ?? ''}` }, children)
}
