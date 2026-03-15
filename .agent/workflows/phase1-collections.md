---
description: Phase 1 - Tạo Payload Collections cho e-commerce (Customers, Orders, Carts)
---

# Phase 1: Tạo Payload Collections

## Mục tiêu
Tạo 3 collections mới trong Payload CMS: `Customers` (khách hàng), `Orders` (đơn hàng), `Carts` (giỏ hàng server-side). Đăng ký vào `payload.config.js` để Payload tự tạo REST API + Admin UI.

## Yêu cầu trước khi bắt đầu
- MongoDB Atlas đang chạy (kiểm tra MONGODB_URI trong `.env`)
- Dev server có thể khởi động (`npm run dev`)

---

## Bước 1: Tạo file `src/collections/Customers.js`

Tạo file mới tại `src/collections/Customers.js` với nội dung:

```js
export const Customers = {
  slug: 'customers',
  auth: true,
  admin: {
    useAsTitle: 'fullName',
    group: 'Khách hàng',
    description: 'Tài khoản khách hàng đăng ký mua hàng',
  },
  access: {
    // Khách hàng chỉ đọc được thông tin của chính mình
    read: ({ req: { user } }) => {
      if (!user) return false;
      if (user.collection === 'users') return true; // Admin đọc tất cả
      return { id: { equals: user.id } };
    },
    // Khách hàng chỉ sửa được thông tin của chính mình
    update: ({ req: { user } }) => {
      if (!user) return false;
      if (user.collection === 'users') return true;
      return { id: { equals: user.id } };
    },
    // Ai cũng có thể đăng ký (create)
    create: () => true,
    // Chỉ admin mới xóa được
    delete: ({ req: { user } }) => {
      return user?.collection === 'users';
    },
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
          return 'Số điện thoại không hợp lệ (VD: 0899918668)';
        }
        return true;
      },
    },
    {
      name: 'address',
      type: 'textarea',
      label: 'Địa chỉ chi tiết',
      admin: { description: 'Số nhà, tên đường, tòa nhà...' },
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
```

**Giải thích:**
- `auth: true` → Payload tự động thêm trường `email` + `password`, xử lý hash, tạo JWT
- `access` → Phân quyền: Admin (collection `users`) đọc hết, customer chỉ đọc/sửa bản ghi của mình
- `validate` trên `phone` → Kiểm tra format SĐT Việt Nam (10 số, bắt đầu bằng 0)

---

## Bước 2: Tạo file `src/collections/Orders.js`

Tạo file mới tại `src/collections/Orders.js`:

```js
export const Orders = {
  slug: 'orders',
  admin: {
    useAsTitle: 'orderCode',
    group: 'Đơn hàng',
    description: 'Quản lý đơn hàng của khách',
    defaultColumns: ['orderCode', 'customer', 'total', 'status', 'createdAt'],
  },
  access: {
    // Khách chỉ đọc đơn của mình, admin đọc hết
    read: ({ req: { user } }) => {
      if (!user) return false;
      if (user.collection === 'users') return true;
      return { customer: { equals: user.id } };
    },
    // Chỉ tạo đơn khi đã đăng nhập
    create: ({ req: { user } }) => !!user,
    // Chỉ admin mới sửa/xóa đơn
    update: ({ req: { user } }) => user?.collection === 'users',
    delete: ({ req: { user } }) => user?.collection === 'users',
  },
  hooks: {
    beforeChange: [
      // Tự động sinh mã đơn hàng khi tạo mới
      async ({ data, operation, req }) => {
        if (operation === 'create' && !data.orderCode) {
          const now = new Date();
          const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
          const prefix = `DH-${dateStr}-`;

          // Đếm số đơn trong ngày
          const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          const result = await req.payload.find({
            collection: 'orders',
            where: { createdAt: { greater_than: startOfDay.toISOString() } },
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
  ],
  timestamps: true,
};
```

**Giải thích:**
- Hook `beforeChange` → Tự động tạo mã đơn `DH-20260315-001` khi tạo đơn mới
- `customer` relation → Liên kết đơn hàng với tài khoản khách
- `items` array → Lưu snapshot sản phẩm tại thời điểm mua (giá có thể thay đổi sau)
- `shippingAddress` group → Địa chỉ giao hàng riêng (có thể khác địa chỉ mặc định)

---

## Bước 3: Tạo file `src/collections/Carts.js`

Tạo file mới tại `src/collections/Carts.js`:

```js
export const Carts = {
  slug: 'carts',
  admin: {
    group: 'Khách hàng',
    description: 'Giỏ hàng server-side (sync khi đăng nhập)',
  },
  access: {
    read: ({ req: { user } }) => {
      if (!user) return false;
      if (user.collection === 'users') return true;
      return { customer: { equals: user.id } };
    },
    create: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => {
      if (!user) return false;
      if (user.collection === 'users') return true;
      return { customer: { equals: user.id } };
    },
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
```

---

## Bước 4: Đăng ký collections vào `payload.config.js`

Sửa file `src/payload.config.js`, thêm import và đăng ký:

```js
import { buildConfig } from 'payload'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path';
import { fileURLToPath } from 'url';

import { Users } from './collections/Users';
import { Media } from './collections/Media';
import { Categories } from './collections/Categories';
import { Products } from './collections/Products';
import { Banners } from './collections/Banners';
import { Customers } from './collections/Customers';
import { Orders } from './collections/Orders';
import { Carts } from './collections/Carts';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    user: Users.slug,
  },
  collections: [Users, Media, Categories, Products, Banners, Customers, Orders, Carts],
  editor: lexicalEditor({}),
  secret: process.env.PAYLOAD_SECRET,
  db: mongooseAdapter({
    url: process.env.MONGODB_URI,
  }),
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  graphQL: {
    schemaOutputFile: path.resolve(dirname, 'generated-schema.graphql'),
  },
});
```

---

## Bước 5: Kiểm tra

// turbo
1. Khởi động dev server: `npm run dev`
2. Truy cập `/admin` → Đăng nhập bằng admin account
3. Xác nhận thấy 3 nhóm mới trong sidebar:
   - Khách hàng → Customers, Carts
   - Đơn hàng → Orders
4. Thử tạo 1 customer test qua Admin UI
5. Thử tạo 1 order test qua Admin UI

## Kết quả mong đợi
- ✅ 3 collections xuất hiện trong Payload Admin
- ✅ REST API tự động có sẵn: `GET/POST /api/customers`, `GET/POST /api/orders`, `GET/POST /api/carts`
- ✅ Auth endpoint cho customers: `POST /api/customers/login`, `POST /api/customers/logout`, `GET /api/customers/me`
- ✅ MongoDB Atlas có thêm 3 collections mới

## File đã thay đổi
- `src/collections/Customers.js` ← MỚI
- `src/collections/Orders.js` ← MỚI
- `src/collections/Carts.js` ← MỚI
- `src/payload.config.js` ← SỬA (thêm 3 imports + đăng ký)
