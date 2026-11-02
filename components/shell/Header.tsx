'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useLight } from '@/lib/store'
import { MotionToggle } from './Motion'
import { TransitionLink } from './PageTransition'

/** Room lights on/off: the keyboard and screen-reader route to what clicking the baton does. */
function LightsToggle() {
  const lightsOut = useLight((s) => s.lightsOut)
  const toggle = useLight((s) => s.toggleLights)
  return (
    <button type="button" className="pill" aria-pressed={lightsOut} onClick={toggle}>
      <span className="pill__dot" aria-hidden="true" />
      <span className="pill__text">Lights out</span>
      <span className="visually-hidden">: the baton’s light ring lights the scene</span>
    </button>
  )
}

export function Header() {
  const pathname = usePathname()
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    let last = window.scrollY
    const onScroll = () => {
      const y = window.scrollY
      if (Math.abs(y - last) < 8) return
      setHidden(y > last && y > 200)
      last = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className="site-header" data-hidden={hidden}>
      <TransitionLink href="/" className="wordmark" aria-label="L.I.G.H.T, home">
        <span aria-hidden="true">
          L<span className="wordmark__dot">.</span>I<span className="wordmark__dot">.</span>G<span className="wordmark__dot">.</span>H
          <span className="wordmark__dot">.</span>T
        </span>
      </TransitionLink>
      <nav className="header-nav" aria-label="Site">
        <TransitionLink href="/about" aria-current={pathname === '/about' ? 'page' : undefined}>
          About
        </TransitionLink>
        <Link href="/contact" data-cursor="write">
          Contact
        </Link>
      </nav>
      <div className="header-tools">
        <LightsToggle />
        <MotionToggle />
      </div>
    </header>
  )
}
