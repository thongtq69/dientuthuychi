export const siteMeta = {
  name: 'Hoàng Kiên',
  hotline: '0813600999',
  address: 'Hệ thống cửa hàng điện thoại, linh kiện và phụ kiện Apple chính hãng',
  supportHours: '08:00 - 22:00 mỗi ngày',
  searchPlaceholder: 'Bạn cần tìm gì hôm nay...',
};

export const utilityLinks = [
  { label: 'Hệ thống cửa hàng', href: '#he-thong-cua-hang' },
  { label: 'Tra cứu đơn hàng', href: '#tra-cuu-don-hang' },
  { label: 'Thu cũ đổi mới', href: '#thu-cu-doi-moi' },
  { label: 'Tin công nghệ', href: '#tin-tuc' },
];

export const navItems = [
  { label: 'Trang chủ', href: '/' },
  {
    label: 'Điện thoại',
    href: '/danh-muc/dien-thoai',
    children: ['iPhone mới', 'iPhone 99%', 'iPhone Pro Max', 'iPhone tiêu chuẩn'],
  },
  {
    label: 'Phụ kiện',
    href: '/danh-muc/phu-kien',
    children: ['Sạc & cáp', 'Pin sạc dự phòng', 'Tai nghe', 'Phụ kiện Vivumax'],
  },
  {
    label: 'Linh kiện',
    href: '/danh-muc/linh-kien',
    children: ['Pin Feaglet', 'Pin EU', 'Màn hình', 'Camera'],
  },
  { label: 'Tin tức', href: '#tin-tuc' },
];

export const featuredCategories = [
  {
    title: 'Điện thoại iPhone',
    href: '/danh-muc/dien-thoai',
    image: 'https://bizweb.dktcdn.net/100/112/815/products/iphone-17promax-du-mau-88a053ed-0742-445a-869b-0b0d876590ce.png?v=1765510576573',
    description: 'Máy mới, máy cũ đẹp, đủ cấu hình từ tiêu chuẩn đến Pro Max.',
  },
  {
    title: 'Pin Feaglet',
    href: '/danh-muc/linh-kien',
    image: 'https://bizweb.dktcdn.net/100/112/815/products/pin-15-promax.png?v=1764920853963',
    description: 'Nhóm pin linh kiện bán mạnh, dễ mở rộng thành collection riêng.',
  },
  {
    title: 'Sạc & cáp',
    href: '/danh-muc/phu-kien',
    image: 'https://bizweb.dktcdn.net/100/112/815/products/6.png?v=1744702826943',
    description: 'Củ sạc, cáp C to C, C to Lightning và nhiều combo phổ biến.',
  },
  {
    title: 'Vivumax',
    href: '/danh-muc/phu-kien',
    image: 'https://bizweb.dktcdn.net/100/112/815/products/2.png?v=1760931405503',
    description: 'Phụ kiện tầm giá dễ mua, hợp để đẩy thành block riêng trên home.',
  },
  {
    title: 'Pin EU',
    href: '/danh-muc/linh-kien',
    image: 'https://bizweb.dktcdn.net/100/112/815/products/987b7279884f23117a5e-0e3a87fc-0b54-4da9-bf81-606f5793c0fa-9b74d55e-fc69-4a38-9d33-19730b2a4430-6d1dcfa9-e109-4260-a99a-c6706d7237a6.jpg?v=1764901190337',
    description: 'Tập trung pin thay thế và linh kiện sửa chữa cho iPhone đời phổ biến.',
  },
];

export const heroSlides = [
  {
    eyebrow: 'Apple, linh kiện và phụ kiện chuyên sâu',
    title: 'Bản rebuild bám sát nhịp storefront gốc của Hoàng Kiên hơn',
    description:
      'Tái dựng lại cảm giác trang chủ theo phong cách Bizweb/Sapo: header tiện ích dày hơn, danh mục nổi bật rõ hơn, nhiều khối promo xen giữa các dải sản phẩm và footer giàu thông tin hơn.',
    ctaLabel: 'Xem danh mục điện thoại',
    ctaHref: '/danh-muc/dien-thoai',
    image: 'https://bizweb.dktcdn.net/100/112/815/themes/966034/assets/banner.jpg?1768028836881',
    stats: ['Giao nhanh nội thành', '1 đổi 1 lỗi NSX', 'Trả góp linh hoạt'],
  },
  {
    eyebrow: 'Cấu trúc sẵn sàng mở rộng',
    title: 'Có homepage, category page và product detail page dùng chung một hệ dữ liệu',
    description:
      'Không dừng ở landing demo: pass này thêm template danh mục và trang chi tiết sản phẩm để cảm giác storefront liền mạch hơn trên desktop lẫn mobile.',
    ctaLabel: 'Xem pin linh kiện',
    ctaHref: '/danh-muc/linh-kien',
    image: 'https://bizweb.dktcdn.net/100/112/815/themes/966034/assets/banner2.jpg?1768028836881',
    stats: ['Product grid/list', 'Gallery + tabs', 'Related products'],
  },
];

