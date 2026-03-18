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

export const Banners = {
  slug: 'banners',
  admin: {
    useAsTitle: 'title',
    group: 'Nội dung',
    defaultColumns: ['title', 'key', 'position', 'active', 'startAt', 'endAt'],
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
        data.key = normalizeSlug(data.key || data.slug || data.title)
        data.slug = normalizeSlug(data.slug || data.key || data.title)
        data.link = normalizeText(data.link || data.ctaHref)
        data.ctaHref = data.link

        if (data.order !== undefined && data.sortOrder === undefined) data.sortOrder = data.order
        if (data.sortOrder !== undefined && data.order === undefined) data.order = data.sortOrder

        return data
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
      name: 'key',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      label: 'Key',
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      index: true,
      label: 'Slug',
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'Ảnh desktop',
    },
    {
      name: 'mobileImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Ảnh mobile',
    },
    {
      name: 'link',
      type: 'text',
      label: 'Link đích',
    },
    {
      name: 'ctaHref',
      type: 'text',
      hidden: true,
    },
    {
      name: 'position',
      type: 'select',
      required: true,
      defaultValue: 'home-hero',
      index: true,
      label: 'Vị trí',
      options: [
        { label: 'Home hero', value: 'home-hero' },
        { label: 'Home featured category', value: 'home-featured-category' },
        { label: 'Home mid', value: 'home-mid' },
        { label: 'Home tablet promo', value: 'home-tablet-promo' },
        { label: 'Home sky', value: 'home-sky' },
        { label: 'Collection hero', value: 'collection-hero' },
        { label: 'Promo campaign', value: 'promo-campaign' },
        { label: 'Home grid', value: 'home-grid' },
        { label: 'Category hero', value: 'category-hero' },
        { label: 'Promotion', value: 'promotion' },
        { label: 'Page block', value: 'page-block' },
      ],
    },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
      index: true,
      label: 'Đang bật',
    },
    {
      name: 'startAt',
      type: 'date',
      label: 'Bắt đầu lúc',
    },
    {
      name: 'endAt',
      type: 'date',
      label: 'Kết thúc lúc',
      validate: (value, { siblingData }) => {
        if (!value || !siblingData?.startAt) return true
        return new Date(value) >= new Date(siblingData.startAt) ? true : 'endAt phải sau startAt'
      },
    },
    {
      name: 'sortOrder',
      type: 'number',
      defaultValue: 0,
      label: 'Thứ tự ưu tiên',
    },
    {
      name: 'order',
      type: 'number',
      hidden: true,
    },
    {
      name: 'sourceUrl',
      type: 'text',
      label: 'Nguồn migration',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'products',
      type: 'relationship',
      relationTo: 'products',
      hasMany: true,
      label: 'Sản phẩm liên kết',
    },
    {
      name: 'categories',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: true,
      label: 'Danh mục liên kết',
    },
  ],
}
