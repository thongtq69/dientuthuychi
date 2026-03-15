export const Posts = {
  slug: 'posts',
  admin: {
    useAsTitle: 'title',
    group: 'Nội dung',
    defaultColumns: ['title', 'category', 'status', 'publishedDate'],
  },
  access: {
    read: () => true,
    update: ({ req: { user } }) => user?.collection === 'users',
    create: ({ req: { user } }) => user?.collection === 'users',
    delete: ({ req: { user } }) => user?.collection === 'users',
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
      label: 'Slug',
    },
    {
      name: 'excerpt',
      type: 'textarea',
      label: 'Mô tả ngắn',
    },
    {
      name: 'content',
      type: 'richText',
      label: 'Nội dung',
    },
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Ảnh đại diện',
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
      name: 'publishedDate',
      type: 'date',
      label: 'Ngày xuất bản',
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'draft',
      options: [
        { label: 'Nháp', value: 'draft' },
        { label: 'Đã xuất bản', value: 'published' },
      ],
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
    {
      name: 'tags',
      type: 'array',
      fields: [{ name: 'tag', type: 'text' }],
      label: 'Tags',
    },
  ],
  timestamps: true,
};
