export const siteMeta = {
  name: 'Hoàng Kiên',
  hotline: '0813600999',
  address: 'Hệ thống cửa hàng linh kiện, điện thoại và phụ kiện Apple',
};

export const navItems = [
  { label: 'Trang chủ', href: '#' },
  {
    label: 'Điện thoại',
    href: '#iphone',
    children: ['iPhone 17 Series', 'iPhone 16 Series', 'iPhone 15 Series', 'iPhone cũ đẹp'],
  },
  {
    label: 'Phụ kiện',
    href: '#phu-kien',
    children: ['Sạc & cáp', 'Pin sạc dự phòng', 'Tai nghe', 'Phụ kiện Vivumax'],
  },
  {
    label: 'Linh kiện',
    href: '#linh-kien',
    children: ['Pin Feaglet', 'Pin EU', 'Màn hình', 'Camera'],
  },
  { label: 'Tin tức', href: '#tin-tuc' },
];

export const featuredCategories = [
  {
    title: 'iPhone',
    href: '#iphone',
    image: 'https://bizweb.dktcdn.net/100/112/815/products/iphone-17promax-du-mau-88a053ed-0742-445a-869b-0b0d876590ce.png?v=1765510576573',
  },
  {
    title: 'Pin Feaglet',
    href: '#linh-kien',
    image: 'https://bizweb.dktcdn.net/100/112/815/products/pin-15-promax.png?v=1764920853963',
  },
  {
    title: 'Phụ kiện Zin',
    href: '#phu-kien',
    image: 'https://bizweb.dktcdn.net/100/112/815/products/6.png?v=1744702826943',
  },
  {
    title: 'Vivumax',
    href: '#phu-kien',
    image: 'https://bizweb.dktcdn.net/100/112/815/products/2.png?v=1760931405503',
  },
  {
    title: 'Pin EU',
    href: '#linh-kien',
    image: 'https://bizweb.dktcdn.net/100/112/815/products/987b7279884f23117a5e-0e3a87fc-0b54-4da9-bf81-606f5793c0fa-9b74d55e-fc69-4a38-9d33-19730b2a4430-6d1dcfa9-e109-4260-a99a-c6706d7237a6.jpg?v=1764901190337',
  },
];

export const heroSlides = [
  {
    eyebrow: 'Apple & linh kiện chuyên sâu',
    title: 'Giao diện rebuild hiện đại dựa trên mirror Hoàng Kiên',
    description:
      'Tái dựng trang chủ theo mô hình storefront đậm tính catalog: mega menu, khối sản phẩm nổi bật, blog và video hướng dẫn.',
    ctaLabel: 'Xem iPhone',
    ctaHref: '#iphone',
    image: 'https://bizweb.dktcdn.net/100/112/815/themes/966034/assets/banner.jpg?1768028836881',
  },
  {
    eyebrow: 'Bảo hành & hậu mãi',
    title: 'Ưu tiên responsive, maintainable và dễ mở rộng sang dữ liệu thật',
    description:
      'Giữ lại tinh thần của site cũ nhưng chuyển sang cấu trúc component-based với Next.js, Tailwind và Swiper.',
    ctaLabel: 'Xem blueprint',
    ctaHref: '#foundation',
    image: 'https://bizweb.dktcdn.net/100/112/815/themes/966034/assets/banner2.jpg?1768028836881',
  },
];

