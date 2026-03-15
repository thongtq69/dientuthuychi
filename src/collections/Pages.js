export const Pages = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    group: 'Nội dung',
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
      label: 'Tiêu đề trang',
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      label: 'Slug',
    },
    {
      name: 'content',
      type: 'richText',
      label: 'Nội dung',
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
  timestamps: true,
};
