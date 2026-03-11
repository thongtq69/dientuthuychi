import Image from 'next/image';
import Link from 'next/link';

export function ProductCard({ product }) {
  return (
    <Link href={`/san-pham/${product.slug}`} className="group block h-full">
      <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:border-slate-300 hover:shadow-lg">
        <div className="relative aspect-square overflow-hidden border-b border-slate-100 bg-white">
          {product.badge ? (
            <div className="absolute left-2 top-2 z-10 rounded-md bg-[#1b66d2] px-2 py-1 text-[10px] font-semibold text-white">
              {product.badge}
            </div>
          ) : null}
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 45vw, (max-width: 1200px) 25vw, 18vw"
            className="object-contain p-3 transition duration-300 group-hover:scale-105"
          />
        </div>
        <div className="flex flex-1 flex-col space-y-2 p-3">
          <h3 className="line-clamp-2 min-h-[2.75rem] text-[13px] font-medium leading-5 text-slate-900">{product.name}</h3>

          <div className="space-y-0.5">
            <div className="text-lg font-bold text-[#d70018]">{product.price}</div>
            {product.oldPrice ? <div className="text-xs text-slate-400 line-through">{product.oldPrice}</div> : null}
          </div>

          <div className="flex flex-wrap items-center gap-1.5 text-[10px] text-slate-500">
            <span className="rounded bg-emerald-50 px-2 py-1 font-medium text-emerald-700">{product.status}</span>
            <span className="rounded bg-slate-100 px-2 py-1 font-medium">{product.family}</span>
          </div>

          <div className="mt-auto border-t border-slate-100 pt-2 text-[13px] font-medium text-[#1b66d2]">Xem chi tiết</div>
        </div>
      </article>
    </Link>
  );
}