export const promoBanners = [
  {
    title: 'Bảo hành 12 tháng - lỗi đổi 1',
    description: 'Block promo ngắn kiểu banner ngang, tái hiện nhịp xen kẽ giữa các section sản phẩm.',
    href: '/danh-muc/dien-thoai',
    image: 'https://bizweb.dktcdn.net/100/112/815/themes/966034/assets/banner_top.jpg?1768028836881',
    tone: 'dark',
  },
  {
    title: 'Giao hàng tận nơi miễn phí nội thành',
    description: 'Mô phỏng utility selling-point nổi bật thường thấy trên home của site gốc.',
    href: '/danh-muc/phu-kien',
    image: 'https://bizweb.dktcdn.net/100/112/815/themes/966034/assets/banner.jpg?1768028836881',
    tone: 'light',
  },
];

export const products = [
  {
    slug: 'iphone-17-pro-max-256gb-chinh-hang',
    name: 'iPhone 17 Pro Max 256GB Chính Hãng',
    shortName: 'iPhone 17 Pro Max 256GB',
    price: '36.900.000₫',
    oldPrice: '38.490.000₫',
    badge: 'Mới về',
    status: 'Còn hàng',
    category: 'dien-thoai',
    family: 'iPhone',
    image: 'https://bizweb.dktcdn.net/thumb/large/100/112/815/products/iphone-17promax-du-mau-88a053ed-0742-445a-869b-0b0d876590ce.png?v=1765510576573',
    gallery: [
      'https://bizweb.dktcdn.net/thumb/grande/100/112/815/products/iphone-17promax-du-mau-88a053ed-0742-445a-869b-0b0d876590ce.png?v=1765510576573',
      'https://bizweb.dktcdn.net/thumb/grande/100/112/815/products/iphone-17promax-du-mau-b7babcb4-7c57-4102-b2dc-88df10ff4b3c.png?v=1761108111403',
      'https://bizweb.dktcdn.net/thumb/grande/100/112/815/products/iphone-17promax-du-mau-c902dfad-36e0-436b-8ed4-9ec2b20ab7be.png?v=1761108430573',
    ],
    excerpt: 'Flagship chủ lực để đẩy ở hero, category và related rail.',
    breadcrumbs: ['Trang chủ', 'Điện thoại', 'iPhone'],
    highlights: ['Màn hình lớn', 'Hiệu năng flagship', 'Camera nâng cấp'],
    variants: [
      { label: '256GB', price: '36.900.000₫', href: '/san-pham/iphone-17-pro-max-256gb-chinh-hang' },
      { label: '512GB', price: '39.900.000₫', href: '#' },
    ],
    colors: ['Titan Đen', 'Titan Tự Nhiên', 'Xanh Đậm'],
    specs: [
      ['Màn hình', 'OLED 6.9 inch'],
      ['Chip', 'Apple A19 Pro'],
      ['Camera', '48MP + 12MP + Tele'],
      ['Pin', 'Tối ưu cả ngày'],
      ['Kết nối', 'USB-C / Wi‑Fi 7'],
    ],
    description: [
      'Đây là sản phẩm anchor phù hợp để tái hiện kiểu trưng bày trên site gốc: ảnh lớn, giá nổi bật, badge trạng thái rõ và CTA mua nhanh.',
      'Trong pass front-end này, trọng tâm là bố cục và cảm giác mua sắm: gallery rộng, khu vực lựa chọn phiên bản/màu, khối quyền lợi và section thông số/chi tiết được tách nhịp rõ ràng.',
    ],
  },
  {
    slug: 'iphone-16-pro-max-512gb',
    name: 'iPhone 16 Pro Max 512GB',
    shortName: 'iPhone 16 Pro Max 512GB',
    price: '28.000.000₫',
    oldPrice: '29.500.000₫',
    badge: 'Bán chạy',
    status: 'Còn hàng',
    category: 'dien-thoai',
    family: 'iPhone',
    image: 'https://bizweb.dktcdn.net/thumb/large/100/112/815/products/16prm-full-da134920-b18f-41e8-a5c9-50312d7d0e9d-a373a501-a879-49b7-8036-024e2dead860.png?v=1730447868917',
    gallery: [
      'https://bizweb.dktcdn.net/thumb/grande/100/112/815/products/16prm-full-da134920-b18f-41e8-a5c9-50312d7d0e9d-a373a501-a879-49b7-8036-024e2dead860.png?v=1730447868917',
      'https://bizweb.dktcdn.net/thumb/grande/100/112/815/products/full-anh-16pro-72f8a447-3d0a-4d5b-9572-0bef22c06d28-00733168-fd90-4e2c-ac0e-d4fe342c4cdb.png?v=1730448605057',
    ],
    excerpt: 'Model high-end đời gần nhất, dùng để giữ dải iPhone trên homepage nhìn bớt rỗng.',
    breadcrumbs: ['Trang chủ', 'Điện thoại', 'iPhone'],
    highlights: ['5x Tele', 'Titanium', 'USB‑C'],
    variants: [
      { label: '256GB', price: '25.900.000₫', href: '#' },
      { label: '512GB', price: '28.000.000₫', href: '/san-pham/iphone-16-pro-max-512gb' },
    ],
    colors: ['Titan Đen', 'Titan Trắng'],
    specs: [
      ['Màn hình', '6.9 inch OLED'],
      ['Chip', 'Apple A18 Pro'],
      ['Camera', '48MP'],
      ['Pin', 'Tốt cả ngày'],
    ],
    description: ['Bố cục PDP có thể tái dùng cho các dòng iPhone khác mà không cần thay đổi component.'],
  },
  {
    slug: 'apple-iphone-15-128gb',
    name: 'Apple iPhone 15 - 128GB',
    shortName: 'iPhone 15 128GB',
    price: '13.600.000₫',
    oldPrice: '15.200.000₫',
    badge: 'Mirror PDP',
    status: 'Còn hàng',
    category: 'dien-thoai',
    family: 'iPhone',
    image: 'https://bizweb.dktcdn.net/thumb/large/100/112/815/products/po-p-compressed-4bc7063a-7269-439e-ad18-f2beb809f7d1.jpg?v=1730280101420',
    gallery: [
      'https://bizweb.dktcdn.net/thumb/grande/100/112/815/products/po-p-compressed-4bc7063a-7269-439e-ad18-f2beb809f7d1.jpg?v=1730280101420',
      'https://bizweb.dktcdn.net/thumb/grande/100/112/815/products/ip-o-compressed-e0aa4989-ade1-463e-abec-b692cbd8509d.jpg?v=1730280101420',
      'https://bizweb.dktcdn.net/thumb/grande/100/112/815/products/p-iio-compressed-b9e6c740-6284-40ee-a1d2-0cfc93677fcc.jpg?v=1730280101420',
      'https://bizweb.dktcdn.net/thumb/grande/100/112/815/products/rydut-compressed-f353f009-caaa-4276-b2ea-5444635177af.jpg?v=1730280101420',
      'https://bizweb.dktcdn.net/thumb/grande/100/112/815/products/6657o6-compressed-3ae701e7-89a5-404e-a603-45491cba0028.jpg?v=1730280101420',
      'https://bizweb.dktcdn.net/thumb/grande/100/112/815/products/rri6r-compressed-5c3bc826-aaa2-4f21-80bf-0450201e02fd.jpg?v=1730280101420',
    ],
    excerpt: 'Seed trực tiếp từ mirror PDP để giúp template sản phẩm bám cấu trúc gốc hơn.',
    breadcrumbs: ['Trang chủ', 'Điện thoại', 'iPhone'],
    highlights: ['A16 Bionic', 'Camera chính 48MP', 'Dynamic Island'],
    variants: [
      { label: '128GB', price: '13.600.000₫', href: '/san-pham/apple-iphone-15-128gb' },
      { label: '256GB', price: '14.600.000₫', href: '#' },
    ],
    colors: ['Xanh Dương', 'Hồng', 'Đen', 'Vàng', 'Xanh Lá'],
    specs: [
      ['Màn hình', 'Super Retina XDR 6.1 inch'],
      ['Chip', 'Apple A16 Bionic'],
      ['Camera', '48MP + 12MP'],
      ['Video', '4K 60fps HDR'],
      ['Hệ điều hành', 'iOS 17'],
    ],
    description: [
      'iPhone 15 sở hữu loạt thông số ấn tượng với chipset Apple A16 Bionic cùng camera chính 48MP, là một trong những mẫu dễ dùng để dựng template chi tiết sản phẩm sát với mirror thật.',
      'Phần gallery nhiều ảnh, biến thể dung lượng và màu sắc, cùng tab chi tiết/thông số là những điểm chính đã được đưa vào layout mới để tăng độ giống storefront gốc.',
    ],
  },
  {
    slug: 'cu-sac-nhanh-cong-pd-type-c-vivumax-pd20-20w',
    name: 'Củ sạc nhanh cổng PD Type-C Vivumax PD20 20W',
    shortName: 'Vivumax PD20 20W',
    price: '200.000₫',
    oldPrice: '260.000₫',
    badge: 'Phụ kiện hot',
    status: 'Còn hàng',
    category: 'phu-kien',
    family: 'Vivumax',
    image: 'https://bizweb.dktcdn.net/thumb/large/100/112/815/products/2.png?v=1760931405503',
    gallery: [
      'https://bizweb.dktcdn.net/thumb/grande/100/112/815/products/2.png?v=1760931405503',
      'https://bizweb.dktcdn.net/thumb/grande/100/112/815/products/3-8af6289a-19b6-46f6-a169-7cde00c1ddbf.png?v=1760931304617',
    ],
    excerpt: 'Sản phẩm giá thấp dùng để test card density và CTA phụ kiện.',
    breadcrumbs: ['Trang chủ', 'Phụ kiện', 'Vivumax'],
    highlights: ['PD 20W', 'Nhỏ gọn', 'Tương thích iPhone'],
    variants: [{ label: '20W', price: '200.000₫', href: '/san-pham/cu-sac-nhanh-cong-pd-type-c-vivumax-pd20-20w' }],
    colors: ['Trắng'],
    specs: [
      ['Công suất', '20W'],
      ['Cổng', 'USB-C'],
      ['Thương hiệu', 'Vivumax'],
    ],
    description: ['Phụ kiện được trình bày theo cùng template để storefront thống nhất hơn thay vì chỉ tối ưu cho điện thoại.'],
  },
  {
    slug: 'cap-sac-nhanh-day-ben-du-dau-hop-kim-kem-3a-vivumax-ci16-type-c-to-lightning-30w-mau-titanium-xanh-den',
    name: 'Cáp sạc nhanh Vivumax CI16 C to Lightning 30W',
    shortName: 'Vivumax CI16 30W',
    price: '250.000₫',
    oldPrice: '320.000₫',
    badge: 'Cable',
    status: 'Còn hàng',
    category: 'phu-kien',
    family: 'Vivumax',
    image: 'https://bizweb.dktcdn.net/thumb/large/100/112/815/products/ytrtyi.png?v=1703319792653',
    gallery: ['https://bizweb.dktcdn.net/thumb/grande/100/112/815/products/ytrtyi.png?v=1703319792653'],
    excerpt: 'Cáp sạc dùng để lấp dải card phụ kiện gần hơn với site gốc.',
    breadcrumbs: ['Trang chủ', 'Phụ kiện', 'Sạc & cáp'],
    highlights: ['30W', 'Đầu hợp kim', 'Bền hơn dây thường'],
    variants: [{ label: '1m', price: '250.000₫', href: '/san-pham/cap-sac-nhanh-day-ben-du-dau-hop-kim-kem-3a-vivumax-ci16-type-c-to-lightning-30w-mau-titanium-xanh-den' }],
    colors: ['Titanium xanh đen'],
    specs: [
      ['Chiều dài', '1m'],
      ['Chuẩn', 'C to Lightning'],
      ['Công suất', '30W'],
    ],
    description: ['Card phụ kiện cần ít text hơn, nhưng giá và badge phải rõ để đỡ cảm giác placeholder.'],
  },
  {
    slug: 'pin-iphone-15-pro-max-feaglet-4422mah',
    name: 'Pin iPhone 15 Pro Max FEAGLET (4422mAh)',
    shortName: 'Pin iPhone 15 Pro Max FEAGLET',
    price: '1.600.000₫',
    oldPrice: '1.850.000₫',
    badge: 'Linh kiện',
    status: 'Còn hàng',
    category: 'linh-kien',
    family: 'Pin Feaglet',
    image: 'https://bizweb.dktcdn.net/thumb/large/100/112/815/products/pin-15-promax.png?v=1764920853963',
    gallery: [
      'https://bizweb.dktcdn.net/thumb/grande/100/112/815/products/pin-15-promax.png?v=1764920853963',
      'https://bizweb.dktcdn.net/thumb/grande/100/112/815/products/pin-15-pro.png?v=1764920902370',
    ],
    excerpt: 'Nhóm linh kiện Feaglet là một trong các cluster dễ nhìn thấy trên mirror.',
    breadcrumbs: ['Trang chủ', 'Linh kiện', 'Pin Feaglet'],
    highlights: ['4422mAh', 'Dành cho 15 Pro Max', 'Pin thay thế'],
    variants: [{ label: '4422mAh', price: '1.600.000₫', href: '/san-pham/pin-iphone-15-pro-max-feaglet-4422mah' }],
    colors: ['Tiêu chuẩn'],
    specs: [
      ['Dung lượng', '4422mAh'],
      ['Dòng máy', 'iPhone 15 Pro Max'],
      ['Loại', 'Pin FEAGLET'],
    ],
    description: ['PDP linh kiện vẫn dùng được cấu trúc gallery + thông số + related, chỉ cần giảm độ hào nhoáng của khu vực CTA.'],
  },
  {
    slug: 'pin-iphone-14-pro-max-feaglet-4323mah',
    name: 'Pin iPhone 14 Pro Max FEAGLET (4323mAh)',
    shortName: 'Pin iPhone 14 Pro Max FEAGLET',
    price: '1.400.000₫',
    oldPrice: '1.650.000₫',
    badge: 'Feaglet',
    status: 'Còn hàng',
    category: 'linh-kien',
    family: 'Pin Feaglet',
    image: 'https://bizweb.dktcdn.net/thumb/large/100/112/815/products/pin-14-promax.png?v=1764920887503',
    gallery: ['https://bizweb.dktcdn.net/thumb/grande/100/112/815/products/pin-14-promax.png?v=1764920887503'],
    excerpt: 'Dùng làm related product và card grid cho danh mục linh kiện.',
    breadcrumbs: ['Trang chủ', 'Linh kiện', 'Pin Feaglet'],
    highlights: ['4323mAh', 'Ổn định', 'Dùng cho 14 Pro Max'],
    variants: [{ label: '4323mAh', price: '1.400.000₫', href: '/san-pham/pin-iphone-14-pro-max-feaglet-4323mah' }],
    colors: ['Tiêu chuẩn'],
    specs: [
      ['Dung lượng', '4323mAh'],
      ['Dòng máy', 'iPhone 14 Pro Max'],
      ['Loại', 'Pin FEAGLET'],
    ],
    description: ['Giữ lại cùng ngôn ngữ card/product detail để UI nhất quán.'],
  },
];

