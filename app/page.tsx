import fs from 'node:fs'
import path from 'node:path'
import { CaneClip } from '@/components/chapters/CaneClip'
import { GuideNotes } from '@/components/chapters/GuideNotes'
import { Haptics } from '@/components/chapters/Haptics'
import { Hero } from '@/components/chapters/Hero'
import { Inside } from '@/components/chapters/Inside'
import { Closing, Prototype, Timeline, WhyItMatters } from '@/components/chapters/Later'
import { Mockups } from '@/components/chapters/Mockups'
import { Reliability } from '@/components/chapters/Reliability'
import { RouteMemory } from '@/components/chapters/RouteMemory'
import { Stop } from '@/components/chapters/Stop'
import { WhatItAdds } from '@/components/chapters/WhatItAdds'

/** The hero page: the whole story in 14 chapters (docs/04 §3). */
export default function Home() {
  const screenshot = fs.existsSync(path.join(process.cwd(), 'public', 'media', 'prototype.webp'))
  return (
    <>
      <Hero />
      <WhatItAdds />
      <CaneClip />
      <Reliability />
      <GuideNotes />
      <RouteMemory />
      <Haptics />
      <Stop />
      <Inside />
      <Mockups />
      <Prototype screenshot={screenshot} />
      <WhyItMatters />
      <Timeline />
      <Closing />
    </>
  )
}
