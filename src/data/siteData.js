import { products as giakhoProducts } from './giakhoData';
import { nonApplePhonesProducts } from './nonApplePhonesData';
import { nonAppleTabletsProducts } from './nonAppleTabletsData';
import { sanitizeProductName } from '@/lib/productDisplay';

const APPLE_PRODUCT_PATTERN = /(^|[^a-z])(apple|iphone|ipad|macbook|airpods|watch|lightning|magsafe|airtag|phone air)([^a-z]|$)/i;
const HIDDEN_PRODUCT_PATTERN = /\btest\b/i;
const ACCESSORY_PATTERN = /(sac|sạc|cap|cáp|tai nghe|op lung|ốp|bao da|mieng dan|miếng dán|cuong luc|cường lực|pin sac du phong|pin sạc dự phòng|ban phim|bàn phím|chuot|chuột|adapter|dock|hub|camera|but cam ung|bút cảm ứng|stylus|case|cover|strap|day deo|dây đeo|charger|power bank|powerstation|combo|ppf)/i;
const PHONE_BRAND_PATTERN = /(samsung|galaxy|xiaomi|redmi|oppo|realme|vivo|nokia|tecno|infinix|honor|huawei|poco)/i;
const TABLET_PATTERN = /(tablet|galaxy tab|xiaomi pad|redmi pad|matepad|oppo pad|lenovo tab|honor pad)/i;
const INVALID_IMAGE_PATTERN = /(via\.placeholder\.com\/300x300|\/km_product\d+\.png)/i;

const DISPLAY_CATEGORIES = {
  'dien-thoai': { tagName: 'dien-thoai', title: 'Điện Thoại', type: 'Brand' },
  tablet: { tagName: 'tablet', title: 'Tablet', type: 'Brand' },
  'phu-kien': { tagName: 'phu-kien', title: 'Phụ Kiện', type: 'Brand' },
};

function isAppleProduct(product) {
  const lookup = `${product.name || ''} ${product.slug || ''}`;
  return APPLE_PRODUCT_PATTERN.test(lookup);
}

function isHiddenProduct(product) {
  const lookup = `${product.name || ''} ${product.slug || ''}`;
  return HIDDEN_PRODUCT_PATTERN.test(lookup);
}

function getDisplayCategory(product) {
  const lookup = `${product.name || ''} ${product.slug || ''}`;

  if ((product.category === 'Tablet' || TABLET_PATTERN.test(lookup)) && ACCESSORY_PATTERN.test(lookup)) {
    return DISPLAY_CATEGORIES['phu-kien'];
  }

  if (product.category === 'Tablet' || TABLET_PATTERN.test(lookup)) {
    return DISPLAY_CATEGORIES.tablet;
  }

  if (PHONE_BRAND_PATTERN.test(lookup) && !ACCESSORY_PATTERN.test(lookup)) {
    return DISPLAY_CATEGORIES['dien-thoai'];
  }

  if (product.category === 'Điện Thoại' && ACCESSORY_PATTERN.test(lookup)) {
    return DISPLAY_CATEGORIES['phu-kien'];
  }

  return Object.values(DISPLAY_CATEGORIES).find((item) => item.title === product.category) || DISPLAY_CATEGORIES['phu-kien'];
}

function getProductImage(product) {
  if (!product.image || INVALID_IMAGE_PATTERN.test(product.image)) {
    return null;
  }

  return product.image;
}

function getProductRichnessScore(product) {
  let score = 0;

  if (product.technical_specifications && Object.keys(product.technical_specifications).length > 0) score += 6;
  if (Array.isArray(product.gallery) && product.gallery.length > 0) score += 5;
  if (Array.isArray(product.highlights) && product.highlights.length > 0) score += 4;
  if (Array.isArray(product.description) && product.description.length > 1) score += 3;
  if (Array.isArray(product.inventory) && product.inventory.length > 0) score += 2;
  if (product.warranty) score += 2;
  if (Array.isArray(product.specs) && product.specs.length > 4) score += 2;
  if (Array.isArray(product.variants) && product.variants.length > 1) score += 1;

  return score;
}

function mergeProductData(existingProduct, nextProduct) {
  const preferredProduct = getProductRichnessScore(nextProduct) >= getProductRichnessScore(existingProduct) ? nextProduct : existingProduct;
  const secondaryProduct = preferredProduct === nextProduct ? existingProduct : nextProduct;

  return {
    ...secondaryProduct,
    ...preferredProduct,
    description:
      Array.isArray(preferredProduct.description) && preferredProduct.description.length > 0
        ? preferredProduct.description
        : secondaryProduct.description,
    specs:
      Array.isArray(preferredProduct.specs) && preferredProduct.specs.length > 0
        ? preferredProduct.specs
        : secondaryProduct.specs,
    gallery:
      Array.isArray(preferredProduct.gallery) && preferredProduct.gallery.length > 0
        ? preferredProduct.gallery
        : secondaryProduct.gallery,
    variants:
      Array.isArray(preferredProduct.variants) && preferredProduct.variants.length > 0
        ? preferredProduct.variants
        : secondaryProduct.variants,
    technical_specifications:
      preferredProduct.technical_specifications && Object.keys(preferredProduct.technical_specifications).length > 0
        ? preferredProduct.technical_specifications
        : secondaryProduct.technical_specifications,
  };
}

