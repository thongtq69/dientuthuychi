---
description: Phase 4 - Luồng thanh toán và tạo đơn hàng
---

# Phase 4: Checkout — Thanh toán & Tạo đơn hàng

## Mục tiêu
Xây dựng luồng thanh toán hoàn chỉnh: từ giỏ hàng → xác nhận thông tin giao hàng → chọn phương thức thanh toán → tạo đơn hàng trong MongoDB → hiện trang xác nhận.

---

## 1. Luồng tổng quan

```
CartDrawer: nhấn "TIẾN HÀNH THANH TOÁN"
    │
    ▼ requireAuth()
    │  ├── Chưa login → Mở AuthModal → Login → quay lại flow
    │  └── Đã login → tiếp tục
    │
    ▼ Navigate → /thanh-toan
    │
    ▼ Trang Checkout hiển thị 3 phần:
    │
    │  ┌─────────────────────────────────────────────────┐
    │  │  BƯỚC 1: Xem lại giỏ hàng                      │
    │  │  Danh sách SP, quantity, giá, tổng             │
    │  ├─────────────────────────────────────────────────┤
    │  │  BƯỚC 2: Thông tin giao hàng                   │
    │  │  Auto-fill từ profile (nếu có)                 │
    │  │  Cho phép sửa hoặc nhập mới                    │
    │  ├─────────────────────────────────────────────────┤
    │  │  BƯỚC 3: Phương thức thanh toán                │
    │  │  ○ COD   ○ Chuyển khoản   ○ Trả góp           │
    │  ├─────────────────────────────────────────────────┤
    │  │  [ □ Đã đọc và đồng ý điều khoản ]            │
    │  │  [      ĐẶT HÀNG NGAY      ]                  │
    │  └─────────────────────────────────────────────────┘
    │
    ▼ Nhấn "ĐẶT HÀNG NGAY"
    │
    ▼ Frontend validate:
    │  ├── Giỏ hàng trống → "Vui lòng thêm sản phẩm"
    │  ├── Thiếu tên/SĐT/địa chỉ → highlight field lỗi
    │  └── Chưa tick đồng ý → "Vui lòng đồng ý điều khoản"
    │
    ▼ Gọi API tạo đơn hàng:
    │  POST /api/orders
    │  Body: {
    │    customer: userId,
    │    items: [...cartItems],
    │    total: cartTotal,
    │    shippingAddress: { fullName, phone, address, city, ... },
    │    paymentMethod: "cod" | "bank" | "installment",
    │    note: "ghi chú..."
    │  }
    │
    ▼ Server xử lý:
    │  ├── Payload hook tự sinh orderCode: "DH-20260315-001"
    │  ├── Tạo document trong collection orders
    │  ├── Xóa giỏ hàng (clear cart items)
    │  └── (Tùy chọn) Gửi thông báo Telegram cho admin
    │
    ▼ Trả về: { orderCode, orderId }
    │
    ▼ Navigate → /xac-nhan-don/{orderCode}
    │
    ▼ Trang xác nhận hiển thị:
        ✅ Đặt hàng thành công!
        Mã đơn hàng: DH-20260315-001
        Tổng tiền: 6.090.000đ
        [Theo dõi đơn hàng] [Tiếp tục mua sắm]
```

---

## 2. Trang `/thanh-toan` — Thiết kế giao diện

### Bố cục chính

