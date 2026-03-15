---
description: Phase 6 - Payload Admin nâng cao, Globals, và quản lý vận hành
---

# Phase 6: Payload Admin — Quản lý vận hành

## Mục tiêu
Tối ưu hóa giao diện Admin Panel của Payload CMS 3 để nhân viên cửa hàng có thể quản lý toàn bộ hoạt động kinh doanh: xử lý đơn hàng, quản lý sản phẩm, cấu hình website, và theo dõi khách hàng.

---

## 1. Dashboard Admin tổng quan

### Mô tả
Trang `/admin` sau khi login hiển thị dashboard overview với các số liệu quan trọng.

### Widgets cần hiện

| Widget | Mô tả | Query |
|--------|-------|-------|
| Đơn hàng mới | Số đơn status = `pending` chưa xử lý | `orders where status = pending, count` |
| Đơn hôm nay | Tổng đơn tạo hôm nay | `orders where createdAt > startOfDay` |
| Doanh thu hôm nay | Tổng `total` các đơn delivered hôm nay | Sum total of delivered orders today |
| Khách hàng mới | Số customer đăng ký hôm nay | `customers where createdAt > startOfDay` |
| Đơn cần xử lý | 5 đơn pending gần nhất | `orders where status = pending, limit 5, sort -createdAt` |

### Payload hỗ trợ
- Dashboard components tùy chỉnh qua `admin.components.Dashboard`
- Hoặc dùng Payload Dashboard plugin

---

## 2. Quản lý đơn hàng — Workflow Admin

### Luồng xử lý đơn hàng

```
Đơn mới vào (status: pending)
    │
    ▼ Admin nhận thông báo:
    │  ├── Telegram bot message
    │  ├── Dashboard hiện badge đỏ trên menu "Đơn hàng"
    │  └── Email (tùy cấu hình)
    │
    ▼ Admin mở đơn trong Payload Admin:
    │  ├── Xem sản phẩm, số lượng, tổng tiền
    │  ├── Xem thông tin khách + SĐT
    │  ├── Xem địa chỉ giao hàng
    │  └── Xem phương thức thanh toán
    │
    ▼ Admin quyết định:
    │  ├── Xác nhận → Đổi status: pending → confirmed
    │  │    (Ghi adminNote: "Đã xác nhận, chuẩn bị hàng")
    │  │
    │  ├── Hủy → Đổi status: pending → cancelled
    │  │    (Ghi adminNote: "Hết hàng SP X" hoặc lý do khác)
    │  │
    │  └── Gọi lại khách → Ghi adminNote trước, giữ status pending
    │
    ▼ Khi đã giao cho shipper:
    │  Đổi status: confirmed → shipping
    │  (Ghi adminNote: "Mã vận đơn: GHTK-12345")
    │
    ▼ Khi khách nhận hàng:
    │  Đổi status: shipping → delivered
    │  (Ghi adminNote: "Giao thành công 16/03/2026")
    │
    ▼ Hoàn tất
```

### Giao diện quản lý đơn trong Admin Panel

Payload tự tạo form chỉnh sửa. Cần tùy chỉnh:
- **Sidebar:** orderCode, total, status, paymentMethod, createdAt (quick view)
- **defaultColumns** trong list view: orderCode, customer.fullName, total, status, paymentMethod, createdAt
- **Status field** dùng select → Admin chọn từ dropdown → Save
- **adminNote** field riêng cho nội bộ (khách không thấy)

### Tùy chỉnh nâng cao (nếu cần)
- **Nút quick-action** trên list: "Xác nhận" / "Chuyển giao" — thay đổi status nhanh không cần mở form
- **Filter** theo status, ngày tạo, phương thức thanh toán
- **Bulk action**: chọn nhiều đơn → đổi status cùng lúc

---

## 3. Quản lý sản phẩm — Cải tiến Admin UX

### Hiện tại
Products collection có: name, slug, price, originalPrice, category, mainImage, description, family

### Cải tiến Admin Panel

#### Tổ chức fields theo tabs/groups