function prepareProducts(rawProducts) {
  const groupedProducts = rawProducts.reduce((accumulator, product) => {
    if (isAppleProduct(product) || isHiddenProduct(product)) {
      return accumulator;
    }

    const displayCategory = getDisplayCategory(product);
    const listingKey = `${displayCategory.tagName}:${product.productGroup || product.slug}`;

    const preparedProduct = {
      ...product,
      name: sanitizeProductName(product.name),
      image: getProductImage(product),
      category: displayCategory.title,
      categorySlug: displayCategory.tagName,
    };

    const existingProduct = accumulator.get(listingKey);
    accumulator.set(listingKey, existingProduct ? mergeProductData(existingProduct, preparedProduct) : preparedProduct);

    return accumulator;
  }, new Map());

  return [...groupedProducts.values()];
}

function getFeaturedSlugs(categorySlug, limit = 3) {
  return products
    .filter((product) => product.categorySlug === categorySlug)
    .slice(0, limit)
    .map((product) => product.slug);
}

export const products = prepareProducts([...nonApplePhonesProducts, ...nonAppleTabletsProducts, ...giakhoProducts]);
export const categories = Object.values(DISPLAY_CATEGORIES);
export const phoneProducts = products.filter((product) => product.categorySlug === 'dien-thoai');
export const tabletProducts = products.filter((product) => product.categorySlug === 'tablet');
export const accessoryProducts = products.filter((product) => product.categorySlug === 'phu-kien');

const phoneFeaturedSlugs = getFeaturedSlugs('dien-thoai');
const tabletFeaturedSlugs = getFeaturedSlugs('tablet');
const accessoryFeaturedSlugs = getFeaturedSlugs('phu-kien');

export const siteMeta = {
  name: 'Điện tử Thuỷ Chi',
  tagline: 'Chuyên điện thoại Android, tablet và phụ kiện công nghệ chính hãng.',
  hotline: '0899.918.668',
  address: 'Số 315 Đường Hoàng Mai, Phường Tương Mai, Thành phố Hà Nội, Việt Nam.',
  supportHours: 'Mở cửa: 08:00 - 22:00 mỗi ngày',
  searchPlaceholder: 'Bạn cần tìm gì...',
  email: 'thuychi@gmail.com',
  logo: '/logo-thuychi.jpg',
};

export const utilityLinks = [
  { label: 'Chính sách bảo hành', href: '/chinh-sach-bao-hanh-12-thang-1-doi-1' },
  { label: 'Cam kết chất lượng', href: '/cam-ket-chat-luong' },
  { label: 'Mua lại', href: '/mua-lai' },
  { label: 'Liên hệ', href: '/lien-he' },
];

export const navItems = [
  { label: 'Trang chủ', href: '/' },
  { label: 'Điện thoại', href: '/danh-muc/dien-thoai' },
  { label: 'Phụ kiện', href: '/danh-muc/phu-kien' },
  { label: 'Linh kiện', href: '/danh-muc/linh-kien' },
  { label: 'Tin tức', href: '/tin-tuc' },
];

export const categoryRailItems = [
  { title: 'Điện Thoại', href: '/danh-muc/dien-thoai', icon: 'https://cdn.dienthoaigiakho.vn/photos/1715769087669-icon-phone.png' },
  { title: 'Tablet', href: '/danh-muc/tablet', icon: 'https://cdn.dienthoaigiakho.vn/photos/1715769095133-icon-tablet.png' },
  { title: 'Máy Cũ Giá Rẻ', href: '/danh-muc/hang-cu', icon: 'https://cdn.dienthoaigiakho.vn/photos/1751947216189-icon-used-products.png' },
  { title: 'Thu Cũ Đổi Mới', href: '/danh-muc/thu-cu-doi-moi', icon: 'https://cdn.dienthoaigiakho.vn/photos/1715854857719-thu-cu-.gif' },
  { title: 'Phụ Kiện', href: '/danh-muc/phu-kien', icon: 'https://cdn.dienthoaigiakho.vn/photos/1715769087666-icon-accessory1.png' },
  { title: 'Âm Thanh', href: '/danh-muc/am-thanh', icon: 'https://cdn.dienthoaigiakho.vn/photos/1715769095133-icon-sound.png' },
  { title: 'Đồng Hồ', href: '/danh-muc/smartwatch', icon: 'https://cdn.dienthoaigiakho.vn/photos/1715769095134-icon-watch.png' },
  { title: 'Khuyến Mãi', href: '/danh-muc/khuyen-mai', icon: 'https://cdn.dienthoaigiakho.vn/photos/1715769095132-icon-promotion.png' },
];

export const featuredCategories = [
  {
    title: 'Galaxy A Series',
    href: '/danh-muc/dien-thoai',
    image: 'https://cdn.dienthoaigiakho.vn/photos/1772705147684-390x490-Galaxy-A-Top-Collection-Banner-2-1.jpg',
    description: 'Galaxy A Series',
  },
  {
    title: 'Tablet Android',
    href: '/danh-muc/tablet',
    image: 'https://cdn.dienthoaigiakho.vn/photos/1773028447455-top-colection-galaxy-tab.jpg',
    description: 'Tablet Android',
  },
  {
    title: 'Thu Cũ Đổi Mới',
    href: '/danh-muc/thu-cu-doi-moi',
    image: 'https://cdn.dienthoaigiakho.vn/photos/1765439122070-390x490_Top-Collection-Banner_thu-cu-doi-moi-new.jpg',
    description: 'Thu Cũ Đổi Mới',
  },
  {
    title: 'Phụ kiện công nghệ',
    href: '/danh-muc/phu-kien',
    image: 'https://cdn.dienthoaigiakho.vn/photos/1773028447455-top-colection-galaxy-tab.jpg',
    description: 'Phụ kiện công nghệ',
  },
];

