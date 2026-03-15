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
      label: 'Slug',
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
};
