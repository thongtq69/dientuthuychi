const APPLE_PRODUCT_PATTERN = /(^|[^a-z])(apple|iphone|ipad|macbook|airpods|watch|lightning|magsafe|airtag|phone air)([^a-z]|$)/i;
const HIDDEN_PRODUCT_PATTERN = /\btest\b/i;
const ACCESSORY_PATTERN = /(sac|sạc|cap|cáp|tai nghe|op lung|ốp|bao da|mieng dan|miếng dán|cuong luc|cường lực|pin sac du phong|pin sạc dự phòng|ban phim|bàn phím|chuot|chuột|adapter|dock|hub|camera|but cam ung|bút cảm ứng|stylus|case|cover|strap|day deo|dây đeo|charger|power bank|powerstation|combo|ppf)/i;
const PHONE_BRAND_PATTERN = /(samsung|galaxy|xiaomi|redmi|oppo|realme|vivo|nokia|tecno|infinix|honor|huawei|poco)/i;
const TABLET_PATTERN = /(tablet|galaxy tab|xiaomi pad|redmi pad|matepad|oppo pad|lenovo tab|honor pad)/i;
const INVALID_IMAGE_PATTERN = /(via\.placeholder\.com\/300x300|\/km_product\d+\.png)/i;

export const DISPLAY_CATEGORIES = {
  'dien-thoai': { tagName: 'dien-thoai', title: 'Điện Thoại', type: 'Brand' },
  tablet: { tagName: 'tablet', title: 'Tablet', type: 'Brand' },
  'phu-kien': { tagName: 'phu-kien', title: 'Phụ Kiện', type: 'Brand' },
};

function sanitizeProductName(name) {
  if (typeof name !== 'string' || !name.trim()) {
    return name;
  }

  return name
    .replace(/\b(?:like\s*new|likenew)\b/gi, '')
    .replace(/\(\s*\)/g, '')
    .replace(/^\s*[-|/]\s*/g, '')
    .replace(/\s*[-|/]\s*$/g, '')
    .replace(/\s{2,}/g, ' ')
    .replace(/\s+([,.)])/g, '$1')
    .trim();
}

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

function normalizeStatus(rawProduct) {
  const status = `${rawProduct.status || ''}`.trim().toLowerCase();

  if (!status) {
    return 'active';
  }

  if (status.includes('hết') || status.includes('het') || status.includes('soldout')) {
    return 'out_of_stock';
  }

  return 'active';
}

function normalizeImage(url) {
  if (!url || INVALID_IMAGE_PATTERN.test(url)) {
    return null;
  }

  return url;
}

function normalizeDescription(description, excerpt) {
  if (Array.isArray(description) && description.length > 0) {
    return description.filter(Boolean);
  }

  if (typeof description === 'string' && description.trim()) {
    return [description.trim()];
  }

  if (typeof excerpt === 'string' && excerpt.trim()) {
    return [excerpt.trim()];
  }

  return [];
}

function normalizeHighlights(rawProduct) {
  if (Array.isArray(rawProduct.highlights) && rawProduct.highlights.length > 0) {
    return rawProduct.highlights.filter(Boolean);
  }

  if (rawProduct.warranty?.highlights?.length) {
    return rawProduct.warranty.highlights.filter(Boolean);
  }

  return [];
}

function normalizeInventory(rawProduct) {
  if (Array.isArray(rawProduct.inventory) && rawProduct.inventory.length > 0) {
    return rawProduct.inventory;
  }

  if (!Array.isArray(rawProduct.variants) || rawProduct.variants.length === 0) {
    return [];
  }

  return rawProduct.variants.map((variant, index) => ({
    label: variant.label || variant.name || `variant-${index + 1}`,
    sku: variant.sku || rawProduct.sku || null,
    availability: variant.availability || rawProduct.status || null,
    quantity: typeof variant.stock === 'number' ? variant.stock : null,
  }));
}

function normalizeVariants(rawProduct) {
  if (!Array.isArray(rawProduct.variants)) {
    return [];
  }

  return rawProduct.variants.map((variant, index) => ({
    name: variant.label || variant.name || `Variant ${index + 1}`,
    label: variant.label || variant.name || null,
    slug: variant.slug || null,
    href: variant.href || null,
    sku: variant.sku || rawProduct.sku || null,
    price: typeof variant.price === 'number' ? variant.price : rawProduct.price ?? null,
    stock: typeof variant.stock === 'number' ? variant.stock : null,
    color: variant.color || variant.label || null,
    availability: variant.availability || null,
    image: normalizeImage(variant.image),
  }));
}

