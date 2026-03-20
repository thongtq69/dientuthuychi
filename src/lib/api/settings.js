import 'server-only'

import { unstable_cache } from 'next/cache'

import {
  categoryRailItems,
  footerCertification,
  footerContactInfo,
  footerPolicyLinks,
  footerServiceLinks,
  footerShowrooms,
  marketplaceLinks,
  navItems,
  paymentBadges,
  siteMeta,
  socialLinks,
  storeBenefits,
  storeLocations,
  supportPanels,
  trustBadges,
  utilityLinks,
} from '@/data/siteData'
import { coerceArray, getMediaUrl, isPopulatedDoc, richTextToParagraphs, withPayloadFallback } from '@/lib/api/shared'

const resolveLogoUrl = (logo) => {
  if (isPopulatedDoc(logo)) {
    return getMediaUrl(logo)
  }

  if (typeof logo === 'string' && logo.startsWith('/')) {
    return logo
  }

  return null
}

const getLocalSettings = () => ({
  siteMeta,
  utilityLinks,
  navItems,
  categoryRailItems,
  storeBenefits,
  trustBadges,
  socialLinks,
  marketplaceLinks,
  paymentBadges,
  footerServiceLinks,
  footerPolicyLinks,
  footerContactInfo,
  footerShowrooms,
  footerCertification,
  storeLocations,
  supportPanels,
  promotion: {
    active: false,
    title: '',
    content: [],
    banner: null,
    linkedProducts: [],
    linkedBanners: [],
  },
  source: 'local',
})

const normalizeSettings = (settings, promotion) => {
  const phone = settings?.contact?.phone || settings?.phone || siteMeta.hotline
  const hotline = settings?.contact?.hotline || settings?.hotline || siteMeta.hotline
  const email = settings?.contact?.email || settings?.email || siteMeta.email
  const address = settings?.contact?.address || settings?.address || siteMeta.address
  const workingHours = settings?.contact?.workingHours || settings?.workingHours || siteMeta.supportHours
  const logo = resolveLogoUrl(settings?.logo) || siteMeta.logo

  return {
    siteMeta: {
      name: settings?.siteName || siteMeta.name,
      tagline: siteMeta.tagline,
      hotline,
      phone,
      address,
      supportHours: workingHours,
      searchPlaceholder: siteMeta.searchPlaceholder,
      email,
      logo,
      favicon: getMediaUrl(settings?.favicon),
    },
    utilityLinks,
    navItems,
    categoryRailItems,
    storeBenefits,
    trustBadges,
    socialLinks: [
      ...(settings?.social?.facebook ? [{ title: 'Facebook', href: settings.social.facebook, image: '/images/footer-assets/facebook.png' }] : []),
      ...(settings?.social?.tiktok ? [{ title: 'TikTok', href: settings.social.tiktok, image: '/images/footer-tiktok.svg' }] : []),
      ...socialLinks.filter((item) => !['Facebook', 'TikTok'].includes(item.title)),
    ],
    marketplaceLinks,
    paymentBadges,
    footerServiceLinks,
    footerPolicyLinks,
    footerContactInfo: [
      { label: 'Địa chỉ', value: address, note: '' },
      { label: 'Hotline', value: hotline, note: '' },
      { label: 'Email', value: email, note: '' },
      { label: 'Thời gian', value: workingHours, note: '' },
    ],
    footerShowrooms: {
      ...footerShowrooms,
      locations: [settings?.footer?.address || address],
    },
    footerCertification,
    storeLocations: [address, ...storeLocations.filter((item) => item !== address)],
    supportPanels,
    contact: settings?.contact || null,
    social: settings?.social || null,
    header: settings?.header || null,
    footer: settings?.footer || null,
    seo: settings?.seo || null,
    payment: settings?.payment || null,
    integrations: settings?.integrations || null,
    promotion: {
      active: Boolean(promotion?.active),
      title: promotion?.title || '',
      content: richTextToParagraphs(promotion?.content),
      banner: getMediaUrl(promotion?.banner),
      linkedProducts: coerceArray(promotion?.linkedProducts),
      linkedBanners: coerceArray(promotion?.linkedBanners),
      startAt: promotion?.startAt || null,
      endAt: promotion?.endAt || null,
    },
    source: 'payload',
  }
}

const siteSettingsCache = new Map()

const getSiteSettingsCached = async (mode = '') => {
  if (!siteSettingsCache.has(mode)) {
    siteSettingsCache.set(mode, unstable_cache(async () => {
      const result = await withPayloadFallback({
        mode,
        loadPayload: async (payload) => {
          const [settings, promotion] = await Promise.all([
            payload.findGlobal({ slug: 'site-settings', depth: 2, draft: false }),
            payload.findGlobal({ slug: 'promotions', depth: 2, draft: false }),
          ])

          return normalizeSettings(settings, promotion)
        },
        loadLocal: async () => getLocalSettings(),
        isPayloadUsable: (value) => Boolean(value?.siteMeta?.name),
      })

      return result.data
    }, ['storefront-settings', mode || 'default'], { revalidate: 300, tags: ['settings', 'promotions'] }))
  }

  return siteSettingsCache.get(mode)()
}

export const getSiteSettings = async (options = {}) => {
  return getSiteSettingsCached(options.mode || '')
}

export const getPromotionSettings = async (options = {}) => {
  const settings = await getSiteSettings(options)
  return settings.promotion
}

export const getSettingsDataInterface = () => {
  return {
    settings: 'getSiteSettings(options)',
    promotion: 'getPromotionSettings(options)',
    fallback: 'Site settings and promotions read Payload globals first, then merge onto existing storefront fallback data for header/footer/support sections.',
  }
}