export const midPageBanners = [
  {
    title: 'Banner bảo hành',
    href: '/tin-tuc',
    image: 'https://bizweb.dktcdn.net/100/112/815/themes/966034/assets/banner.jpg?1768028836881',
  },
];

export const heroSlides = [
  {
    image: 'https://cdn.dienthoaigiakho.vn/photos/1773117620989-1968x790-main-banner-S26-1.jpg',
    ctaHref: '/danh-muc/dien-thoai',
    title: 'Samsung Galaxy S26 Series',
  },
  {
    image: 'https://cdn.dienthoaigiakho.vn/photos/1773028447455-top-colection-galaxy-tab.jpg',
    ctaHref: '/danh-muc/tablet',
    title: 'Galaxy Tab',
  },
  {
    image: 'https://cdn.dienthoaigiakho.vn/photos/1773215461393-984x395_Main-Banner-samsung-s25-1.jpg',
    ctaHref: '/danh-muc/dien-thoai',
    title: 'Samsung Galaxy S25',
  },
];

function getProductLookup(product) {
  return `${product.name || ''} ${product.slug || ''} ${product.brand || ''} ${product.category || ''}`.toLowerCase();
}

function hasValidDiscount(product) {
  return Number(product.originalPrice) > Number(product.price) && Number(product.price) > 0;
}

function getSortedDiscountProducts(sourceProducts) {
  return [...sourceProducts].sort((left, right) => {
    const leftRatio = hasValidDiscount(left) ? 1 - Number(left.price) / Number(left.originalPrice) : 0;
    const rightRatio = hasValidDiscount(right) ? 1 - Number(right.price) / Number(right.originalPrice) : 0;
    return rightRatio - leftRatio;
  });
}

