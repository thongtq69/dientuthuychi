const normalizeText = (value) => (typeof value === 'string' ? value.trim() : value)

const normalizeSlug = (value) => {
  if (typeof value !== 'string') return ''

  return value
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

const syncSeo = (data) => {
  if (!data) return data

  const seo = data.seo || {}
  const title = normalizeText(seo.title || data.seoTitle || data.title)
  const description = normalizeText(seo.description || data.seoDescription || data.excerpt)
  const image = seo.image || data.coverImage || data.featuredImage

  data.seo = {
    ...seo,
    title,
    description,
    image,
  }
  data.seoTitle = title
  data.seoDescription = description

  return data
}

export const Posts = {
  slug: 'posts',
  admin: {
    useAsTitle: 'title',
    group: 'Nội dung',
    defaultColumns: ['title', 'slug', 'category', 'status', 'publishedAt'],
  },
  access: {
    read: () => true,
    update: ({ req: { user } }) => user?.collection === 'users',
    create: ({ req: { user } }) => user?.collection === 'users',
    delete: ({ req: { user } }) => user?.collection === 'users',
  },
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (!data) return data

        data.title = normalizeText(data.title)
        data.excerpt = normalizeText(data.excerpt)
        data.slug = normalizeSlug(data.slug || data.title)

        if (data.coverImage && !data.featuredImage) data.featuredImage = data.coverImage
        if (data.featuredImage && !data.coverImage) data.coverImage = data.featuredImage

        if (data.publishedDate && !data.publishedAt) data.publishedAt = data.publishedDate
        if (data.status === 'published' && !data.publishedAt) data.publishedAt = new Date().toISOString()
        if (!data.publishedDate && data.publishedAt) data.publishedDate = data.publishedAt

        return syncSeo(data)
      },
    ],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Tiêu đề',
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      label: 'Slug',
      validate: (value) => {
        if (!value) return 'Slug là bắt buộc'
        return normalizeSlug(value) === value ? true : 'Slug chỉ dùng chữ thường, số và dấu gạch ngang'
      },
    },
    {
      name: 'excerpt',
      type: 'textarea',
      label: 'Mô tả ngắn',
    },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Ảnh đại diện',
    },
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
      hidden: true,
    },
    {
      name: 'content',
      type: 'richText',
      label: 'Nội dung',
      required: true,
    },
    {
      name: 'category',
      type: 'select',
      defaultValue: 'tin-tuc',
      options: [
        { label: 'Tin tức', value: 'tin-tuc' },
        { label: 'Đánh giá', value: 'review' },
        { label: 'Khuyến mãi', value: 'khuyen-mai' },
        { label: 'Hướng dẫn', value: 'huong-dan' },
      ],
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      label: 'Tác giả',
    },
    {
      name: 'publishedAt',
      type: 'date',
      index: true,
      label: 'Ngày xuất bản',
    },
    {
      name: 'publishedDate',
      type: 'date',
      hidden: true,
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'draft',
      index: true,
      options: [
        { label: 'Nháp', value: 'draft' },
        { label: 'Đã xuất bản', value: 'published' },
      ],
    },
    {
      name: 'seo',
      type: 'group',
      label: 'SEO',
      fields: [
        { name: 'title', type: 'text', label: 'SEO title' },
        { name: 'description', type: 'textarea', label: 'SEO description' },
        { name: 'image', type: 'upload', relationTo: 'media', label: 'SEO image' },
      ],
    },
    {
      name: 'seoTitle',
      type: 'text',
      hidden: true,
    },
    {
      name: 'seoDescription',
      type: 'textarea',
      hidden: true,
    },
    {
      name: 'tags',
      type: 'array',
      fields: [{ name: 'tag', type: 'text', required: true, label: 'Tag' }],
      label: 'Tags',
    },
  ],
  timestamps: true,
}
