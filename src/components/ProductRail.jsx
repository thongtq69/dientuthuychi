import { ProductCard } from '@/components/ProductCard';

export function ProductRail({ title, products = [] }) {
  if (!products.length) return null;

  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-600">Gợi ý thêm</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">{title}</h2>
        </div>
        <span className="text-sm font-semibold text-slate-900">
          Xem thêm →
        </span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>
    </section>
  );
}