export const productSections = [
  {
    id: 'iphone',
    title: 'iPhone',
    description: 'Khối sản phẩm chủ lực trên homepage gốc, ưu tiên model mới và mặt bằng giá rõ ràng.',
    tabs: ['Điện thoại', 'Phụ kiện', 'Linh kiện', 'Tin tức'],
    products: [
      {
        name: 'iPhone 17 Pro Max 256GB Chính Hãng',
        price: '36.900.000₫',
        image: 'https://bizweb.dktcdn.net/thumb/large/100/112/815/products/iphone-17promax-du-mau-88a053ed-0742-445a-869b-0b0d876590ce.png?v=1765510576573',
      },
      {
        name: 'iPhone 17 Pro Max 512GB',
        price: '36.300.000₫',
        image: 'https://bizweb.dktcdn.net/thumb/large/100/112/815/products/iphone-17promax-du-mau-b7babcb4-7c57-4102-b2dc-88df10ff4b3c.png?v=1761108111403',
      },
      {
        name: 'iPhone 17 Pro 256GB',
        price: '28.400.000₫',
        image: 'https://bizweb.dktcdn.net/thumb/large/100/112/815/products/iphone-17promax-du-mau-c902dfad-36e0-436b-8ed4-9ec2b20ab7be.png?v=1761108430573',
      },
      {
        name: 'iPhone 16 Pro Max 512GB',
        price: '28.000.000₫',
        image: 'https://bizweb.dktcdn.net/thumb/large/100/112/815/products/16prm-full-da134920-b18f-41e8-a5c9-50312d7d0e9d-a373a501-a879-49b7-8036-024e2dead860.png?v=1730447868917',
      },
      {
        name: 'iPhone 16 Pro 256GB',
        price: '22.100.000₫',
        image: 'https://bizweb.dktcdn.net/thumb/large/100/112/815/products/full-anh-16pro-72f8a447-3d0a-4d5b-9572-0bef22c06d28-00733168-fd90-4e2c-ac0e-d4fe342c4cdb.png?v=1730448605057',
      },
    ],
  },
  {
    id: 'phu-kien',
    title: 'Phụ kiện',
    description: 'Khối sản phẩm giá vừa phải, CTA thiên về thêm giỏ hoặc xem nhanh.',
    tabs: ['Sạc & cáp', 'Tai nghe', 'Sạc dự phòng', 'Vivumax'],
    products: [
      {
        name: 'Sạc nhanh 20W iPhone Zin',
        price: '400.000₫',
        image: 'https://bizweb.dktcdn.net/thumb/large/100/112/815/products/6ut6i7i-compressed-1.jpg?v=1703389273287',
      },
      {
        name: 'Cáp sạc nhanh C to C iPhone Zin',
        price: '250.000₫',
        image: 'https://bizweb.dktcdn.net/thumb/large/100/112/815/products/ytrtyi.png?v=1703319792653',
      },
      {
        name: 'Tai nghe Lightning iPhone Zin',
        price: '400.000₫',
        image: 'https://bizweb.dktcdn.net/thumb/large/100/112/815/products/d05231ca34989fc6c689.jpg?v=1704171473330',
      },
      {
        name: 'Củ sạc PD Type C Vivumax PD20 20W',
        price: '200.000₫',
        image: 'https://bizweb.dktcdn.net/thumb/large/100/112/815/products/2.png?v=1760931405503',
      },
      {
        name: 'Pin sạc dự phòng Vivumax P125',
        price: '450.000₫',
        image: 'https://bizweb.dktcdn.net/thumb/large/100/112/815/products/3-8af6289a-19b6-46f6-a169-7cde00c1ddbf.png?v=1760931304617',
      },
    ],
  },
  {
    id: 'linh-kien',
    title: 'Pin Feaglet',
    description: 'Nhóm linh kiện có mật độ sản phẩm cao, phù hợp grid/carousel nhiều cột trên desktop.',
    tabs: ['Màn hình', 'Pin', 'Sửa chữa iPhone/iPad', 'Xem tất cả'],
    products: [
      {
        name: 'Pin iPhone 15 Pro Max FEAGLET (4422mAh)',
        price: '1.600.000₫',
        image: 'https://bizweb.dktcdn.net/thumb/large/100/112/815/products/pin-15-promax.png?v=1764920853963',
      },
      {
        name: 'Pin iPhone 14 Pro Max FEAGLET (4323mAh)',
        price: '1.400.000₫',
        image: 'https://bizweb.dktcdn.net/thumb/large/100/112/815/products/pin-14-promax.png?v=1764920887503',
      },
      {
        name: 'Pin iPhone 15 Pro FEAGLET (3274mAh)',
        price: '1.300.000₫',
        image: 'https://bizweb.dktcdn.net/thumb/large/100/112/815/products/pin-15-pro.png?v=1764920902370',
      },
      {
        name: 'Pin iPhone 15 Plus FEAGLET (4383mAh)',
        price: '1.200.000₫',
        image: 'https://bizweb.dktcdn.net/thumb/large/100/112/815/products/pin-15-plus.png?v=1764920920817',
      },
      {
        name: 'Pin iPhone 13 Pro Max FEAGLET',
        price: '1.000.000₫',
        image: 'https://bizweb.dktcdn.net/thumb/large/100/112/815/products/pin-13prm.png?v=1759559806153',
      },
    ],
  },
];

export const editorialSections = {
  posts: [
    {
      title: 'iOS 26.4 beta 1 có gì mới? iPhone nào được cập nhật',
      date: '26/02/2026',
      excerpt: 'Khối blog trên mirror dùng 1 bài lớn + danh sách bài nhỏ, rất hợp để rebuild bằng editorial grid responsive.',
      image: 'https://bizweb.dktcdn.net/100/112/815/articles/ios-26-4-co-gi-moi-cover.jpg?v=1772075817853',
    },
    {
      title: 'iPhone cũ 99% là gì? Đừng để 99% chỉ là lời quảng cáo',
      excerpt: 'Bài viết dạng tư vấn mua hàng, tối ưu tốt cho traffic organic.',
      image: 'https://bizweb.dktcdn.net/100/112/815/articles/iphone-cu-99-la-gi-thumbnail.jpg?v=1769835570060',
    },
    {
      title: 'iOS 26.3 beta 3 chính thức phát hành',
      excerpt: 'Nhóm content công nghệ cập nhật dày đặc, nên tách thành CMS collection riêng.',
      image: 'https://bizweb.dktcdn.net/100/112/815/articles/img-757edfa2.jpg?v=1769834059663',
    },
    {
      title: '2026 những iPhone 5s vẫn được cập nhật phần mềm mới',
      excerpt: 'Dạng headline gây tò mò, cần reusable card nhất quán cho blog.',
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
  'Cam kết uy tín hàng chính hãng',
  'Giao hàng miễn phí nội thành nhanh',
  'Bảo hành lỗi 1 đổi 1',
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
