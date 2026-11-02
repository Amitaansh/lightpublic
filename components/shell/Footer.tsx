import Link from 'next/link'
import { site } from '@/content/site'
import { TransitionLink } from './PageTransition'

export function Footer() {
  return (
    <footer className="site-footer">
      <p className="measure">{site.smallPrint}</p>
      <nav aria-label="Footer">
        <TransitionLink href="/about">About</TransitionLink>
        <Link href="/contact" data-cursor="write">
          Get in touch
        </Link>
        <span>© 2026 L.I.G.H.T</span>
      </nav>
    </footer>
  )
}
