import type { Metadata, Viewport } from 'next'
import { Hedvig_Letters_Serif } from 'next/font/google'
import localFont from 'next/font/local'
import type { ReactNode } from 'react'
import { CursorFollower } from '@/components/shell/CursorFollower'
import { Footer } from '@/components/shell/Footer'
import { Header } from '@/components/shell/Header'
import { Loader } from '@/components/shell/Loader'
import { MotionInit } from '@/components/shell/Motion'
import { PageState } from '@/components/shell/PageState'
import { PageTransition } from '@/components/shell/PageTransition'
import { SceneLayer } from '@/components/shell/SceneLayer'
import { SmoothScroll } from '@/components/shell/SmoothScroll'
import { site } from '@/content/site'
import './globals.css'

// Two fonts only (founder, 11-02): Hedvig Letters Serif and Switzer.
const hedvig = Hedvig_Letters_Serif({ subsets: ['latin'], axes: ['opsz'], variable: '--font-hedvig', display: 'swap' })
const switzer = localFont({
  src: './fonts/Switzer-Variable.woff2',
  weight: '100 900',
  variable: '--font-switzer',
  display: 'swap',
})

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
}

export const viewport: Viewport = {
  themeColor: '#151515',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
}

/** Before first paint: JS flag, motion preference, loader skip. No cookies. */
const bootScript = `(function(){var d=document.documentElement;d.classList.remove('no-js');d.classList.add('js');var m=null;try{m=localStorage.getItem('light-motion')}catch(e){}var r=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;d.dataset.motion=m||(r?'off':'on');try{if(sessionStorage.getItem('light-loaded'))d.classList.add('skip-loader')}catch(e){}})();`

export default function RootLayout({ children, modal }: { children: ReactNode; modal: ReactNode }) {
  return (
    <html lang="en-GB" className={`no-js ${hedvig.variable} ${switzer.variable}`} data-motion="on" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <MotionInit />
        <PageState />
        <SmoothScroll />
        <SceneLayer />
        <Header />
        <main id="main" tabIndex={-1}>
          {children}
        </main>
        <Footer />
        {modal}
        <CursorFollower />
        <PageTransition />
        <Loader />
      </body>
    </html>
  )
}