export const collections = [
  {
    slug: 'dien-thoai',
    title: 'Điện thoại',
    eyebrow: 'Danh mục sản phẩm',
    description: 'Tái hiện trang danh mục kiểu storefront: breadcrumb, bộ lọc, thanh sắp xếp, grid sản phẩm dày vừa phải và block giới thiệu ở đầu trang.',
    heroImage: 'https://bizweb.dktcdn.net/100/112/815/themes/966034/assets/banner.jpg?1768028836881',
    breadcrumb: ['Trang chủ', 'Điện thoại'],
    filters: {
      price: ['Dưới 15 triệu', '15 - 25 triệu', '25 - 35 triệu', 'Trên 35 triệu'],
      brand: ['Apple'],
      type: ['iPhone mới', 'iPhone 99%', 'Pro / Pro Max'],
    },
    sortOptions: ['Tên A-Z', 'Tên Z-A', 'Hàng mới', 'Giá thấp đến cao', 'Giá cao xuống thấp'],
    featuredSlugs: ['iphone-17-pro-max-256gb-chinh-hang', 'iphone-16-pro-max-512gb', 'apple-iphone-15-128gb'],
    contentTitle: 'Điện thoại iPhone - máy mới và máy đẹp dễ lên layout thương mại điện tử',
    contentBody:
      'Trang danh mục này ưu tiên cảm giác gần với cấu trúc gốc của Hoàng Kiên: tiêu đề lớn, mô tả ngắn, bộ lọc xếp cột trái trên desktop và thu gọn thành toolbar trên mobile. Product card được làm đồng nhất để dễ thay bằng dữ liệu thật sau này.',
  },
  {
    slug: 'phu-kien',
    title: 'Phụ kiện',
    eyebrow: 'Danh mục sản phẩm',
    description: 'Các dải card giá nhỏ, badge rõ, nhịp CTA gọn và banner mềm hơn so với nhóm điện thoại.',
    heroImage: 'https://bizweb.dktcdn.net/100/112/815/themes/966034/assets/banner2.jpg?1768028836881',
    breadcrumb: ['Trang chủ', 'Phụ kiện'],
    filters: {
      price: ['Dưới 300 nghìn', '300 - 500 nghìn', 'Trên 500 nghìn'],
      brand: ['Vivumax', 'Apple Zin', 'Baseus'],
      type: ['Sạc & cáp', 'Tai nghe', 'Pin sạc dự phòng'],
    },
    sortOptions: ['Tên A-Z', 'Hàng mới', 'Giá thấp đến cao', 'Giá cao xuống thấp'],
    featuredSlugs: [
      'cu-sac-nhanh-cong-pd-type-c-vivumax-pd20-20w',
      'cap-sac-nhanh-day-ben-du-dau-hop-kim-kem-3a-vivumax-ci16-type-c-to-lightning-30w-mau-titanium-xanh-den',
    ],
    contentTitle: 'Phụ kiện dễ bán - phù hợp layout lưới dày và section khuyến mại',
    contentBody:
      'Nhóm phụ kiện trên site gốc có xu hướng hiển thị dày hơn, giá dễ quét mắt và phù hợp nhiều banner nhỏ. Layout mới giữ nhịp đó bằng grid chắc hơn, ít khoảng trống chết hơn và CTA ngắn gọn hơn.',
  },
  {
    slug: 'linh-kien',
    title: 'Linh kiện',
    eyebrow: 'Danh mục sản phẩm',
    description: 'Khối danh mục thiên về pin, màn hình và nhóm sửa chữa - hợp với bộ lọc và thông tin kỹ thuật ngắn.',
    heroImage: 'https://bizweb.dktcdn.net/100/112/815/products/pin-15-promax.png?v=1764920853963',
    breadcrumb: ['Trang chủ', 'Linh kiện'],
    filters: {
      price: ['Dưới 1 triệu', '1 - 1.5 triệu', 'Trên 1.5 triệu'],
      brand: ['FEAGLET', 'EU'],
      type: ['Pin', 'Màn hình', 'Camera'],
    },
    sortOptions: ['Tên A-Z', 'Hàng mới', 'Giá thấp đến cao', 'Giá cao xuống thấp'],
    featuredSlugs: ['pin-iphone-15-pro-max-feaglet-4422mah', 'pin-iphone-14-pro-max-feaglet-4323mah'],
    contentTitle: 'Linh kiện iPhone - nhóm sản phẩm cần rõ thông số và tương thích dòng máy',
    contentBody:
      'Danh mục linh kiện thường không cần visual quá phô trương, nhưng bắt buộc dễ đọc, dễ scan thông số và cho thấy sản phẩm liên quan ngay bên dưới. Template này đã chừa chỗ cho filter, mô tả collection và related modules.',
  },
];

