import Image from 'next/image';

export function ProductCard({ product }) {
  return (
    <article className="group h-full overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <div className="relative aspect-square overflow-hidden bg-slate-50">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 60vw, (max-width: 1200px) 33vw, 20vw"
          className="object-contain p-5 transition duration-500 group-hover:scale-105"
        />
      </div>
      <div className="space-y-3 p-5">
        <h3 className="line-clamp-2 min-h-[3.5rem] text-sm font-semibold text-slate-900 sm:text-base">{product.name}</h3>
        <div className="text-lg font-bold text-sky-600">{product.price}</div>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="rounded-full bg-emerald-50 px-2.5 py-1 font-medium text-emerald-700">Còn hàng</span>
          <span className="rounded-full bg-slate-100 px-2.5 py-1 font-medium">Mirror seed data</span>
        </div>
      </div>
    </article>
  );
}
