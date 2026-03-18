const normalizeText = (value) => (typeof value === 'string' ? value.trim() : value)

const syncPromotion = (data) => {
  if (!data) return data

  data.title = normalizeText(data.title || data.promotionTitle)
  data.promotionTitle = data.title
  data.banner = data.banner || data.promotionBanner
  data.promotionBanner = data.banner
  data.active = Boolean(data.active ?? data.activePromotion)
  data.activePromotion = data.active

  return data
}

export const Promotions = {
  slug: 'promotions',
  admin: {
    group: 'Cài đặt',
  },
  access: {
    read: () => true,
    update: ({ req }) => req?.user?.collection === 'users',
  },
  hooks: {
    beforeValidate: [
      ({ data }) => syncPromotion(data),
    ],
  },
  fields: [
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: false,
      label: 'Bật chương trình khuyến mãi',
    },
    {
      name: 'title',
      type: 'text',
      label: 'Tiêu đề khuyến mãi',
    },
    {
      name: 'content',
      type: 'richText',
      label: 'Nội dung khuyến mãi',
    },
    {
      name: 'banner',
      type: 'upload',
      relationTo: 'media',
      label: 'Banner khuyến mãi',
    },
    {
      name: 'linkedProducts',
      type: 'relationship',
      relationTo: 'products',
      hasMany: true,
      label: 'Sản phẩm áp dụng',
    },
    {
      name: 'linkedBanners',
      type: 'relationship',
      relationTo: 'banners',
      hasMany: true,
      label: 'Banner áp dụng',
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
      name: 'couponCodes',
      type: 'array',
      label: 'Danh sách mã giảm giá',
      fields: [
        { name: 'code', type: 'text', required: true, label: 'Mã' },
        { name: 'discount', type: 'number', required: true, label: 'Số tiền giảm', min: 0 },
        { name: 'minOrder', type: 'number', defaultValue: 0, label: 'Đơn hàng tối thiểu', min: 0 },
        { name: 'expiryDate', type: 'date', label: 'Hạn dùng' },
        { name: 'isActive', type: 'checkbox', defaultValue: true, label: 'Kích hoạt' },
      ],
    },
    { name: 'activePromotion', type: 'checkbox', hidden: true },
    { name: 'promotionTitle', type: 'text', hidden: true },
    { name: 'promotionBanner', type: 'upload', relationTo: 'media', hidden: true },
  ],
}