export const productSections = [
  {
    id: 'iphone',
    title: 'Điện thoại nổi bật',
    description: 'Khối chủ lực trên homepage, mô phỏng section iPhone mật độ cao từ mirror.',
    tabs: ['iPhone mới', 'iPhone 99%', 'Pro / Pro Max', 'Xem tất cả'],
    products: ['iphone-17-pro-max-256gb-chinh-hang', 'iphone-16-pro-max-512gb', 'apple-iphone-15-128gb'],
    actionHref: '/danh-muc/dien-thoai',
  },
  {
    id: 'phu-kien',
    title: 'Phụ kiện nổi bật',
    description: 'Nhịp card gọn, giá dễ thấy và có thể dùng để đẩy sản phẩm bán nhanh.',
    tabs: ['Sạc & cáp', 'Tai nghe', 'Sạc dự phòng', 'Vivumax'],
    products: [
      'cu-sac-nhanh-cong-pd-type-c-vivumax-pd20-20w',
      'cap-sac-nhanh-day-ben-du-dau-hop-kim-kem-3a-vivumax-ci16-type-c-to-lightning-30w-mau-titanium-xanh-den',
    ],
    actionHref: '/danh-muc/phu-kien',
  },
  {
    id: 'linh-kien',
    title: 'Pin Feaglet & linh kiện',
    description: 'Nhóm pin / linh kiện kỹ thuật cao, phù hợp pattern grid hoặc carousel nhiều cột.',
    tabs: ['Pin', 'Màn hình', 'Sửa chữa', 'Xem tất cả'],
    products: ['pin-iphone-15-pro-max-feaglet-4422mah', 'pin-iphone-14-pro-max-feaglet-4323mah'],
    actionHref: '/danh-muc/linh-kien',
  },
];

