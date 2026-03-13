import { notFound } from 'next/navigation';

import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { ProductGallery } from '@/components/ProductGallery';
import { ProductInfoTabs } from '@/components/ProductInfoTabs';
import { ProductRail } from '@/components/ProductRail';
import { categories, getProductBySlug, getRelatedProducts, products } from '@/data/siteData';

function formatPrice(price) {
  if (typeof price === 'string') return price;
  if (!price) return 'Liên hệ';

  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
}

function getCategoryHref(category) {
  if (!category) return undefined;

  const matchedCategory = categories.find((item) => item.title === category || item.tagName === category);

  return matchedCategory ? `/danh-muc/${matchedCategory.tagName}` : undefined;
}

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export default async function ProductDetailPage({ params }) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) notFound();

  const categoryHref = getCategoryHref(product.category);
  const breadcrumbSource = Array.isArray(product.breadcrumbs)
    ? product.breadcrumbs
    : ['Trang chủ', product.category || 'Sản phẩm'];
  const detailProduct = {
    ...product,
    badge: product.badge || product.labels?.[0] || product.brand || 'Sản phẩm nổi bật',
    shortName: product.shortName || product.name,
    excerpt: product.excerpt || `Thông tin chi tiết và giá bán mới nhất của ${product.name} tại Thuỷ Chi.`,
    oldPrice: product.oldPrice || (product.originalPrice ? formatPrice(product.originalPrice) : null),
    price: formatPrice(product.price),
    status: product.status || 'Sẵn hàng',
    family: product.family || product.brand || product.category || 'Thuỷ Chi',
    gallery: Array.isArray(product.gallery) && product.gallery.length ? product.gallery : [product.image].filter(Boolean),
    variants: Array.isArray(product.variants) && product.variants.length
      ? product.variants
      : [{ label: product.name, price: formatPrice(product.price), href: '#' }],
    colors: Array.isArray(product.colors) && product.colors.length ? product.colors : ['Liên hệ cửa hàng'],
    highlights: Array.isArray(product.highlights) && product.highlights.length
      ? product.highlights
      : [
          product.labels?.[0] || 'Mới nguyên seal',
          product.brand || 'Hàng chính hãng',
          'Hỗ trợ giao hàng tận nơi',
        ],
    description: Array.isArray(product.description) && product.description.length
      ? product.description
      : [
          `${product.name} hiện có sẵn tại Thuỷ Chi với mức giá minh bạch, phù hợp nhu cầu mua mới hoặc thay thế nhanh.`,
          'Liên hệ cửa hàng để được tư vấn tình trạng hàng, phiên bản phù hợp và chương trình ưu đãi hiện tại.',
        ],
    specs: Array.isArray(product.specs) && product.specs.length
      ? product.specs
      : [
          ['Danh mục', product.category || 'Đang cập nhật'],
          ['Thương hiệu', product.brand || 'Đang cập nhật'],
          ['Tình trạng', product.labels?.join(', ') || 'Đang cập nhật'],
          ['Mã sản phẩm', product.id || 'Đang cập nhật'],
        ],
  };
  const relatedProducts = getRelatedProducts(product, 4);
  const breadcrumbItems = [...breadcrumbSource, detailProduct.shortName].map((label, index) => ({
    label,
    href: index === 0 ? '/' : index === 1 ? categoryHref : undefined,
  }));

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />
      <main className="mx-auto flex max-w-7xl flex-col gap-5 px-3 py-4 sm:px-6 sm:py-6 lg:px-8 lg:gap-8">
        <section className="rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm sm:rounded-[2rem] sm:p-6 lg:p-8">
          <Breadcrumbs items={breadcrumbItems} />

          <div className="mt-5 grid gap-6 lg:mt-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-start lg:gap-8">
            <ProductGallery images={detailProduct.gallery} alt={detailProduct.name} />

            <div className="space-y-5">
              <div>
                <div className="inline-flex max-w-full rounded-full bg-slate-950 px-3 py-1 text-xs font-semibold text-white">{detailProduct.badge}</div>
                <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">{detailProduct.name}</h1>
                <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">{detailProduct.excerpt}</p>
              </div>

              <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4 sm:rounded-[1.75rem] sm:p-5">
                <div className="flex flex-wrap items-end gap-x-4 gap-y-2">
                  <div className="text-3xl font-bold text-sky-600">{detailProduct.price}</div>
                  {detailProduct.oldPrice ? <div className="text-base text-slate-400 line-through">{detailProduct.oldPrice}</div> : null}
                </div>
                <div className="mt-3 flex flex-wrap gap-2 text-sm">
                  <span className="rounded-full bg-emerald-50 px-3 py-2 font-semibold text-emerald-700">{detailProduct.status}</span>
                  <span className="rounded-full bg-white px-3 py-2 font-medium text-slate-600">{detailProduct.family}</span>
                  <span className="rounded-full bg-white px-3 py-2 font-medium text-slate-600">Giao hàng tận nơi</span>
                </div>
              </div>

              <div className="rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm sm:rounded-[1.75rem] sm:p-5">
                <div className="text-sm font-semibold text-slate-900">Phiên bản</div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {detailProduct.variants.map((variant, index) => (
                    variant.href && variant.href !== '#' ? (
                      <a
                        key={`${variant.label}-${variant.price}`}
                        href={variant.href}
                        className={`w-full min-w-0 rounded-2xl border px-4 py-3 text-sm transition sm:w-auto ${
                          index === 0 ? 'border-slate-950 bg-slate-950 text-white' : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <div className="break-words font-semibold">{variant.label}</div>
                        <div className="mt-1 text-xs opacity-80">{variant.price}</div>
                      </a>
                    ) : (
                      <div
                        key={`${variant.label}-${variant.price}`}
                        className={`w-full min-w-0 rounded-2xl border px-4 py-3 text-sm sm:w-auto ${
                          index === 0 ? 'border-slate-950 bg-slate-950 text-white' : 'border-slate-200 bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div className="break-words font-semibold">{variant.label}</div>
                        <div className="mt-1 text-xs opacity-80">{variant.price}</div>
                      </div>
                    )
                  ))}
                </div>

                <div className="mt-5 text-sm font-semibold text-slate-900">Màu sắc</div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {detailProduct.colors.map((color, index) => (
                    <button
                      key={color}
                      type="button"
                      className={`rounded-full border px-4 py-2 text-sm ${
                        index === 0 ? 'border-sky-500 bg-sky-50 text-sky-700' : 'border-slate-200 bg-white text-slate-600'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <button type="button" className="inline-flex items-center justify-center rounded-full bg-sky-500 px-6 py-4 text-sm font-semibold text-white shadow-lg transition hover:bg-sky-400">
                  Mua ngay
                </button>
                <button type="button" className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-4 text-sm font-semibold text-slate-900 transition hover:bg-slate-50">
                  Tư vấn nhanh
                </button>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                {detailProduct.highlights.map((item) => (
                  <div key={item} className="rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm font-medium text-slate-700 shadow-sm">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <ProductInfoTabs product={detailProduct} />
        <ProductRail title="Sản phẩm liên quan" products={relatedProducts} />
      </main>
      <Footer />
    </div>
  );
}
