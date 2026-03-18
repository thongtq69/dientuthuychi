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

const isFilled = (value) => {
  if (Array.isArray(value)) return value.length > 0
  return value !== undefined && value !== null && value !== ''
}

const syncSeo = (data) => {
  if (!data) return data

  const seo = data.seo || {}
  const title = normalizeText(seo.title || data.seoTitle || data.name)
  const description = normalizeText(seo.description || data.seoDescription)
  const image = seo.image || data.image || data.mainImage

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

const syncProductDocument = (data) => {
  if (!data) return data

  data.name = normalizeText(data.name)
  data.brand = normalizeText(data.brand)
  data.family = normalizeText(data.family)
  data.categorySlug = normalizeSlug(data.categorySlug || '') || undefined
  data.productGroup = normalizeText(data.productGroup) || undefined
  data.slug = normalizeSlug(data.slug || data.name)
  data.productIdentity = data.productGroup || data.slug

  if (data.image && !data.mainImage) data.mainImage = data.image
  if (data.mainImage && !data.image) data.image = data.mainImage

  if (!data.specs && data.specifications) data.specs = data.specifications
  if (!data.technical_specifications && data.specs) data.technical_specifications = data.specs
  if (!data.specifications && data.technical_specifications) data.specifications = data.technical_specifications

  if (Array.isArray(data.inventory) && data.inventory.length > 0) {
    const totalStock = data.inventory.reduce((sum, entry) => sum + Number(entry?.quantity || 0), 0)
    data.stock = totalStock
  }

  if (!data.status) {
    data.status = Number(data.stock || 0) > 0 ? 'active' : 'out-of-stock'
  }

  return syncSeo(data)
}

export const Products = {
  slug: 'products',
  admin: {
    useAsTitle: 'name',
    group: 'Sản phẩm',
    defaultColumns: ['name', 'slug', 'status', 'price', 'categorySlug'],
  },
  access: {
    read: () => true,
    update: ({ req: { user } }) => user?.collection === 'users',
    create: ({ req: { user } }) => user?.collection === 'users',
    delete: ({ req: { user } }) => user?.collection === 'users',
  },
  hooks: {
    beforeValidate: [
      ({ data }) => syncProductDocument(data),
    ],
    beforeChange: [
      async ({ data, req }) => {
        if (!data?.category || data?.categorySlug) return data

        const categoryID = typeof data.category === 'object' ? data.category?.id : data.category
        if (!categoryID) return data

        try {
          const category = await req.payload.findByID({
            collection: 'categories',
            id: categoryID,
          })

          if (category?.slug) {
            data.categorySlug = category.slug
          }
        } catch {
          return data
        }

        return data
      },
    ],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Tên sản phẩm',
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
      name: 'productGroup',
      type: 'text',
      index: true,
      label: 'Nhóm sản phẩm',
      admin: {
        description: 'Khóa gom bản ghi trùng khi import; ưu tiên hơn slug nếu có.',
      },
    },
    {
      name: 'productIdentity',
      type: 'text',
      index: true,
      hidden: true,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'sku',
      type: 'text',
      unique: true,
      index: true,
      label: 'Mã SKU',
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      index: true,
      label: 'Trạng thái',
      options: [
        { label: 'Nháp', value: 'draft' },
        { label: 'Đang bán', value: 'active' },
        { label: 'Hết hàng', value: 'out-of-stock' },
        { label: 'Ẩn', value: 'archived' },
      ],
    },
    {
      name: 'price',
      type: 'number',
      required: true,
      min: 0,
      label: 'Giá bán',
    },
    {
      name: 'originalPrice',
      type: 'number',
      min: 0,
      label: 'Giá gốc',
      validate: (value, { siblingData }) => {
        if (!isFilled(value)) return true
        if (Number(value) < Number(siblingData?.price || 0)) {
          return 'Giá gốc phải lớn hơn hoặc bằng giá bán'
        }
        return true
      },
    },
    {
      name: 'inventory',
      type: 'array',
      label: 'Tồn kho theo kho/biến thể',
      fields: [
        { name: 'label', type: 'text', required: true, label: 'Nhãn tồn kho' },
        { name: 'quantity', type: 'number', required: true, min: 0, label: 'Số lượng' },
        { name: 'available', type: 'checkbox', defaultValue: true, label: 'Có thể bán' },
      ],
    },
    {
      name: 'stock',
      type: 'number',
      defaultValue: 0,
      min: 0,
      label: 'Tổng tồn kho',
      admin: {
        description: 'Được giữ để tương thích flow giỏ hàng/đơn hàng hiện tại.',
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      label: 'Hiển thị trên web',
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      label: 'Sản phẩm nổi bật',
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: false,
      label: 'Danh mục',
    },
    {
      name: 'categorySlug',
      type: 'text',
      required: true,
      index: true,
      label: 'Slug danh mục',
      validate: (value, { siblingData }) => {
        if (siblingData?.category || value) return true
        return 'Cần chọn danh mục hoặc nhập slug danh mục'
      },
    },
    {
      name: 'brand',
      type: 'text',
      label: 'Thương hiệu',
    },
    {
      name: 'family',
      type: 'text',
      label: 'Dòng sản phẩm',
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'Ảnh đại diện',
    },
    {
      name: 'mainImage',
      type: 'upload',
      relationTo: 'media',
      hidden: true,
    },
    {
      name: 'gallery',
      type: 'array',
      label: 'Bộ ảnh sản phẩm',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
          label: 'Ảnh',
        },
        {
          name: 'alt',
          type: 'text',
          label: 'Alt ảnh',
        },
      ],
    },
    {
      name: 'description',
      type: 'richText',
      label: 'Mô tả chi tiết',
    },
    {
      name: 'highlights',
      type: 'array',
      label: 'Điểm nổi bật',
      fields: [
        { name: 'value', type: 'text', required: true, label: 'Nội dung' },
      ],
    },
    {
      name: 'specs',
      type: 'json',
      label: 'Specs rút gọn',
    },
    {
      name: 'technical_specifications',
      type: 'json',
      label: 'Thông số kỹ thuật',
    },
    {
      name: 'specifications',
      type: 'json',
      hidden: true,
    },
    {
      name: 'variants',
      type: 'array',
      label: 'Các phiên bản',
      fields: [
        { name: 'name', type: 'text', required: true, label: 'Tên phiên bản' },
        { name: 'sku', type: 'text', label: 'SKU riêng' },
        { name: 'price', type: 'number', min: 0, label: 'Giá riêng' },
        { name: 'stock', type: 'number', min: 0, label: 'Tồn kho riêng' },
        { name: 'color', type: 'text', label: 'Màu sắc' },
        { name: 'image', type: 'upload', relationTo: 'media', label: 'Ảnh riêng' },
      ],
      validate: (value) => {
        if (!Array.isArray(value) || value.length === 0) return true

        const seen = new Set()
        for (const variant of value) {
          const key = normalizeText(variant?.sku || variant?.name)
          if (!key) continue
          if (seen.has(key)) return 'Biến thể không được trùng SKU hoặc tên'
          seen.add(key)
        }

        return true
      },
    },
    {
      name: 'labels',
      type: 'array',
      label: 'Labels',
      fields: [
        { name: 'text', type: 'text', required: true, label: 'Nội dung' },
        { name: 'tone', type: 'text', label: 'Tông nhãn' },
      ],
    },
    {
      name: 'tags',
      type: 'array',
      label: 'Tags',
      fields: [{ name: 'tag', type: 'text', required: true, label: 'Tag' }],
    },
    {
      name: 'banners',
      type: 'relationship',
      relationTo: 'banners',
      hasMany: true,
      label: 'Banner liên quan',
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
      name: 'source',
      type: 'group',
      label: 'Nguồn dữ liệu',
      fields: [
        { name: 'provider', type: 'text', label: 'Nguồn' },
        { name: 'sourceId', type: 'text', label: 'ID gốc', index: true },
        { name: 'url', type: 'text', label: 'URL nguồn' },
        { name: 'lastSyncedAt', type: 'date', label: 'Lần sync cuối' },
      ],
    },
  ],
}
