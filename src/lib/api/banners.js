import 'server-only'

import { featuredCategories, heroSlides, midPageBanners } from '@/data/siteData'
import { DEFAULT_QUERY_LIMIT, coerceArray, getMediaUrl, withPayloadFallback } from '@/lib/api/shared'

const LOCAL_BANNER_FALLBACKS = {
  'home-hero': heroSlides,
  'home-featured-category': featuredCategories,
  'home-mid': midPageBanners,
}

const normalizeBanner = (banner) => ({
  id: banner?.id,
  key: banner?.key || banner?.slug,
  slug: banner?.slug || banner?.key,
  title: banner?.title || '',
  image: getMediaUrl(banner?.image) || banner?.image || null,
  mobileImage: getMediaUrl(banner?.mobileImage) || banner?.mobileImage || getMediaUrl(banner?.image) || banner?.image || null,
  href: banner?.link || banner?.ctaHref || banner?.href || '/',
  ctaHref: banner?.link || banner?.ctaHref || banner?.href || '/',
  position: banner?.position || 'home-hero',
  active: banner?.active ?? true,
  startAt: banner?.startAt || null,
  endAt: banner?.endAt || null,
  order: Number(banner?.sortOrder ?? banner?.order ?? 0),
  sourceUrl: banner?.sourceUrl || null,
})

const isBannerActive = (banner) => {
  if (!banner?.active) return false

  const now = Date.now()
  const startAt = banner?.startAt ? new Date(banner.startAt).getTime() : null
  const endAt = banner?.endAt ? new Date(banner.endAt).getTime() : null

  if (startAt && startAt > now) return false
  if (endAt && endAt < now) return false

  return true
}

export const getBanners = async (options = {}) => {
  const result = await withPayloadFallback({
    mode: options.mode,
    loadPayload: async (payload) => {
      const response = await payload.find({
        collection: 'banners',
        depth: 2,
        draft: false,
        limit: DEFAULT_QUERY_LIMIT,
        sort: 'sortOrder',
      })

      return coerceArray(response?.docs).map(normalizeBanner).filter(isBannerActive)
    },
    loadLocal: async () => Object.entries(LOCAL_BANNER_FALLBACKS).flatMap(([position, items]) => items.map((item, index) => normalizeBanner({ ...item, position, order: index }))),
    isPayloadUsable: (docs) => Array.isArray(docs) && docs.length > 0,
  })

  return result.data
}

export const getBannersByPosition = async (position, options = {}) => {
  const banners = await getBanners(options)
  const matches = banners.filter((banner) => banner.position === position)

  if (matches.length > 0) {
    return matches.sort((left, right) => left.order - right.order)
  }

  return coerceArray(LOCAL_BANNER_FALLBACKS[position]).map((item, index) => normalizeBanner({ ...item, position, order: index }))
}

export const getHeroBanners = async (options = {}) => getBannersByPosition('home-hero', options)

export const getFeaturedCategoryBanners = async (options = {}) => getBannersByPosition('home-featured-category', options)

export const getMidPageBanners = async (options = {}) => getBannersByPosition('home-mid', options)

export const getBannerDataInterface = () => {
  return {
    list: 'getBanners(options)',
    byPosition: 'getBannersByPosition(position, options)',
    hero: 'getHeroBanners(options)',
    featuredCategories: 'getFeaturedCategoryBanners(options)',
    midPage: 'getMidPageBanners(options)',
    fallback: 'Payload banner positions `home-hero`, `home-featured-category`, and `home-mid` automatically fall back to local storefront arrays.',
  }
}
