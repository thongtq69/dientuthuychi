---
description: Phase 1 - Thiết kế chi tiết Payload Collections cho toàn bộ hệ thống
---

# Phase 1: Payload Collections — Thiết kế dữ liệu

## Mục tiêu
Thiết kế và đăng ký tất cả collections cần thiết trong Payload CMS 3 để quản lý toàn bộ website. Sau phase này, admin truy cập `/admin` sẽ thấy đầy đủ các mục quản lý.

---

## 1. Collection: Customers (Khách hàng)

### Vai trò
Lưu trữ thông tin khách hàng đăng ký trên website. Đây là collection có `auth: true` — Payload tự động xử lý:
- Trường `email` (unique, bắt buộc)
- Trường `password` (hash bcrypt, không trả về qua API)
- JWT token khi login
- Endpoints: `/api/customers/login`, `/api/customers/logout`, `/api/customers/me`

### Các trường dữ liệu

| Tên trường | Kiểu | Bắt buộc | Mô tả |
|-----------|------|:---:|-------|
| email | text | ✅ | Payload tự thêm khi `auth: true` |
| password | text | ✅ | Payload tự thêm, tự hash |
| fullName | text | ✅ | Họ và tên khách hàng |
| phone | text | ✅ | SĐT, validate format 10 số VN (bắt đầu bằng 0) |
| address | textarea | | Số nhà, tên đường |
| city | text | | Tỉnh / Thành phố |
| district | text | | Quận / Huyện |
| ward | text | | Phường / Xã |

### Phân quyền
- **Tạo mới**: Ai cũng được (cho phép đăng ký)
- **Đọc**: Admin đọc hết; Customer chỉ đọc bản ghi mình
- **Sửa**: Admin sửa hết; Customer chỉ sửa bản ghi mình
- **Xóa**: Chỉ Admin

### Admin Panel
- Nhóm: **"Khách hàng"**
- useAsTitle: `fullName`
- Cột hiển thị mặc định: fullName, email, phone, createdAt

---

## 2. Collection: Orders (Đơn hàng)

### Vai trò
Lưu trữ toàn bộ đơn hàng. Mỗi đơn gắn với 1 customer và chứa danh sách sản phẩm đã mua (snapshot tại thời điểm đặt).

### Các trường dữ liệu

| Tên trường | Kiểu | Bắt buộc | Mô tả |
|-----------|------|:---:|-------|
| orderCode | text (unique) | ✅ | Mã đơn hàng. Tự sinh bằng hook `beforeChange`. Format: `DH-YYYYMMDD-NNN` (VD: DH-20260315-001) |
| customer | relationship → customers | ✅ | Khách đặt hàng |
| items | array | ✅ | Danh sách sản phẩm (chi tiết bên dưới) |
| total | number | ✅ | Tổng tiền đơn hàng (VNĐ) |
| shippingAddress | group | | Địa chỉ giao (chi tiết bên dưới) |
| paymentMethod | select | | `cod` / `bank` / `installment` |
| status | select | ✅ | Trạng thái đơn (chi tiết bên dưới) |
| note | textarea | | Ghi chú khách hàng |
| adminNote | textarea | | Ghi chú nội bộ (chỉ admin thấy) |

### Chi tiết trường `items` (array)

Mỗi item trong đơn hàng lưu **snapshot** — không reference sang Products collection, vì giá/tên có thể thay đổi sau khi đặt.

| Trường con | Kiểu | Bắt buộc | Mô tả |
|-----------|------|:---:|-------|
| productSlug | text | ✅ | Slug SP để tạo link về trang SP |
| productName | text | ✅ | Tên SP tại thời điểm đặt |
| variant | text | | Phiên bản/Màu sắc đã chọn |
| price | number | ✅ | Đơn giá tại thời điểm đặt |
| quantity | number | ✅ | Số lượng (min: 1) |
| image | text | | URL ảnh SP |

### Chi tiết trường `shippingAddress` (group)

