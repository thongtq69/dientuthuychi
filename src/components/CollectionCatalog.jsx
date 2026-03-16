'use client';

import { useMemo, useState } from 'react';

import { Breadcrumbs } from '@/components/Breadcrumbs';
import { CollectionToolbar } from '@/components/CollectionToolbar';
import { FilterSidebar } from '@/components/FilterSidebar';
import { ProductCard } from '@/components/ProductCard';

const TYPE_MATCHERS = {
  'android phổ thông': (lookup) => /(samsung|xiaomi|oppo|realme|vivo|honor|nokia|tecno|infinix)/i.test(lookup),
  'máy mới': (lookup) => !/(cu|cũ|likenew|99|used)/i.test(lookup),
  'máy nổi bật': (lookup) => /(ultra|pro|max|note|flagship|fold|flip)/i.test(lookup),
  likenew: (lookup) => /(likenew|99|used|cu|cũ)/i.test(lookup),
  'máy cũ': (lookup) => /(likenew|99|used|cu|cũ)/i.test(lookup),
  'giảm giá sâu': (_lookup, product) => Number(product.originalPrice) > Number(product.price) && Number(product.price) > 0,
  'sạc & cáp': (lookup) => /(sac|sạc|cap|cáp|adapter|charger|dock|hub|magsafe)/i.test(lookup),
  'sạc & kết nối': (lookup) => /(sac|sạc|cap|cáp|adapter|charger|dock|hub|magsafe)/i.test(lookup),
  'bàn phím': (lookup) => /(ban phim|bàn phím|keyboard)/i.test(lookup),
  'pin sạc dự phòng': (lookup) => /(pin sac du phong|pin sạc dự phòng|power bank|powerstation)/i.test(lookup),
  'tai nghe': (lookup) => /(tai nghe|buds|airpods|earbud)/i.test(lookup),
  'loa': (lookup) => /loa/i.test(lookup),
  'micro': (lookup) => /micro/i.test(lookup),
  'đồng hồ thông minh': (lookup) => /(dong ho|đồng hồ|watch|smartwatch)/i.test(lookup),
  'dây đeo': (lookup) => /(day deo|dây đeo|strap)/i.test(lookup),
  'phụ kiện watch': (lookup) => /(watch|strap|day deo|dây đeo)/i.test(lookup),
  'laptop văn phòng': (lookup) => /(book|office|matebook|thinkpad)/i.test(lookup),
  'laptop học tập': (lookup) => /(student|air|pad|tab)/i.test(lookup),
  'laptop nổi bật': (lookup) => /(pro|ultra|gaming|max)/i.test(lookup),
  'camera': (lookup) => /camera/i.test(lookup),
  'smart home': (lookup) => /(smart home|robot|cam bien|cảm biến|hut bui|hút bụi)/i.test(lookup),
  'thiết bị tiện ích': (lookup) => /(den|đèn|hub|dock|adapter|camera)/i.test(lookup),
  'phụ kiện bán chạy': (lookup) => /(sac|sạc|cap|cáp|tai nghe|loa|power bank)/i.test(lookup),
};

function normalizeValue(value) {
  return String(value || '').trim().toLowerCase();
}

function getLookup(product) {
  return `${product.name || ''} ${product.slug || ''} ${product.brand || ''} ${product.category || ''}`.toLowerCase();
}

function getPriceValue(product) {
  return Number(product.price) || 0;
}

function matchesPriceRange(price, label) {
  const normalized = normalizeValue(label);
  const million = 1_000_000;

  if (normalized.includes('dưới 300 nghìn')) return price > 0 && price < 300_000;
  if (normalized.includes('300 - 500 nghìn')) return price >= 300_000 && price <= 500_000;
  if (normalized.includes('dưới 500 nghìn')) return price > 0 && price < 500_000;
  if (normalized.includes('500 nghìn - 1 triệu')) return price >= 500_000 && price <= million;
  if (normalized.includes('dưới 1 triệu')) return price > 0 && price < million;
  if (normalized.includes('1 - 1.5 triệu')) return price >= million && price <= 1_500_000;
  if (normalized.includes('1 - 3 triệu')) return price >= million && price <= 3 * million;
  if (normalized.includes('1 - 5 triệu')) return price >= million && price <= 5 * million;
  if (normalized.includes('3 - 5 triệu')) return price >= 3 * million && price <= 5 * million;
  if (normalized.includes('dưới 5 triệu')) return price > 0 && price < 5 * million;
  if (normalized.includes('5 - 10 triệu')) return price >= 5 * million && price <= 10 * million;
  if (normalized.includes('10 - 15 triệu')) return price >= 10 * million && price <= 15 * million;
  if (normalized.includes('10 - 20 triệu')) return price >= 10 * million && price <= 20 * million;
  if (normalized.includes('15 - 25 triệu')) return price >= 15 * million && price <= 25 * million;
  if (normalized.includes('20 - 30 triệu')) return price >= 20 * million && price <= 30 * million;
  if (normalized.includes('25 - 35 triệu')) return price >= 25 * million && price <= 35 * million;
  if (normalized.includes('trên 500 nghìn')) return price > 500_000;
  if (normalized.includes('trên 1.5 triệu')) return price > 1_500_000;
  if (normalized.includes('trên 3 triệu')) return price > 3 * million;
  if (normalized.includes('trên 5 triệu')) return price > 5 * million;
  if (normalized.includes('trên 10 triệu')) return price > 10 * million;
  if (normalized.includes('trên 20 triệu')) return price > 20 * million;
  if (normalized.includes('trên 25 triệu')) return price > 25 * million;
  if (normalized.includes('trên 30 triệu')) return price > 30 * million;
  if (normalized.includes('trên 35 triệu')) return price > 35 * million;

  return true;
}

