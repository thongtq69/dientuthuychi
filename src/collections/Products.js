export const Products = {
  slug: 'products',
  admin: {
    useAsTitle: 'name',
    group: 'Sản phẩm',
    defaultColumns: ['name', 'price', 'category', 'stock', 'isActive'],
  },
  access: {
    read: () => true,
    update: ({ req: { user } }) => user?.collection === 'users',
    create: ({ req: { user } }) => user?.collection === 'users',
    delete: ({ req: { user } }) => user?.collection === 'users',
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
      label: 'Slug',
    },
    {
      name: 'sku',
      type: 'text',
      unique: true,
      label: 'Mã SKU',
    },
    {
      name: 'price',
      type: 'number',
      required: true,
      label: 'Giá bán',
    },
    {
      name: 'originalPrice',
      type: 'number',
      label: 'Giá gốc',
    },
    {
      name: 'stock',
      type: 'number',
      defaultValue: 0,
      label: 'Số lượng tồn kho',
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
      name: 'mainImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'Ảnh chính',
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
        },
      ],
    },
    {
      name: 'description',
      type: 'richText',
      label: 'Mô tả chi tiết',
    },
    {
      name: 'specifications',
      type: 'json',
      label: 'Thông số kỹ thuật',
    },
    {
      name: 'variants',
      type: 'array',
      label: 'Các phiên bản',
      fields: [
        { name: 'name', type: 'text', required: true, label: 'Tên phiên bản' },
        { name: 'sku', type: 'text', label: 'SKU riêng' },
        { name: 'price', type: 'number', label: 'Giá riêng' },
        { name: 'stock', type: 'number', label: 'Tồn kho riêng' },
        { name: 'color', type: 'text', label: 'Màu sắc' },
        { name: 'image', type: 'upload', relationTo: 'media', label: 'Ảnh riêng' },
      ],
    },
    {
      name: 'tags',
      type: 'array',
      label: 'Tags',
      fields: [{ name: 'tag', type: 'text' }],
    },
    {
      name: 'seoTitle',
      type: 'text',
      label: 'SEO Title',
    },
    {
      name: 'seoDescription',
      type: 'textarea',
      label: 'SEO Description',
    },
  ],
};
