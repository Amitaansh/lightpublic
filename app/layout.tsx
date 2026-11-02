import type { Metadata, Viewport } from 'next'
import { Archivo, Hedvig_Letters_Serif } from 'next/font/google'
import type { ReactNode } from 'react'
import { ChapterTracker } from '@/components/shell/ChapterTracker'
import { CursorFollower } from '@/components/shell/CursorFollower'
import { Footer } from '@/components/shell/Footer'
import { Header } from '@/components/shell/Header'
import { Loader } from '@/components/shell/Loader'
import { MotionInit } from '@/components/shell/Motion'
import { PageTransition } from '@/components/shell/PageTransition'
import { SceneLayer } from '@/components/shell/SceneLayer'
import { SmoothScroll } from '@/components/shell/SmoothScroll'
import { site } from '@/content/site'
import './globals.css'

// Free fonts from the references (brief §6.3), self-hosted at build time.
const archivo = Archivo({ subsets: ['latin'], axes: ['wdth'], variable: '--font-archivo', display: 'swap' })
const hedvig = Hedvig_Letters_Serif({ subsets: ['latin'], axes: ['opsz'], variable: '--font-hedvig', display: 'swap' })

export const metadata: Metadata = {
  title: { default: 'L.I.G.H.T: a sensing baton for the white cane', template: '%s · L.I.G.H.T' },
  description: site.description,
  applicationName: 'L.I.G.H.T',
  openGraph: {
    title: 'L.I.G.H.T: a sensing baton for the white cane',
    description: site.description,
    type: 'website',
    locale: 'en_GB',
  },
  robots: { index: true, follow: true },
}

export const viewport: Viewport = {
  themeColor: '#233ccd',
  width: 'device-width',
  initialScale: 1,
}

/**
 * Runs before first paint: marks JS as available, applies the saved motion
 * preference (or prefers-reduced-motion), and skips the loader on repeat
 * visits in this session. No cookies.
 */
const bootScript = `(function(){var d=document.documentElement;d.classList.remove('no-js');d.classList.add('js');var m=null;try{m=localStorage.getItem('light-motion')}catch(e){}var r=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;d.dataset.motion=m||(r?'off':'on');try{if(sessionStorage.getItem('light-loaded'))d.classList.add('skip-loader')}catch(e){}})();`

export default function RootLayout({ children, modal }: { children: ReactNode; modal: ReactNode }) {
  return (
    <html
      lang="en-GB"
      className={`no-js ${archivo.variable} ${hedvig.variable}`}
      data-theme="white"
      data-motion="on"
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <MotionInit />
        <SmoothScroll />
        <ChapterTracker />
        <SceneLayer />
        <Header />
        <main id="main" tabIndex={-1}>
          {children}
        </main>
        <Footer />
        {modal}
        <div className="viewport-frame" aria-hidden="true" />
        <CursorFollower />
        <PageTransition />
        <Loader />
      </body>
    </html>
  )
}
