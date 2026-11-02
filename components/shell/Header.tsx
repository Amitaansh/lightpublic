'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { CHAPTER_COUNT, NAV_ITEMS } from '@/lib/chapters'
import { useLight } from '@/lib/store'
import { MotionToggle } from './Motion'
import { TransitionLink } from './PageTransition'

function Wordmark() {
  return (
    <TransitionLink href="/" className="wordmark" aria-label="L.I.G.H.T, home">
      <span aria-hidden="true">
        L<span className="wordmark__dot">.</span>I<span className="wordmark__dot">.</span>G
        <span className="wordmark__dot">.</span>H<span className="wordmark__dot">.</span>T
      </span>
    </TransitionLink>
  )
}

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()
  const chapterKey = useLight((s) => s.chapterKey)
  return (
    <ol>
      {NAV_ITEMS.map((item) => {
        const isPage = item.href === pathname
        const isLocation = pathname === '/' && item.chapters.includes(chapterKey)
        const current = isPage ? ('page' as const) : isLocation ? ('location' as const) : undefined
        const samePageAnchor = pathname === '/' && item.href.startsWith('/#')
        return (
          <li key={item.label}>
            {samePageAnchor ? (
              <a href={item.href.slice(1)} aria-current={current} onClick={onNavigate}>
                {item.label}
              </a>
            ) : (
              <TransitionLink href={item.href} aria-current={current} onClick={onNavigate}>
                {item.label}
              </TransitionLink>
            )}
          </li>
        )
      })}
      <li>
        <Link href="/contact" onClick={onNavigate} data-cursor="open">
          Contact
        </Link>
      </li>
    </ol>
  )
}

export function Header() {
  const [hidden, setHidden] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const dialog = useRef<HTMLDialogElement>(null)
  const menuButton = useRef<HTMLButtonElement>(null)
  const chapterN = useLight((s) => s.chapterN)
  const page = useLight((s) => s.page)

  useEffect(() => {
    let last = window.scrollY
    const onScroll = () => {
      const y = window.scrollY
      if (Math.abs(y - last) < 6) return
      setHidden(y > last && y > 160)
      last = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const d = dialog.current
    if (!d) return
    if (menuOpen && !d.open) d.showModal()
    if (!menuOpen && d.open) d.close()
  }, [menuOpen])

  return (
    <header className="site-header" data-hidden={hidden}>
      <Wordmark />
      <nav className="index-nav" aria-label="Sections">
        <NavLinks />
      </nav>
      <div className="header-tools">
        {page === 'home' && chapterN > 0 && (
          <span className="chapter-counter" aria-hidden="true">
            ({String(chapterN).padStart(2, '0')}/{CHAPTER_COUNT})
          </span>
        )}
        <MotionToggle />
        <button
          ref={menuButton}
          type="button"
          className="pill-toggle menu-button"
          aria-haspopup="dialog"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(true)}
        >
          Menu
        </button>
      </div>
      <dialog
        ref={dialog}
        className="mobile-menu"
        aria-label="Menu"
        data-theme="blue"
        onClose={() => {
          setMenuOpen(false)
          menuButton.current?.focus()
        }}
      >
        <div className="flex items-center justify-between">
          <span className="wordmark" aria-hidden="true">
            L.I.G.H.T
          </span>
          <button type="button" className="pill-toggle" onClick={() => setMenuOpen(false)}>
            Close
          </button>
        </div>
        <nav aria-label="Sections">
          <NavLinks onNavigate={() => setMenuOpen(false)} />
        </nav>
      </dialog>
    </header>
  )
}
