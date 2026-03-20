import 'server-only'

import {
  accessoryProducts as localAccessoryProducts,
  categoryRailItems,
  collections as localCollections,
  featuredCategories,
  getCollectionBySlug as getLocalCollectionBySlug,
  getProductBySlug as getLocalProductBySlug,
  getProductsByCategory as getLocalProductsByCategory,
  getRelatedProducts as getLocalRelatedProducts,
  getProductsBySlugs as getLocalProductsBySlugs,
  phoneProducts as localPhoneProducts,
  products as localProducts,
  tabletProducts as localTabletProducts,
} from '@/data/siteData'
import { DEFAULT_QUERY_LIMIT, coerceArray, formatVietnameseDate, getFallbackImage, getMediaUrl, richTextToParagraphs, withPayloadFallback } from '@/lib/api/shared'
import { resolvePayloadDataMode } from '@/lib/payload'

const PUBLIC_PRODUCT_STATUSES = new Set(['active', 'out-of-stock'])
const INVALID_PRODUCT_IMAGE_PATTERN = /(via\.placeholder\.com\/300x300|\/km_product\d+\.png)/i

const hasUsableProductImage = (product) => {
  const imageCandidates = [product?.thumbnail, product?.image, product?.primary_image]
    .filter((value) => typeof value === 'string' && value.trim().length > 0)

  return imageCandidates.some((value) => !INVALID_PRODUCT_IMAGE_PATTERN.test(value))
}

const prioritizeProductsWithImages = (sourceProducts) => {
  return [...sourceProducts].sort((left, right) => {
    const leftHasImage = hasUsableProductImage(left)
    const rightHasImage = hasUsableProductImage(right)

    if (leftHasImage === rightHasImage) return 0

    return rightHasImage - leftHasImage
  })
}

const getProductIdentityKey = (product) => {
  return product?.productGroup || product?.productIdentity || product?.slug || product?.id
}

const getProductRichnessScore = (product) => {
  let score = 0

  if (hasUsableProductImage(product)) score += 8
  if (product?.technical_specifications && Object.keys(product.technical_specifications).length > 0) score += 6
  if (Array.isArray(product?.gallery) && product.gallery.length > 0) score += 5
  if (Array.isArray(product?.highlights) && product.highlights.length > 0) score += 4
  if (Array.isArray(product?.description) && product.description.length > 1) score += 3
  if (Array.isArray(product?.inventory) && product.inventory.length > 0) score += 2
  if (Number(product?.originalPrice || 0) > Number(product?.price || 0)) score += 2
  if (Array.isArray(product?.variants) && product.variants.length > 1) score += 1

  return score
}

const choosePreferredProduct = (left, right) => {
  const leftScore = getProductRichnessScore(left)
  const rightScore = getProductRichnessScore(right)

  if (leftScore === rightScore) {
    return left?.source?.provider === 'payload' ? left : right
  }

  return rightScore > leftScore ? right : left
}

const mergeProductRecords = (left, right) => {
  const preferred = choosePreferredProduct(left, right)
  const secondary = preferred === left ? right : left

  return {
    ...secondary,
    ...preferred,
    image: preferred?.image || secondary?.image,
    thumbnail: preferred?.thumbnail || secondary?.thumbnail,
    primary_image: preferred?.primary_image || secondary?.primary_image,
    gallery: Array.isArray(preferred?.gallery) && preferred.gallery.length > 0 ? preferred.gallery : secondary?.gallery,
    description: Array.isArray(preferred?.description) && preferred.description.length > 0 ? preferred.description : secondary?.description,
    highlights: Array.isArray(preferred?.highlights) && preferred.highlights.length > 0 ? preferred.highlights : secondary?.highlights,
    featured_highlights:
      Array.isArray(preferred?.featured_highlights) && preferred.featured_highlights.length > 0
        ? preferred.featured_highlights
        : secondary?.featured_highlights,
    inventory: Array.isArray(preferred?.inventory) && preferred.inventory.length > 0 ? preferred.inventory : secondary?.inventory,
    variants: Array.isArray(preferred?.variants) && preferred.variants.length > 0 ? preferred.variants : secondary?.variants,
    technical_specifications:
      preferred?.technical_specifications && Object.keys(preferred.technical_specifications).length > 0
        ? preferred.technical_specifications
        : secondary?.technical_specifications,
    specs: preferred?.specs || secondary?.specs,
    seo: {
      ...(secondary?.seo || {}),
      ...(preferred?.seo || {}),
      image: preferred?.seo?.image || secondary?.seo?.image || preferred?.image || secondary?.image,
    },
  }
}

