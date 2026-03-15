'use client';

import { ProductCard } from '@/components/ProductCard';

export function ProductRail({ title, products = [] }) {
  if (!products.length) return null;

  return (
    <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">{title}</h2>
        <button className="text-sm font-bold text-sky-600 hover:underline">
          Xem tất cả ›
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:gap-6">
        {products.map((product, idx) => (
          <ProductCard key={`${product.slug}-${idx}`} product={product} />
        ))}
      </div>
    </section>
  );
}
