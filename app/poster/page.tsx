import { notFound } from 'next/navigation'
import { PosterMode } from './PosterMode'

export const dynamic = 'force-dynamic'

/**
 * Renders one moment of the film, frozen, for scripts/render-posters.mjs.
 * Only available when POSTER_MODE=1.
 */
export default async function PosterPage({ searchParams }: { searchParams: Promise<{ t?: string; lights?: string }> }) {
  if (process.env.POSTER_MODE !== '1') notFound()
  const { t, lights } = await searchParams
  return <PosterMode t={Number(t ?? 0)} lightsOut={lights === 'out'} />
}