function getCollectionProductsBySlug(slug) {
  if (slug === 'dien-thoai' || slug === 'tablet' || slug === 'phu-kien') {
    return getProductsByCategory(slug);
  }

  if (slug === 'hang-cu' || slug === 'thu-cu-doi-moi') {
    const usedProducts = getSortedDiscountProducts([...phoneProducts, ...tabletProducts]).filter(
      (product) => hasValidDiscount(product) || /(cu|cũ|likenew|99|used|doi moi|đổi mới)/i.test(getProductLookup(product)),
    );

    return (usedProducts.length ? usedProducts : [...phoneProducts, ...tabletProducts]).slice(0, 18);
  }

  if (slug === 'am-thanh') {
    const audioProducts = accessoryProducts.filter((product) => /(tai nghe|loa|micro|sound|buds|airpods)/i.test(getProductLookup(product)));
    return (audioProducts.length ? audioProducts : accessoryProducts).slice(0, 18);
  }

  if (slug === 'smartwatch') {
    const watchProducts = accessoryProducts.filter((product) => /(watch|đồng hồ|dong ho|strap|dây đeo|day deo)/i.test(getProductLookup(product)));
    return (watchProducts.length ? watchProducts : accessoryProducts).slice(0, 18);
  }

  if (slug === 'gia-dung') {
    const smartHomeProducts = accessoryProducts.filter((product) => /(camera|robot|hút bụi|hut bui|gia dụng|gia dung|đèn|den|smart home)/i.test(getProductLookup(product)));
    return (smartHomeProducts.length ? smartHomeProducts : accessoryProducts).slice(0, 18);
  }

  if (slug === 'khuyen-mai') {
    const promoProducts = getSortedDiscountProducts(products).filter((product) => hasValidDiscount(product));
    return (promoProducts.length ? promoProducts : products).slice(0, 18);
  }

  return [];
}
export const collections = [
  {
    slug: 'dien-thoai',
    title: 'Điện thoại',
    eyebrow: 'Danh mục sản phẩm',
    description: 'Điện thoại Android và các mẫu Samsung, Xiaomi, OPPO dễ chọn theo nhu cầu phổ thông.',
    heroImage: 'https://bizweb.dktcdn.net/100/112/815/themes/966034/assets/banner.jpg?1768028836881',
    breadcrumb: ['Trang chủ', 'Điện thoại'],
    filters: {
      price: ['Dưới 15 triệu', '15 - 25 triệu', '25 - 35 triệu', 'Trên 35 triệu'],
      brand: ['Samsung', 'Xiaomi', 'OPPO'],
      type: ['Android phổ thông', 'Máy mới', 'Máy nổi bật'],
    },
    sortOptions: ['Tên A-Z', 'Tên Z-A', 'Hàng mới', 'Giá thấp đến cao', 'Giá cao xuống thấp'],
    featuredSlugs: phoneFeaturedSlugs,
    contentTitle: 'Điện thoại Android nổi bật, giá rõ ràng và dễ chọn nhanh',
    contentBody:
      'Trang danh mục ưu tiên model Android phổ biến, bộ lọc ngắn gọn và phần hiển thị rõ giá bán để khách xem nhanh tình trạng hàng.',
  },
  {
    slug: 'phu-kien',
    title: 'Phụ kiện',
    eyebrow: 'Danh mục sản phẩm',
    description: 'Sạc, cáp, pin dự phòng, bàn phím và phụ kiện công nghệ dùng hằng ngày.',
    heroImage: 'https://bizweb.dktcdn.net/100/112/815/themes/966034/assets/banner2.jpg?1768028836881',
    breadcrumb: ['Trang chủ', 'Phụ kiện'],
    filters: {
      price: ['Dưới 300 nghìn', '300 - 500 nghìn', 'Trên 500 nghìn'],
      brand: ['UGREEN', 'Baseus', 'Samsung'],
      type: ['Sạc & cáp', 'Bàn phím', 'Pin sạc dự phòng'],
    },
    sortOptions: ['Tên A-Z', 'Hàng mới', 'Giá thấp đến cao', 'Giá cao xuống thấp'],
    featuredSlugs: accessoryFeaturedSlugs,
    contentTitle: 'Phụ kiện giá tốt, dễ mua kèm khi lên đời máy hoặc thay mới',
    contentBody:
      'Nhóm phụ kiện được trình bày theo hướng dễ xem giá, dễ so sánh và phù hợp nhiều khung khuyến mại trên trang chủ lẫn trang danh mục.',
  },
  {
    slug: 'tablet',
    title: 'Tablet',
    eyebrow: 'Danh mục sản phẩm',
    description: 'Máy tính bảng Android, Galaxy Tab và Xiaomi Pad được tách riêng để dễ lọc và xem nhanh.',
    heroImage: 'https://cdn.dienthoaigiakho.vn/photos/1773028447455-top-colection-galaxy-tab.jpg',
    breadcrumb: ['Trang chủ', 'Tablet'],
    filters: {
      price: ['Dưới 5 triệu', '5 - 10 triệu', '10 - 20 triệu', 'Trên 20 triệu'],
      brand: ['Samsung', 'Xiaomi', 'HONOR'],
      type: ['Máy mới', 'Likenew', '5G'],
    },
    sortOptions: ['Tên A-Z', 'Tên Z-A', 'Hàng mới', 'Giá thấp đến cao', 'Giá cao xuống thấp'],
    featuredSlugs: tabletFeaturedSlugs,
    contentTitle: 'Tablet Android được tách riêng, dễ xem theo nhu cầu học tập, giải trí và làm việc',
    contentBody:
      'Danh mục tablet chỉ giữ các mẫu máy tính bảng hoàn chỉnh, tách riêng khỏi phụ kiện như bao da, bàn phím hay cường lực để tránh lẫn khi duyệt sản phẩm.',
  },
  {
    slug: 'linh-kien',
    title: 'Linh kiện',
    eyebrow: 'Danh mục sản phẩm',
    description: 'Bao da, kính cường lực, bút cảm ứng và phụ kiện hỗ trợ cho điện thoại hoặc tablet.',
    heroImage: 'https://bizweb.dktcdn.net/100/112/815/products/pin-15-promax.png?v=1764920853963',
    breadcrumb: ['Trang chủ', 'Linh kiện'],
    filters: {
      price: ['Dưới 1 triệu', '1 - 1.5 triệu', 'Trên 1.5 triệu'],
      brand: ['Baseus', 'Samsung', 'ESR'],
      type: ['Bao da', 'Cường lực', 'Bút cảm ứng'],
    },
    sortOptions: ['Tên A-Z', 'Hàng mới', 'Giá thấp đến cao', 'Giá cao xuống thấp'],
    featuredSlugs: tabletFeaturedSlugs.length ? tabletFeaturedSlugs : accessoryFeaturedSlugs,
    contentTitle: 'Phụ kiện hỗ trợ dễ tra cứu theo thiết bị và nhu cầu sử dụng',
    contentBody:
      'Danh mục này tập trung vào nhóm sản phẩm hỗ trợ, giúp khách xem nhanh thiết bị tương thích, giá bán và các sản phẩm liên quan cùng nhóm.',
  },
  {
    slug: 'hang-cu',
    title: 'Máy Cũ Giá Rẻ',
    eyebrow: 'Danh mục nổi bật',
    description: 'Tổng hợp máy Android giảm giá mạnh, ưu tiên mẫu dễ xem giá và dễ chọn nhanh khi cần lên đời tiết kiệm.',
    heroImage: 'https://cdn.dienthoaigiakho.vn/photos/1772792984416-top-colection-may-cu-1.jpg',
    breadcrumb: ['Trang chủ', 'Máy Cũ Giá Rẻ'],
    filters: {
      price: ['Dưới 5 triệu', '5 - 10 triệu', '10 - 20 triệu', 'Trên 20 triệu'],
      brand: ['Samsung', 'Xiaomi', 'OPPO'],
      type: ['Máy cũ', 'Likenew', 'Giảm giá sâu'],
    },
    sortOptions: ['Tên A-Z', 'Tên Z-A', 'Giá thấp đến cao', 'Giá cao xuống thấp'],
    featuredSlugs: getCollectionProductsBySlug('hang-cu').slice(0, 3).map((product) => product.slug),
    contentTitle: 'Máy cũ giá dễ tiếp cận, ưu tiên model đang có deal tốt',
    contentBody:
      'Trang này gom các máy đang có mức giảm giá rõ ràng để khách xem nhanh sản phẩm phù hợp ngân sách. Một phần dữ liệu được dựng sẵn để giữ trải nghiệm duyệt trang liền mạch, không dẫn sang lỗi 404.',
  },
  {
    slug: 'thu-cu-doi-moi',
    title: 'Thu Cũ Đổi Mới',
    eyebrow: 'Dịch vụ nổi bật',
    description: 'Nhóm sản phẩm phù hợp để tham khảo khi cần lên đời, đổi máy hoặc săn ưu đãi đổi cũ lấy mới.',
    heroImage: 'https://cdn.dienthoaigiakho.vn/photos/1765439122070-390x490_Top-Collection-Banner_thu-cu-doi-moi-new.jpg',
    breadcrumb: ['Trang chủ', 'Thu Cũ Đổi Mới'],
    filters: {
      price: ['Dưới 10 triệu', '10 - 20 triệu', '20 - 30 triệu', 'Trên 30 triệu'],
      brand: ['Samsung', 'Xiaomi', 'OPPO'],
      type: ['Máy cũ', 'Máy mới', 'Giảm giá sâu'],
    },
    sortOptions: ['Tên A-Z', 'Hàng mới', 'Giá thấp đến cao', 'Giá cao xuống thấp'],
    featuredSlugs: getCollectionProductsBySlug('thu-cu-doi-moi').slice(0, 3).map((product) => product.slug),
    contentTitle: 'Gợi ý nhanh các model phù hợp khi lên đời hoặc đổi máy',
    contentBody:
      'Phần này ưu tiên trải nghiệm tham khảo nhanh, kết hợp dữ liệu có sẵn và nội dung hard-code để vẫn dùng được ngay cả khi chưa kết nối đủ luồng nghiệp vụ thu cũ.',
  },
  {
    slug: 'am-thanh',
    title: 'Âm Thanh',
    eyebrow: 'Danh mục sản phẩm',
    description: 'Tai nghe, loa và phụ kiện âm thanh được gom riêng để dễ lọc theo nhu cầu nghe gọi, giải trí hoặc làm việc.',
    heroImage: 'https://cdn.dienthoaigiakho.vn/photos/1663990385429-airpods-pro-2-thumbnail.jpg',
    breadcrumb: ['Trang chủ', 'Âm Thanh'],
    filters: {
      price: ['Dưới 500 nghìn', '500 nghìn - 1 triệu', '1 - 3 triệu', 'Trên 3 triệu'],
      brand: ['Baseus', 'Sony', 'Samsung'],
      type: ['Tai nghe', 'Loa', 'Micro'],
    },
    sortOptions: ['Tên A-Z', 'Tên Z-A', 'Giá thấp đến cao', 'Giá cao xuống thấp'],
    featuredSlugs: getCollectionProductsBySlug('am-thanh').slice(0, 3).map((product) => product.slug),
    contentTitle: 'Âm thanh gọn, dễ lọc nhanh theo đúng nhóm sản phẩm cần tìm',
    contentBody:
      'Danh mục âm thanh tách riêng để tránh lẫn với nhóm phụ kiện chung. Nếu dữ liệu thực tế còn thiếu, trang vẫn hiển thị bộ sưu tập mẫu để không làm gãy hành trình duyệt sản phẩm.',
  },
  {
    slug: 'smartwatch',
    title: 'Đồng Hồ',
    eyebrow: 'Danh mục sản phẩm',
    description: 'Khu vực đồng hồ thông minh và phụ kiện đeo tay đang được hoàn thiện, hiện ưu tiên hiển thị danh mục mẫu có thể bấm và lọc.',
    heroImage: 'https://cdn.dienthoaigiakho.vn/photos/1715769095134-icon-watch.png',
    breadcrumb: ['Trang chủ', 'Đồng Hồ'],
    filters: {
      price: ['Dưới 1 triệu', '1 - 3 triệu', '3 - 5 triệu', 'Trên 5 triệu'],
      brand: ['Samsung', 'Xiaomi', 'Huawei'],
      type: ['Đồng hồ thông minh', 'Dây đeo', 'Phụ kiện watch'],
    },
    sortOptions: ['Tên A-Z', 'Hàng mới', 'Giá thấp đến cao', 'Giá cao xuống thấp'],
    featuredSlugs: getCollectionProductsBySlug('smartwatch').slice(0, 3).map((product) => product.slug),
    contentTitle: 'Trang mẫu cho nhóm đồng hồ và phụ kiện đeo tay',
    contentBody:
      'Hiện chưa có nguồn dữ liệu riêng đầy đủ cho đồng hồ, nên hệ thống dùng bộ sản phẩm mẫu liên quan để người dùng vẫn có thể bấm, lọc và xem bố cục hoàn chỉnh.',
  },
  {
    slug: 'khuyen-mai',
    title: 'Khuyến Mãi',
    eyebrow: 'Ưu đãi nổi bật',
    description: 'Tập hợp nhanh các sản phẩm đang có giá tốt hoặc mức giảm dễ thấy để khách theo dõi ưu đãi trong một trang riêng.',
    heroImage: 'https://cdn.dienthoaigiakho.vn/photos/1773105631169-roll-banner-tuan-le-vangjpg.jpg',
    breadcrumb: ['Trang chủ', 'Khuyến Mãi'],
    filters: {
      price: ['Dưới 1 triệu', '1 - 5 triệu', '5 - 10 triệu', 'Trên 10 triệu'],
      brand: ['Samsung', 'Xiaomi', 'Baseus'],
      type: ['Giảm giá sâu', 'Máy nổi bật', 'Phụ kiện bán chạy'],
    },
    sortOptions: ['Tên A-Z', 'Giá thấp đến cao', 'Giá cao xuống thấp'],
    featuredSlugs: getCollectionProductsBySlug('khuyen-mai').slice(0, 3).map((product) => product.slug),
    contentTitle: 'Khuyến mãi được gom riêng để khách xem deal nhanh hơn',
    contentBody:
      'Ngay cả khi một phần chương trình ưu đãi mới chỉ là UI hoặc dữ liệu tạm, trang vẫn có nội dung cứng và danh sách sản phẩm mẫu để không phát sinh 404.',
  },
];

