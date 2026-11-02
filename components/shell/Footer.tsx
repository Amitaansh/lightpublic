import Link from 'next/link'
import { site } from '@/content/site'
import { TransitionLink } from './PageTransition'

/** Full-bleed blue footer (R3, docs/04 §2.3). */
export function Footer() {
  return (
    <footer className="site-footer" data-theme="blue">
      <div className="site-footer__grid">
        <div>
          <p className="wordmark" aria-hidden="true">
            L<span className="wordmark__dot">.</span>I<span className="wordmark__dot">.</span>G<span className="wordmark__dot">.</span>H
            <span className="wordmark__dot">.</span>T
          </p>
          <p className="visually-hidden">L.I.G.H.T</p>
          <p className="mt-3 measure">{site.oneLiner}</p>
        </div>
        <nav aria-labelledby="footer-product">
          <h2 id="footer-product">The product</h2>
          <ul>
            <li><TransitionLink href="/#what-it-adds">What it adds</TransitionLink></li>
            <li><TransitionLink href="/#cane">Clips onto your cane</TransitionLink></li>
            <li><TransitionLink href="/#reliability">Never fails silently</TransitionLink></li>
            <li><TransitionLink href="/#guide-notes">Guide Notes</TransitionLink></li>
            <li><TransitionLink href="/#route-memory">Route Memory</TransitionLink></li>
            <li><TransitionLink href="/#inside">Inside the baton</TransitionLink></li>
          </ul>
        </nav>
        <nav aria-labelledby="footer-project">
          <h2 id="footer-project">The project</h2>
          <ul>
            <li><TransitionLink href="/about">About</TransitionLink></li>
            <li><TransitionLink href="/#prototype">The software prototype</TransitionLink></li>
            <li><TransitionLink href="/#timeline">Where we are</TransitionLink></li>
            <li>
              <Link href="/contact" data-cursor="open">
                Get in touch
              </Link>
            </li>
          </ul>
        </nav>
        <div>
          <h2>Small print</h2>
          <p>
            <small>{site.smallPrint}</small>
          </p>
          <p className="mt-3">
            <small>© 2026 L.I.G.H.T</small>
          </p>
        </div>
      </div>
    </footer>
  )
}
