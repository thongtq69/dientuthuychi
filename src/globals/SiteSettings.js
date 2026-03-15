export const SiteSettings = {
  slug: 'site-settings',
  admin: {
    group: 'Cài đặt',
  },
  access: {
    read: () => true,
    update: ({ req: { user } }) => user?.collection === 'users',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Thông tin cửa hàng',
          fields: [
            { name: 'siteName', type: 'text', defaultValue: 'Điện Tử Thụy Chi' },
            { name: 'logo', type: 'upload', relationTo: 'media' },
            { name: 'phone', type: 'text', label: 'SĐT liên hệ' },
            { name: 'hotline', type: 'text', label: 'Hotline' },
            { name: 'email', type: 'text', label: 'Email' },
            { name: 'address', type: 'textarea', label: 'Địa chỉ' },
            { name: 'workingHours', type: 'text', label: 'Giờ làm việc' },
          ],
        },
        {
          label: 'Mạng xã hội',
          fields: [
            { name: 'facebookUrl', type: 'text' },
            { name: 'zaloUrl', type: 'text' },
            { name: 'youtubeUrl', type: 'text' },
            { name: 'tiktokUrl', type: 'text' },
          ],
        },
        {
          label: 'Thanh toán',
          fields: [
            { name: 'bankName', type: 'text', label: 'Ngân hàng' },
            { name: 'bankAccountNumber', type: 'text', label: 'Số tài khoản' },
            { name: 'bankAccountName', type: 'text', label: 'Chủ tài khoản' },
            { name: 'bankQRImage', type: 'upload', relationTo: 'media', label: 'QR Code' },
          ],
        },
        {
          label: 'SEO mặc định',
          fields: [
            { name: 'seoTitle', type: 'text' },
            { name: 'seoDescription', type: 'textarea' },
            { name: 'seoImage', type: 'upload', relationTo: 'media' },
          ],
        },
        {
          label: 'Cấu hình hệ thống',
          fields: [
            { name: 'topBarText', type: 'text', label: 'Dòng chữ Top Bar' },
            { name: 'freeShipThreshold', type: 'number', label: 'Đơn hàng tối thiểu miễn phí ship' },
            { name: 'telegramBotToken', type: 'text', label: 'Telegram Bot Token' },
            { name: 'telegramChatId', type: 'text', label: 'Telegram Chat ID' },
          ],
        },
      ],
    },
  ],
};
