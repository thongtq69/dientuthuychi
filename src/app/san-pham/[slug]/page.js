import { notFound } from 'next/navigation';

import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { ProductGallery } from '@/components/ProductGallery';
import { ProductInfoTabs } from '@/components/ProductInfoTabs';
import { ProductRail } from '@/components/ProductRail';
import { getProductBySlug, getRelatedProducts, products } from '@/data/siteData';

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export default async function ProductDetailPage({ params }) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) notFound();

  const relatedProducts = getRelatedProducts(product, 4);
  const breadcrumbItems = [...product.breadcrumbs, product.shortName].map((label, index) => ({
    label,
    href: index === 0 ? '/' : index === 1 ? `/danh-muc/${product.category}` : undefined,
  }));

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />
      <main className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8 lg:gap-8">
        <section className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-6 lg:p-8">
          <Breadcrumbs items={breadcrumbItems} />

          <div className="mt-6 grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
            <ProductGallery images={product.gallery} alt={product.name} />

            <div className="space-y-5">
              <div>
                <div className="inline-flex rounded-full bg-slate-950 px-3 py-1 text-xs font-semibold text-white">{product.badge}</div>
                <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">{product.name}</h1>
                <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">{product.excerpt}</p>
              </div>

              <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5">
                <div className="flex flex-wrap items-end gap-x-4 gap-y-2">
                  <div className="text-3xl font-bold text-sky-600">{product.price}</div>
                  {product.oldPrice ? <div className="text-base text-slate-400 line-through">{product.oldPrice}</div> : null}
                </div>
                <div className="mt-3 flex flex-wrap gap-2 text-sm">
                  <span className="rounded-full bg-emerald-50 px-3 py-2 font-semibold text-emerald-700">{product.status}</span>
                  <span className="rounded-full bg-white px-3 py-2 font-medium text-slate-600">{product.family}</span>
                  <span className="rounded-full bg-white px-3 py-2 font-medium text-slate-600">Giao hàng tận nơi</span>
                </div>
              </div>

              <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
                <div className="text-sm font-semibold text-slate-900">Phiên bản</div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {product.variants.map((variant, index) => (
                    variant.href && variant.href !== '#' ? (
                      <a
                        key={`${variant.label}-${variant.price}`}
                        href={variant.href}
                        className={`rounded-2xl border px-4 py-3 text-sm transition ${
                          index === 0 ? 'border-slate-950 bg-slate-950 text-white' : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <div className="font-semibold">{variant.label}</div>
                        <div className="mt-1 text-xs opacity-80">{variant.price}</div>
                      </a>
                    ) : (
                      <div
                        key={`${variant.label}-${variant.price}`}
                        className={`rounded-2xl border px-4 py-3 text-sm ${
                          index === 0 ? 'border-slate-950 bg-slate-950 text-white' : 'border-slate-200 bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div className="font-semibold">{variant.label}</div>
                        <div className="mt-1 text-xs opacity-80">{variant.price}</div>
                      </div>
                    )
                  ))}
                </div>

                <div className="mt-5 text-sm font-semibold text-slate-900">Màu sắc</div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {product.colors.map((color, index) => (
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
                {product.highlights.map((item) => (
                  <div key={item} className="rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm font-medium text-slate-700 shadow-sm">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <ProductInfoTabs product={product} />
        <ProductRail title="Sản phẩm liên quan" products={relatedProducts} />
      </main>
      <Footer />
    </div>
  );
}
