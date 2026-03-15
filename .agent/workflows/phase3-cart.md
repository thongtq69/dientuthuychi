---
description: Phase 3 - Thiết kế hệ thống giỏ hàng hybrid (localStorage + server sync)
---

# Phase 3: Giỏ hàng (Cart System)

## Mục tiêu
Xây dựng hệ thống giỏ hàng hoạt động cho cả khách chưa đăng nhập (localStorage) và đã đăng nhập (sync lên MongoDB qua Payload API). Tạo giao diện CartDrawer (sidebar), CartIcon (badge trên Header), nút "Thêm vào giỏ" trên trang sản phẩm.

---

## 1. Chiến lược Hybrid Cart

### Tại sao dùng hybrid?
- **Khách chưa login** vẫn phải thêm được vào giỏ → lưu `localStorage`
- **Khách đã login** muốn giỏ hàng đồng bộ giữa các thiết bị → lưu server (MongoDB)
- Khi login → **merge** giỏ local vào giỏ server, không mất dữ liệu

### Bảng so sánh

| Trạng thái | Nơi lưu | Đồng bộ? | Mất khi xóa browser? |
|-----------|---------|:-:|:-:|
| Chưa login | localStorage | ✗ | Có |
| Đã login | MongoDB (collection `carts`) | ✅ | Không |

### Sơ đồ chuyển đổi

```
┌──────────────────┐         ┌──────────────────┐
│  localStorage     │  LOGIN  │  MongoDB (Carts) │
│  [A, B, C]       │ ──────→ │  [B, D]          │
│                  │  merge  │                  │
│                  │         │  Kết quả:        │
│                  │         │  [A, B(+qty), C, D]│
└──────────────────┘         └──────────────────┘
                                      │
                              LOGOUT  │
                                      ▼
                    ┌──────────────────┐
                    │  Giỏ server giữ  │
                    │  nguyên [A,B,C,D]│
                    │  localStorage    │
                    │  reset về []     │
                    └──────────────────┘
```

---

## 2. Cấu trúc dữ liệu Cart Item

Mỗi item trong giỏ hàng (dù localStorage hay server) đều có cùng cấu trúc:

| Trường | Kiểu | Bắt buộc | Mô tả |
|--------|------|:---:|-------|
| productSlug | string | ✅ | Slug để tạo link `/san-pham/{slug}` |
| productName | string | ✅ | Tên hiển thị |
| variant | string | | Phiên bản đã chọn (VD: "Đen 128GB") |
| price | number | ✅ | Giá tại thời điểm thêm vào giỏ |
| quantity | number | ✅ | Số lượng (min: 1) |
| image | string | | URL ảnh sản phẩm |

### Unique key
Một item được xác định duy nhất bởi cặp `productSlug + variant`. Nghĩa là:
- "Samsung A36 Đen" và "Samsung A36 Xanh" → 2 items khác nhau
- Thêm "Samsung A36 Đen" lần 2 → cộng dồn `quantity`, không tạo item mới

---

## 3. CartContext — Quản lý state giỏ hàng

### State

| State | Kiểu | Mô tả |
|-------|------|-------|
| items | CartItem[] | Danh sách SP trong giỏ |
| showCartDrawer | boolean | Hiện/ẩn sidebar giỏ hàng |
| syncing | boolean | Đang sync với server |

### Computed values

| Giá trị | Công thức | Mô tả |
|---------|-----------|-------|
| cartCount | Tổng quantity của tất cả items | Hiện trên badge CartIcon |
| cartTotal | Σ (price × quantity) | Hiện ở footer CartDrawer |

### Methods

| Method | Tham số | Hành vi |
|--------|---------|---------|
| addToCart | (product) | Nếu đã có (cùng slug+variant) → cộng quantity. Nếu chưa → thêm mới. Sau đó mở CartDrawer |
| removeFromCart | (slug, variant) | Xóa item khỏi giỏ |
| updateQuantity | (slug, variant, qty) | Đổi quantity. Nếu qty ≤ 0 → xóa luôn |
| clearCart | () | Xóa toàn bộ giỏ (localStorage + server nếu đã login) |

### Lifecycle

