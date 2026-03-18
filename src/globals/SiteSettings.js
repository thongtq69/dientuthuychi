const normalizeText = (value) => (typeof value === 'string' ? value.trim() : value)

const syncSiteSettings = (data) => {
  if (!data) return data

  data.siteName = normalizeText(data.siteName) || 'Điện Tử Thụy Chi'

  const contact = data.contact || {}
  const social = data.social || {}
  const header = data.header || {}
  const footer = data.footer || {}
  const seo = data.seo || {}
  const payment = data.payment || {}
  const integrations = data.integrations || {}

  data.contact = {
    ...contact,
    phone: normalizeText(contact.phone || data.phone),
    hotline: normalizeText(contact.hotline || data.hotline),
    email: normalizeText(contact.email || data.email),
    address: normalizeText(contact.address || data.address),
    workingHours: normalizeText(contact.workingHours || data.workingHours),
  }

  data.social = {
    ...social,
    facebook: normalizeText(social.facebook || data.facebookUrl),
    zalo: normalizeText(social.zalo || data.zaloUrl),
    youtube: normalizeText(social.youtube || data.youtubeUrl),
    tiktok: normalizeText(social.tiktok || data.tiktokUrl),
  }

  data.header = {
    ...header,
    topBarText: normalizeText(header.topBarText || data.topBarText),
  }

  data.footer = {
    ...footer,
    address: normalizeText(footer.address || data.contact?.address || data.address),
    hotline: normalizeText(footer.hotline || data.contact?.hotline || data.hotline),
    email: normalizeText(footer.email || data.contact?.email || data.email),
  }

  data.seo = {
    ...seo,
    title: normalizeText(seo.title || data.seoTitle || data.siteName),
    description: normalizeText(seo.description || data.seoDescription),
    image: seo.image || data.seoImage,
  }

  data.payment = {
    ...payment,
    bankName: normalizeText(payment.bankName || data.bankName),
    bankAccountNumber: normalizeText(payment.bankAccountNumber || data.bankAccountNumber),
    bankAccountName: normalizeText(payment.bankAccountName || data.bankAccountName),
    bankQRImage: payment.bankQRImage || data.bankQRImage,
  }

  data.integrations = {
    ...integrations,
    freeShipThreshold: integrations.freeShipThreshold ?? data.freeShipThreshold,
    telegramBotToken: normalizeText(integrations.telegramBotToken || data.telegramBotToken),
    telegramChatId: normalizeText(integrations.telegramChatId || data.telegramChatId),
  }

  data.phone = data.contact.phone
  data.hotline = data.contact.hotline
  data.email = data.contact.email
  data.address = data.contact.address
  data.workingHours = data.contact.workingHours

  data.facebookUrl = data.social.facebook
  data.zaloUrl = data.social.zalo
  data.youtubeUrl = data.social.youtube
  data.tiktokUrl = data.social.tiktok

  data.topBarText = data.header.topBarText
  data.seoTitle = data.seo.title
  data.seoDescription = data.seo.description
  data.seoImage = data.seo.image
  data.bankName = data.payment.bankName
  data.bankAccountNumber = data.payment.bankAccountNumber
  data.bankAccountName = data.payment.bankAccountName
  data.bankQRImage = data.payment.bankQRImage
  data.freeShipThreshold = data.integrations.freeShipThreshold
  data.telegramBotToken = data.integrations.telegramBotToken
  data.telegramChatId = data.integrations.telegramChatId

  return data
}