```
┌── Breadcrumb: Trang chủ > Thanh toán ────────────────────────┐
│                                                               │
│  ┌─── CỘT TRÁI (60%) ──────────┬─── CỘT PHẢI (40%) ──────┐ │
│  │                              │                           │ │
│  │  📋 THÔNG TIN GIAO HÀNG     │  🛒 ĐƠN HÀNG CỦA BẠN    │ │
│  │                              │                           │ │
│  │  Họ và tên *                 │  SP1: Samsung A36         │ │
│  │  [___________________]       │     Đen × 1  6.090.000đ  │ │
│  │                              │                           │ │
│  │  Số điện thoại *             │  SP2: Oppo A6t            │ │
│  │  [___________________]       │     Xanh × 2  7.580.000đ │ │
│  │                              │                           │ │
│  │  Tỉnh/Thành phố *           │  ──────────────────────── │ │
│  │  [▾ Chọn tỉnh/TP ]          │  Tạm tính:  13.670.000đ  │ │
│  │                              │  Phí ship:    Miễn phí    │ │
│  │  Quận/Huyện *                │  ──────────────────────── │ │
│  │  [▾ Chọn quận/huyện ]       │  TỔNG:    13.670.000đ     │ │
│  │                              │                           │ │
│  │  Phường/Xã                   │                           │ │
│  │  [▾ Chọn phường/xã ]        │                           │ │
│  │                              │                           │ │
│  │  Địa chỉ chi tiết *         │                           │ │
│  │  [___________________]       │                           │ │
│  │                              │                           │ │
│  │  💳 PHƯƠNG THỨC THANH TOÁN   │                           │ │
│  │  ● COD (nhận hàng trả tiền) │                           │ │
│  │  ○ Chuyển khoản ngân hàng   │                           │ │
│  │  ○ Trả góp 0%               │                           │ │
│  │                              │                           │ │
│  │  📝 Ghi chú (tùy chọn)      │                           │ │
│  │  [___________________]       │                           │ │
│  │                              │                           │ │
│  │  □ Tôi đồng ý với chính     │                           │ │
│  │    sách bán hàng             │                           │ │
│  │                              │                           │ │
│  │  [   ĐẶT HÀNG NGAY   ]     │                           │ │
│  │                              │                           │ │
│  └──────────────────────────────┴───────────────────────────┘ │
│                                                               │
└───────────────────────────────────────────────────────────────┘
```

### Auto-fill thông tin giao hàng
- Khi trang load → lấy `user` từ AuthContext
- Auto-fill: fullName, phone, address, city, district, ward
- Khách có thể sửa bất kỳ trường nào (giao hàng cho người khác)
- Checkbox "Lưu làm địa chỉ mặc định" → update customer profile

### Phương thức thanh toán

| Phương thức | Giá trị | Mô tả hiển thị |
|------------|---------|----------------|
| COD | `cod` | Thanh toán khi nhận hàng. Icon: 💵. Mặc định |
| Chuyển khoản | `bank` | Chuyển khoản ngân hàng. Sau khi đặt → hiện thông tin tài khoản |
| Trả góp | `installment` | Trả góp 0% qua Home Credit / Kredivo. Link form đăng ký |

### Khi chọn "Chuyển khoản"
Sau khi đặt hàng thành công, trang xác nhận hiển thị thêm:
- Tên TK: CÔNG TY TNHH ĐIỆN TỬ THỤY CHI
- Số TK: (lấy từ SiteSettings)
- Ngân hàng: (lấy từ SiteSettings)
- Nội dung CK: [Mã đơn hàng]
- QR code chuyển khoản (nếu có)

---

## 3. Validate trước khi đặt hàng

### Client-side (trước khi gọi API)

| Trường | Validate |
|--------|----------|
| items | Không được rỗng |
| fullName | Bắt buộc, min 2 ký tự |
| phone | Bắt buộc, format 10 số VN |
| city | Bắt buộc |
| district | Bắt buộc |
| address | Bắt buộc, min 5 ký tự |
| paymentMethod | Phải chọn 1 |
| agree | Phải tick đồng ý |

### Server-side (trong API / Payload hook)

| Kiểm tra | Xử lý nếu fail |
|----------|----------------|
| User đã login? | 401 Unauthorized |
| items.length > 0? | 400 "Giỏ hàng trống" |
| Mỗi item có price > 0 và qty > 0? | 400 "Thông tin SP không hợp lệ" |
| total khớp với sum(price × qty)? | Tự tính lại total, không tin client |
| Customer ID hợp lệ? | 400 |
| Tồn kho đủ? (nếu dùng stock tracking) | 400 "SP X đã hết hàng" |

---

## 4. Tạo đơn hàng — Logic server-side

### Thứ tự xử lý trong Payload hook `beforeChange` (create)