| Trường con | Kiểu | Mô tả |
|-----------|------|-------|
| fullName | text | Tên người nhận (có thể khác tên tài khoản) |
| phone | text | SĐT người nhận |
| address | textarea | Địa chỉ chi tiết |
| city | text | Tỉnh/TP |
| district | text | Quận/Huyện |
| ward | text | Phường/Xã |

### Chi tiết trường `status` (select)

| Giá trị | Nhãn hiển thị | Ai đổi | Mô tả |
|---------|---------------|--------|-------|
| `pending` | ⏳ Chờ xác nhận | Hệ thống (mặc định) | Khách vừa đặt, chưa ai xử lý |
| `confirmed` | ✅ Đã xác nhận | Admin | Nhân viên đã xác nhận đơn |
| `shipping` | 🚚 Đang giao | Admin | Đã chuyển cho đơn vị vận chuyển |
| `delivered` | 📦 Đã giao | Admin | Giao thành công |
| `cancelled` | ❌ Đã hủy | Admin | Đơn bị hủy (kèm lý do trong adminNote) |

### Hooks nghiệp vụ

1. **`beforeChange` (operation: create)** → Tự sinh `orderCode`:
   - Lấy ngày hiện tại → format `YYYYMMDD`
   - Đếm số đơn đã tạo trong ngày → +1 → pad 3 chữ số
   - Kết quả: `DH-20260315-001`

2. **`afterChange` (operation: create)** → Gửi thông báo:
   - Gửi Telegram cho Admin (nếu đã cấu hình bot)
   - Có thể gửi email xác nhận cho khách (tương lai)

3. **`beforeChange` (operation: update, field: status)** → Log lịch sử:
   - Khi Admin đổi status → ghi timestamp vào mảng `statusHistory` (mở rộng sau)

### Phân quyền
- **Tạo**: Customer đã login (khi checkout)
- **Đọc**: Admin đọc tất cả; Customer chỉ đọc đơn có `customer = mình`
- **Sửa**: Chỉ Admin (đổi status, thêm adminNote)
- **Xóa**: Chỉ Admin

### Admin Panel
- Nhóm: **"Đơn hàng"**
- useAsTitle: `orderCode`
- Cột mặc định: orderCode, customer (fullName), total, status, paymentMethod, createdAt
- Sidebar: orderCode, total, status, paymentMethod

---

## 3. Collection: Carts (Giỏ hàng server)

### Vai trò
Lưu giỏ hàng trên server cho khách đã đăng nhập. Mỗi customer chỉ có **1 cart** (unique trên trường `customer`). Cart tự xóa items sau khi checkout thành công.

### Các trường dữ liệu

| Tên trường | Kiểu | Bắt buộc | Mô tả |
|-----------|------|:---:|-------|
| customer | relationship → customers (unique) | ✅ | Chủ giỏ hàng |
| items | array | | Danh sách SP trong giỏ |

### Chi tiết `items` (array) — giống items trong Orders

| Trường con | Kiểu | Bắt buộc |
|-----------|------|:---:|
| productSlug | text | ✅ |
| productName | text | |
| variant | text | |
| price | number | |
| quantity | number | ✅ (min: 1) |
| image | text | |

### Cơ chế hoạt động
- Khách **chưa login** → Giỏ hàng lưu ở `localStorage` (frontend tự quản lý)
- Khách **login** → Giỏ hàng local **merge** vào giỏ server:
  - SP trùng (cùng slug + variant) → cộng dồn quantity
  - SP mới → thêm vào
- Sau khi **checkout thành công** → Xóa toàn bộ items trong cart
- Khách **logout** → Giữ nguyên giỏ server (để lần login sau còn)

### Phân quyền
- Customer chỉ CRUD giỏ của mình
- Admin CRUD tất cả (debug, hỗ trợ khách)

---

## 4. Mở rộng Collection: Products (Sản phẩm)

### Hiện tại đã có
name, slug, price, originalPrice, category, mainImage, description, family

### Cần bổ sung thêm