1. **Khi mount:** Đọc giỏ hàng từ `localStorage` (key: `thuychi-cart`)
2. **Khi items thay đổi:** Ghi ngay vào `localStorage`
3. **Khi user login (AuthContext.user có giá trị):** Trigger merge flow
4. **Khi user logout:** Reset items ở localStorage về `[]`, giỏ server giữ nguyên

---

## 4. Luồng Merge Cart khi Login

```
User vừa login thành công
    │
    ▼ CartContext phát hiện user != null (effect dependency)
    │
    ▼ Bước 1: Lấy giỏ server
    │  GET /api/carts?where[customer][equals]={userId}
    │  → serverItems: [B, D]
    │
    ▼ Bước 2: Lấy giỏ local
    │  localStorage.getItem('thuychi-cart')
    │  → localItems: [A, B, C]
    │
    ▼ Bước 3: Merge
    │  Bắt đầu: kết quả = bản copy của serverItems
    │  Duyệt từng localItem:
    │    ├── Nếu trùng (slug+variant) → cộng dồn quantity
    │    └── Nếu không trùng → thêm vào kết quả
    │  → mergedItems: [B(qty cộng), D, A, C]
    │
    ▼ Bước 4: Push lên server
    │  POST /api/carts  (hoặc PATCH /api/carts/{id})
    │  Body: { customer: userId, items: mergedItems }
    │
    ▼ Bước 5: Cập nhật state
    │  setItems(mergedItems)
    │  localStorage cũng tự cập nhật (effect dependency)
    │
    ▼ Hoàn tất merge
```

---

## 5. API endpoints cho Cart

Sử dụng **Payload REST API** tự động (từ collection `carts`), kết hợp wrapper route nếu cần logic thêm.

### Payload auto-endpoints

| Endpoint | Method | Mô tả |
|----------|--------|-------|
| `/api/carts` | GET | Lấy danh sách carts (lọc theo access control) |
| `/api/carts` | POST | Tạo cart mới |
| `/api/carts/{id}` | PATCH | Cập nhật cart |
| `/api/carts/{id}` | DELETE | Xóa cart |

### Custom wrapper (nếu cần)

| Route | Method | Mô tả |
|-------|--------|-------|
| `/api/cart` | GET | Lấy giỏ hàng của user hiện tại (decode JWT → tìm cart) |
| `/api/cart` | POST | Upsert: tạo hoặc cập nhật giỏ (tìm theo customer ID) |
| `/api/cart` | DELETE | Xóa toàn bộ items trong giỏ của user hiện tại |

**Tại sao cần wrapper?** Vì Payload auto-endpoint `/api/carts` hoạt động theo CRUD thô. Wrapper `/api/cart` (không có "s") giúp frontend đơn giản hơn — chỉ cần gọi 1 endpoint, server tự tìm/tạo cart cho user đang login.

---

## 6. UI Components

### 6.1 CartIcon (trong Header)

**Vị trí:** Cạnh nút Đăng nhập / Tên user, góc phải Header

**Hành vi:**
- Hiện icon giỏ hàng (SVG shopping bag)
- Badge đỏ ở góc phải trên hiện `cartCount`
- Badge có animation pulse khi vừa thêm SP
- Click → mở CartDrawer

### 6.2 CartDrawer (Sidebar giỏ hàng)

**Dạng:** Panel trượt từ bên phải, overlay nền đen mờ

**Bố cục:**
```
┌─ CartDrawer ──────────────────────┐
│ Header: "Giỏ hàng (3)"       [✕] │
│───────────────────────────────────│
│                                   │
│  ┌─ Item ───────────────────┐    │
│  │ [IMG]  Samsung Galaxy A36│    │
│  │        Đen 128GB         │    │
│  │        6.090.000đ        │    │
│  │   [−] 1 [+]       [Xóa] │    │
│  └──────────────────────────┘    │
│                                   │
│  ┌─ Item ───────────────────┐    │
│  │ [IMG]  Oppo A6t          │    │
│  │        Xanh              │    │
│  │        3.790.000đ        │    │
│  │   [−] 2 [+]       [Xóa] │    │
│  └──────────────────────────┘    │
│                                   │
│───────────────────────────────────│
│ Tạm tính:          13.670.000đ   │
│ [    TIẾN HÀNH THANH TOÁN     ]  │
│          Xóa tất cả              │
└───────────────────────────────────┘
```

