import { notFound } from 'next/navigation';

import { Breadcrumbs } from '@/components/Breadcrumbs';
import { CollectionHero } from '@/components/CollectionHero';
import { CollectionToolbar } from '@/components/CollectionToolbar';
import { FilterSidebar } from '@/components/FilterSidebar';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { ProductCard } from '@/components/ProductCard';
import { ProductRail } from '@/components/ProductRail';
import { getCollectionBySlug, getProductsByCategory, getProductsBySlugs } from '@/data/siteData';

export function generateStaticParams() {
  return ['dien-thoai', 'phu-kien', 'linh-kien'].map((slug) => ({ slug }));
}

export default async function CollectionPage({ params }) {
  const { slug } = await params;
  const collection = getCollectionBySlug(slug);

  if (!collection) notFound();

  const products = getProductsByCategory(slug);
  const featuredProducts = getProductsBySlugs(collection.featuredSlugs);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />
      <main className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8 lg:gap-8">
        <CollectionHero collection={collection} count={products.length} />

        <div className="lg:hidden">
          <CollectionToolbar sortOptions={collection.sortOptions} productCount={products.length} />
        </div>

        <section className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
          <div className="space-y-4">
            <FilterSidebar filters={collection.filters} />
            <div className="hidden lg:block">
              <CollectionToolbar sortOptions={collection.sortOptions} productCount={products.length} />
            </div>
          </div>

          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {products.map((product) => (
                <ProductCard key={product.slug} product={product} />
              ))}
            </div>

            <section className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <Breadcrumbs items={collection.breadcrumb.map((label, index) => ({ label, href: index === 0 ? '/' : undefined }))} />
              <h2 className="mt-4 text-2xl font-semibold tracking-tight text-slate-950">{collection.contentTitle}</h2>
              <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">{collection.contentBody}</p>
            </section>
          </div>
        </section>

        <ProductRail title="Sản phẩm nên xem thêm" products={featuredProducts} />
      </main>
      <Footer />
    </div>
  );
}
