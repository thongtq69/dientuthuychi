export const Promotions = {
  slug: 'promotions',
  admin: {
    group: 'Cài đặt',
  },
  access: {
    read: () => true,
    update: ({ req }) => req?.user?.collection === 'users',
  },
  fields: [
    {
      name: 'activePromotion',
      type: 'checkbox',
      defaultValue: false,
      label: 'Bật chương trình khuyến mãi',
    },
    {
      name: 'promotionTitle',
      type: 'text',
      label: 'Tiêu đề khuyến mãi',
    },
    {
      name: 'promotionBanner',
      type: 'upload',
      relationTo: 'media',
      label: 'Banner khuyến mãi',
    },
    {
      name: 'couponCodes',
      type: 'array',
      label: 'Danh sách mã giảm giá',
      fields: [
        { name: 'code', type: 'text', required: true, label: 'Mã' },
        { name: 'discount', type: 'number', required: true, label: 'Số tiền giảm' },
        { name: 'minOrder', type: 'number', defaultValue: 0, label: 'Đơn hàng tối thiểu' },
        { name: 'expiryDate', type: 'date', label: 'Hạn dùng' },
        { name: 'isActive', type: 'checkbox', defaultValue: true, label: 'Kích hoạt' },
      ],
    },
  ],
};