const mergeProductsWithLocalFallback = (payloadProducts, localFallbackProducts) => {
  const mergedProducts = new Map()

  for (const product of localFallbackProducts) {
    const key = getProductIdentityKey(product)
    if (!key) continue
    mergedProducts.set(key, product)
  }

  for (const product of payloadProducts) {
    const key = getProductIdentityKey(product)
    if (!key) continue

    const existingProduct = mergedProducts.get(key)
    mergedProducts.set(key, existingProduct ? mergeProductRecords(existingProduct, product) : product)
  }

  return [...mergedProducts.values()]
}

const getHomepageProductsWithImagesFirst = (sourceProducts, fallbackProducts, limit = 10) => {
  const primaryProducts = sourceProducts.length ? sourceProducts : fallbackProducts
  const secondaryProducts = sourceProducts.length ? fallbackProducts : []
  const seenSlugs = new Set()

  const registerProducts = (items) => items.filter((product) => {
    if (!product?.slug || seenSlugs.has(product.slug)) return false
    seenSlugs.add(product.slug)
    return true
  })

  const candidates = registerProducts([
    ...prioritizeProductsWithImages(primaryProducts).filter(hasUsableProductImage),
    ...prioritizeProductsWithImages(secondaryProducts).filter(hasUsableProductImage),
    ...prioritizeProductsWithImages(primaryProducts),
    ...prioritizeProductsWithImages(secondaryProducts),
  ])

  return candidates.slice(0, limit)
}

const normalizePayloadProduct = (product) => {
  const image = getMediaUrl(product?.image || product?.mainImage)
  const gallery = coerceArray(product?.gallery)
    .map((entry) => {
      const asset = entry?.image || entry
      return getMediaUrl(asset)
    })
    .filter(Boolean)

  const highlights = coerceArray(product?.highlights)
    .map((entry) => (typeof entry === 'string' ? entry : entry?.value || entry?.text || ''))
    .filter(Boolean)

  const variants = coerceArray(product?.variants).map((variant) => ({
    ...variant,
    image: getMediaUrl(variant?.image) || image,
  }))

  const categoryTitle = typeof product?.category === 'object' ? product.category?.title : product?.category

  return {
    id: product?.id,
    slug: product?.slug,
    name: product?.name,
    productGroup: product?.productGroup || product?.productIdentity || product?.slug,
    category: categoryTitle || product?.categoryTitle || product?.categorySlug || 'Phụ Kiện',
    categorySlug: product?.categorySlug || product?.category?.slug || null,
    brand: product?.brand || '',
    family: product?.family || '',
    price: Number(product?.price || 0),
    originalPrice: Number(product?.originalPrice || 0),
    status: product?.status || (Number(product?.stock || 0) > 0 ? 'active' : 'out-of-stock'),
    inventory: coerceArray(product?.inventory),
    stock: Number(product?.stock || 0),
    image: image || getFallbackImage(),
    thumbnail: getMediaUrl(product?.image || product?.mainImage, 'thumbnail') || image || getFallbackImage(),
    primary_image: image || getFallbackImage(),
    gallery: gallery.length > 0 ? gallery : image ? [image] : [],
    description: richTextToParagraphs(product?.description),
    highlights,
    featured_highlights: highlights,
    specs: product?.specs || product?.technical_specifications || product?.specifications || null,
    technical_specifications: product?.technical_specifications || product?.specifications || product?.specs || null,
    variants,
    labels: coerceArray(product?.labels),
    seo: {
      title: product?.seo?.title || product?.seoTitle || product?.name,
      description: product?.seo?.description || product?.seoDescription || '',
      image: getMediaUrl(product?.seo?.image) || image || getFallbackImage(),
    },
    source: {
      provider: product?.source?.provider || 'payload',
      sourceId: product?.source?.sourceId || product?.id || null,
      url: product?.source?.url || null,
      lastSyncedAt: formatVietnameseDate(product?.source?.lastSyncedAt),
    },
  }
}

const loadPayloadProducts = async (options = {}) => {
  const result = await withPayloadFallback({
    mode: options.mode,
    loadPayload: async (payload) => {
      const response = await payload.find({
        collection: 'products',
        depth: 2,
        draft: false,
        limit: DEFAULT_QUERY_LIMIT,
        sort: '-updatedAt',
        where: {
          isActive: {
            equals: true,
          },
        },
      })

      return coerceArray(response?.docs)
        .filter((product) => PUBLIC_PRODUCT_STATUSES.has(product?.status))
        .map(normalizePayloadProduct)
    },
    loadLocal: async () => localProducts,
    isPayloadUsable: (docs) => Array.isArray(docs) && docs.length > 0,
  })

  return result
}

