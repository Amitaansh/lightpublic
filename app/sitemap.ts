import type { MetadataRoute } from 'next'

const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://beyourlight.vercel.app'

export default function sitemap(): MetadataRoute.Sitemap {
  return ['/', '/about', '/contact'].map((p) => ({ url: `${base}${p}`, changeFrequency: 'monthly', priority: p === '/' ? 1 : 0.6 }))
}
