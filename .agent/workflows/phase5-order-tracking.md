---
description: Phase 5 - Theo dõi đơn hàng và trang tài khoản khách hàng
---

# Phase 5: Theo dõi đơn hàng & Tài khoản

## Mục tiêu
Xây dựng hệ thống tra cứu đơn hàng (có thể tra cứu không cần đăng nhập), trang tài khoản với lịch sử đơn hàng, và chức năng cập nhật thông tin cá nhân.

---

## 1. Tra cứu đơn hàng công khai (không cần login)

### Trang `/tra-cuu-don-hang`

**Mô tả:** Khách nhập mã đơn hàng + SĐT đặt hàng → xem trạng thái đơn. Giống tính năng tra cứu đơn hàng của Shopee/Lazada nhưng đơn giản hơn.

### Giao diện

```
┌──────────────────────────────────────────┐
│                                          │
│       📦 TRA CỨU ĐƠN HÀNG              │
│                                          │
│  Mã đơn hàng *                          │
│  [  DH-20260315-001              ]       │
│                                          │
│  Số điện thoại đặt hàng *               │
│  [  0899918668                   ]       │
│                                          │
│  [       TRA CỨU         ]              │
│                                          │
└──────────────────────────────────────────┘
```

### Luồng xử lý

```
Khách nhập mã đơn + SĐT
    │
    ▼ Gọi API: GET /api/orders?where[orderCode][equals]=DH-xxx
    │  (route handler tùy chỉnh, không dùng Payload API trực tiếp
    │   vì cần bỏ qua access control cho tra cứu công khai)
    │
    ▼ Server tìm order:
    │  ├── Không tìm thấy → "Không tìm thấy đơn hàng"
    │  ├── Tìm thấy nhưng SĐT không khớp → "Thông tin không chính xác"
    │  └── Tìm thấy + SĐT khớp → Trả về thông tin đơn (giới hạn)
    │
    ▼ Hiển thị kết quả:
       ├── Mã đơn, ngày đặt, trạng thái
       ├── Danh sách SP đã mua
       ├── Tổng tiền
       ├── Phương thức thanh toán
       └── Timeline trạng thái
```

### Thông tin hiển thị (giới hạn — không lộ dữ liệu nhạy cảm)

| Hiển thị | Ẩn |
|----------|-----|
| Mã đơn, ngày đặt | Email khách |
| Trạng thái + timeline | Địa chỉ chi tiết (chỉ hiện tỉnh/TP) |
| Danh sách SP + tổng tiền | Ghi chú nội bộ admin |
| Phương thức thanh toán | Thông tin tài khoản ngân hàng |

### Bảo mật
- **Phải khớp cả mã đơn VÀ SĐT** → tránh quét mã đơn ngẫu nhiên
- Rate limit: tối đa **10 lần tra cứu / IP / 15 phút**
- Không trả về `customer.id` hay thông tin profile

---

## 2. Trang tài khoản — Cấu trúc route

```
/tai-khoan                    ← Dashboard tổng quan
/tai-khoan/don-hang           ← Danh sách đơn hàng
/tai-khoan/don-hang/[code]    ← Chi tiết 1 đơn
/tai-khoan/thong-tin          ← Sửa thông tin cá nhân
/tai-khoan/dia-chi            ← Quản lý địa chỉ
/tai-khoan/doi-mat-khau       ← Đổi mật khẩu
```

**Bảo vệ:** Tất cả routes trong `/tai-khoan/*` yêu cầu đăng nhập. Nếu chưa login → redirect về trang chủ + mở AuthModal.

---

## 3. Trang `/tai-khoan` — Dashboard

### Giao diện

```
┌─── Sidebar (25%) ──────────┬─── Nội dung (75%) ───────────────┐
│                             │                                   │
│  👤 Nguyễn Văn A            │  TỔNG QUAN TÀI KHOẢN             │
│  email@test.com             │                                   │
│                             │  ┌─────┐ ┌─────┐ ┌─────┐        │
│  ─────────────────          │  │  3  │ │  1  │ │  0  │        │
│  📊 Tổng quan               │  │Đơn  │ │Đang │ │Đã   │        │
│  📋 Đơn hàng (3)           │  │hàng │ │giao │ │hủy  │        │
│  👤 Thông tin cá nhân       │  └─────┘ └─────┘ └─────┘        │
│  📍 Sổ địa chỉ             │                                   │
│  🔒 Đổi mật khẩu           │  ĐƠN HÀNG GẦN ĐÂY               │
│                             │                                   │
│  ─────────────────          │  ┌────────────────────────────┐  │
│  🚪 Đăng xuất               │  │ DH-20260315-001           │  │
│                             │  │ ⏳ Chờ xác nhận            │  │
│                             │  │ Samsung A36 × 1            │  │
│                             │  │ Tổng: 6.090.000đ           │  │
│                             │  │ [Xem chi tiết]             │  │
│                             │  └────────────────────────────┘  │
│                             │                                   │
└─────────────────────────────┴───────────────────────────────────┘
```