export const getProducts = async (options = {}) => {
  const result = await loadPayloadProducts(options)

  if (result.source === 'payload' && resolvePayloadDataMode(options.mode) !== 'payload-only') {
    return mergeProductsWithLocalFallback(result.data, localProducts)
  }

  return result.data
}

export const getProductBySlug = async (slug, options = {}) => {
  if (!slug) return null

  const result = await withPayloadFallback({
    mode: options.mode,
    loadPayload: async (payload) => {
      const response = await payload.find({
        collection: 'products',
        depth: 2,
        draft: false,
        limit: 1,
        where: {
          slug: {
            equals: slug,
          },
        },
      })

      return response?.docs?.[0] ? normalizePayloadProduct(response.docs[0]) : null
    },
    loadLocal: async () => getLocalProductBySlug(slug),
    isPayloadUsable: (product) => Boolean(product) && PUBLIC_PRODUCT_STATUSES.has(product?.status),
  })

  return result.data || null
}

export const getProductsBySlugs = async (slugs = [], options = {}) => {
  if (!Array.isArray(slugs) || slugs.length === 0) return []

  const products = await getProducts(options)
  const lookup = new Map(products.map((product) => [product.slug, product]))

  return slugs.map((slug) => lookup.get(slug)).filter(Boolean)
}

export const getProductsByCategory = async (category, options = {}) => {
  if (!category) return []

  const payloadProducts = await getProducts(options)
  const directMatches = payloadProducts.filter(
    (product) => product.categorySlug === category || product.category === category,
  )

  if (directMatches.length > 0) {
    return directMatches
  }

  const mode = options.mode
  const fallbackProducts = getLocalProductsByCategory(category)

  if (fallbackProducts.length > 0) {
    return fallbackProducts
  }

  if (mode === 'payload-only') {
    return []
  }

  return directMatches
}

export const getCollections = async () => {
  return localCollections
}

export const getCollectionBySlug = async (slug) => {
  return getLocalCollectionBySlug(slug) || null
}

const hasValidDiscount = (product) => {
  return Number(product?.originalPrice) > Number(product?.price) && Number(product?.price) > 0
}

const getProductLookup = (product) => {
  return `${product?.name || ''} ${product?.slug || ''} ${product?.brand || ''} ${product?.category || ''}`.toLowerCase()
}

const getSortedDiscountProducts = (sourceProducts) => {
  return [...sourceProducts].sort((left, right) => {
    const leftRatio = hasValidDiscount(left) ? 1 - Number(left.price) / Number(left.originalPrice) : 0
    const rightRatio = hasValidDiscount(right) ? 1 - Number(right.price) / Number(right.originalPrice) : 0
    return rightRatio - leftRatio
  })
}

const selectCollectionProducts = (sourceProducts, slug) => {
  if (slug === 'dien-thoai' || slug === 'tablet' || slug === 'phu-kien') {
    return sourceProducts.filter((product) => product.categorySlug === slug || product.category === slug)
  }

  if (slug === 'hang-cu' || slug === 'thu-cu-doi-moi') {
    const usedProducts = getSortedDiscountProducts(sourceProducts).filter(
      (product) => hasValidDiscount(product) || /(cu|cũ|likenew|99|used|doi moi|đổi mới)/i.test(getProductLookup(product)),
    )

    return (usedProducts.length ? usedProducts : sourceProducts).slice(0, 18)
  }

  if (slug === 'am-thanh') {
    const audioProducts = sourceProducts.filter((product) => /(tai nghe|loa|micro|sound|buds|airpods)/i.test(getProductLookup(product)))
    return (audioProducts.length ? audioProducts : sourceProducts.filter((product) => product.categorySlug === 'phu-kien')).slice(0, 18)
  }

  if (slug === 'smartwatch') {
    const watchProducts = sourceProducts.filter((product) => /(watch|đồng hồ|dong ho|strap|dây đeo|day deo)/i.test(getProductLookup(product)))
    return (watchProducts.length ? watchProducts : sourceProducts.filter((product) => product.categorySlug === 'phu-kien')).slice(0, 18)
  }

  if (slug === 'linh-kien') {
    const accessoryProducts = sourceProducts.filter((product) => product.categorySlug === 'phu-kien')
    const partProducts = accessoryProducts.filter((product) => /(bao da|cường lực|cuong luc|bút|but|stylus|keyboard|ban phim)/i.test(getProductLookup(product)))
    return (partProducts.length ? partProducts : accessoryProducts).slice(0, 18)
  }

  if (slug === 'khuyen-mai') {
    const promoProducts = getSortedDiscountProducts(sourceProducts).filter((product) => hasValidDiscount(product))
    return (promoProducts.length ? promoProducts : sourceProducts).slice(0, 18)
  }

  return []
}

