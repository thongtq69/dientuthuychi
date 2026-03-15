export const Carts = {
  slug: 'carts',
  admin: {
    group: 'Khách hàng',
    description: 'Giỏ hàng server-side',
  },
  access: {
    read: ({ req: { user } }) => {
      if (!user) return false;
      if (user.collection === 'users') return true;
      return { customer: { equals: user.id } };
    },
    update: ({ req: { user } }) => {
      if (!user) return false;
      if (user.collection === 'users') return true;
      return { customer: { equals: user.id } };
    },
    create: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => {
      if (!user) return false;
      if (user.collection === 'users') return true;
      return { customer: { equals: user.id } };
    },
  },
  fields: [
    {
      name: 'customer',
      type: 'relationship',
      relationTo: 'customers',
      required: true,
      unique: true,
      label: 'Khách hàng',
    },
    {
      name: 'items',
      type: 'array',
      label: 'Sản phẩm trong giỏ',
      fields: [
        { name: 'productSlug', type: 'text', required: true },
        { name: 'productName', type: 'text' },
        { name: 'variant', type: 'text' },
        { name: 'price', type: 'number', min: 0 },
        { name: 'quantity', type: 'number', required: true, min: 1 },
        { name: 'image', type: 'text' },
      ],
    },
  ],
  timestamps: true,
};