| Tên trường | Kiểu | Mô tả |
|-----------|------|-------|
| sku | text (unique) | Mã SKU sản phẩm |
| stock | number | Số lượng tồn kho (0 = hết hàng) |
| isActive | checkbox | Hiển thị trên website hay không |
| gallery | array of upload (Media) | Bộ ảnh sản phẩm |
| variants | array | Các phiên bản (màu, dung lượng) |
| specifications | json/group | Thông số kỹ thuật |
| brand | text | Thương hiệu |
| tags | array of text | Tags để lọc/tìm kiếm |
| seoTitle | text | Tiêu đề SEO |
| seoDescription | textarea | Mô tả SEO |
| featured | checkbox | Sản phẩm nổi bật (hiện trang chủ) |

### Chi tiết `variants` (array)

| Trường con | Kiểu | Mô tả |
|-----------|------|-------|
| name | text | Tên phiên bản ("Đen 128GB", "Xanh 256GB") |
| sku | text | Mã SKU phiên bản |
| price | number | Giá riêng (nếu khác giá gốc) |
| stock | number | Tồn kho riêng |
| image | upload (Media) | Ảnh riêng |
| color | text | Mã màu hoặc tên màu |

### Hooks
- **`beforeChange`** → Tự sinh `slug` từ `name` nếu chưa có
- **`afterChange`** → Invalidate cache danh mục (nếu dùng ISR)

---

## 5. Mở rộng Collection: Categories (Danh mục)

### Cần bổ sung

| Tên trường | Kiểu | Mô tả |
|-----------|------|-------|
| slug | text (unique) | URL-friendly slug |
| parent | relationship → categories (self) | Danh mục cha (hỗ trợ cây phân cấp) |
| image | upload (Media) | Ảnh đại diện danh mục |
| description | textarea | Mô tả danh mục |
| order | number | Thứ tự hiển thị |
| isActive | checkbox | Hiển thị hay ẩn |

---

## 6. Collection mới: Posts (Tin tức / Blog)

### Vai trò
Quản lý bài viết tin tức, blog, review sản phẩm. Hỗ trợ SEO và content marketing.

| Tên trường | Kiểu | Bắt buộc | Mô tả |
|-----------|------|:---:|-------|
| title | text | ✅ | Tiêu đề |
| slug | text (unique) | ✅ | URL slug |
| excerpt | textarea | | Tóm tắt bài viết |
| content | richText (Lexical) | | Nội dung đầy đủ |
| featuredImage | upload (Media) | | Ảnh đại diện |
| category | select | | tin-tuc / review / khuyen-mai / huong-dan |
| author | relationship → users | | Người viết |
| publishedDate | date | | Ngày xuất bản |
| status | select | | draft / published |
| seoTitle | text | | |
| seoDescription | textarea | | |
| tags | array of text | | |

### Admin Panel
- Nhóm: **"Nội dung"**
- Cột mặc định: title, category, status, publishedDate

---

## 7. Collection mới: Pages (Trang tĩnh)

### Vai trò
Quản lý các trang nội dung tĩnh: Giới thiệu, Chính sách bảo hành, Chính sách đổi trả, Liên hệ...

| Tên trường | Kiểu | Bắt buộc | Mô tả |
|-----------|------|:---:|-------|
| title | text | ✅ | Tiêu đề trang |
| slug | text (unique) | ✅ | URL: /trang/gioi-thieu |
| content | richText (Lexical) | | Nội dung |
| seoTitle | text | | |
| seoDescription | textarea | | |

### Admin Panel
- Nhóm: **"Nội dung"**

---

## 8. Global: SiteSettings (Cấu hình chung)

### Vai trò
Lưu các thông tin cấu hình toàn site. Global khác Collection ở chỗ: chỉ có **1 bản ghi duy nhất**, không có danh sách.