export const SiteSettings = {
  slug: 'site-settings',
  admin: {
    group: 'Cài đặt',
  },
  access: {
    read: () => true,
    update: ({ req }) => req?.user?.collection === 'users',
  },
  hooks: {
    beforeValidate: [
      ({ data }) => syncSiteSettings(data),
    ],
  },
  fields: [
    {
      name: 'siteName',
      type: 'text',
      required: true,
      label: 'Tên website',
      defaultValue: 'Điện Tử Thụy Chi',
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      label: 'Logo',
    },
    {
      name: 'favicon',
      type: 'upload',
      relationTo: 'media',
      label: 'Favicon',
    },
    {
      name: 'contact',
      type: 'group',
      label: 'Liên hệ',
      fields: [
        { name: 'phone', type: 'text', label: 'SĐT liên hệ' },
        { name: 'hotline', type: 'text', label: 'Hotline' },
        { name: 'email', type: 'text', label: 'Email' },
        { name: 'address', type: 'textarea', label: 'Địa chỉ' },
        { name: 'workingHours', type: 'text', label: 'Giờ làm việc' },
      ],
    },
    {
      name: 'social',
      type: 'group',
      label: 'Mạng xã hội',
      fields: [
        { name: 'facebook', type: 'text', label: 'Facebook URL' },
        { name: 'zalo', type: 'text', label: 'Zalo URL' },
        { name: 'youtube', type: 'text', label: 'Youtube URL' },
        { name: 'tiktok', type: 'text', label: 'TikTok URL' },
      ],
    },
    {
      name: 'header',
      type: 'group',
      label: 'Header',
      fields: [
        { name: 'topBarText', type: 'text', label: 'Top bar text' },
      ],
    },
    {
      name: 'footer',
      type: 'group',
      label: 'Footer',
      fields: [
        { name: 'address', type: 'textarea', label: 'Địa chỉ footer' },
        { name: 'hotline', type: 'text', label: 'Hotline footer' },
        { name: 'email', type: 'text', label: 'Email footer' },
      ],
    },
    {
      name: 'seo',
      type: 'group',
      label: 'SEO mặc định',
      fields: [
        { name: 'title', type: 'text', label: 'SEO title' },
        { name: 'description', type: 'textarea', label: 'SEO description' },
        { name: 'image', type: 'upload', relationTo: 'media', label: 'SEO image' },
      ],
    },
    {
      name: 'payment',
      type: 'group',
      label: 'Thanh toán',
      fields: [
        { name: 'bankName', type: 'text', label: 'Ngân hàng' },
        { name: 'bankAccountNumber', type: 'text', label: 'Số tài khoản' },
        { name: 'bankAccountName', type: 'text', label: 'Chủ tài khoản' },
        { name: 'bankQRImage', type: 'upload', relationTo: 'media', label: 'QR Code' },
      ],
    },
    {
      name: 'integrations',
      type: 'group',
      label: 'Tích hợp',
      fields: [
        { name: 'freeShipThreshold', type: 'number', label: 'Đơn tối thiểu miễn phí ship', min: 0 },
        { name: 'telegramBotToken', type: 'text', label: 'Telegram Bot Token' },
        { name: 'telegramChatId', type: 'text', label: 'Telegram Chat ID' },
      ],
    },
    { name: 'phone', type: 'text', hidden: true },
    { name: 'hotline', type: 'text', hidden: true },
    { name: 'email', type: 'text', hidden: true },
    { name: 'address', type: 'textarea', hidden: true },
    { name: 'workingHours', type: 'text', hidden: true },
    { name: 'facebookUrl', type: 'text', hidden: true },
    { name: 'zaloUrl', type: 'text', hidden: true },
    { name: 'youtubeUrl', type: 'text', hidden: true },
    { name: 'tiktokUrl', type: 'text', hidden: true },
    { name: 'topBarText', type: 'text', hidden: true },
    { name: 'bankName', type: 'text', hidden: true },
    { name: 'bankAccountNumber', type: 'text', hidden: true },
    { name: 'bankAccountName', type: 'text', hidden: true },
    { name: 'bankQRImage', type: 'upload', relationTo: 'media', hidden: true },
    { name: 'freeShipThreshold', type: 'number', hidden: true },
    { name: 'telegramBotToken', type: 'text', hidden: true },
    { name: 'telegramChatId', type: 'text', hidden: true },
    { name: 'seoTitle', type: 'text', hidden: true },
    { name: 'seoDescription', type: 'textarea', hidden: true },
    { name: 'seoImage', type: 'upload', relationTo: 'media', hidden: true },
  ],
}
