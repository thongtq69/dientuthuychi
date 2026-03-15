"use client";

import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export function ProductCard({ product }) {
   const fallbackImage = 'https://cdn.dienthoaigiakho.vn/photos/1731313707122-Samsung-Galaxy-S25-Ultra-Den.jpg';
   const initialImage = useMemo(() => product.thumbnail || product.image || product.primary_image || fallbackImage, [product]);
   const [imageSrc, setImageSrc] = useState(initialImage);
   const brandLabel = product.brand && product.brand !== 'Khác' ? product.brand : product.category;

  const formatPrice = (price) => {
    if (typeof price === 'string') return price;
    if (!price) return 'Liên hệ';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price).replace('₫', 'đ');
  };

  const discount = product.originalPrice && product.price < product.originalPrice 
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  return (
    <Link href={`/san-pham/${product.slug}`} className="group block h-full">
      <article className="flex h-full min-h-[22.5rem] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#fdd100] hover:shadow-xl">
        <div className="relative aspect-[4/3] shrink-0 overflow-hidden border-b border-slate-100 bg-gradient-to-b from-slate-50 to-white">
          <div className="absolute left-3 top-3 z-10 flex flex-wrap items-center gap-2">
            {discount > 0 && (
              <span className="rounded-full bg-red-600 px-2.5 py-1 text-[11px] font-black text-white shadow-sm">
                -{discount}%
              </span>
            )}
            {brandLabel ? (
              <span className="rounded-full border border-slate-200 bg-white/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500 backdrop-blur">
                {brandLabel}
              </span>
            ) : null}
          </div>

          <Image
            src={imageSrc}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 45vw, (max-width: 1200px) 25vw, 18vw"
            className="object-contain p-3 transition duration-500 group-hover:scale-105"
            onError={() => setImageSrc(fallbackImage)}
          />
        </div>

        <div className="flex min-h-0 flex-1 flex-col gap-3 p-4">
          <h3 className="line-clamp-3 min-h-[3.8rem] text-[15px] font-extrabold leading-[1.28] text-slate-900 transition-colors group-hover:text-red-600">
            {product.name}
          </h3>

          <div className="flex min-h-[3.9rem] flex-col justify-start gap-1">
            <div className="text-[15px] font-semibold uppercase tracking-[0.08em] text-slate-400">
              Giá bán
            </div>
            <div className="text-[20px] font-black leading-none text-red-600">{formatPrice(product.price)}</div>
            {discount > 0 && (
               <div className="text-[13px] font-semibold text-slate-400 line-through">{formatPrice(product.originalPrice)}</div>
            )}
          </div>

          <div className="mt-auto flex items-center justify-between gap-3 border-t border-slate-100 pt-3">
             <div className="flex items-center gap-2">
               <div className="flex text-[10px] text-amber-400">★★★★★</div>
               <span className="text-[11px] font-semibold text-slate-400">100+ đã bán</span>
             </div>
             <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700">
               {product.status || 'Sẵn hàng'}
             </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