function matchesType(product, label) {
  const lookup = getLookup(product);
  const normalized = normalizeValue(label);
  const matcher = TYPE_MATCHERS[normalized];

  if (matcher) {
    return matcher(lookup, product);
  }

  return lookup.includes(normalized);
}

function sortProducts(products, option) {
  const normalized = normalizeValue(option);
  const sortedProducts = [...products];

  if (normalized === 'tên a-z') {
    return sortedProducts.sort((left, right) => left.name.localeCompare(right.name, 'vi'));
  }

  if (normalized === 'tên z-a') {
    return sortedProducts.sort((left, right) => right.name.localeCompare(left.name, 'vi'));
  }

  if (normalized === 'giá thấp đến cao') {
    return sortedProducts.sort((left, right) => getPriceValue(left) - getPriceValue(right));
  }

  if (normalized === 'giá cao xuống thấp') {
    return sortedProducts.sort((left, right) => getPriceValue(right) - getPriceValue(left));
  }

  if (normalized === 'hàng mới') {
    return sortedProducts.sort((left, right) => Number(right.originalPrice || 0) - Number(left.originalPrice || 0));
  }

  return sortedProducts;
}

export function CollectionCatalog({ collection, products }) {
  const [selectedFilters, setSelectedFilters] = useState({});
  const [activeSort, setActiveSort] = useState(collection.sortOptions?.[0] || 'Tên A-Z');

  const filteredProducts = useMemo(() => {
    const nextProducts = products.filter((product) => {
      return Object.entries(selectedFilters).every(([group, value]) => {
        if (!value) return true;

        if (group === 'price') {
          return matchesPriceRange(getPriceValue(product), value);
        }

        if (group === 'brand') {
          return normalizeValue(product.brand).includes(normalizeValue(value));
        }

        if (group === 'type') {
          return matchesType(product, value);
        }

        return true;
      });
    });

    return sortProducts(nextProducts, activeSort);
  }, [activeSort, products, selectedFilters]);

  const breadcrumbItems = collection.breadcrumb.map((label, index) => ({
    label,
    href: index === 0 ? '/' : undefined,
  }));

  return (
    <section className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
      <div className="space-y-4">
        <FilterSidebar filters={collection.filters} selectedFilters={selectedFilters} onChange={setSelectedFilters} />
        <div className="hidden lg:block">
          <CollectionToolbar
            sortOptions={collection.sortOptions}
            productCount={filteredProducts.length}
            activeSort={activeSort}
            onSortChange={setActiveSort}
          />
        </div>
      </div>

      <div className="space-y-6">
        <div className="lg:hidden">
          <CollectionToolbar
            sortOptions={collection.sortOptions}
            productCount={filteredProducts.length}
            activeSort={activeSort}
            onSortChange={setActiveSort}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filteredProducts.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>

        {filteredProducts.length === 0 ? (
          <div className="rounded-[1.75rem] border border-dashed border-slate-300 bg-white px-5 py-10 text-center shadow-sm">
            <div className="text-lg font-semibold text-slate-900">Chưa có sản phẩm khớp bộ lọc</div>
            <p className="mt-2 text-sm text-slate-500">Thử đổi mức giá, thương hiệu hoặc loại sản phẩm để xem thêm kết quả.</p>
          </div>
        ) : null}

        <section className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <Breadcrumbs items={breadcrumbItems} />
          <h2 className="mt-4 text-2xl font-semibold tracking-normal text-slate-950">{collection.contentTitle}</h2>
          <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">{collection.contentBody}</p>
        </section>
      </div>
    </section>
  );
}
