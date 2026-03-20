import 'server-only'

import { optimizeCloudinaryUrl } from '@/lib/cloudinary'
import { readPayload, resolvePayloadDataMode, shouldUseLocalFallback } from '@/lib/payload'

export const DEFAULT_QUERY_LIMIT = 200

const FALLBACK_IMAGE = 'https://bizweb.dktcdn.net/100/112/815/themes/966034/assets/km_product1.png?1768028836881'

export const coerceArray = (value) => (Array.isArray(value) ? value : [])

export const isPopulatedDoc = (value) => Boolean(value && typeof value === 'object' && !Array.isArray(value))

export const getMediaUrl = (media, preferredSize) => {
  if (!isPopulatedDoc(media)) {
    if (typeof media === 'string' && /^https?:\/\//.test(media)) {
      return optimizeCloudinaryUrl(media, preferredSize)
    }

    return null
  }

  const preferred = preferredSize ? media?.sizes?.[preferredSize]?.url : null

  return optimizeCloudinaryUrl(preferred || media?.externalURL || media?.cloudinary?.secureUrl || media?.url || null, preferredSize)
}

export const normalizeMediaAsset = (media) => {
  const url = getMediaUrl(media)

  if (!url) return null

  return {
    id: isPopulatedDoc(media) ? media.id : undefined,
    alt: media?.alt || media?.filename || 'Media asset',
    url,
    thumbnail: getMediaUrl(media, 'thumbnail') || url,
    width: media?.width || null,
    height: media?.height || null,
    mime: media?.mime || media?.mimeType || null,
  }
}

const collectText = (node, fragments) => {
  if (!node) return

  if (typeof node?.text === 'string') {
    const text = node.text.trim()
    if (text) fragments.push(text)
  }

  if (Array.isArray(node?.children)) {
    node.children.forEach((child) => collectText(child, fragments))
  }
}

export const richTextToParagraphs = (value) => {
  if (!value) return []

  if (typeof value === 'string') {
    return value
      .split(/\n{2,}/)
      .map((item) => item.trim())
      .filter(Boolean)
  }

  const rootChildren = Array.isArray(value?.root?.children) ? value.root.children : []

  return rootChildren
    .map((node) => {
      const fragments = []
      collectText(node, fragments)
      return fragments.join(' ').replace(/\s+/g, ' ').trim()
    })
    .filter(Boolean)
}

export const formatVietnameseDate = (value) => {
  if (!value) return ''

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''

  return new Intl.DateTimeFormat('vi-VN').format(date)
}

export const withPayloadFallback = async ({
  mode,
  loadPayload,
  loadLocal,
  isPayloadUsable,
}) => {
  const resolvedMode = resolvePayloadDataMode(mode)
  const payloadResult = await readPayload(loadPayload, { mode: resolvedMode })

  if (payloadResult.ok) {
    const normalizedPayload = payloadResult.data
    const payloadUsable = isPayloadUsable ? isPayloadUsable(normalizedPayload) : Boolean(normalizedPayload)

    if (payloadUsable) {
      return {
        data: normalizedPayload,
        source: 'payload',
        mode: resolvedMode,
        fallbackUsed: false,
        error: null,
      }
    }
  }

  if (shouldUseLocalFallback(resolvedMode)) {
    return {
      data: await loadLocal(),
      source: 'local',
      mode: resolvedMode,
      fallbackUsed: true,
      error: payloadResult.error,
    }
  }

  if (payloadResult.error) {
    throw payloadResult.error
  }

  return {
    data: payloadResult.data,
    source: 'payload',
    mode: resolvedMode,
    fallbackUsed: false,
    error: null,
  }
}

export const getFallbackImage = () => FALLBACK_IMAGE
