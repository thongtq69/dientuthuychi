---
description: Phase 2 - Luồng đăng nhập, đăng ký, quản lý phiên (session) khách hàng
---

# Phase 2: Authentication — Đăng nhập / Đăng ký

## Mục tiêu
Xây dựng luồng xác thực hoàn chỉnh cho khách hàng trên website. Tận dụng hệ thống auth tích hợp sẵn của Payload CMS 3 (JWT + cookie).

---

## 1. Payload CMS Auth — Tận dụng cái gì?

Khi đặt `auth: true` trên collection `Customers`, Payload **tự động tạo** các endpoint:

| Endpoint | Method | Mô tả |
|----------|--------|-------|
| `/api/customers/login` | POST | Nhận `email` + `password`, trả về JWT token |
| `/api/customers/logout` | POST | Hủy phiên đăng nhập |
| `/api/customers/me` | GET | Trả về thông tin user đang login (từ JWT) |
| `/api/customers/forgot-password` | POST | Gửi email reset mật khẩu |
| `/api/customers/reset-password` | POST | Đặt lại mật khẩu bằng token |
| `/api/customers` | POST | Tạo tài khoản mới (đăng ký) |

**Quan trọng:** Chúng ta **không cần** viết API route riêng cho auth — Payload xử lý hết. Chỉ cần viết wrapper Route Handler nếu muốn thêm logic tùy chỉnh (VD: validate phone, merge cart sau login).

---

## 2. Luồng đăng ký (Register)

```
Khách nhấn "Đăng ký"
    │
    ▼
Hiện AuthModal (tab Đăng ký)
    │
    ▼ Khách điền:
    │  - Họ và tên (bắt buộc)
    │  - Số điện thoại (bắt buộc, validate 10 số)
    │  - Email (bắt buộc, validate format)
    │  - Mật khẩu (bắt buộc, tối thiểu 6 ký tự)
    │
    ▼ Frontend validate
    │  ├── Thiếu trường → Hiện lỗi inline
    │  ├── SĐT sai format → "Số điện thoại không hợp lệ"
    │  └── Password < 6 → "Mật khẩu phải có ít nhất 6 ký tự"
    │
    ▼ Gọi POST /api/customers
    │  Body: { email, password, fullName, phone }
    │
    ▼ Payload xử lý:
    │  ├── Email trùng → 400 "Email đã tồn tại"
    │  ├── Hash password tự động (bcrypt)
    │  └── Tạo document trong MongoDB
    │
    ▼ Đăng ký thành công
    │
    ▼ Tự động login (gọi POST /api/customers/login)
    │  ├── Set JWT vào cookie (httpOnly, secure, sameSite=lax)
    │  └── Cookie name: `payload-token` hoặc tùy chỉnh
    │
    ▼ Đóng AuthModal
    │
    ▼ Frontend cập nhật state:
    │  ├── AuthContext.user = { id, email, fullName, phone }
    │  ├── Header hiện tên user + nút "Tài khoản"
    │  └── Trigger sync giỏ hàng (Phase 3)
    │
    ▼ Hoàn tất
```

---

## 3. Luồng đăng nhập (Login)

```
Khách nhấn "Đăng nhập"
    │
    ▼
Hiện AuthModal (tab Đăng nhập)
    │
    ▼ Khách điền:
    │  - Email
    │  - Mật khẩu
    │
    ▼ Gọi POST /api/customers/login
    │  Body: { email, password }
    │
    ▼ Payload xử lý:
    │  ├── Sai email/password → 401 "Unauthorized"
    │  └── Đúng → Trả về { token, user, exp }
    │
    ▼ Frontend:
    │  ├── Lưu JWT vào cookie (Payload tự set nếu dùng REST trực tiếp)
    │  ├── Cập nhật AuthContext.user
    │  ├── Đóng AuthModal
    │  ├── Header cập nhật hiện tên user
    │  └── Trigger cart merge (nếu có items trong localStorage)
    │
    ▼ Hoàn tất
```

---

## 4. Luồng đăng xuất (Logout)

```
User nhấn "Đăng xuất" (ở header hoặc trang tài khoản)
    │
    ▼ Gọi POST /api/customers/logout
    │
    ▼ Payload xóa token cookie
    │
    ▼ Frontend:
    │  ├── AuthContext.user = null
    │  ├── Header trở về trạng thái guest
    │  ├── Giỏ hàng localStorage vẫn giữ nguyên
    │  └── Redirect về trang chủ (nếu đang ở trang cần auth)
    │
    ▼ Hoàn tất
```

---

## 5. Kiểm tra phiên (Session Check)

### Khi nào kiểm tra?
- **App khởi tạo** (layout mount lần đầu)
- **Mỗi lần chuyển trang** (optional, nếu muốn bảo mật cao)
- **Trước khi checkout** (bắt buộc)

### Luồng kiểm tra

```
App mount / Page load
    │
    ▼ AuthContext gọi GET /api/customers/me
    │  (tự gửi cookie theo request)
    │
    ▼ Payload kiểm tra JWT cookie:
    │  ├── Không có cookie → Trả { user: null }
    │  ├── Token hết hạn → Trả { user: null }
    │  └── Token hợp lệ → Trả { user: { id, email, fullName, ... } }
    │
    ▼ Frontend cập nhật AuthContext.user
    │
    ▼ Quyết định hiển thị:
       ├── user != null → Hiện tên, avatar, menu tài khoản
       └── user == null → Hiện nút "Đăng nhập"
```