export const productSections = [
  {
    id: 'android',
    eyebrow: 'Điện thoại',
    title: 'Android',
    description: '',
    tabs: ['Điện thoại', 'Phụ kiện', 'Linh kiện', 'Tin tức'],
    products: phoneFeaturedSlugs,
    actionHref: '/danh-muc/dien-thoai',
    actionLabel: 'Xem tất cả',
  },
  {
    id: 'phu-kien',
    eyebrow: 'Phụ kiện',
    title: 'PHỤ KIỆN',
    description: '',
    tabs: ['Phụ Kiện VivuMax', 'Phụ kiện', 'Linh kiện', 'Tin tức'],
    products: accessoryFeaturedSlugs,
    actionHref: '/danh-muc/phu-kien',
    actionLabel: 'Xem tất cả',
  },
  {
    id: 'tablet-accessories',
    eyebrow: 'Tablet',
    title: 'Phụ kiện tablet',
    description: '',
    tabs: ['Máy tính bảng', 'Bút cảm ứng', 'Bao da', 'Xem tất cả'],
    products: tabletFeaturedSlugs.length ? tabletFeaturedSlugs : accessoryFeaturedSlugs.slice(0, 4),
    actionHref: '/danh-muc/linh-kien',
    actionLabel: 'Xem tất cả',
  },
  {
    id: 'samsung-accessories',
    eyebrow: 'Phụ kiện',
    title: 'Phụ kiện Samsung',
    description: '',
    tabs: ['Cường lực', 'Bao da', 'Sạc nhanh'],
    products: accessoryProducts
      .filter((product) => /samsung/i.test(product.name))
      .slice(0, 7)
      .map((product) => product.slug),
    actionHref: '/danh-muc/linh-kien',
    actionLabel: 'Xem tất cả',
  },
];