```
Tab 1: THÔNG TIN CƠ BẢN
├── name (tên SP)
├── slug (auto-gen từ name)
├── sku (mã SP)
├── brand (thương hiệu)
├── category (danh mục — relationship)
├── family (dòng SP: Galaxy A, iPhone 16...)
└── isActive (hiển thị trên web?)

Tab 2: GIÁ & TỒN KHO
├── price (giá bán)
├── originalPrice (giá gốc / niêm yết)  
├── stock (tồn kho tổng)
└── variants (array — mỗi variant có price, stock, color, image riêng)

Tab 3: HÌNH ẢNH
├── mainImage (ảnh chính — upload)
└── gallery (bộ ảnh — array of upload)

Tab 4: MÔ TẢ & THÔNG SỐ
├── description (richText — Lexical editor)
├── specifications (JSON hoặc group — thông số kỹ thuật)
└── featured (checkbox — SP nổi bật)

Tab 5: SEO
├── seoTitle
├── seoDescription
└── seoImage (OG image)
```

#### Hooks hữu ích cho Products
- **beforeChange**: Tự sinh slug từ name (nếu chưa có)
- **beforeChange**: Tự tính `originalPrice > price` → set `hasDiscount = true`
- **afterChange**: Invalidate ISR cache cho trang SP (nếu dùng)

---

## 4. SiteSettings Global — Cấu hình toàn web

### Mô tả
Global config lưu **1 bản ghi duy nhất** chứa thông tin chung. Admin sửa tại `/admin/globals/site-settings`.

### Tổ chức fields

```
Tab 1: THÔNG TIN CỬA HÀNG
├── siteName: "Điện Tử Thụy Chi"
├── logo: upload (Media)
├── phone: "0899.918.668"
├── hotline: "1900 8922"
├── email: "info@dientuthuychi.vn"
├── address: "947 Quang Trung, P. An Hội Tây, TP.HCM"
├── workingHours: "8h00 - 21h00 hàng ngày"
└── mapEmbedUrl: (Google Maps embed link)

Tab 2: MẠNG XÃ HỘI
├── facebookUrl
├── zaloUrl
├── youtubeUrl
├── tiktokUrl
├── instagramUrl
└── messengerUrl

Tab 3: THANH TOÁN
├── bankName: "Ngân hàng ACB"
├── bankAccountNumber: "123456789"
├── bankAccountName: "CÔNG TY TNHH ĐIỆN TỬ THỤY CHI"
├── bankBranch: "Chi nhánh HCM"
└── bankQRImage: upload (ảnh QR code)

Tab 4: HIỂN THỊ
├── topBarText: "CAM KẾT KHÔNG ZIN TẶNG MÁY"
├── topBarEnabled: checkbox
├── freeShipThreshold: 500000 (đơn tối thiểu freeship)
├── footerText: richText
└── maintenanceMode: checkbox (bật/tắt trang bảo trì)

Tab 5: THÔNG BÁO
├── telegramBotToken: text
├── telegramChatId: text
├── emailNotificationsEnabled: checkbox
└── notificationEmail: text

Tab 6: SEO MẶC ĐỊNH
├── seoTitle: text
├── seoDescription: textarea
└── seoImage: upload (OG image mặc định)
```

### Cách sử dụng từ Frontend
- Server Component gọi: `await payload.findGlobal({ slug: 'site-settings' })`
- Truyền vào Header (phone, logo), Footer (address, socials), SEO (meta tags)
- Giá trị thay đổi real-time khi admin sửa (không cần rebuild)

---

## 5. Promotions Global — Khuyến mãi

### Tổ chức fields

```
CHƯƠNG TRÌNH KHUYẾN MÃI
├── isActive: checkbox (bật/tắt hiển thị KM trên web)
├── title: "Sinh nhật Giá Kho — Sale tới 50%"
├── description: richText
├── banner: upload (banner KM)
├── startDate: date
├── endDate: date
│
MÃ GIẢM GIÁ
├── coupons: array
│   ├── code: text ("AND50")
│   ├── description: "Giảm 50.000đ"
│   ├── discountAmount: number (50000)
│   ├── minOrderAmount: number (0 = không giới hạn)
│   ├── maxUsage: number (0 = không giới hạn)
│   ├── currentUsage: number (đếm số lần đã dùng)
│   ├── expiryDate: date
│   └── isActive: checkbox
```

### Áp dụng mã giảm giá
- Trang checkout có ô nhập mã
- Gọi API validate: kiểm tra mã tồn tại, active, chưa hết hạn, chưa vượt maxUsage, đơn đủ minOrder
- Nếu hợp lệ → trừ discountAmount vào total
- Sau khi đặt đơn → currentUsage +1

---

## 6. Collection: Banners — Quản lý banner

### Cải tiến

