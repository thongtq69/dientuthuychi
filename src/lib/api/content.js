import 'server-only'

import { cache } from 'react'

import { getBannersByPosition } from '@/lib/api/banners'
import { getPageBySlug, getPageSlugs } from '@/lib/api/pages'
import { getLatestPosts, getPostBySlug, getPostSlugs } from '@/lib/api/posts'
import { getPromotionSettings, getSiteSettings } from '@/lib/api/settings'

const DEFAULT_HERO_BANNERS = [
  {
    key: 'home-hero-default-1',
    title: 'Samsung Galaxy S26 Series',
    image: 'https://cdn.dienthoaigiakho.vn/photos/1773117620989-1968x790-main-banner-S26-1.jpg',
    mobileImage: 'https://cdn.dienthoaigiakho.vn/photos/1773117620989-1968x790-main-banner-S26-1.jpg',
    href: '/danh-muc/dien-thoai',
  },
  {
    key: 'home-hero-default-2',
    title: 'Galaxy Tab',
    image: 'https://cdn.dienthoaigiakho.vn/photos/1773028447455-top-colection-galaxy-tab.jpg',
    mobileImage: 'https://cdn.dienthoaigiakho.vn/photos/1773028447455-top-colection-galaxy-tab.jpg',
    href: '/danh-muc/tablet',
  },
]

const DEFAULT_FEATURED_BANNERS = [
  {
    key: 'home-featured-default-1',
    title: 'Galaxy A Series',
    image: 'https://cdn.dienthoaigiakho.vn/photos/1772705147684-390x490-Galaxy-A-Top-Collection-Banner-2-1.jpg',
    href: '/danh-muc/dien-thoai',
  },
  {
    key: 'home-featured-default-2',
    title: 'Tablet Android',
    image: 'https://cdn.dienthoaigiakho.vn/photos/1773028447455-top-colection-galaxy-tab.jpg',
    href: '/danh-muc/tablet',
  },
  {
    key: 'home-featured-default-3',
    title: 'Thu Cũ Đổi Mới',
    image: 'https://cdn.dienthoaigiakho.vn/photos/1765439122070-390x490_Top-Collection-Banner_thu-cu-doi-moi-new.jpg',
    href: '/thu-cu-doi-moi',
  },
  {
    key: 'home-featured-default-4',
    title: 'Phụ kiện công nghệ',
    image: 'https://cdn.dienthoaigiakho.vn/photos/1773028447455-top-colection-galaxy-tab.jpg',
    href: '/danh-muc/phu-kien',
  },
]

const DEFAULT_MID_BANNERS = [
  {
    key: 'home-mid-default-1',
    title: 'Banner tablet 1',
    image: 'https://cdn.dienthoaigiakho.vn/photos/1770690260094-Android-Adapt-xiaomi-reedmi-pad-2-pro-1.jpg',
    mobileImage: 'https://cdn.dienthoaigiakho.vn/photos/1770690260094-Android-Adapt-xiaomi-reedmi-pad-2-pro-1.jpg',
    href: '/danh-muc/tablet',
  },
  {
    key: 'home-mid-default-2',
    title: 'Banner tablet 2',
    image: 'https://cdn.dienthoaigiakho.vn/photos/1773028447455-top-colection-galaxy-tab.jpg',
    mobileImage: 'https://cdn.dienthoaigiakho.vn/photos/1773028447455-top-colection-galaxy-tab.jpg',
    href: '/danh-muc/tablet',
  },
]

const DEFAULT_SKY_BANNERS = [
  {
    key: 'home-sky-default-1',
    title: 'Sky Left',
    image: 'https://cdn.dienthoaigiakho.vn/photos/1772422775466-roll1-2.jpg',
    mobileImage: 'https://cdn.dienthoaigiakho.vn/photos/1772422775466-roll1-2.jpg',
    href: '/danh-muc/dien-thoai',
  },
  {
    key: 'home-sky-default-2',
    title: 'Sky Right',
    image: 'https://cdn.dienthoaigiakho.vn/photos/1773022062519-s26-pre-roll-1.jpg',
    mobileImage: 'https://cdn.dienthoaigiakho.vn/photos/1773022062519-s26-pre-roll-1.jpg',
    href: '/danh-muc/dien-thoai',
  },
]