1. **Validate** tất cả items
2. **Tính lại total** từ items (KHÔNG dùng total từ client)
3. **Sinh orderCode**: `DH-{YYYYMMDD}-{NNN}`
   - Đếm số đơn đã tạo hôm nay → +1 → pad 3 chữ số
4. **Set status** = `pending`
5. **Return data** (Payload tạo document)

### Thứ tự xử lý trong Payload hook `afterChange` (create)

1. **Xóa giỏ hàng** của customer (clear items trong cart)
2. **Gửi thông báo Telegram** cho admin (nếu đã cấu hình):
   ```
   🛒 ĐƠN HÀNG MỚI!
   Mã: DH-20260315-001
   KH: Nguyễn Văn A — 0899918668
   Tổng: 6.090.000đ
   Thanh toán: COD
   ```
3. **Giảm tồn kho** (nếu dùng stock tracking — mở rộng sau)

---

## 5. Trang `/xac-nhan-don/[orderCode]`

### Thiết kế giao diện

```
┌──────────────────────────────────────────┐
│                                          │
│        ✅ ĐẶT HÀNG THÀNH CÔNG!          │
│                                          │
│   Cảm ơn bạn đã đặt hàng tại           │
│   Điện Tử Thụy Chi                       │
│                                          │
│   ┌──────────────────────────────┐       │
│   │ Mã đơn hàng: DH-20260315-001│       │
│   │ Ngày đặt: 15/03/2026        │       │
│   │ Tổng tiền: 6.090.000đ       │       │
│   │ Thanh toán: COD              │       │
│   │ Trạng thái: ⏳ Chờ xác nhận │       │
│   └──────────────────────────────┘       │
│                                          │
│   📦 Sản phẩm đã đặt:                  │
│   • Samsung Galaxy A36 5G  × 1          │
│     Đen — 6.090.000đ                    │
│                                          │
│   📍 Giao đến:                          │
│   Nguyễn Văn A — 0899918668            │
│   123 Quang Trung, P. An Hội Tây       │
│   TP.HCM                                │
│                                          │
│   ┌───────────────────────────────┐      │
│   │    (Thông tin CK nếu bank)   │      │
│   └───────────────────────────────┘      │
│                                          │
│   [Theo dõi đơn hàng]  [Tiếp tục mua]  │
│                                          │
└──────────────────────────────────────────┘
```

### Bảo mật
- Trang này chỉ hiện cho user sở hữu đơn hàng (check `order.customer === currentUser.id`)
- Hoặc cho phép xem nếu biết mã đơn + SĐT (tra cứu công khai — Phase 5)

---

## 6. Xử lý edge cases

| Tình huống | Xử lý |
|-----------|-------|
| Refresh trang checkout | Đọc lại giỏ hàng từ localStorage / server |
| Quay lại checkout sau khi đã đặt | Giỏ đã clear → redirect về "Giỏ hàng trống" |
| 2 tab cùng checkout | Tab nào đặt trước thì thành công, tab sau giỏ đã clear → báo lỗi |
| Mất mạng khi đặt hàng | Hiện lỗi "Không thể kết nối", giữ nguyên form |
| Giá SP thay đổi so với khi thêm vào giỏ | Server tính lại total từ items, client hiện giá cũ nhưng order lưu giá cũ (snapshot) |
| User đổi SĐT nhận hàng khác SĐT tài khoản | OK — shippingAddress lưu riêng, không ảnh hưởng profile |

---

## 7. Checklist hoàn thành Phase 4

- [ ] Trang `/thanh-toan` hiển thị đúng giỏ hàng + form giao hàng
- [ ] Auto-fill thông tin từ profile customer
- [ ] Validate tất cả trường bắt buộc
- [ ] Chọn phương thức thanh toán hoạt động
- [ ] Nhấn "Đặt hàng" → tạo Order trong MongoDB
- [ ] orderCode tự sinh đúng format `DH-YYYYMMDD-NNN`
- [ ] Giỏ hàng tự clear sau khi đặt thành công
- [ ] Redirect đến trang xác nhận với thông tin đơn
- [ ] Thông báo Telegram gửi cho admin (nếu đã cấu hình)
- [ ] Vào Payload Admin → thấy đơn hàng mới với status `pending`