| Tên trường | Kiểu | Mô tả |
|-----------|------|-------|
| title | text | Tên banner (admin dùng) |
| image | upload (Media) | Ảnh banner |
| mobileImage | upload (Media) | Ảnh riêng cho mobile |
| link | text | URL khi click |
| position | select | `hero` / `mid-page` / `sidebar` / `popup` |
| order | number | Thứ tự hiển thị |
| isActive | checkbox | Bật/tắt |
| startDate | date | Ngày bắt đầu hiện |
| endDate | date | Ngày hết hạn |

### Logic hiển thị
- Chỉ lấy banners `isActive = true` và `startDate ≤ hôm nay ≤ endDate`
- Sắp xếp theo `order`
- Hero banners → slider trang chủ
- Mid-page banners → xen giữa nội dung

---

## 7. Quản lý nội dung — Posts & Pages

### Posts (Tin tức / Blog / Review)
- Editor richText dùng **Lexical** (Payload mặc định)
- Hỗ trợ chèn ảnh, video, embed YouTube
- Status workflow: draft → published
- SEO fields riêng cho mỗi bài

### Pages (Trang tĩnh)
- Giới thiệu, Chính sách, Điều khoản
- Admin tự sửa nội dung không cần developer
- URL: `/trang/{slug}`

---

## 8. Payload Admin — Cấu hình giao diện

### Tùy chỉnh Admin Panel

| Setting | Giá trị | Mô tả |
|---------|---------|-------|
| admin.meta.titleSuffix | " — Điện Tử Thụy Chi" | Title tab browser |
| admin.meta.favicon | "/favicon.ico" | Icon tab |
| admin.avatar | "fullName" hoặc custom | Avatar user |
| collection.admin.group | "Sản phẩm", "Khách hàng"... | Nhóm menu sidebar |
| collection.admin.defaultColumns | [...] | Cột mặc định trong list view |
| collection.admin.useAsTitle | "name" / "orderCode"... | Trường hiện ở title |

### Nhóm menu Admin sidebar (thứ tự)

```
1. 📊 Dashboard
2. 📋 Đơn hàng
   └── Orders
3. 📦 Sản phẩm  
   ├── Products
   └── Categories
4. 👤 Khách hàng
   ├── Customers
   └── Carts
5. 📝 Nội dung
   ├── Posts
   ├── Pages
   └── Banners
6. 🖼️ Media Library
7. ⚙️ Cài đặt
   ├── Site Settings
   └── Promotions
8. 🔐 Quản trị
   └── Users (admin accounts)
```

---

## 9. Hooks tổng hợp cho toàn hệ thống

| Collection | Hook | Timing | Hành vi |
|-----------|------|--------|---------|
| Orders | beforeChange | create | Sinh orderCode |
| Orders | afterChange | create | Gửi Telegram, xóa cart |
| Orders | afterChange | update (status) | Gửi Telegram cập nhật status |
| Products | beforeChange | create/update | Tự sinh slug |
| Customers | afterChange | create | Gửi Telegram "khách mới" |
| Coupons | beforeValidate | - | Check hết hạn, maxUsage |

---

## 10. Bảo mật hệ thống

| Lớp | Biện pháp |
|-----|-----------|
| Authentication | JWT + httpOnly cookie, bcrypt password hash |
| Authorization | Access Control trên mỗi collection |
| API | Rate limiting cho login/register (middleware) |
| Admin Panel | Chỉ Users (admin) login được `/admin` |
| Data | Customers auth tách biệt, không vào được admin |
| Input | Validate ở cả client + Payload field validation |
| Upload | Sharp xử lý ảnh, giới hạn file size |
| Environment | Secrets trong `.env`, không commit |

---

## 11. Checklist hoàn thành Phase 6

- [ ] Admin Panel có đầy đủ menu nhóm theo thiết kế
- [ ] Đơn hàng: list, filter theo status, sửa status, ghi adminNote
- [ ] Products: tabs tổ chức fields rõ ràng, variants hoạt động
- [ ] SiteSettings: sửa thông tin cửa hàng → website cập nhật
- [ ] Promotions: thêm/sửa mã giảm giá, bật/tắt chương trình KM
- [ ] Banners: thêm/sửa banner, schedule hiển thị
- [ ] Posts: tạo bài viết, đăng xuất bản
- [ ] Pages: sửa trang tĩnh
- [ ] Hooks: orderCode tự sinh, Telegram gửi thông báo
- [ ] Phân quyền: Admin CRUD tất cả, Customer giới hạn đúng
