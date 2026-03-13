import Image from 'next/image';
import Link from 'next/link';

export function ProductCard({ product }) {
  const formatPrice = (price) => {
    if (typeof price === 'string') return price;
    if (!price) return 'Liên hệ';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  return (
    <Link href={`/san-pham/${product.slug}`} className="group block h-full">
      <article className="flex h-full flex-col overflow-hidden rounded-2xl border-2 border-transparent bg-white transition-all hover:border-[#fdd100] hover:shadow-xl">
        <div className="relative aspect-square overflow-hidden border-b border-slate-100 bg-white">
          {/* Badge giảm giá hoặc trả góp */}
          <div className="absolute left-2 top-2 z-10 flex flex-col gap-1">
            {product.originalPrice && product.price < product.originalPrice && (
              <span className="rounded bg-[#ff3b30] px-1.5 py-0.5 text-[11px] font-bold text-white shadow-sm">
                Giảm {Math.round((1 - product.price / product.originalPrice) * 100)}%
              </span>
            )}
            <span className="rounded border border-[#ff3b30] bg-white px-1.5 py-0.5 text-[10px] font-bold text-[#ff3b30] shadow-sm">
              Trả góp 0%
            </span>
          </div>

          <Image
            src={product.image || 'https://via.placeholder.com/300x300'}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 45vw, (max-width: 1200px) 25vw, 18vw"
            className="object-contain p-4 transition duration-300 group-hover:scale-105"
          />
        </div>

        <div className="flex flex-1 flex-col space-y-2 p-3">
          {/* Tên sản phẩm */}
          <h3 className="line-clamp-2 min-h-[2.75rem] text-[14px] font-medium leading-5 text-slate-800 transition group-hover:text-[#ff3b30]">
            {product.name}
          </h3>

          {/* Giá */}
          <div className="space-y-0.5 pb-2">
            <div className="text-[17px] font-bold text-[#d70018]">{formatPrice(product.price)}</div>
            {product.originalPrice && product.price < product.originalPrice ? (
               <div className="text-[13px] text-slate-400 line-through">{formatPrice(product.originalPrice)}</div>
            ) : product.oldPrice ? (
               <div className="text-[13px] text-slate-400 line-through">{product.oldPrice}</div>
            ) : null}
          </div>

          {/* Trạng thái, hãng */}
          <div className="flex flex-wrap items-center gap-1.5 text-[10px] text-slate-500 mt-auto">
            {product.status ? (
               <span className="rounded bg-emerald-50 px-2 py-1 font-medium text-emerald-700">{product.status}</span>
            ) : (
               <span className="rounded bg-emerald-50 px-2 py-1 font-medium text-emerald-700 flex items-center gap-1">
                 <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12l5 5l10 -10"></path></svg> 
                 Sẵn hàng
               </span>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}