| Tên trường | Kiểu | Mô tả |
|-----------|------|-------|
| siteName | text | Tên website |
| logo | upload (Media) | Logo |
| phone | text | SĐT liên hệ chính |
| hotline | text | Hotline tư vấn |
| email | text | Email liên hệ |
| address | textarea | Địa chỉ cửa hàng |
| workingHours | text | "8h00 - 21h00 hàng ngày" |
| facebookUrl | text | Link FB |
| zaloUrl | text | Link Zalo |
| youtubeUrl | text | Link YouTube |
| tiktokUrl | text | Link TikTok |
| footerText | richText | Nội dung chân trang |
| seoTitle | text | Tiêu đề SEO mặc định |
| seoDescription | textarea | Mô tả SEO mặc định |
| seoImage | upload (Media) | Ảnh OG mặc định |
| topBarText | text | Dòng chữ chạy trên thanh top (VD: "CAM KẾT KHÔNG ZIN TẶNG MÁY") |
| freeShipThreshold | number | Đơn tối thiểu được freeship |
| telegramBotToken | text | Token bot Telegram nhận thông báo đơn |
| telegramChatId | text | Chat ID Telegram |

### Truy cập từ Frontend
- Gọi `payload.findGlobal({ slug: 'site-settings' })` để lấy cấu hình
- Truyền vào Header, Footer, SEO metadata

---

## 9. Global: Promotions (Khuyến mãi)

### Vai trò
Quản lý thông tin khuyến mãi hiển thị toàn site.

| Tên trường | Kiểu | Mô tả |
|-----------|------|-------|
| activePromotion | checkbox | Bật/tắt chương trình KM |
| promotionTitle | text | "Sinh nhật Giá Kho — Sale tới 50%" |
| promotionBanner | upload (Media) | Banner KM |
| couponCodes | array | Danh sách mã giảm giá |
| couponCodes.code | text | Mã (VD: AND50) |
| couponCodes.discount | number | Số tiền giảm |
| couponCodes.minOrder | number | Đơn tối thiểu |
| couponCodes.expiryDate | date | Hạn dùng |
| couponCodes.isActive | checkbox | Còn hoạt động? |

---

## 10. Cấu trúc Admin Panel sau khi hoàn thành

```
/admin
├── 📊 Dashboard (tổng quan)
│
├── 📦 Sản phẩm
│   ├── Products (danh sách SP, CRUD)
│   ├── Categories (danh mục, cây phân cấp)
│   └── Media (quản lý ảnh/video)
│
├── 👤 Khách hàng
│   ├── Customers (danh sách khách, xem thông tin)
│   └── Carts (xem giỏ hàng, debug/hỗ trợ)
│
├── 📋 Đơn hàng
│   └── Orders (xem, đổi trạng thái, in đơn)
│
├── 📝 Nội dung
│   ├── Posts (tin tức, blog, review)
│   ├── Pages (trang tĩnh)
│   └── Banners (banner quảng cáo)
│
├── ⚙️ Cài đặt
│   ├── Site Settings (thông tin cửa hàng)
│   └── Promotions (khuyến mãi, mã giảm giá)
│
└── 🔐 Quản trị
    └── Users (tài khoản admin)
```

---

## 11. Đăng ký vào payload.config.js

### Collections cần đăng ký (theo thứ tự)
1. Users (giữ nguyên — admin auth)
2. Customers (mới — customer auth)
3. Media (giữ nguyên)
4. Categories (mở rộng)
5. Products (mở rộng)
6. Banners (giữ nguyên)
7. Orders (mới)
8. Carts (mới)
9. Posts (mới)
10. Pages (mới)

### Globals cần đăng ký
1. SiteSettings (mới)
2. Promotions (mới)

### Cấu hình admin
- `admin.user` → giữ `users` (chỉ admin login vào /admin)
- `admin.meta.titleSuffix` → " — Điện Tử Thụy Chi Admin"

---

## 12. Kiểm tra sau khi hoàn thành Phase 1

- [ ] Dev server chạy không lỗi
- [ ] Truy cập `/admin` → thấy đầy đủ menu nhóm
- [ ] Thử tạo 1 Customer qua Admin
- [ ] Thử tạo 1 Order qua Admin (chọn customer, thêm items)
- [ ] Thử edit status Order  
- [ ] Thử truy cập `/api/customers` → thấy REST API hoạt động
- [ ] Thử truy cập `/api/orders` → thấy REST API hoạt động
- [ ] Settings global editable tại Admin