### Mobile layout
Sidebar trở thành **tab bar ngang** ở trên:
```
[Tổng quan] [Đơn hàng] [Thông tin] [Địa chỉ]
```

---

## 4. Trang `/tai-khoan/don-hang` — Danh sách đơn hàng

### Giao diện

- **Tabs lọc trạng thái:** Tất cả | Chờ xác nhận | Đang giao | Đã giao | Đã hủy
- **Mỗi đơn hiện:**
  - Mã đơn + ngày đặt
  - Badge trạng thái (màu theo status)
  - 1-2 ảnh SP đầu tiên + tên
  - Tổng tiền
  - Nút: "Xem chi tiết" / "Hủy đơn" (nếu status = pending)

### Lấy dữ liệu
- Gọi Payload API: `GET /api/orders?where[customer][equals]={userId}&sort=-createdAt`
- Access control tự lọc: customer chỉ thấy đơn của mình

### Màu badge trạng thái

| Status | Nhãn | Màu |
|--------|------|-----|
| pending | Chờ xác nhận | Vàng/Amber |
| confirmed | Đã xác nhận | Xanh dương |
| shipping | Đang giao | Tím |
| delivered | Đã giao | Xanh lá |
| cancelled | Đã hủy | Đỏ/Xám |

---

## 5. Trang `/tai-khoan/don-hang/[code]` — Chi tiết đơn hàng

### Giao diện

```
┌──────────────────────────────────────────┐
│  ← Quay lại                             │
│                                          │
│  ĐƠN HÀNG: DH-20260315-001             │
│  Ngày đặt: 15/03/2026 20:30             │
│                                          │
│  ══ TIMELINE TRẠNG THÁI ══              │
│                                          │
│  ● Đặt hàng thành công                  │
│  │  15/03/2026 — 20:30                   │
│  │                                       │
│  ● Đã xác nhận                           │
│  │  16/03/2026 — 09:15                   │
│  │                                       │
│  ○ Đang giao hàng                        │
│  │  (chưa cập nhật)                      │
│  │                                       │
│  ○ Đã giao                               │
│                                          │
│  ══ SẢN PHẨM ══                         │
│                                          │
│  ┌──────────────────────────────┐        │
│  │ [IMG] Samsung A36 Đen        │        │
│  │       × 1   6.090.000đ       │        │
│  └──────────────────────────────┘        │
│                                          │
│  ══ THÔNG TIN GIAO HÀNG ══              │
│  Nguyễn Văn A — 0899918668              │
│  123 Quang Trung, Q.Gò Vấp, TP.HCM    │
│                                          │
│  ══ THANH TOÁN ══                        │
│  Phương thức: COD                        │
│  Tạm tính:  6.090.000đ                  │
│  Phí ship:  Miễn phí                     │
│  TỔNG:      6.090.000đ                  │
│                                          │
│  [Hủy đơn hàng] (nếu status = pending)  │
│                                          │
└──────────────────────────────────────────┘
```

---

## 6. OrderTimeline Component

### Mô tả
Hiển thị tiến trình đơn hàng dạng vertical timeline. Mỗi bước là 1 node (tròn), nối bằng đường thẳng.

### Trạng thái node

| Node | Điều kiện | Hình dạng |
|------|-----------|-----------|
| Đã qua | Status hiện tại >= step này | ● tròn đặc + màu xanh/đỏ |
| Đang diễn ra | Status hiện tại = step này | ● tròn đặc + animation pulse |
| Chưa đến | Status hiện tại < step này | ○ tròn rỗng + màu xám |

### Các bước

| Thứ tự | Nhãn | Mô tả |
|:---:|------|-------|
| 1 | Đặt hàng thành công | Luôn có, hiện createdAt |
| 2 | Đã xác nhận | Nhân viên xác nhận đơn |
| 3 | Đang giao hàng | Đã chuyển cho shipper |
| 4 | Giao hàng thành công | Khách đã nhận |