---

## 6. AuthContext — Quản lý state xác thực

### State cần quản lý

| State | Kiểu | Mô tả |
|-------|------|-------|
| user | Object hoặc null | Thông tin user đang login |
| loading | boolean | Đang kiểm tra session |
| showAuthModal | boolean | Hiện/ẩn modal đăng nhập |

### Methods cần cung cấp

| Method | Mô tả |
|--------|-------|
| login({ email, password }) | Gọi API login → cập nhật user |
| register({ email, password, fullName, phone }) | Gọi API register → auto login |
| logout() | Gọi API logout → xóa user |
| requireAuth() | Kiểm tra đã login chưa. Nếu chưa → mở AuthModal, trả `false`. Đã login → trả `true` |
| setShowAuthModal(bool) | Mở/đóng modal trực tiếp |

### Vị trí trong component tree

```
<body>
  <AuthProvider>       ← Bọc toàn bộ app
    <CartProvider>     ← Cần truy cập AuthContext
      <AuthModal />    ← Dùng useAuth()
      <CartDrawer />   ← Dùng useCart() 
      {children}       ← Tất cả pages
    </CartProvider>
  </AuthProvider>
</body>
```

---

## 7. AuthModal — Giao diện đăng nhập/đăng ký

### Mô tả giao diện

**Dạng:** Popup modal (overlay full-screen, center card)

**Gồm 2 tab:**
- Tab "Đăng nhập": email + password + nút ĐĂNG NHẬP
- Tab "Đăng ký": fullName + phone + email + password + nút TẠO TÀI KHOẢN

**Các element:**
- Overlay backdrop (click đóng modal)
- Nút ✕ đóng modal
- Vùng hiện lỗi (border đỏ, text đỏ)
- Link chuyển tab: "Chưa có tài khoản? **Đăng ký ngay**" / "Đã có tài khoản? **Đăng nhập**"
- Loading state khi đang gọi API (disable nút, hiện spinner)

### Khi nào modal tự mở?
1. User nhấn nút "Đăng nhập" trên Header
2. User nhấn "Thanh toán" ở giỏ hàng **khi chưa login** → Modal mở, sau khi login xong → tự redirect `/thanh-toan`
3. User truy cập trang cần auth (VD: `/tai-khoan`) khi chưa login

---

## 8. Thay đổi trên Header

### Trạng thái Guest (chưa login)

```
[Logo] [Tìm kiếm] [Gọi mua: 0899.918.668] [Đăng nhập] [Giỏ hàng (0)]
```

- Nút "Đăng nhập" → click mở AuthModal

### Trạng thái Logged-in

```
[Logo] [Tìm kiếm] [Gọi mua: 0899.918.668] [👤 Nguyễn Văn A ▾] [Giỏ hàng (3)]
```

- Hiện tên user + dropdown menu:
  - Tài khoản của tôi → `/tai-khoan`
  - Đơn hàng của tôi → `/tai-khoan/don-hang`
  - Đăng xuất → gọi `logout()`

---

## 9. Xử lý lỗi & Edge cases

| Tình huống | Xử lý |
|-----------|-------|
| Email đã tồn tại khi đăng ký | Hiện lỗi "Email này đã được đăng ký" |
| Sai email/password khi login | Hiện lỗi "Email hoặc mật khẩu không đúng" |
| Token hết hạn giữa chừng | AuthContext phát hiện khi gọi `/me` → reset user = null |
| Mất kết nối mạng | Hiện lỗi "Không thể kết nối, vui lòng thử lại" |
| Đang ở trang cần auth + bị logout | Redirect về trang chủ |
| Đăng ký với SĐT sai format | Validate client-side trước, server-side backup |
| Password quá ngắn | Validate client-side + Payload validate server-side |
| Brute force login | Rate limiting (middleware Next.js hoặc Payload hook) |

---

## 10. Bảo mật

- **Password**: Payload tự hash bằng bcrypt, **không bao giờ** trả về plain password qua API
- **JWT Token**: Lưu trong cookie `httpOnly` → JavaScript client không truy cập được → chống XSS
- **Cookie flags**: `secure` (chỉ HTTPS trong production), `sameSite=lax` (chống CSRF)
- **Token expiry**: Mặc định 7 ngày (cấu hình trong Payload auth config)
- **Rate limit**: Giới hạn số lần login sai (5 lần / 15 phút) → tránh brute force

---

## 11. Checklist hoàn thành Phase 2

- [ ] AuthContext hoạt động — loading / user state đúng
- [ ] AuthModal mở khi click "Đăng nhập" trên Header 
- [ ] Đăng ký tạo customer mới trong MongoDB
- [ ] Đăng nhập thành công → set cookie → Header hiện tên
- [ ] Refresh trang → session giữ nguyên (cookie vẫn valid)
- [ ] Đăng xuất → xóa cookie → về trạng thái guest
- [ ] Sai email/password → hiện lỗi chính xác
- [ ] Email trùng khi đăng ký → hiện cảnh báo
- [ ] `requireAuth()` mở modal khi chưa login
- [ ] Payload Admin `/admin` → thấy customers vừa đăng ký