const getFeaturedProducts = (collection, sourceProducts) => {
  const featuredProducts = coerceArray(collection?.featuredSlugs)
    .map((slug) => sourceProducts.find((product) => product.slug === slug))
    .filter(Boolean)

  return featuredProducts.length ? featuredProducts : sourceProducts.slice(0, 3)
}

export const getHomepageProductData = async (options = {}) => {
  const [products, phoneProducts, tabletProducts, accessoryProducts] = await Promise.all([
    getProducts(options),
    getProductsByCategory('dien-thoai', options),
    getProductsByCategory('tablet', options),
    getProductsByCategory('phu-kien', options),
  ])

  return {
    phoneProducts: getHomepageProductsWithImagesFirst(phoneProducts, localPhoneProducts),
    tabletProducts: getHomepageProductsWithImagesFirst(tabletProducts, localTabletProducts),
    accessoryProducts: getHomepageProductsWithImagesFirst(accessoryProducts, localAccessoryProducts),
    source: resultSource(products, localProducts),
  }
}

export const getCollectionPageData = async (slug, options = {}) => {
  const collection = await getCollectionBySlug(slug)

  if (!collection) {
    return {
      collection: null,
      products: [],
      featuredProducts: [],
      source: 'local',
    }
  }

  const products = await getProducts(options)
  const collectionProducts = selectCollectionProducts(products, slug)
  const dataLayerFeaturedProducts = await getProductsBySlugs(collection.featuredSlugs, options)
  const featuredProducts = collectionProducts.length
    ? getFeaturedProducts(collection, collectionProducts)
    : dataLayerFeaturedProducts.length
      ? dataLayerFeaturedProducts
      : getLocalProductsBySlugs(collection.featuredSlugs)

  return {
    collection,
    products: collectionProducts,
    featuredProducts,
    source: resultSource(collectionProducts, getLocalProductsByCategory(slug)),
  }
}

export const getProductPageData = async (slug, options = {}) => {
  const product = await getProductBySlug(slug, options)

  if (!product) {
    return {
      product: null,
      relatedProducts: [],
      source: 'local',
    }
  }

  return {
    product,
    relatedProducts: await getRelatedProducts(product, 10, options),
    source: localProducts.some((item) => item.slug === product.slug) ? 'fallback-local' : 'payload-first',
  }
}

export const getCollectionRouteSlugs = async (options = {}) => {
  const slugs = new Set(localCollections.map((collection) => collection.slug))

  categoryRailItems.forEach((item) => {
    const match = item.href?.match(/\/danh-muc\/([^/?#]+)/)
    if (match?.[1]) slugs.add(match[1])
  })

  featuredCategories.forEach((item) => {
    const match = item.href?.match(/\/danh-muc\/([^/?#]+)/)
    if (match?.[1]) slugs.add(match[1])
  })

  const products = await getProducts(options)
  products.forEach((product) => {
    if (product?.categorySlug) slugs.add(product.categorySlug)
  })

  return [...slugs]
}

export const getProductRouteSlugs = async (options = {}) => {
  const products = await getProducts(options)
  return [...new Set(products.map((product) => product?.slug).filter(Boolean))]
}

export const getRelatedProducts = async (product, limit = 4, options = {}) => {
  if (!product?.slug) return []

  const products = await getProducts(options)
  const related = products
    .filter((item) => item.slug !== product.slug && (item.category === product.category || item.family === product.family))
    .slice(0, limit)

  if (related.length > 0) {
    return related
  }

  return getLocalRelatedProducts(product, limit)
}

export const getProductDataInterface = () => {
  return {
    list: 'getProducts(options)',
    bySlug: 'getProductBySlug(slug, options)',
    bySlugs: 'getProductsBySlugs(slugs, options)',
    byCategory: 'getProductsByCategory(category, options)',
    collections: 'getCollections()',
    collectionBySlug: 'getCollectionBySlug(slug)',
    homepage: 'getHomepageProductData(options)',
    collectionPage: 'getCollectionPageData(slug, options)',
    productPage: 'getProductPageData(slug, options)',
    collectionRouteSlugs: 'getCollectionRouteSlugs(options)',
    productRouteSlugs: 'getProductRouteSlugs(options)',
    related: 'getRelatedProducts(product, limit, options)',
    fallback: 'Payload docs are preferred; local site data remains the fallback for empty or unavailable payload data.',
  }
}

const resultSource = (data, localFallback) => {
  return Array.isArray(data) && data.length > 0 && data !== localFallback ? 'payload' : 'local'
}