export const editorialSections = {
  posts: [
    {
      slug: 'ios-26-4-beta-1-co-gi-moi-iphone-nao-duoc-cap-nhat',
      title: 'iOS 26.4 beta 1 có gì mới? iPhone nào được cập nhật',
      date: '26/02/2026',
      excerpt: 'Bố cục 1 bài lớn + danh sách bài nhỏ được giữ lại vì đây là pattern rất rõ trên mirror.',
      image: 'https://bizweb.dktcdn.net/100/112/815/articles/ios-26-4-co-gi-moi-cover.jpg?v=1772075817853',
    },
    {
      slug: 'iphone-cu-99-la-gi-dung-de-99-chi-la-loi-quang-cao',
      title: 'iPhone cũ 99% là gì? Đừng để 99% chỉ là lời quảng cáo',
      date: '22/02/2026',
      excerpt: 'Card phụ có chiều cao gọn hơn để tránh section tin tức bị lỏng.',
      image: 'https://bizweb.dktcdn.net/100/112/815/articles/iphone-cu-99-la-gi-thumbnail.jpg?v=1769835570060',
    },
    {
      slug: 'ios-26-3-beta-3-chinh-thuc-phat-hanh',
      title: 'iOS 26.3 beta 3 chính thức phát hành',
      date: '19/02/2026',
      excerpt: 'Dạng content công nghệ cập nhật nhanh, hợp để tách thành collection tin tức riêng.',
      image: 'https://bizweb.dktcdn.net/100/112/815/articles/img-757edfa2.jpg?v=1769834059663',
    },
    {
      slug: '2026-nhung-iphone-5s-van-duoc-cap-nhat-phan-mem-moi',
      title: '2026 những iPhone 5s vẫn được cập nhật phần mềm mới',
      date: '16/02/2026',
      excerpt: 'Headline gây tò mò giúp lấp khoảng trống home sau các dải sản phẩm.',
      image: 'https://bizweb.dktcdn.net/100/112/815/articles/iphone-5s-32gb-bac-1-750x500-2.jpg?v=1769833509287',
    },
  ],
  videos: [
    {
      title: 'Cách bảo vệ quyền riêng tư khi sử dụng iPhone',
      image: 'https://bizweb.dktcdn.net/100/112/815/articles/cach-bao-ve-quyen-rieng-tu-khi-su-dung-iphone.jpg?v=1772597346313',
    },
    {
      title: '8 cách tăng chất lượng cuộc gọi iPhone',
      image: 'https://bizweb.dktcdn.net/100/112/815/articles/cach-chinh-am-luong-cuoc-goi-iphone.jpg?v=1772592151020',
    },
    {
      title: 'Không theo dõi lén nhưng vẫn biết vị trí người thân',
      image: 'https://bizweb.dktcdn.net/100/112/815/articles/cach-dinh-vi-iphone-nguoi-khac-1-viendidong.jpg?v=1772076769683',
    },
    {
      title: 'iPhone cũ có nên cập nhật iOS không?',
      image: 'https://bizweb.dktcdn.net/100/112/815/articles/1-1755309809-88-width740height495.jpg?v=1771819382840',
    },
  ],
};

