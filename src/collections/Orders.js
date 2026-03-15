export const Orders = {
  slug: 'orders',
  admin: {
    useAsTitle: 'orderCode',
    group: 'Đơn hàng',
    defaultColumns: ['orderCode', 'customer', 'total', 'status', 'createdAt'],
  },
  access: {
    read: ({ req }) => {
      const user = req?.user;
      if (!user) return false;
      if (user.collection === 'users') return true;
      return { customer: { equals: user.id } };
    },
    create: () => true, // Allow guest checkout
    update: ({ req }) => req?.user?.collection === 'users',
    delete: ({ req }) => req?.user?.collection === 'users',
  },
  hooks: {
    beforeChange: [
      async ({ data, operation, req }) => {
        if (operation === 'create' && !data.orderCode) {
          const now = new Date();
          const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
          const prefix = `DH-${dateStr}-`;

          const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          const result = await req.payload.find({
            collection: 'orders',
            where: {
              createdAt: {
                greater_than_equal: startOfDay.toISOString(),
              },
            },
            limit: 0,
          });
          const seq = String((result.totalDocs || 0) + 1).padStart(3, '0');
          data.orderCode = prefix + seq;
        }
        return data;
      },
    ],
    afterChange: [
      async ({ doc, operation, req }) => {
        if (operation === 'create') {
          try {
            const settings = await req.payload.findGlobal({
              slug: 'site-settings',
            });

            const { telegramBotToken, telegramChatId } = settings || {};
            if (telegramBotToken && telegramChatId) {
              const { sendTelegramMessage } = await import('../lib/telegram');
              
              const itemsList = doc.items.map(item => `• ${item.productName} x${item.quantity} (${new Intl.NumberFormat('vi-VN').format(item.price)}đ)`).join('\n');
              
              const message = `
<b>🛍 ĐƠN HÀNG MỚI!</b>
<b>Mã đơn:</b> #${doc.orderCode}
<b>Tổng:</b> ${new Intl.NumberFormat('vi-VN').format(doc.total)}đ
<b>Thanh toán:</b> ${doc.paymentMethod.toUpperCase()}

<b>📍 Khách hàng:</b>
- Tên: ${doc.shippingAddress.fullName}
- SĐT: ${doc.shippingAddress.phone}
- ĐC: ${doc.shippingAddress.address}, ${doc.shippingAddress.district}, ${doc.shippingAddress.city}

<b>🛒 Sản phẩm:</b>
${itemsList}

<i>Hệ thống quản lý: <a href="${process.env.NEXT_PUBLIC_SERVER_URL}/admin/collections/orders/${doc.id}">Xem chi tiết</a></i>
              `;

              await sendTelegramMessage(message, telegramBotToken, telegramChatId);
            }
          } catch (err) {
            console.error('Telegram notification error:', err);
          }
        }
      },
    ],
  },
  fields: [
    {
      name: 'orderCode',
      type: 'text',
      required: true,
      unique: true,
      label: 'Mã đơn hàng',
      admin: { readOnly: true, position: 'sidebar' },
    },
    {
      name: 'customer',
      type: 'relationship',
      relationTo: 'customers',
      required: false, // Optional for guest checkout
      label: 'Khách hàng',
    },
    {
      name: 'items',
      type: 'array',
      required: true,
      label: 'Sản phẩm',
      minRows: 1,
      fields: [
        { name: 'productSlug', type: 'text', required: true, label: 'Slug SP' },
        { name: 'productName', type: 'text', required: true, label: 'Tên SP' },
        { name: 'variant', type: 'text', label: 'Phiên bản/Màu' },
        { name: 'price', type: 'number', required: true, label: 'Đơn giá', min: 0 },
        { name: 'quantity', type: 'number', required: true, label: 'SL', min: 1 },
        { name: 'image', type: 'text', label: 'Ảnh SP' },
      ],
    },
    {
      name: 'total',
      type: 'number',
      required: true,
      label: 'Tổng tiền',
      min: 0,
      admin: { position: 'sidebar' },
    },
    {
      name: 'shippingAddress',
      type: 'group',
      label: 'Địa chỉ giao hàng',
      fields: [
        { name: 'fullName', type: 'text', label: 'Người nhận' },
        { name: 'phone', type: 'text', label: 'SĐT' },
        { name: 'address', type: 'textarea', label: 'Địa chỉ' },
        { name: 'city', type: 'text', label: 'Tỉnh/TP' },
        { name: 'district', type: 'text', label: 'Quận/Huyện' },
        { name: 'ward', type: 'text', label: 'Phường/Xã' },
      ],
    },
    {
      name: 'paymentMethod',
      type: 'select',
      label: 'Thanh toán',
      defaultValue: 'cod',
      options: [
        { label: 'COD - Thanh toán khi nhận hàng', value: 'cod' },
        { label: 'Chuyển khoản ngân hàng', value: 'bank' },
        { label: 'Trả góp 0%', value: 'installment' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'status',
      type: 'select',
      label: 'Trạng thái',
      defaultValue: 'pending',
      options: [
        { label: '⏳ Chờ xác nhận', value: 'pending' },
        { label: '✅ Đã xác nhận', value: 'confirmed' },
        { label: '🚚 Đang giao hàng', value: 'shipping' },
        { label: '📦 Đã giao', value: 'delivered' },
        { label: '❌ Đã hủy', value: 'cancelled' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'note',
      type: 'textarea',
      label: 'Ghi chú khách hàng',
    },
    {
      name: 'adminNote',
      type: 'textarea',
      label: 'Ghi chú nội bộ',
    },
  ],
  timestamps: true,
};