function buildSeo(rawProduct, normalizedName, normalizedDescription) {
  return {
    title: normalizedName || rawProduct.name || null,
    description: rawProduct.excerpt || normalizedDescription[0] || null,
  };
}

export function toTask1Product(rawProduct, sourceName) {
  if (isAppleProduct(rawProduct) || isHiddenProduct(rawProduct)) {
    return null;
  }

  const category = getDisplayCategory(rawProduct);
  const name = sanitizeProductName(rawProduct.name);
  const description = normalizeDescription(rawProduct.description, rawProduct.excerpt);
  const image = normalizeImage(rawProduct.image);

  return {
    slug: rawProduct.slug,
    name,
    productGroup: rawProduct.productGroup || null,
    category: category.title,
    categorySlug: category.tagName,
    brand: rawProduct.brand || null,
    price: typeof rawProduct.price === 'number' ? rawProduct.price : 0,
    originalPrice: typeof rawProduct.originalPrice === 'number' ? rawProduct.originalPrice : null,
    status: normalizeStatus(rawProduct),
    inventory: normalizeInventory(rawProduct),
    image,
    gallery: Array.isArray(rawProduct.gallery) ? rawProduct.gallery.map(normalizeImage).filter(Boolean) : [],
    description,
    highlights: normalizeHighlights(rawProduct),
    specs: Array.isArray(rawProduct.specs) ? rawProduct.specs.filter(Boolean) : [],
    technical_specifications: rawProduct.technical_specifications || {},
    variants: normalizeVariants(rawProduct),
    labels: Array.isArray(rawProduct.labels) ? rawProduct.labels.filter(Boolean) : [],
    seo: buildSeo(rawProduct, name, description),
    source: {
      dataset: sourceName,
      id: rawProduct.id || null,
      sku: rawProduct.sku || null,
    },
    raw: rawProduct,
  };
}

export function getProductRichnessScore(product) {
  let score = 0;

  if (product.technical_specifications && Object.keys(product.technical_specifications).length > 0) score += 6;
  if (Array.isArray(product.gallery) && product.gallery.length > 0) score += 5;
  if (Array.isArray(product.highlights) && product.highlights.length > 0) score += 4;
  if (Array.isArray(product.description) && product.description.length > 1) score += 3;
  if (Array.isArray(product.inventory) && product.inventory.length > 0) score += 2;
  if (Array.isArray(product.specs) && product.specs.length > 4) score += 2;
  if (Array.isArray(product.variants) && product.variants.length > 1) score += 1;

  return score;
}

export function mergeProductData(existingProduct, nextProduct) {
  const preferredProduct = getProductRichnessScore(nextProduct) >= getProductRichnessScore(existingProduct) ? nextProduct : existingProduct;
  const secondaryProduct = preferredProduct === nextProduct ? existingProduct : nextProduct;

  return {
    ...secondaryProduct,
    ...preferredProduct,
    inventory: preferredProduct.inventory?.length ? preferredProduct.inventory : secondaryProduct.inventory,
    image: preferredProduct.image || secondaryProduct.image,
    gallery: preferredProduct.gallery?.length ? preferredProduct.gallery : secondaryProduct.gallery,
    description: preferredProduct.description?.length ? preferredProduct.description : secondaryProduct.description,
    highlights: preferredProduct.highlights?.length ? preferredProduct.highlights : secondaryProduct.highlights,
    specs: preferredProduct.specs?.length ? preferredProduct.specs : secondaryProduct.specs,
    technical_specifications:
      preferredProduct.technical_specifications && Object.keys(preferredProduct.technical_specifications).length > 0
        ? preferredProduct.technical_specifications
        : secondaryProduct.technical_specifications,
    variants: preferredProduct.variants?.length ? preferredProduct.variants : secondaryProduct.variants,
    labels: preferredProduct.labels?.length ? preferredProduct.labels : secondaryProduct.labels,
    seo: {
      ...secondaryProduct.seo,
      ...preferredProduct.seo,
    },
    source: {
      mergedDatasets: [...new Set([secondaryProduct.source?.dataset, preferredProduct.source?.dataset].filter(Boolean))],
      ids: [...new Set([secondaryProduct.source?.id, preferredProduct.source?.id].filter(Boolean))],
      sku: preferredProduct.source?.sku || secondaryProduct.source?.sku || null,
    },
  };
}

export function getDuplicateKey(product) {
  return product.productGroup || product.slug;
}