export const storeBenefits = [
  'Thanh toán khi nhận hàng',
  'Cam kết chính hãng - hỗ trợ kỹ thuật',
  'Giao hàng nội thành nhanh',
  'Bảo hành lỗi 1 đổi 1',
];

export const trustBadges = [
  { title: 'Bảo hành 12 tháng', text: 'Áp dụng theo từng nhóm máy và linh kiện.' },
  { title: 'Kiểm tra hàng trước khi nhận', text: 'Tăng cảm giác yên tâm trên mobile lẫn desktop.' },
  { title: 'Thu cũ đổi mới', text: 'Đủ chỗ để thay bằng flow thật về sau.' },
];

export const footerColumns = [
  {
    title: 'Thông tin',
    links: ['Giới thiệu', 'Hệ thống cửa hàng', 'Tra cứu đơn hàng', 'Liên hệ'],
  },
  {
    title: 'Danh mục',
    links: ['Điện thoại', 'Phụ kiện', 'Linh kiện', 'Tin tức'],
  },
  {
    title: 'Hỗ trợ',
    links: ['Chính sách bảo hành', 'Chính sách vận chuyển', 'Hướng dẫn mua hàng', 'Câu hỏi thường gặp'],
  },
  {
    title: 'Kết nối',
    links: ['Facebook', 'YouTube', 'TikTok', 'Zalo OA'],
  },
];

