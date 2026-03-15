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
    create: ({ req }) => !!req?.user,
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
          const seq = String(result.totalDocs + 1).padStart(3, '0');
          data.orderCode = prefix + seq;
        }
        return data;
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
      required: true,
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
