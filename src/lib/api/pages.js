import 'server-only'

import { siteMeta, storeLocations } from '@/data/siteData'
import { DEFAULT_QUERY_LIMIT, coerceArray, formatVietnameseDate, getMediaUrl, richTextToParagraphs, withPayloadFallback } from '@/lib/api/shared'

const LOCAL_PAGES = [
  {
    slug: 'he-thong-cua-hang',
    title: 'Hệ thống cửa hàng',
    hero: {
      title: 'Hệ thống cửa hàng',
      description: `Tư vấn nhanh: ${siteMeta.hotline} - ${siteMeta.supportHours}`,
      image: null,
    },
    blocks: storeLocations.map((location) => ({
      blockType: 'rich-text',
      title: 'Điểm bán',
      paragraphs: [location],
    })),
    seo: {
      title: `Hệ thống cửa hàng | ${siteMeta.name}`,
      description: siteMeta.address,
      image: siteMeta.logo,
    },
    source: 'local',
  },
]

const normalizePage = (page) => ({
  id: page?.id,
  slug: page?.slug,
  routePath: page?.routePath || page?.slug,
  title: page?.title,
  hero: {
    eyebrow: page?.hero?.eyebrow || '',
    title: page?.hero?.title || page?.title,
    description: page?.hero?.description || '',
    image: getMediaUrl(page?.hero?.image),
    banner: page?.hero?.banner || null,
    primaryLabel: page?.hero?.primaryLabel || '',
    primaryHref: page?.hero?.primaryHref || '',
    secondaryLabel: page?.hero?.secondaryLabel || '',
    secondaryHref: page?.hero?.secondaryHref || '',
  },
  blocks: coerceArray(page?.blocks).map((block) => ({
    ...block,
    image: getMediaUrl(block?.image),
    paragraphs: richTextToParagraphs(block?.content),
  })),
  content: page?.content,
  paragraphs: richTextToParagraphs(page?.content),
  seo: {
    title: page?.seo?.title || page?.seoTitle || page?.title,
    description: page?.seo?.description || page?.seoDescription || '',
    image: getMediaUrl(page?.seo?.image) || getMediaUrl(page?.hero?.image),
  },
  updatedAt: formatVietnameseDate(page?.updatedAt),
  source: 'payload',
})

export const getPages = async (options = {}) => {
  const result = await withPayloadFallback({
    mode: options.mode,
    loadPayload: async (payload) => {
      const response = await payload.find({
        collection: 'pages',
        depth: 2,
        draft: false,
        limit: DEFAULT_QUERY_LIMIT,
        sort: 'title',
      })

      return coerceArray(response?.docs).map(normalizePage)
    },
    loadLocal: async () => LOCAL_PAGES,
    isPayloadUsable: (docs) => Array.isArray(docs) && docs.length > 0,
  })

  return result.data
}

export const getPageBySlug = async (slug, options = {}) => {
  if (!slug) return null

  const result = await withPayloadFallback({
    mode: options.mode,
    loadPayload: async (payload) => {
      const response = await payload.find({
        collection: 'pages',
        depth: 2,
        draft: false,
        limit: 1,
        where: {
          or: [
            {
              routePath: {
                equals: slug,
              },
            },
            {
              slug: {
                equals: slug,
              },
            },
          ],
        },
      })

      return response?.docs?.[0] ? normalizePage(response.docs[0]) : null
    },
    loadLocal: async () => LOCAL_PAGES.find((page) => page.slug === slug) || null,
    isPayloadUsable: Boolean,
  })

  return result.data || null
}

export const getPageSlugs = async (options = {}) => {
  const pages = await getPages(options)
  return pages.map((page) => page.routePath || page.slug).filter(Boolean)
}

export const getPageDataInterface = () => {
  return {
    list: 'getPages(options)',
    bySlug: 'getPageBySlug(slug, options)',
    slugs: 'getPageSlugs(options)',
    fallback: 'Payload pages are preferred; local fallback currently keeps `he-thong-cua-hang` routable while Task 4 finishes content migration.',
  }
}