const DEFAULT_GUIDE_VIDEOS = [
  {
    title: 'Cách bảo vệ quyền riêng tư khi sử dụng iPhone',
    image: 'https://bizweb.dktcdn.net/100/112/815/articles/cach-bao-ve-quyen-rieng-tu-khi-su-dung-iphone.jpg?v=1772597346313',
  },
  {
    title: '8 cách tăng chất lượng cuộc gọi iPhone',
    image: 'https://bizweb.dktcdn.net/100/112/815/articles/cach-chinh-am-luong-cuoc-goi-iphone.jpg?v=1772592151020',
  },
  {
    title: 'Không theo dõi lén nhưng vẫn biết vị trí người thân',
    image: 'https://bizweb.dktcdn.net/100/112/815/articles/cach-dinh-vi-iphone-nguoi-khac-1-viendidong.jpg?v=1772076769683',
  },
  {
    title: 'iPhone cũ có nên cập nhật iOS không?',
    image: 'https://bizweb.dktcdn.net/100/112/815/articles/1-1755309809-88-width740height495.jpg?v=1771819382840',
  },
]

const RESERVED_PAGE_SLUGS = new Set([
  'tin-tuc',
  'he-thong-cua-hang',
  'khuyen-mai',
  'thu-cu-doi-moi',
  'cart',
  'checkout',
  'tai-khoan',
  'tra-cuu-don-hang',
  'san-pham',
  'danh-muc',
])

const FALLBACK_PAGE_BUILDERS = {
  'khuyen-mai': (settings, promotion) => ({
    slug: 'khuyen-mai',
    title: 'Khuyến mãi',
    hero: {
      eyebrow: 'Ưu đãi nổi bật',
      title: promotion?.title || 'Khuyến mãi và chương trình ưu đãi',
      description: promotion?.content?.[0] || 'Trang khuyến mãi ưu tiên Payload promotions/pages nếu có và vẫn giữ landing page local ổn định khi dữ liệu CMS chưa đủ.',
      image: promotion?.banner || DEFAULT_MID_BANNERS[0].image,
      primaryLabel: 'Xem sản phẩm giảm giá',
      primaryHref: '/danh-muc/khuyen-mai',
    },
    blocks: promotion?.content?.length
      ? promotion.content.map((paragraph, index) => ({
          id: `promotion-content-${index}`,
          blockType: 'rich-text',
          title: index === 0 ? 'Thông tin chương trình' : '',
          paragraphs: [paragraph],
        }))
      : [
          {
            id: 'promotion-fallback',
            blockType: 'rich-text',
            title: 'Tổng hợp nhanh ưu đãi',
            paragraphs: ['Landing page này giữ tuyến nội dung khuyến mãi không bị 404 trong lúc dữ liệu Payload chưa đầy đủ.'],
          },
        ],
    seo: {
      title: `Khuyến mãi | ${settings.siteMeta.name}`,
      description: promotion?.content?.[0] || 'Tổng hợp chương trình ưu đãi và trang landing khuyến mãi của Điện tử Thuỷ Chi.',
      image: promotion?.banner || settings.siteMeta.logo,
    },
    source: 'local',
  }),
  'thu-cu-doi-moi': (settings) => ({
    slug: 'thu-cu-doi-moi',
    title: 'Thu cũ đổi mới',
    hero: {
      eyebrow: 'Dịch vụ nổi bật',
      title: 'Thu cũ đổi mới',
      description: 'Landing page này giữ nội dung tham khảo cho luồng đổi máy và lên đời sản phẩm trong lúc module nghiệp vụ chưa đầy đủ từ CMS.',
      image: DEFAULT_FEATURED_BANNERS[2].image,
      primaryLabel: 'Xem gợi ý sản phẩm',
      primaryHref: '/danh-muc/thu-cu-doi-moi',
    },
    blocks: [
      {
        id: 'trade-in-guide',
        blockType: 'rich-text',
        title: 'Quy trình tham khảo',
        paragraphs: [
          'Khách có thể tham khảo các model đang có deal tốt, liên hệ hotline để nhận định giá sơ bộ và chốt phương án đổi máy phù hợp ngân sách.',
          'Khi Payload pages sẵn sàng, route này sẽ ưu tiên page từ CMS trước rồi mới fallback local.',
        ],
      },
    ],
    seo: {
      title: `Thu cũ đổi mới | ${settings.siteMeta.name}`,
      description: 'Trang tham khảo dịch vụ thu cũ đổi mới và gợi ý sản phẩm phù hợp tại Điện tử Thuỷ Chi.',
      image: DEFAULT_FEATURED_BANNERS[2].image,
    },
    source: 'local',
  }),
}