export const storeLocations = [
  'CS1: Hà Nội - trung tâm kỹ thuật Apple & linh kiện',
  'CS2: Hỗ trợ giao hàng và tiếp nhận bảo hành nhanh',
];

export const blogPosts = [
  {
    slug: 'ios-26-4-beta-1-co-gi-moi-iphone-nao-duoc-cap-nhat',
    title: 'iOS 26.4 beta 1 có gì mới? iPhone nào được cập nhật',
    date: '26/02/2026',
    category: 'Tin công nghệ',
    readTime: '6 phút đọc',
    image: 'https://bizweb.dktcdn.net/100/112/815/articles/ios-26-4-co-gi-moi-cover.jpg?v=1772075817853',
    excerpt: 'Apple tiếp tục đẩy các bản beta theo hướng thực dụng hơn: ít màu mè, nhiều tiện ích nhỏ nhưng tác động trực tiếp tới cảm giác dùng máy mỗi ngày.',
    intro:
      'Bài viết này đóng vai trò làm nền cho template blog/article: headline lớn, hero image rõ, metadata gọn và phần thân bài có nhịp đọc giống một trang tin công nghệ thực sự thay vì chỉ là placeholder.',
    sections: [
      {
        heading: 'Nhóm tính năng nghe nhìn và nhắn tin được ưu tiên trước',
        paragraphs: [
          'iOS 26.4 beta 1 không tạo cảm giác là một bản cập nhật “làm lại từ đầu”, nhưng lại khá rõ ở chỗ Apple đang sửa những điểm chạm diễn ra hằng ngày như nghe gọi, xem nội dung và luồng xử lý thông báo.',
          'Kiểu thay đổi này rất hợp với storefront content của Hoàng Kiên: tin công nghệ ngắn, dễ đọc, tiêu đề rõ và có thể kéo người dùng từ homepage sang khu vực tin tức mà không bị đứt mạch.'
        ]
      },
      {
        heading: 'Thiết bị nào nên quan tâm',
        paragraphs: [
          'Nhóm iPhone đời gần vẫn là tập máy hưởng lợi rõ nhất vì hỗ trợ đầy đủ các tối ưu mới. Với người dùng máy cũ hơn, giá trị nằm ở tính ổn định và các vá lỗi nền.',
          'Trên giao diện rebuild, phần article body được cố tình làm sạch và ít nhiễu để sau này dễ thay bằng dữ liệu scrape thật từ site live.'
        ]
      }
    ]
  },
  {
    slug: 'iphone-cu-99-la-gi-dung-de-99-chi-la-loi-quang-cao',
    title: 'iPhone cũ 99% là gì? Đừng để “99%” chỉ là lời quảng cáo',
    date: '22/02/2026',
    category: 'Kinh nghiệm mua máy',
    readTime: '5 phút đọc',
    image: 'https://bizweb.dktcdn.net/100/112/815/articles/iphone-cu-99-la-gi-thumbnail.jpg?v=1769835570060',
    excerpt: 'Một chiếc máy được rao là 99% có thể rất đẹp bên ngoài nhưng vẫn cần kiểm tra kỹ pin, màn hình, khung sườn và lịch sử sửa chữa.',
    intro:
      'Nội dung kiểu tư vấn mua hàng là phần rất hợp với nhịp editorial của hoangkien.com. Vì vậy pass này thêm luôn nền tảng blog listing và article page thay vì chỉ giữ teaser ở homepage.',
    sections: [
      {
        heading: '99% không phải là tiêu chuẩn kỹ thuật cố định',
        paragraphs: [
          'Đây chủ yếu là ngôn ngữ thị trường để mô tả độ đẹp ngoại hình. Nếu storefront muốn tạo niềm tin, phần nội dung nên đi thẳng vào các hạng mục cần kiểm: pin, màn hình, Face ID, camera, loa và lịch sử thay thế linh kiện.',
          'Template mới hỗ trợ block metadata, ảnh lớn và các đoạn văn dài vừa phải để phù hợp cả bài tin lẫn bài tư vấn bán hàng.'
        ]
      },
      {
        heading: 'Điều người mua thật sự cần',
        paragraphs: [
          'Thay vì khẩu hiệu chung chung, người dùng muốn biết máy có còn zin không, tình trạng pin thế nào, bảo hành ra sao và cửa hàng xử lý hậu mãi có rõ ràng hay không.',
          'Đó cũng là lý do footer và header trong pass này được làm giàu hơn bằng các tín hiệu hỗ trợ, hotline, chính sách và lối vào danh mục.'
        ]
      }
    ]
  },
  {
    slug: 'ios-26-3-beta-3-chinh-thuc-phat-hanh',
    title: 'iOS 26.3 beta 3 chính thức phát hành',
    date: '19/02/2026',
    category: 'Tin công nghệ',
    readTime: '4 phút đọc',
    image: 'https://bizweb.dktcdn.net/100/112/815/articles/img-757edfa2.jpg?v=1769834059663',
    excerpt: 'Bản beta tiếp tục dọn dẹp lỗi, ưu tiên độ ổn định và hoàn thiện những thay đổi nhỏ ở cấp hệ thống.',
    intro: 'Bài mẫu ngắn này giúp trang listing có đủ nhịp thẻ bài và article template có nhiều mức độ nội dung khác nhau.',
    sections: [
      {
        heading: 'Tập trung vào ổn định thay vì phô diễn',
        paragraphs: [
          'Không phải bản beta nào cũng cần headline bùng nổ. Nhiều khi điều khiến người dùng quay lại website là những bài cập nhật gọn, rõ và đáng tin.',
          'Về mặt UI, loại bài như thế này cần card sạch, ảnh rõ, tiêu đề đậm và metadata ngắn gọn — đúng những gì bản rebuild đang cố siết lại.'
        ]
      }
    ]
  },
  {
    slug: '2026-nhung-iphone-5s-van-duoc-cap-nhat-phan-mem-moi',
    title: '2026 những iPhone 5s vẫn được cập nhật phần mềm mới',
    date: '16/02/2026',
    category: 'Câu chuyện Apple',
    readTime: '4 phút đọc',
    image: 'https://bizweb.dktcdn.net/100/112/815/articles/iphone-5s-32gb-bac-1-750x500-2.jpg?v=1769833509287',
    excerpt: 'Một câu chuyện đủ gây tò mò để giữ chân người đọc ở cuối homepage và kéo sang chuyên mục tin tức.',
    intro: 'Bài này chủ yếu giúp hoàn thiện foundation blog: có bài dài ngắn khác nhau, dễ test listing density và hierarchy.',
    sections: [
      {
        heading: 'Tin nhỏ nhưng có sức kéo',
        paragraphs: [
          'Những bài kiểu “chuyện thật như đùa” rất hợp để tăng cảm giác sống cho storefront, miễn là card và headline không bị trình bày như một blog template chung chung.',
          'Ở pass này, phần tin tức đã được làm sát chất e-commerce hơn: card bo mềm, metadata rõ, CTA thật và có trang đích riêng.'
        ]
      }
    ]
  }
];

export function getProductBySlug(slug) {
  return products.find((product) => product.slug === slug);
}

export function getCollectionBySlug(slug) {
  return collections.find((collection) => collection.slug === slug);
}

export function getBlogPostBySlug(slug) {
  return blogPosts.find((post) => post.slug === slug);
}

export function getLatestBlogPosts(limit) {
  return typeof limit === 'number' ? blogPosts.slice(0, limit) : blogPosts;
}

export function getProductsByCategory(slug) {
  return products.filter((product) => product.category === slug);
}

export function getProductsBySlugs(slugs = []) {
  return slugs.map((slug) => getProductBySlug(slug)).filter(Boolean);
}

export function getRelatedProducts(product, limit = 4) {
  return products
    .filter((item) => item.slug !== product.slug && (item.category === product.category || item.family === product.family))
    .slice(0, limit);
}
