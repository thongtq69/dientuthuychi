import 'server-only'

import { blogPosts as localBlogPosts, getBlogPostBySlug as getLocalBlogPostBySlug } from '@/data/siteData'
import { DEFAULT_QUERY_LIMIT, coerceArray, formatVietnameseDate, getMediaUrl, richTextToParagraphs, withPayloadFallback } from '@/lib/api/shared'

const estimateReadTime = (paragraphs) => {
  const words = paragraphs.join(' ').trim().split(/\s+/).filter(Boolean).length
  const minutes = Math.max(1, Math.round(words / 180))
  return `${minutes} phút đọc`
}

const normalizePost = (post) => {
  const paragraphs = richTextToParagraphs(post?.content)

  return {
    id: post?.id,
    slug: post?.slug,
    title: post?.title,
    excerpt: post?.excerpt || paragraphs[0] || '',
    intro: post?.excerpt || paragraphs[0] || '',
    image: getMediaUrl(post?.coverImage || post?.featuredImage),
    coverImage: getMediaUrl(post?.coverImage || post?.featuredImage),
    date: formatVietnameseDate(post?.publishedAt || post?.publishedDate),
    publishedAt: post?.publishedAt || post?.publishedDate || null,
    category: post?.category || 'tin-tuc',
    readTime: estimateReadTime(paragraphs),
    sections: paragraphs.map((paragraph, index) => ({
      heading: index === 0 ? 'Nội dung chính' : `Phần ${index + 1}`,
      paragraphs: [paragraph],
    })),
    content: post?.content,
    seo: {
      title: post?.seo?.title || post?.seoTitle || post?.title,
      description: post?.seo?.description || post?.seoDescription || post?.excerpt || '',
      image: getMediaUrl(post?.seo?.image) || getMediaUrl(post?.coverImage || post?.featuredImage),
    },
    source: 'payload',
  }
}

export const getPosts = async (options = {}) => {
  const result = await withPayloadFallback({
    mode: options.mode,
    loadPayload: async (payload) => {
      const response = await payload.find({
        collection: 'posts',
        depth: 2,
        draft: false,
        limit: DEFAULT_QUERY_LIMIT,
        sort: '-publishedAt',
        where: {
          status: {
            equals: 'published',
          },
        },
      })

      return coerceArray(response?.docs).map(normalizePost)
    },
    loadLocal: async () => localBlogPosts,
    isPayloadUsable: (docs) => Array.isArray(docs) && docs.length > 0,
  })

  return result.data
}

export const getLatestPosts = async (limit = 4, options = {}) => {
  const posts = await getPosts(options)
  return posts.slice(0, limit)
}

export const getPostBySlug = async (slug, options = {}) => {
  if (!slug) return null

  const result = await withPayloadFallback({
    mode: options.mode,
    loadPayload: async (payload) => {
      const response = await payload.find({
        collection: 'posts',
        depth: 2,
        draft: false,
        limit: 1,
        where: {
          slug: {
            equals: slug,
          },
        },
      })

      return response?.docs?.[0] ? normalizePost(response.docs[0]) : null
    },
    loadLocal: async () => getLocalBlogPostBySlug(slug),
    isPayloadUsable: Boolean,
  })

  return result.data || null
}

export const getPostSlugs = async (options = {}) => {
  const posts = await getPosts(options)
  return posts.map((post) => post.slug).filter(Boolean)
}

export const getPostDataInterface = () => {
  return {
    list: 'getPosts(options)',
    latest: 'getLatestPosts(limit, options)',
    bySlug: 'getPostBySlug(slug, options)',
    slugs: 'getPostSlugs(options)',
    fallback: 'Published Payload posts are preferred; local blog post data stays in place until Task 4 finishes importing content.',
  }
}
