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

export const Categories = {
  slug: 'categories',
  admin: {
    useAsTitle: 'title',
    group: 'Sản phẩm',
    defaultColumns: ['title', 'slug', 'parent', 'isActive'],
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
        data.slug = normalizeSlug(data.slug || data.title)
        data.description = normalizeText(data.description)
        return data
      },
    ],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Tên danh mục',
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
      name: 'parent',
      type: 'relationship',
      relationTo: 'categories',
      label: 'Danh mục cha',
    },
    {
      name: 'icon',
      type: 'upload',
      relationTo: 'media',
      label: 'Icon/Ảnh',
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Mô tả',
    },
    {
      name: 'heroBanner',
      type: 'relationship',
      relationTo: 'banners',
      label: 'Banner nổi bật',
    },
    {
      name: 'banners',
      type: 'relationship',
      relationTo: 'banners',
      hasMany: true,
      label: 'Banner liên kết',
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      label: 'Thứ tự hiển thị',
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      label: 'Hiển thị',
    },
  ],
}