const getSiteChromeData = cache(async (options = {}) => {
  return await getSiteSettings(options)
})

const getBannerList = async (position, fallbackItems, options = {}) => {
  const banners = await getBannersByPosition(position, options)
  return banners.length > 0 ? banners : fallbackItems
}

export { getSiteChromeData }

export const getHomePageContent = async (options = {}) => {
  const [chrome, promotion, heroSlides, featuredCategories, midPageBanners, tabletPromoBanners, skyBanners, posts] = await Promise.all([
    getSiteChromeData(options),
    getPromotionSettings(options),
    getBannerList('home-hero', DEFAULT_HERO_BANNERS, options),
    getBannerList('home-featured-category', DEFAULT_FEATURED_BANNERS, options),
    getBannerList('home-mid', DEFAULT_MID_BANNERS, options),
    getBannerList('home-tablet-promo', DEFAULT_MID_BANNERS, options),
    getBannerList('home-sky', DEFAULT_SKY_BANNERS, options),
    getLatestPosts(4, options),
  ])

  const promotionBanner = promotion?.active
    ? {
        title: promotion.title || 'Khuyến mãi',
        description: promotion.content?.[0] || 'Chương trình ưu đãi đang được cập nhật trên Payload.',
        href: '/khuyen-mai',
        image: promotion.banner || midPageBanners[0]?.image || DEFAULT_MID_BANNERS[0].image,
        tone: 'dark',
      }
    : null

  return {
    chrome,
    heroSlides,
    featuredCategories,
    midPageBanners: tabletPromoBanners.length > 0 ? tabletPromoBanners : midPageBanners,
    skyBanners,
    posts,
    guideVideos: DEFAULT_GUIDE_VIDEOS,
    promotion: promotionBanner,
  }
}

export const getBlogListingData = async (options = {}) => {
  return await getLatestPosts(24, options)
}

export const getBlogPostData = async (slug, options = {}) => {
  return await getPostBySlug(slug, options)
}

export const getBlogPostSlugs = async (options = {}) => {
  return await getPostSlugs(options)
}

export const getStaticPageData = async (slug, options = {}) => {
  const page = await getPageBySlug(slug, options)
  if (page) return page

  const builder = FALLBACK_PAGE_BUILDERS[slug]
  if (!builder) return null

  const [settings, promotion] = await Promise.all([
    getSiteChromeData(options),
    getPromotionSettings(options),
  ])

  return builder(settings, promotion)
}

export const getStaticPageSlugs = async (options = {}) => {
  const pageSlugs = await getPageSlugs(options)
  return pageSlugs.filter((slug) => {
    if (!slug) return false
    const firstSegment = slug.split('/')[0]
    return !RESERVED_PAGE_SLUGS.has(firstSegment)
  })
}

export const getPromotionLandingData = async (options = {}) => {
  const [page, settings, promotion] = await Promise.all([
    getPageBySlug('khuyen-mai', options),
    getSiteChromeData(options),
    getPromotionSettings(options),
  ])

  const basePage = page || FALLBACK_PAGE_BUILDERS['khuyen-mai'](settings, promotion)

  if (!promotion?.active) {
    return basePage
  }

  return {
    ...basePage,
    blocks: [
      {
        id: 'promotion-banner',
        blockType: 'banner',
        banner: {
          title: promotion.title || 'Khuyến mãi',
          description: promotion.content?.[0] || 'Chương trình ưu đãi đang được cập nhật trên Payload.',
          href: '/khuyen-mai',
          image: promotion.banner || DEFAULT_MID_BANNERS[0].image,
          tone: 'dark',
        },
      },
      ...(basePage.blocks || []),
    ],
  }
}
