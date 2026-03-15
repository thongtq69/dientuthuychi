---
description: Tổng quan kiến trúc hệ thống e-commerce trên Payload CMS 3
---

# Kiến trúc tổng thể — Điện Tử Thụy Chi

## 1. Stack hiện tại

| Thành phần | Công nghệ | Phiên bản |
|-----------|-----------|-----------|
| Framework | Next.js | 16.1.6 |
| CMS + Backend | Payload CMS | 3.79 |
| Database | MongoDB Atlas | Cluster0 |
| Styling | TailwindCSS | 4 |
| Image processing | Sharp | 0.34 |

## 2. Nguyên tắc thiết kế

### Payload CMS = Trung tâm quản lý
Payload CMS 3 **không chỉ** là CMS quản lý nội dung — nó là **backend engine** cho toàn bộ hệ thống:
- **Authentication** → Quản lý 2 loại user: Admin (nhân viên) và Customer (khách hàng)
- **REST API tự động** → Mỗi collection tự có đầy đủ CRUD API, không cần viết router riêng
- **Access Control** → Phân quyền chi tiết: ai được đọc/ghi/xóa gì
- **Hooks** → Tự động xử lý logic nghiệp vụ (sinh mã đơn, gửi thông báo, tính tổng)
- **Admin Panel** → Giao diện quản lý tại `/admin` để nhân viên thao tác

### Tách biệt rõ 2 "cửa"
- **Cửa trước** (`/`) → Website khách hàng xem, mua sắm
- **Cửa sau** (`/admin`) → Admin quản lý sản phẩm, đơn hàng, khách hàng, nội dung

## 3. Bản đồ Collections trong Payload

```
payload.config.js
│
├── 🔐 Users (Admin)          ← Nhân viên quản trị, đăng nhập vào /admin
├── 👤 Customers (Auth)       ← Khách hàng, đăng nhập trên website
│
├── 📦 Products               ← Sản phẩm (tên, giá, ảnh, thông số, slug)
├── 📂 Categories             ← Danh mục sản phẩm (Điện thoại, Tablet,...)
├── 🖼️ Media                  ← Quản lý file ảnh / video
├── 🎯 Banners                ← Banner quảng cáo trang chủ
│
├── 🛒 Carts                  ← Giỏ hàng server-side (gắn với Customer)
├── 📋 Orders                 ← Đơn hàng (sản phẩm, địa chỉ, trạng thái)
│
├── 📝 Posts (Tin tức)         ← Bài viết blog / tin tức
├── 📄 Pages                  ← Trang tĩnh (Giới thiệu, Chính sách,...)
├── ⚙️ Settings (Global)      ← Cấu hình chung (SĐT, địa chỉ, logo, SEO)
└── 🔔 Notifications (Global) ← Thông báo top-bar, popup khuyến mãi
```

## 4. Luồng dữ liệu tổng quan

```
┌─────────────────────────────────────────────────────────┐
│                    PAYLOAD CMS 3                        │
│                   (MongoDB Atlas)                       │
│                                                         │
│  Collections:                                           │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │
│  │ Products │ │Customers │ │  Orders  │ │  Carts   │  │
│  └─────┬────┘ └─────┬────┘ └─────┬────┘ └─────┬────┘  │
│        │            │            │            │         │
│  ┌─────┴────────────┴────────────┴────────────┴────┐   │
│  │           Payload REST API (tự động)            │   │
│  │  GET/POST/PATCH/DELETE /api/{collection}        │   │
│  │  POST /api/customers/login                      │   │
│  │  POST /api/customers/logout                     │   │
│  │  GET  /api/customers/me                         │   │
│  └─────────────────────┬───────────────────────────┘   │
│                        │                                │
└────────────────────────┼────────────────────────────────┘
                         │
          ┌──────────────┼──────────────┐
          │              │              │
    ┌─────┴─────┐ ┌──────┴─────┐ ┌─────┴─────┐
    │  Website  │ │ Admin Panel│ │ Mobile App│
    │  (Next.js)│ │  (/admin)  │ │  (tương   │
    │  Khách    │ │  Nhân viên │ │   lai)    │
    └───────────┘ └────────────┘ └───────────┘
```

## 5. Phân quyền (Access Control)

### Ma trận quyền

| Collection | Admin (Users) | Customer (đã login) | Khách (chưa login) |
|-----------|:---:|:---:|:---:|
| Products | Đọc/Ghi/Xóa | Đọc | Đọc |
| Categories | Đọc/Ghi/Xóa | Đọc | Đọc |
| Customers | Đọc/Ghi/Xóa | Đọc/Sửa bản ghi mình | Chỉ đăng ký |
| Orders | Đọc/Ghi/Xóa | Đọc đơn của mình + Tạo | ✗ |
| Carts | Đọc/Ghi/Xóa | Đọc/Sửa giỏ của mình | ✗ |
| Media | Đọc/Ghi/Xóa | Đọc | Đọc |
| Banners | Đọc/Ghi/Xóa | Đọc | Đọc |
| Posts | Đọc/Ghi/Xóa | Đọc | Đọc |
| Settings | Đọc/Ghi | Đọc | Đọc |

### Quy tắc quan trọng
- Customer **chỉ** thấy đơn hàng + giỏ hàng **của chính mình** (lọc theo `customer.id`)
- Customer **không thể** sửa `status` đơn hàng — chỉ Admin mới đổi trạng thái
- Customer **không thể** xóa đơn hàng — chỉ có thể yêu cầu hủy (chuyển status sang `cancellation_requested`)
- Khách chưa login vẫn xem được sản phẩm, nhưng **phải login** trước khi thanh toán

## 6. Thứ tự triển khai

| Phase | Tên | Phụ thuộc |
|:---:|------|-----------|
| 1 | Collections + Payload Config | Không |
| 2 | Đăng nhập / Đăng ký | Phase 1 |
| 3 | Giỏ hàng | Phase 1, 2 |
| 4 | Thanh toán + Đơn hàng | Phase 1, 2, 3 |
| 5 | Theo dõi đơn hàng | Phase 4 |
| 6 | Tài khoản khách hàng | Phase 2, 4 |
| 7 | Admin nâng cao + Globals | Phase 1 |