### Trường hợp hủy
Nếu status = `cancelled`:
- Node cuối cùng đổi thành ❌ "Đã hủy" (màu đỏ)
- Hiện lý do hủy (từ `adminNote`)

---

## 7. Hủy đơn hàng (bởi khách)

### Điều kiện cho phép hủy
- Status hiện tại = `pending` (chưa xác nhận)
- Đơn được tạo chưa quá 24 giờ

### Luồng

```
Khách nhấn "Hủy đơn hàng"
    │
    ▼ Confirm dialog: "Bạn có chắc muốn hủy đơn DH-xxx?"
    │  ├── Hủy → đóng dialog
    │  └── Xác nhận → tiếp tục
    │
    ▼ Gọi API: PATCH /api/orders/{id}
    │  Body: { status: 'cancelled', note: 'Khách tự hủy' }
    │
    ▼ Nhưng Access Control không cho customer sửa status!
    │  → Cần 1 custom endpoint riêng: POST /api/orders/{id}/cancel
    │  → Server kiểm tra:
    │     ├── Order thuộc user đang login?
    │     ├── Status = pending?
    │     ├── Tạo chưa quá 24h?
    │     └── Nếu OK → đổi status = cancelled
    │
    ▼ Cập nhật UI → badge "Đã hủy"
    │
    ▼ (Tùy chọn) Gửi Telegram thông báo admin
```

---

## 8. Trang `/tai-khoan/thong-tin` — Sửa thông tin

### Giao diện
Form giống form đăng ký nhưng pre-filled thông tin hiện tại:
- Họ và tên
- Số điện thoại
- Email (readonly — không cho sửa)
- Nút "Lưu thay đổi"

### API
- Gọi Payload: `PATCH /api/customers/{id}`
- Access control: customer chỉ sửa bản ghi mình

---

## 9. Trang `/tai-khoan/dia-chi` — Quản lý địa chỉ

### Giao diện
- Hiện địa chỉ hiện tại (city, district, ward, address)
- Nút "Sửa"
- Form sửa (inline hoặc modal)
- Nút "Lưu"

### Dữ liệu
- Lưu trực tiếp trên document customer (address, city, district, ward)
- Mở rộng sau: hỗ trợ nhiều địa chỉ (array of addresses)

---

## 10. Trang `/tai-khoan/doi-mat-khau`

### Giao diện
- Mật khẩu hiện tại *
- Mật khẩu mới *
- Xác nhận mật khẩu mới *
- Nút "Đổi mật khẩu"

### Luồng
1. Frontend validate: mật khẩu mới ≥ 6 ký tự, khớp xác nhận
2. Gọi custom API route (hoặc Payload unlock/reset flow)
3. Verify mật khẩu cũ → hash mật khẩu mới → update
4. Thành công → hiện thông báo, có thể force re-login

---

## 11. Navigation giữa các trang tài khoản

### Trên Desktop
Sidebar cố định bên trái chứa menu:
- Tổng quan
- Đơn hàng (có badge số đơn pending)
- Thông tin cá nhân
- Sổ địa chỉ
- Đổi mật khẩu
- Đăng xuất

### Trên Mobile
Tab bar ngang ở trên, cuộn ngang nếu nhiều tab

---

## 12. Checklist hoàn thành Phase 5

### Tra cứu đơn hàng
- [ ] Trang `/tra-cuu-don-hang` hoạt động
- [ ] Nhập đúng mã + SĐT → hiển thị trạng thái đơn
- [ ] Nhập sai → thông báo lỗi phù hợp
- [ ] Không lộ thông tin nhạy cảm (email, địa chỉ chi tiết)

### Tài khoản
- [ ] `/tai-khoan` hiện dashboard với số liệu tổng quan
- [ ] `/tai-khoan/don-hang` list đúng đơn của user
- [ ] Tabs lọc trạng thái hoạt động
- [ ] Chi tiết đơn hàng hiện đầy đủ thông tin
- [ ] OrderTimeline hiện đúng tiến trình
- [ ] Hủy đơn hoạt động (chỉ khi pending + < 24h)
- [ ] Sửa thông tin cá nhân hoạt động
- [ ] Đổi mật khẩu hoạt động
- [ ] Chưa login → redirect về trang chủ + mở AuthModal
