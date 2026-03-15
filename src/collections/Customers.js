export const Customers = {
  slug: 'customers',
  auth: true,
  admin: {
    useAsTitle: 'fullName',
    group: 'Khách hàng',
    defaultColumns: ['fullName', 'email', 'phone', 'createdAt'],
  },
  access: {
    read: ({ req }) => {
      const user = req?.user;
      if (!user) return false;
      if (user.collection === 'users') return true;
      return { id: { equals: user.id } };
    },
    update: ({ req }) => {
      const user = req?.user;
      if (!user) return false;
      if (user.collection === 'users') return true;
      return { id: { equals: user.id } };
    },
    create: () => true,
    delete: ({ req }) => req?.user?.collection === 'users',
  },
  fields: [
    {
      name: 'fullName',
      type: 'text',
      required: true,
      label: 'Họ và tên',
    },
    {
      name: 'phone',
      type: 'text',
      required: true,
      label: 'Số điện thoại',
      validate: (val) => {
        if (val && !/^0\d{9}$/.test(val)) {
          return 'Số điện thoại không hợp lệ (10 số, bắt đầu bằng 0)';
        }
        return true;
      },
    },
    {
      name: 'address',
      type: 'textarea',
      label: 'Địa chỉ chi tiết',
    },
    {
      name: 'city',
      type: 'text',
      label: 'Tỉnh/Thành phố',
    },
    {
      name: 'district',
      type: 'text',
      label: 'Quận/Huyện',
    },
    {
      name: 'ward',
      type: 'text',
      label: 'Phường/Xã',
    },
  ],
  timestamps: true,
};
