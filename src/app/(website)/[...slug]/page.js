import { notFound } from 'next/navigation'

import { CmsLandingPage } from '@/components/CmsLandingPage'
import { getStaticPageData, getStaticPageSlugs } from '@/lib/api/content'

export async function generateStaticParams() {
  const slugs = await getStaticPageSlugs()
  return slugs.map((slug) => ({ slug: slug.split('/').filter(Boolean) }))
}

export default async function StaticPage({ params }) {
  const resolved = await params
  const slug = Array.isArray(resolved?.slug) ? resolved.slug.join('/') : resolved?.slug
  const page = await getStaticPageData(slug)

  if (!page) notFound()

  return <CmsLandingPage page={page} />
}