**Trạng thái giỏ trống:**
- Icon giỏ hàng lớn ở giữa
- Text: "Giỏ hàng trống"
- Subtext: "Thêm sản phẩm để bắt đầu mua sắm"

**Nút "TIẾN HÀNH THANH TOÁN":**
- Click → kiểm tra `requireAuth()`
  - Chưa login → Mở AuthModal (đóng CartDrawer)
  - Đã login → Đóng CartDrawer → Navigate `/thanh-toan`

### 6.3 AddToCartButton (trên trang sản phẩm)

**Vị trí:** Thay thế nút "MUA NGAY" tĩnh hiện tại trên trang `/san-pham/[slug]`

**Hành vi:**
1. Click → gọi `addToCart()` với thông tin SP hiện tại
2. Nút đổi thành "✓ Đã thêm vào giỏ" (màu xanh) trong 2 giây
3. CartDrawer tự mở ra hiện SP vừa thêm
4. Sau 2 giây → nút trở lại trạng thái "THÊM VÀO GIỎ HÀNG"

**Lưu ý:** Component này phải là **Client Component** (`'use client'`) vì dùng `useCart()` hook. Trang sản phẩm (`page.js`) là Server Component → import trực tiếp vẫn OK.

### 6.4 Trang `/gio-hang` (Full page giỏ hàng — tùy chọn)

**Vai trò:** Phiên bản full-page của CartDrawer, cho khách muốn xem chi tiết hơn.

**Bố cục:**
```
Breadcrumb: Trang chủ > Giỏ hàng

┌─ Danh sách SP (70%) ─────────────────┬─ Tóm tắt (30%) ──────┐
│                                       │                       │
│  [✓] Chọn tất cả (3 sản phẩm)       │  Tạm tính: 13.670.000│
│                                       │  Phí ship:  Miễn phí  │
│  ┌────────────────────────────────┐  │  ─────────────────── │
│  │ [✓] [IMG] SP1  qty  đơn giá   │  │  Tổng:   13.670.000đ │
│  │              thành tiền   [Xóa]│  │                       │
│  └────────────────────────────────┘  │  [  THANH TOÁN  ]     │
│  ...                                 │                       │
└───────────────────────────────────────┴───────────────────────┘
```

---

## 7. Xử lý edge cases

| Tình huống | Xử lý |
|-----------|-------|
| Giá SP thay đổi sau khi đã thêm vào giỏ | Giỏ lưu giá snapshot. Khi checkout, có thể check lại giá hiện tại từ Products collection |
| SP bị xóa / ẩn sau khi thêm vào giỏ | Khi render CartDrawer, SP không tìm thấy slug → hiện badge "Hết hàng" trên item |
| SP hết tồn kho | Khi checkout validate stock. Nếu hết → thông báo và loại khỏi đơn |
| Thêm cùng SP nhiều lần liên tục | Cộng dồn quantity, không tạo duplicate |
| Merge giỏ khi server và local đều có cùng SP | Cộng dồn quantity từ cả 2 nguồn |
| localStorage bị xóa (user xóa cache) | Giỏ mất nếu chưa login. Nếu đã login → vẫn còn trên server |
| Số lượng quantity = 0 | Tự xóa item khỏi giỏ |

---

## 8. Checklist hoàn thành Phase 3

- [ ] Thêm SP vào giỏ từ trang sản phẩm → CartDrawer mở, hiện SP
- [ ] CartIcon trên Header hiện badge số lượng
- [ ] Tăng/giảm quantity trong CartDrawer
- [ ] Xóa item khỏi giỏ
- [ ] "Xóa tất cả" xóa toàn bộ giỏ
- [ ] Refresh trang → giỏ vẫn còn (localStorage persist)
- [ ] Login → giỏ merge lên server thành công
- [ ] Mở tab mới, login cùng tài khoản → giỏ đồng bộ từ server
- [ ] Logout → giỏ local reset, server giữ nguyên
- [ ] Tổng tiền `cartTotal` tính đúng
- [ ] Nhấn "Thanh toán" khi chưa login → mở AuthModal
