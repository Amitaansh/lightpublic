'use client'

import { useState } from 'react'
import { useLight } from '@/lib/store'

/**
 * Static tier (brief §10.2): a pre-rendered poster of the baton in this
 * chapter's state, shown when there is no WebGL, motion is off, or JS is off.
 * Rendered by scripts/render-posters.mjs. The chapter's text already
 * describes the scene, so the image is decorative unless `alt` is given.
 */
export function ChapterPoster({ name, alt = '' }: { name: string; alt?: string }) {
  const tier = useLight((s) => s.tier)
  const [failed, setFailed] = useState(false)
  const src = `/posters/${name}.webp`
  return (
    <>
      {tier === 'static' && !failed && (
        // eslint-disable-next-line @next/next/no-img-element
        <img className="poster" src={src} alt={alt} width={900} height={900} loading="lazy" decoding="async" onError={() => setFailed(true)} />
      )}
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="poster" src={src} alt={alt} width={900} height={900} loading="lazy" />
      </noscript>
    </>
  )
}
