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

const normalizeRoutePath = (value) => {
  if (typeof value !== 'string') return ''

  const normalized = value
    .split('/')
    .map((segment) => normalizeSlug(segment))
    .filter(Boolean)
    .join('/')

  return normalized
}

const syncSeo = (data) => {
  if (!data) return data

  const seo = data.seo || {}
  const title = normalizeText(seo.title || data.seoTitle || data.title)
  const description = normalizeText(seo.description || data.seoDescription)
  const image = seo.image || data.hero?.image

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

export const Pages = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    group: 'Nội dung',
    defaultColumns: ['title', 'routePath', 'updatedAt'],
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
        data.routePath = normalizeRoutePath(data.routePath || data.slug || data.title)
        data.slug = normalizeSlug(data.slug || data.routePath?.split('/').at(-1) || data.title)
        return syncSeo(data)
      },
    ],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Tiêu đề trang',
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      index: true,
      label: 'Slug',
      validate: (value) => {
        if (!value) return 'Slug là bắt buộc'
        return normalizeSlug(value) === value ? true : 'Slug chỉ dùng chữ thường, số và dấu gạch ngang'
      },
    },
    {
      name: 'routePath',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      label: 'Route path',
      admin: {
        description: 'Duong dan public khong co dau / o dau. Ho tro nested route, vi du: info/chinh-sach-bao-mat',
      },
      validate: (value) => {
        if (!value) return 'Route path là bắt buộc'
        return normalizeRoutePath(value) === value ? true : 'Route path chỉ dùng slug va dau /'
      },
    },
    {
      name: 'hero',
      type: 'group',
      label: 'Hero',
      fields: [
        { name: 'eyebrow', type: 'text', label: 'Eyebrow' },
        { name: 'title', type: 'text', label: 'Tiêu đề hero' },
        { name: 'description', type: 'textarea', label: 'Mô tả hero' },
        { name: 'image', type: 'upload', relationTo: 'media', label: 'Ảnh hero' },
        { name: 'banner', type: 'relationship', relationTo: 'banners', label: 'Banner hero' },
        { name: 'primaryLabel', type: 'text', label: 'Nhãn CTA chính' },
        { name: 'primaryHref', type: 'text', label: 'Link CTA chính' },
        { name: 'secondaryLabel', type: 'text', label: 'Nhãn CTA phụ' },
        { name: 'secondaryHref', type: 'text', label: 'Link CTA phụ' },
      ],
    },
    {
      name: 'blocks',
      type: 'array',
      label: 'Blocks',
      fields: [
        {
          name: 'blockType',
          type: 'select',
          required: true,
          defaultValue: 'rich-text',
          options: [
            { label: 'Rich text', value: 'rich-text' },
            { label: 'Banner', value: 'banner' },
            { label: 'Product list', value: 'product-list' },
            { label: 'Media', value: 'media' },
          ],
          label: 'Loại block',
        },
        { name: 'title', type: 'text', label: 'Tiêu đề' },
        { name: 'content', type: 'richText', label: 'Nội dung' },
        { name: 'image', type: 'upload', relationTo: 'media', label: 'Ảnh' },
        { name: 'banner', type: 'relationship', relationTo: 'banners', label: 'Banner' },
        { name: 'products', type: 'relationship', relationTo: 'products', hasMany: true, label: 'Sản phẩm' },
        { name: 'ctaLabel', type: 'text', label: 'Nhãn CTA' },
        { name: 'ctaHref', type: 'text', label: 'Link CTA' },
      ],
    },
    {
      name: 'content',
      type: 'richText',
      label: 'Nội dung legacy',
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
  ],
  timestamps: true,
}
