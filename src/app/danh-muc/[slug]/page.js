import { CollectionCatalog } from '@/components/CollectionCatalog';
import { CollectionHero } from '@/components/CollectionHero';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { ProductRail } from '@/components/ProductRail';
import { categoryRailItems, collections, featuredCategories, getCollectionBySlug, getProductsByCategory, getProductsBySlugs } from '@/data/siteData';

export function generateStaticParams() {
  const slugs = new Set(collections.map((collection) => collection.slug));

  categoryRailItems.forEach((item) => {
    const match = item.href.match(/\/danh-muc\/([^/?#]+)/);
    if (match?.[1]) slugs.add(match[1]);
  });

  featuredCategories.forEach((item) => {
    const match = item.href.match(/\/danh-muc\/([^/?#]+)/);
    if (match?.[1]) slugs.add(match[1]);
  });

  return [...slugs].map((slug) => ({ slug }));
}

export default async function CollectionPage({ params }) {
  const { slug } = await params;
  const collection = getCollectionBySlug(slug);
  const products = getProductsByCategory(slug);

  if (!collection || products.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900">
        <Header />
        <main className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
          <section className="rounded-[2rem] border border-slate-200 bg-white p-8 text-center shadow-sm">
            <h1 className="text-3xl font-semibold tracking-tight text-slate-950">Danh mục đang được cập nhật</h1>
            <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">
              Trang này chưa có dữ liệu hoàn chỉnh, nhưng điều hướng đã được giữ lại để không phát sinh lỗi 404 trong quá trình duyệt giao diện.
            </p>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  const featuredProducts = getProductsBySlugs(collection.featuredSlugs);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />
      <main className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8 lg:gap-8">
        <CollectionHero collection={collection} count={products.length} />
        <CollectionCatalog collection={collection} products={products} />

        <ProductRail title="Sản phẩm nên xem thêm" products={featuredProducts} />
      </main>
      <Footer />
    </div>
  );
}
