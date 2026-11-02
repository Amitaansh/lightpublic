import { notFound } from 'next/navigation'
import { PosterMode } from './PosterMode'

export const dynamic = 'force-dynamic'

/**
 * Renders one baton state, centred, on a transparent background, for
 * scripts/render-posters.mjs. Only available when POSTER_MODE=1.
 */
export default async function PosterPage({ searchParams }: { searchParams: Promise<{ name?: string }> }) {
  if (process.env.POSTER_MODE !== '1') notFound()
  const { name } = await searchParams
  return <PosterMode name={name ?? 'hero'} />
}
