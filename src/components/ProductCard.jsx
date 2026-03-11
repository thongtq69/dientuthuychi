import Image from 'next/image';
import Link from 'next/link';

export function ProductCard({ product }) {
  return (
    <Link href={`/san-pham/${product.slug}`} className="group block h-full">
      <article className="flex h-full flex-col overflow-hidden rounded-[1.4rem] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
        <div className="relative aspect-square overflow-hidden border-b border-slate-100 bg-slate-50">
          {product.badge ? (
            <div className="absolute left-3 top-3 z-10 rounded-full bg-slate-950 px-3 py-1 text-[11px] font-semibold text-white shadow-lg">
              {product.badge}
            </div>
          ) : null}
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 60vw, (max-width: 1200px) 33vw, 20vw"
            className="object-contain p-4 transition duration-500 group-hover:scale-105"
          />
        </div>
        <div className="flex flex-1 flex-col space-y-3 p-4">
          <h3 className="line-clamp-2 min-h-[3.2rem] text-sm font-semibold text-slate-900">{product.name}</h3>

          <div className="space-y-1">
            <div className="text-xl font-bold text-sky-600">{product.price}</div>
            {product.oldPrice ? <div className="text-sm text-slate-400 line-through">{product.oldPrice}</div> : null}
          </div>

          <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
            <span className="rounded-full bg-emerald-50 px-2.5 py-1 font-medium text-emerald-700">{product.status}</span>
            <span className="rounded-full bg-slate-100 px-2.5 py-1 font-medium">{product.family}</span>
          </div>

          <div className="mt-auto flex items-center justify-between gap-3 border-t border-slate-100 pt-3 text-sm font-semibold text-slate-900">
            <span>Xem chi tiết</span>
            <span aria-hidden="true">›</span>
          </div>
        </div>
      </article>
    </Link>
  );
}
