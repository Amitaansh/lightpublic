'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { forwardRef, useEffect, useRef, useState, type ComponentProps } from 'react'
import { scrollToTop } from '@/lib/scroll'
import { useLight } from '@/lib/store'

const EVENT = 'light:navigate'
const WIPE_MS = 420

/**
 * A link between pages that plays the blue wipe (brief §6.7) while the baton
 * flies to the next page's pose. Same-page anchors and modified clicks behave
 * like normal links.
 */
export const TransitionLink = forwardRef<HTMLAnchorElement, ComponentProps<typeof Link> & { href: string }>(
  function TransitionLink({ href, onClick, ...rest }, ref) {
    const pathname = usePathname()
    return (
      <Link
        ref={ref}
        href={href}
        onClick={(e) => {
          onClick?.(e)
          if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return
          const target = new URL(href, window.location.href)
          if (target.pathname === pathname) return
          if (useLight.getState().motion === 'off') return
          e.preventDefault()
          window.dispatchEvent(new CustomEvent(EVENT, { detail: href }))
        }}
        {...rest}
      />
    )
  },
)

export function PageTransition() {
  const router = useRouter()
  const pathname = usePathname()
  const [state, setState] = useState<'idle' | 'in' | 'out'>('idle')
  const first = useRef(true)
  const navigating = useRef(false)

  useEffect(() => {
    const onNav = (e: Event) => {
      const href = (e as CustomEvent<string>).detail
      navigating.current = true
      setState('in')
      window.setTimeout(() => router.push(href), WIPE_MS)
    }
    window.addEventListener(EVENT, onNav)
    return () => window.removeEventListener(EVENT, onNav)
  }, [router])

  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    // Contact opens as a dialog: leave the page where it is.
    if (pathname === '/contact') return
    const hash = window.location.hash
    if (!hash) scrollToTop()
    // Move focus to the new page's heading (or the anchor target).
    requestAnimationFrame(() => {
      const target = (hash && document.getElementById(hash.slice(1))) || document.querySelector<HTMLElement>('main h1')
      if (target) {
        if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1')
        target.focus({ preventScroll: Boolean(!hash) })
      }
    })
    if (navigating.current) {
      navigating.current = false
      setState('out')
      const t = window.setTimeout(() => setState('idle'), WIPE_MS + 40)
      return () => window.clearTimeout(t)
    }
  }, [pathname])

  return <div className="page-wipe" data-state={state === 'idle' ? undefined : state} aria-hidden="true" />
}