export const editorialSections = {
  posts: [
    {
      slug: 'ios-26-4-beta-1-co-gi-moi-iphone-nao-duoc-cap-nhat',
      title: 'iOS 26.4 beta 1 có gì mới? iPhone nào được cập nhật',
      date: '26/02/2026',
      excerpt: 'Những thay đổi đáng chú ý trên iOS 26.4 beta 1 và danh sách thiết bị nên quan tâm.',
      image: 'https://bizweb.dktcdn.net/100/112/815/articles/ios-26-4-co-gi-moi-cover.jpg?v=1772075817853',
    },
    {
      slug: 'iphone-cu-99-la-gi-dung-de-99-chi-la-loi-quang-cao',
      title: 'iPhone cũ 99% là gì? Đừng để 99% chỉ là lời quảng cáo',
      date: '22/02/2026',
      excerpt: 'Cách hiểu đúng về iPhone 99% và những điểm cần kiểm tra trước khi mua.',
      image: 'https://bizweb.dktcdn.net/100/112/815/articles/iphone-cu-99-la-gi-thumbnail.jpg?v=1769835570060',
    },
    {
      slug: 'ios-26-3-beta-3-chinh-thuc-phat-hanh',
      title: 'iOS 26.3 beta 3 chính thức phát hành',
      date: '19/02/2026',
      excerpt: 'Bản beta mới tập trung vào ổn định hệ thống và một số tinh chỉnh hằng ngày.',
      image: 'https://bizweb.dktcdn.net/100/112/815/articles/img-757edfa2.jpg?v=1769834059663',
    },
    {
      slug: '2026-nhung-iphone-5s-van-duoc-cap-nhat-phan-mem-moi',
      title: '2026 những iPhone 5s vẫn được cập nhật phần mềm mới',
      date: '16/02/2026',
      excerpt: 'Một góc nhìn thú vị về các mẫu máy cũ vẫn còn được cộng đồng quan tâm.',
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
  'Giao hàng miễn phí 2h',
  'Bảo hành lỗi 1 đổi 1',
];

export const trustBadges = [
  { title: 'KHIẾU NẠI, GÓP Ý', text: '0899918668' },
  { title: 'TƯ VẤN', text: '0899918668' },
  { title: 'TÌM CHI NHÁNH', text: 'Hệ thống Điện tử Thuỷ Chi' },
];

export const footerColumns = [
  {
    title: 'CHÍNH SÁCH',
    links: [
      'Chính sách bảo hành 12 tháng 1 đổi 1',
      'Cam kết chất lượng',
      'Chính sách bảo mật',
      'Thu cũ - Đổi mới',
      'Mua lại',
    ],
  },
  {
    title: 'MUA HÀNG',
    links: [
      'Hướng dẫn mua hàng',
      'Quy trình mua hàng',
      'Phương thức thanh toán',
      'Phương thức vận chuyển',
      'Phương thức trả góp',
    ],
  },
  {
    title: 'ĐIỀU KHOẢN DỊCH VỤ',
    links: ['Điều khoản dịch vụ', 'Điều khoản sử dụng', 'Cam kết bảo mật', 'Giới thiệu', 'Liên hệ'],
  },
  {
    title: 'LIÊN HỆ',
    links: [
      'Cơ Sở 1: 284 Xã Đàn, Q. Đống Đa, Hà Nội: 083.888.3663',
      'Cơ Sở 2: 42 Trần Phú, Q. Hà Đông, Hà Nội: 086.888.3663',
      'Cơ Sở 3: 48 Hồng Tiến, Q. Long Biên, Hà Nội: 090.896.3993',
      'Cơ Sở 4: 403 Ngô Gia Tự - P.2, Q.10 Hồ Chí Minh: 0707.678.707',
      'Mua hàng online: 0899918668',
    ],
  },
];

export const storeLocations = [
  'Số 315 Đường Hoàng Mai, Phường Tương Mai, Thành phố Hà Nội, Việt Nam',
  'Mua hàng online: 0899918668',
];

export const supportPanels = [
  { title: 'KHIẾU NẠI, GÓP Ý', value: '0899918668', action: '0899918668' },
  { title: 'TƯ VẤN', value: '0899918668', action: '0899918668' },
  { title: 'TÌM CHI NHÁNH', value: 'Hệ thống cửa hàng', action: 'Xem hệ thống' },
];

export const socialLinks = [
  { title: 'Facebook', href: 'https://www.facebook.com/share/1AoNjBKGMU/?mibextid=wwXIfr', image: '/images/footer-assets/facebook.png' },
  { title: 'TikTok', href: 'https://vt.tiktok.com/ZSuH4usAd/?page=TikTokShop', image: '/images/footer-tiktok.svg' },
];

export const marketplaceLinks = [
  { title: 'Shopee', image: 'https://bizweb.dktcdn.net/100/112/815/themes/966034/assets/shopee.png?1768028836881' },
  { title: 'Lazada', image: 'https://bizweb.dktcdn.net/100/112/815/themes/966034/assets/lazada.png?1768028836881' },
  { title: 'Tiki', image: 'https://bizweb.dktcdn.net/100/112/815/themes/966034/assets/tiki.png?1768028836881' },
  { title: 'Sendo', image: 'https://bizweb.dktcdn.net/100/112/815/themes/966034/assets/sendo.png?1768028836881' },
];

export const paymentBadges = [
  { title: 'Visa', image: '/images/footer-assets/visa.svg' },
  { title: 'Mastercard', image: '/images/footer-assets/mastercard.svg' },
  { title: 'ATM', image: '/images/footer-assets/atm.svg' },
  { title: 'mPOS', image: '/images/footer-assets/mpos.svg' },
  { title: 'MegaPay', image: '/images/footer-assets/megapay.svg' },
  { title: 'Kredivo', image: '/images/footer-assets/kredivo.png' },
];

export const footerServiceLinks = [
  'Khách hàng doanh nghiệp (B2B)',
  'Tuyển dụng',
  'Điều khoản sử dụng',
];

export const footerContactInfo = [
  { label: 'Địa chỉ', value: 'Số 315 Đường Hoàng Mai, Phường Tương Mai, Thành phố Hà Nội, Việt Nam.', note: '' },
  { label: 'Hotline', value: '0899 918 668', note: '' },
  { label: 'Email', value: 'thuychi@gmail.com', note: '' },
  { label: 'Thời gian', value: 'Mở cửa: 08:00 - 22:00 mỗi ngày', note: '' },
];

export const footerShowrooms = {
  title: 'Showroom Thủy Chi',
  hours: 'Giờ hoạt động Showroom: 8h30 - 21h30',
  locations: [
    'Số 315 Đường Hoàng Mai, Phường Tương Mai, Thành phố Hà Nội',
  ],
};

export const footerPolicyLinks = [
  'Ưu đãi hội viên',
  'Hướng dẫn mua hàng Online',
  'Hướng dẫn thanh toán',
  'Hướng dẫn trả góp',
  'Hướng dẫn sử dụng Voucher',
  'Chính sách giao nhận - kiểm hàng',
  'Chính sách đổi trả',
  'Chính sách bảo mật thông tin',
  'Chính sách bảo hành',
  'Dịch vụ sửa chữa',
  'Quy định sao lưu dữ liệu',
  'Câu hỏi thường gặp',
];

export const footerCertification = {
  title: 'Đã thông báo Bộ Công Thương',
  image: '/images/footer-assets/bocongthuong.png',
};

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
      'Bản cập nhật mới tập trung vào các thay đổi gần với trải nghiệm thực tế hằng ngày như thông báo, cuộc gọi và một số điểm chạm nhỏ nhưng dùng liên tục.',
    sections: [
      {
        heading: 'Nhóm tính năng nghe nhìn và nhắn tin được ưu tiên trước',
        paragraphs: [
          'iOS 26.4 beta 1 không tạo cảm giác là một bản cập nhật “làm lại từ đầu”, nhưng lại khá rõ ở chỗ Apple đang sửa những điểm chạm diễn ra hằng ngày như nghe gọi, xem nội dung và luồng xử lý thông báo.',
          'Với người dùng iPhone, đây là kiểu thay đổi ít ồn ào nhưng tác động trực tiếp tới cảm giác sử dụng mỗi ngày.'
        ]
      },
      {
        heading: 'Thiết bị nào nên quan tâm',
        paragraphs: [
          'Nhóm iPhone đời gần vẫn là tập máy hưởng lợi rõ nhất vì hỗ trợ đầy đủ các tối ưu mới. Với người dùng máy cũ hơn, giá trị nằm ở tính ổn định và các vá lỗi nền.',
          'Nếu đang dùng các dòng Pro hoặc Pro Max gần đây, bạn sẽ dễ nhận ra khác biệt hơn ở độ mượt và khả năng phản hồi trong các tác vụ thường xuyên.'
        ]
      },
      {
        heading: 'Có nên cập nhật ngay không',
        paragraphs: [
          'Nếu bạn đang dùng máy chính cho công việc, lời khuyên vẫn là chờ thêm phản hồi từ cộng đồng trước khi lên beta. Ngược lại, nếu có máy phụ để trải nghiệm thì đây là bản đáng thử.',
          'Điều quan trọng là sao lưu dữ liệu đầy đủ và kiểm tra tình trạng pin trước khi cập nhật để tránh phát sinh phiền toái không đáng có.'
        ]
      }
    ]
  },
  {
    slug: 'iphone-cu-99-la-gi-dung-de-99-chi-la-loi-quang-cao',
    title: 'iPhone cũ 99% là gì? Đừng để 99% chỉ là lời quảng cáo',
    date: '22/02/2026',
    category: 'Tư vấn mua hàng',
    readTime: '7 phút đọc',
    image: 'https://bizweb.dktcdn.net/100/112/815/articles/iphone-cu-99-la-gi-thumbnail.jpg?v=1769835570060',
    excerpt: 'Ngoại hình đẹp chưa đủ. Khi mua iPhone cũ, điều quan trọng là kiểm tra pin, màn hình, Face ID và lịch sử sửa chữa.',
    intro:
      'Khái niệm iPhone 99% thường được dùng rất rộng, nhưng không phải cửa hàng nào cũng giải thích rõ điều kiện đánh giá. Muốn mua đúng máy, khách cần nhìn sâu hơn lớp vỏ bên ngoài.',
    sections: [
      {
        heading: '99% không phải lúc nào cũng giống nhau',
        paragraphs: [
          'Một chiếc máy đẹp về ngoại hình chưa chắc đã đồng nghĩa với chất lượng bên trong còn tốt. Pin chai, màn hình thay lô, loa rè hoặc Face ID lỗi là những thứ có thể không nhìn ra ngay.',
          'Vì vậy, nếu chỉ nghe mô tả “đẹp 99%” mà không có checklist kiểm tra cụ thể thì rủi ro vẫn rất cao.'
        ]
      },
      {
        heading: 'Những điểm nên kiểm tra trước khi chốt',
        paragraphs: [
          'Hãy ưu tiên kiểm tra dung lượng pin, chất lượng hiển thị màn hình, camera, loa, micro, Face ID hoặc Touch ID và tình trạng khung sườn.',
          'Ngoài ra, đừng quên kiểm tra iCloud, lịch sử sửa chữa và chính sách bảo hành để tránh những rắc rối phát sinh sau khi mua.'
        ]
      },
      {
        heading: 'Chính sách cửa hàng quan trọng không kém máy',
        paragraphs: [
          'Một nơi bán minh bạch sẽ cho khách kiểm tra máy kỹ, giải thích rõ tình trạng thực tế và có chính sách bảo hành đủ yên tâm.',
          'Đó mới là khác biệt giữa một chiếc iPhone cũ “nghe có vẻ đẹp” và một chiếc iPhone cũ “đáng mua”.'
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
    excerpt: 'Bản beta mới của Apple tiếp tục tinh chỉnh hiệu năng và sửa lỗi cho nhóm thiết bị đang hỗ trợ.',
    intro: 'Dù không phải bản cập nhật bùng nổ về tính năng, iOS 26.3 beta 3 vẫn đáng chú ý với người dùng theo sát các thay đổi của hệ điều hành.',
    sections: [
      {
        heading: 'Hiệu năng và độ ổn định vẫn là trọng tâm',
        paragraphs: [
          'Apple tiếp tục đi theo hướng tinh chỉnh thay vì thay đổi lớn. Điều này giúp hệ thống ổn định hơn và giảm cảm giác giật nhẹ trong các thao tác hằng ngày.',
          'Những cải thiện kiểu này tuy khó nhìn thấy ngay trong vài phút đầu, nhưng lại đáng giá với người dùng lâu dài.'
        ]
      }
    ]
  },
  {
    slug: '2026-nhung-iphone-5s-van-duoc-cap-nhat-phan-mem-moi',
    title: '2026 những iPhone 5s vẫn được cập nhật phần mềm mới',
    date: '16/02/2026',
    category: 'Tin công nghệ',
    readTime: '5 phút đọc',
    image: 'https://bizweb.dktcdn.net/100/112/815/articles/iphone-5s-32gb-bac-1-750x500-2.jpg?v=1769833509287',
    excerpt: 'Một câu chuyện công nghệ gợi lại thời kỳ hoàng kim của những mẫu iPhone cũ nhưng vẫn được cộng đồng quan tâm.',
    intro: 'Không phải thiết bị cũ nào cũng biến mất khỏi cuộc chơi. Một số dòng máy vẫn có sức sống riêng nhờ cộng đồng người dùng đông và nhu cầu trải nghiệm hoài niệm.',
    sections: [
      {
        heading: 'Vì sao máy cũ vẫn còn sức hút',
        paragraphs: [
          'Thiết kế nhỏ gọn, cảm giác cầm đặc trưng và mức giá dễ tiếp cận là những yếu tố khiến nhiều người vẫn nhớ tới các mẫu iPhone đời cũ.',
          'Dù không còn phù hợp cho mọi nhu cầu, chúng vẫn có chỗ đứng với người thích sưu tầm hoặc dùng làm máy phụ.'
        ]
      }
    ]
  },
];

export function getProductsBySlugs(slugs) {
  return slugs.map((slug) => products.find((product) => product.slug === slug)).filter(Boolean);
}

export function getCollectionBySlug(slug) {
  return collections.find((collection) => collection.slug === slug);
}

export function getProductBySlug(slug) {
  return products.find((product) => product.slug === slug);
}

export function getProductsByCategory(category) {
  const directMatches = products.filter((product) => product.categorySlug === category || product.category === category);

  if (directMatches.length > 0) {
    return directMatches;
  }

  return getCollectionProductsBySlug(category);
}

export function getRelatedProducts(product, limit = 4) {
  return products
    .filter((item) => item.slug !== product.slug && (item.category === product.category || item.family === product.family))
    .slice(0, limit);
}

export function getLatestBlogPosts() {
  return editorialSections.posts;
}

export function getBlogPostBySlug(slug) {
  return blogPosts.find((post) => post.slug === slug);
}
