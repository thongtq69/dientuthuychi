export const Banners = {
  slug: 'banners',
  admin: {
    useAsTitle: 'title',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'ctaHref',
      type: 'text',
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
    }
  ],
};
